-- Dormant Apple Wallet / Google Wallet pass state. No existing user or loyalty
-- row is rewritten by this additive migration.
CREATE TYPE "WalletProvider" AS ENUM ('APPLE', 'GOOGLE');
CREATE TYPE "WalletPassStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'REVOKED');

CREATE TABLE "wallet_passes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" "WalletProvider" NOT NULL,
    "externalId" TEXT NOT NULL,
    "status" "WalletPassStatus" NOT NULL DEFAULT 'ACTIVE',
    "locale" TEXT NOT NULL DEFAULT 'en',
    "contentRevision" INTEGER NOT NULL DEFAULT 1,
    "publishedRevision" INTEGER NOT NULL DEFAULT 0,
    "contentUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSyncedAt" TIMESTAMP(3),
    "nextSyncAt" TIMESTAMP(3),
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallet_passes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "apple_wallet_registrations" (
    "id" TEXT NOT NULL,
    "walletPassId" TEXT NOT NULL,
    "deviceLibraryIdentifier" TEXT NOT NULL,
    "pushToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "apple_wallet_registrations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "wallet_passes_externalId_key" ON "wallet_passes"("externalId");
CREATE UNIQUE INDEX "wallet_passes_userId_provider_key" ON "wallet_passes"("userId", "provider");
CREATE INDEX "wallet_passes_provider_status_idx" ON "wallet_passes"("provider", "status");
CREATE INDEX "wallet_passes_status_nextSyncAt_idx" ON "wallet_passes"("status", "nextSyncAt");
CREATE UNIQUE INDEX "apple_wallet_registrations_walletPassId_deviceLibraryIdentifier_key"
    ON "apple_wallet_registrations"("walletPassId", "deviceLibraryIdentifier");
CREATE INDEX "apple_wallet_registrations_deviceLibraryIdentifier_idx"
    ON "apple_wallet_registrations"("deviceLibraryIdentifier");

ALTER TABLE "wallet_passes"
    ADD CONSTRAINT "wallet_passes_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "apple_wallet_registrations"
    ADD CONSTRAINT "apple_wallet_registrations_walletPassId_fkey"
    FOREIGN KEY ("walletPassId") REFERENCES "wallet_passes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
