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

## Product 7 — POWER SOLUTION PCS

### Sources reviewed

- `Ingredient lists_old/GENOSYS POWER SOLUTION PCS.pdf` — exact matching legacy source
  reviewed first for the original PCS identity and INCI. Its older composition does not
  override current finished concentrations.
- `Registration DOC/SA/SA-GENOSYS POWER SOLUTION PCS.pdf` — adult leave-on face serum;
  oil-and-sebum-control function; raw-material reconciliation; dermatological test and
  pregnancy/lactation guidance.
- `Registration DOC/Formula_up/Formula-GENOSYS POWER SOLUTION PCS.pdf` — current finished
  formula: butylene glycol 12.9935%, glycerin 9.9857%, Lactobacillus/Soymilk Ferment Filtrate
  1.5%, panthenol 0.5%, arginine 0.15%, sodium hyaluronate 0.1002%, allantoin 0.05%,
  Hamamelis Virginiana leaf extract 0.045%, sh-Polypeptide-7 and Acetyl Hexapeptide-8 at
  5 ppm each, Palmitoyl Hexapeptide-12 at 2 ppm and Palmitoyl Tripeptide-1 at 1 ppm.
- `Registration DOC/COA/COA-GENOSYS POWER SOLUTION PCS(L0136B).pdf` — red-brown viscous
  liquid; pH 7.98 inside 7.70 ± 1.00; specific gravity 1.031 inside 1.000–1.050; measured
  fill 2.08 ml for the nominal 2 ml vial; passing microbial result with no detected specified
  microorganisms.
- `Registration DOC/Artwork/[GENOSYS]POWER SOLUTION PCS.pdf` — Problem Control Solution
  identity, oil/sebum function, ten 2 ml vials, four-step leave-on method, precautions,
  printed exclusion panel and full INCI.
- `Artwork/Art_Work/Catalogue/GENOSYS CATALOG.pdf` — DTS MG range positioning reviewed for
  consistency; no catalogue wording was allowed to override current registration sources.

### Corrections and copy decisions

- Rewrote every live bespoke Russian and Arabic section, including commerce labels, hero,
  solution positioning, quantitative formula, exclusions, range comparison, method,
  ingredient cards, suitability, FAQ, specifications and safety guidance.
- Rewrote the central product fields and recommendation panel in both locales. Russian now
  reads as professional cosmetology copy; Arabic is polished neutral MSA for UAE retail,
  with neutral instructions wherever practical.
- Kept the cosmetic boundary: PCS helps control excess oil and sebum and reduce the
  appearance of blemishes. Removed acne treatment, wound-healing, regeneration and other
  medical implications.
- Preserved the exact 22.9792% humectant calculation in source analysis and presents it as
  22.98% customer-facing: butylene glycol 12.9935% plus glycerin 9.9857%. Preserved all
  verified active, peptide and measured-specification figures listed above.
- Reconciled `sh-Polypeptide-7` through the Safety Assessment within its documented
  somatotropin-sequence and skin-protecting cosmetic boundary. It is never described as an
  IGF-1 analogue or given a drug-style efficacy claim.
- Challenged the printed `no artificial surfactants` claim against the current formula.
  Lecithin at 0.005% is amphiphilic and may function as an emulsifier/surfactant, while its
  origin and processing are not documented. The categorical fifth exclusion and `5-Free`
  shorthand were removed. Copy retains only four directly verifiable exclusions: parabens,
  ethanol, artificial colour and artificial fragrance.
- Clarified that absence of artificial fragrance is not the same as fragrance-free:
  Chamaecyparis Obtusa water is recorded with a fragrance function, so a faint raw-material
  scent remains possible.
- Kept the verified standalone leave-on method. Roller use is optional and practitioner-led,
  never presented as required by the product instructions.
- Removed dossier language, lot codes, contract-manufacturer attribution and self-defeating
  audit commentary from all customer-facing copy.

### Implementation

- Canonical central RU/AR fields: `data/productLocalizedCopyAudit.ts`
- Runtime translation-map overrides: `data/productTranslationsRu.ts` and
  `data/productTranslations.ts`
- Complete bespoke runtime copy:
  `components/product/powersolution/pcsLocalizedCopy.ts`, consumed by `pcsCopy.ts`
- Product 7 recommendation strings: `messages/ru.json` and `messages/ar.json`
- Focused regression coverage checks runtime ownership, structured JSON, exact source values
  and prohibited medical or contradicted claim language
- The existing audited-localization update script discovers product 7 automatically through
  `AUDITED_PRODUCT_LOCALIZED_COPY`; database `productNumber`, localized names and localized
  descriptions were updated

## Product 6 — POWER SOLUTION CTS

### Sources reviewed

- `Ingredient lists_old/GENOSYS POWER SOLUTION CTS.pdf` and the matching copy under
  `Intertek_folder/Quali-quanti Ingredients/` — mandatory 2011 source reviewed first. It
  establishes the original CTS identity and INCI, but its percentages are superseded by the
  current formula.
- `Registration DOC/Formula_up/Formula-GENOSYS POWER SOLUTION CTS.pdf` — current finished
  formula: glycerin 14.5798%, butylene glycol 13.485%, Lactobacillus/Soymilk Ferment Filtrate
  2.5%, sodium hyaluronate 0.1002%, hydrolyzed collagen 0.1%, Copper Tripeptide-1 0.0212%
  (212 ppm), and sh-Polypeptide-7, Palmitoyl Tripeptide-1 and Palmitoyl Hexapeptide-12 at
  1 ppm each.
- `Registration DOC/SA/SA-GENOSYS POWER SOLUTION CTS.pdf` — adult leave-on face serum;
  current raw-material reconciliation; hydrolyzed collagen is fish-derived; dermatological
  patch test passed; pregnancy/lactation avoidance retained.
- `Registration DOC/COA/COA-GENOSYS POWER SOLUTION CTS(L1133A).pdf` — light-blue viscous
  liquid; pH 7.61 inside 7.00 ± 1.00; specific gravity 1.041 inside 1.000–1.050; measured
  fill 2.06 ml for the nominal 2 ml vial; passing microbial result and no detected specified
  microorganisms.
- `Registration DOC/Artwork/[GENOSYS]POWER SOLUTION CTS.pdf` — CTS expansion, texture
  function, ten 2 ml vials, four application steps, precautions and multilingual panels.
  The Russian artwork's wound-healing, scar, tissue-remodelling, neocollagenesis and
  dermaroller claims were treated as artwork corrections, not as source claims.

### Corrections and copy decisions

- Rewrote every live bespoke Russian and Arabic string in a dedicated CTS localization
  module. Both locales now lead with texture, smoothness, elasticity and the 28.0648%
  humectant base rather than medical or dossier language.
- Preserved the exact current-formula concentrations and measured specifications. The
  legacy 2011 sheet is documented but does not override the current Formula_up values.
- Removed wound healing, tissue repair, regeneration, scar smoothing, neocollagenesis,
  growth-hormone mechanisms and any implication that microneedling is required.
- Kept roller pairing only as an optional professional protocol. The verified standalone
  method remains cleanse, open, apply and absorb.
- Removed the printed `no artificial surfactants` claim because the current formula contains
  Polysorbate 60 at 0.0005%, explicitly classified as a surfactant. `5-Free` was therefore
  removed. Russian and Arabic retain only the four verifiable exclusions: parabens, ethanol,
  artificial colour and artificial fragrance.
- Preserved the fish-allergy warning, pregnancy/lactation avoidance, dermatological testing,
  Korean origin and the ten sealed single-use 2 ml vials.
- Rewrote product 6 recommendation copy so a roller is presented as optional and
  practitioner-led, not as a requirement or carton instruction.

### Implementation

- Canonical central RU/AR fields: `data/productLocalizedCopyAudit.ts`
- Runtime translation-map overrides: `data/productTranslationsRu.ts` and
  `data/productTranslations.ts`
- Complete bespoke runtime copy:
  `components/product/powersolution/ctsLocalizedCopy.ts`, consumed by `ctsCopy.ts`
- Product 6 recommendation strings: `messages/ru.json` and `messages/ar.json`
- Focused regression coverage checks runtime ownership, structured JSON, exact source values
  and prohibited medical or contradicted claim language
- The existing audited-localization update script picks up product 6 automatically through
  `AUDITED_PRODUCT_LOCALIZED_COPY`; database `productNumber`, localized names and localized
  descriptions were updated

## Product 5 — POWER SOLUTION CVS

### Sources checked

- `Ingredient lists_old/GENOSYS POWER SOLUTION CVS.pdf`
- `Registration DOC/SA/SA-GENOSYS POWER SOLUTION CVS.pdf`
- `Registration DOC/Formula/Formula-GENOSYS POWER SOLUTION CVS.pdf`
- `Registration DOC/Artwork/[GENOSYS]POWER SOLUTION CVS.pdf`
- `Registration DOC/COA/COA-GENOSYS POWER SOLUTION CVS(L1036B).pdf`

The 2011 ingredient sheet was reviewed as historical context but not used for current
percentages because it is an older formula. The January 2021 Safety Assessment aggregated
finished-composition table is the quantitative source used by the page. The formula sheet
confirms the current INCI order; the artwork supplies the leave-on method, skin-nourishment
function and precautions; the COA supplies the measured physical values. Printed exclusion
claims were checked independently against the formula instead of being accepted from the
artwork.

### Corrections

- Rewrote every central and bespoke Russian and Arabic customer-facing field. Russian now
  reads as experienced professional cosmetology copy; Arabic is polished neutral MSA for UAE
  retail, with neutral instructions wherever practical.
- Preserved the exact finished formula: water 70.5259%; butylene glycol 12.485%; glycerin
  11.48%; combined humectant base 23.965%; soy-milk ferment filtrate 2.5%; panthenol 0.5%;
  sodium hyaluronate 0.1002%; allantoin 0.1%; hydrolyzed fish collagen 0.1%; grape and rose
  callus culture extracts 0.03% each; beta-glucan 0.02%; sh-Polypeptide-7 1 ppm; and
  Palmitoyl Tripeptide-1 0.5 ppm.
- Corrected sodium hyaluronate from the rounded 0.1% to the verified 0.1002%.
- Corrected pH language. The measured pH is 5.94 inside a 6.00 ± 1.00 range; it is mildly
  acidic, not `near-neutral`. Preserved specific gravity 1.032 inside a 1.000–1.050 range,
  measured fill 2.05 ml for the nominal 2 ml vial, a passing total microbial count and no
  detected specified microorganisms.
- Removed the unsupported claim that panthenol 0.5% and allantoin 0.1% sit at the top of
  their normal cosmetic-use ranges.
- Removed unsupported promises around tissue repair, regeneration, wound healing,
  neocollagenesis, vascular strengthening, rejuvenation, maximum absorption and deeper
  penetration.
- Removed unsupported statements that CVS is the range's most-used vial, that nothing
  oxidises `between faces`, and that the carton itself instructs roller use. The verified
  carton method is cleanse, open, apply and absorb; any roller protocol is now explicitly
  left to a qualified professional.
- Kept the documented identity of sh-Polypeptide-7 within the somatotropin-sequence boundary
  and never describes it as an IGF-1 analogue or turns its identity into a drug claim.
- Corrected `fragrance-free` to the precise claim: no `Parfum` and no artificial/additional
  fragrance. The Safety Assessment identifies Chamaecyparis obtusa water as a fragrance
  ingredient, so the copy allows for a faint raw-material scent.
- Re-audited the printed `no artificial surfactants` exclusion against every composition
  source. PEG-40 Hydrogenated Castor Oil and Polysorbate 20 are absent from the January 2021
  raw-material table, its aggregated finished formula, the current formula sheet, the
  artwork INCI and the 2011 legacy ingredient sheet. The current finished formula does,
  however, contain lecithin at 0.005%. Lecithin is amphiphilic and can function as an
  emulsifier/surfactant, while the dossier records it only as skin-conditioning and does not
  document its origin or processing. Therefore the categorical `no artificial surfactants`
  claim cannot be verified cleanly and was removed rather than preserved from the artwork.
- Removed the `5-Free` shorthand with that fifth exclusion. Russian and Arabic now state
  only the four exclusions that remain directly verifiable: parabens, ethanol, artificial
  pigment/colorant and artificial fragrance.
- Preserved dermatological testing, Korean origin, ten sealed 2 ml glass vials, three-year
  unopened shelf life, pregnancy/lactation avoidance and the fish-allergy warning from the
  hydrolyzed marine collagen source.

### Implementation

- Canonical central RU/AR fields: `data/productLocalizedCopyAudit.ts`
- Runtime translation-map overrides: `data/productTranslationsRu.ts` and
  `data/productTranslations.ts`
- Complete bespoke runtime copy: `components/product/powersolution/cvsLocalizedCopy.ts`,
  consumed by `powerSolutionCopy.ts`
- Product 5 recommendation strings in `messages/ru.json` and `messages/ar.json` were
  rewritten to remove healing, rejuvenation, maximum-absorption and unqualified
  deeper-penetration claims
- The existing audited-localization update script picks up product 5 automatically through
  the canonical map; database `productNumber`, localized names and localized descriptions
  were updated
- Regression coverage checks runtime ownership, structured JSON, exact source figures and
  prohibited claim language
