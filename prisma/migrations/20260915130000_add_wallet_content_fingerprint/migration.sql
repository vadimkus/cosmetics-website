-- Snapshot hash used by the nightly reconciliation to detect loyalty/profile
-- writes made by legacy administrative scripts outside the normal hooks.
ALTER TABLE "wallet_passes" ADD COLUMN "contentFingerprint" TEXT;
