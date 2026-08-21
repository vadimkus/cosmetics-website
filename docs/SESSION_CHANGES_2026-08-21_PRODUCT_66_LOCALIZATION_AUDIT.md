# Product 66 RU/AR localization audit

Date: 2026-08-21

Product: `66` — CERABARRIER BIOME GEL CLEANSER

Production product id: `cmr6dajor031ygfnm6rsjkicf`

## Sources checked

- Intertek CERABARRIER folder: quantitative formula, registered artwork, COA, dermatological-test wording.
- Official DTS MG CERABARRIER BIOME GEL CLEANSER deck/catalog for branded names (Pink Ceramide Complex, CERABARRIER BIOME™).
- Safety Assessment mapping for a finished Pink Ceramide premix percentage: not found in the archive.
- Existing bespoke PDP, localized `cera_o` galleries, video, translation maps, production DB, quick facts, routines, SEO, skin-analysis fallback and chatbot.

## Exact source findings

- Base size `200 ml`; second purchase option `600 ml` Professional. Same formula.
- Cleansing system: Sodium Cocoyl Glutamate `8.75%` + Cocamidopropyl Betaine `6%` + Decyl Glucoside `1.65%`.
- Humectants: glycerin `5.0000076%`, butylene glycol `3.000041%`, betaine `0.5%`.
- Five ceramides NP / AS / AP / NS / EOP are present at trace levels.
- Pink Ceramide Complex is a DTS MG deck name for Epilobium angustifolium + Lactobacillus Ferment Lysate + Ceramide NP. No Safety Assessment premix dose was found.
- Measured pH `6.37` inside `6.50 ± 0.50`. Parfum `0.5%`. Dermatologically tested. 12-month PAO.
- Full INCI on pack includes `1,2-Hexanediol`, which the previous live INCI omitted.
- The DTS MG deck presents `+145.8%` and `2.4×` as two descriptions of one immediate post-wash result. Displayed values `25.59 → 56.19` equal `2.20× / +119.6%`. The underlying report, method and sample size are absent, so neither headline is sold as verified efficacy.

## Live-copy corrections

- Added `data/product66LocalizedCopy.ts` as the RU/AR canonical payload and mapped both product number and production CUID.
- Rebuilt the live RU/AR bespoke output around the three-surfactant rinse-off gel.
- Removed barrier repair/strengthening, microbiome balancing, beneficial-bacteria growth, anti-inflammatory/antioxidant, guaranteed no-tightness, base-makeup removal, all/sensitive-skin and universal twice-daily claims.
- Kept the deck hydration headline only as a qualified unreproducible source note, not as two independent clinical results.
- Updated quick facts, routines, recommendation pairing, SEO cards, skin-analysis fallback and chatbot accuracy rules.
- Normalized DB size to `200 ml`; cleared unsupported `skinType`, `targetConcerns`, `usage` and `ageGroup`.
- Preserved 200 ml / 600 ml purchase variants, gallery URLs, video and locale slide mapping.

## Gallery issue requiring new exports

The current `cera_o` studio slides still print the deck hydration headline and barrier/microbiome selling lines. Live assets were not removed or overwritten. Corrected exports need new filenames because `/images/*` is cached immutable.

## Verification

- `npx tsc --noEmit`
- Focused product 66 copy tests
- Production updater parity / second-run idempotency
- No commit or push in this session
