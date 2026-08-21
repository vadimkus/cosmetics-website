# Product 64 RU/AR localization audit

**Date:** 21 August 2026  
**Product:** 64 · Hair Stamp for HairGen Booster  
**Scope:** Source-grounded Russian and Arabic catalogue, bespoke PDP, routine, concern/SEO, chatbot, fallback, mobile parity and production record.

## Source conclusion

### Manufacturer user manual

`~/Desktop/Drive/Genosys/Training Materials/HairGen_Booster/User's manual-Hairgen Booster.pdf`

The manual supports:

- physical assembly: remove the cap and metal lid from HR³ MATRIX HAIR SOLUTION α, fit the Hair Stamp to the vial, and load the vial-and-stamp set into HairGen Booster;
- three selectable operating levels;
- automatic stop after 10 minutes;
- use only with cosmetics recommended for the system;
- contraindications for progressive acne, eczema or dermatitis, diabetic complications or another serious disease, keloid tendency or metal allergy, and inflamed or infection-risk areas;
- stopping and seeking medical advice for rash, allergic reaction or another undesirable effect.

The manual does **not** state needle count, needle depth, needle material, sterility, pack count, efficacy, solution absorption, a treatment frequency or a comfort guarantee.

### DTS MG leaflet, 17 June 2021

`~/Desktop/Drive/Genosys/Training Materials/HairGen_Booster/210617_Hairgen Booster leaflet-small.pdf`

The leaflet supports:

- **52 microneedles** per Hair Stamp;
- **a new solution + applicator set for every treatment**;
- three speeds: 280, 330 and 400 RPM;
- 10-minute non-stop operating time and automatic stop.

The same leaflet also carries unsupported alopecia-treatment, permeability, follicular delivery, wound-healing, angiogenesis, circulation, hair-cycle and comfort claims. Those statements were not carried into the revised customer copy because no study report, protocol, subject count or quantified endpoint is held.

The leaflet says the solution is absorbed within 10 minutes. The revised copy does not repeat that claim. Ten minutes is described only as the documented device operating cycle.

### Current pack and retail artwork

- The current main packshot physically shows **eight stamp heads**.
- Current retail copy and stock handling use one box of eight.
- `0.3 mm` appears in the current promotional artwork, but not in either manufacturer document. It remains explicitly **artwork-only and unconfirmed**.
- The current artwork does not establish needle material or sterility.
- A metal-allergy contraindication does not establish a metal grade.

### Handling boundary

The leaflet's new-applicator-per-treatment instruction supports one-session use. The live copy treats each stamp as personal, single use and not to be shared. This is a handling rule, not a sterility, disinfection or cross-contamination guarantee.

## Copy changes

Added `data/product64LocalizedCopy.ts` as the canonical RU/AR source and connected it to:

- `data/productTranslations.ts`;
- `data/productTranslationsRu.ts`;
- product number `64`;
- production CUID `cmqep332d00gef4ej9y2ajz41`.

The revised copy now carries only:

- one box · eight stamps;
- 52 microneedles per stamp;
- physical fit with HairGen Booster and the HR³ MATRIX HAIR SOLUTION α vial;
- one new solution and one new applicator for each session;
- three documented speeds;
- the 10-minute automatic stop;
- the manual contraindications;
- the explicit unconfirmed status of the artwork-only 0.3 mm figure.

Removed across live RU/AR text:

- follicle or tissue delivery;
- increased permeability or microchannel advantage;
- automatic solution feeding/delivery;
- even rate, even pressure or even coverage;
- wound healing, regeneration, collagen, angiogenesis or circulation;
- hair-growth or hair-loss treatment;
- minimal discomfort or massage-not-needling promises;
- medical-grade, steel or other unsupported needle material;
- sterile/fresh-sterile language;
- disinfection or cross-contamination guarantees.

Connected surfaces updated:

- bespoke Hair Stamp PDP;
- HairGen Booster RU/AR bespoke references to the same stamp;
- canonical web/mobile translation maps;
- quick facts;
- Hair Solution/HairGen routine messaging;
- hair concern RU/AR SEO intro, routine and FAQ;
- chatbot catalogue and product-64 accuracy rule;
- static fallback catalogue;
- production database.

## Production update

`scripts/update-product-64-localized-copy-20260821.ts`

The updater:

- writes the canonical English base plus exact RU/AR descriptions and names;
- normalizes size to `1 box · 8 stamps`;
- clears unsupported `skinType`, `targetConcerns`, `usage` and `ageGroup`;
- sets `ingredients` to `null` because this is a device consumable, not a formula;
- preserves `image`, `images` and `videoUrl`;
- verifies every expected field after the write;
- verifies canonical RU/AR parity;
- is idempotent.

Preserved production assets:

- main: `/images/needles/main_new.jpeg`;
- gallery: `/images/needles/s1_new.jpeg`, `/images/needles/s2.jpg`, `/images/needles/s3_new.jpeg`, `/images/needles/s4.jpg`.

The second updater run reported every field unchanged.

## Important remaining artwork issue

The gallery URLs were preserved as requested, so the existing claim-bearing slide files were not replaced.

- `s1_new.jpeg` still prints `52 Microchannels`, `0.3mm Depth`, `Hygienic`, `No Cross-Contamination` and `Medical-Grade`.
- `s3_new.jpeg` still prints automatic delivery, microchannels, direct follicular delivery, wound healing, collagen/elastin, angiogenesis, regeneration, circulation, healthier growth and not-painful claims.

Those two slides contradict the corrected live text. Because `/images/*` is immutable-cached, they must not be edited in place. Fully removing those claims requires new claim-safe exports under new filenames and then a separate gallery DB update. That would conflict with the instruction in this audit to preserve the current gallery URLs, so it remains an explicit open item.

## Verification

- `npx tsc --noEmit` — passed.
- Scoped ESLint — no errors; JSON and scripts are ignored by the current lint configuration.
- Focused Jest:
  - product 64 canonical/runtime/claim-boundary tests;
  - product localized-copy audit;
  - products 45, 47 and 48;
  - product routines;
  - quick-facts catalogue.
- Result: **7 suites passed, 216 tests passed**.
- Production updater — passed exact field parity and asset preservation.
- Idempotency — second run reported no changes.

One broader, pre-existing `ProductQuickFactsHelper` test file remains red on stale expectations for unrelated products 19, 41 and 58. The underlying quick-facts catalogue suite passed, and none of those failures concerns product 64.
