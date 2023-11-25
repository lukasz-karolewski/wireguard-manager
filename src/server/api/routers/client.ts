import { Client, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const create = async (data: Client): Promise<Client> => {
  return await prisma.client.create({
    data,
  });
};

export const getAll = async (): Promise<Client[]> => {
  return await prisma.client.findMany();
};

export const get = async (id: number): Promise<Client | null> => {
  return await prisma.client.findUnique({
    where: { id },
  });
};

export const update = async (id: number, data: Partial<Client>): Promise<Client> => {
  return await prisma.client.update({
    where: { id },
    data,
  });
};

export const remove = async (id: number): Promise<Client> => {
  return await prisma.client.delete({
    where: { id },
  });
};
