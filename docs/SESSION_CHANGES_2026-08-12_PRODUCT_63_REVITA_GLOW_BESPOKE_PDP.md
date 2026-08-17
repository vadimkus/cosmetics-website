# Product 63 — Revita Glow BB Cream bespoke PDP

Date: 2026-08-12
Scope: local changes only, in preparation for production go-live. Nothing deployed, nothing pushed, no database writes.

## What was built

Fourth bespoke PDP, following products 66 (Cerabarrier), 65 (Bio-Meso) and 64 (Hair Stamp).

- `components/product/revitaglow/RevitaGlowProductPage.tsx`
- `components/product/revitaglow/revitaGlowCopy.ts` — EN/RU/AR copy, verified facts only
- `components/product/revitaglow/revitaglow.css` — warm champagne/bronze scoped theme
- `components/product/bespokePdp.tsx` — registered `'63'`
- `app/products/[id]/page.tsx`, `app/ru/...`, `app/ar/...` — allowlist now `['63','64','65','66']`

Reuses the shared Cera primitives (`CeraGallery`, `CeraAccordion`, `CeraReveal`, `CeraSectionHeader`).

## Source of truth

All product facts come from the Intertek filing at
`/Users/vadimkus/Desktop/Drive/Genosys/Registration/Intertek/GENOSYS REVITA GLOW BB CREAM`,
not from the database. Verified:

- SPF 38 PA+++ from four filters: ethylhexyl methoxycinnamate 7.5%, ethylhexyl salicylate 5%,
  titanium dioxide (7.13% Bright / 6.18% Natural), zinc oxide 1.96%
- Niacinamide 2%, adenosine 0.04%, tocopheryl acetate 0.1%
- Eight herbal extracts, 10-vitamin complex
- 50 g, 12M PAO, made in Korea, dermatologically tested
- COA batches SW108 (#01 Bright) and SW109 (#02 Natural), packaged 30 Sep 2025
- Titanium dioxide is the only ingredient that differs between the two shades

## Database discrepancies found — CORRECTED IN LIVE DB on 2026-08-12 (Vadim approved)

Applied via `scripts/fix-product-63-verified-data.ts --apply`.
Originals backed up to `docs/backups/product-63-before-2026-08-12.json`.
Script is idempotent and dry-runs by default; re-running now reports "no change".


1. **Herb count wrong.** RU and AR descriptions say 7 herbal extracts. The filing has 8.
   The page says eight and names all of them.
2. **INCI incomplete.** The DB `fullInci` omits 1,2-Hexanediol, Parfum, citrus lemon peel oil,
   citrus aurantium peel oil, linalool, linalyl acetate, limonene, citronellol,
   tetramethyl acetyloctahydronaphthalenes and hydroxycitronellal.
   The page uses the verified carton/artwork INCI instead and adds an explicit
   fragrance + allergen disclosure that previously existed nowhere on the site.
3. **Cushion claims.** DB `benefits` contains "dedicated puff", "micro air-cell puff structure"
   and "7 Herb Complex". These belong to the separate Skin Caring Blemish Balm Cushion.
   Excluded from the page; an FAQ entry now explicitly disambiguates the two products.

All three are now fixed in the live database. Because the bespoke page hardcodes verified copy,
the visible product 63 page was already correct; the fix matters for the mobile app (API-driven,
no OTA needed), the production standard PDP, and search snippets.

### Still wrong in the DB, NOT changed (outside the approved scope)

`howToUse` step 3 reads "sets to a comfortable, transfer-resistant finish ... maintaining a smooth,
radiant complexion all day". "Transfer-resistant" and "all day" come from the same cushion copy and
are not supported by anything in the Intertek filing. The bespoke page does not use this field, but
the mobile app and the production standard PDP do. Recommend correcting on the next pass.

## Bugs fixed across all four bespoke PDPs

1. **Hardcoded English "sold".** All four pages rendered `{n}+ sold` literally instead of using
   `t('product.unitsSold', { count })` the way `ProductPageClientRefactored.tsx` does.
   Arabic showed "sold +20"; now "بيع أكثر من 20". Russian now "Продано 20+".
   Fixed in revitaglow, cerabarrier, biomeso and hairstamp.
2. **RTL bidi on shade codes.** `#01 Bright` rendered as `Bright ٠١#` in Arabic because `#`
   is a bidi-neutral character. All five render sites now wrap the label in
   `dir="ltr"` + `[unicode-bidi:isolate]`.

## Outstanding: the images are the go-live blocker

All five files in `public/images/revita/` are AI-generated with garbled fake packaging text:

| File | Problem |
|---|---|
| `main.jpg` | Garbled body copy on tube; shades labelled "#D1 Snghr" / "#02 Naturel" |
| `s1.jpg` | "10 Vitamins + 7 Herbs" (wrong), "All-Day Glow · No Transfer" (unsupported), "In One Tap" (cushion language) |
| `s2.jpg` | Cleanest of the five, but tube reads "BB CSEAM", "PODKEDIGENAEL", "Gene Re-Sisrk Systen" |
| `s3.jpg` | "HERB 7 COMPLEX" (wrong), "Treatment-grade coverage" (unsupported) |
| `s4.jpg` | Shows cushion puff application and "dedicated air-cell puff" — wrong product entirely |

`public/videos/revita.mp4` is fine and stays: portrait 720×1280, ~12.7 s, both shades dispensed
from tubes, no puff or cushion.

No real photography of this tube exists in the Drive — only the Intertek artwork PDF.

**Decision (Vadim, 2026-08-12): he will replace the images himself**, as with product 64.
Gallery code was deliberately left sourcing from the DB so replacements drop straight in.

### Reminder when replacing

`/images/*` is served `Cache-Control: immutable, max-age=1 year`. Never overwrite a filename in
place — repeat visitors keep the stale copy. Use new filenames and update the DB `images` field.
Also run `scripts/repair-dead-order-item-images.ts` before deleting the old main image.

## Verification

- 12/12 pages return 200 (products 63–66 × EN/RU/AR)
- Visible text scanned in all three locales: no puff / air-cell / one-tap / no-transfer /
  treatment-grade claims, correct herb count in each language
- Shade selection blocks add-to-cart until chosen; passes through as cart colour variant;
  sticky bar and trust badge update on selection
- Arabic RTL confirmed (`dir="rtl"` present only on the AR route)
- `npx eslint` on all four bespoke component folders: clean
- `npx tsc --noEmit`: only four pre-existing errors in `utils/formatProductDisplayName.tsx`,
  unrelated to this work
