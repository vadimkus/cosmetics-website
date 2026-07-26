# Product 31 MULTI VITA RADIANCE CREAM — new image set — 2026-07-26

## What changed
- New assets in `public/images/radiance/`: `main.jpeg` + `s1.jpeg`–`s6.jpeg`
  (1254×1254, all ≤ ~170 KB).
- DB product **31**: `image` → `/images/radiance/main.jpeg`; `images` →
  gallery only (main not duplicated).
- Static fallbacks updated: `data/productConfig.ts`, `lib/products.ts`,
  training pages (EN/AR/RU + mobile API), DownloadsSection, OrderHistory.
- Order email safety: repointed **32** order items from `/images/RAA.jpg`
  (and absolute genosys.ae URL) → new main.
- Blog scan: **no** posts referenced `RAA.jpg` / `radiance_both` — nothing
  to rewrite in blog HTML.
- Deleted old assets after zero remaining orderItem refs:
  - `public/images/RAA.jpg`
  - `public/images/Second/radiance_both.jpg`
- Left `RADS.jpg` alone (product **21** serum).
- Global repair audit: **0** dead local orderItem images.

## Script
`npx tsx --env-file=.env.local scripts/update-product-31-images.ts --apply`

## Live (after deploy + ISR ~5 min)
- PDP: https://genosys.ae/products/31
- Main: https://genosys.ae/images/radiance/main.jpeg
- Gallery: `/images/radiance/s1.jpeg` … `s6.jpeg`
- Video: `/videos/radiance.mp4` (unchanged)
