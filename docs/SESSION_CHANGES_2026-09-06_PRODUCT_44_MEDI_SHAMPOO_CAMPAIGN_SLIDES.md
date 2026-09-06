# Product 44, HR³ MATRIX MEDI SCALP SHAMPOO α: September 2026 campaign slides

Date: 2026-09-06. Commit `429326f6`. DB applied after deploy.

## Files

`public/images/shampoo_o/`: `Main.jpeg` (pump bottle, padded 1122×1402 → 1402² on white), `S1`–`S7.jpeg`
(the seven WhatsApp exports in numeric order), `S8.jpeg` (`insta.jpeg` story format, padded square),
`Closing.jpeg`.

Order: S1 hair growth has a favourite place · S2 19.750% cleansing system, no SLS/SLES · S3 1.000%
caffeine · S4 1.200% cooling system · S5 2.753% glycerin, 0.210% sorbitol, pH 5.6 · S6 the root is only
the beginning · S7 the dream team (shampoo + tonic + brush) · S8 want the rest? start at the root ·
Closing 300 ml card.

## Claims, checked against `Intertek/MEDI SHAMPOO ALPHA/Formula-… α.pdf` and the COA

- 19.750% = sodium C14-16 olefin sulfonate 14.100 + coco-betaine 5.250 + coco-glucoside 0.240 + decyl glucoside 0.160. ✓
- No SLS/SLES: no sulfate surfactant in the formula. ✓
- Caffeine 1.000%. ✓  Menthol 1.120% + menthyl lactate 0.080% = 1.200%. ✓
- Glycerin 2.75337%, sorbitol 0.210%. ✓  pH 5.6 on the COA (spec 4.50–6.50). ✓
- Note: `Ingredient lists_old/HR3 MATRIX SCALP & HAIR SHAMPOO.pdf` is the SLES predecessor, not this product.

## Where it landed

DB `image` + `images` (`scripts/set-product-44-slides-20260906.ts`), `lib/products.ts` fallback,
`lib/routineStepImages.ts`, `lib/blogImageDimensions.server.ts`, cache key v68 → v69. The bespoke
`MediShampooProductPage` reads the DB row only, no inline slide paths. `data/productConfig.ts` has no
gallery for 44 (video only). Cut-out `44-v2.webp`, clean single-pass trace. Old `shampoo/` stays on disk.

## Verified live

EN/RU/AR `/products/44` reference Main, S1–S8, Closing and `cutout/44-v2`; no `shampoo/*.jpg` left.
