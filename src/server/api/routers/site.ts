import { PrismaClient, Site } from "@prisma/client";

const prisma = new PrismaClient();

export const create = async (data: Site) => {
  return await prisma.site.create({
    data,
  });
};

export const getAll = async () => {
  return await prisma.site.findMany();
};

export const get = async (id: number) => {
  return await prisma.site.findUnique({
    where: { id },
  });
};

export const update = async (id: number, data: Partial<Site>) => {
  return await prisma.site.update({
    where: { id },
    data,
  });
};

export const remove = async (id: number) => {
  return await prisma.site.delete({
    where: { id },
  });
};
