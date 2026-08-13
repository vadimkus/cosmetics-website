# Product 4 POWER SOLUTION HES images — 2026-08-13

## Change

- Added cache-safe product 4 image set under `public/images/hes_power/`:
  `main.jpeg` and `s1.jpeg`–`s7.jpeg` (1254×1254, 82–161 KB).
- Deployed assets and required HTTP 200 from every production URL before
  changing the live product or deleting old files.
- Updated the product 4 database main image and seven-image gallery. The main
  image is excluded from the DB `images` array (gallery source of truth).
- Product 4 had no `data/productConfig.ts` `images` override (already DB-owned).
- Updated catalog fallback (`lib/products.ts`) and homepage category-tile comment.
- Migration script: `scripts/update-product-4-images.ts`.

## Paths

| Role | Path |
|---|---|
| New main | `/images/hes_power/main.jpeg` |
| New gallery | `/images/hes_power/s1.jpeg` … `s7.jpeg` |
| Old main | `/images/HES.jpg` |
| Old gallery | `/images/Second/hes_big1.jpg`, `/images/Second/hes_big2.jpg` |

## Verification (done)

- All eight new JPEGs return **200** on production before DB cutover.
- Product 4 DB: `image` = `/images/hes_power/main.jpeg`; `images` = s1–s7 only.
- Repointed **2** historical order items → new main (emails/order history).
- Database blog records on old paths: **zero**.
- Removed legacy assets after cutover: `HES.jpg`, `Second/hes_big1.jpg`, `Second/hes_big2.jpg`.
