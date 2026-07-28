# Product 21 MULTI VITA RADIANCE SERUM — new image set — 2026-07-28

## What changed
- New assets in `public/images/radiance_serum/`: `main.jpeg` + `s1.jpeg`–`s5.jpeg`
  (1254×1254).
- DB product **21**: `image` → `/images/radiance_serum/main.jpeg`; `images` →
  gallery only (main not duplicated).
- Static fallbacks updated: `data/productConfig.ts`, `lib/products.ts`,
  training (EN/AR/RU + mobile API), DownloadsSection, OrderHistory,
  SEO landing pages (EN/AR/RU), homepage category preferred-product comment.
- Order email safety: repointed **38** order items from `/images/RADS.jpg`
  (and absolute genosys.ae URLs) → new main.
- Blog scan: **no** posts referenced `RADS.jpg` / `rd_big` — nothing to rewrite.
- Deleted old assets after zero remaining orderItem refs:
  - `public/images/RADS.jpg`
  - `public/images/Second/rd_big.jpg`
- Left cream assets in `radiance/` alone (product **31**).
- Global repair audit: **0** dead local orderItem images.

## Script
`npx tsx --env-file=.env.local scripts/update-product-21-images.ts --apply`

## Live (after deploy)
- PDP: https://genosys.ae/products/21
- Main: https://genosys.ae/images/radiance_serum/main.jpeg
- Gallery: `/images/radiance_serum/s1.jpeg` … `s5.jpeg`
- Video: `/videos/radiance_serum.mp4` (unchanged)
