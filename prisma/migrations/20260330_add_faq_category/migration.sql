-- Add category column to faq_items for grouping FAQs
-- Values: general, products, orders, shipping, app, account (NULL = uncategorized)
ALTER TABLE "faq_items" ADD COLUMN "category" TEXT;

-- Index for filtering by category
CREATE INDEX "faq_items_category_idx" ON "faq_items"("category");
