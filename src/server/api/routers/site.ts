import "server-only";
import { Prisma } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";
import { unknown, z } from "zod";

import { createTRPCRouter, protectedProcedure, TrpcContext } from "~/server/api/trpc";
import { compute_hash, generateCIDR, generateWgServerConfig } from "~/server/utils/common";
import { execShellCommand } from "~/server/utils/execShellCommand";
import { ActionType } from "~/server/utils/types";
import { emptyToNull } from "~/utils";

export const siteRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        config_path: z.string().optional(),
        dns: emptyToNull(z.string().ip().optional()),
        dns_pihole: emptyToNull(z.string().ip().optional()),
        endpointAddress: z.string().ip().or(z.string()),
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

    const sitesWithDefault = sites.map((site) => {
      return {
        ...site,
        assignedNetwork: generateCIDR(wg_network?.value ?? "", site.id, 0, "24"),
        isDefault: site.id === defaultSiteId,
      };
    });

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

  update: protectedProcedure
    .input(
      z.object({
        config_path: z.string().optional(),

        dns: emptyToNull(z.string().ip().optional()),
        dns_pihole: emptyToNull(z.string().ip().optional()),
        endpointAddress: z.string().ip().or(z.string()).optional(),
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
      const { config, hash, site } = await getSiteConfig(ctx, input);

      const configDir = path.dirname(site.configPath);
      await fs.promises.mkdir(configDir, { recursive: true });

      //check if contents of config file are the same as the new config
      const currentConfig = await getConfigFromDisk(site.configPath);

      if (config === currentConfig) {
        return "no_changes";
      }

      // Backup old config if exists
      if (currentConfig) {
        await fs.promises.copyFile(site.configPath, `${site.configPath}.bak`);
      }

      // save new config to db for future reference
      await ctx.db.release.create({
        data: {
          createdById: ctx.session.user.id!,
          data: config,
          hash: hash,
          SiteId: site.id,
        },
      });

      // write new config to disk with correct permissions
      await fs.promises.writeFile(site.configPath, config, { encoding: "utf8", mode: 0o600 });

      return "written";
    }),
});

async function getConfigFromDisk(configPath: string) {
  return fs.existsSync(configPath) ? await fs.promises.readFile(configPath, "utf8") : null;
}

async function getDefaultSiteId(ctx: TrpcContext) {
  const user = await ctx.db.user.findFirst({
    select: { defaultSiteId: true },
    where: { id: ctx.session?.user?.id },
  });

  return user?.defaultSiteId;
}

async function getSiteConfig(ctx: TrpcContext, input: { id: number }) {
  const settings = await ctx.db.settings.findMany();

  const site = await ctx.db.site.findFirstOrThrow({
    where: { id: input.id },
  });

  const otherSites = await ctx.db.site.findMany({
    where: {
      id: {
        not: input.id,
      },
    },
  });

  const clients = await ctx.db.client.findMany({
    include: { sites: true },
    where: { enabled: true },
  });

  const config = generateWgServerConfig(settings, site, otherSites, clients);
  const hash = compute_hash(config);

  return { config, hash, site };
}
