-- Post-delivery review-request email tracking (cron idempotency)
ALTER TABLE "orders" ADD COLUMN "reviewRequestSentAt" TIMESTAMP(3);
