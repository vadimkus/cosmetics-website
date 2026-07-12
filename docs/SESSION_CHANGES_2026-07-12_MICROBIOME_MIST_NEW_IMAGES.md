# Session — Microbiome Mist New Imagery (2026-07-12)

## Request
Replace the images on https://genosys.ae/products/14 (Microbiome Energy
Infusing Mist) with the new set in `public/images/mist/` and remove the
old ones.

## What was done
- New set: `main.jpeg` + `S1–S6.jpeg` (1024×1024). Gallery slides were
  580–674 KB — recompressed via `sips` quality 78 to 174–232 KB
  (main.jpeg already 376 KB, left as-is).
- **Gallery migrated to DB-only** per the product-gallery rule: removed
  the legacy `images` entry for '14' from `data/productConfig.ts`
  (config used to win over DB) and set the DB `images` field to the six
  S-slides (main is prepended automatically by web + app).
- DB `image` → `/images/mist/main.jpeg`.
- Code refs repointed from `/images/mist.jpg` to `/images/mist/main.jpeg`:
  `lib/products.ts`, `components/profile/DownloadsSection.tsx`,
  `app/training/TrainingClient.tsx`, `app/ru/training/page.tsx`,
  `app/ar/training/ArabicTrainingPageClient.tsx`,
  `app/api/mobile/training/route.ts`.
- **38 historical order items** repointed from the old path so past
  order thumbnails keep working.
- Deleted old files: `public/images/mist.jpg`,
  `public/images/Second/mist2.jpg` (new filenames — immutable cache rule
  respected).

## Verified live
- All 7 new URLs return HTTP 200.
- Mobile API `products/14`: `image` = main, `images` = main + S1–S6.
- EN and RU PDP HTML reference `images/mist/` (7 hits each after ISR).

## Deploy
- Commit `abe9ee3c`, pushed, Vercel deployed. Mobile app picks it up via
  API — no OTA needed.
