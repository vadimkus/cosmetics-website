# Session Changes — 2026-07-06 — Build Your Set: audit fixes (web + server)

Implements the fixes from `BUILD_YOUR_SET_AUDIT_2026-07-06.md`. Mobile-side changes are in
`genosys-mobile-app/docs/SESSION_CHANGES_2026-07-06_bundle-builder-audit-fixes.md`.

## 1. Cross-step toggle bug — FIXED (silent item loss)

`BundleBuilderClient.tsx`: `selectedProductIds` was filtered to the current step while
`bundleStore.addItem()` toggles globally by product id. Multi-category products
("Cushion BB, Sun, Cream" etc.) appear in both Cream and Sun steps; in the sibling step the
card looked unselected and "Add to Set" silently REMOVED it. Selection indicator is now
global across all steps (matches the mobile app's behavior).

## 2. "Required" → "Recommended" (decision: do not enforce)

Rationale: enforcing Cleanser/Serum/Cream would contradict the marketed "2 items = 5%"
tier (a 2-mask set is a legitimate purchase) and add checkout friction. The gate stays
"≥ 2 items"; the badge now says what it means:

- Step header badge: `bundleBuilder.recommended` (new key, EN "Recommended" / AR "موصى به" /
  RU "Рекомендуется"), restyled black → amber.
- Skip button now appears for ANY step without items (was optional-steps only), desktop
  and mobile web.
- Same relabel in the native app.

## 3. Catalog coverage — Bio Meso + SRS added

- **Bio Meso PDRN ampoules** (Ampoule 60000, Homecare Ampoule 5000; category "Bio Meso")
  matched no step and were invisible in the builder. Now mapped into the **Serum** step
  (web client filter + `/api/mobile/bundle-builder` `matchesStep`).
- **SRS — SKIN RENEWAL PEELING SYSTEM** (category "Peeling, PRO Solution", 810 AED, in
  stock, not price-on-request): name-exclusion removed from the builder page loader, the
  mobile bundle API, and `checkoutPricingGuards.EXCLUDED_BUNDLE_PRODUCT_NAMES` (so its
  bundle lines validate at checkout). It now appears in the **Peeling** step, which
  previously had a single product.

## 4. Polish

- **Detail modal price** (desktop modal + mobile web bottom sheet) now uses variant-aware
  `getBundleRetailPrice()` instead of raw `product.price` — matches the card grid.
- **Summary discount label** follows the discount that actually won: bundle →
  "Bundle Discount", VIP/black friday → new `bundleBuilder.vipDiscount` key, mixed →
  new `bundleBuilder.discountApplied` key. (Previously always said "Bundle Discount"
  even when the VIP contract beat the tier.)
- **Tier definitions deduplicated**: `DISCOUNT_TIERS` + `getBundleDiscountForCount()` are
  now exported from `lib/bundleStore.ts`; the client's 3 local copies removed. Checkout
  still validates independently via `checkoutPricingGuards.getBundleDiscountTier()`.
- **Dead code removed**: `bundleStore.calculatePricing()` / `getPricing()` (unused, and
  rounded the discount to whole AED — drift risk if ever wired up).

## Mobile app counterpart (shipped via OTA)

- Bag totals + checkout waterfall now best-discount-wins for bundle lines (was
  bundle-only, so VIP >20% users saw a higher total than Stripe charged).
- Builder pricing preview best-discount-wins with dynamic label; `formatAed`;
  Required → Recommended.

## Verification

- `tsc --noEmit` clean; `npm run build` exit 0.
- Post-deploy: `/bundle-builder` HTTP 200; SRS + Bio Meso eligibility verified via
  live product data (all three in stock, not price-on-request, categories pass the
  exact-match exclusions).

## Files

- `app/bundle-builder/BundleBuilderClient.tsx`
- `app/bundle-builder/page.tsx`
- `app/api/mobile/bundle-builder/route.ts`
- `lib/bundleStore.ts`
- `lib/checkoutPricingGuards.ts`
- `messages/en.json`, `messages/ar.json`, `messages/ru.json`
