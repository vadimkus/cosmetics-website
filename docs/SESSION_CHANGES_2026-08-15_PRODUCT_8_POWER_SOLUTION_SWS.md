# Product 8 POWER SOLUTION SWS - audit and bespoke page - 2026-08-15

## What
Same rolling pass as products 4, 5, 12, 17, 19, 24, 33, 34, 35, 37, 38 and 51: Intertek first, then selling-tone rewrite, then a dedicated editorial page in EN / AR / RU. Image discrepancies went into the existing desktop worklist.

Live target: https://genosys.ae/products/8

Artwork worklist: `~/Desktop/genosys-artwork-corrections.html` (product 8 block)

## Sources
- `Registration DOC/Formula_up/Formula-GENOSYS POWER SOLUTION SWS.pdf` - finished concentrations. Signed DTS MG, Narae Han. Arbutin 2.0000%. Butylene glycol 10.224%. Glycerin 7.486%. Kojic acid 0.0500%. Licorice extract 0.0010%. Licorice ferment 0.00007%. Sodium hyaluronate 0.2002%. Safflower 0.1500%. sh-Polypeptide-7 0.00066% (6.6 ppm). Palmitoyl Tripeptide-1 0.00005% (0.5 ppm).
- `Registration DOC/SA/SA-GENOSYS POWER SOLUTION SWS.pdf` - Face serum, leave-on, adults. Arbutin raw 2.0000%. Hydroquinone must stay below 1 ppm (purity check, not a selling line).
- `Registration DOC/Artwork/[GENOSYS]POWER SOLUTION SWS.pdf` - English: Skin Depigmenting & Whitening Solution; function skin depigmenting and whitening; helps improve pigmentation, even skin tone and brighten the skin surface; 2 ml × 10; four pictograms cleanse / open / apply / absorb; 5-Free; avoid pregnancy/lactation; keep off the eyes. Korean: 미백 기능성 화장품, 주성분 알부틴. Russian panel invents microneedling, neocolagenesis and collagen. Arabic panel is thin.
- `Registration DOC/COA/COA-GENOSYS POWER SOLUTION SWS(L0767A).pdf` - Light yellow viscous liquid. pH 7.72 inside 8.00 ± 1.00. SG 1.032 inside 1.000-1.040. 2.09 ml against 2 ml. Lot omitted on the page. Contract manufacturer omitted.

The 2011 Quali-quanti sheet is a superseded formula. Ignored, same rule as CVS.

## Distinctive fact
This is the **pigment ampoule** of the six Power Solutions. **Arbutin 2%** is the vial. Korea registers it as a whitening functional cosmetic and names arbutin as the principal ingredient. Leave-on. Cleanse, open, apply, absorb. Ten sealed 2 ml glass vials.

Kojic acid is **0.05%**. Licorice extract is **0.001%**. They are in the formula. They are not the engine.

English carton does **not** mention a roller. Same call as CVS, opposite of HES. The roller survives in the FAQ only, as what GENOSYS designs around.

Not fragrance-free: hinoki cypress water is a fragrance ingredient. 5-Free names artificial fragrance. Those are different sentences.

pH 7.72 inside 8.00 ± 1.00. Do not call it near-neutral.

No pregnancy-safe line. The English carton prints avoid during pregnancy and lactation (two artemisia extracts).

## Cut from live copy
- Microneedling as the product's purpose / "apply during microneedling" / licensed-only
- Efficacy test on hyperpigmentation (no deck, no Intertek figure)
- Kojic acid and licorice as co-leads
- Healing / clarity / prevent new dark spots
- All skin types
- Fragrance-free
- IGF-1 analogue (already corrected on 14 Aug; do not let back)
- Tissue repair / cell production / regeneration from the peptide panel
- The Russian carton claims (microneedling, neocolagenesis, collagen, ageing)
- Lot codes
- The contract manufacturer (DTS MG only)

## Page
`components/product/powersolution/` - shared Power Solution layout, new `swsCopy.ts` + `SwsProductPage.tsx` + `.ps-sws` orange palette from Pantone 151 C / the vial wordmark.

Sections: solution (the three letters + arbutin 2%) → formula chart (17.71% humectant, then actives scaled against arbutin) → 5-Free → range → how to (four pictograms) → actives + Formula_up INCI → suited / not → spec (pH 7.72 in 8.00 ± 1.00) → FAQ.

No proof chart. No molecular-weight ladder (that is HES only). No retail routine: cross-sell is the other five vials.

Wired in `bespokePdp.tsx` and the EN / AR / RU product routes. DB row now has `productNumber = '8'`. Cache key bumped to `product-by-id-v15`. Hero squared to `/images/sws-hero.jpg`. Gallery is box + vial only; main is prepended.

## Files
- `components/product/powersolution/swsCopy.ts`
- `components/product/powersolution/SwsProductPage.tsx`
- `components/product/powersolution/powersolution.css` (`.ps-sws`)
- `scripts/square-sws-hero-image-20260815.py`
- `scripts/update-product-8-power-solution-sws-selling-copy-20260815.ts`
- `public/images/sws-hero.jpg`
- DB + AR/RU translations + `lib/products.ts` fallback + `pc8` pairing copy + chatbot one-liner
