import { Prisma } from "@prisma/client";
import "server-only";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { generateClientConfig } from "~/server/utils/common";
import { execShellCommand } from "~/server/utils/execShellCommand";
import { ActionType, ClientConfigType } from "~/server/utils/types";
import { emptyToNull } from "~/utils";

export const clientRouter = createTRPCRouter({
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
          data: {
            sites: {
              connect: { id: input.siteId },
            },
          },
          where: { id: input.clientId },
        });

        void tx.auditLog.create({
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

  create: protectedProcedure
    .input(
      z.object({
        email: emptyToNull(z.string().email().optional()),
        name: z.string(),
        private_key: emptyToNull(z.string().length(44).optional()),
        siteIds: z.array(z.number()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const private_key = input.private_key ?? (await execShellCommand("wg genkey"));
      const public_key = await execShellCommand(`echo "${private_key}" | wg pubkey`);

      return ctx.db.$transaction(async (tx) => {
        let siteIds = input.siteIds;
        if (!siteIds) {
          const sites = await ctx.db.site.findMany({ select: { id: true } });
          siteIds = sites.map((site) => site.id);
        }

        const newClient = await tx.client.create({
          data: {
            createdById: ctx.session.user.id!,
            email: input.email,
            name: input.name,
            privateKey: private_key,
            publicKey: public_key,
            sites: {
              connect: siteIds.map((id) => ({ id })),
            },
          },
        });

        void tx.auditLog.create({
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

  disable: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.client.update({
        data: { enabled: false },
        where: { id: input.id },
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
        data: { enabled: true },
        where: { id: input.id },
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
        include: { createdBy: true },
        where: { id: input.id },
      });
      if (!client.enabled) return { client, configs: [] };

      const user = await ctx.db.user.findFirst({
        select: { defaultSiteId: true },
        where: { id: ctx.session.user.id },
      });
      const settings = await ctx.db.settings.findMany();
      const sites = await ctx.db.site.findMany();
      const sitesWithDefault = sites.map((site) => {
        return {
          ...site,
          isDefault: site.id === user?.defaultSiteId,
        };
      });

      interface Config {
        type: ClientConfigType;
        value: string;
      }
      const configs: { configs: Config[]; site: (typeof sitesWithDefault)[number] }[] = [];

      for (const site of sitesWithDefault) {
        const siteConfigs: Config[] = [];
        for (const entry of Object.entries(ClientConfigType)) {
          const [_description, type] = entry;
          // Generate site configs only if PiholeDNS is not empty
          if (
            ((type === ClientConfigType.localOnlyDNS || type === ClientConfigType.allTrafficDNS) &&
              !site.DNS) ||
            ((type === ClientConfigType.localOnlyPiholeDNS ||
              type === ClientConfigType.allTrafficPiholeDNS) &&
              !site.piholeDNS)
          ) {
            continue;
          }

          siteConfigs.push({
            type: type,
            value: generateClientConfig(settings, site, client, type as ClientConfigType),
          });
        }
        configs.push({ configs: siteConfigs, site });
      }

      return {
        ...client,
        configs,
      };
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
  remove: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async (tx) => {
        void tx.auditLog.create({
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
          data: {
            sites: {
              disconnect: { id: input.siteId },
            },
          },
          where: { id: input.clientId },
        });

        void tx.auditLog.create({
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

  update: protectedProcedure
    .input(
      z.object({
        email: emptyToNull(z.string().email().optional()),
        id: z.number(),
        name: z.string().min(2).optional(),
        private_key: emptyToNull(z.string().length(44).optional()),
        siteIds: z.array(z.number()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, private_key } = input;

      const data: Prisma.ClientUpdateInput = {
        email: input.email,
        name: input.name,
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
          data,
          where: { id },
        });

        void tx.auditLog.create({
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
