# Product 38 EZ CO₂ MASK KIT images — 2026-08-11

## Change

- Added cache-safe product 38 image set under `public/images/ez_mask/`:
  `main.jpeg` and `s1.jpeg`–`s8.jpeg`.
- Deployed assets and required HTTP 200 from every production URL before
  changing the live product or deleting old files.
- Updated the product 38 database main image and eight-image gallery. The main
  image is excluded from the DB `images` array (gallery source of truth).
- Removed legacy `images` override from `data/productConfig.ts` so DB owns the gallery.
- Updated catalog, routine, training, downloads, and fallback image refs.
- Migration script: `scripts/update-product-38-images.ts`.

## Paths

| Role | Path |
|---|---|
| New main | `/images/ez_mask/main.jpeg` |
| New gallery | `/images/ez_mask/s1.jpeg` … `s8.jpeg` |
| Old main | `/images/EZE.jpg` |
| Old gallery | `/images/Second/ez.jpg`, `/images/Second/ez1.jpg` |

## Verification (done)

- All nine new JPEGs return **200** on production before DB cutover.
- Product 38 DB: `image` = `/images/ez_mask/main.jpeg`; `images` = s1–s8 only.
- Repointed **10** historical order items → new main (emails/order history).
- Database blog records on old paths: **zero**.
- Removed legacy assets after cutover: `EZE.jpg`, `Second/ez.jpg`, `Second/ez1.jpg`.
