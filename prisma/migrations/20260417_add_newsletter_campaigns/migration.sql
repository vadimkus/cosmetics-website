-- Newsletter campaigns — audit log for every send (test or production)
-- Feeds the admin /admin newsletter tab history view and lets us resume polling
-- after a serverless invocation ends mid-send.

CREATE TABLE IF NOT EXISTS "newsletter_campaigns" (
  "id" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "bodyMarkdown" TEXT NOT NULL,
  "bodyHtml" TEXT NOT NULL,
  "localeFilter" TEXT,
  "sourceFilter" TEXT,
  "isTest" BOOLEAN NOT NULL DEFAULT false,
  "testEmail" TEXT,
  "totalRecipients" INTEGER NOT NULL DEFAULT 0,
  "sentCount" INTEGER NOT NULL DEFAULT 0,
  "failedCount" INTEGER NOT NULL DEFAULT 0,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "sentByEmail" TEXT NOT NULL,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "errors" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "newsletter_campaigns_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "newsletter_campaigns_status_idx" ON "newsletter_campaigns"("status");
CREATE INDEX IF NOT EXISTS "newsletter_campaigns_createdAt_idx" ON "newsletter_campaigns"("createdAt");
