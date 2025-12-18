-- Add appleSub for Sign in with Apple (web + mobile)
-- Safe to run multiple times in Postgres via IF NOT EXISTS.

ALTER TABLE "users"
ADD COLUMN IF NOT EXISTS "appleSub" TEXT;

-- Unique index (multiple NULLs allowed in Postgres)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND indexname = 'users_appleSub_key'
  ) THEN
    CREATE UNIQUE INDEX "users_appleSub_key" ON "users"("appleSub");
  END IF;
END $$;





