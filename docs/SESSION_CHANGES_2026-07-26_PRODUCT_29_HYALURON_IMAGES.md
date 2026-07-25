# Product 29 MOISTURE REPLENISHING HYALURON CREAM — new image set — 2026-07-26

## What changed
- New assets in `public/images/hyaluron/`: `main.jpeg` + `s1.jpeg`–`s6.jpeg`
  (1254×1254, all ≤ ~180 KB). Source folder was renamed from typo `hayluron`
  → `hyaluron`.
- DB product **29**: `image` → `/images/hyaluron/main.jpeg`; `images` →
  gallery only (main not duplicated).
- Static fallbacks updated: `data/productConfig.ts`, `lib/products.ts`,
  training pages (EN/AR/RU + mobile API), DownloadsSection.
- Order email safety: repointed **33** order items from `/images/HER.jpg` →
  new main.
- Blog scan (18 posts): **no** posts referenced `HER.jpg` / `hyabig` — nothing
  to rewrite in blog HTML.
- Deleted old assets after zero remaining orderItem refs:
  - `public/images/HER.jpg`
  - `public/images/Second/hyabig.jpg`
- Left `HRS.jpg` / `Second/hyalserum1.jpg` alone (product **18** serum).
- Global repair audit: **0** dead local orderItem images.

## Script
`npx tsx --env-file=.env.local scripts/update-product-29-images.ts --apply`

## Live (after deploy + ISR ~5 min)
- PDP: https://genosys.ae/products/29
- Main: https://genosys.ae/images/hyaluron/main.jpeg
- Gallery: `/images/hyaluron/s1.jpeg` … `s6.jpeg`
- Video unchanged: `/videos/hyal_cream.mp4`
