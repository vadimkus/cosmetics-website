# Product 20 Problem Control Serum images V2 — 2026-08-03

## Change

- Added a cache-safe replacement gallery under `public/images/problems_serum/`:
  `main.jpeg` and `s1.jpeg`–`s6.jpeg`.
- Each image is a progressive 1254×1254 JPEG between 68 KB and 158 KB.
- Deployed the new assets before changing references, preventing temporary
  broken images during the migration.
- Updated product 20 in the database:
  - `image` → `/images/problems_serum/main.jpeg`
  - `images` → `s1.jpeg`–`s6.jpeg` in the same folder
- Updated the website fallback, existing product config gallery, EN/AR/RU
  training surfaces, mobile training API, profile downloads, and order-history
  fallback.
- Repointed all 17 historical product-20 order-item images to the new main
  image so old order views, customer emails, admin emails, and notification
  resends remain valid.
- Removed the complete old `public/images/problem_serum/` image set after the
  new files were live and database references were migrated.

The product video remains `/videos/problem_serum.mp4`; only image paths changed.

## Content verification

The image claims were previously re-verified against:

- `Ingredient lists_old/GENOSYS PROBLEM CONTROL SERUM.pdf`
- `Registration DOC/Artwork/[GENOSYS]PROBLEM CONTROL SERUM.pdf`
- Product COA `WND018` (pH 5.62)

## Safety checks

- All seven new production asset URLs return HTTP 200.
- Product/database references contain the new cache-safe paths.
- Historical order-item image migration completed for all 17 rows.
- The dead-order-image audit must report zero unresolved rows after deletion.
