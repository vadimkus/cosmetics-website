-- CreateTable: auditable ledger of loyalty point movements
CREATE TABLE IF NOT EXISTS "loyalty_transactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "orderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loyalty_transactions_pkey" PRIMARY KEY ("id")
);

-- Idempotency: one earn / one redeem per order
CREATE UNIQUE INDEX IF NOT EXISTS "loyalty_transactions_orderId_type_key" ON "loyalty_transactions"("orderId", "type");

-- Per-user history lookups
CREATE INDEX IF NOT EXISTS "loyalty_transactions_userId_createdAt_idx" ON "loyalty_transactions"("userId", "createdAt");

-- FK to users
ALTER TABLE "loyalty_transactions"
  ADD CONSTRAINT "loyalty_transactions_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
