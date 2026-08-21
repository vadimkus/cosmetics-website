# Product 48 Hair-GENTRON RU/AR localization audit

Date: 2026-08-21  
Product: `48` · Hair-GENTRON · model `HGHY01`

## Outcome

Product 48 now has one source-grounded Russian/Arabic payload across the translation maps, bespoke PDP, quick facts, recommendations, hair-concern SEO, chatbot, static fallback and production database.

The live copy presents Hair-GENTRON as a premium portable massage helmet with documented LED modes, air-pressure massage, optional heat, music and timed automatic sessions. It does not present the device as medically certified, Korean certified, phototherapy, electro-stimulation, a hair-loss treatment, regrowth, follicle stimulation, circulation treatment or efficacy-proven.

## Primary source set

- `Registration/Gentron/User's manual-HAIR GENTRON.pdf` — English, Korean and Japanese manual
- `Registration/Gentron/Declaration of Conformity-HAIR GENTRON.pdf` — manufacturer EU declaration dated 17 December 2019
- `Registration/Gentron/Low Voltage Directory-HAIR GENTRON.pdf` — report `LR500121912U`, 105 pages
- `Registration/Gentron/EMC test report-[LR500121910I] HGHY01_14.pdf`
- `Registration/Gentron/EMS test report-[LR500121910J] HGHY01_32.pdf`
- `Registration/Gentron/Genosys_HAIR_GENTRON.pdf`
- `Registration/Gentron/Genosys_HAIR_GENTRON_2.pdf`
- `public/documents/PPT/HAIR GENTRON.pdf` — official DTS MG brochure

The audit used the exact source files rather than existing database summaries.

## Verified device facts retained

- Model `HGHY01`
- LED modes exactly as the manual: red + infrared; blue; lights off; red + blue + infrared
- Air-pressure massage, heating and music controls
- One-second hold starts the documented ten-minute preset with massage, heat, all three lights and music
- 10, 20 and 30-minute settings; automatic shut-off; maximum 30 minutes at one time
- Helmet `230 × 240 × 300 mm`
- Controller `158 × 68 × 42 mm`
- Net weight `1.0 kg`
- Included helmet, disassembled stand, controller, USB-C cable and adaptor
- Adaptor input AC 100–240 V 50/60 Hz, output DC 5 V 1.5 A
- Optional `4 × 1.5 V AA` batteries, not included
- Storage `5–40 °C`, relative humidity `≤80%`
- Two-year / 24-month warranty from original purchase for normal use under the manual

## Conformity boundary

The 17 December 2019 manufacturer declaration covers:

- EMC Directive `2014/30/EU`
- Low Voltage Directive `2014/35/EU`

Report `LR500121912U` tests model HGHY01 to IEC/EN `60335-2-32`, “Safety of household and similar electrical appliances — Part 2: Particular requirements for massage appliance.” The report identifies it as a portable Class III appliance.

The Korean manual prints `R-R-2DT-HGHY01`, but the customer copy does not convert that identifier into “Korean certified.” The page says “Made in Korea” and describes the EU conformity and IEC/EN safety scope precisely.

## Light-data boundary

The DTS MG brochure prints:

- infrared `840 nm`
- red `640 nm`
- blue `420 nm`

The user manual does not provide wavelengths, LED count or irradiance. The RU/AR PDP therefore attributes the three wavelength figures to the official brochure and does not turn them into manual specifications, dosimetry or treatment claims. No LED count or irradiance is published.

## Safety and post-procedure correction

The manual’s eight doctor-consultation groups remain visible:

1. under medical treatment
2. implanted electronic medical device
3. heart disease
4. disease of the head
5. pregnancy
6. osteoporosis or fractured spine
7. circulation disturbance caused by diabetes or another disease
8. body temperature above 38 °C

The heat-insensitivity warning is also preserved.

The manual calls the helmet a supplementary step after a medical or aesthetic procedure but gives no procedure types, waiting period or intact-skin requirement. The former live copy recommended using Hair-GENTRON after Mesopecia Kit or HairGen BOOSTER. That recommendation was removed. The new copy says not to use it immediately after a medical, aesthetic or microneedling procedure without clearance from the treating clinician.

## Commercial rewrite

The old RU/AR page read like an internal audit and repeatedly told customers what not to buy. It now leads with:

- hands-free comfort
- four LED modes
- independent massage and heat controls
- timed automatic sessions
- adjustable fit
- reusable operation without per-session heads or ampoules

The evidence boundary remains transparent: device-specific clinical efficacy data is not available, so the page sells the documented experience and functions rather than a medical result.

## Implementation

- Added canonical payload: `data/product48LocalizedCopy.ts`
- Wired canonical RU/AR maps
- Rewrote live RU/AR bespoke Hair-GENTRON copy
- Added product 48 quick facts
- Added a product 48 / Mesopecia recommendation boundary
- Added Hair-GENTRON context to RU/AR hair-concern SEO and FAQ
- Corrected chatbot device knowledge and fallback catalogue copy
- Added idempotent updater: `scripts/update-product-48-localized-copy-20260821.ts`
- Added focused tests: `__tests__/data/product48LocalizedCopy.test.ts`
- Added the canonical module to `.gitignore` exceptions
- Bumped the product cache key

## Production database

The updater found product id `48`, changed `productNumber` from `null` to `48`, synchronized names, descriptions and structured fields, and cleared unsupported `skinType`, `targetConcerns`, `usage` and `ageGroup`.

The post-write field-by-field parity check returned `verified`.

## Verification

- `npx tsc --noEmit`
- focused ESLint on changed TS/TSX files
- focused Jest for products 47 and 48
- updater rerun for idempotency
- scoped git diff/status review

No commit or push was made.
