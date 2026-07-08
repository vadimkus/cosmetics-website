# Session: GENOSYS Rewards — Loyalty Points & Tiers Launch (2026-07-08)

## Program design (approved by Vadim)

- **Earning:** 1 point per 1 AED paid (order total), credited when order status becomes DELIVERED
- **Value:** 100 points = AED 5 (5% base return). Redemption at checkout = Phase 2
- **Tiers (lifetime spend or orders):** MEMBER (0) → SILVER (1,000 AED / 3 orders) → GOLD (5,000 / 10) → PLATINUM (15,000 / 25)
- **Multipliers:** 1x / 1.25x / 1.5x / 2x; birthday month doubles earning on top
- **Professional Partners:** accounts with contractual discount ≥ 20% (CLINIC/VIP, 71 users) are OUTSIDE points/tiers — profile shows a "Professional Partner" badge with their pricing instead. Zero margin risk on top of 50% pricing
- **Welcome bonus:** one-time 100 points for every retail-track user at launch
- No point expiry in V1

## What was built

### Database
- New `loyalty_transactions` ledger table (migration `20260708060000_add_loyalty_transactions`, applied to prod)
  - `points` (+/-), `type` (ORDER_EARN, WELCOME_BONUS, BIRTHDAY_BONUS, BACKFILL, REDEEM, ADJUST), `orderId`, unique `(orderId, type)` for idempotency
  - `user.loyaltyPoints` is the materialized balance; ledger is the source of truth

### Backend (cosmetics-website)
- `lib/loyalty.ts` — engine: track detection (partner vs rewards), tier multipliers, birthday month, idempotent `awardPointsForDeliveredOrder()`
- `app/api/admin/orders/[id]/route.ts` — DELIVERED hook: awards points, sends "points earned" + "tier upgrade" emails (skips Apple relay)
- `app/api/user/membership/route.ts` — NEW website endpoint (session auth)
- `app/api/mobile/membership/route.ts` — updated: partner track, ledger-backed balance, multiplier, point AED value
- `lib/email/loyalty.ts` — 4 Apple-style emails: launch (retail), partner recognition, points earned, tier upgrade

### Website UI
- `components/profile/MembershipCard.tsx` — real rewards card (tier badge, points, AED value, progress bar to next tier / partner badge)
- Rendered in `app/profile/page.tsx` (desktop + mobile web) and `components/pwa/PWAProfilePage.tsx` (PWA)
- `rewards.*` i18n keys added to EN/AR/RU

### Mobile app (genosys-mobile-app)
- `services/api.js` — `fetchMembership()` hits `/api/mobile/membership`
- `components/MembershipCard.js` — native rewards card (RTL-aware), rendered in `app/profile.js` under the profile card
- `rewards.*` keys in i18n EN/AR/RU

### Backfill (executed against prod, 2026-07-08)
- Script: `scripts/loyalty-backfill-and-launch.ts`
- Results: 209 member numbers assigned (now 808/808 have GNS-XXXXX-AE), 737 retail users backfilled, 71 partners flagged (points reset to 0), **264,076 points issued** (176,524 history + 64,600 welcome + rounding)
- Historical points = 1 pt/AED on DELIVERED orders, no retroactive multipliers
- Tier distribution after backfill: 722 MEMBER / 81 SILVER / 4 GOLD / 1 PLATINUM

## Launch email

- `--test` sent to Vadim (5856825@gmail.com): retail sample + partner sample ✅
- Mass send: `npx tsx scripts/loyalty-backfill-and-launch.ts --send` (retail launch email with personal balance to ~737, partner recognition to 71, Apple-relay skipped)
- Progress log `scripts/.loyalty-launch-sent.json` makes re-runs idempotent
- **Status: awaiting Vadim's approval of test emails before mass send**

## Liability math

- 264K points ≈ AED 13.2K max redemption value (5%), spread across 808 users, most of it concentrated in ~92 active buyers. Redemption capped at 20% per order in Phase 2.

## Phase 2 (next)

- Point redemption at checkout (web + mobile): apply points as AED discount, blocks of 100 pts, cap 20% of order subtotal, not combinable with personal discounts
- Later: Apple Wallet pass surfacing (endpoint already exists), points for reviews, referral bonuses
