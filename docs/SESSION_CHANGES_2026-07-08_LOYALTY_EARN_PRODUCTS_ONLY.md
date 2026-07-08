# Session Changes — 2026-07-08 — Loyalty Earn Basis: Products-Only

## Request

Switch the GENOSYS Rewards earn basis from order total (which included
shipping) to **products-only**, on both website and mobile, so the per-item
"Earn ~X pts" lines and the order-level preview always add up. Example that
prompted it: 380 AED product + 45 AED shipping showed item ~475 pts but order
~531 pts (the 56-pt gap was shipping earning points).

## New Earn Rule

Points = product spend (after all discounts and points redemption, VAT-incl,
**excluding shipping**) × tier multiplier (×2 in birthday month).

Implementation basis at award time: `order.total − order.shipping`. Every
order-creation path (web COD, web Stripe intent, web Checkout Session, mobile
COD, mobile card/Apple Pay) computes `total = subtotal + shipping −
loyaltyDiscount` and persists `shipping`, so this equals products actually
paid on all paths. Verified each route.

## Changes — Website

- `lib/loyalty.ts`
  - `awardPointsForDeliveredOrder`: selects `shipping`, awards on
    `max(0, total − shipping)`; ledger description now says
    `AED X in products`.
  - `computeOrderPoints` doc: param renamed to `productSpendAed`.
  - Header program-rules comment updated.
- `app/cart/CartClient.tsx`: order earn preview basis `total` → `subtotal`.
- `app/checkout/CheckoutClient.tsx`: preview basis `total` →
  `max(0, subtotal − loyaltyDiscount)`.
- `messages/{en,ar,ru}.json` `rewards.howItWorksBody`: now says points are
  earned on products, delivery fees excluded.
- `lib/email/loyalty.ts`: launch-email "How it works" line clarified the same
  way. (Points-earned email uses the award result — no math there.)

## Changes — Mobile (genosys-mobile-app)

- `app/(tabs)/bag.js`: order earn preview basis `safeTotal` → `safeSubtotal`.
  (Per-item lines already used line subtotals — unchanged.)
- `app/checkout.js`: earn preview basis `safeTotal` →
  `max(0, safeSubtotal − loyaltyDiscount)`.
- `i18n/messages/{en,ar,ru}.json` `rewards.howItWorksBody`: same wording
  clarification.

## Deliberately NOT Changed

- Historical ledger entries and the backfill credit (awarded on order totals
  pre-change) — no clawbacks; new basis applies to orders delivered from now.
- `getEarnedPointsByOrder` fallback for pre-launch orders (1 pt/AED of total)
  — matches what was actually credited by the backfill.
- Redemption rules — the 20% cap was already based on product subtotal.

## Consistency Check (SILVER 1.25×, 380 AED product, 45 AED Dubai shipping)

| Surface | Before | After |
|---|---|---|
| Cart item line | 475 | 475 |
| Cart order preview | 531 | **475** |
| Checkout preview | 531 | **475** |
| Awarded at delivery | 531 | **475** |

With 700 pts redeemed (−35 AED): checkout preview and award both give
floor((380−35)×1.25) = 431. Free-shipping orders (≥1,000 AED) are unchanged.

## Verification

- Web: `tsc --noEmit` clean, ESLint clean, JSON locales valid, 4 loyalty-
  adjacent Jest suites pass (11 tests).
- Mobile: both changed files parse under babel-preset-expo; locales valid.
- Grepped both repos for every `loyaltyMultiplier` multiplication — all
  remaining usages are products-based.

## Files Touched

Website: `lib/loyalty.ts`, `app/cart/CartClient.tsx`,
`app/checkout/CheckoutClient.tsx`, `lib/email/loyalty.ts`,
`messages/{en,ar,ru}.json`
Mobile: `app/(tabs)/bag.js`, `app/checkout.js`,
`i18n/messages/{en,ar,ru}.json`
