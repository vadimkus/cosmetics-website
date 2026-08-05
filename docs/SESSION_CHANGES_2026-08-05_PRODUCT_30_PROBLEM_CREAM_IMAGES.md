# Product 30 Intensive Problem Control Cream images — 2026-08-05

## Change

- Corrected the requested target from product 33 (Eye Peptide Gel Patch) to
  product 30 (Intensive Problem Control Cream) after confirming the supplied
  images show the cream.
- Added a cache-safe gallery under `public/images/problem_cream/`:
  `main.jpeg` and `s1.jpeg`–`s6.jpeg`.
- Updated the product 30 database main image and gallery.
- Removed the legacy `data/productConfig.ts` image override so the database is
  the single source of truth for the gallery.
- Updated the static product and order-history fallbacks.
- Repointed historical order-item images and any database blog content using
  `/images/PRB.jpg` or `/images/Second/problem_duo.jpg`, including absolute
  GENOSYS URLs.
- Removed the obsolete assets only after the new images were deployed and all
  database references were migrated.

Product 33 was not changed.

## Verification

- New image files are 1254 × 1254 JPEGs and below 500 KB.
- New production image URLs return HTTP 200.
- Product 30 web and mobile APIs expose the new main image and six-image gallery.
- English, Arabic, and Russian product pages use the new image set.
- Historical order/email image references to the old paths are zero.
- Database blog references to the old paths are zero.
- Repository-wide dead-order-image audit reports zero unresolved rows.
