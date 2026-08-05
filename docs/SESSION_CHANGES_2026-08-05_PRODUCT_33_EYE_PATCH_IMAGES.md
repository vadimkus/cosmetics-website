# Product 33 EyeCell Eye Peptide Gel Patch images — 2026-08-05

## Change

- Added a cache-safe product 33 image set under `public/images/patch/`:
  `main.jpeg` and `s1.jpeg`–`s6.jpeg`.
- Deployed all seven new assets and required HTTP 200 from every production URL
  before changing the live product or deleting old files.
- Updated the product 33 database main image and six-image gallery. The main
  image is excluded from the DB `images` array so the database remains the
  gallery source of truth.
- Updated `lib/products.ts`, EN/RU/AR training surfaces, the mobile training API,
  and profile downloads to use the new main image.
- Repointed 14 historical order-item images used by order history, admin, and
  email rendering. No database blog posts referenced the old paths.
- Removed `public/images/Patch.jpg`,
  `public/images/Second/Patches_2.jpg`, and
  `public/images/Second/Patches_3.jpg` only after the production assets and
  database migration were verified.
- Added reusable dry-run/apply migration script
  `scripts/update-product-33-images.ts`.

## Verification

- All seven JPEGs are 1254 × 1254 and 64–206 KB.
- Product 33 DB state:
  - `image`: `/images/patch/main.jpeg`
  - `images`: `/images/patch/s1.jpeg` through `/images/patch/s6.jpeg`
- Historical order items remaining on old paths: zero.
- Database blog records remaining on old paths: zero.
- Repository-wide dead-order-image repair and final dry audit: zero unresolved.
- Product 33 only was migrated.
