-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Site" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "endpointAddress" TEXT NOT NULL,
    "DNS" TEXT,
    "PiholeDNS" TEXT,
    "ConfigPath" TEXT NOT NULL DEFAULT '/etc/wireguard/wg0.conf',
    "PrivateKey" TEXT,
    "PublicKey" TEXT NOT NULL,
    "localAddresses" TEXT NOT NULL,
    "postUp" TEXT,
    "postDown" TEXT,
    "listenPort" INTEGER NOT NULL DEFAULT 51820
);
INSERT INTO "new_Site" ("ConfigPath", "DNS", "PiholeDNS", "PrivateKey", "PublicKey", "createdAt", "endpointAddress", "id", "listenPort", "localAddresses", "name", "postDown", "postUp", "updatedAt") SELECT "ConfigPath", "DNS", "PiholeDNS", "PrivateKey", "PublicKey", "createdAt", "endpointAddress", "id", "listenPort", "localAddresses", "name", "postDown", "postUp", "updatedAt" FROM "Site";
DROP TABLE "Site";
ALTER TABLE "new_Site" RENAME TO "Site";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
