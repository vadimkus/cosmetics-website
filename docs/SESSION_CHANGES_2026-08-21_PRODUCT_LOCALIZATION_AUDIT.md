# Russian and Arabic product localization audit

**Started:** 21 Aug 2026
**Scope:** one product at a time, Russian and Arabic together

The audit rewrites every customer-facing localized field in natural premium language while
checking the underlying claims against the local registration archive and official DTS MG
material. A translation is not preserved merely because it is present in English.

## Product 13 — SKIN RENEWAL PEELING SYSTEM (SRS)

### Catalog identity

- Repository product number: `13`
- Exact catalog name: `SKIN RENEWAL PEELING SYSTEM (SRS)`
- Live route: `/products/13`
- Product type: professional rinse-off AHA peel in ten single-use 2 ml vials

### Sources checked

- `Intertek_folder/Quali-quanti Ingredients/GENOSYS SKIN RENEWAL PEELING SYSTEM.pdf`
  — controlling finished formula: water 41.69499903%; glycerin 25%; glycolic acid 15%;
  lactic acid 13.5%; sodium hydroxide 2.7%; mandelic acid 2%; hydroxyethylcellulose 0.1%;
  phytic acid 0.005%; and sh-Polypeptide-7 0.0000000100%, equal to 0.1 ppb. The botanical
  extracts and hinoki water are present at nano-trace levels.
- `Registration DOC/Formula/Formula-GENOSYS SKIN RENEWAL PEELING SYSTEM(SRS).pdf`
  — current registered INCI in the same order as the quantitative sheet.
- `Registration DOC/Artwork/[GENOSYS]SKIN RENEWAL PEELIGN SYSTEM(SRS).pdf`
  — exact SRS identity; soft-peeling function; smoother, brighter and more even-looking
  skin; even facial application away from lips and the eye area; 15–20 minute exposure;
  cold-water rinse; ten 2 ml vials; dermatological testing; patch test, sunscreen and
  damaged-skin precautions; Korean origin. The English method contains no neutralisation
  step. The Korean panel identifies a high-AHA product and advises consultation with a
  professional.
- `Registration DOC/COA/COA-GENOSYS SKIN RENEWAL PEELING SYSTEM(L1037B).pdf`
  — transparent liquid; measured pH 3.02 inside 3.00–5.00; specific gravity 1.173 inside
  1.150–1.190; measured fill 2.05 ml for the nominal 2 ml vial; passing microbial results.
  The lot code and expiry date were not carried into customer copy.
- `Intertek_folder/Certififcate of Analysis/28 SKIN RENEWAL PEELING SYSTEM (SRS) - COA-GENOSYS (L0907U).pdf`
  — older COA cross-check with the same pH 3.02. Its lot code was not used.
- `Registration DOC/SA/` and `Intertek_folder/Safety Assessment Report/` were checked; no
  SRS-specific Safety Assessment was found.
- `Ingredient lists_old/` was searched first; no SRS-specific legacy ingredient sheet was
  present. The product-specific quali-quanti sheet above is the controlling quantitative
  source.
- The expected DTS MG deck archive `~/Desktop/Glass_Skin/01-official-pdfs/` and catalogue
  path `Artwork/Art_Work/Catalogue/GENOSYS CATALOG.pdf` were searched but are not present in
  the current local archive. No branded-complex or quantified clinical claim was introduced.

### Corrections and copy decisions

- Rewrote every central and bespoke Russian and Arabic customer-facing field. Russian now
  reads as premium professional cosmetology copy; Arabic is polished neutral MSA suitable
  for UAE retail and uses neutral instruction forms where practical.
- Leads with the verified customer result and professional ritual: smoother, fresher,
  more even-looking skin; even application; 15–20 minutes; thorough cold-water rinse.
- Preserved the exact formula story: glycolic acid 15% + lactic acid 13.5% + mandelic acid
  2% = 30.5% AHA, supported by glycerin 25%. Preserved pH 3.02, specific gravity 1.173,
  transparent-liquid appearance and ten single-use 2 ml vials.
- Kept phytic acid 0.005% and sh-Polypeptide-7 0.1 ppb as transparent secondary formula
  facts. They are not presented as the peeling engine.
- Challenged the printed collagen, elastin, antibacterial, pigmentation-treatment,
  tyrosinase, inflammatory-condition and regeneration language against the formula and
  available evidence. These medical or unmeasured claims were removed.
- Removed the Russian artwork's microneedling recommendation as the product's purpose.
  The verified primary protocol is a standalone rinse-off professional peel.
- Removed the invented neutralisation step, licensed-only wording, pregnancy/lactation ban,
  all-skin-types promise and unqualified fragrance-free claim. Hinoki water is explicitly
  classified as a fragrance ingredient at trace level.
- Removed packaging attribution, dossier language, lot codes, contract-manufacturer names
  and public arguments with previous copy.

### Implementation

- Canonical central RU/AR fields: `data/productLocalizedCopyAudit.ts`
- Runtime translation-map overrides: `data/productTranslationsRu.ts` and
  `data/productTranslations.ts`
- Complete bespoke RU/AR runtime copy:
  `components/product/srs/srsLocalizedCopy.ts`, consumed by `srsCopy.ts`
- Product 13 RU/AR quick facts: `lib/productQuickFactsCatalog.ts`
- No product-13-specific recommendation key exists in `messages/ru.json` or
  `messages/ar.json`; SRS has no retail routine, and the generic companion panels do not
  contain product-13 copy, so no unrelated message string was changed.
- Regression coverage checks runtime ownership, structured JSON, exact source values and
  prohibited medical, contradicted or dossier-style claims.
- Database `productNumber`, localized names and localized descriptions were updated.

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

## Product 20 — PROBLEM CONTROL SERUM

### Catalog identity

- Prisma/code identity: repository product number `20`
- Customer name: `INTENSIVE PROBLEM CONTROL SERUM`
- Size: 30 ml leave-on facial serum
- Dedicated runtime: `components/product/pcserum/`

### Sources checked

- `Ingredient lists_old/GENOSYS PROBLEM CONTROL SERUM.pdf`
- `Registration DOC/SA/SA-GENOSYS PROBLEM CONTROL SERUM.pdf`
- `Registration DOC/Formula_up/Formula-GENOSYS PROBLEM CONTROL SERUM.pdf`
- `Registration DOC/COA/COA-GENOSYS PROBLEM CONTROL SERUM 30ml.pdf`
- `Registration DOC/Artwork/[GENOSYS]PROBLEM CONTROL SERUM.pdf`
- `Label/[GENOSYS]PROBLEM CONTROL SERUM.pdf`
- `public/documents/PPT/GENOSYS INTENSIVE PROBLEM CONTROL SERUM.pdf`

The ingredient list supplies the finished percentages. The Safety Assessment confirms the
ZINCIDONE trade-name mapping and Phytolex SC composition. The current formula and artwork
confirm the INCI and directions. The COA supplies measured pH 5.62 inside the 5.50–6.50
specification and the three-year unopened shelf life. The DTS MG deck was used only where its
claims could be reconciled with the formula and registration documents.

### Corrections

- Rewrote every central and bespoke Russian and Arabic customer-facing field in idiomatic
  Russian and polished neutral MSA.
- Preserved zinc PCA 0.05%; trehalose 1%; xylitol 0.5%; panthenol 0.2%; allantoin 0.1%;
  beta-glucan 0.08%; polyglutamic acid 0.01%; Phytolex SC 0.5%; and black willow bark
  extract 0.001%.
- Restored the complete 22-entry INCI, including 1,2-Hexanediol as the third ingredient.
- Kept the precise positioning: a lightweight, water-based, oil-free, silicone-free and
  fragrance-free serum for oily and combination skin, used as 2–3 drops after toner
  morning and evening.
- Removed ACZERO®, PORE LASER™, HydroFerment Complex, Tea Tree Complex and niacinamide;
  none belongs to this formula.
- Removed unsupported non-comedogenic certification, invented visible-result timelines,
  medical acne-treatment language, deeper-penetration language and claims that actives work
  twice as effectively at night.
- Removed the unsupported serum results `sebum −17%` and `colour-blemishes −8%` from the
  Russian and Arabic Problem Skin Beauty Box. The kit now presents product 20 through its
  verified formula instead.
- Corrected the sunscreen note in the kit: the toner contains BHA, but the serum is not an
  acid exfoliant. Trace willow bark at 0.001% does not justify saying the serum itself
  increases sun sensitivity.
- Kept black willow bark in proportion and states plainly that the formula contains no
  salicylic acid or other AHA/BHA acids.

### Implementation

- Canonical central RU/AR fields: `data/productLocalizedCopyAudit.ts`
- Runtime translation-map overrides: `data/productTranslationsRu.ts` and
  `data/productTranslations.ts`
- Complete bespoke runtime copy: `components/product/pcserum/pcserumCopy.ts`
- Recommendation and routine strings: `messages/ru.json` and `messages/ar.json`
- Concern routine and FAQ: `lib/concernsData.ts`
- Product quick facts: `lib/productQuickFactsCatalog.ts`
- Product 20 references in the Problem Skin Beauty Box:
  `components/product/beautybox/copy/problemSkin.ts`
- Focused regression coverage verifies runtime ownership, structured JSON, exact formula
  values, related RU/AR surfaces and prohibited claims
- Database `productNumber`, localized names and localized descriptions were updated

## Product 19 — ALL FOR SENSITIVE SERUM

### Identity and sources checked

- Repository identity: `productNumber: "19"`, `ALL FOR SENSITIVE SERUM`, 30 ml leave-on
  serum, bespoke route implemented under `components/product/afs/`
- `Ingredient lists_old/GENOSYS ALL FOR SENSITIVE SERUM.pdf`
- `Registration DOC/SA/SA-GENOSYS ALL FOR SENSITIVE SERUM.pdf`
- `Registration DOC/Formula_up/Formula-GENOSYS ALL FOR SENSITIVE SERUM.pdf`
- `Registration DOC/Artwork/[GENOSYS]ALL FOR SENSITIVE SERUM.pdf`
- `Registration DOC/COA/COA-GENOSYS ALL FOR SENSITIVE SERUM 30ml(WOC056).pdf`

The historical ingredient sheet was checked first, then reconciled to the newer
`Formula_up` composition. The current formula controls finished concentrations; the Safety
Assessment maps the named supplier complexes to INCI and confirms MultiEx BSASM® Plus at
1.0000%. Artwork supplies the soothing/moisturising function, morning-and-evening use,
dermatological testing, 30 ml size, Korean origin and precautions. The COA supplies measured
pH and physical specification. No dedicated DTS MG efficacy deck or clinical efficacy study
was found for this product.

### Corrections

- Completely rewrote central and bespoke Russian and Arabic customer copy in idiomatic
  professional Russian and polished neutral MSA.
- Restored the documented branded complex that an earlier INCI-only audit had removed:
  MultiEx BSASM® Plus is 1% of the finished batch and carries seven botanicals: Centella
  Asiatica, Polygonum Cuspidatum, Scutellaria Baicalensis, Camellia Sinensis, Glycyrrhiza
  Glabra, Chamomilla Recutita and Rosmarinus Officinalis.
- Preserved finished concentrations from the current formula: betaine 0.5%, allantoin 0.1%,
  Centella 0.05%, Polygonum 0.02%, Scutellaria 0.02%, sodium hyaluronate 0.01%, green tea
  0.01%, licorice 0.01%, chamomile 0.005% and rosemary 0.005%.
- Preserved measured pH 5.77 inside the 5.20–6.20 specification, the translucent slightly
  viscous appearance, dermatological testing, 30 ml size, morning-and-evening use and Korean
  origin.
- Corrected fragrance positioning. The finished formula contains orange peel oil 0.0024%
  and limonene 0.0176%; customer copy therefore says no artificial fragrance is added but
  never calls the serum fragrance-free.
- Removed invented panthenol and madecassoside. Centella extract is present, but no isolated
  madecassoside is documented.
- Removed healing, repair, regeneration, anti-inflammatory, immune-boosting, treatment and
  guaranteed redness/reactivity-reduction claims. No efficacy study supports percentages or
  timelines for this serum.
- Kept Phytolex SC out of the lead story. It is real and mapped by the Safety Assessment,
  but is present as a 0.001% premix and has no product-specific effect credited here.
- Kept aloe, witch hazel and beta-glucan in the full INCI without presenting their trace
  premixes as lead actives.
- Removed contract-manufacturer attribution and all lot identifiers from customer copy.

### Implementation

- Canonical central RU/AR fields: `data/productLocalizedCopyAudit.ts`
- Runtime translation overrides: `data/productTranslationsRu.ts` and
  `data/productTranslations.ts`
- Complete bespoke RU/AR runtime page: `components/product/afs/afsCopy.ts`
- Recommendation and Beauty Box routine strings: `messages/ru.json`, `messages/ar.json` and
  `components/product/beautybox/copy/sensitiveSkin.ts`
- Sensitivity concern routines: `lib/concernsData.ts`
- Source-based PDP facts: `lib/productQuickFactsCatalog.ts`
- Focused regression coverage validates runtime ownership, structured JSON, verified
  concentrations, pH, fragrance disclosure and prohibited invented or medical claims
- Database `productNumber`, localized names and localized descriptions were updated

## Product 18 — MOISTURE REPLENISHING HYALURON SERUM

### Identity and sources checked

- Prisma/code identity: repository product number `18`, `MOISTURE REPLENISHING HYALURON
  SERUM`, 30 ml; bespoke route and runtime are
  `components/product/hsserum/HsserumProductPage.tsx` and
  `components/product/hsserum/hsserumCopy.ts`
- `/Users/vadimkus/Desktop/Drive/Genosys/Registration/Intertek/MOISTURE REPLENISHING HYALURON SERUMCREAM/MOISTURE REPLENISHING HYALURON SERUM/Formula_updated22062024.pdf`
- `/Users/vadimkus/Desktop/Drive/Genosys/Registration/Intertek/MOISTURE REPLENISHING HYALURON SERUMCREAM/MOISTURE REPLENISHING HYALURON SERUM/Artwork_updated22062024.pdf`
- `/Users/vadimkus/Desktop/Drive/Genosys/Registration/Intertek/MOISTURE REPLENISHING HYALURON SERUMCREAM/MOISTURE REPLENISHING HYALURON SERUM/COA_updated22062024.pdf`
- `/Users/vadimkus/Desktop/Glass_Skin/01-official-pdfs/GENOSYS MOISTURE REPLENISHING HYALURON SERUM.pdf`

The current formula is the source for finished concentrations and INCI order. The artwork
confirms moisturizing function, AM/PM application by applying to the face and patting,
dermatological testing, 30 ml size, 12-month PAO and precautions. The COA supplies measured
pH, viscosity and three-year unopened shelf life. The DTS MG deck supplies the branded
`Hyaluronan 11 Multi-Complex` name and the one-use hydration study; those marketing names
and figures were reconciled against the current finished formula rather than inferred from
the INCI alone.

### Corrections

- Rewrote every central and bespoke Russian and Arabic customer-facing field in idiomatic
  professional Russian and polished neutral MSA. Removed the terse audit voice, carton
  commentary and self-defeating phrases such as `not the cream`, `not the engine` and
  `the carton stops here`.
- Preserved hydrolyzed hyaluronic acid at `0.2000030%`, presented as `2,000 ppm`, and
  PENTAVITIN / saccharide isomerate at `0.615%`.
- Added the formula's meaningful hydration base: butylene glycol `7.02%`, glycerin `5%`
  and Glycereth-26 `4%`, totaling `16.02%`.
- Corrected coconut water to its exact finished concentration, `0.79595%`. Removed the old
  `78% coconut water` story; purified water remains the formula base.
- Reconciled `Hyaluronan 11 Multi-Complex` as a branded molecular-grade count with the
  eight hyaluronic INCI ingredients. The copy no longer implies eleven finished
  hyaluronic ingredients at the headline 2,000 ppm concentration.
- Preserved the measured one-use result accurately: inner hydration rose from `50.81` to
  `52.238` immediately after use in a 21-woman panel aged 20–59. Removed the false
  interpretation of `52.238` as a `+52%` improvement.
- Removed unsupported four-step electrolyte and aquaporin-mechanism claims. Glyceryl
  glucoside is present at `0.0005%`, and the five mushroom extracts are present at
  `0.000017%` each; neither is presented as the formula's primary performance driver.
- Preserved measured pH `5.08` inside the `5.3 ± 0.5` specification and viscosity `400`
  inside the `380–580` range, without turning laboratory specifications into the sales
  headline.
- Preserved the sky-blue appearance with no added pigment, 12-month PAO, three-year
  unopened shelf life, dermatological testing and South Korean origin.
- Kept the fragrance disclosure precise: the formula contains Pelargonium Graveolens
  Flower Oil and Citronellol, so the serum is not presented as fragrance-free.
- Rewrote product-pair recommendations for products 18 and 29, the deep-moisturizing
  Beauty Box step, quick facts, concern routines and microneedling recommendation. Removed
  scar-filling, tissue-healing and other medical promises from product 18 references.

### Implementation

- Canonical central RU/AR fields: `data/productLocalizedCopyAudit.ts`
- Runtime translation-map overrides: `data/productTranslationsRu.ts` and
  `data/productTranslations.ts`
- Complete bespoke RU/AR runtime copy:
  `components/product/hsserum/hsserumCopy.ts`
- Product 18 and reciprocal product 29 recommendations:
  `messages/ru.json` and `messages/ar.json`
- Concern-routine references: `lib/concernsData.ts`
- Deep Moisturizing Beauty Box copy:
  `components/product/beautybox/copy/deepMoisturizing.ts`
- Product 18 quick facts: `lib/productQuickFactsCatalog.ts`
- Regression coverage checks runtime ownership, structured JSON, exact source values,
  Beauty Box references and prohibited contradicted or dossier-style language
- Database `productNumber`, localized names and localized descriptions were updated

## Product 17 — EyeCell EYE CONTOUR SERUM

### Catalog identity

- Repository code confirms `id: "17"` and the exact catalog name
  `EyeCell EYE CONTOUR SERUM`; `data/productConfig.ts` supplies the product-17 configuration,
  `lib/products.ts` supplies the 10 ml catalog record at 370 AED, and `/products/17` renders
  `components/product/eyeserum/EyeSerumProductPage.tsx`.
- The customer product is an intensive leave-on serum for the eye contour, used morning and
  evening before EyeCell cream when the pair is used.

### Sources checked

- `Registration DOC/Formula_up/Formula-GENOSYS EyeCell EYE CONTOUR SERUM.pdf`
  — controlling finished concentrations: arbutin 2%; sodium hyaluronate 0.20002%; panthenol
  0.15%; allantoin 0.15%; adenosine 0.04%; Vitis and Rosa callus extracts 0.003% each;
  Acetyl Hexapeptide-8 0.0025%; Copper Tripeptide-1 0.001%; Palmitoyl Hexapeptide-12
  0.0003%; N-Hydroxysuccinimide 0.0002%; Palmitoyl Tripeptide-1 0.00011%; Chrysin 0.00001%;
  and Palmitoyl Tetrapeptide-7 0.000005%.
- `Registration DOC/SA/SA-GENOSYS EyeCell EYE CONTOUR SERUM.pdf`
  — leave-on eye-serum identity; arbutin 2% and adenosine 0.04%; HALOXYL as a 0.10%
  raw-material premix rather than a 0.10% finished active; AHP-5 as a 5% carrier premix;
  pH range; and no documented PAO.
- `Registration DOC/Artwork/[GENOSYS]EYECELL EYE SERUM.pdf`
  — intensive serum positioning; deep wrinkles, dark circles and the appearance of eye
  puffs; morning/evening patting method; 10 ml; dermatological testing; pregnancy/lactation
  avoidance; precautions; and Korean origin. Its Russian panel incorrectly says 20 ml and
  was not followed.
- `Registration DOC/COA/COA-GENOSYS EyeCell EYE CONTOUR SERUM(L0614B).pdf`
  — light-yellow viscous appearance; measured pH 5.37 within the accepted 5.00–7.00 range;
  and passing arbutin and adenosine assays. The lot code and expiry date were not copied.
- `Intertek_folder/Quali-quanti Ingredients/EyeCell EYE CONTOUR SERUM.pdf`
  — older cross-check only. Its higher peptide figures describe premix solutions and were
  not presented as finished active concentrations.
- `public/documents/PPT/GENOSYS EyeCell EYE ZONE CARE SYSTEM.pdf`
  — EyeCell line context. Its 14-volunteer/28-day peptide material is not a study of this
  finished serum, so no clinical percentage was transferred.

### Corrections and copy decisions

- Rewrote every central and bespoke Russian and Arabic customer-facing field. Russian now
  reads as premium professional skincare copy; Arabic is polished neutral MSA for UAE retail.
- Leads with the verified functional pair: arbutin 2% for the look of uneven under-eye tone
  and adenosine 0.04% for wrinkle care. Sodium hyaluronate 0.20002%, panthenol 0.15% and
  allantoin 0.15% provide the supporting hydration story.
- Reconciled the peptide and Haloxyl figures to finished concentrations. They remain
  transparent secondary formula facts and are no longer sold as the principal engine.
- Removed the unsupported `10 Years Back`, Botox-like, muscle-relaxation, wound-healing,
  microcirculation, haemoglobin-clearance, callus-regeneration and SKU-specific
  14-volunteer/28-day clinical narratives.
- Corrected the drifted Russian 20 ml claim to the verified 10 ml. Preserved measured pH
  5.37, light-yellow viscous appearance, dermatological testing, Korean origin,
  pregnancy/lactation avoidance and practical eye-area precautions.
- Rewrote the shared RU/AR recommendation strings, product-17 quick facts and the product-17
  references inside the EyeCell EYE ZONE CARE KIT. `lib/concernsData.ts` contains no
  product-17 routine entry, and product 17 is not part of the Beauty Box SKU family, so no
  unrelated concern or Beauty Box copy was changed.
- Removed contract-manufacturer attribution, lot codes, dossier phrasing and public arguments
  with legacy copy from the localized customer surfaces.

### Implementation

- Canonical central RU/AR fields: `data/productLocalizedCopyAudit.ts`
- Runtime translation-map overrides: `data/productTranslationsRu.ts` and
  `data/productTranslations.ts`
- Complete bespoke RU/AR runtime copy:
  `components/product/eyeserum/eyeserumCopy.ts`
- Shared recommendation strings: `messages/ru.json` and `messages/ar.json`
- Product-17 quick facts and EyeCell kit references:
  `lib/productQuickFactsCatalog.ts` and `components/product/eyekit/eyekitCopy.ts`
- Focused regression coverage checks runtime ownership, structured JSON, exact concentrations,
  required product facts, unsupported claims and EyeCell kit references.
- Database `productNumber`, localized names and localized descriptions were updated.

## Product 16 — SNOW BOOSTER

### Catalog identity

- Read-only Prisma lookup confirmed `id: "16"`, `productNumber: "16"`,
  `name: "SNOW BOOSTER"`, category `Toner/Mist`, default size `200ml`, price `260 AED`
  and main image `/images/Second/main_booster.jpg`.
- Product configuration also provides a 1000 ml professional size and the dedicated
  `/products/16` route renders `components/product/booster/BoosterProductPage.tsx`.

### Sources checked

- `Ingredient lists_old/GENOSYS SNOW BOOSTER.pdf`
- `Registration DOC/Formula_up/Formula-GENOSYS SNOW BOOSTER.pdf`
- `Registration DOC/SA/SA-GENOSYS SNOW BOOSTER.pdf`
- `Registration DOC/COA/COA-GENOSYS SNOW BOOSTER 200ml(WNL025).pdf`
- `Registration DOC/COA/COA-GENOSYS SNOW BOOSTER 1000ml(WOB047).pdf`
- `Registration DOC/Artwork/[GENOSYS]SNOW BOOSTER(200ml).pdf`
- `Registration DOC/Artwork/[GENOSYS]SNOW BOOSTER(1000ml).pdf`
- `docs/SESSION_CHANGES_2026-08-16_PRODUCT_16_SNOW_BOOSTER.md`

The legacy ingredient sheet was checked first but not used for current percentages: it is an
older formula with pumpkin ferment at 1% and ingredients absent from the current formula.
The current `Formula_up` sheet is the quantitative source. The Safety Assessment confirms
leave-on face and décolleté use, pH range 5.0–7.0 and the Phytolex SC trade-name mapping.
The artwork supplies toner identity, daily use for all skin types, morning/evening
application, use over makeup, PAO and precautions. The COAs supply measured pH and physical
specifications. No DTS MG deck with a quantified clinical result was found, so no hydration,
brightening or sebum percentage was introduced.

### Corrections

- Rewrote every central and bespoke Russian and Arabic customer-facing field. Russian is
  idiomatic professional skincare copy; Arabic is polished neutral MSA for UAE retail.
- Positioned SNOW BOOSTER accurately as a lightweight daily leave-on toner for all skin
  types, used by hand or as a spray morning and evening, including over makeup.
- Preserved exact finished concentrations: betaine 3%; glycerin 5.7815%; butylene glycol
  4.55%; dipropylene glycol 3.99745%; propylene glycol 0.50015%; sodium lactate 0.3%;
  pumpkin ferment 0.1%; lotus flower extract 0.0475%; and combined Phytolex botanical
  extracts 0.00765%.
- Reconciled Phytolex SC correctly: it is a 0.5% raw-material premix, not 0.5% finished
  botanical extract and not the principal reason to buy the formula.
- Preserved measured pH 6.14 for 200 ml and 6.17 for 1000 ml inside the 5.00–7.00
  specification, translucent aqueous appearance, dermatological testing, 6-month PAO,
  three-year unopened shelf life and Korean origin.
- Removed unsupported brightening, probiotic, pore-tightening, sebum-control, pH-restoration,
  cotton-pad mask and deeper-penetration claims. Product 16 concern routines now describe
  hydration and comfort without implying drug delivery or action inside scar tissue.
- Rewrote Russian and Arabic recommendation strings and quick facts to remove packaging and
  dossier language while keeping exact percentages and practical application guidance.

### Implementation

- Canonical central RU/AR fields: `data/productLocalizedCopyAudit.ts`
- Runtime translation-map overrides: `data/productTranslationsRu.ts` and
  `data/productTranslations.ts`
- Complete bespoke runtime copy:
  `components/product/booster/boosterLocalizedCopy.ts`, consumed by `boosterCopy.ts`
- Recommendation strings: `messages/ru.json` and `messages/ar.json`
- Concern routines and quick facts: `lib/concernsData.ts` and
  `lib/productQuickFactsCatalog.ts`
- Focused regression coverage checks runtime ownership, structured JSON, exact source values,
  forbidden claim language and bespoke FAQ completeness
- Database `productNumber`, localized names and localized descriptions were updated.

## Product 15 — INTENSIVE PROBLEM CONTROL TONER

### Catalog identity

- Repository product number: `15`
- Customer-facing product: `GENOSYS INTENSIVE PROBLEM CONTROL TONER`
- Formats: 200 ml home spray and 500 ml professional bottle
- The bespoke route is rendered by
  `components/product/pcttoner/PctTonerProductPage.tsx`.

### Sources reviewed

- `/Users/vadimkus/Desktop/Drive/Genosys/Registration/Intertek/Genosys Intensive Problem Control Toner/Formula-GENOSYS INTENSIVE PROBLEM CONTROL TONER.pdf`
  — current finished formula and exact percentages: butylene glycol 5.423%, glycerin 4.975%,
  dipropylene glycol 3%, zinc PCA 0.5%, trehalose/panthenol/allantoin 0.1% each,
  Anti Sebum P botanical extracts 0.005% combined, salicylic acid 0.001%, and the complete
  INCI order.
- `/Users/vadimkus/Desktop/Drive/Genosys/Registration/Intertek/Genosys Intensive Problem Control Toner/Artwork-GENOSYS INTENSIVE PROBLEM CONTROL TONER(200ml).pdf`
  — leave-on toner identity, morning/evening application, cotton-pad and spray methods,
  360-degree bottle use, 200 ml format, precautions, 12-month period after opening and
  Korean origin.
- `/Users/vadimkus/Desktop/Drive/Genosys/Registration/Intertek/Genosys Intensive Problem Control Toner/COA-GENOSYS INTENSIVE PROBLEM CONTROL TONER.pdf`
  — transparent light-yellow liquid; pH 4.81 inside 4.30–5.50; specific gravity 1.0200
  inside 1.000–1.030; measured fill 201.50 ml for the nominal 200 ml bottle.
- `/Users/vadimkus/cosmetics-website/public/documents/PPT/GENOSYS INTENSIVE PROBLEM CONTROL TONER.pdf`
  — DTS MG product deck reviewed for the finished-product sebum study (approximately 50%
  reduction after four weeks), non-comedogenic testing by QACS Ltd., application formats
  and the historical Copper Tripeptide-1 claim.

No matching product-specific Safety Assessment or separate legacy ingredient-list sheet was
located in the reviewed product folder. The current formula, COA and artwork therefore remain
the controlling registration sources; the DTS MG deck is used only for the identified
finished-product study and application evidence.

### Corrections and copy decisions

- Rewrote every central and bespoke Russian and Arabic customer-facing field. Russian is
  idiomatic professional skincare copy; Arabic is polished neutral MSA for UAE retail.
- Reframed the product as a daily leave-on sebum-control toner, not an acne treatment or an
  acid peel. Salicylic acid is only 0.001%; zinc PCA 0.5% is the formula's meaningful
  sebum-control active.
- Preserved the exact 13.398% humectant base: butylene glycol 5.423%, glycerin 4.975% and
  dipropylene glycol 3%.
- Reconciled `Anti Sebum P` to four botanical extracts in the current formula: Ulmus
  davidiana root, Pueraria lobata root, Oenothera biennis flower and Pinus palustris leaf,
  at 0.005% combined. It is described as a supporting complex, not the engine.
- Removed Copper Tripeptide-1 as a product ingredient. It appears in an older deck but is
  absent from both the current finished formula and the current INCI.
- Preserved the finished-product result as approximately 50% lower sebum after four weeks,
  without converting that cosmetic study into prevention or treatment language.
- Preserved the verified 360-degree spray behaviour for the 200 ml bottle and clearly
  separated it from the 500 ml professional format.
- Preserved measured pH, specific gravity and fill without lot codes or dossier wording.
- Removed prevention, antibacterial, healing and acne-treatment claims. The customer copy
  directs persistent or severe breakouts to a dermatologist.
- Corrected fragrance positioning: `Parfum` is absent, but tea-tree oil and cooling amides
  have aromatic functions, so the product is not described as fragrance-free or odourless.

### Implementation

- Canonical central RU/AR fields: `data/productLocalizedCopyAudit.ts`
- Runtime translation-map overrides: `data/productTranslationsRu.ts` and
  `data/productTranslations.ts`
- Complete bespoke runtime copy:
  `components/product/pcttoner/pctTonerLocalizedCopy.ts`, consumed by `pctTonerCopy.ts`
- Product 15 recommendation and routine strings: `messages/ru.json` and `messages/ar.json`
- Product 15 verified facts: `lib/productQuickFactsCatalog.ts`
- Product 15 morning/evening concern-routine steps: `lib/concernsData.ts`; removed the false
  niacinamide, pore-dissolving BHA, cystic-spot compress and night-only efficacy language
- Focused regression coverage checks runtime ownership, structured JSON, exact source
  figures and prohibited medical or contradicted claim language
- Database `productNumber`, localized names and localized descriptions were updated

## Product 14 — MICROBIOME ENERGY INFUSING MIST

### Catalog identity

- Repository product number: `14`
- Exact catalog name: `MICROBIOME ENERGY INFUSING MIST`
- Live route: `/products/14`
- Product type: 80 ml leave-on sprayable emulsion mist

### Sources checked

- `Ingredient lists_old/` was searched first; no product-14 legacy ingredient sheet was
  present.
- `Genosys Microbiome Energy Infusing Mist/Ingredients_GENOSYS MICROBIOME ENERGY INFUSING
  MIST.pdf` — controlling signed finished formula: butylene glycol 4.01%; glycerin 3.245%;
  1,2-hexanediol 2.009%; shea butter 1.2%; Lactobacillus Ferment 0.08795%; inulin 0.08%;
  Alpha-Glucan Oligosaccharide 0.02%; four plant oils at 0.015% each; Centella asiatica
  0.005%; seven hyaluronan INCI entries totalling 0.000951%; and Acetyl Heptapeptide-4
  0.000001%. The sheet also confirms bergamot oil 0.024%, limonene 0.027% and linalool
  0.009%.
- `Genosys Microbiome Energy Infusing Mist/Formula-GENOSYS MICROBIOME ENERGY INFUSING
  MIST.xlsx` — current product-specific formula workbook, reconciled with the signed
  ingredient PDF above.
- `Genosys Microbiome Energy Infusing Mist/COA-GENOSYS MICROBIOME ENERGY INFUSING
  MIST(MJ001).pdf` — opaque viscous white liquid; pH 5.48 inside 5.00–6.00; specific gravity
  1.0106 inside 1.004–1.014; measured fill 80.63 ml for the nominal 80 ml bottle; total
  aerobic microbial count below 10 CFU/ml and no detected specified microorganisms. Lot,
  dates and contract-manufacturer identity were not carried into customer copy.
- `Genosys Microbiome Energy Infusing Mist/Pics/image1.jpeg` and `Pics/image3.jpeg` —
  exact identity; moisturizing and nourishing function; shake well; spray over the face
  with eyes closed from 10–20 cm throughout the day; over-makeup use; 80 ml; 12-month PAO;
  Korean origin; precautions; and carton INCI.
- The product-specific archive and both Safety Assessment locations were searched; no Safety
  Assessment exists for this exact formula. The similarly named REVITALIZING HYDRO MIST
  dossier is a predecessor and was not used.
- DTS MG training/deck material was used only to reconcile the branded names CUREBIOME,
  Hyaluronan 10 Multi-Complex and FENSEBIOME, plus before-makeup and over-makeup use. No
  quantified clinical result is present.
- The expected `~/Desktop/Glass_Skin/01-official-pdfs/` deck archive and
  `Artwork/Art_Work/Catalogue/GENOSYS CATALOG.pdf` catalogue path are not present in the
  current local archive.

### Corrections and copy decisions

- Rewrote every central and bespoke Russian and Arabic customer-facing field. Russian now
  reads as premium cosmetologist-led retail copy; Arabic is polished neutral MSA for UAE
  retail and uses neutral instruction forms.
- Leads with the useful customer distinction: this is a finely sprayed emulsion with shea
  butter 1.2%, not a water toner. It moisturizes, nourishes, softens and refreshes the look
  of skin before makeup or over it.
- Preserved the exact humectant base: butylene glycol 4.01% + glycerin 3.245% = 7.255%.
  Preserved the four plant oils at 0.015% each and the complete registered INCI.
- Reconciled CUREBIOME to Lactobacillus Ferment 0.08795%, inulin 0.08% and Alpha-Glucan
  Oligosaccharide 0.02%. Reconciled Hyaluronan 10 as a branded molecular-grade count against
  seven INCI entries totalling 0.000951%. Preserved FENSEBIOME / Acetyl Heptapeptide-4 at
  0.000001% without presenting these trace components as the formula's engine.
- Preserved measured pH 5.48, specific gravity 1.0106, measured fill 80.63 ml, 12-month PAO
  and Korean origin.
- Removed microbiome-repair, pH-rebalancing, wound-healing, collagen, antibacterial, acne,
  psoriasis and unquantified clinical-hydration claims. Removed all-skin-types, sensitive-skin,
  fragrance-free and dermatologically-tested claims because the available exact-product
  documents do not support them.
- Removed packaging attribution, dossier language, lot codes, contract-manufacturer names,
  public arguments with old copy and self-defeating `not the engine` phrasing from runtime
  customer copy.

### Implementation

- Canonical central RU/AR fields: `data/productLocalizedCopyAudit.ts`
- Runtime translation-map overrides: `data/productTranslationsRu.ts` and
  `data/productTranslations.ts`
- Complete bespoke RU/AR runtime copy:
  `components/product/mist/mistLocalizedCopy.ts`, consumed by `mistCopy.ts`
- Product 14 recommendation strings: `messages/ru.json` and `messages/ar.json`
- Product 14 RU/AR quick facts: `lib/productQuickFactsCatalog.ts`
- Regression coverage checks runtime ownership, structured JSON, exact source values,
  branded-complex reconciliation and prohibited medical, contradicted or dossier-style
  claims.
- Database `productNumber`, localized names and localized descriptions were updated.

## Product 12 — EPI TURNOVER BOOSTING PEELING GEL

### Catalog identity

- Repository product number: `12`
- Exact catalog name: `EPI TURNOVER BOOSTING PEELING GEL`
- Live route: `/products/12`
- Product type: 100 g rinse-off cellulose gommage for the face and rough body areas

### Sources checked

- `Intertek_folder/Quali-quanti Ingredients/Ingredient list-EPI TURNOVER BOOSTING PEELING GEL.pdf`
  — controlling finished formula: cellulose 3%; PEG-8 10%; Alcohol Denat. 4.75%;
  propylene glycol 3.5%; Quaternium-60 3.5%; carbomer 2.2%; 1,2-hexanediol 1.0023%;
  caprylyl glycol 0.3%; fragrance 0.199972%; allantoin 0.1%; sodium hyaluronate and jojoba
  oil 0.001% each; papaya extract 0.000150%; and moringa seed extract 0.000020%.
- `Registration DOC/SA/SA-GENOSYS EPI TURNOVER BOOSTING PEELING GEL.pdf` — current
  raw-material mapping and branded-complex reconciliation; Desert Complex is a 0.01%
  premix; GRC-E1 is a separate 0.01% premix; pH 3.0 ± 0.5; white-to-pale-yellow opaque
  gel; adult rinse-off use; satisfactory patch test supporting `dermatologically tested`.
- `Registration DOC/Formula/Formula-GENOSYS EPI TURNOVER BOOSTING PEELING GEL.pdf` —
  current registered INCI and confirmation that the alcohol is `Alcohol Denat.`.
- `Registration DOC/Artwork/[GENOSYS]EPI TURNOVER BOOSTING PEELING GEL.pdf` — 100 g;
  mild peeling; enzyme + cellulose positioning; clean dry skin; 30–60 second circular
  massage; tepid-water rinse; eye and mouth avoidance; customer precautions; Korean origin.
- `public/documents/PPT/GENOSYS EPI TURNOVER BOOSTING PEELING GEL.pdf` — official DTS MG
  deck: gommage without rough particles, 1–2 uses per week, and use on knees, elbows and
  heels. The deck contains before/after photographs but no quantified clinical result.

No separate older ingredient-list PDF for EPI was found under `Ingredient lists_old`; the
product-specific quali-quanti sheet above is the earliest and controlling quantitative source.
No product-specific COA with additional measured batch values was found or used.

### Corrections and copy decisions

- Rewrote every central and bespoke Russian and Arabic customer-facing field. Russian now
  reads as premium professional cosmetology copy; Arabic is polished neutral MSA for UAE
  retail and avoids unnecessary gendered imperatives where practical.
- Leads with the verified customer ritual: apply to clean, dry skin; massage gently for
  30–60 seconds; rinse the cellulose rolls with tepid water; repeat 1–2 times weekly.
- Preserved cellulose 3% as the gommage engine. PEG-8 10%, propylene glycol 3.5% and
  allantoin 0.1% are presented as the comfortable gel base, not as treatment claims.
- Reconciled the branded Desert Complex through the Safety Assessment. It is a real 0.01%
  premix, but its finished botanical fractions are too low to support the deck's hydration
  engine story.
- Challenged the printed papaya, moringa, sodium hyaluronate and jojoba headlines against
  the formula. Papaya is 0.000150%, moringa 0.000020%, and sodium hyaluronate and jojoba
  0.001% each. They remain transparent formula facts, not the reason to buy the peel.
- Removed no-irritation guarantees, pore-purifying, anti-inflammatory, antiseptic,
  wound-healing, sebum-normalising, breakout-treatment, firming and clinic-results-at-home
  claims. No quantified clinical result was invented from before/after photographs.
- Removed all-skin-types and sensitive-skin promises. The formula contains Alcohol Denat.
  4.75%, fragrance 0.199972%, Hexyl Cinnamal and has pH 3.0; suitability guidance now
  excludes damaged, irritated and freshly treated skin.
- Preserved pH 3.0 inside the 2.5–3.5 specification, six-month PAO, dermatological testing,
  Korean origin and the verified face/body areas.
- Removed dossier language, packaging attribution, lot codes, contract-manufacturer names
  and self-defeating audit commentary from customer-facing copy.

### Implementation

- Canonical central RU/AR fields: `data/productLocalizedCopyAudit.ts`
- Runtime translation-map overrides: `data/productTranslationsRu.ts` and
  `data/productTranslations.ts`
- Complete bespoke RU/AR runtime copy: `components/product/epi/epiLocalizedCopy.ts`,
  consumed by `epiCopy.ts`
- Product 12 recommendation strings: `messages/ru.json` and `messages/ar.json`
- Product 12 RU/AR quick facts: `lib/productQuickFactsCatalog.ts`
- Regression coverage checks runtime ownership, structured JSON, exact source values and
  prohibited medical, unsupported or dossier-style claims
- Database `productNumber`, localized names and localized descriptions were updated

## Product 11 — SKIN DEFENDER LIP & EYE MAKEUP REMOVER

### Catalog identity

- Repository product number: `11`
- Exact catalog name: `SKIN DEFENDER LIP & EYE MAKEUP REMOVER`
- Live route: `/products/11`
- Product type: 200 ml biphasic wipe-off makeup remover for the lips and eye area

### Sources reviewed

- `GENOSYS SKIN DEFENDER LIP & EYE MAKEUP REMOVER/Formula-GENOSYS SKIN DEFENDER LIP & EYE MAKEUP REMOVER.pdf`
  — current finished formula and controlling quantitative source: Cetyl Ethylhexanoate
  27.845%, Disiloxane 13%, Isohexadecane 9%, Lactobacillus Ferment 0.5%, sodium
  chloride 0.4%, sea-buckthorn oil 0.05%, benzalkonium chloride 0.05%, raspberry leaf
  extract 0.045% and rose water 0.019%. Palmitoyl Tripeptide-5 is 0.65 ppb and Acetyl
  Tetrapeptide-5 is 0.5 ppb; every vitamin is below 0.00003%.
- `GENOSYS SKIN DEFENDER LIP & EYE MAKEUP REMOVER/Artwork-GENOSYS SKIN DEFENDER LIP & EYE MAKEUP REMOVER.pdf`
  — makeup-remover function; 200 ml; shake, cotton pad, hold for a few seconds and wipe;
  fresh non-greasy positioning; dermatological testing; 12-month PAO; Korean origin and
  customer precautions.
- `Ingredient lists_old/GENOSYS PROFESSIONAL BIPHASIC MAKEUP REMOVER.pdf` — mandatory
  historical source checked first. Its WINNOVA formula uses cyclopentasiloxane 39.4653%,
  cyclohexasiloxane 16.9137%, lavender and different peptides. It is a superseded predecessor
  and does not describe the current SKIN DEFENDER bottle.
- `Intertek_folder/Safety Assessment Report/11 PROFESSIONAL BIPHASIC MAKEUP REMOVER.pdf`
  — August 2017 predecessor assessment. It confirms the older product category and wipe-off
  use but its formula, pH 6–7, allergen discussion and raw-material mapping were not carried
  into the current product copy.
- The current product-folder COA is a non-extractable scan; the older COA belongs to the
  predecessor SKU. No pH or measured batch specification is printed in customer copy.
- No product-specific DTS MG deck or catalogue clinical figure was found. No waterproof,
  no-sting, ophthalmological or eye-comfort performance claim was invented.

### Corrections and copy decisions

- Rewrote every central and bespoke Russian and Arabic customer-facing field. Russian now
  reads as premium professional cosmetology copy; Arabic is polished neutral MSA for UAE
  retail, with neutral instruction forms wherever practical.
- Leads with the customer benefit and the verified ritual: shake the two phases, saturate a
  cotton pad, hold on the lips or closed eyelid for a few seconds and wipe gently.
- Preserved the exact removal system: Cetyl Ethylhexanoate 27.845% + Disiloxane 13% +
  Isohexadecane 9% = 49.845%. Customer-facing summaries round this to 49.8% only where the
  shorter figure reads more naturally.
- Reframed the fresh, non-greasy finish in natural language without turning a volatile
  silicone into a treatment claim.
- Kept Lactobacillus Ferment 0.5% as a secondary water-phase care component. It is not
  presented as the makeup-removal engine.
- Challenged the printed multivitamin and firming-peptide headline against the formula.
  Palmitoyl Tripeptide-5 at 0.65 ppb, Acetyl Tetrapeptide-5 at 0.5 ppb and vitamins below
  0.00003% remain transparent formula facts, not reasons to buy the product.
- Removed unsupported waterproof, irritation-free, ophthalmological, all-skin-types,
  sensitive-skin and fragrance-free claims. The current INCI has no `Parfum`, but includes
  vanilla, banana and raspberry extracts, so the copy does not promise a scent-free formula.
- Kept the product within its verified role: it removes makeup from lips and the eye area.
  It is not sold as a face wash, vitamin treatment, peptide treatment or Korean functional
  cosmetic. The separate face cleanser remains the next routine step.
- Removed dossier language, packaging attribution, lot codes, contract-manufacturer names
  and self-defeating caveats from customer-facing copy.

### Implementation

- Canonical central RU/AR fields: `data/productLocalizedCopyAudit.ts`
- Runtime translation-map overrides: `data/productTranslationsRu.ts` and
  `data/productTranslations.ts`
- Complete bespoke runtime copy:
  `components/product/remover/removerLocalizedCopy.ts`, consumed by `removerCopy.ts`
- Product 11 recommendation strings: `messages/ru.json` and `messages/ar.json`
- Product 11 RU/AR quick facts: `lib/productQuickFactsCatalog.ts`
- Focused regression coverage checks runtime ownership, structured JSON, exact source values
  and prohibited medical, unsupported or dossier-style claims
- Database `productNumber`, localized names and localized descriptions were updated

## Product 10 — SNOW O₂ CLEANSER

### Catalog identity

- Repository product number: `10`
- Catalog name: `SNOW O₂ CLEANSER`
- Live route: `/products/10`
- Product type: rinse-off oxygen-bubble facial cleanser applied to dry skin

### Sources reviewed

- `Registration DOC/Formula_up/Formula-GENOSYS SNOW O2.pdf` — current finished formula:
  Methyl Perfluoroisobutyl Ether 8%; Cocamide DEA 6%; butylene glycol 4.1089%;
  glycerin 4%; isopropyl myristate 3.92%; Sodium Laureth Sulfate 2.4%; propanediol
  1.834%; Decyl Glucoside 0.822%; Parfum 0.15%; hinoki water 0.108%; limonene 0.108%;
  and Phaseolus radiatus extract 0.003%. The older 2015 ingredient/quali-quanti sheet
  contains a superseded silicone formula with 3% ether and was not used for current values.
- `Registration DOC/SA/SA-GENOSYS SNOW O2.pdf` — adult rinse-off face cleanser, opaque
  viscous liquid, pH specification 5.3–6.3 and premix reconciliation: NF 38 supplies the
  8% ether; Phytolex SC is 0.2%; MultiEx Phytrogen is 0.01%. The patch-test result supports
  `dermatologically tested`, not a no-irritation guarantee.
- `Registration DOC/Artwork/[GENOSYS]SNOW O2(180ml).pdf` — dry-face application, eye-area
  avoidance, bubble formation, circular massage and tepid-water rinse; pregnancy and
  lactation precaution. Contract-manufacturer attribution was excluded.
- `Registration DOC/COA/COA-GENOSYS SNOW O2 180ml(WOB052).pdf` — measured pH 5.67 inside
  5.30–6.30, opaque viscous appearance, nominal 180 ml size and approximately three years
  unopened. The lot code and measured batch fill were not used in customer copy.
- No product-specific DTS MG deck with a quantified clinical result was found. No clinical
  percentage, sebum result, sensitive-skin trial or oxygen-therapy result was invented.

### Corrections and copy decisions

- Rewrote every central and bespoke Russian and Arabic customer-facing field. Russian now
  reads as natural professional cosmetology copy; Arabic is polished neutral MSA for UAE
  retail, with neutral instructions wherever practical.
- Positioned the verified ritual clearly: apply to dry skin, allow the air foam to form,
  massage gently in circles and rinse with tepid water. Removed the unsupported wet-finger
  second cycle.
- Preserved the formula's actual engine, Methyl Perfluoroisobutyl Ether at 8%, and the
  9.94% humectant base: butylene glycol 4.1089%, glycerin 4% and propanediol 1.834%.
- Preserved Cocamide DEA 6%, Sodium Laureth Sulfate 2.4%, Decyl Glucoside 0.822% and the
  measured pH 5.67 inside 5.30–6.30.
- Kept Phytolex SC and MultiEx Phytrogen as secondary premixes rather than co-leads. Their
  trace finished botanical components are not presented as the reason for the bubbles.
- Removed oxygen therapy, nutrifying and spa-treatment positioning; medical language;
  all-skin-types and sensitive-skin promises; no-irritation guarantees; Korean functional
  cosmetic implications; and unsupported clinical figures.
- Removed fragrance-free and sulfate-free claims because the current formula contains
  Parfum 0.15%, limonene and Sodium Laureth Sulfate 2.4%.
- Removed dossier vocabulary, lot codes, contract-manufacturer attribution and
  self-defeating audit commentary from customer-facing copy.
- Rewrote the RU/AR recommendation panel and routine label so both describe the verified
  dry-face ritual and position Snow Booster as the following toner step without implying
  oxygen therapy.

### Implementation

- Canonical central RU/AR fields: `data/productLocalizedCopyAudit.ts`
- Runtime translation-map overrides: `data/productTranslationsRu.ts` and
  `data/productTranslations.ts`
- Complete bespoke runtime copy:
  `components/product/snowo2/snowo2LocalizedCopy.ts`, consumed by `snowo2Copy.ts`
- Product 10 recommendation and routine strings: `messages/ru.json` and `messages/ar.json`
- Focused regression coverage checks runtime ownership, structured JSON, exact source values
  and prohibited medical or contradicted claim language
- Database `productNumber`, localized names and localized descriptions were updated

## Product 9 — POWER SOLUTION AWS

### Sources checked

- `Ingredient lists_old/GENOSYS POWER SOLUTION AWS.pdf`
- `Registration DOC/SA/SA-GENOSYS POWER SOLUTION AWS.pdf`
- `Registration DOC/Formula_up/Formula-GENOSYS POWER SOLUTION AWS.pdf`
- `Registration DOC/Artwork/[GENOSYS]POWER SOLUTION AWS.pdf`
- `Registration DOC/COA/COA-GENOSYS POWER SOLUTION AWS(L1031A).pdf`

The old ingredient list was reviewed first as required, but its arbutin 2% formula is
historical and does not match the current quantitative formula, current artwork INCI or
Safety Assessment. It was not carried into the live copy. The current formula is the source
for finished concentrations, the Safety Assessment for product type and precautions, the
artwork for the leave-on method and Korean functional positioning, and the COA for measured
physical values.

### Corrections

- Confirmed repository product 9 from the Prisma-backed product number and bespoke routing
  as `POWER SOLUTION AWS`, the anti-wrinkle Power Solution in ten sealed 2 ml glass vials.
- Rewrote every central and bespoke Russian and Arabic customer-facing field in idiomatic
  professional Russian and polished neutral MSA.
- Preserved the exact current formula facts: butylene glycol 12.515%; glycerin 9.0858%;
  combined humectant base 21.6008% (displayed as 21.60%); soy-milk ferment filtrate 2.5%;
  sodium hyaluronate 0.1002%; allantoin 0.1%; adenosine 0.04%; Copper Tripeptide-1 10 ppm;
  sh-Polypeptide-7 6.6 ppm; Acetyl Hexapeptide-8 2.5 ppm; Palmitoyl Tripeptide-1 2 ppm; and
  Ceramide NP 0.4 ppm.
- Preserved measured pH 4.93 within 4.80 ± 1.00, specific gravity 1.028 within
  1.000–1.050, measured fill 2.12 ml for a nominal 2 ml vial, and the light-yellow viscous
  appearance.
- Removed arbutin 2% from the current product story. It appears only in the older ingredient
  sheet and is absent from the current formula, artwork INCI and Safety Assessment.
- Removed Botox, muscle-relaxation, growth-hormone/IGF-1, tissue-repair, wound-healing,
  regeneration, reverse-ageing and drug-like claims. The trace peptides are identified only
  at their exact concentrations and within documented cosmetic functions.
- Removed the claim that microneedling or a roller is the product's purpose. AWS is a
  leave-on face serum; roller pairing is optional and practitioner-led.
- Challenged the printed `5-Free` panel against the formula. PEG-40 Hydrogenated Castor Oil
  is present and documented as a surfactant, so `no artificial surfactants` and the
  `5-Free` shorthand were removed.
- Corrected `fragrance-free` to the exact verifiable boundary: no `Parfum` and no artificial
  fragrance. Chamaecyparis obtusa water is documented as a fragrance ingredient, so the
  product is not described as fragrance-free.
- Preserved pregnancy/lactation avoidance from the Safety Assessment, dermatological
  testing, Korean origin, single-use handling and the verified leave-on application method.
- Rewrote recommendation strings so the roller is optional, AWS remains useful on its own,
  and the customer-facing rationale leads with adenosine 0.04%, wrinkle appearance and
  skin firmness rather than packaging commentary.

### Implementation

- Canonical central RU/AR fields: `data/productLocalizedCopyAudit.ts`
- Runtime translation-map overrides: `data/productTranslationsRu.ts` and
  `data/productTranslations.ts`
- Complete bespoke runtime copy:
  `components/product/powersolution/awsLocalizedCopy.ts`, consumed by `awsCopy.ts`
- Product 9 recommendation strings: `messages/ru.json` and `messages/ar.json`
- Regression coverage checks runtime ownership, structured JSON, exact source values and
  prohibited contradicted or medical claim language
- Database `productNumber`, localized names and localized descriptions were updated

## Product 8 — POWER SOLUTION SWS

### Sources read

- `Ingredient lists_old/GENOSYS POWER SOLUTION SWS.pdf` — mandatory first source and legacy
  INCI baseline
- `Registration DOC/Formula_up/Formula-GENOSYS POWER SOLUTION SWS.pdf` — current finished
  formula and exact percentages
- `Registration DOC/SA/SA-GENOSYS POWER SOLUTION SWS.pdf` — ingredient functions, safety
  boundary, pregnancy/lactation precaution and sh-Polypeptide-7 identity
- `Registration DOC/COA/COA-GENOSYS POWER SOLUTION SWS(L0767A).pdf` — pH, specific gravity,
  appearance and measured fill
- `Registration DOC/Artwork/[GENOSYS]POWER SOLUTION SWS.pdf` — current public INCI,
  directions, pack format, functional-cosmetic wording and printed `5-Free` panel
- `~/Desktop/Glass_Skin/01-official-pdfs/` was checked for the required DTS MG material.
  No SWS-specific deck was present there, so no branded complex or clinical figure was
  introduced from a secondary source.

### Corrections

- Rewrote every central, recommendation and bespoke Russian and Arabic customer-facing
  field. Russian now reads as natural professional cosmetology copy; Arabic is polished,
  neutral MSA suitable for UAE retail.
- Kept arbutin 2% as the single lead story. Kojic acid 0.05% and licorice root extract
  0.001% are not presented as co-leads.
- Preserved the exact current formula values: butylene glycol 10.224%; glycerin 7.486%;
  combined humectant base 17.71%; sodium hyaluronate 0.2002%; safflower 0.15%; kojic acid
  0.05%; allantoin 0.05%; adenosine 0.04%; grape and rose callus culture extracts 0.03%
  each; sh-Polypeptide-7 6.6 ppm; and Palmitoyl Tripeptide-1 0.5 ppm.
- Preserved the measured COA values: pH 7.72 inside the 8.00 ± 1.00 range, specific gravity
  1.032 inside the 1.000–1.040 range, 2.09 ml measured fill for a nominal 2 ml vial and
  light-yellow viscous appearance.
- Removed medical language around treatment, regeneration, healing and growth hormone.
  sh-Polypeptide-7 is identified only as a recombinant somatotropin-sequence peptide with
  the documented cosmetic skin-protecting function.
- Removed microneedling and roller use as a product instruction. The verified carton method
  is cleanse, open, apply and absorb; any professional technique is left to a qualified
  specialist.
- Challenged the printed `5-Free` panel against the current formula. Polysorbate 60 is
  present and is documented as a surfactant, so the copy does not promise `no artificial
  surfactants`. The customer-facing free-from list is limited to four supportable
  exclusions: parabens, ethanol, added colorants and `Parfum`.
- Avoided the unqualified `fragrance-free` claim. The formula has no `Parfum`, but
  Chamaecyparis obtusa water is an aromatic botanical ingredient, so the copy transparently
  allows for a faint natural raw-material scent.
- Preserved dermatological testing, Korean origin, ten sealed 2 ml glass vials, three-year
  unopened shelf life and the pregnancy/lactation precaution.

### Implementation

- Canonical central RU/AR fields: `data/productLocalizedCopyAudit.ts`
- Runtime translation-map overrides: `data/productTranslationsRu.ts` and
  `data/productTranslations.ts`
- Complete bespoke runtime copy: `components/product/powersolution/swsLocalizedCopy.ts`,
  consumed by `components/product/powersolution/swsCopy.ts`
- Product 8 recommendation strings: `messages/ru.json` and `messages/ar.json`
- Regression coverage checks runtime ownership, structured JSON, exact source figures,
  contradicted free-from language and prohibited medical claims
- Database `productNumber`, localized names and localized descriptions were updated

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
