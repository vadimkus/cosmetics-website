# Product 32 Multi Functional Anti-Wrinkle Cream images — 2026-08-03

## Change

- Added a cache-safe gallery under `public/images/multifunc_cream/`:
  `main.jpeg` and `s1.jpeg`–`s6.jpeg`.
- Deployed all seven assets before changing database or application references.
- Updated product 32 in the database:
  - `image` → `/images/multifunc_cream/main.jpeg`
  - `images` → `s1.jpeg`–`s6.jpeg` in the same folder
- Updated the product fallback and order-history fallback.
- Repointed all 38 historical product-32 order-item images, including absolute
  GENOSYS URLs, so customer emails, admin emails, notification resends, order
  history, and invoices continue to use a live image.
- Removed the obsolete `public/images/ANT.jpg` source asset only after the new
  gallery was live and the database migration completed.

The existing video remains `/videos/multif_cream.mp4`.

## Content verification

The gallery follows the locally verified product material in:

- `Registration DOC/MULTI FUNCTIONAL ANTI-WRINKLE CREAM/`
- Product formula and artwork files
- `docs/SESSION_CHANGES_2026-07-31_MFC_CREAM_6_SLIDES.md`

## Verification

- Seven new production URLs return HTTP 200.
- Product 32 database image and gallery use the new paths.
- Historical order items on the old image: zero.
- Repository-wide dead-order-image audit: zero repairable and zero unresolved.
