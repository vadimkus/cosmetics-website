# Product 34 SKIN RESCUE OVERNIGHT CREAM MASK — audit and bespoke page — 2026-08-15

## What
Same rolling pass as products 12, 17, 19, 24, 33, 38 and 51: Intertek first, then selling-tone rewrite, then a dedicated editorial page in EN / AR / RU. Image discrepancies went into the existing desktop worklist, same DATA-object pattern as product 33.

Live target: https://genosys.ae/products/34

Artwork worklist: `~/Desktop/genosys-artwork-corrections.html` (product 34 block)

## Sources
- `GENOSYS SKIN RESCUE OVERNIGHT CREAM MASK/Ingredients-GENOSYS SKIN RESCUE OVERNIGHT CREAM MASK.pdf` — finished concentrations. Signed DTS MG, Narae Han. No Formula_up sheet under this SKU name. Niacinamide 2.000000%. Adenosine 0.040000%. Trehalose 2%. Glycerin 6%. Oxygen 0.000000%. All six named growth factors 0.000000%. Ceramide NP 0.000005%.
- `Registration DOC/Formula_up/Formula-GENOSYS EGF REPAIR OXYMASK CREAM.pdf` — a different product. Do not borrow its SA, COA or artwork.
- `GENOSYS SKIN RESCUE OVERNIGHT CREAM MASK/Artwork-GENOSYS SKIN RESCUE OVERNIGHT CREAM MASK.pdf` — English: soothing, revitalizing; last step; do not wash off; do not use near eyes; 100g. Korean: dual-function brightening + wrinkle care; efficacy ingredients Niacinamide and Adenosine. No pregnancy / lactation warning on the English pack. PAO not documented.
- `GENOSYS SKIN RESCUE OVERNIGHT CREAM MASK/COA-GENOSYS SKIN RESCUE OVERNIGHT CREAM MASK(M30A15B).pdf` — pH 5.71 inside 5.8 ± 0.5. Lot omitted on the page. Contract manufacturer omitted.
- DTS MG deck `public/documents/PPT/GENOSYS SKIN RESCUE OVERNIGHT CREAM MASK.pdf` — four-week trial (Dr Koziej): TEWL -15%, erythema -26%. Special overnight care once or twice a week. The deck heroes oxygen and the growth-factor list. The formula sheet does not.

## Distinctive fact
This is a **leave-on overnight cream mask**. Last step. Do not wash off. 100g tube. The Korean functional pair is **Niacinamide 2%** (brightening) and **Adenosine 0.04%** (wrinkle care). That is the product.

The deck and the live site sold oxygen therapy and a growth-factor complex. Finished Oxygen is **0%**. Every named growth factor is **0%**. Pink Ceramide Complex is fireweed + Lactobacillus + Ceramide NP at **0.000005%**. Do not hero it as a dose.

No pregnancy line on the English pack. Do not invent avoid or pregnancy-safe.

## Cut from live copy
- Oxygen therapy as the engine
- Growth-factor complex (EGF / aFGF / bFGF / PlGF / IGF) as a hero
- Pink Ceramide as a dose
- Pumpkin / phytosphingosine / centella as cards
- All skin types
- Fragrance-free
- Rinse in the morning
- 2-3 times a week (deck is once or twice)
- Neck (pack says the face)
- Pregnancy-safe or pregnancy-avoid
- CLINICALLY PROVEN as a shout (the 15% / 26% figures stay)
- PAO
- Lot codes
- The contract manufacturer (DTS MG only)

Gallery S1, S2 and S4 still sell oxygen therapy and the growth-factor list. S3 numbers are right; only CLINICALLY PROVEN is dossier voice. S5 overlay still says firmer. Those are later image jobs, already logged in the desktop HTML. The editorial copy does not repeat them. Engine figure is `S3.jpeg` (four-week TEWL / erythema).

## Page
`components/product/overnight/` — Cerabarrier primitives, ballet-slipper pink palette from the tube.

Sections: Soothe · Hold water · Brighter look · Smoother lines → Niacinamide 2% engine → last step, leave on overnight → actives + carton INCI → suited / not (take-off masks, oxygen / GF story, eyes, fragrance-free) → routine (cleanse / booster / hyaluron serum / 34) → spec (100g, pH 5.71 in 5.3-6.3, no lot, no PAO) → FAQ → reviews.

Proof line uses the DTS MG four-week figures. No CLINICALLY PROVEN shout.

Wired in `bespokePdp.tsx` and the EN / AR / RU product routes. DB row now has `productNumber = '34'`. Cache key bumped to `product-by-id-v12`.

Charming Look box (57) leftovers that sold six growth factors for this SKU were rewritten to the same pair.

## Files
- `components/product/overnight/overnightCopy.ts`
- `components/product/overnight/overnight.css`
- `components/product/overnight/OvernightProductPage.tsx`
- `scripts/update-product-34-skin-rescue-overnight-selling-copy-20260815.ts`
- DB + AR/RU translations + quick facts + `lib/products.ts` fallback + routine strings + `pc34` pairing copy + Charming Look 34 leftovers
