# Product 38 EZ CO₂ MASK KIT — audit and bespoke page — 2026-08-15

## What
Same rolling pass as products 12, 19 and 51: Intertek first, then selling-tone rewrite, then a dedicated editorial page in EN / AR / RU. Image discrepancies went into the existing desktop worklist, same DATA-object pattern as products 12 and 66.

Live target: https://genosys.ae/products/38

Artwork worklist: `~/Desktop/genosys-artwork-corrections.html` (product 38 block)

## Sources
- `Intertek_folder/Quali-quanti Ingredients/GENOSYS EZ CO2 GEL.pdf` — gel finished concentrations. Carbomer 3.94%. No lactic acid. No bicarbonate.
- `Intertek_folder/Quali-quanti Ingredients/GENOSYS EZ CO2 MASK.pdf` — mask finished concentrations. Sodium bicarbonate 9%. Lactic acid 0.33% in the mask only.
- `Registration DOC/SA/SA-GENOSYS EZ CO2 MASK KIT (GEL+MASK).pdf` — two-part kit, rinse-off after 10 minutes, gel pH 2.0-3.0, mask pH 7.7-8.7. PAO not documented.
- `Registration DOC/Artwork/[GENOSYS]EZ CO2 MASK.pdf` — Bohr Effect sentence, 10-minute EN/FR/KR how-to, sparkling 20-30 seconds, contents Gel 20g ×5 / Mask 12g ×5 / Spatula ×1. Turkish 20 minutes and Russian 10+5 are drifted.
- `Registration DOC/Formula/Formula-GENOSYS EZ CO2 GEL.pdf` and `...MASK.pdf` — registered INCI, DTS MG as registrant.
- COA gel pH 2.2 (lot omitted). COA mask pH 8.16 (lot omitted).
- DTS MG deck `public/documents/PPT/Genosys Ez Co2 Mask.pdf` — 5 treatments, 5-10 minutes, before/after photos. No quantified clinical figures. Slimming / fat / 7-day pages are cut.

## Distinctive fact
This is a **two-part carboxy kit**. The gel is an acidic carbomer base. The sheet carries sodium bicarbonate at 9%. They meet on dry skin, CO₂ forms, you wait **ten minutes**, you rinse. Five treatments and a spatula.

Bohr Effect is the manufacturer's name for the oxygen-delivery story. It is not a measured blood-flow study.

## Cut from live copy
- 15-20 minutes and 20-30 minutes (artwork and SA are 10)
- Peptide mask in the kit (not on the artwork)
- Lactic acid as a gel hero (it is 0.33% in the mask)
- Slimming, fat metabolized, cheek contour as fat loss
- Anti-inflammation, improved blood flow, cellular activation, anti-ageing as results
- 7-day miracle schedule
- Clinic / salon at home
- Anti-blemish as acne treatment
- Wound healing / repair / circulation boost
- Fragrance-free (no Parfum, but grapefruit extract is in both)
- All skin types including sensitive as a blanket
- Clinical percentages (deck has photos, not numbers)
- PAO (SA says it is not documented)
- Lot codes
- The contract manufacturer (DTS MG only)
- Chatbot `EZ CO2 Mask {{id:51}}` (51 is Bio-Ferment)

Gallery s1 still prints "Repairing" on the Centella icon. Gallery s4 still prints IMPROVED BLOOD FLOW. Main still titles the box PROFESSIONAL KIT. Those are later image jobs, already logged in the desktop HTML. The editorial copy does not repeat them. Engine figure is `s8.jpeg` (official name + spatula).

## Page
`components/product/ezco2/` — Cerabarrier primitives, teal palette from the mask sachet.

Sections: Meet · Activate · Rinse → bicarbonate 9% engine → dry skin + ten minutes → actives + both registered INCIs → suited / not → routine (10 / 38 / 14 / 29) → spec (gel pH 2.2 in 2.0-3.0, mask 8.16 in 7.7-8.7, no lot, no PAO) → FAQ → reviews.

No proof chart. The deck has photos, not numbers.

Wired in `bespokePdp.tsx` and the EN / AR / RU product routes. DB row now has `productNumber = '38'`. Cache key bumped to `product-by-id-v8`.

## Files
- `components/product/ezco2/ezco2Copy.ts`
- `components/product/ezco2/ezco2.css`
- `components/product/ezco2/EzCo2ProductPage.tsx`
- `scripts/update-product-38-ez-co2-selling-copy-20260815.ts`
- DB + AR/RU translations + quick facts + `lib/products.ts` fallback + routine strings + chatbot leftovers
