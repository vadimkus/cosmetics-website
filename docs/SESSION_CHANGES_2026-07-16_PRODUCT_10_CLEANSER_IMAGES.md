# Product 10 SNOW O₂ CLEANSER — new image set — 2026-07-16

## What changed
- New assets in `public/images/cleanser/`: `Main.jpg` + `S1.jpg`–`S6.jpg` (gallery compressed ~170–215 KB).
- DB product **10**: `image` → `/images/cleanser/Main.jpg`; `images` → S1–S6 only (main not duplicated in gallery JSON).
- Removed legacy gallery from `data/productConfig.ts` for `'10'` so DB wins over config.
- Static fallbacks updated: `lib/products.ts`, `OrderHistory.tsx`, demo card, summer guide script.
- Order email safety: repointed **80** relative + **5** absolute `…/SNOW.jpg` order items → new main.
- Deleted `public/images/SNOW.jpg` after zero remaining order/code refs.

## Script
`npx tsx --env-file=.env.local scripts/update-product-10-images.ts --apply`

## Live
- PDP: https://genosys.ae/products/10
- Main: https://genosys.ae/images/cleanser/Main.jpg
- Gallery: `/images/cleanser/S1.jpg` … `S6.jpg`
