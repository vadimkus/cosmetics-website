# Product 41 BB Cushion images V2 — 2026-08-10

## Change

- Added cache-safe product 41 image set under `public/images/cushion_2/`:
  `main.jpeg` and `s1.jpeg`–`s6.jpeg` (includes `s3`, which the prior set lacked).
- Deployed assets and required HTTP 200 from every production URL before
  changing the live product or deleting old files.
- Updated the product 41 database main image and six-image gallery. The main
  image is excluded from the DB `images` array (gallery source of truth).
- Updated catalog/training/SEO/routine fallbacks that pointed at `/images/cushion/`.
- Repointed historical order-item and blog references used by order history,
  admin, and email rendering.
- Migration script: `scripts/update-product-41-images.ts`.

## Paths

| Role | Path |
|---|---|
| New main | `/images/cushion_2/main.jpeg` |
| New gallery | `/images/cushion_2/s1.jpeg` … `s6.jpeg` |
| Old main | `/images/cushion/main.jpeg` |
| Old gallery | `/images/cushion/s1.jpeg`, `s2.jpeg`, `s4.jpeg`, `s5.jpeg`, `s6.jpeg` |

## Verification

- All seven new JPEGs return **200** on production before DB cutover.
- Product 41 DB: `image` = `/images/cushion_2/main.jpeg`; `images` = s1–s6 only.
- Historical order/blog refs on old cushion paths repointed to new main/gallery.
- Dead-order-image repair dry audit: **0 unresolved** after cutover.
- Old `public/images/cushion/` assets removed only after live refs were clean.
