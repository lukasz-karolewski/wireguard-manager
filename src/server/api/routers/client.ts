import "server-only";

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { clientConfigToNativeWireguard } from "~/server/utils/common";
import { execShellCommand } from "~/server/utils/execShellCommand";
import { ClientConfigType } from "~/server/utils/types";

export const clientRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email().optional(),
        private_key: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const private_key = input.private_key ?? (await execShellCommand("wg genkey"));
      const public_key = await execShellCommand(`echo "${private_key}" | wg pubkey`);

      return await ctx.db.client.create({
        data: {
          name: input.name,
          email: input.email,
          PrivateKey: private_key,
          PublicKey: public_key,
          createdById: ctx.session.user.id,
        },
      });
    }),

  getAll: protectedProcedure
    .input(
      z.object({
        search: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const condition = input.search ? { where: { name: { contains: input.search } } } : undefined;

      return await ctx.db.client.findMany({
        ...condition,
        orderBy: { name: "asc" },
      });
    }),

  get: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const client = await ctx.db.client.findFirstOrThrow({
        where: { id: input.id },
        include: { createdBy: true },
      });
      if (client.enabled === false) return { client, configs: [] };

      const user = await ctx.db.user.findFirst({
        where: { id: ctx.session.user.id },
        select: { defaultSiteId: true },
      });
      const settings = await ctx.db.settings.findMany();
      const sites = await ctx.db.site.findMany();
      const sitesWithDefault = sites.map((site) => {
        return {
          ...site,
          isDefault: site.id === user?.defaultSiteId,
        };
      });

      type Config = { type: ClientConfigType; value: string };
      const configs: { site: (typeof sitesWithDefault)[number]; configs: Config[] }[] = [];

      sitesWithDefault.forEach((site) => {
        const siteConfigs: Config[] = [];
        Object.entries(ClientConfigType).forEach((entry) => {
          const [type, description] = entry;
          // Generate site configs only if PiholeDNS is not empty
          if (
            ((type === ClientConfigType.localOnlyDNS || type === ClientConfigType.allTrafficDNS) &&
              !site.DNS) ||
            ((type === ClientConfigType.localOnlyPiholeDNS ||
              type === ClientConfigType.allTrafficPiholeDNS) &&
              !site.PiholeDNS)
          ) {
            return;
          }

          siteConfigs.push({
            type: description,
            value: clientConfigToNativeWireguard(settings, site, client, type as ClientConfigType),
          });
        });
        configs.push({ site, configs: siteConfigs });
      });
      return {
        client,
        configs,
      };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        email: z.string().email().optional(),
        private_key: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return await ctx.db.client.update({
        where: { id: input.id },
        data,
      });
    }),
  disable: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.client.update({
        where: { id: input.id },
        data: { enabled: false },
      });
    }),
  enable: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.client.update({
        where: { id: input.id },
        data: { enabled: true },
      });
    }),
  remove: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.client.delete({
        where: { id: input.id },
      });
    }),
});
