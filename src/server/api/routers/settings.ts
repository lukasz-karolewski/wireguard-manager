import "server-only";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const SettingsValues = z.enum(["wg_network"]);

export const settingsRouter = createTRPCRouter({
  getAllSettings: protectedProcedure.query(async ({ ctx }) => {
    const settingsArray = await ctx.db.settings.findMany();

    const settingsObject = Object.fromEntries(
      Object.entries(SettingsValues.Enum).map(([key, value]) => {
        return [key, settingsArray.find((setting) => setting.name === value)?.value];
      }),
    );

    return settingsObject;
  }),

  set_wg_network: protectedProcedure
    .input(
      z.object({
        value: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newSetting = await ctx.db.settings.upsert({
        where: {
          name: SettingsValues.Enum.wg_network,
        },
        create: {
          name: SettingsValues.Enum.wg_network,
          value: input.value,
        },
        update: {
          value: input.value,
        },
      });

      return newSetting;
    }),
});
