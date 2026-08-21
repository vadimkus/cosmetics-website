# Product 46 HR³ MATRIX SCALP PEELING α RU/AR source audit

Date: 2026-08-21

## Outcome

Product 46 is now presented as a **100 ml professional leave-on cosmetic scalp cleanser and refresher**, not as a disinfectant, treatment, working-strength BHA peel or generic microneedling preparation.

The live RU and AR copy now follows the UAE/English carton method:

1. Decant about 5 ml.
2. Soak a cotton swab.
3. Work over the partings and massage the scalp.
4. Leave for 5 minutes.
5. Do not rinse.
6. Follow with Hair Solution only if it is part of the selected routine.

No frequency was found on the carton or in the safety assessment, so none is invented.

## Primary sources checked

- `Ingredient lists_old/HR3 MATRIX SCALP PEELING.pdf`
  - Superseded formula: Alcohol Denat. 19%, methylparaben and iodopropynyl butylcarbamate.
- `Registration DOC/Formula_up/Formula-GENOSYS HR3 MATRIX SCALP PEELING α.pdf`
  - Current signed quantitative formula.
- `Registration DOC/SA/SA-GENOSYS HR3 MATRIX SCALP PEELING α.pdf`
  - Hair-care leave-on product, adult use, pH specification 4.0–5.0, satisfactory challenge and patch testing.
- `Intertek_folder/Safety Assessment Report/Laborotary_test_HR3 MATRIX SCALP PEELING.pdf`
  - Older assessment covering intact cosmetic use; explicitly rejects claims for intentionally wounded skin/microneedle therapy as outside cosmetic scope.
- `Registration DOC/Artwork/[GENOSYS]HR3 MATRIX SCALP PEELING α.pdf`
  - Rendered visually because the PDF has no text layer. English panel confirms scalp refresher, swab application, massage, five-minute leave-on step before Hair Solution, 100 ml and 6M PAO. The registered Russian panel contains drug/procedure claims and conflicting 7–10 minute copy; those claims were not carried forward.
- `Registration DOC/COA/COA-GENOSYS HR3 MATRIX SCALP PEELING α(WNL088).pdf`
  - Transparent liquid, pH 4.31 at 25 °C, specification 4.00–5.00, stability pass at 50 °C, microbial counts below 10 cfu/ml, fill 100.33 ml.
- `public/documents/PPT/GENOSYS HR3 MATRIX SCALP PEELING ALPHA.pdf`
  - Supports the 5 ml glass-cylinder/swab technique. Its disinfection, inflammation, circulation, 5α-reductase, angiogenesis, anti-hair-loss and regrowth claims were rejected.
- Mesopecia kit carton/deck
  - The separate kit protocol sequences Scalp Peeling before its roller and the Arabic panel adds a 2–5 minute drying step. Product 46 must never be reapplied after rolling or to already punctured skin.

## Formula facts preserved

- Alcohol Denat. 33.600%
- Propylene Glycol 11.994%
- PEG-60 Hydrogenated Castor Oil 2.000%
- Menthol 0.900%
- Menthyl Lactate 0.800%
- Phenoxyethanol 0.200%
- Chlorphenesin 0.150%
- Betaine 0.100%
- Salicylic Acid 0.00990% / 99 ppm
- Green tea 0.5 ppm
- Green tea at 0.5 ppm plus fifteen other botanical extracts at 0.1 ppm each
- Copper Tripeptide-1 0.00000050% / 5 ppb

The complete quantitative formula is available in both localized product-detail payloads. Trace botanicals and peptide are not assigned efficacy.

## Claim corrections

Removed:

- disinfection, antisepsis or sterilisation
- anti-inflammatory action
- improved circulation or blood flow
- follicle opening, clearing or strengthening
- improved absorption, penetration or treatment contact
- hair-loss prevention or hair-growth support
- standalone microneedling-preparation claims
- “gentle” positioning
- routine frequency not found in the held sources
- rinsing instructions, which contradicted the leave-on carton and safety assessment

Kept:

- deep cosmetic cleansing of sebum, surface flakes and styling residue
- strong cooling from menthol plus menthyl lactate
- five-minute leave-on method before Hair Solution
- intact-scalp-only boundary
- six-month PAO and three-year unopened life
- exact pH, fill, stability, microbiological and patch-test facts

## Live surfaces updated

- canonical RU/AR localized module and translation maps
- bespoke product 46 PDP copy
- static English fallback
- quick facts
- routine and product recommendation strings
- hair-concern routine
- chatbot catalogue and safety boundary
- Mesopecia kit copy and translation records
- Hair Stamp, HairGen Booster and scalp-brush references
- idempotent production updater with `productNumber: "46"` and parity verification
- focused localization tests
- `.gitignore` build exception

## Database

Run:

```bash
npx tsx --env-file=.env.local scripts/update-product-46-localized-copy-20260821.ts
```

The updater finds the record by product number, legacy id or product name, checks that product number `46` is not owned by another record, updates canonical and localized fields, clears unsupported frequency, replaces legacy target concerns, and reads the record back for exact parity.
