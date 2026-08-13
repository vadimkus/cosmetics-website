# Product 4 POWER SOLUTION HES images — 2026-08-13

## Change

- Added cache-safe product 4 image set under `public/images/hes_power/`:
  `main.jpeg` and gallery slides (1254×1254, 82–161 KB).
- Deployed assets and required HTTP 200 from every production URL before
  changing the live product or deleting old files.
- Updated the product 4 database main image and seven-image gallery. The main
  image is excluded from the DB `images` array (gallery source of truth).
- Product 4 had no `data/productConfig.ts` `images` override (already DB-owned).
- Updated catalog fallback (`lib/products.ts`) and homepage category-tile comment.
- 13 Aug afternoon: replaced gallery S1 with `/images/hes_power/s1new.jpeg`
  (new filename; did not overwrite `s1.jpeg` in place). Removed `s1.jpeg`
  after live PDP HTML pointed at `s1new.jpeg`.
- Migration scripts: `scripts/update-product-4-images.ts`,
  `scripts/update-product-4-s1-image.ts`.

## Paths

| Role | Path |
|---|---|
| New main | `/images/hes_power/main.jpeg` |
| New gallery | `/images/hes_power/s1new.jpeg`, `s2.jpeg` … `s7.jpeg` |
| Old main | `/images/HES.jpg` |
| Old gallery | `/images/Second/hes_big1.jpg`, `/images/Second/hes_big2.jpg` |

## Verification (done)

- All eight new JPEGs return **200** on production before DB cutover.
- Product 4 DB: `image` = `/images/hes_power/main.jpeg`; `images` = `s1new` + s2–s7.
- Repointed **2** historical order items → new main (emails/order history).
- Database blog records on old paths: **zero**.
- Removed legacy assets after cutover: `HES.jpg`, `Second/hes_big1.jpg`, `Second/hes_big2.jpg`, `hes_power/s1.jpeg`.
