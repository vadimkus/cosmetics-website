-- Clinic Homecare Scripts: immutable recommendations, order attribution,
-- and a clinic-only points ledger.

ALTER TABLE "orders"
  ADD COLUMN "homecareScriptId" TEXT,
  ADD COLUMN "homecareScriptVersionId" TEXT,
  ADD COLUMN "homecareAttributedSubtotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
  ADD COLUMN "clinicPointsRedeemed" DOUBLE PRECISION NOT NULL DEFAULT 0,
  ADD COLUMN "clinicPointsDiscountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0;

ALTER TABLE "order_items"
  ADD COLUMN "homecareScriptItemId" TEXT,
  ADD COLUMN "homecareScriptVersionId" TEXT,
  ADD COLUMN "homecareEligibleAmount" DOUBLE PRECISION NOT NULL DEFAULT 0;

CREATE TABLE "homecare_scripts" (
  "id" TEXT NOT NULL,
  "clinicUserId" TEXT NOT NULL,
  "publicToken" TEXT NOT NULL,
  "tokenPrefix" TEXT NOT NULL,
  "patientLabel" TEXT,
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "openCount" INTEGER NOT NULL DEFAULT 0,
  "lastOpenedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "homecare_scripts_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "homecare_script_versions" (
  "id" TEXT NOT NULL,
  "scriptId" TEXT NOT NULL,
  "versionNumber" INTEGER NOT NULL,
  "careInstructions" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "homecare_script_versions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "homecare_script_items" (
  "id" TEXT NOT NULL,
  "versionId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "size" TEXT,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "homecare_script_items_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "clinic_point_transactions" (
  "id" TEXT NOT NULL,
  "clinicUserId" TEXT NOT NULL,
  "orderId" TEXT,
  "scriptVersionId" TEXT,
  "points" DOUBLE PRECISION NOT NULL,
  "eligibleAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "type" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "idempotencyKey" TEXT NOT NULL,
  "description" TEXT,
  "availableAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "clinic_point_transactions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "homecare_scripts_publicToken_key"
  ON "homecare_scripts"("publicToken");
CREATE INDEX "homecare_scripts_clinicUserId_createdAt_idx"
  ON "homecare_scripts"("clinicUserId", "createdAt");
CREATE INDEX "homecare_scripts_status_expiresAt_idx"
  ON "homecare_scripts"("status", "expiresAt");

CREATE UNIQUE INDEX "homecare_script_versions_scriptId_versionNumber_key"
  ON "homecare_script_versions"("scriptId", "versionNumber");
CREATE INDEX "homecare_script_versions_scriptId_createdAt_idx"
  ON "homecare_script_versions"("scriptId", "createdAt");

CREATE INDEX "homecare_script_items_versionId_sortOrder_idx"
  ON "homecare_script_items"("versionId", "sortOrder");
CREATE INDEX "homecare_script_items_productId_idx"
  ON "homecare_script_items"("productId");

CREATE UNIQUE INDEX "clinic_point_transactions_idempotencyKey_key"
  ON "clinic_point_transactions"("idempotencyKey");
CREATE INDEX "clinic_point_transactions_clinicUserId_status_createdAt_idx"
  ON "clinic_point_transactions"("clinicUserId", "status", "createdAt");
CREATE INDEX "clinic_point_transactions_orderId_idx"
  ON "clinic_point_transactions"("orderId");
CREATE INDEX "clinic_point_transactions_availableAt_status_idx"
  ON "clinic_point_transactions"("availableAt", "status");

CREATE INDEX "orders_homecareScriptId_idx" ON "orders"("homecareScriptId");
CREATE INDEX "orders_homecareScriptVersionId_idx" ON "orders"("homecareScriptVersionId");
CREATE INDEX "order_items_homecareScriptItemId_idx" ON "order_items"("homecareScriptItemId");
CREATE INDEX "order_items_homecareScriptVersionId_idx" ON "order_items"("homecareScriptVersionId");

ALTER TABLE "homecare_scripts"
  ADD CONSTRAINT "homecare_scripts_clinicUserId_fkey"
  FOREIGN KEY ("clinicUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "homecare_script_versions"
  ADD CONSTRAINT "homecare_script_versions_scriptId_fkey"
  FOREIGN KEY ("scriptId") REFERENCES "homecare_scripts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "homecare_script_items"
  ADD CONSTRAINT "homecare_script_items_versionId_fkey"
  FOREIGN KEY ("versionId") REFERENCES "homecare_script_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "homecare_script_items"
  ADD CONSTRAINT "homecare_script_items_productId_fkey"
  FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "orders"
  ADD CONSTRAINT "orders_homecareScriptId_fkey"
  FOREIGN KEY ("homecareScriptId") REFERENCES "homecare_scripts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "orders"
  ADD CONSTRAINT "orders_homecareScriptVersionId_fkey"
  FOREIGN KEY ("homecareScriptVersionId") REFERENCES "homecare_script_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "order_items"
  ADD CONSTRAINT "order_items_homecareScriptItemId_fkey"
  FOREIGN KEY ("homecareScriptItemId") REFERENCES "homecare_script_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "order_items"
  ADD CONSTRAINT "order_items_homecareScriptVersionId_fkey"
  FOREIGN KEY ("homecareScriptVersionId") REFERENCES "homecare_script_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "clinic_point_transactions"
  ADD CONSTRAINT "clinic_point_transactions_clinicUserId_fkey"
  FOREIGN KEY ("clinicUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "clinic_point_transactions"
  ADD CONSTRAINT "clinic_point_transactions_orderId_fkey"
  FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "clinic_point_transactions"
  ADD CONSTRAINT "clinic_point_transactions_scriptVersionId_fkey"
  FOREIGN KEY ("scriptVersionId") REFERENCES "homecare_script_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
