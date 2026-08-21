# Product 61 RU/AR localization audit

Date: 2026-08-21  
Product: 61, HR³ MATRIX SCALP BRUSH

## Source conclusion

The exact-product source set remains unusually thin. The only manufacturer document found is:

- `public/documents/PPT/GENOSYS HR3 MATRIX SCALP BRUSH.pdf`

It confirms:

- soft silicone brush;
- a stable grip;
- wet use after shampoo has been worked into sufficient lather;
- massage/contact with the brush, followed by rinsing.

The PDF also prints rich-foam, deep-cleansing, oil/dead-cell/product-residue, blood-flow, thinning-prevention, scratch-free and volume claims. No product-specific test, measurement or clinical report was found behind them. They were therefore excluded from the live RU/AR copy despite appearing in the manufacturer deck.

The source does **not** state:

- silicone grade;
- dimensions, weight or tip count;
- country of origin;
- an exact movement pattern or duration;
- universal scalp suitability or an every-wash frequency;
- a cleaning, storage or calendar replacement protocol;
- contraindications or a post-procedure waiting interval;
- dry use or use to apply leave-on products.

The page now distinguishes those gaps from ordinary conservative hygiene and safety guidance. It does not invent a post-procedure interval.

## Live copy corrections

- Added `data/product61LocalizedCopy.ts` as the RU/AR canonical payload.
- Repointed both translation maps to that payload.
- Rewrote the bespoke RU/AR PDP around soft silicone, flexible tapered tips, stable grip, wet-shampoo use and controlled pressure.
- Removed live claims for blood flow, hair-loss/thinning prevention, hair volume, deep cleansing, dead-cell or product-residue removal, richer foam, scratch guarantees, universal suitability, fixed frequency, dry massage and leave-on absorption.
- Clarified that Product 44 is a wash-routine suggestion, not evidence of enhanced efficacy.
- Clarified that tonics and solutions are applied afterwards with fingertips, not with the brush.
- Added quick facts, routine copy, chatbot/fallback language and an idempotent production updater.
- Normalized the fallback and database format to `productNumber: 61` and `size: 1 pc`; the updater clears `skinType`, `targetConcerns` and `usage`.
- The updater verifies exact field parity and separately proves that `image`, `images` and `videoUrl` were not changed.

## Gallery and artwork

No image, gallery or video URL was changed. Per the gallery rule, the current studio slides remain on the product page.

Current slides `s3`–`s6` still contain customer-visible claim problems, including circulation, exfoliation, absorption, tonic/treatment preparation, a fixed 2–3 minute daily protocol and a broad no-scratch message. They were logged in `~/Desktop/genosys-artwork-corrections.html` for future re-export under new filenames. They were not removed or overwritten.

## Database updater

Run:

```bash
npx tsx --env-file=.env.local scripts/update-product-61-localized-copy-20260821.ts
```

The script:

1. resolves the product by `productNumber`, legacy id or exact-name fragment;
2. checks that product number 61 has no conflicting owner;
3. updates only audited text and normalization fields;
4. preserves asset URLs;
5. reads the record back and fails if exact parity or asset preservation does not hold.

## Focused regression coverage

`__tests__/data/product61LocalizedCopy.test.ts` verifies:

- canonical RU/AR map identity;
- the supported material, geometry, grip and wet-shampoo method;
- absence of positive blood-flow, volume, deep-cleansing, rich-foam, dead-cell, buildup, scratch-free, fixed-duration and absorption claims;
- separation from leave-on care;
- conservative condition-based replacement and intact-scalp guidance;
- no invented origin, dimensions, tip count or replacement calendar;
- Product 61 routine order: shampoo, then brush, with no leave-on treatment step.

## Production and verification

- Production product id: `cf2af89b-2cec-465a-8f00-7c65d82e931b`
- Updater first pass: audited fields changed, exact parity verified.
- Updater second pass: every audited field reported unchanged, proving idempotence.
- Preserved production assets:
  - image: `/images/brush_o/Main2.jpeg`
  - gallery: `/images/brush_o/s1.jpeg` through `/images/brush_o/s7.jpeg`
  - video: `/videos/brush.mp4`
- Existing localized blog post updated in place:
  - slug: `hr3-matrix-scalp-brush-where-shampoo-works`
  - id: `cmt0ztsj300005u8ogk2bt60l`
- RU and AR mobile route checks both returned HTTP 200 with:
  - `productNumber: 61`
  - `size: 1 pc`
  - Product 44 as the recommendation
  - six localized quick facts
  - two routine steps: shampoo, then brush
  - the preserved current image and video
- `npx tsc --noEmit`: passed.
- Focused Jest run: 4 suites, 204 tests passed.
- Full ESLint run: 0 errors; 171 pre-existing repository warnings.
- Scoped ESLint run: 0 errors; only ignored-file notices for JSON and scripts.
- `git diff --check`: passed.
- No commit or push was made.
