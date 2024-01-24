/*
  Warnings:

  - You are about to drop the `SiteVersion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `ConfigPath` on the `Site` table. All the data in the column will be lost.
  - You are about to drop the column `PiholeDNS` on the `Site` table. All the data in the column will be lost.
  - You are about to drop the column `PrivateKey` on the `Site` table. All the data in the column will be lost.
  - You are about to drop the column `PublicKey` on the `Site` table. All the data in the column will be lost.
  - You are about to drop the column `PrivateKey` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `PublicKey` on the `Client` table. All the data in the column will be lost.
  - Added the required column `publicKey` to the `Site` table without a default value. This is not possible if the table is not empty.
  - Added the required column `privateKey` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicKey` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "SiteVersion_hash_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SiteVersion";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Release" (
    "hash" TEXT NOT NULL PRIMARY KEY,
    "SiteId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    CONSTRAINT "Release_SiteId_fkey" FOREIGN KEY ("SiteId") REFERENCES "Site" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Release_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "changedModel" TEXT NOT NULL,
    "changedModelId" INTEGER NOT NULL,
    "data" TEXT NOT NULL,
    CONSTRAINT "AuditLog_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Site" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "listenPort" INTEGER NOT NULL DEFAULT 51820,
    "privateKey" TEXT,
    "publicKey" TEXT NOT NULL,
    "endpointAddress" TEXT NOT NULL,
    "DNS" TEXT,
    "piholeDNS" TEXT,
    "localAddresses" TEXT NOT NULL,
    "postUp" TEXT,
    "postDown" TEXT,
    "configPath" TEXT NOT NULL DEFAULT '/etc/wireguard/wg0.conf',
    "type" TEXT NOT NULL DEFAULT 'native'
);
INSERT INTO "new_Site" ("DNS", "createdAt", "endpointAddress", "id", "listenPort", "localAddresses", "name", "postDown", "postUp", "updatedAt", "configPath", "piholeDNS", "privateKey", "publicKey") SELECT "DNS", "createdAt", "endpointAddress", "id", "listenPort", "localAddresses", "name", "postDown", "postUp", "updatedAt", "ConfigPath", "PiholeDNS", "PrivateKey", "PublicKey" FROM "Site";
DROP TABLE "Site";
ALTER TABLE "new_Site" RENAME TO "Site";


CREATE TABLE "new_Client" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "publicKey" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    CONSTRAINT "Client_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Client" ("createdAt", "createdById", "email", "enabled", "id", "name", "updatedAt", "privateKey", "publicKey") SELECT "createdAt", "createdById", "email", "enabled", "id", "name", "updatedAt", "PrivateKey", "PublicKey" FROM "Client";
DROP TABLE "Client";
ALTER TABLE "new_Client" RENAME TO "Client";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Release_hash_key" ON "Release"("hash");
