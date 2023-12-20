/*
  Warnings:

  - Added the required column `createdById` to the `SiteVersion` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SiteVersion" (
    "hash" TEXT NOT NULL PRIMARY KEY,
    "SiteId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    CONSTRAINT "SiteVersion_SiteId_fkey" FOREIGN KEY ("SiteId") REFERENCES "Site" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SiteVersion_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SiteVersion" ("SiteId", "createdAt", "data", "hash") SELECT "SiteId", "createdAt", "data", "hash" FROM "SiteVersion";
DROP TABLE "SiteVersion";
ALTER TABLE "new_SiteVersion" RENAME TO "SiteVersion";
CREATE UNIQUE INDEX "SiteVersion_hash_key" ON "SiteVersion"("hash");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
