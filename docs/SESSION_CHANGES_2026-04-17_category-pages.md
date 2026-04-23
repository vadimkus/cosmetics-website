# Category Landing Pages — Empty Results Fix (2026-04-17)

## Problem

On desktop, clicking any category tile from the homepage "The GENOSYS
professional range" section (e.g. "Professional Face Serums") opened
`/products/category/<slug>` and the page showed "No products found for
this category." Every category landing page was empty.

## Root Cause

Two mismatches between `lib/concernsData.ts` `CATEGORY_PAGES.categoryKey`
and the actual values stored in `product.category` in the DB:

1. **Case sensitivity.** The Prisma query in
   `lib/productsDb.ts:getProductsByCategory()` used
   `{ category: { contains: category } }` with Postgres' default
   case-sensitive matching. DB values are mixed-case (`"Serum"`,
   `"Cream"`, `"Mask"`, ...) but `categoryKey` was lowercased
   (`"serum"`, `"cream"`, ...), so nothing matched.

2. **Formatting.** Several slugs used hyphens while the DB uses spaces
   or slashes:
   - slug `pro-solution` vs DB `"PRO Solution"`
   - slug `toner-mist`   vs DB `"Toner/Mist"`
   - slug `scalp-hair`   vs DB `"Scalp/Hair"`
   - slug `eye-care`     vs DB `"Eye care"`
   - slug `bio-meso`     vs DB `"Bio Meso"`
   - slug `cushion-bb`   vs DB `"Cushion BB"`

## Fix

- `lib/productsDb.ts:getProductsByCategory()` now uses
  `{ contains, mode: 'insensitive' }` so substring matching works
  across case and also picks up multi-category products like
  `"Cushion BB, Sun, Cream"` on each of the three landing pages.
- `lib/concernsData.ts` — each `categoryKey` now stores the canonical
  DB category string (`"Serum"`, `"PRO Solution"`, `"Toner/Mist"`, …).
  URL slugs are unchanged (SEO-safe).
- `components/home/HomeDesktopSections.tsx` — category-image lookup
  compares both sides lowercased and falls back to substring match,
  so featured-products with multi-category strings still pick the
  right preview image.

## Verification

Script `scripts/check-categories.js` queries the production DB and
reports the number of matching products per landing page:

```
  1  /products/category/microneedling   (DB key: "Microneedling")
  7  /products/category/pro-solution    (DB key: "PRO Solution")
  2  /products/category/cleanser        (DB key: "Cleanser")
  2  /products/category/peeling         (DB key: "Peeling")
  3  /products/category/toner-mist      (DB key: "Toner/Mist")
  5  /products/category/serum           (DB key: "Serum")
 11  /products/category/cream           (DB key: "Cream")
  8  /products/category/mask            (DB key: "Mask")
  5  /products/category/sun             (DB key: "Sun")
  3  /products/category/cushion-bb      (DB key: "Cushion BB")
  6  /products/category/scalp-hair      (DB key: "Scalp/Hair")
  4  /products/category/eye-care        (DB key: "Eye care")
  3  /products/category/device          (DB key: "Device")
  1  /products/category/bio-meso        (DB key: "Bio Meso")
```

All 14 landing pages now return products. `npm run build` passed.
