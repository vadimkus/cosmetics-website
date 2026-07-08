-- GENOSYS Rewards Phase 2: point redemption at checkout
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "loyaltyPointsRedeemed" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "loyaltyDiscountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0;
