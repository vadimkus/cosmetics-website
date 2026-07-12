# Session — Hair Stamp (64): Discount Exemption + New Main Image (2026-07-12)

## Task 1 — allow 50% clinic/partner discounts on product 64

**Root cause:** the Hair Stamp is named "Hair Stamp For HAIRGEN BOOSTER".
The device discount exclusion matches `hairgen` in compacted product
names (built for the HairGen Booster device), so the Hair Stamp — a
consumable cartridge, not a device — was wrongly excluded from user
discounts. Its DB `noDiscount` was already false.

**Fix:** short-circuit `hairstamp` → not a device, in all four copies of
the rule:
- Web (single source of truth for pricing):
  `lib/mobileDiscountRules.ts` → `isDeviceProduct`
- App: `utils/productRules.js` → `isDeviceProduct`
- App order-history display exclusions:
  `app/profile/orders.js`, `app/profile/orders/[id].js`

**Verified live:** pricing contract for product 64 with the CLINIC test
account (50%): basePrice 600 → displayPrice **300**, `discountLabel
"50% off"`, exclusions all false.

## Task 2 — new main picture

- Copied Desktop `main.jpeg` (1024×1024, 494 KB) →
  `public/images/needles/main.jpeg` (new filename per immutable-cache
  rule), deleted old `public/images/needles/main.jpg`.
- DB `image` → `/images/needles/main.jpeg`; gallery normalized to the
  four S-slides only (main is prepended automatically per gallery rule).
- `lib/products.ts` fallback updated. No historical order items
  referenced the old path.
- Verified live: new URL 200, mobile API returns the new image.

## Deploys
- Web: commit `4800e8b7`, Vercel deployed.
- App: commit `634a7db`, EAS OTA published to production
  (update group `28ed5bfe-3a57-4b52-862f-e6c5109cc6e2`).
