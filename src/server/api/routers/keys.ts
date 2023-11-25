import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { execShellCommand } from "~/server/utils/execShellCommand";

export const resumeRouter = createTRPCRouter({
  getKeyPair: protectedProcedure.query(async ({ ctx }) => {
    const private_key = await execShellCommand("wg genkey");
    const public_key = await execShellCommand(`echo "${private_key}" | wg pubkey`);

    return { private_key, public_key };
  }),

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
});
