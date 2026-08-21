# Product 45 HR³ MATRIX HAIR SOLUTION α RU/AR localization audit

Date: 21 August 2026

## Scope

Rewrote the live Russian and Arabic product 45 copy across canonical translation data, the bespoke PDP, quick facts, connected routine/SEO/chatbot copy, Hair Stamp, Scalp Brush and Mesopecia Kit references, tests and the production product record.

## Source hierarchy

1. Registered professional and homecare artwork: `4 ml × 8`, immediate use after opening, pregnancy/lactation warning, professional and home instructions.
2. Signed formula: exact percentages and ppm values, including 1,2-Hexanediol.
3. Safety assessment: registered category `Leave-In Conditioner (Hair Care)` and patch-test context.
4. COA WNL122: measured pH `6.65` within `6.00–7.00` and batch quality controls.
5. DTS MG training/deck/protocol: technique context only where consistent with registered artwork.

The carton instruction to use immediately after opening controls over the older deck instruction to refrigerate a half-used vial. The live copy now says to discard the remainder.

## Corrections

- Corrected the format from legacy `5 ml` to `4 ml × 8 single-use vials`.
- Uses the registered cosmetic framing: nutrition supply and hair conditioning.
- Removed hair-loss treatment/prevention, regrowth, DHT/5α-reductase, angiogenesis, follicle strengthening, circulation, deep-delivery and trace-ingredient efficacy claims.
- Removed unsupported sterility and `sterile-by-design` wording.
- Preserved exact formula facts:
  - propylene glycol `9.995%`
  - 1,2-hexanediol `2.042%`
  - PEG-40 hydrogenated castor oil `1.000%`
  - carbomer `0.450%`
  - menthol `0.200%`
  - niacinamide and panthenol `0.100%` each
  - Copper Tripeptide-1 `5 ppm`
  - four recombinant peptides `1.2 ppm` total, individually `0.5 / 0.5 / 0.15 / 0.05 ppm`
  - broccoli `100 ppm`, saw palmetto `10 ppm`, nine Black Complex extracts `1 ppm` each
  - measured pH `6.65`, specification `6.00–7.00`
- Preserved the documented professional technique: `0.25–0.5 mm`, `10–15 minutes`, partings `1–2 cm`.
- Preserved the home-applicator cleaning sequence and the pregnancy/lactation warning.
- Described the patch result as no observed irritation, with the assessor's statistical limitation; no efficacy inference.

## Implementation

- `data/product45LocalizedCopy.ts`
- `components/product/hr3/hairSolutionLocalizedCopy.ts`
- `components/product/hr3/hairSolutionCopy.ts`
- `data/productTranslations.ts`
- `data/productTranslationsRu.ts`
- `lib/productQuickFactsCatalog.ts`
- `lib/concernsData.ts`
- `lib/chatbot/config.ts`
- `messages/ru.json`
- `messages/ar.json`
- `components/product/hairstamp/hairstampCopy.ts`
- `components/product/scalpbrush/scalpBrushCopy.ts`
- `components/product/hr3/mesopeciaKitCopy.ts`
- `scripts/update-product-45-hair-solution-record-20260817.ts`
- `__tests__/data/product45LocalizedCopy.test.ts`

The updater is idempotent, assigns `productNumber: "45"`, clears unsupported generic `usage` and `skinType` fields and checks exact parity after writing.

## Verification

Verification commands and production DB parity result are recorded in the completion response for this session.
