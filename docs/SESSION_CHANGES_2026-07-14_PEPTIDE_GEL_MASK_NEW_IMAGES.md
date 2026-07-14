# Session — Peptide Gel Mask new images (2026-07-14)

## Request
Replace images on https://genosys.ae/products/37 (PEPTIDE GEL MASK) with
the new set in `public/images/peptide_mask/`.

## What was done
- New set: `main.jpeg` + `s1–s3.jpeg` (1024×1024). Gallery slides were
  ~650 KB — recompressed via `sips` quality 78 → **222–238 KB**.
  `main.jpeg` already 387 KB, left as-is.
- **DB** (via `scripts/update-product-37-peptide-images.ts --apply`):
  - `image` → `/images/peptide_mask/main.jpeg`
  - `images` (gallery, DB-only) → s1–s3 (main prepended by web + app)
- **6 historical order items** repointed from `/images/PEP.jpg` to the
  new main path.
- **Code refs** updated: `lib/products.ts`,
  `components/profile/OrderHistory.tsx`.
- `data/productConfig.ts` entry for `'37'` had pricing only (no legacy
  gallery) — no config change needed.
- **Deleted** old file: `public/images/PEP.jpg`.

## Paths
- Main: `/images/peptide_mask/main.jpeg`
- Gallery: `/images/peptide_mask/s1.jpeg` … `s3.jpeg`
- Product: https://genosys.ae/products/37
