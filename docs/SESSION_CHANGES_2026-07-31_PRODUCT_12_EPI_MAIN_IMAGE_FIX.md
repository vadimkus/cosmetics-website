# Session Changes — 2026-07-31 — Product 12 EPI peeling gel missing main image

## Bug
https://genosys.ae/products/12 gallery opened on promotional slide `s1.jpeg`.
Packshot `/images/epi/main.jpeg` exists (DB `image` correct) but was never shown.

## Cause
`data/productConfig.ts` product **12** listed only `s1`–`s6`.
`ProductImageGallery` prefers config images and returned them as-is, so the
packshot was skipped. Mobile `pricingEngine` has the same config-wins rule.

## Fix
- `productConfig.ts` product 12: prepend `/images/epi/main.jpeg`.
- `ProductImageGallery.tsx`: always prepend `product.image` when config
  omits it (defensive — prevents the same trap on other products).

## Verify
- PDP first thumb + hero = clean tube packshot
- Slides s1–s6 still follow as gallery
