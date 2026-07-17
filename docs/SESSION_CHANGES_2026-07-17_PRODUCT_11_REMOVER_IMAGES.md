# Product 11 SKIN DEFENDER REMOVER — new image set — 2026-07-17

## What changed
- New assets in `public/images/remover/`: `Main.jpg` + `S1.jpg`–`S6.jpg` (gallery compressed ~171–219 KB).
- DB product **11**: `image` → `/images/remover/Main2.jpg`; `images` → S1–S6 only (main not duplicated in gallery JSON).
- Removed legacy gallery from `data/productConfig.ts` for `'11'` so DB wins over config.
- Static fallbacks updated: `lib/products.ts`, training pages (EN/AR/RU), DownloadsSection, mobile training API.
- Order email safety: repointed **24** relative + **3** absolute `…/DEF.jpg` order items → new main.
- Deleted `public/images/DEF.jpg` and `public/images/Second/def_big.jpg` after zero remaining order/code refs.
- Global repair audit: **0** dead local orderItem images.

## Script
`npx tsx --env-file=.env.local --env-file=.env scripts/update-product-11-images.ts --apply`

## Live
- PDP: https://genosys.ae/products/11
- Main: https://genosys.ae/images/remover/Main2.jpg
- 2026-07-17 evening: main hero refreshed → `Main2.jpg` (immutable cache; 27 order items repointed).
- Gallery: `/images/remover/S1b.jpg` … `S6b.jpg`
- 2026-07-17 evening #2: gallery refreshed → `S1b`–`S6b` (immutable cache).
