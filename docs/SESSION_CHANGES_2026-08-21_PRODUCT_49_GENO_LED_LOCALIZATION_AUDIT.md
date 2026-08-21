# Product 49 GENO-LED IR II RU/AR localization audit

Date: 2026-08-21  
Product: `49` · GENO-LED IR II

## Outcome

Product 49 now has one source-grounded Russian/Arabic payload across the translation maps, bespoke PDP, quick facts, recommendation copy, device-category SEO, chatbot, static fallback and production database.

The customer copy sells the verified hardware and control system: 1,710 LEDs, five exact wavelengths, complete published dosimetry, simultaneous colour + infrared operation, three-second red/colour alternation, timed controls, electrical rating, dimensions and weight. It no longer presents unverified medical or efficacy claims as facts.

## Primary sources checked

- `public/documents/PPT/GENO-LED IR II_2025.pdf` · official 29-page DTS MG brochure
- official GENOSYS/DTS MG product page `genosys.info/en/21_en/50`
- official DTS MG history page confirming GENO-LED IR II launched in `2024`
- `Registration/Geno-led/GENOLED-Certificate of conformity.pdf`
- `Registration/Geno-led/GENOLED-F690501_RF-SAF008301 (v0.0).pdf`
- `Registration/Geno-led/CE-Adapter.pdf`

No user manual, declaration of conformity or regulatory-classification document specifically naming `GENO-LED IR II` was found in the local registration/device archive or on the manufacturer site.

## Regulatory correction

The archived SGS certificate and 99-page EN 60335 report are not IR II evidence:

- date: `2016`
- models: `OMEGA LIGHT`, `OMEGA LIGHT Dual`, `GENO LED`
- manufacturer: `OMELON KOREA`
- rated power: `32 W`
- standard: EN `60335-2-23`

IR II was launched in 2024, is rated `70 W`, and is not named in those documents. The separate 2011 adapter certificate is also not product-level conformity evidence.

The official brochure and manufacturer page use `LLLT` and treatment language, but marketing wording does not establish legal medical-device classification. The revised RU/AR copy therefore uses “professional LED device,” not “therapy” as a regulatory status, and does not claim CE or medical certification for IR II.

## Verified specifications retained

- `1,710` LEDs: `380` red, `380` blue, `380` green, `380` yellow, `190` infrared
- `423 / 532 / 583 / 640 / 830 nm`
- irradiance: red `42`, blue `46`, green `15`, yellow `11`, infrared `15 mW/cm²`
- standard dose: red `28`, blue `28`, green `9`, yellow `7`, infrared `12 J/cm²`
- dose ranges: `1–186 / 1–152 / 1–52 / 1–39 / 1–56 J/cm²`
- bandwidth `20 ±5 nm` for every mode
- published exposure ranges: visible `5–60 min`; infrared `1–10 min`
- official control-page setting: `5–30 min` in five-minute steps
- colour + infrared simultaneously
- red + blue/green/yellow alternates every three seconds
- voice message one minute before automatic shut-off
- `70 W` rated electrical power, explicitly not optical output
- `520 × 220 × 315 mm`
- `2.6 kg`

The difference between the `5–60 min` visible-light table and the `5–30 min` panel setting remains explicit and must be resolved from the current IR II manual before operation.

## Claims removed or constrained

- cell regeneration, anti-ageing, brightening and hyperpigmentation effects
- soothing erythema or sensitive skin
- acne bacteria, acne control and sebaceous-gland effects
- hair-loss care or regrowth
- circulation, metabolism, collagen, elastin and muscle-pain effects
- all-skin-types suitability
- painless, no downtime or no side effects
- no photo-ageing, scarring or heat damage
- safety for antibiotic resistance
- immediate use after injections, thread lift, microneedling or peels
- dome loses less light, holds the correct distance or guarantees even coverage
- foldable construction and no-contact operation
- clinical validation of IR II from the 2019 Gentile paper

The 2019 paper names an earlier `GENO-LED` in an adjunctive injection protocol. It predates IR II by five years and cannot validate this model.

## Safety boundary

Because the current IR II manual is absent, the page does not invent contraindications, eye-protection rules, photosensitising-medication cautions or post-procedure timing from another LED device.

The operating copy requires trained professional use and instructs buyers to obtain the current manual, declaration of conformity and classification document for the unit serial number before operation.

## Implementation

- canonical payload: `data/product49LocalizedCopy.ts`
- RU/AR translation maps wired to the canonical module
- bespoke RU/AR copy constrained to verified IR II evidence
- quick facts, Peptide Gel Mask recommendation, device SEO, chatbot and fallback corrected
- unsupported concern mapping removed
- idempotent production updater: `scripts/update-product-49-localized-copy-20260821.ts`
- focused tests: `__tests__/data/product49LocalizedCopy.test.ts`
- `.gitignore` exception added for the canonical module

## Production database

The updater sets `productNumber` to `49`, synchronizes RU/AR names and descriptions, replaces all generic structured fields with a conservative English source-grounded payload, and clears unsupported `skinType`, `targetConcerns`, `usage` and `ageGroup`.

It performs a field-by-field post-write parity check and is safe to rerun.

## Verification

- `npx tsc --noEmit`
- focused ESLint on changed TS/TSX files
- focused Jest for product 49 and adjacent localization tests
- updater rerun for idempotency
- scoped diff/status review

No commit or push was made.
