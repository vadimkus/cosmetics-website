# Product 12 EPI TURNOVER BOOSTING PEELING GEL — new image set — 2026-07-18

## What changed
- New assets in `public/images/epi/`: `main.jpeg` + `s1.jpeg`–`s6.jpeg` (1024×1024).
- DB product **12**: `image` → `/images/epi/main.jpeg`; `images` → s1–s6 only (main not duplicated in gallery JSON).
- Updated `data/productConfig.ts` gallery for `'12'` so config matches DB.
- Static fallbacks updated: `lib/products.ts`, training pages (EN/AR/RU), DownloadsSection, mobile training API.
- Order email safety: repointed **25** relative + **4** absolute `…/EPI.jpg` order items → new main.
- Deleted `public/images/EPI.jpg` and `public/images/Second/eppi_big.jpg` after zero remaining order/code refs.
- Global repair audit: **0** dead local orderItem images.

## Script
`npx tsx --env-file=.env.local scripts/update-product-12-images.ts --apply`

## Live
- PDP: https://genosys.ae/products/12
- Main: https://genosys.ae/images/epi/main.jpeg
- Gallery: `/images/epi/s1.jpeg` … `s6.jpeg`
- Video unchanged: `/videos/epi.mp4`
