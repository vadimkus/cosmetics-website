# Product 13 SKIN RENEWAL PEELING SYSTEM (SRS) - audit and bespoke page - 2026-08-16

## What
Same rolling pass as products 4-12, 17, 19, 24, 33-35, 37, 38, 50 and 51: Intertek first, then selling-tone rewrite, then a dedicated editorial page in EN / AR / RU.

Live target: https://genosys.ae/products/13

Artwork worklist: `~/Desktop/genosys-artwork-corrections.html` (product 13 block)

## Sources
- `Intertek_folder/Quali-quanti Ingredients/GENOSYS SKIN RENEWAL PEELING SYSTEM.pdf` - finished concentrations. COTDE 12 Mar 2019. Glycolic Acid 15%. Lactic Acid 13.5%. Mandelic Acid 2%. Sodium Hydroxide 2.7%. Glycerin 25%. Phytic Acid 0.005%. sh-Polypeptide-7 0.0000000100% (0.1 ppb). The DTS MG Formula PDF lists the same INCI without figures.
- `Registration DOC/Artwork/[GENOSYS]SKIN RENEWAL PEELIGN SYSTEM(SRS).pdf` - Function: Soft peeling. Professional peeling system for smoother, brighter, more even tone. Apply evenly, avoid lips and eye area, 15-20 minutes, rinse with cold water. 2 ml × 10. DERMATOLOGICALLY TESTED. Precautions: patch test, sunscreen after, not on broken / irritated skin. EAN `8809392231144`. Korean: high-AHA, consult a professional. Russian carton mentions microneedling. English does not. Filename typo PEELIGN is the file.
- `Registration DOC/Formula/Formula-GENOSYS SKIN RENEWAL PEELING SYSTEM(SRS).pdf` - registered INCI, signed DTS MG, Narae Han. No percentages.
- `Registration DOC/COA/COA-GENOSYS SKIN RENEWAL PEELING SYSTEM(L1037B).pdf` - pH 3.02 inside 4.00 ± 1.00 (3.00 to 5.00). Older L0907U COA prints the same pH. Do not print lot codes.

No Safety Assessment for SRS is on file. No DTS MG deck with a quantified clinical figure. Do not invent a collagen %, a pigment trial, or a licensed-practitioner rule.

## Distinctive fact
This is a **professional AHA peel** in **2 ml × 10** vials. Carton function is **soft peeling**. **Glycolic 15% + lactic 13.5% + mandelic 2% = 30.5% acids**. Apply evenly, keep off the lips and the eye area, sit **15-20 minutes**, rinse with **cold water**.

Not Epi (enzyme + cellulose home gommage). Not a neutralize step. Not a peptide treatment. sh-Polypeptide-7 sits at **0.1 ppb**. pH **3.02**.

No home retail routine. `PRODUCT_ROUTINES` already excludes professional clinic lines.

## Cut from live copy
- Fruit-acid wellness / naturally occurring as the engine
- sh-Polypeptide-7 as healing / collagen / regeneration
- Neutralize step (leftover AR/RU invented it)
- Licensed practitioner only (leftover invented it)
- Pregnancy / lactation (carton does not print it)
- All skin types / sensitive
- Fragrance-free (box says no artificial fragrance; hinoki water is a fragrance ingredient)
- Microneedling as the purpose (RU carton only; English is apply, wait, rinse)
- Collagen / elastin / tyrosinase / antibacterial as measured results
- Lot codes (`L1037B`, `L0907U`)
- The contract manufacturer (DTS MG only)

Removed the Microneedling Protocols PDF from `productConfig` so the generic PDP no longer pushes the wrong document.

## Images
Hero stays `/images/SRS.jpg` (kit + box, already on the live page).

Gallery (main not included):
- `/images/srs/carton-vial.jpeg` - Intertek pics packshot, box + vial
- `/images/srs/kit-open.jpeg` - open kit, ten vials
- `/images/srs/vial.jpeg` - single vial

`productConfig` no longer overrides the gallery. Claim-graphic lid text is on the real open box photo; that photo is a packshot of the product as sold.

## Page
`components/product/srs/` - Cerabarrier primitives + cool-bone / steel palette from the cold-water rinse (`#4a6468` on `#f2f3f1`). Kept clear of Snow O₂ ember, Remover gold, Epi mint, and Eye Kit crimson (the box is 187 C, already that accent).

Sections: effects (apply / sit / cold rinse) -> engine (three AHAs) -> how to (patch test, apply, 15-20 min, cold rinse) -> actives + registered INCI -> suited / not -> FAQ.

No routine grid. Wired in `bespokePdp.tsx` and the EN / AR / RU product routes. Cache key bumped to `product-by-id-v22`.

## Files
- `components/product/srs/srsCopy.ts`
- `components/product/srs/SrsProductPage.tsx`
- `components/product/srs/srs.css`
- `public/images/srs/carton-vial.jpeg`
- `public/images/srs/kit-open.jpeg`
- `public/images/srs/vial.jpeg`
- `scripts/update-product-13-srs-selling-copy-20260816.ts`
