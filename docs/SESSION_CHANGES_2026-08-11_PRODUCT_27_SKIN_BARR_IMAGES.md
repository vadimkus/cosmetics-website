# Product 27 Skin Barrier Protecting Cream images — 2026-08-11

## Change

- Added cache-safe product 27 image set under `public/images/skin_barr/`:
  `main.jpeg` and `s1.jpeg`–`s6.jpeg`.
- Deployed assets and required HTTP 200 from every production URL before
  changing the live product or deleting old files.
- Updated the product 27 database main image and six-image gallery. The main
  image is excluded from the DB `images` array (gallery source of truth).
- Removed legacy `images` override from `data/productConfig.ts` so DB owns the gallery.
- Updated catalog, routine, SEO, and desktop-experience fallbacks.
- Migration script: `scripts/update-product-27-images.ts`.

## Paths

| Role | Path |
|---|---|
| New main | `/images/skin_barr/main.jpeg` |
| New gallery | `/images/skin_barr/s1.jpeg` … `s6.jpeg` |
| Old main | `/images/BRR.jpg` |
| Old gallery | `/images/Second/bar_big.jpg` |

## Verification (done)

- All seven new JPEGs return **200** on production before DB cutover.
- Product 27 DB: `image` = `/images/skin_barr/main.jpeg`; `images` = s1–s6 only.
- Repointed **8** historical order items → new main (emails/order history).
- Database blog records on old paths: **zero**.
- Dead-order-image repair dry audit: **0 unresolved**.
- `/api/products/27` returns the new main + s1–s6 gallery.
- Removed legacy assets after cutover: `/images/BRR.jpg`, `/images/Second/bar_big.jpg`.
