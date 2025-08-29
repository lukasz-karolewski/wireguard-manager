import "server-only";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { z } from "zod";

import type { Prisma } from "~/generated/prisma/client";
import { createTRPCRouter, protectedProcedure, type TrpcContext } from "~/server/api/trpc";
import { compute_hash, generateCIDR, generateWgServerConfig } from "~/server/utils/common";
import { execShellCommand } from "~/server/utils/execShellCommand";
import { ActionType } from "~/server/utils/types";
import { emptyToNull } from "~/utils";

export const siteRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        config_path: z.string().optional(),
        dns: emptyToNull(z.union([z.ipv4().optional(), z.ipv6().optional()])),
        dns_pihole: emptyToNull(z.union([z.ipv4().optional(), z.ipv6().optional()])),
        endpointAddress: z.union([z.ipv4(), z.ipv6()]).or(z.string()),
        hostname: emptyToNull(z.string().optional()),
        id: z.number(),
        listenPort: z.number().min(1024).max(65_535).optional(),
        localAddresses: z.string().optional(),

        markAsDefault: z.boolean().optional(),
        name: z.string(),
        postDown: z.string().optional(),
        postUp: z.string().optional(),

        private_key: emptyToNull(z.string().length(44).optional()),
        public_key: emptyToNull(z.string().length(44).optional()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let private_key: null | string = null;
      let public_key = "";

      if (input.private_key) {
        private_key = input.private_key;
        public_key = await execShellCommand(`echo "${private_key}" | wg pubkey`);
      } else if (input.public_key) {
        public_key = input.public_key;
      } else {
        private_key = await execShellCommand("wg genkey");
        public_key = await execShellCommand(`echo "${private_key}" | wg pubkey`);
      }

      return ctx.db.$transaction(async (tx) => {
        const createdSite = await tx.site.create({
          data: {
            configPath: input.config_path,
            DNS: input.dns,
            endpointAddress: input.endpointAddress,
            hostname: input.hostname,
            id: input.id,
            listenPort: input.listenPort,
            localAddresses:
              input.localAddresses
                ?.split(",")
                .map((v) => v.trim())
                .join(", ") ?? "",
            name: input.name,
            piholeDNS: input.dns_pihole,
            postDown: input.postDown,
            postUp: input.postUp,
            privateKey: private_key,
            publicKey: public_key,
          },
        });

        if (input.markAsDefault) {
          tx.user
            .update({
              data: { defaultSiteId: createdSite.id },
              where: { id: ctx.session.user.id },
            })
            .catch((error: unknown) => {
              console.error("Failed to set site as default", error);
            });
        }

        tx.auditLog
          .create({
            data: {
              actionType: ActionType.CREATE,
              changedModel: "site",
              changedModelId: createdSite.id,
              createdById: ctx.session.user.id!,
              data: JSON.stringify({
                site: createdSite,
              }),
            },
          })
          .catch((error: unknown) => {
            console.error("Failed to set site as default", error);
          });

        return createdSite;
      });
    }),

  get: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { config, hash, site } = await getSiteConfig(ctx, input);
      const defaultSiteId = await getDefaultSiteId(ctx);

      const currentConfig = await getConfigFromDisk(site.configPath);
      const configChanged = currentConfig ? hash !== compute_hash(currentConfig) : true;

      return {
        config: config,
        site: { ...site, configChanged, isDefault: site.id === defaultSiteId },
      };
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const defaultSiteId = await getDefaultSiteId(ctx);
    const sites = await ctx.db.site.findMany({ orderBy: { name: "asc" } });

    const wg_network = await ctx.db.settings.findFirst({
      where: { name: "wg_network" },
    });

    const sitesWithDefault = await Promise.all(
      sites.map(async (site) => {
        let remoteHash = site.remoteConfigHash ?? undefined;
        let remoteCheckedAt = site.remoteConfigCheckedAt ?? undefined;
        let remoteRefreshError: string | undefined;

        // Refresh remote cache if TTL expired (1h) or missing
        if (site.hostname) {
          const now = Date.now();
          const ttlMs = 60 * 60 * 1000;
          const needsRefresh = !remoteCheckedAt || now - new Date(remoteCheckedAt).getTime() > ttlMs;
          if (needsRefresh) {
            try {
              const { currentConfig, hash } = await getCurrentConfig({
                configPath: site.configPath,
                hostname: site.hostname,
              });
              const updated = await ctx.db.site.update({
                data: {
                  remoteConfig: currentConfig,
                  remoteConfigCheckedAt: new Date(),
                  remoteConfigHash: hash,
                },
                where: { id: site.id },
              });
              remoteHash = updated.remoteConfigHash ?? undefined;
              remoteCheckedAt = updated.remoteConfigCheckedAt ?? undefined;
            } catch (error) {
              // capture error for UI and continue
              remoteRefreshError = error instanceof Error ? error.message : "Unknown error";
            }
          }
        }

        let needsUpdate: boolean | undefined;
        if (site.hostname) {
          const { hash: generatedHash } = await getSiteConfig(ctx, { id: site.id });
          needsUpdate = remoteHash ? generatedHash !== remoteHash : undefined;
        }
        return {
          ...site,
          assignedNetwork: generateCIDR(wg_network?.value ?? "", site.id, 0, "24"),
          isDefault: site.id === defaultSiteId,
          needsUpdate,
          remoteConfigCheckedAt: remoteCheckedAt,
          remoteConfigHash: remoteHash,
          remoteRefreshError,
        };
      }),
    );

    return sitesWithDefault;
  }),

  getVersions: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const site = await ctx.db.site.findFirstOrThrow({
        where: { id: input.id },
      });

      const versions = await ctx.db.release.findMany({
        include: { createdBy: true },
        orderBy: { createdAt: "desc" },
        where: { SiteId: input.id },
      });

      return { site, versions };
    }),

  needsWrite: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { config, hash: newHash, site } = await getSiteConfig(ctx, input);
      const { currentConfig, errorMessage, hash: currentHash } = await tryGetCurrentConfig(site);

      return { config, currentConfig, errorMessage, needsWrite: newHash !== currentHash };
    }),

  // Refresh remote config cache for a site (TTL 1h unless force)
  refreshRemoteConfig: protectedProcedure
    .input(z.object({ force: z.boolean().optional(), id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const site = await ctx.db.site.findFirstOrThrow({ where: { id: input.id } });
      if (!site.hostname) {
        return { reason: "No hostname configured", skipped: true };
      }

      const now = new Date();
      const oneHourMs = 60 * 60 * 1000;
      if (
        !input.force &&
        site.remoteConfigCheckedAt &&
        now.getTime() - site.remoteConfigCheckedAt.getTime() < oneHourMs
      ) {
        return {
          reason: "TTL not expired",
          remoteConfigCheckedAt: site.remoteConfigCheckedAt,
          remoteConfigHash: site.remoteConfigHash ?? undefined,
          skipped: true,
        };
      }

      try {
        const { currentConfig, hash } = await getCurrentConfig({
          configPath: site.configPath,
          hostname: site.hostname,
        });

        const updated = await ctx.db.site.update({
          data: {
            remoteConfig: currentConfig,
            remoteConfigCheckedAt: new Date(),
            remoteConfigHash: hash,
          },
          where: { id: site.id },
        });

        // Also compute current generated config hash for comparison
        const { hash: generatedHash } = await getSiteConfig(ctx, { id: site.id });
        const needsUpdate = generatedHash !== hash;

        return {
          needsUpdate,
          remoteConfigCheckedAt: updated.remoteConfigCheckedAt,
          remoteConfigHash: updated.remoteConfigHash ?? undefined,
          skipped: false,
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return {
          errorMessage: message,
          skipped: false,
        };
      }
    }),

  remove: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async (tx) => {
        tx.auditLog
          .create({
            data: {
              actionType: ActionType.DELETE,
              changedModel: "site",
              changedModelId: input.id,
              createdById: ctx.session.user.id!,
              data: "",
            },
          })
          .catch((error: unknown) => {
            console.error("Failed to create audit log when removing site", error);
          });
        return await tx.site.delete({
          where: { id: input.id },
        });
      });
    }),

  setAsDefault: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.user.update({
        data: { defaultSiteId: input.id },
        where: { id: ctx.session.user.id },
      });
    }),

  testSshConnection: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const site = await ctx.db.site.findFirstOrThrow({
        where: { id: input.id },
      });

      if (!site.hostname) {
        throw new Error("No hostname configured for this site");
      }

      try {
        // Test SSH connection with a simple command
        const result = await execShellCommand(
          `ssh -o ConnectTimeout=10 -o BatchMode=yes ${site.hostname} 'echo "SSH connection successful"'`,
        );
        return { message: result.trim(), success: true };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        return { message: `SSH connection failed: ${errorMessage}`, success: false };
      }
    }),
  update: protectedProcedure
    .input(
      z.object({
        config_path: z.string().optional(),

        dns: emptyToNull(z.union([z.ipv4().optional(), z.ipv6().optional()])),
        dns_pihole: emptyToNull(z.union([z.ipv4().optional(), z.ipv6().optional()])),
        endpointAddress: z.union([z.ipv4(), z.ipv6()]).or(z.string()).optional(),
        hostname: emptyToNull(z.string().optional()),
        id: z.number(),
        listenPort: z.number().min(1024).max(65_535).optional(),
        localAddresses: z.string().optional(),

        name: z.string().optional(),
        postDown: z.string().optional(),
        postUp: z.string().optional(),
        private_key: emptyToNull(z.string().length(44).optional()),

        public_key: emptyToNull(z.string().length(44).optional()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, private_key, public_key } = input;

      const data: Prisma.SiteUpdateInput = {
        configPath: input.config_path,
        DNS: input.dns,
        endpointAddress: input.endpointAddress,
        hostname: input.hostname,
        listenPort: input.listenPort,
        localAddresses:
          input.localAddresses
            ?.split(",")
            .map((v) => v.trim())
            .join(", ") ?? "",
        name: input.name,
        piholeDNS: input.dns_pihole,
        postDown: input.postDown,
        postUp: input.postUp,
      };

      if (private_key) {
        data.privateKey = private_key;
        data.publicKey = await execShellCommand(`echo "${private_key}" | wg pubkey`);
      } else if (public_key) {
        data.privateKey = "";
        data.publicKey = public_key;
      } else {
        data.privateKey = await execShellCommand("wg genkey");
        data.publicKey = await execShellCommand(`echo "${data.privateKey}" | wg pubkey`);
      }

      return ctx.db.$transaction(async (tx) => {
        const updatedSite = await tx.site.update({
          data,
          where: { id },
        });

        tx.auditLog
          .create({
            data: {
              actionType: ActionType.UPDATE,
              changedModel: "site",
              changedModelId: updatedSite.id,
              createdById: ctx.session.user.id!,
              data: JSON.stringify({
                site: updatedSite,
              }),
            },
          })
          .catch((error: unknown) => {
            console.error("Failed to create audit log when settting site as default", error);
          });
        return updatedSite;
      });
    }),
  writeSiteConfigToDisk: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { config, hash: newHash, site } = await getSiteConfig(ctx, input);

      await (site.hostname
        ? writeRemoteConfig(site.hostname, site.configPath, config)
        : writeLocalConfig(site.configPath, config));

      // Only create release record after successful file write
      await ctx.db.release.create({
        data: {
          createdById: ctx.session.user.id!,
          data: config,
          hash: newHash,
          pathWritten: [site.hostname ?? "disk", site.configPath].join(":"),
          SiteId: site.id,
        },
      });

      return "written";
    }),
});

async function getConfigFromDisk(configPath: string) {
  return fs.existsSync(configPath) ? await fs.promises.readFile(configPath, "utf8") : "";
}

/**
 * Reads the current configuration from either a remote host via SSH or from local disk.
 *
 * @param site - The site object containing hostname and configPath
 * @returns The current configuration as a string, or null if not found or on error
 */
async function getCurrentConfig(site: { configPath: string; hostname: null | string }) {
  const raw = await (site.hostname
    ? execShellCommand(`ssh -o ConnectTimeout=10 ${site.hostname} 'sudo cat ${site.configPath}'`)
    : getConfigFromDisk(site.configPath));
  const currentConfig = raw.trim();
  const hash = compute_hash(currentConfig);
  return { currentConfig, hash };
}

async function getDefaultSiteId(ctx: TrpcContext) {
  const user = await ctx.db.user.findFirst({
    select: { defaultSiteId: true },
    where: { id: ctx.session?.user?.id },
  });

  return user?.defaultSiteId;
}

/**
 * Retrieves the configuration for a specific site, including settings, other sites, and clients.
 *
 * @param ctx - The TRPC context containing the database connection.
 * @param input - An object containing the site ID.
 * @returns An object containing the generated WireGuard server configuration, its hash, and the site details.
 *
 * @throws Will throw an error if the site with the specified ID is not found.
 */
async function getSiteConfig(ctx: TrpcContext, input: { id: number }) {
  const settings = await ctx.db.settings.findMany();

  const site = await ctx.db.site.findFirstOrThrow({
    include: {
      clients: true,
    },
    where: { id: input.id },
  });

  const otherSites = await ctx.db.site.findMany({
    where: {
      id: {
        not: input.id,
      },
    },
  });

  const config = generateWgServerConfig(settings, site, otherSites, site.clients);
  const hash = compute_hash(config);

  return { config, hash, site };
}

/** Returns current config and captures any error message instead of throwing. */
async function tryGetCurrentConfig(site: { configPath: string; hostname: null | string }) {
  try {
    const { currentConfig, hash } = await getCurrentConfig(site);
    return { currentConfig, errorMessage: undefined as string | undefined, hash };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    // On error, surface the message and return empty config/hash
    const currentConfig = "";
    const hash = compute_hash(currentConfig);
    return { currentConfig, errorMessage: message, hash };
  }
}

async function writeLocalConfig(configPath: string, config: string) {
  if (fs.existsSync(configPath)) {
    await fs.promises.copyFile(configPath, `${configPath}.bak`);
  }

  // write new config to disk with correct permissions
  await fs.promises.writeFile(configPath, config, { encoding: "utf8", mode: 0o600 });
}

async function writeRemoteConfig(hostname: string, configPath: string, config: string) {
  // Create a unique temporary directory for this operation
  const tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), "wg-config-"));
  const tempFile = path.join(tempDir, "config.conf");

  try {
    // Write config to local temp file
    await fs.promises.writeFile(tempFile, config, { encoding: "utf8", mode: 0o600 });

    // Use a single SSH command to:
    // 1. Backup existing config (if it exists)
    // 2. Copy new config from temp file
    // 3. Set proper permissions
    // 4. Clean up temp file
    const sshScript = `
      # Backup existing config if it exists
      if [ -f "${configPath}" ]; then
        sudo cp "${configPath}" "${configPath}.bak" 2>/dev/null || true
      fi

      # Copy new config and set permissions
      sudo cp /tmp/wg-remote-config.conf "${configPath}" && \\
      sudo chmod 600 "${configPath}" && \\
      rm -f /tmp/wg-remote-config.conf
    `.trim();

    // Transfer file via SCP then execute script via SSH (two separate connections)
    await execShellCommand(
      `scp -o ConnectTimeout=10 "${tempFile}" "${hostname}:/tmp/wg-remote-config.conf" && ` +
        `ssh -o ConnectTimeout=10 "${hostname}" '${sshScript}'`,
    );
  } finally {
    // Clean up local temp file and directory
    try {
      await fs.promises.rm(tempDir, { force: true, recursive: true });
    } catch {
      // Ignore cleanup errors
    }
  }
}
