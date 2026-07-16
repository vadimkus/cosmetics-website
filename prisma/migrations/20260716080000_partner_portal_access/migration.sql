-- Partner Portal access gate: assigned manually by admin.
ALTER TABLE "users" ADD COLUMN "partnerPortalAccess" BOOLEAN NOT NULL DEFAULT false;

-- Backfill: existing 50%-off partner accounts keep working without manual re-approval.
UPDATE "users" SET "partnerPortalAccess" = true WHERE "discountPercentage" = 50;
