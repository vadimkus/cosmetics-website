# Session Changes — 2026-07-08 — Cart Per-Item Earn Points (Web)

## Request

Website cart: show the GENOSYS Rewards points each item earns when it's in the
cart — same as the mobile app bag screen ("Earn ~X pts" under each product).
The web cart previously only had the order-level preview in the Order Summary.

## What Changed

### 1. `components/cart/CartItem.tsx`

- New optional prop `loyaltyMultiplier` (0 = hidden, e.g. guests / partner
  accounts).
- Under the line price: `🏅 Earn ~X pts` where
  `X = floor(getCartLinePricing(item, user).lineTotal × multiplier)` — uses the
  same line-pricing helper as the displayed price, so personal discounts and
  bundle pricing are reflected in the estimate.
- Free/promo lines price at 0 → earn line hides itself automatically.
- `areCartItemsEqual` memo comparator extended with `loyaltyMultiplier` so the
  row re-renders when membership data arrives.

### 2. `app/cart/CartClient.tsx`

- Passes the already-fetched `loyaltyMultiplier` (from `/api/user/membership`,
  REWARDS track only) down to each `<CartItem>`.

### 3. i18n — `messages/{en,ar,ru}.json`

- New key `rewards.earnItem` (copied from the mobile app):
  - en: `Earn ~{points} pts`
  - ar: `اكسب حوالي {points} نقطة`
  - ru: `≈{points} баллов за товар`

## Earn Math Reference (answering "how many points do I get?")

- Points are awarded on the **delivered order total** (products + shipping,
  VAT-inclusive) × tier multiplier (`computePointsForOrder` in
  `lib/loyalty.ts`).
- Per-item preview = line total × multiplier (products only), so the order
  preview is always slightly higher than the sum of item lines when shipping
  is charged.
- Example from Vadim's screenshot (SILVER 1.25×): Bio-Meso PDRN 300 AED item
  → ~375 pts; order total 345 AED (incl. 45 shipping) → ~431 pts.

## Verification

- `tsc --noEmit`, ESLint, and JSON validation clean.
- Verified live on localhost with a disposable user: item line showed
  "Earn ~36 pts" for a 36 AED mask (1× tier), and updated to "Earn ~72 pts"
  when quantity bumped to 2. Order summary preview unchanged and consistent.
- Test user removed after verification.

## Files Touched

- `components/cart/CartItem.tsx`
- `app/cart/CartClient.tsx`
- `messages/en.json`, `messages/ar.json`, `messages/ru.json`
