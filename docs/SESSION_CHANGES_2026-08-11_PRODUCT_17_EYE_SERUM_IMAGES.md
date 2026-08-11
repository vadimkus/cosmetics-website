# Product 17 EyeCell Eye Contour Serum images — 2026-08-11

## Change

- Added cache-safe product 17 image set under `public/images/eye_serum/`:
  `main.jpeg` and `s1.jpeg`–`s7.jpeg`.
- Deployed assets and required HTTP 200 from every production URL before
  changing the live product or deleting old files.
- Updated the product 17 database main image and seven-image gallery. The main
  image is excluded from the DB `images` array (gallery source of truth).
- Updated `lib/products.ts`, `lib/routineStepImages.ts`, and the serum slides note.
- Repointed historical order-item images used by order history, admin, and
  email rendering.
- Migration script: `scripts/update-product-17-images.ts`.

## Paths

| Role | Path |
|---|---|
| New main | `/images/eye_serum/main.jpeg` |
| New gallery | `/images/eye_serum/s1.jpeg` … `s7.jpeg` |
| Old main | `/images/EYS.jpg` |
| Old gallery | `/images/Second/SERUM_2.jpg` |

## Verification

- All eight new JPEGs return **200** on production before DB cutover.
- Product 17 DB: `image` = `/images/eye_serum/main.jpeg`; `images` = s1–s7 only.
- Historical order/blog refs on old paths repointed.
- Dead-order-image repair dry audit: **0 unresolved** after cutover.
- Old `EYS.jpg` / `SERUM_2.jpg` removed only after live refs were clean.
