# Product 41 SKIN CARING BLEMISH BALM CUSHION — new image set — 2026-07-23

## What changed
- New assets in `public/images/cushion/`: `main.jpeg` + `s1`, `s2`, `s4`, `s5`, `s6` (source set had no `s3`; all compressed ≤ ~430 KB, 1600×1600).
- DB product **41**: `image` → `/images/cushion/main.jpeg`; `images` → gallery only (main not duplicated).
- Static fallbacks updated: `lib/products.ts`, SEO landing pages (EN/RU/AR), training pages (EN/AR/RU + mobile API), DownloadsSection.
- Order email safety: repointed **104** order items from `/images/BBC.jpg` → new main.
- No blog posts referenced the old BBC paths.
- Deleted old assets after zero remaining orderItem refs:
  - `public/images/BBC.jpg`
  - `public/images/Second/full_C.jpg`
  - `public/images/Second/Shades.jpg`
  - `public/images/Second/Cushion_Container.jpg`
  - `public/images/Second/Cushion_Container2.jpg`
  - `public/images/Second/Cushion_Container_Spare.jpg`
- Global repair audit: **0** dead local orderItem images.
- Mobile app `data/productConfig.js` gallery fallback for `'41'` aligned with the new set (API remains primary).

## Script
`npx tsx --env-file=.env.local scripts/update-product-41-images.ts --apply`

## Live (after deploy + ISR ~5 min)
- PDP: https://genosys.ae/products/41
- Main: https://genosys.ae/images/cushion/main.jpeg
- Gallery: `/images/cushion/s1.jpeg`, `s2.jpeg`, `s4.jpeg`, `s5.jpeg`, `s6.jpeg`
