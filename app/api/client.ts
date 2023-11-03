import { Client, PrismaClient } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";

const prisma = new PrismaClient();

export const create = async (data: Client): Promise<Client> => {
  noStore();
  return await prisma.client.create({
    data,
  });
};

export const getAll = async (): Promise<Client[]> => {
  noStore();
  return await prisma.client.findMany();
};

export const get = async (id: number): Promise<Client | null> => {
  noStore();
  return await prisma.client.findUnique({
    where: { id },
  });
};

export const update = async (id: number, data: Partial<Client>): Promise<Client> => {
  noStore();
  return await prisma.client.update({
    where: { id },
    data,
  });
};

export const remove = async (id: number): Promise<Client> => {
  noStore();
  return await prisma.client.delete({
    where: { id },
  });
};
