# Product 24 EyeCell Eye Contour Cream images — 2026-08-10

## Change

- Added cache-safe product 24 image set under `public/images/eye_cream/`:
  `main.jpeg` and `s1.jpeg`–`s6.jpeg`.
- Deployed assets and required HTTP 200 from every production URL before
  changing the live product or deleting old files.
- Updated the product 24 database main image and six-image gallery. The main
  image is excluded from the DB `images` array (gallery source of truth).
- Updated `lib/products.ts`, `lib/routineStepImages.ts`, and the animation demo card.
- Repointed historical order-item images used by order history, admin, and
  email rendering. No database blog posts referenced the old paths.
- Migration script: `scripts/update-product-24-images.ts`.

## Paths

| Role | Path |
|---|---|
| New main | `/images/eye_cream/main.jpeg` |
| New gallery | `/images/eye_cream/s1.jpeg` … `s6.jpeg` |
| Old main | `/images/EC.jpg` |
| Old gallery | `/images/Second/Eye_Cream_2.jpg` |

## Verification (done)

- All seven new JPEGs return **200** on production.
- Product 24 DB: `image` = `/images/eye_cream/main.jpeg`; `images` = s1–s6 only.
- Repointed **25** historical order items → new main (emails/order history).
- Database blog records on old paths: **zero**.
- Dead-order-image repair dry audit: **0 unresolved**.
- `/products/24` returns 200; API image points at new main.
- Removed legacy assets after cutover: `/images/EC.jpg`, `/images/Second/Eye_Cream_2.jpg`.
