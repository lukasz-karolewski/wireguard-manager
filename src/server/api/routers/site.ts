import "server-only";

import fs from "fs";
import { z } from "zod";
import { TrpcContext, createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { generateAddress, serverConfigToNativeWireguard } from "~/server/utils/common";
import { execShellCommand } from "~/server/utils/execShellCommand";

export const siteRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        endpointAddress: z.string(),
        dns: z.string().optional(),
        dns_pihole: z.string().optional(),
        config_path: z.string().optional(),
        private_key: z.string().optional(),
        localAddresses: z.array(z.string()).optional(),
        listenPort: z.number().min(1024).max(65535).optional(),
        postUp: z.string().optional(),
        postDown: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const private_key = input.private_key ?? (await execShellCommand("wg genkey"));
      const public_key = await execShellCommand(`echo "${private_key}" | wg pubkey`);

      return await ctx.db.site.create({
        data: {
          id: input.id,
          name: input.name,
          endpointAddress: input.endpointAddress,
          DSN: input.dns,
          PiholeDNS: input.dns_pihole,
          ConfigPath: input.config_path,
          PrivateKey: private_key,
          PublicKey: public_key,
          localAddresses: input.localAddresses?.join(",") ?? "",
          listenPort: input.listenPort,
          postUp: input.postUp,
          postDown: input.postDown,
        },
      });
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findFirst({
      where: { id: ctx.session.user.id },

      select: { defaultSiteId: true },
    });
    const sites = await ctx.db.site.findMany({ orderBy: { name: "asc" } });

    const wg_network = await ctx.db.settings.findFirst({
      where: { name: "wg_network" },
    });

    const sitesWithDefault = sites.map((site) => {
      return {
        ...site,
        isDefault: site.id === user?.defaultSiteId,
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

      return { site: site, config: config };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        endpointAddress: z.string().optional(),
        dns: z.string().optional(),
        dns_pihole: z.string().optional(),
        config_path: z.string().optional(),
        private_key: z.string().optional(),
        localAddresses: z.array(z.string()).optional(),
        listenPort: z.number().min(1024).max(65535).optional(),
        postUp: z.string().optional(),
        postDown: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, localAddresses, ...data } = input;

      return await ctx.db.site.update({
        where: { id: input.id },
        data: { ...data, localAddresses: localAddresses?.join(",") ?? "" },
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

      await fs.promises.mkdir(site.ConfigPath, { recursive: true });

      //check if contents of config file are the same as the new config
      const oldConfig = fs.existsSync(`${site.ConfigPath}/wg0.conf`)
        ? await fs.promises.readFile(`${site.ConfigPath}/wg0.conf`, "utf8")
        : null;

      if (oldConfig === config) {
        return "no_changes";
      }

      // Backup old config if exists
      if (oldConfig) {
        await fs.promises.copyFile(
          `${site.ConfigPath}/wg0.conf`,
          `${site.ConfigPath}/wg0.conf.bak`,
        );
      }

      // write new config with correct permissions
      await fs.promises.writeFile(site.ConfigPath, config, { encoding: "utf8", mode: 0o600 });

      return "written";
    }),
});

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
