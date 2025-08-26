-- AlterTable
ALTER TABLE "Site" ADD COLUMN "remoteConfig" TEXT;
ALTER TABLE "Site" ADD COLUMN "remoteConfigCheckedAt" DATETIME;
ALTER TABLE "Site" ADD COLUMN "remoteConfigHash" TEXT;
