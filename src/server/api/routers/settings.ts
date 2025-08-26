import "server-only";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const SettingsValues = z.enum(["wg_network"]);
const ipWithCidrSchema = z.string().refine(
  (value) => {
    const [ip, cidr] = value.split("/");
    const ipParts = ip.split(".").map(Number);
    const cidrNumber = Number(cidr);

    const isIpValid = ipParts.length === 4 && ipParts.every((part) => part >= 0 && part <= 255);
    const isCidrValid = cidrNumber >= 0 && cidrNumber <= 32;

    return isIpValid && isCidrValid;
  },
  {
      error: "Invalid IP address with CIDR notation"
},
);

export const settingsRouter = createTRPCRouter({
  getAllSettings: protectedProcedure.query(async ({ ctx }) => {
    const settingsArray = await ctx.db.settings.findMany();

    const settingsObject = Object.fromEntries(
      Object.entries(SettingsValues.enum).map(([key, value]) => {
        return [key, settingsArray.find((setting) => setting.name === value)?.value];
      }),
    );

    return settingsObject;
  }),

  set_wg_network: protectedProcedure
    .input(
      z.object({
        value: ipWithCidrSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newSetting = await ctx.db.settings.upsert({
        create: {
          name: SettingsValues.enum.wg_network,
          value: input.value,
        },
        update: {
          value: input.value,
        },
        where: {
          name: SettingsValues.enum.wg_network,
        },
      });

      return newSetting;
    }),
});
