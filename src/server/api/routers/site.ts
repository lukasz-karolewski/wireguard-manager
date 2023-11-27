import { Prisma } from "@prisma/client";
import "server-only";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { execShellCommand } from "~/server/utils/execShellCommand";

export const siteRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        endpointAddress: z.string(),
        dns: z.string(),
        dns_pihole: z.string(),
        config_path: z.string().optional(),
        private_key: z.string().optional(),
        localAddresses: z.array(z.string()).optional(),
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
        },
      });
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.site.findMany();
  }),

  get: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.site.findUnique({
        where: { id: input.id },
      });
    }),

  getConfig: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const settings = await ctx.db.settings.findMany();

      const site = await ctx.db.site.findUnique({
        where: { id: input.id },
      });

      const otherSites = await ctx.db.site.findMany({
        where: {
          id: {
            not: input.id,
          },
        },
      });

      const clients = await ctx.db.client.findMany();

      return serverConfigToNativeWireguard(settings, site, otherSites, clients);
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
    .query(async ({ ctx, input }) => {
      return await ctx.db.site.delete({
        where: { id: input.id },
      });
    }),
});

function serverConfigToNativeWireguard(
  settings: Prisma.SettingsSelect[],
  site: Prisma.SiteSelect,
  otherSites: Prisma.SiteSelect[],
  clients: Prisma.ClientSelect[],
): string {
  const wg_network = settings.find((s) => s.name === "wg_network")!.value;

  let config = `
    [Interface]
    Address = ${generateAddress(wg_network, site.id)}
    ListenPort = 51820
    PrivateKey = ${site.PrivateKey}
    # MTU = 1420 - default

    ### site to site Peers
    ${otherSites
      .map((s) => {
        return `[Peer]
                # ${s.name}
                PublicKey = ${s.PublicKey}
                Endpoint = ${s.endpointAddress}
                AllowedIPs = ${s.localAddresses}
                `;
      })
      .join("\n")}

    ### Clients
    ${clients
      .map((c) => {
        return `[Peer]
                # ${c.name}
                PublicKey = ${c.PublicKey}
                AllowedIPs = ${generateAddress(wg_network, c.id)}
                `;
      })
      .join("\n")}
    `;

  config = config.replace(/^\s+/gm, ""); // Remove leading whitespace

  return config;
}

function generateAddress(wg_network: string, id: number): string {
  const [address, mask] = wg_network.split("/");
  const ipParts = address.split(".", 4) as [string, string, string, string];
  ipParts[3] = id.toString(); // Convert id to string before assigning

  return `${ipParts.join(".")}/${mask}`;
}