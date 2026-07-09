-- Post-delivery review-request emails: when the order was first marked
-- DELIVERED, and when the review-request email went out (idempotency).
ALTER TABLE "orders" ADD COLUMN "deliveredAt" TIMESTAMP(3);
ALTER TABLE "orders" ADD COLUMN "reviewRequestSentAt" TIMESTAMP(3);
