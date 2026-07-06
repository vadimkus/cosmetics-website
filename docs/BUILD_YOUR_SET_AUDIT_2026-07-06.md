# Build Your Set — Full Audit (Website + Mobile App) — 2026-07-06

Scope: `app/bundle-builder/*` (web), `lib/bundleStore.ts`, `lib/cartStore.ts`, `lib/cartPricing.ts`,
`lib/checkoutPricingGuards.ts`, all checkout API routes; mobile `app/bundle-builder.js`,
`utils/cartUtils.js`, `contexts/CartContext.js`, `/api/mobile/bundle-builder`.

## What's solid

- **Tiers consistent everywhere**: 2=5%, 3=10%, 4=15%, 5=20% (web client, bundleStore, cartStore,
  mobile screen, cartUtils, server guards, mobile API).
- **Server-side revalidation on all 5 checkout paths** (web Stripe session, COD confirmation, mobile
  Stripe, Apple Pay intent, mobile orders): `getValidatedBundleDiscountPercent()` recounts submitted
  bundle lines and recomputes the tier — the client's percent is never trusted. Eligibility
  (`isBundleEligibleProduct`) is also enforced server-side.
- **Cart reconciliation on every mutation** on both platforms (`reconcileBuildSetBundleDiscounts`
  wraps add/remove/quantity/color/size changes) — no stale bundle percent after removals.
- **Exclusions consistent**: Beauty Boxes, PRO Solution, SKIN RENEWAL PEELING SYSTEM, hidden,
  out-of-stock, price-on-request on both web page loader and mobile API.
- **Translations complete**: all 40 `bundleBuilder.*` keys present in en/ar/ru.
- Guests can browse but not add to cart on either platform (prices hidden, CTA gated on user).
- Image tiles: fixed 2026-07-06 (mobile OTA `11c68542`) — square white tiles + contain on both.

## Issues (ranked)

### 1. WEB BUG — cross-step toggle silently removes items
Multi-category products ("Cushion BB, Sun, Cream", "Cream, Sun, Cushion BB", "Cushion BB, Sun")
appear in BOTH Cream and Sun steps. Web `selectedProductIds` is filtered by current step, but
`bundleStore.addItem()` toggles globally by product id. Add a cushion under Cream → in the Sun step
it renders unselected → click opens detail modal → "Add to Set" REMOVES it from the bundle.
Silent item loss. Mobile is immune (global `isSelected`).
**Fix**: make web selection indicator global by product id (match mobile), or make addItem step-aware.

### 2. "Required" steps not enforced (both platforms)
Cleanser/Serum/Cream show a "Required" badge, but the only gate is items >= 2.
`bundleStore.areRequiredStepsComplete()` exists and is never called (dead code).
**Fix**: enforce before Add to Cart, or relabel badge to "Recommended".

### 3. VIP-vs-bundle policy differs between layers
- Server + web cart: best-discount-wins (`contractBeatsBundle` in lib/cartPricing.ts) — VIP > tier
  → customer charged VIP price.
- Mobile builder + mobile bag (`cartUtils.calculateCartTotals`, `computeWaterfallBreakdown`):
  bundle-only on bundle lines, VIP never applied.
**Consequence**: VIP 25–50% customer on mobile sees a HIGHER bag total than Stripe charges
(server gives the better VIP price). Benign direction, but display ≠ charge.
**Fix**: mobile bundle-line display should adopt best-discount-wins.

### 4. Bio Meso ampoules invisible in builder
Category coverage check against live catalog: categories matching no step →
Bio Meso (PDRN Ampoule 60000, Bio-Meso PDRN Homecare Ampoule 5000), Device (3), Scalp/Hair (7),
Microneedling (1). Devices/hair/roller exclusions are sensible for a facial routine; the two
flagship PDRN ampoules look like a merchandising gap.
**Fix option**: add "Treatment/Ampoule" step or map Bio Meso → Serum step.

### 5. Peeling step has exactly 1 product
Only EPI Turnover Peeling Gel qualifies (SRS excluded by name). Single-choice step feels empty.

## Polish items

- Web detail modal shows `detailProduct.price` (not variant-aware) vs card grid's
  `getBundleRetailPrice()` — variant products can show different prices card vs modal.
- Web summary labels the discount row from `bundleBuilder.discount` even when the applied type is
  VIP (best-wins case) — shows VIP pct under a bundle label.
- Mobile hardcodes `AED` in footer/summary pricing rows; cards use `formatAed()` (RTL/i18n
  inconsistency).
- Tier arrays duplicated ~6+ places across repos; centralize per-repo to prevent drift.
- `bundleStore.calculatePricing()` is dead code with whole-AED rounding (different from live math);
  delete to avoid future drift.
- Flow difference: web add-bundle → redirects straight to /checkout; mobile → bag. Align?
- Server API `/api/mobile/bundle-builder` returns `displayPrice = p.price` (base), client resolves
  variants itself — works, but the contract is implicit.

## Priority order

1. Web cross-step toggle bug (silent item loss).
2. Required-step enforcement decision (one-line gate either way).
3. Mobile bag best-discount-wins alignment.
4. PDRN ampoules in builder (merchandising decision).
