import "server-only";

import { Prisma } from "@prisma/client";
import fs from "fs";
import path from "path";
import { z } from "zod";
import { TrpcContext, createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { generateAddress, serverConfigToNativeWireguard } from "~/server/utils/common";
import { execShellCommand } from "~/server/utils/execShellCommand";
import { emptyToNull } from "~/utils";

export const siteRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        id: z.number(),
        listenPort: z.number().min(1024).max(65535).optional(),
        private_key: z.string().optional(),
        postUp: z.string().optional(),
        postDown: z.string().optional(),

        endpointAddress: z.string().ip().or(z.string().url()),
        localAddresses: z.string().optional(),
        dns: emptyToNull(z.string().ip().optional()),
        dns_pihole: emptyToNull(z.string().ip().optional()),

        config_path: z.string().optional(),
        markAsDefault: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const private_key = input.private_key ?? (await execShellCommand("wg genkey"));
      const public_key = await execShellCommand(`echo "${private_key}" | wg pubkey`);

      const createdSite = await ctx.db.$transaction([
        ctx.db.site.create({
          data: {
            id: input.id,
            name: input.name,
            endpointAddress: input.endpointAddress,
            DNS: input.dns,
            PiholeDNS: input.dns_pihole,
            ConfigPath: input.config_path,
            PrivateKey: private_key,
            PublicKey: public_key,
            localAddresses:
              input.localAddresses
                ?.split(",")
                .map((v) => v.trim())
                .join(", ") ?? "",
            listenPort: input.listenPort,
            postUp: input.postUp,
            postDown: input.postDown,
          },
        }),
      ]);

      if (input.markAsDefault) {
        await ctx.db.$transaction([
          ctx.db.user.update({
            where: { id: ctx.session.user.id },
            data: { defaultSiteId: createdSite[0].id },
          }),
        ]);
      }

      return createdSite[0];
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
        assignedNetwork: generateAddress(wg_network?.value ?? "", site.id, 0, "24"),
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
      const { site, config } = await getSiteConfig(ctx, input);
      const defaultSiteId = await getDefaultSiteId(ctx);

      return { site: { ...site, isDefault: site.id === defaultSiteId }, config: config };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),

        name: z.string().optional(),
        listenPort: z.number().min(1024).max(65535).optional(),
        private_key: z.string().optional(),
        public_key: z.string().optional(),
        postUp: z.string().optional(),
        postDown: z.string().optional(),

        endpointAddress: z.string().ip().or(z.string().url()).optional(),
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
        PiholeDNS: input.dns_pihole,
        ConfigPath: input.config_path,
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
        data.PrivateKey = private_key;
        data.PublicKey = await execShellCommand(`echo "${private_key}" | wg pubkey`);
      } else if (public_key) {
        data.PrivateKey = "";
        data.PublicKey = public_key;
      }

      return await ctx.db.site.update({
        where: { id },
        data,
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
      return await ctx.db.site.delete({
        where: { id: input.id },
      });
    }),

  writeSiteConfigToDisk: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { site, config } = await getSiteConfig(ctx, input);

      const configDir = path.dirname(site.ConfigPath);
      await fs.promises.mkdir(configDir, { recursive: true });

      //check if contents of config file are the same as the new config
      const oldConfig = fs.existsSync(site.ConfigPath)
        ? await fs.promises.readFile(site.ConfigPath, "utf8")
        : null;

      if (oldConfig === config) {
        return "no_changes";
      }

      // Backup old config if exists
      if (oldConfig) {
        await fs.promises.copyFile(site.ConfigPath, `${site.ConfigPath}.bak`);
      }

      // write new config with correct permissions
      await fs.promises.writeFile(site.ConfigPath, config, { encoding: "utf8", mode: 0o600 });

      return "written";
    }),
});

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

  const clients = await ctx.db.client.findMany({ where: { enabled: true } });
  const config = serverConfigToNativeWireguard(settings, site, otherSites, clients);
  return { site, config };
}
