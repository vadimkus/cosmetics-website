# Product 6 POWER SOLUTION CTS - audit and bespoke page - 2026-08-16

## What
Same rolling pass as products 4, 5, 8, 9, 12, 17, 19, 24, 33, 34, 35, 37, 38 and 51: Intertek first, then selling-tone rewrite, then a dedicated editorial page in EN / AR / RU. Image discrepancies went into the existing desktop worklist.

Live target: https://genosys.ae/products/6

Artwork worklist: `~/Desktop/genosys-artwork-corrections.html` (product 6 block)

## Sources
- `Registration DOC/Formula_up/Formula-GENOSYS POWER SOLUTION CTS.pdf` - finished concentrations. Signed DTS MG, Narae Han. Glycerin 14.5798%. Butylene glycol 13.485%. Soy ferment 2.5000%. Sodium hyaluronate 0.1002%. Hydrolyzed collagen 0.1000%. Copper tripeptide-1 0.0212% (212 ppm). sh-Polypeptide-7 0.0001% (1 ppm). Palmitoyl tripeptide-1 0.0001%. Palmitoyl hexapeptide-12 0.0001%. Glycolic acid 0.0200% (pH adjuster).
- `Registration DOC/SA/SA-GENOSYS POWER SOLUTION CTS.pdf` - December 2020 amendment. Face serum, leave-on, adults. Applied on the face and not rinsed off. Function: improvement of skin texture. Hydrolyzed collagen named as fish collagen in the raw table. Premixes (SUNPEP GHK-CU 5000 at 4%, C-PEP ELASTYL, APEPPOLY-3) ignored.
- `Registration DOC/Artwork/[GENOSYS]POWER SOLUTION CTS.pdf` - English: Cytokine Concentrate Solution; function improvement of skin texture; helps the skin retain its natural elasticity and increases the strength of skin; 2 ml x 10; four pictograms cleanse / open / apply / absorb; 5-Free; avoid pregnancy/lactation; keep off the eyes. Korean panel does not name a principal ingredient and does not print 기능성. Russian panel invents remodeling, wound healing, scars, neocollagenesis and a dermaroller. Arabic panel is thin. Inner lid prints the GH / tissue-repair peptide panel.
- `Registration DOC/COA/COA-GENOSYS POWER SOLUTION CTS(L1133A).pdf` - Light blue viscous liquid. pH 7.61 inside 7.00 ± 1.00. SG 1.041 inside 1.000-1.050. 2.06 ml against 2 ml. Lot omitted on the page. Contract manufacturer omitted.

The 2011 Quali-quanti sheet is a superseded formula. Ignored, same rule as CVS, SWS and AWS.

## Distinctive fact
This is the **texture ampoule** of the six Power Solutions. **CTS is Cytokine Concentrate Solution.** The carton function is **improvement of skin texture**. Leave-on. Cleanse, open, apply, absorb. Ten sealed 2 ml glass vials.

Not a Korean functional cosmetic. There is no principal ingredient to name.

Soy ferment is **2.5%** by weight. Hydrolyzed collagen is **0.1%** (fish). Sodium hyaluronate is **0.1%**. Copper tripeptide-1 is **0.0212% / 212 ppm**, the largest peptide dose in the range. They are in the formula. They are not the engine.

Humectant base is **28.06%**, the largest of the six.

English carton does **not** mention a roller. Same call as CVS, SWS and AWS, opposite of HES. The roller survives in the FAQ only, as what GENOSYS designs around.

Not fragrance-free: hinoki cypress water is a fragrance ingredient. 5-Free names artificial fragrance. Those are different sentences.

pH 7.61 inside 7.00 ± 1.00.

No pregnancy-safe line. The English carton prints avoid during pregnancy and lactation (two artemisia extracts). Fish-collagen allergy is named.

## Cut from live copy
- Microneedling as the product's purpose / "apply during microneedling" / licensed-only
- Collagen / hyaluronic acid / a remodeling peptide complex as co-leads
- Healing / regeneration / tissue repair / neocollagenesis / scar smoothing
- Growth hormone / IGF-1 analogue
- Wound healing / "the regenerator" for copper tripeptide-1
- Glycolic acid as an AHA peel
- A Korean functional licence / principal ingredient
- All skin types
- Fragrance-free
- The Russian carton claims (dermaroller, wounds, scars)
- Lot codes
- The contract manufacturer (DTS MG only)

## Page
`components/product/powersolution/` - shared Power Solution layout, new `ctsCopy.ts` + `CtsProductPage.tsx` + `.ps-cts` teal palette from Pantone 320 C / the vial wordmark.

Sections: solution (the three letters + texture) -> formula chart (28.06% humectant, then actives scaled so soy 2.5% and copper 0.0212% can sit together) -> 5-Free -> range -> how to (four pictograms) -> actives + Formula_up INCI -> suited / not -> spec (pH 7.61 in 7.00 ± 1.00) -> FAQ.

No proof chart. No molecular-weight ladder (that is HES only). No retail routine: cross-sell is the other five vials.

Wired in `bespokePdp.tsx` and the EN / AR / RU product routes. DB row now has `productNumber = '6'`. Cache key bumped to `product-by-id-v17`. Hero squared to `/images/cts-hero.jpg`. Gallery is box + vial only; main is prepended.

## Files
- `components/product/powersolution/ctsCopy.ts`
- `components/product/powersolution/CtsProductPage.tsx`
- `components/product/powersolution/powersolution.css` (`.ps-cts`)
- `scripts/square-cts-hero-image-20260816.py`
- `scripts/update-product-6-power-solution-cts-selling-copy-20260816.ts`
- `public/images/cts-hero.jpg`
- DB + AR/RU translations + `lib/products.ts` fallback + `pc6` pairing copy + chatbot one-liner
