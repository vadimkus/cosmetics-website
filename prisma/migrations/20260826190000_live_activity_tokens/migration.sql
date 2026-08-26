-- ActivityKit tokens for the Lock Screen order card.
--
-- Two different tokens, and neither is the Expo push token. The one on the user is
-- app-wide and raises a card while the app is not running; the one on the order updates
-- the card that was raised for it.
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "liveActivityStartToken" TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "liveActivityToken" TEXT;
