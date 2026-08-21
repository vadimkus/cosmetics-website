# Product 65 RU/AR localization audit

Date: 2026-08-21

Product: `65` — BIO-MESO PDRN HOMECARE AMPOULE 5000

Production product id: `cmqj8zzkf0157f4ejkpxactpy`

## Sources checked

- Intertek product folder:
  - `Formula-GENOSYS BIO-MESO PDRN HOMECARE AMPOULE 5000.pdf`
  - `Artwork-GENOSYS BIO-MESO PDRN HOMECARE AMPOULE 5000.pdf`
  - `COA-GENOSYS BIO-MESO PDRN HOMECARE AMPOULE 5000(665EK).pdf`
  - `CFS-GENOSYS BIO-MESO PDRN HOMECARE AMPOULE 5000.pdf`
- Intertek ingredient-list, formula/quali-quanti, safety-assessment and artwork locations were searched for the product and its BIO-MESO raw material.
- `Origin-BIO-MESO™ PDRN.pdf`
- DTS MG `GENOSYS FACIAL TREATMENT_Homecare_2025.pdf`
- Product 65 PDP, gallery, localized-slide, video, protocol and Instagram session records.
- Existing bespoke runtime, translation maps, production DB, mobile API, quick facts, routines, recommendations, SEO, skin-analysis fallback and chatbot prompt.

No product-specific clinical efficacy report was found. Product 65 must not inherit the Expert 60000 study.

## Exact source findings

- Pack size: `50 ml`.
- `5000` / `5,000 ppm` identifies the complete BIO-MESO™ PDRN complex. It is not the Sodium DNA dose and not a spicule count.
- Hydrolyzed Sponge: `0.476685%`.
- Sodium DNA: `0.101%` / `1,010 ppm`, sourced from salmon milt.
- Niacinamide: `2%`.
- Panthenol: `1%` / `10,000 ppm`.
- Adenosine: `0.04%`.
- Nine peptides and five ceramides are present. The peptide, EGF, collagen, elastin and ceramide entries are trace-level ingredients; presence is not presented as a proven standalone benefit.
- COA lot 665EK: white opaque lotion; pH `6.77` inside the `5.60–7.60` specification; nominal pack `50 ml`; listed pathogens not detected.
- Training method: once weekly in the evening; around `3 ml`; spread evenly; press with palms or fingers; roll for around `30 seconds`; apply Skin Reboot PDRN Mask immediately for `10–15 minutes`.
- Training material supports possible prickling during use and for two to three days afterwards. Temporary redness, dryness or flaking are qualified as possible and variable, not a guaranteed six-day course.

## Live-copy corrections

- Added `data/product65LocalizedCopy.ts` as the RU/AR canonical payload and mapped both product number and production CUID.
- Rebuilt the live RU/AR bespoke output without direct penetration, microchannels, needle equivalence, bio-peeling, turnover, regeneration/repair, collagen/elastin production, inflammatory/cytokine, barrier strengthening/protection, MMP-1, deep-moisture, blemish, all-skin or professional-result-maintenance claims.
- Replaced the fixed six-day efficacy timeline with qualified expectation and aftercare copy.
- Corrected the immediate post-ampoule mask step to `10–15 minutes`.
- Added sunscreen as next-morning care without importing the fixed one-week Expert 60000 instruction.
- Added source-supported contraindication boundaries and medical-advice triggers.
- Updated quick facts, routine descriptions, recommendation cards, RU/AR SEO, English SEO fallback, product fallback, skin-analysis fallback and chatbot accuracy rules.
- Normalized `50 ml`; cleared DB `skinType`, `targetConcerns`, `usage` and `ageGroup`.

## Production DB and media

The updater `scripts/update-product-65-localized-copy-20260821.ts` writes and verifies the exact canonical record. A second run returned every `changed` flag as `false`.

The updater deliberately preserves:

- Main image: `/images/pdrn_5000_new/Main.jpeg`
- Eight stored studio gallery slides, in the existing order
- Video: `/videos/5000.mp4`

Authenticated local mobile requests for `ru-RU` and `ar-AE` returned the canonical copy, `50 ml`, the main image plus all eight locale-specific slides, and the unchanged video URL.

## Gallery issue requiring new exports

The flattened localized studio artwork still carries claims that the exact-product evidence does not support:

- RU/AR `S1`: regeneration/renewal and professional-level positioning.
- RU/AR `S2`: microchannels, deep/direct delivery and 0.25 mm needle equivalence.
- RU/AR `S3`: channels, PDRN delivery, bio-peeling/renewal and barrier benefit.
- RU/AR `S6`: guaranteed six-day renewal course.
- RU/AR `S8`: turnover/regeneration, collagen/elastin production and barrier strengthening/protection.

The live assets were not removed or overwritten. New-filename correction rows were added to `~/Desktop/genosys-artwork-corrections.html`, in line with the immutable image-cache rule.

## Verification

- `npx tsc --noEmit` — passed.
- Scoped ESLint — no errors; one existing `console` warning in the skin-analysis route and the updater is ignored by the repository lint pattern.
- Product 65 canonical-copy audit plus gallery, quick-fact catalog and routine regressions — 196 passed.
- The wider `ProductQuickFactsHelper` suite still has four stale assertions for products 28, 41 and 58; none touches product 65.
- Production updater parity — passed.
- Second updater run — idempotent, all fields unchanged.
- Authenticated RU and AR mobile payload checks — passed, including nine delivered images (main + eight localized slides) and `/videos/5000.mp4`.

No commit or push was made.
