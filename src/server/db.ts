import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { env } from "~/env";
import { PrismaClient } from "~/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const adapter = new PrismaBetterSqlite3({
  url: env.DATABASE_URL || "file:./dev.db",
});

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
