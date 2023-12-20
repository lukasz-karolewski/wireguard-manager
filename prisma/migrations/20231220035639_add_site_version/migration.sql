-- CreateTable
CREATE TABLE "SiteVersion" (
    "hash" TEXT NOT NULL PRIMARY KEY,
    "SiteId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data" TEXT NOT NULL,
    CONSTRAINT "SiteVersion_SiteId_fkey" FOREIGN KEY ("SiteId") REFERENCES "Site" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "SiteVersion_hash_key" ON "SiteVersion"("hash");
