import { PrismaClient } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";

const prisma = new PrismaClient();

export const getAllSettings = async () => {
  noStore();
  const settingsArray = await prisma.settings.findMany();

  const settingsDictionary = settingsArray.reduce(
    (acc, setting) => {
      acc[setting.name] = setting.value;
      return acc;
    },
    {} as Record<string, string>,
  );

  return settingsDictionary;
};
