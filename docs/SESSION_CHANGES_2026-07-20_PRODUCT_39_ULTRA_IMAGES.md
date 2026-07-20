# Product 39 ULTRA SHIELD SUN CREAM SPF 50+ — new image set — 2026-07-20

## What changed
- New assets in `public/images/ultra/`: `main.jpeg` + `s1.jpeg`–`s6.jpeg` (1024×1024).
- DB product **39**: `image` → `/images/ultra/main.jpeg`; `images` → s1–s6 only (main not duplicated in gallery JSON).
- Updated `data/productConfig.ts` gallery for `'39'` (main + s1–s6 — config wins on web/mobile without prepending).
- Static fallbacks updated: `lib/products.ts`, OrderHistory fallback, SEO landing pages (EN/RU/AR), training pages (EN/AR/RU + mobile API), DownloadsSection, summer survival guide script.
- Order email safety: repointed **33** order items from old SPF50 paths → new main.
- Blog post `uae-summer-skincare-survival-guide-2026` (EN/AR/RU content) repointed from `SPF50.jpg` → `/images/ultra/main.jpeg`.
- Deleted `public/images/SPF50.jpg` and `public/images/Second/50big.jpg` after zero remaining orderItem refs.
- Global repair audit: **0** dead local orderItem images.

## Script
`npx tsx --env-file=.env.local scripts/update-product-39-images.ts --apply`

## Live (after deploy + ISR ~5 min)
- PDP: https://genosys.ae/products/39
- Main: https://genosys.ae/images/ultra/main.jpeg
- Gallery: `/images/ultra/s1.jpeg` … `s6.jpeg`
- Video unchanged: `/videos/ultra.mp4`
