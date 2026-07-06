# Pricing Logic Audit — Web vs Mobile App vs Server — 2026-07-06

Full trace of every pricing path: PDP display, cart lines, cart/checkout totals,
shipping, VAT, and all discount classes (VIP %, Beauty Box 15%, Build Your Set tiers,
Black Friday, noDiscount/device/Hydro-Cool exclusions, price-on-request, promo gifts).

## Verdict: architecture is sound, charge amounts were already correct everywhere

The server is the single pricing authority: every checkout path (web Stripe, COD,
mobile Stripe, Apple Pay, mobile orders) recomputes totals server-side via
`getCartLinePricing` → `buildPricingContract` → `calculateProductPricing`, plus
bundle-tier revalidation (`checkoutPricingGuards`). Client numbers are display hints.

### Confirmed aligned (no action needed)

| Area | Web | Mobile | Server |
|---|---|---|---|
| Product/PDP pricing | shared engine (same lib) | server `pricing` contract on every product payload | authoritative |
| Variant (size/color) pricing | contract | API sends variants with **user-discounted** prices (`generateProductVariants`) | contract w/ variant resolution |
| VIP % discount + exclusions | `mobileDiscountRules` | `productRules.js` mirror | `mobileDiscountRules` |
| Beauty Box 15% | contract label from `BEAUTY_BOX_REGULAR_PRICES` | contract + `/0.85` fallback (matches map) | same |
| Build Your Set tiers | best-discount-wins (fixed earlier today) | best-discount-wins (fixed earlier today) | `contractBeatsBundle` |
| Shipping | `calculateMobileShipping` (Dubai 45 / others 70, free ≥ 1000) | `/api/mobile/shipping-rates` + identical fallback table | `MOBILE_CHECKOUT_CONFIG` |
| VAT | `calculateVatIncluded` 5% included | same formula, 2dp | same |
| Promo/free gifts | n/a (native-only) | excluded from totals | whitelist, price 0 enforced |
| Black Friday | window Nov 25–28 2025 → inactive | contract-driven | inactive |
| Stale-cart safety | n/a | `hasUsableCartContract` guards double-discounting after login; legacy fallback recomputes VIP off retail | recomputed anyway |

Notably checked and NOT a bug: mobile's legacy cart fallback applying VIP % to variant
prices — variant prices from user-aware payloads are already discounted, but that path
only runs when the stored contract is guest-scoped (pre-login cart), where variant
prices ARE retail. The contract/fallback split is correct.

## Fixed today

1. **Mobile `isBeautyBoxProduct` missing the product-number set** (`55,56,57,58,59,62`)
   that the server uses as its first check. If a box's category/name ever drifts, mobile
   would have shown a VIP discount that checkout wouldn't grant (display < charge).
   Added the same set to `utils/productRules.js`. (OTA)
2. **Web `CartClient` had its own hardcoded shipping table** (45/70), its own `>= 1000`
   threshold, and a `|| 45` fallback — values matched today but duplicated the config
   that checkout + backend share (same drift class as the bundle-tier duplication).
   Now imports `MOBILE_CHECKOUT_CONFIG.emirates` + `calculateMobileShipping`.

## Known, accepted gaps (direction is safe: display ≥ charge)

- Recommendation surfaces (skin-analysis quiz + AI camera, chat product cards) fetch
  from public endpoints without user context → VIP customers see **retail** prices on
  those cards; the correct VIP price applies in bag/checkout. Fixing would require
  user-aware pricing on public APIs — not worth it now.
- Beauty-box regular prices (`BEAUTY_BOX_REGULAR_PRICES`) are a hardcoded map — if box
  contents/prices change, update the map (documented here as the single place).

## Where each rule lives (reference)

- Server engine: `lib/pricingEngine.ts` (calculateProductPricing, variants),
  `lib/discountUtils.ts` (discount priority: BeautyBox > BF > VIP),
  `lib/pricingContract.ts` (client contract), `lib/cartPricing.ts` (cart lines,
  bundle best-wins), `lib/checkoutPricingGuards.ts` (bundle tier revalidation),
  `lib/mobileCheckoutConfig.ts` (shipping/VAT).
- Web client: same libs (no duplication left after today).
- Mobile: `utils/pricingDisplay.js` (contract adapter), `utils/productRules.js`
  (exclusion mirrors), `utils/cartUtils.js` (totals + waterfall, contract-first).
