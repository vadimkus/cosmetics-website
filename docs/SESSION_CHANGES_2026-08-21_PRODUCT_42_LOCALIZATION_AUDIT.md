# Product 42 Russian and Arabic localization audit

**Date:** 21 Aug 2026  
**Product:** INTENSIVE BLEMISH BALM CREAM [SPF 30 PA++]  
**Scope:** every customer-facing Russian and Arabic product surface

## Sources

- Signed quantitative formula:
  `Registration DOC/Formula_up/Formula-GENOSYS INTENSIVE BLEMISH BALM CREAM.pdf`
- Registered carton:
  `Label/[GENOSYS]INTENSIVE BLEMISH BALM CREAM.pdf`
- Finished-product COA and assay:
  `Intertek_folder/Certififcate of Analysis/COA-GENOSYS INTENSIVE BLEMISH BALM CREAM 50g(WIF025).pdf`
- EU Safety Assessment:
  `Registration DOC/SA/SA-GENOSYS INTENSIVE BLEMISH BALM CREAM.pdf`
- Product 42 source audit:
  `docs/SESSION_CHANGES_2026-08-17_PRODUCT_42_BLEMISH_BALM_SOURCE_AUDIT.md`
- Official DTS MG product material and the registered INCI sources referenced by
  the source audit.

## Verified retail facts retained

- 50 g; one shade; SPF 30 PA++.
- Exactly three UV filters at 19.70% declared total: Titanium Dioxide 7.70%,
  Octinoxate 7% and Octocrylene 5%.
- Finished-product measurements: 7.09%, 6.31% and 4.50% for those filters;
  arbutin 1.81% against 2% declared; adenosine 0.04%.
- Allantoin 0.10%, glycerin 5%, butylene glycol 5.5%.
- Measured pH 7.44 inside the 5.50–7.50 specification.
- No parabens, artificial fragrance, mineral oil, ethanol or phenoxyethanol.
- Beeswax 2%, therefore not vegan.
- No water-resistance claim.
- The exact Korean arbutin warning is carried into the localized precautions:
  human application data for products containing arbutin at 2% or more has
  reported papules and mild itching.
- Post-treatment redness is discussed only as visual coverage. Use after a
  procedure requires specialist approval and intact skin.

## Corrections

- Removed all-types and sensitive-skin safety, healing, regeneration, deep
  absorption, barrier repair, treatment of blemishes or pigmentation,
  pollution protection, broad-spectrum/full-UVA and water-resistance claims.
- Removed benefit stories assigned to trace botanicals.
- Omitted the D5/D6 future EU restriction from retail copy. It remains an
  internal regulatory fact in the source audit; it does not improve the UAE
  purchase decision.
- Standardised sunscreen use: even application 15 minutes before going
  outdoors, renewal at least every two hours outside, and renewal after
  swimming, heavy sweating or towelling.
- Russian was rewritten as natural professional beauty copy. Arabic uses
  polished neutral MSA and neutral instruction forms suitable for UAE retail.

## Implementation

- Canonical RU/AR payload: `data/product42LocalizedCopy.ts`
- Canonical audit ownership: `data/productLocalizedCopyAudit.ts`
- Runtime maps: `data/productTranslationsRu.ts` and
  `data/productTranslations.ts`
- Complete bespoke page override:
  `components/product/blemishbalm/blemishBalmLocalizedCopy.ts`, consumed by
  `components/product/blemishbalm/blemishBalmCopy.ts`
- Shared surfaces: `lib/productQuickFactsCatalog.ts`, `messages/ru.json`,
  `messages/ar.json`, `lib/concernsData.ts`, `lib/seoLandingPagesRu.ts`,
  `lib/seoLandingPagesAr.ts` and `lib/chatbot/config.ts`
- Idempotent production updater:
  `scripts/update-product-42-blemish-balm-record-20260817.ts`
- Regression coverage:
  `__tests__/data/productLocalizedCopyAudit.test.ts`

## Database requirements

The updater repairs `productNumber` to `"42"`, writes the canonical localized
names and descriptions, clears unsupported `skinType`, restores the full INCI,
and aligns structured product facts, application and precautions. Run it twice;
the second run must leave the selected production fields unchanged.

## Verification

- `npx tsc --noEmit` passed.
- Targeted ESLint passed with zero errors and zero warnings.
- Targeted Jest run passed: 2 suites, 167 tests, 0 failures.
- The production updater completed twice successfully.
- Production parity query confirmed `productNumber = "42"`, `skinType = null`,
  exact canonical RU/AR names and descriptions, exact full INCI, 50 g, one
  shade, no water-resistance claim, four key features, six benefits and four
  application steps.

