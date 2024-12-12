/*
  Warnings:

  - You are about to drop the column `type` on the `Site` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_ClientSites" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ClientSites_A_fkey" FOREIGN KEY ("A") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ClientSites_B_fkey" FOREIGN KEY ("B") REFERENCES "Site" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
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
    "configPath" TEXT NOT NULL DEFAULT '/etc/wireguard/wg0.conf'
);
INSERT INTO "new_Site" ("DNS", "configPath", "createdAt", "endpointAddress", "id", "listenPort", "localAddresses", "name", "piholeDNS", "postDown", "postUp", "privateKey", "publicKey", "updatedAt") SELECT "DNS", "configPath", "createdAt", "endpointAddress", "id", "listenPort", "localAddresses", "name", "piholeDNS", "postDown", "postUp", "privateKey", "publicKey", "updatedAt" FROM "Site";
DROP TABLE "Site";
ALTER TABLE "new_Site" RENAME TO "Site";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_ClientSites_AB_unique" ON "_ClientSites"("A", "B");

-- CreateIndex
CREATE INDEX "_ClientSites_B_index" ON "_ClientSites"("B");
