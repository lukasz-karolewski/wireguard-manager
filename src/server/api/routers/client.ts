import { Prisma } from "@prisma/client";
import "server-only";

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { generateClientConfig } from "~/server/utils/common";
import { execShellCommand } from "~/server/utils/execShellCommand";
import { ActionType, ClientConfigType } from "~/server/utils/types";
import { emptyToNull } from "~/utils";

export const clientRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        email: emptyToNull(z.string().email().optional()),
        private_key: emptyToNull(z.string().length(44).optional()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const private_key = input.private_key ?? (await execShellCommand("wg genkey"));
      const public_key = await execShellCommand(`echo "${private_key}" | wg pubkey`);

      return ctx.db.$transaction(async (tx) => {
        const newClient = await tx.client.create({
          data: {
            name: input.name,
            email: input.email,
            privateKey: private_key,
            publicKey: public_key,
            createdById: ctx.session.user.id!,
          },
        });

        tx.auditLog.create({
          data: {
            actionType: ActionType.CREATE,
            changedModel: "client",
            changedModelId: newClient.id,
            createdById: ctx.session.user.id!,
            data: JSON.stringify({
              site: newClient,
            }),
          },
        });
        return newClient;
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
              !site.piholeDNS)
          ) {
            return;
          }

          siteConfigs.push({
            type: description,
            value: generateClientConfig(settings, site, client, type as ClientConfigType),
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
        name: z.string().min(2).optional(),
        email: emptyToNull(z.string().email().optional()),
        private_key: emptyToNull(z.string().length(44).optional()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, private_key } = input;

      const data: Prisma.ClientUpdateInput = {
        name: input.name,
        email: input.email,
      };

      if (private_key) {
        data.privateKey = private_key;
        data.publicKey = await execShellCommand(`echo "${private_key}" | wg pubkey`);
      }

      return ctx.db.$transaction(async (tx) => {
        const updatedClient = await tx.client.update({
          where: { id },
          data,
        });

        tx.auditLog.create({
          data: {
            actionType: ActionType.UPDATE,
            changedModel: "client",
            changedModelId: updatedClient.id,
            createdById: ctx.session.user.id!,
            data: JSON.stringify({
              site: updatedClient,
            }),
          },
        });

        return updatedClient;
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
      return ctx.db.$transaction(async (tx) => {
        tx.auditLog.create({
          data: {
            actionType: ActionType.DELETE,
            changedModel: "client",
            changedModelId: input.id,
            createdById: ctx.session.user.id!,
            data: "",
          },
        });

        return await tx.client.delete({
          where: { id: input.id },
        });
      });
    }),
});
