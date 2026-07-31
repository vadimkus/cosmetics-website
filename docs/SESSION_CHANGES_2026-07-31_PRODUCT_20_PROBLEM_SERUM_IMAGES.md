# Product 20 PROBLEM CONTROL SERUM — new image set — 2026-07-31

## What changed
- New assets in `public/images/problem_serum/`: `main.jpeg` + `s1.jpeg`–`s6.jpeg`
  (renamed `s5.jpg` / `s6.jpg` → `.jpeg` for consistency).
- DB product **20**: `image` → `/images/problem_serum/main.jpeg`; `images` →
  gallery only (main not duplicated in DB `images` JSON).
- Static fallbacks updated: `data/productConfig.ts`, `lib/products.ts`,
  training (EN/AR/RU + mobile API), DownloadsSection, OrderHistory.
- Order email safety: repointed **17** order items from `/images/PRSS.jpg` → new main.
- Blog scan: **no** posts referenced `PRSS.jpg`.
- Deleted old asset after zero remaining orderItem refs:
  - `public/images/PRSS.jpg`

## Script
`npx tsx --env-file=.env.local scripts/update-product-20-images.ts --apply`

## Live (after deploy)
- PDP: https://genosys.ae/products/20
- Main: https://genosys.ae/images/problem_serum/main.jpeg
- Gallery: `/images/problem_serum/s1.jpeg` … `s6.jpeg`
