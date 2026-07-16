-- Partner credit terms: 30/45/60/90-day payment terms for clinic partners.
ALTER TABLE "users" ADD COLUMN "creditActive" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "users" ADD COLUMN "creditDays" INTEGER;

ALTER TABLE "orders" ADD COLUMN "creditDays" INTEGER;
ALTER TABLE "orders" ADD COLUMN "paymentDueDate" TIMESTAMP(3);
