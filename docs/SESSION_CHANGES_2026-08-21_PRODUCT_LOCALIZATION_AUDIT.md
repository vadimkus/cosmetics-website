# Russian and Arabic product localization audit

**Started:** 21 Aug 2026
**Scope:** one product at a time, Russian and Arabic together

The audit rewrites every customer-facing localized field in natural premium language while
checking the underlying claims against the local registration archive and official DTS MG
material. A translation is not preserved merely because it is present in English.

## Product 1 — Microneedle Roller

### Sources checked

- `Intertek/Rollers/CE Certificate.pdf`
- `Intertek/Rollers/Certificate of Free Sales.pdf`
- `Intertek/Rollers/DTSMG-ISO13485.pdf`
- `public/documents/PPT/Overview of Microneedling_S.pdf`

### Corrections

- Removed the unsupported FDA-approved statement and replaced it with the documented CE
  certification and ISO 13485 quality-system certification.
- Removed the invented 300% absorption figure. The page now describes improved delivery
  without assigning an unsupported percentage.
- Corrected the blanket `450 needles` statement. The DTS MG guide lists 540 needles for
  0.25 mm and 450 for 0.50 mm.
- Replaced the vague `25% thinner` comparison with the documented 0.20 mm needle thickness.
- Corrected a safety-critical reuse error. GENOSYS Roller is single-use; the old RU/AR
  instructions told customers to disinfect and reuse it.
- Replaced the single 4–6 week interval with the documented depth-specific schedule:
  0.25 mm weekly and 0.50 mm every two weeks.
- Added documented gamma sterilisation, sealed blister, SUS 304(H), glue-free disk
  construction, aftercare and contraindications.

### Language

Russian now reads as professional cosmetology guidance rather than a translated device
catalogue. Arabic uses polished Modern Standard Arabic suitable for Gulf beauty retail,
with clear clinical phrasing and no mixed English words.

### Implementation

- Canonical audited copy: `data/productLocalizedCopyAudit.ts`
- RU/AR translation maps override the old generated product 1 blocks
- Database `nameRu`, `nameAr`, `descriptionRu`, `descriptionAr` updated
- Database `productNumber` repaired from null to `1`
- Regression tests verify structured JSON, runtime map ownership and banned claims

## Product 2 — Needle Pen-K

### Sources checked

- `Intertek/Rollers/Certificate of Free Sales.pdf`
- `Intertek/Rollers/DTSMG-ISO13485.pdf`
- `public/documents/PPT/Overview of Microneedling_S.pdf`
- Existing audit note that Needle Pen-K is hidden and no longer offered by GENOSYS ME

### Corrections

- Removed the unsupported 300% absorption figure and the unsourced `clinical-quality results
  at home` positioning.
- Corrected the audience from professional-and-home use to qualified professional use.
- Replaced broad marketing language with the documented specifications: 16 disk needles,
  0.20 mm thickness, SUS 304(H), 0.25–2.0 mm depth and 5,500–7,500 rpm.
- Added the documented ethylene-oxide sterilisation, five speed settings, glue-free needle
  construction and automatic pause when placed in the holder.
- Rewrote the technique around the manufacturer's distinction between one-direction
  gliding at 0.25–0.5 mm and stamping in deeper professional protocols.
- Replaced generic disinfection instructions with a new sterile cartridge for every client
  and proper sharps disposal.

### Language

Russian now uses established professional cosmetology terminology without literal
`transdermal nutrient delivery` or wound-healing language. Arabic uses natural clinical
phrasing, replaces repeated loanword transliteration with `الوخز الدقيق`, and reads as
guidance for a trained practitioner.

## Product 3 — HairGen BOOSTER

### Sources checked

- `Training Materials/HairGen_Booster/210617_Hairgen Booster leaflet-small.pdf`
- `Training Materials/HairGen_Booster/User's manual-Hairgen Booster.pdf`
- `docs/SESSION_CHANGES_2026-08-18_PRODUCT_3_HAIRGEN_BOOSTER_AUDIT.md`
- `docs/SESSION_CHANGES_2026-08-18_PRODUCT_3_HAIRGEN_BOOSTER_PAGE.md`

### Corrections

- Rewrote the complete bespoke Russian and Arabic page objects, including commerce labels,
  hero copy, specifications, method, safety, FAQ and consumable-cost sections.
- Removed the long public argument with the old sales leaflet. The medical boundary is now
  brief and useful: this is scalp care, not hair-loss treatment, and hair loss should be
  assessed by a doctor.
- Removed literal and uncomfortable phrasing about liquid entering while needles open a
  route, devices lying dead in drawers, and the brand refusing to carry claims.
- Preserved the documented hardware facts: 52 needles per disposable stamp; one fresh 4 ml
  HR³ MATRIX HAIR SOLUTION α ampoule and one fresh stamp per session; 280/330/400 movements
  per minute; ten-minute automatic stop; 14 blue/red LEDs through 48 light bumps; 5 V / 2 A;
  24-month warranty; and Korean origin.
- Kept 0.3 mm as the fitted Hair Stamp depth and made clear that depth belongs to the
  consumable, not the handpiece. The Mesopecia Kit's 0.5 mm belongs to its separate roller.
- Kept LED information strictly descriptive, with no efficacy claim. No alopecia,
  angiogenesis, circulation, wound-healing, collagen, DHT, hair-cycle or regrowth claims are
  carried.
- Consolidated the contraindications from the multilingual manual and retained the
  single-use and compatible-product safety requirements.

### Language

Russian now reads as polished professional scalp-care retail copy rather than a literal
translation or an audit note. Arabic is neutral, polished Modern Standard Arabic suitable
for UAE beauty retail, avoiding gendered second-person forms wherever practical.

### Implementation

- Complete bespoke RU/AR copy: `components/product/hr3/hairGenBoosterLocalizedCopy.ts`
- `hairGenBoosterCopy.ts` now serves the audited objects at runtime
- Canonical central RU/AR fields added to `data/productLocalizedCopyAudit.ts`
- Russian and Arabic runtime maps override the old generated product 3 blocks
- `scripts/update-audited-product-localizations-20260821.ts` now includes product 3 through
  the canonical map and will update `productNumber`, localized names and descriptions
- Database `productNumber`, localized names and localized descriptions were updated
- Regression coverage checks runtime ownership, structured JSON, required specifications
  and prohibited claim language

## Product 4 — POWER SOLUTION HES

### Sources checked

- `Ingredient lists_old/GENOSYS HA VOLUME ENHANCING SOLUTION.pdf`
- `Registration DOC/SA/SA-GENOSYS POWER SOLUTION HES.pdf`
- `Registration DOC/Formula/Formula-GENOSYS POWER SOLUTION HES.pdf`
- `Registration DOC/Artwork/[GENOSYS]POWER SOLUTION HES.pdf`
- `Registration DOC/COA/COA-GENOSYS POWER SOLUTION HES(WNL053).pdf`
- `Artwork/Art_Work/Catalogue/GENOSYS CATALOG.pdf`

### Corrections

- Rewrote the complete central Russian and Arabic localization and audited every bespoke
  HES page section, including commerce labels, hero, molecular-weight comparison, formula,
  method, suitability, FAQ, specifications and safety guidance.
- Corrected the ingredient name to `Sodium Hyaluronate`, not generic `Hyaluronic Acid`, and
  preserved the documented 1% concentration and 1.65 ± 0.35 million-dalton molecular weight.
- Preserved the quantitative formula: glycerin 10%, niacinamide 2%, 1,2-hexanediol 2%,
  betaine 2%, BIOPHYTEX 3%, panthenol 0.3%, phytosphingosine 0.1%, adenosine 0.04%, and
  four peptides at 1 ppm each.
- Reconciled BIOPHYTEX and MATRIXYL 3000 against the Safety Assessment instead of treating
  their trade names as unsupported. `sh-Polypeptide-7` is described within the documented
  somatotropin-sequence boundary, never as an IGF-1 analogue.
- Removed healing, regeneration, inflammation, maximum-penetration, filler-equivalence and
  unsupported sulfate-free language. The roller remains a qualified-professional protocol;
  straightforward leave-on use remains available without it.
- Replaced dossier language, batch references and contract-manufacturer naming with
  customer-facing facts. Preserved the measured pH 5.75, specific gravity 1.0272,
  microbial count below 10 CFU/ml, three-year unopened shelf life and Korean origin.
- Corrected the five no-additions claim to the artwork: formaldehyde, artificial fragrance,
  artificial colorant, ethanol and artificial pigment.

### Language

Russian now reads as confident professional cosmetology copy rather than a literal
translation. Arabic is polished Modern Standard Arabic for UAE retail, with neutral
instructions that avoid repeated gendered second-person forms. Both versions lead with
hydration and a fuller-looking complexion while keeping safety guidance direct.

### Implementation

- Canonical central RU/AR fields: `data/productLocalizedCopyAudit.ts`
- Runtime translation-map overrides: `data/productTranslationsRu.ts` and
  `data/productTranslations.ts`
- Complete bespoke runtime copy: `components/product/powersolution/hesCopy.ts`
- The existing audited-localization update script picks up product 4 through the canonical
  map; database `productNumber`, localized names and localized descriptions were updated
- Regression coverage checks runtime ownership, structured JSON, exact source figures and
  prohibited claim language
