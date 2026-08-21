# Product 47 HR³ MATRIX MESOPECIA KIT RU/AR localization audit

Date: 2026-08-21  
Product: `47` · HR³ MATRIX MESOPECIA KIT

## Outcome

Product 47 now has one source-grounded Russian/Arabic payload across the translation maps, bespoke PDP, quick facts, routine, hair-concern SEO, device references, chatbot and production database.

The live copy now describes a professional cosmetic scalp-care kit:

- HR³ MATRIX SCALP PEELING α · 100 ml
- HR³ MATRIX HAIR SOLUTION α · 4 ml × 6
- GENOSYS drum roller · 0.5 mm

The roller is not the flat 0.3 mm Hair Stamp used by HairGen BOOSTER. `STAMP(ROLLER)` is the carton wording; the product image and rolling instruction identify the applicator as a drum roller. The 0.5 mm evidence is the registered kit carton’s Russian panel.

## Source set

Primary local sources:

- `Registration DOC/Artwork/[GENOSYS]HAIR MATRIX MESOPECIA KIT.pdf`
- `Registration DOC/Artwork/[GENOSYS]HR3 MATRIX HAIR SOLUTION α_Homecare.pdf`
- `Registration DOC/Artwork/[GENOSYS]HR3 MATRIX HAIR SOLUTION α_Professional.pdf`
- `Registration DOC/Artwork/[GENOSYS]HR3 MATRIX SCALP PEELING α.pdf`
- `Registration DOC/SA/SA-GENOSYS HR3 MATRIX HAIR SOLUTION α.pdf`
- `Registration DOC/SA/SA-GENOSYS HR3 MATRIX SCALP PEELING α.pdf`
- `Registration DOC/COA/COA-GENOSYS HR3 MATRIX HAIR SOLUTION α(WNL122).pdf`
- `Registration DOC/COA/COA-GENOSYS HR3 MATRIX SCALP PEELING α(WNL088).pdf`
- `public/documents/PPT/GENOSYS HR3 MATRIX HAIR SOLUTION ALPHA.pdf`
- `public/documents/PPT/GENOSYS HR3 MATRIX SCALP PEELING ALPHA.pdf`
- `public/documents/PPT/GENOSYS_Microneedling_Protocols.pdf`
- `public/documents/PPT/Overview of Microneedling_S.pdf`
- `public/documents/PPT/Protocol_Hair_Loss.pdf`

Component facts are kept in parity with the completed product 45 and 46 audits.

## Corrected protocol

1. Apply about 5 ml Scalp Peeling α with a saturated cotton swab to intact scalp and massage.
2. Leave for five minutes without rinsing.
3. Dry scalp and hair fully before rolling. The kit carton’s Arabic panel states 2–5 minutes.
4. Open a fresh 4 ml Hair Solution α vial immediately before use and fit the dropper.
5. Part the hair. Roll a new GENOSYS roller slowly in straight passes while applying the solution with the dropper. Avoid zigzagging, jumping and curving.
6. Massage gently, discard the vial remainder, and discard the roller after one use.

Scalp Peeling is never applied after rolling or to already punctured skin.

The carton does not establish a treatment frequency, course length or session count. The six-vial contents are not converted into a claimed number of sessions.

## Safety boundary

- Avoid the kit during pregnancy and breastfeeding because Hair Solution carries that warning.
- Do not use the roller with metal allergy, keloid tendency, eczema or dermatitis.
- Do not use on damaged, infected or inflamed scalp.
- Do not share or reuse the roller.
- Use an opened Hair Solution vial immediately and discard any remainder.
- Continued hair loss requires medical assessment; this cosmetic kit does not replace diagnosis or treatment.

## Claims removed

Removed from RU/AR and shared fallback text:

- roller “opens the way” and solution “goes in behind it”
- driven-in, delivered-to-follicle and penetration framing
- hair-loss prevention or treatment
- hair regrowth
- DHT / 5α-reductase inhibition
- angiogenesis
- efficacy attributed to growth factors
- unsupported comparison presenting the kit as a manual version of HairGen BOOSTER
- unsupported savings and course/session arithmetic

Preserved cosmetic functions:

- Scalp Peeling α: scalp cleansing/refreshing
- Hair Solution α: nutrition supply and hair conditioning

## Implementation

- Added canonical localized payload: `data/product47LocalizedCopy.ts`
- Added audited bespoke PDP copy: `components/product/hr3/mesopeciaKitLocalizedCopy.ts`
- Wired the canonical maps in `data/productTranslations.ts` and `data/productTranslationsRu.ts`
- Replaced the product 47 routine’s incorrect Hair Stamp step with a dedicated 0.5 mm roller + Hair Solution step
- Added quick facts, chatbot boundary, hair-concern SEO context and corrected Hair-GENTRON comparisons
- Added idempotent updater: `scripts/update-product-47-localized-copy-20260821.ts`
- Added focused tests: `__tests__/data/product47LocalizedCopy.test.ts`
- Added the canonical data file to `.gitignore` exceptions

## Production database

The updater found product id `47`, set `productNumber` from `null` to `47`, synchronized `nameRu`, `nameAr`, descriptions and structured fields, cleared unsupported `usage`, and replaced `targetConcerns` with:

```json
["scalp cleansing","scalp refreshing","hair conditioning"]
```

The post-write field-by-field parity check returned `verified`.

## Verification

- `npx tsc --noEmit`
- focused ESLint on changed TS/TSX files
- focused Jest for products 46 and 47
- updater rerun to prove idempotency
- scoped git diff/status review

No commit or push was made.
