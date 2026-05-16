# Product Arabic Translation Review — May 16, 2026

## Context

Vadim requested a product-by-product Arabic translation review and improvement pass.

## Scope

Reviewed and updated all visible products in the live database:

- Core skincare products
- Toners, mists, cleansers, serums, creams
- Eye care products
- Masks, SPF, BB/cushion products
- PRO Solution ampoules
- Scalp and hair products
- Professional devices
- Bio Meso PDRN
- Beauty Boxes and kits

## Main Improvements

- Added missing `nameAr` values for visible products.
- Rewrote machine-translated Arabic descriptions into natural customer-facing Arabic.
- Kept recognizable GENOSYS and English product names inside Arabic titles for clarity.
- Replaced awkward literal terms:
  - `ضباب` → `رذاذ`
  - `الميكرونيدلينج` / literal needle phrasing → `الميكرونيدلينغ`
  - `مخاوف البشرة` → `مشاكل البشرة` / direct concern-specific wording
  - `تثبيت البشرة` → `تماسك البشرة` / `شد البشرة` depending on context
  - English leftovers like `minimal` removed
- Shortened overly long Beauty Box descriptions while keeping the included product logic clear.

## Verification

- Database scan found `0` visible products missing Arabic name or Arabic description.
- Database scan found `0` hits for the audited problem patterns.
- Product cache revalidation via `/api/revalidate` was attempted, but `REVALIDATE_SECRET` was not available in the local environment, so production cache was not flushed from this session.

## Files / Data Changed

- Live database table: `products`
- Fields changed: `nameAr`, `descriptionAr`, `updatedAt`
