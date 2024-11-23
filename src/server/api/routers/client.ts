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
        siteIds: z.array(z.number()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const private_key = input.private_key ?? (await execShellCommand("wg genkey"));
      const public_key = await execShellCommand(`echo "${private_key}" | wg pubkey`);

      return ctx.db.$transaction(async (tx) => {
        const siteIds =
          input.siteIds ??
          (await ctx.db.site.findMany({ select: { id: true } })).map((site) => site.id);

        const newClient = await tx.client.create({
          data: {
            name: input.name,
            email: input.email,
            privateKey: private_key,
            publicKey: public_key,
            createdById: ctx.session.user.id!,
            sites: {
              connect: siteIds.map((id) => ({ id })),
            },
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
      let client = await ctx.db.client.findFirstOrThrow({
        where: { id: input.id },
        include: {
          createdBy: true,
          sites: true,
        },
      });

      const user = await ctx.db.user.findFirst({
        where: { id: ctx.session.user.id },
        select: { defaultSiteId: true },
      });
      const settings = await ctx.db.settings.findMany();

      // Add isDefault to sites
      client.sites = client.sites.map((site) => {
        return {
          ...site,
          isDefault: site.id === user?.defaultSiteId,
        };
      });

      // return empty config if client is disabled
      if (client.enabled === false) {
        return { client, configs: [] };
      }

      const configs = client.sites.map((site) => {
        const siteConfigs = Object.entries(ClientConfigType)
          .filter(([type]) => {
            // Skip if DNS conditions are not met
            if (
              ((type === ClientConfigType.localOnlyDNS ||
                type === ClientConfigType.allTrafficDNS) &&
                !site.DNS) ||
              ((type === ClientConfigType.localOnlyPiholeDNS ||
                type === ClientConfigType.allTrafficPiholeDNS) &&
                !site.piholeDNS)
            ) {
              return false;
            }
            return true;
          })
          .map(([type, label]) => ({
            type: label,
            value: generateClientConfig(settings, site, client, type as ClientConfigType),
          }));

        return { site, configs: siteConfigs };
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
        siteIds: z.array(z.number()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, private_key } = input;

      const data: Prisma.ClientUpdateInput = {
        name: input.name,
        email: input.email,
        sites: {
          set: input.siteIds?.map((id) => ({ id })),
        },
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

  addToSite: protectedProcedure
    .input(
      z.object({
        clientId: z.number(),
        siteId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async (tx) => {
        const updatedClient = await tx.client.update({
          where: { id: input.clientId },
          data: {
            sites: {
              connect: { id: input.siteId },
            },
          },
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

  removeFromSite: protectedProcedure
    .input(
      z.object({
        clientId: z.number(),
        siteId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async (tx) => {
        const updatedClient = await tx.client.update({
          where: { id: input.clientId },
          data: {
            sites: {
              disconnect: { id: input.siteId },
            },
          },
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
});
