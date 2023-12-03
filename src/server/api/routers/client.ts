import { Site } from "@prisma/client";
import "server-only";

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { clientConfigToNativeWireguard } from "~/server/utils/common";
import { execShellCommand } from "~/server/utils/execShellCommand";
import { ClientConfigType } from "~/server/utils/types";

export const clientRouter = createTRPCRouter({
  getAllSettings: protectedProcedure.query(async ({ ctx }) => {
    const settingsArray = await ctx.db.settings.findMany();

    const settingsDictionary = settingsArray.reduce(
      (acc, setting) => {
        acc[setting.name] = setting.value;
        return acc;
      },
      {} as Record<string, string>,
    );

    return settingsDictionary;
  }),

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
        },
      });
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.client.findMany();
  }),

  get: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const settings = await ctx.db.settings.findMany();
      const sites = await ctx.db.site.findMany();
      const client = await ctx.db.client.findFirstOrThrow({
        where: { id: input.id },
      });

      const configs: { site: Site; configs: string[] }[] = [];
      sites.forEach((site) => {
        const siteConfigs: string[] = [];
        Object.keys(ClientConfigType).forEach((type) => {
          siteConfigs.push(
            clientConfigToNativeWireguard(settings, site, client, type as ClientConfigType),
          );
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

  remove: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.client.delete({
        where: { id: input.id },
      });
    }),
});
