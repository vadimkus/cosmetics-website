# Product 19 ALL FOR SENSITIVE SERUM — new image set — 2026-07-31

## What changed
- New assets in `public/images/sensitive_serum/`: `main.jpeg` + `s1.jpeg`–`s6.jpeg`
  (1254×1254). Renamed Finder folder `sensetive_serum` → `sensitive_serum` (spelling).
- DB product **19**: `image` → `/images/sensitive_serum/main.jpeg`; `images` →
  gallery only (main not duplicated in DB `images` JSON).
- Static fallbacks updated: `data/productConfig.ts`, `lib/products.ts`,
  SEO landing pages (EN/AR/RU), OrderHistory.
- Order email safety: repointed **19** order items from `/images/ASE.jpg`
  (and absolute genosys.ae URLs) → new main.
- Blog scan: **no** posts referenced `ASE.jpg` / `allserum_big` — nothing to rewrite.
- Training / DownloadsSection: no hard-coded ASE paths for this product.
- Deleted old assets after zero remaining orderItem refs:
  - `public/images/ASE.jpg`
  - `public/images/Second/allserum_big.jpg`
- Video unchanged: `/videos/allserum.mp4` (already present; not rewired this session).

## Script
`npx tsx --env-file=.env.local scripts/update-product-19-images.ts --apply`

## Live (after deploy)
- PDP: https://genosys.ae/products/19
- Main: https://genosys.ae/images/sensitive_serum/main.jpeg
- Gallery: `/images/sensitive_serum/s1.jpeg` … `s6.jpeg`
