-- Newsletter subscribers table
-- Captures both guest and registered-user email signups from the homepage/footer.
-- Keeps a unique per-subscriber token for one-click unsubscribe links.

CREATE TABLE IF NOT EXISTS "newsletter_subscribers" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "locale" TEXT NOT NULL DEFAULT 'en',
  "source" TEXT NOT NULL DEFAULT 'homepage',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "unsubscribeToken" TEXT NOT NULL,
  "userId" TEXT,
  "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "unsubscribedAt" TIMESTAMP(3),
  "lastSentAt" TIMESTAMP(3),
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "newsletter_subscribers_pkey" PRIMARY KEY ("id")
);

-- Unique constraints
CREATE UNIQUE INDEX IF NOT EXISTS "newsletter_subscribers_email_key" ON "newsletter_subscribers"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "newsletter_subscribers_unsubscribeToken_key" ON "newsletter_subscribers"("unsubscribeToken");

-- Lookup indexes
CREATE INDEX IF NOT EXISTS "newsletter_subscribers_isActive_idx" ON "newsletter_subscribers"("isActive");
CREATE INDEX IF NOT EXISTS "newsletter_subscribers_locale_isActive_idx" ON "newsletter_subscribers"("locale", "isActive");
CREATE INDEX IF NOT EXISTS "newsletter_subscribers_email_idx" ON "newsletter_subscribers"("email");
