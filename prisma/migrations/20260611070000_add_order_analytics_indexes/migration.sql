-- Performance indexes flagged in the 2026-06-10 repo audit.
-- All target tables are small (orders ~414, user_actions ~5, user_sessions ~25k),
-- so plain CREATE INDEX is instantaneous; IF NOT EXISTS keeps it idempotent.

-- Admin order-status filtering
CREATE INDEX IF NOT EXISTS "orders_status_idx" ON "orders"("status");

-- Date-range queries and recent-orders sorting
CREATE INDEX IF NOT EXISTS "orders_createdAt_idx" ON "orders"("createdAt");

-- Per-user action lookups in analytics
CREATE INDEX IF NOT EXISTS "user_actions_userEmail_action_idx" ON "user_actions"("userEmail", "action");

-- Per-user session lookups in analytics
CREATE INDEX IF NOT EXISTS "user_sessions_userId_idx" ON "user_sessions"("userId");
