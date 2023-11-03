import { PrismaClient, Site } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";

const prisma = new PrismaClient();

export const create = async (data: Site) => {
  noStore();
  return await prisma.site.create({
    data,
  });
};

export const getAll = async () => {
  noStore();
  return await prisma.site.findMany();
};

export const get = async (id: number) => {
  noStore();
  return await prisma.site.findUnique({
    where: { id },
  });
};

export const update = async (id: number, data: Partial<Site>) => {
  noStore();
  return await prisma.site.update({
    where: { id },
    data,
  });
};

export const remove = async (id: number) => {
  noStore();
  return await prisma.site.delete({
    where: { id },
  });
};
