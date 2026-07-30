# Product 18 MOISTURE REPLENISHING HYALURON SERUM — new image set — 2026-07-30

## What changed
- New assets in `public/images/hyaluron_serum/`: `main.jpeg` + `s1.jpeg`–`s6.jpeg`
  (1254×1254). Renamed Finder `S1`–`S6` → lowercase `s1`–`s6` for Vercel case-safety.
- DB product **18**: `image` → `/images/hyaluron_serum/main.jpeg`; `images` →
  gallery only (main not duplicated in DB `images` JSON).
- Static fallbacks updated: `data/productConfig.ts`, `lib/products.ts`,
  training (EN/AR/RU + mobile API), DownloadsSection, OrderHistory,
  sample/test email fixtures, summer-survival-guide script.
- Order email safety: repointed **19** order items from `/images/HRS.jpg`
  (and absolute genosys.ae URLs) → new main.
- Blog: repointed `uae-summer-skincare-survival-guide-2026` content paths → new main.
- Deleted old assets after zero remaining orderItem refs:
  - `public/images/HRS.jpg`
  - `public/images/Second/hyalserum1.jpg`
- Left cream assets in `hyaluron/` alone (product **29**).
- Video unchanged: `/videos/hs_cream_serum.mp4`.

## Script
`npx tsx --env-file=.env.local scripts/update-product-18-images.ts --apply`

## Live (after deploy)
- PDP: https://genosys.ae/products/18
- Main: https://genosys.ae/images/hyaluron_serum/main.jpeg
- Gallery: `/images/hyaluron_serum/s1.jpeg` … `s6.jpeg`
- Video: `/videos/hs_cream_serum.mp4` (unchanged)
