# Product 53 RU/AR localization audit

Date: 21 August 2026  
Product: `53` — INTENSIVE REPAIR COLLAGEN MASK

## Source hierarchy checked

Primary formula:

- `Registration DOC/Formula_up/Formula-GENOSYS INTENSIVE REPAIR COLLAGEN MASK.pdf` (2025)
- Cross-check: `Registration DOC/Formula/Formula-GENOSYS INTENSIVE REPAIR COLLAGEN MASK.pdf` (2022)

Pack and directions:

- `Registration DOC/Artwork/[GENOSYS]INTENSIVE REPAIR COLLAGEN MASK.pdf` (2024)
- `docs/SESSION_CHANGES_2026-08-14_COLLAGEN_MASK_PACKAGING_TRANSCRIPTION.md`

Batch checks:

- `Intertek_folder/Certififcate of Analysis/COA-GENOSYS INTENSIVE REPAIR COLLAGEN MASK(ABVMP001).pdf`
- `Registration DOC/COA/COA-GENOSYS INTENSIVE REPAIR COLLAGEN MASK(1AAZMP001).pdf`

Secondary formula cross-check:

- `Intertek_folder/Quali-quanti Ingredients/GENOSYS INTENSIVE REPAIR COLLAGEN MASK.pdf` (2017)

The 2017 quali-quanti file is not used for percentages. It conflicts with the two newer matching quantitative formula documents and contains a corrupted CAS entry.

No product-specific Safety Assessment report, DTS MG product deck, catalogue treatment page or clinical report was found for this mask. The official Glass Skin deck does not mention product 53. Therefore, packaging marketing language was not promoted into clinical efficacy.

## Verified product facts retained

- Format: one single-use non-woven sheet.
- Net weight: `23 g / 1 sheet`.
- Wear time: `15–20 minutes`, following the current English and Korean directions.
- Weekly frequency: not stated on the current pack.
- Opening: use immediately after opening; no PAO is printed for the single-use sachet.
- Testing statement: `DERMATOLOGICALLY TESTED`, localized as:
  - RU: `Дерматологически протестировано`
  - AR: `مختبر جلدياً`
- pH:
  - `6.67` on COA batch ABVMP001
  - `6.96` on COA batch 1AAZMP001
  - specification `6.50 ± 1.00`, normalized as `5.50–7.50`
- Origin: made in Korea.

## Quantitative formula retained

- Glycerin `10.052%`
- Butylene Glycol `8.010%`
- Combined humectant base `18.062%`
- Xanthan Gum `1.500%`
- Betaine `0.800%`
- Sodium Hyaluronate `0.500%`
- Citrus Paradisi (Grapefruit) Fruit Extract `0.475%`
- Centella Asiatica Extract `0.285%`
- Allantoin `0.200%`
- Hamamelis Virginiana (Witch Hazel) Extract `0.100%`
- Punica Granatum Fruit Extract `0.0942%`
- Glycine Soja (Soybean) Seed Extract `0.0942%`
- Hydrolyzed Collagen `0.0001% / 1 ppm`
- Alcohol `0.100%`
- Parfum (Fragrance) `0.010%`

The site now presents glycerin and butylene glycol as the formula base. Hydrolyzed collagen remains visible at its exact concentration as a skin-conditioning ingredient, without collagen-production, smoothing or firming claims.

## Ingredient and sensitivity disclosure

The RU/AR PDP, canonical payload, quick facts and database payload disclose:

- Alcohol `0.1%`
- Parfum (Fragrance) `0.01%`
- soybean extract

The registered INCI does not separately list fragrance allergens, so none were invented. Grapefruit, pomegranate, centella and witch hazel remain listed as formula components without unsupported soothing, toning or antioxidant efficacy.

## Claims removed

Removed from live RU/AR product copy:

- firmer, lifted or more elastic skin
- deep or long-lasting hydration
- barrier repair or protection
- calming reactive or sensitized skin
- softened fine lines
- visible radiance or brightening
- long-lasting results
- suitability for all skin types or mature skin
- professional-grade positioning
- “certified for skin”
- ingredient delivery claims
- claims about generous essence left for neck or hands
- collagen smoothing, firming or collagen-production mechanisms
- sodium hyaluronate holding many times its weight in water
- botanical soothing or toning
- a no-acids/no-retinoids safety rationale
- invented `2–3 times per week` directions
- inferred post-procedure use

Arabic `مختبر طبياً` was replaced with the precise dermatological wording `مختبر جلدياً`.

## Runtime and adjacency changes

- Added `data/product53LocalizedCopy.ts` as the canonical RU/AR payload.
- Routed both product number `53` and database CUID `cmgj9ifoi00008o07p4eqmfb7` to the canonical payload in both locale maps.
- Rewrote the bespoke Collagen Mask runtime in RU, AR and EN to keep all locales aligned.
- Added focused product 53 quick facts.
- Corrected the generic routine description in all three message bundles.
- Corrected the Anti-Aging Beauty Box item, steps and duration answers so they no longer invent a weekly mask frequency.
- Added a product-specific chatbot accuracy boundary.
- Stopped reusing the legacy S3/S5 claim slides as bespoke section art. Gallery files remain in place under the gallery-image rule until corrected artwork is re-exported under new filenames.
- Added an idempotent database updater with exact post-update parity checking.
- Normalized database `size` to `23 g / 1 sheet`.
- Cleared unsupported database targeting fields: `skinType`, `targetConcerns`, `usage` and `ageGroup`.

## Database update

Applied successfully to production row `cmgj9ifoi00008o07p4eqmfb7`.

- `productNumber` remained `53`.
- First run updated EN/RU/AR names and copy, structured product fields and normalized `size`.
- `skinType`, `targetConcerns`, `usage` and `ageGroup` were already null and remained null.
- Read-back parity returned `verified`.
- A second run returned every `changed` value as `false` and parity `verified`, confirming idempotency.

Run:

```bash
npx tsx --env-file=.env.local scripts/update-product-53-localized-copy-20260821.ts
```

The script:

1. resolves the record by product number, legacy id or exact product name;
2. checks that `productNumber: "53"` has no conflicting owner;
3. writes the complete EN/RU/AR payload and normalized fields;
4. reads the row back and fails on any mismatch;
5. can be run again safely, with all `changed` values expected to become `false`.

## Focused verification

Targeted coverage:

- `__tests__/data/product53LocalizedCopy.test.ts`
- canonical map identity by product number and CUID
- structured JSON validity
- exact pack, formula and pH facts
- fragrance, alcohol, soybean and full-INCI disclosure
- banned-claim and invented-frequency checks across live RU/AR
- routine, beauty-box and chatbot alignment

Completed checks:

- `npx tsc --noEmit` — passed.
- Targeted ESLint across the changed runtime/data/test files — passed.
- Direct `--no-ignore` lint of the database updater — passed.
- `npx jest __tests__/data/product53LocalizedCopy.test.ts --runInBand` — 7/7 passed.
- Scoped `git diff --check` — passed.
- Supplemental `__tests__/lib/productRoutines.test.ts` still reports an unrelated existing product 47 gap: `routineMesopeciaRollerTitle` has no entry in `ROUTINE_STEP_PRODUCT_IDS`. Product 53's routine order and localized copy pass in the focused audit test.

No commit or push was created.
