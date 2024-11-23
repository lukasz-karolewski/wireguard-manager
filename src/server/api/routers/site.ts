import "server-only";

import { Prisma } from "@prisma/client";
import fs from "fs";
import path from "path";
import { z } from "zod";
import { TrpcContext, createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { compute_hash, generateCIDR, generateWgServerConfig } from "~/server/utils/common";
import { execShellCommand } from "~/server/utils/execShellCommand";
import { ActionType } from "~/server/utils/types";
import { emptyToNull } from "~/utils";

export const siteRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        id: z.number(),
        listenPort: z.number().min(1024).max(65535).optional(),
        private_key: emptyToNull(z.string().length(44).optional()),
        public_key: emptyToNull(z.string().length(44).optional()),
        postUp: z.string().optional(),
        postDown: z.string().optional(),

        endpointAddress: z.string().ip().or(z.string()),
        localAddresses: z.string().optional(),
        dns: emptyToNull(z.string().ip().optional()),
        dns_pihole: emptyToNull(z.string().ip().optional()),

        config_path: z.string().optional(),
        markAsDefault: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let private_key: string | null = null;
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
            id: input.id,
            name: input.name,
            endpointAddress: input.endpointAddress,
            DNS: input.dns,
            piholeDNS: input.dns_pihole,
            configPath: input.config_path,
            privateKey: private_key,
            publicKey: public_key,
            localAddresses:
              input.localAddresses
                ?.split(",")
                .map((v) => v.trim())
                .join(", ") ?? "",
            listenPort: input.listenPort,
            postUp: input.postUp,
            postDown: input.postDown,
          },
        });

        if (input.markAsDefault) {
          tx.user.update({
            where: { id: ctx.session.user.id },
            data: { defaultSiteId: createdSite.id },
          });
        }

        tx.auditLog.create({
          data: {
            actionType: ActionType.CREATE,
            changedModel: "site",
            changedModelId: createdSite.id,
            createdById: ctx.session.user.id!,
            data: JSON.stringify({
              site: createdSite,
            }),
          },
        });

        return createdSite;
      });
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
        isDefault: site.id === defaultSiteId,
        assignedNetwork: generateCIDR(wg_network?.value ?? "", site.id, 0, "24"),
      };
    });

    return sitesWithDefault;
  }),

  get: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { site, config, hash } = await getSiteConfig(ctx, input);
      const defaultSiteId = await getDefaultSiteId(ctx);

      const currentConfig = await getConfigFromDisk(site.configPath);
      const configChanged = currentConfig ? hash !== compute_hash(currentConfig) : true;

      return {
        site: { ...site, isDefault: site.id === defaultSiteId, configChanged },
        config: config,
      };
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
        where: { SiteId: input.id },
        orderBy: { createdAt: "desc" },
        include: { createdBy: true },
      });

      return { site, versions };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),

        name: z.string().optional(),
        listenPort: z.number().min(1024).max(65535).optional(),
        private_key: emptyToNull(z.string().length(44).optional()),
        public_key: emptyToNull(z.string().length(44).optional()),
        postUp: z.string().optional(),
        postDown: z.string().optional(),

        endpointAddress: z.string().ip().or(z.string()).optional(),
        localAddresses: z.string().optional(),
        dns: emptyToNull(z.string().ip().optional()),
        dns_pihole: emptyToNull(z.string().ip().optional()),

        config_path: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, private_key, public_key } = input;

      const data: Prisma.SiteUpdateInput = {
        name: input.name,
        endpointAddress: input.endpointAddress,
        DNS: input.dns,
        piholeDNS: input.dns_pihole,
        configPath: input.config_path,
        localAddresses:
          input.localAddresses
            ?.split(",")
            .map((v) => v.trim())
            .join(", ") ?? "",
        listenPort: input.listenPort,
        postUp: input.postUp,
        postDown: input.postDown,
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
          where: { id },
          data,
        });

        tx.auditLog.create({
          data: {
            actionType: ActionType.UPDATE,
            changedModel: "site",
            changedModelId: updatedSite.id,
            createdById: ctx.session.user.id!,
            data: JSON.stringify({
              site: updatedSite,
            }),
          },
        });
        return updatedSite;
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
        where: { id: ctx.session.user.id },
        data: { defaultSiteId: input.id },
      });
    }),

  remove: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async (tx) => {
        tx.auditLog.create({
          data: {
            actionType: ActionType.DELETE,
            changedModel: "site",
            changedModelId: input.id,
            createdById: ctx.session.user.id!,
            data: "",
          },
        });
        return await tx.site.delete({
          where: { id: input.id },
        });
      });
    }),

  writeSiteConfigToDisk: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { site, config, hash } = await getSiteConfig(ctx, input);

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
          hash: hash,
          SiteId: site.id,
          data: config,
          createdById: ctx.session.user.id!,
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
    where: { id: ctx?.session?.user?.id },
    select: { defaultSiteId: true },
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
    where: { enabled: true },
    include: { sites: true },
  });

  const config = generateWgServerConfig(settings, site, otherSites, clients);
  const hash = compute_hash(config);

  return { site, config, hash };
}
