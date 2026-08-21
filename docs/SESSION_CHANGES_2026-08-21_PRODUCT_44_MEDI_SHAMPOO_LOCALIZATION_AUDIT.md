# Product 44 RU/AR localization audit

## Scope

Full Russian and Arabic customer-copy audit for **HR³ MATRIX MEDI SCALP
SHAMPOO α**, product 44. The production framing is the function registered
outside Korea: **scalp and hair cleansing**. The product is not presented as a
hair-loss, hair-growth or dandruff treatment.

## Sources checked

- `MEDI SHAMPOO ALPHA/Formula-GENOSYS HR3 MATRIX MEDI SCALP SHAMPOO α.pdf`
  for the current signed formula, INCI order and exact percentages.
- `MEDI SHAMPOO ALPHA/Artwork-GENOSYS HR3 MATRIX MEDI SCALP SHAMPOO α(300ml).pdf`
  for the 300 ml size, multilingual use method, registered function and
  precautions.
- `MEDI SHAMPOO ALPHA/COA-GENOSYS HR3 MATRIX MEDI SCALP SHAMPOO α.pdf`
  for measured pH 5.6, the 4.50–6.50 specification and finished-product
  checks.
- `Ingredient lists_old/HR3 MATRIX SCALP & HAIR SHAMPOO.pdf` as historical
  context only. It is not the current α formula and does not override it.
- `Intertek_folder/Safety Assessment Report/24 HR3 MATRIX SCALP & HAIR SHAMPOO.pdf`
  as safety history for the earlier shampoo, including the under-three menthol
  restriction. Current copy follows the current artwork precautions.
- `public/documents/PPT/GENOSYS HR3 MATRIX SCALP SHAMPOO ALPHA.pdf` for DTS MG
  product-training context. Korea-specific KFDA and hair-loss language was not
  transferred into UAE customer claims.

## Corrections

- Rebuilt canonical and bespoke RU/AR copy around a premium cleansing and
  cooling proposition.
- Preserved caffeine 1.000%; menthol 1.120%; menthyl lactate 0.080%; sodium
  C14-16 olefin sulfonate 14.100%; coco-betaine 5.250%; coco-glucoside 0.240%;
  decyl glucoside 0.160%; glycerin 2.753%; sorbitol 0.210%; fragrance 0.300%;
  and piroctone olamine 0.010%.
- Preserved trace panthenol 75 ppm, biotin 2 ppm, saw palmetto 1 ppm and copper
  tripeptide-1 10 ppb without assigning functional effects to those amounts.
- States precisely that the formula contains no SLS or SLES while its main
  cleanser is a **sulfonate**, not a sulfate. It does not use an unqualified
  broad `sulfate-free` positioning.
- Preserved the panel method: use 3–5 ml on damp scalp, leave the lather about
  three minutes, then rinse thoroughly. No universal daily frequency is
  claimed.
- Preserved the exact safety boundary: not for children under three; do not use
  around the eye area; avoid eyes and mucous membranes; rinse immediately and
  thoroughly with cool water after contact.
- Removed KFDA approval, hair-loss prevention or improvement, hair-growth
  environment, sebum control, circulation, patented-technology, all-scalp,
  daily-use, antifungal and dandruff-treatment claims.
- Reframed scalp-care concern and category SEO, routines, quick facts, pairing
  copy, scalp-brush copy and chatbot guidance so none turns product 44 into a
  treatment.

## Implementation

- Canonical RU/AR: `data/product44LocalizedCopy.ts`
- `.gitignore` build exceptions now include product 43 and 44 canonical copy
  modules; both were otherwise silently excluded by `/data/*`.
- Runtime maps: `data/productTranslations.ts`,
  `data/productTranslationsRu.ts`
- Bespoke PDP: `components/product/hr3/mediShampooLocalizedCopy.ts`, consumed
  by `components/product/hr3/mediShampooCopy.ts`
- Supporting surfaces: `lib/productQuickFactsCatalog.ts`,
  `messages/ru.json`, `messages/ar.json`, `lib/concernsData.ts`,
  `components/product/scalpbrush/scalpBrushCopy.ts`, `lib/chatbot/config.ts`,
  and the static fallback in `lib/products.ts`
- Focused tests: `__tests__/data/product44LocalizedCopy.test.ts`
- Idempotent DB alignment:
  `scripts/update-product-44-medi-shampoo-record-20260817.ts`

## Database parity

The updater resolves exactly one record by `productNumber`, legacy `id`, or
the MEDI SCALP SHAMPOO name, assigns `productNumber: "44"`, clears unsupported
generic `usage` and `skinType`, sets adult/scalp-care targeting, writes the
audited fields, rereads the row and fails if any expected field differs.

## Verification

- Focused Jest localization and related routine suites: **3 suites, 21 tests
  passed**.
- Targeted ESLint, including the normally ignored updater script: **passed
  with zero warnings or errors**.
- TypeScript `npx tsc --noEmit`: **passed**.
- Production database update: **passed**. The updater was run twice to verify
  idempotence; both runs returned `id=44, productNumber=44` with exact
  post-write parity.
- Scoped `git diff --check` for every product 44 file: **passed**. The
  repository-wide check also found two pre-existing whitespace issues outside
  this task in `app/ru/training/page.tsx` and
  `docs/SESSION_CHANGES_2026-08-17_FAYY_HEALTH_BASIC_CLEANSE.md`; neither was
  modified here.
- No commit or push.
