# Arabic and Russian translation audit — all 66 live products

Date: 2026-08-12

Full element-by-element audit of every live product for missing or wrong Arabic and
Russian content, plus the fixes that closed the gaps.

## How localisation actually works here

Worth writing down, because it is not obvious and it caused a wrong diagnosis earlier
in the day:

- Product copy for Arabic and Russian comes from `data/productTranslations.ts` and
  `data/productTranslationsRu.ts`. These **take precedence** over the
  `Product.descriptionAr` / `descriptionRu` database columns.
- The database columns still matter for the mobile API list payload, search, SEO
  metadata and feeds, so they should not be left empty.
- Spec-row **labels** (`Form:`, `Size:`, …) come from `messages/{en,ar,ru}.json` via
  `formatKey()` in `components/product/ProductContentDisplay.tsx`. A `productDetails`
  key with no `product.detailX` message falls back to a Title-Cased English label on
  every locale — so a missing message key is a silent localisation hole.

## Audit tooling

- `scripts/_audit-translations-deep.ts` — presence, script (Arabic/Cyrillic vs Latin),
  JSON validity, type parity, list length parity, and `productDetails` key parity.
- `scripts/_audit-rendered-parity.ts` — re-checks list parity *after* the Full INCI
  fallback runs, which separates real content gaps from expected render-time additions.

Real list-parity gaps went from 26 to 1, and the one remaining case is Russian
carrying an extra benefit row for product 2, which is content the English record
does not have rather than a gap.

## Fixes applied

### Ingredient lists

- Eight Arabic lists (12, 17, 19, 24, 26, 33, 38, 50) were arrays of plain strings
  where the renderer expects `{ name, description }` objects, so those products showed
  blank rows in the Key Ingredients block. Rebuilt as objects from the English source.
- Product 23's Arabic list had unescaped quotes around a "Botox-like" claim, which made
  the field unparseable JSON. Replaced with wording aligned to the English semantics.
- Aligned lists against the Intertek / DTS MG filings rather than against each other:
  added Niacinamide 2% (41), the UV filter system (42), Arbutin 2% (9),
  Lactobacillus/Pumpkin Ferment Extract (19, RU) and Copper Tripeptide-1 (46);
  rebuilt 45 outright; and removed claims the declared INCI does not support —
  Fermented Green Tea Extract and Hyaluronic Acid (51), Sophora Japonica and
  Grapefruit Seed Oil (46), plus extra rows on 52 and 53.
- Product 43's English `Full INCI` row still described the pre-alpha formula. Corrected
  in the database (`scripts/fix-product-43-alpha-inci.ts`).

### Full INCI fallback

`lib/localizedIngredients.ts` appends the English Full INCI row to a localised list at
render time with a localised label, rather than duplicating a 1-2 KB INCI string across
65 product/locale pairs. It handles products with more than one INCI row (product 38 has
one per component) and localises the qualifier, e.g. `Full INCI (Gel)`.

Wired into `ProductContentDisplay` and both mobile product endpoints so web and app agree.

### Benefits

- Added the missing benefit row on 12, 17, 24, 26 and 38 (Arabic).
- Rebuilt product 63's Arabic and Russian benefits: they described a cushion puff that
  belongs to product 41.

### Spec rows (`productDetails`)

- Authored the missing keys for 2, 3, 26, 38, 44, 48, 50, 60, 61, 62, 65 and 66.
- Added 34 `product.detailX` label messages in all three locales and mapped them in
  `formatKey()`. Every `productDetails` key in use now has a localised label; previously
  33 keys rendered English labels on Arabic and Russian pages, and `totalLEDs` rendered
  as "Total L E Ds".
- Internal keys are now filtered out of the spec table: `pdfBrochure` (a raw
  `/documents/...` path, already offered through the Product Documentation buttons) and
  `perfectCombination*` (duplicates the localised pairing block; `perfectCombinationId`
  was leaking a bare product id as a spec row on product 61).

### Database columns

`scripts/fill-localized-description-columns.ts` filled the empty `descriptionAr` /
`descriptionRu` columns for 2, 64 and 66 from the translation files.

## Product 49 (GENO-LED IR II) — English record was fabricated

The English record described a portable, FDA-cleared, battery-powered home device
emitting 630-660nm and 800-1000nm, with "medical-grade" LED technology. None of that is
true of this product. The manufacturer's own listing
(`genosys.info/en/21_en/50`, corroborated by distributor listings) documents a
mains-powered professional dome:

- five wavelengths — 423nm blue, 532nm green, 583nm yellow, 640nm red, 830nm infrared
- 1,710 LED elements — 380 each visible colour, 190 infrared
- dome shape to reduce light loss and hold the irradiation distance
- under 10% output loss after 20,000 hours
- whole-body total care, painless, no photo-aging, scarring or heat damage

The Arabic translation already matched the manufacturer. English and Russian did not.
`scripts/fix-product-49-geno-led-ir2.ts` rewrote the English database record
(description, key features, benefits, specs, usage, directions), rewrote the Russian
entry to match, and aligned the Arabic spec keys with the corrected English key set.
Backup at `backups/product-49-before-geno-led-fix.json`.

## Open items

- Product 2 (Needle Pen-K) English benefits still claim "Medical-grade device delivers
  clinical-quality results at home". The Russian copy avoids the claim. Same class of
  unsupported regulatory claim we removed from product 64; left alone because it is an
  English content decision, not a translation gap.
- Product 48 (Hair-GENTRON) Arabic specs describe air-pressure massage where English
  says only "massaging". Plausible for this device class but not confirmed against a
  leaflet.
- Remaining `KEY_DIFF` audit rows are cases where Arabic or Russian carry *more* spec
  rows than English, or use `type`/`form` interchangeably. Not gaps.

## Not deployed

The bespoke product pages (products 63, 64, 66 under `components/product/*/`), the
`formatProductDisplayName` title work and the product option dialog label change are
local-only and deliberately excluded from this push.
