-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "defaultSiteId" INTEGER,
    CONSTRAINT "User_defaultSiteId_fkey" FOREIGN KEY ("defaultSiteId") REFERENCES "Site" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("createdAt", "defaultSiteId", "email", "emailVerified", "id", "image", "name", "updatedAt")
SELECT
    "createdAt",
    "defaultSiteId",
    COALESCE("email", "id" || '@local.invalid'),
    CASE WHEN "emailVerified" IS NULL THEN false ELSE true END,
    "id",
    "image",
    COALESCE("name", ''),
    "updatedAt"
FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE TABLE "new_Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" DATETIME,
    "refreshTokenExpiresAt" DATETIME,
    "scope" TEXT,
    "password" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Account" (
    "accessToken",
    "accessTokenExpiresAt",
    "accountId",
    "createdAt",
    "id",
    "idToken",
    "providerId",
    "refreshToken",
    "scope",
    "updatedAt",
    "userId"
)
SELECT
    "access_token",
    CASE WHEN "expires_at" IS NULL THEN NULL ELSE datetime("expires_at", 'unixepoch') END,
    "providerAccountId",
    "createdAt",
    "id",
    "id_token",
    "provider",
    "refresh_token",
    "scope",
    "updatedAt",
    "userId"
FROM "Account";
DROP TABLE "Account";
ALTER TABLE "new_Account" RENAME TO "Account";
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

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
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "Client_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Client_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Client" ("createdAt", "createdById", "email", "enabled", "id", "name", "ownerId", "privateKey", "publicKey", "updatedAt")
SELECT "createdAt", "createdById", "email", "enabled", "id", "name", "ownerId", "privateKey", "publicKey", "updatedAt"
FROM "Client"
;
DROP TABLE "Client";
ALTER TABLE "new_Client" RENAME TO "Client";

CREATE TABLE "new_Release" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "SiteId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "pathWritten" TEXT,
    CONSTRAINT "Release_SiteId_fkey" FOREIGN KEY ("SiteId") REFERENCES "Site" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Release_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Release" ("SiteId", "createdAt", "createdById", "data", "hash", "id", "pathWritten")
SELECT "SiteId", "createdAt", "createdById", "data", "hash", "id", "pathWritten"
FROM "Release"
;
DROP TABLE "Release";
ALTER TABLE "new_Release" RENAME TO "Release";
CREATE INDEX "Release_hash_idx" ON "Release"("hash");

CREATE TABLE "new_AuditLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "changedModel" TEXT NOT NULL,
    "changedModelId" INTEGER NOT NULL,
    "data" TEXT NOT NULL,
    CONSTRAINT "AuditLog_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AuditLog" ("actionType", "changedModel", "changedModelId", "createdAt", "createdById", "data", "id")
SELECT "actionType", "changedModel", "changedModelId", "createdAt", "createdById", "data", "id"
FROM "AuditLog"
;
DROP TABLE "AuditLog";
ALTER TABLE "new_AuditLog" RENAME TO "AuditLog";

DROP TABLE "Session";
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expiresAt" DATETIME NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

CREATE TABLE "Verification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);
CREATE INDEX "Verification_identifier_idx" ON "Verification"("identifier");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
