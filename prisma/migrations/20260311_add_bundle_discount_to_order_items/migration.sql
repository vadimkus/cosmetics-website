-- AlterTable: Add per-item bundle discount percentage to order_items
-- This allows distinguishing bundle items from non-bundle items in mixed orders
-- NULL means the item is not part of a bundle (backward compatible with existing data)
ALTER TABLE "order_items" ADD COLUMN "bundleDiscount" DOUBLE PRECISION;
