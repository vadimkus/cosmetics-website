# Product 44 HR³ MATRIX MEDI SCALP SHAMPOO α ingredients — 2026-08-12

## Change
Product `/products/44` had `ingredients: null`. Added Intertek-backed key
ingredient cards plus a **Full INCI** entry.

## Source of truth
`Intertek/MEDI SHAMPOO ALPHA/Formula-GENOSYS HR3 MATRIX MEDI SCALP SHAMPOO α.pdf`
(also matches Artwork INCI listing)

## Also
- Corrected `lib/products.ts` key-ingredients line (removed Salicylic Acid /
  unverified HP-DCC wording not present in current MEDI Intertek formula).
- Added AR / RU ingredient translations.
- Migration script: `scripts/update-product-44-ingredients.ts`.

## Verify
- https://genosys.ae/products/44 — Key Ingredients accordion includes Full INCI
- `/api/products/44` returns non-null `ingredients` JSON
