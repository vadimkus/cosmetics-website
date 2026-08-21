# Product 52 SKIN REBOOT PDRN MASK PACK RU/AR localization audit

Date: 2026-08-21  
Product: `52` · SKIN REBOOT PDRN MASK PACK

## Outcome

Product 52 now uses one source-grounded Russian/Arabic payload across the translation maps, bespoke PDP, quick facts, routine, SEO and concern surfaces, chatbot, static fallback and production database.

The audited copy sells the documented format and formula: `350 g / 30` ultra-thin lyocell sheets, built-in tweezers, `10–20` minute wear, niacinamide `2%`, adenosine `0.04%`, Sodium DNA `0.1% / 1,000 ppm`, panthenol `1%`, allantoin `0.1%` and glycerin `5.094076%`. The carton does not set a weekly frequency.

## Primary sources checked

- `Intertek/SKIN REBOOT PDRN MASK PACK /Formula-GENOSYS SKIN REBOOT PDRN MASK PACK.pdf`
- `Intertek/SKIN REBOOT PDRN MASK PACK /Artwork-GENOSYS SKIN REBOOT PDRN MASK PACK.pdf`
- `Intertek/SKIN REBOOT PDRN MASK PACK /COA-GENOSYS SKIN REBOOT PDRN MASK PACK(256EE).pdf`
- `Intertek/SKIN REBOOT PDRN MASK PACK /CFS-GENOSYS SKIN REBOOT PDRN MASK PACK.pdf`
- `Intertek/SKIN REBOOT PDRN MASK PACK /GENOSYS SKIN REBOOT PDRN MASK PACK .pptx`
- the embedded clinical workbook and all visible study slides in the DTS MG deck
- product-specific safety assessment material in the registration folder
- `Intertek/Bio-Meso PDRN &amp_gt_&amp_gt_documents for registration Dubai/Meso/Origin-Salmon milt (DNA-Na).pdf`
- existing product 52 source notes and localization patterns for products 34–51

The separate origin certificate identifies the DNA-Na raw material as salmon-milt derived, with Alaska, USA listed as origin and manufacture in Shimane, Japan. Retail copy attributes salmon origin to the official DTS presentation and does not turn origin into a biological mechanism.

## Formula retained

- glycerin `5.094076%`
- dipropylene glycol `3%`
- propanediol `3%`
- butylene glycol `2.000004%`
- niacinamide `2%`
- 1,2-hexanediol `1.504002%`
- Glycereth-26 `1%`
- panthenol `1%`
- xylitol `1%`
- Sodium DNA `0.1% / 1,000 ppm`
- allantoin `0.1%`
- adenosine `0.04%`
- lavender oil `0.002%`

The complete registered INCI is retained. Ceramide NP, phytosphingosine, hydrolyzed collagen, hydrolyzed elastin and the botanical extracts remain in the INCI but are not promoted as meaningful actives because their quantitative levels are trace.

The COA records pH `6.37` inside the `5.00–7.00` specification. The copy does not infer “no sting,” universal sensitivity suitability or any other tolerability guarantee from pH.

## Functional claims

The Korean artwork identifies a dual-function cosmetic for helping brighten skin and improve the appearance of wrinkles. It names niacinamide and adenosine as the functional ingredients. The quantitative formula confirms `2%` and `0.04%` respectively.

This supports customer-facing brightening and wrinkle-care language. It does not support “licensed dose,” biological regeneration, cell repair, collagen synthesis, wound healing or tissue repair.

## TEWL study validation

The P&K Skin Research Center material is dated 2 May 2025 and describes 20 women aged 20–60. TEWL was measured:

1. before physical irritation,
2. after physical irritation,
3. after one product use,

with a treated and untreated site:

| Timepoint | Untreated | Treated |
| --- | ---: | ---: |
| Before irritation | 7.065 | 6.965 |
| After physical irritation | 13.090 | 13.445 |
| After use / same final point | 10.205 | 8.735 |

The available report calls the challenge “physical irritation” but does not identify the device, material or exact induction method. It also does not expose subject-level values, units or unrounded group means.

The deck headline `34.969%` is intended as the decline from the treated site’s own post-irritation peak, not as a relative improvement against the untreated site. However, the displayed rounded means produce:

`(13.445 − 8.735) ÷ 13.445 × 100 = 35.0316%`

The headline therefore cannot be reproduced exactly from the displayed values. It may use hidden unrounded data, or it may contain a small arithmetic discrepancy. Live retail copy says **“about 35%”**, preserves the raw readings, discloses that the untreated site also declined, and does not call the endpoint barrier repair or post-procedure recovery.

The satisfaction survey is not retailed as efficacy evidence.

## Lyocell and usage boundaries

“Ultra-thin lyocell,” soft, transparent and breathable are supported by the artwork/DTS deck. The deck includes a visual fibre-distribution comparison after impregnation, but no numeric absorption, adhesion, dose-distribution or “second skin” measurement. Copy therefore describes the material and close contact without inventing quantified fit or delivery performance.

The carton supports `10–20` minutes, external use, eye/mucous-membrane avoidance, patch/compress allergy warning, stop-use advice, cool/dry storage, direct-sun avoidance, child safety, resealing and `6M` after opening. It does not support `2–3` times weekly, peel/facial/sun recovery, or post-procedure use.

## Removed claims

- PDRN “working dose”
- salmon DNA being close to human DNA or “familiar” to skin
- regeneration, cell/tissue repair, collagen synthesis and wound healing
- deep hydration and barrier restoration
- post-procedure, post-peel, facial or sun-recovery suitability
- “does not sting” from pH
- all-skin and universal sensitive-skin suitability
- ingredients “making up most of the essence”
- scar-treatment positioning and fixed `2–3` times weekly use

## Implementation

- canonical payload: `data/product52LocalizedCopy.ts`
- audited RU/AR maps: `data/productLocalizedCopyAudit.ts`, `data/productTranslations.ts`, `data/productTranslationsRu.ts`
- bespoke runtime: `components/product/pdrnmask/pdrnMaskCopy.ts`
- quick facts, routine, SEO, concern, chatbot and static fallback corrected
- idempotent updater: `scripts/update-product-52-localized-copy-20260821.ts`
- focused tests: `__tests__/data/product52LocalizedCopy.test.ts`
- `.gitignore` exception added for the canonical module

## Production database

The updater enforces `productNumber: "52"`, synchronizes RU/AR names and all localized structured fields, normalizes size to `350 g / 30 sheets`, replaces the unsafe English fallback payload and clears unsupported `skinType`, `targetConcerns`, `usage` and `ageGroup`.

It checks for duplicate product-number ownership, performs field-by-field post-write parity verification and is safe to rerun.

## Verification

- `npx tsc --noEmit` passed
- focused ESLint passed with zero errors; one pre-existing `no-console` warning remains in the skin-analysis route and JSON bundles are outside the ESLint configuration
- canonical localization regression suite: `170` tests passed
- product 52 quick-facts UI test passed
- updater first run changed the intended fields and verified parity
- updater second run reported every tracked field unchanged and verified parity
- scoped `git diff --check` passed

The broader quick-facts/routine test command still exposes unrelated pre-existing expectations for product 41, the product 19 fallback and a missing routine-step link. The product 52 tests themselves pass.

No commit or push was made.
