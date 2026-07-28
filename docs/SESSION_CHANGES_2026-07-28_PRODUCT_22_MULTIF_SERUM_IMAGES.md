# Product 22 MULTI FUNCTIONAL ANTI-WRINKLE SERUM — new image set — 2026-07-28

## What changed
- New assets in `public/images/multif_serum/`: `main.jpeg` + `s1.jpeg`–`s6.jpeg`
  (1254×1254).
- DB product **22**: `image` → `/images/multif_serum/main.jpeg`; `images` →
  gallery only (main not duplicated).
- Static fallbacks updated: `data/productConfig.ts`, `lib/products.ts`,
  `OrderHistory.tsx`.
- Order email safety: repointed **24** order items from `/images/MSSS.jpg`
  (and absolute genosys.ae URLs) → new main.
- Blog scan: **no** posts referenced `MSSS.jpg` / `multiserum1` — nothing to rewrite.
- Deleted old assets after zero remaining orderItem refs:
  - `public/images/MSSS.jpg`
  - `public/images/Second/multiserum1.jpg`
- Left unused `MSS2.png` / `MSS3.png` in place (not referenced by product 22).
- Global repair audit: **0** dead local orderItem images.

## Script
`npx tsx --env-file=.env.local scripts/update-product-22-images.ts --apply`

## Live (after deploy)
- PDP: https://genosys.ae/products/22
- Main: https://genosys.ae/images/multif_serum/main.jpeg
- Gallery: `/images/multif_serum/s1.jpeg` … `s6.jpeg`
