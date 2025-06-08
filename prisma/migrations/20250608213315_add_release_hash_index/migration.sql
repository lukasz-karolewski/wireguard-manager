/*
  Warnings:

  - The primary key for the `Release` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `Release` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Release" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hash" TEXT NOT NULL,
    "SiteId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    CONSTRAINT "Release_SiteId_fkey" FOREIGN KEY ("SiteId") REFERENCES "Site" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Release_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Release" ("SiteId", "createdAt", "createdById", "data", "hash") SELECT "SiteId", "createdAt", "createdById", "data", "hash" FROM "Release";
DROP TABLE "Release";
ALTER TABLE "new_Release" RENAME TO "Release";
CREATE INDEX "Release_hash_idx" ON "Release"("hash");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
