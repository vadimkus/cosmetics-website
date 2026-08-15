# Product 51 BIO-FERMENT AGE DEFYING POWDER MASK — audit and bespoke page — 2026-08-15

## What
Same rolling pass as products 4, 5 and 19: Intertek first, then selling-tone rewrite, then a dedicated editorial page in EN / AR / RU.

Live target: https://genosys.ae/products/51

## Sources
- `Intertek/BIOFERMENT_MASK/Formula-GENOSYS BIO-FERMENT AGE DEFYING POWDER MASK.pdf` — quantitative formula
- `Intertek/BIOFERMENT_MASK/COA-GENOSYS BIO-FERMENT AGE DEFYING POWDER MASK.pdf` — white powder, coagulation 5–10 min (measured 6 min 10 sec). No pH. Lot code not printed.
- `Intertek/BIOFERMENT_MASK/Front.jpeg` + `Back.jpeg` — pack sentence, mix 1 : 1.5, 15–20 min peel, PAO 6M, dermatologically tested
- DTS MG deck `GENOSYS BIO-FERMENT AGE DEFYING POWDER MASK.pptx` (also the live PDF on genosys.ae) — +218% hydration (17.27 → 48.513), cooling cases −10 / −11°C, 21 women 30–59, “doesn’t dry out” vs Hydro Cool

No safety assessment on file. No dedicated Glass_Skin deck.

## Distinctive fact
This is a **professional alginate modeling mask**. Diatomaceous earth 41.79% + glucose 35% + algin 15% + calcium sulfate 6% are the jar. Mix 40g with water at 1 : 1.5, it sets, it peels, and it holds moisture instead of drying out. Hydration rose **218%** in the DTS MG trial.

The four ferments sit at 0.001% (pomegranate ferment at 0.00001%). The six sh-peptides sit at **1 ppb each**. They are in the formula. They are not the engine.

## Pack vs formula INCI
The back label prints Hydrolyzed Corn Starch and sh-Polypeptide-11, and omits Hydrolyzed Collagen, Allantoin and sh-Polypeptide-3. The registered formula has collagen 0.2%, allantoin 0.1% and sh-Polypeptide-3. The page prints the registered list and does not claim it matches the carton.

## Cut from live copy
- Fermented rice / soy / ginseng / green tea as lead actives (AR/RU still had all four; EN dump still had green tea + HA)
- Hyaluronic acid (not in the formula)
- “Mix with your preferred liquid” (the pack says water)
- “Rinse thoroughly” (the pack says peel, then wipe with toner)
- Six growth factors / six regenerative peptides as the reason it works (quick facts were double-counting the same 1 ppb peptides)
- Healing / regeneration / anti-inflammatory language from the deck’s peptide slides
- Lot code S601P1
- The contract manufacturer on the COA (DTS MG only)

A July 2026 audit only removed “Fermented Green Tea” and renamed “Fermented Rice”. That was not enough.

## Page
`components/product/bioferment/` — Cerabarrier primitives, peach/terracotta palette from the jar label.

Sections: Hydrate · Cool · Peel → earth/algin/set engine → 218% proof chart → mix 1 : 1.5 + video → actives + registered INCI → suited / not → routine (10 / 51 / 14 / 29) → spec (no pH, no lot, PAO 6 months) → FAQ → reviews.

Wired in `bespokePdp.tsx` and the EN / AR / RU product routes. DB row now has `productNumber = '51'`. Cache key bumped to `product-by-id-v4`.

## Files
- `components/product/bioferment/bioFermentCopy.ts`
- `components/product/bioferment/bioferment.css`
- `components/product/bioferment/BioFermentProductPage.tsx`
- `scripts/update-product-51-bio-ferment-selling-copy-20260815.ts`
- DB + AR/RU translations + quick facts + routine strings + `lib/products.ts` fallback
