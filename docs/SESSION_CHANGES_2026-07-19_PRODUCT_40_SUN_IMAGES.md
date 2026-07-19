# Product 40 MULTI SUN CREAM SPF 40 — new image set — 2026-07-19

## What changed
- New assets in `public/images/sun/`: `main.jpeg` + `s1.jpeg`–`s6.jpeg` (1024×1024; compressed with `sips` where needed).
- DB product **40**: `image` → `/images/sun/main.jpeg`; `images` → s1–s6 only (main not duplicated in gallery JSON).
- Updated `data/productConfig.ts` gallery for `'40'` so config matches DB.
- Static fallbacks updated: `lib/products.ts`, OrderHistory fallback, SEO landing pages (EN/RU/AR), summer survival guide script.
- Order email safety: repointed **16** order items from `/images/SSUN.jpg` → new main.
- Blog post `uae-summer-skincare-survival-guide-2026` (EN/AR/RU content) repointed from `SSUN.jpg` → `/images/sun/main.jpeg`.
- Deleted `public/images/SSUN.jpg` and `public/images/Second/40big.jpg` after zero remaining orderItem refs.
- Global repair audit: **0** dead local orderItem images.

## Script
`npx tsx --env-file=.env.local scripts/update-product-40-images.ts --apply`

## Live (after deploy + ISR ~5 min)
- PDP: https://genosys.ae/products/40
- Main: https://genosys.ae/images/sun/main.jpeg
- Gallery: `/images/sun/s1.jpeg` … `s6.jpeg`
- Video unchanged: `/videos/sun2.mp4`
