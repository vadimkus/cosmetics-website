# Product 7 POWER SOLUTION PCS - audit and bespoke page - 2026-08-16

## What
Same rolling pass as products 4, 5, 6, 8, 9, 12, 17, 19, 24, 33, 34, 35, 37, 38 and 51: Intertek first, then selling-tone rewrite, then a dedicated editorial page in EN / AR / RU. Image discrepancies went into the existing desktop worklist.

This closes the six-vial Power Solution set.

Live target: https://genosys.ae/products/7

Artwork worklist: `~/Desktop/genosys-artwork-corrections.html` (product 7 block)

## Sources
- `Registration DOC/Formula_up/Formula-GENOSYS POWER SOLUTION PCS.pdf` - finished concentrations. Signed DTS MG, Narae Han. Butylene glycol 12.9935%. Glycerin 9.9857%. Soy ferment 1.5000%. Panthenol 0.5000%. Witch hazel 0.0450%. Houttuynia 0.0010%. sh-Polypeptide-7 0.0005% (5 ppm). Acetyl hexapeptide-8 0.0005% (5 ppm). Glycolic acid 0.0500% (pH adjuster).
- `Registration DOC/SA/SA-GENOSYS POWER SOLUTION PCS.pdf` - December 2020 amendment. Face serum, leave-on, adults. Applied on the face and not rinsed off. Function: oil&sebum control. Premixes (witch hazel BG-J at 3%, APEPPOLY-3) ignored.
- `Registration DOC/Artwork/[GENOSYS]POWER SOLUTION PCS.pdf` - English: Problem Control Solution; function oil and sebum control; controls excessive oil production and helps reduce the appearance of blemishes; 2 ml x 10; four pictograms cleanse / open / apply / absorb; 5-Free; avoid pregnancy/lactation; keep off the eyes. Korean panel does not name a principal ingredient and does not print 기능성. Russian panel invents post-acne, pore diameter, neocollagenesis, any-serum layering and a dermaroller. Arabic panel is thin. Inner lid prints the GH / tissue-repair peptide panel.
- `Registration DOC/COA/COA-GENOSYS POWER SOLUTION PCS(L0136B).pdf` - Red-brown viscous liquid. pH 7.98 inside 7.70 ± 1.00. SG 1.031 inside 1.000-1.050. 2.08 ml against 2 ml. Lot omitted on the page. Contract manufacturer omitted.

The 2011 Quali-quanti sheet is a superseded formula. Ignored, same rule as CVS, CTS, SWS and AWS.

## Distinctive fact
This is the **oil-and-sebum ampoule** of the six Power Solutions. **PCS is Problem Control Solution.** The carton function is **oil and sebum control**. Leave-on. Cleanse, open, apply, absorb. Ten sealed 2 ml glass vials.

Not a Korean functional cosmetic. There is no principal ingredient to name. No sebum efficacy percentage is on file.

Soy ferment is **1.5%** by weight. Panthenol is **0.5%**. Witch hazel is **0.045%**. Houttuynia is **0.001%**. They are in the formula. They are not the engine.

Humectant base is **22.98%**.

English carton does **not** mention a roller. Same call as CVS, CTS, SWS and AWS, opposite of HES. The roller survives in the FAQ only, as what GENOSYS designs around.

Not fragrance-free: hinoki cypress water is a fragrance ingredient. 5-Free names artificial fragrance. Those are different sentences.

pH 7.98 inside 7.70 ± 1.00.

No pregnancy-safe line. The English carton prints avoid during pregnancy and lactation (two artemisia extracts). No fish collagen in this vial.

## Cut from live copy
- Microneedling as the product's purpose / "apply during microneedling" / licensed-only
- Witch hazel / houttuynia as co-leads
- An efficacy test on sebum (no document)
- Acne treatment / prevent breakouts / anti-acne as a drug claim
- Growth hormone / IGF-1 analogue
- Botox / muscle-relax for acetyl hexapeptide-8
- Glycolic acid as an AHA peel
- A Korean functional licence / principal ingredient
- All skin types
- Fragrance-free
- The Russian carton claims (dermaroller, post-acne, pores, neocollagenesis)
- Lot codes
- The contract manufacturer (DTS MG only)

## Page
`components/product/powersolution/` - shared Power Solution layout, new `pcsCopy.ts` + `PcsProductPage.tsx` + `.ps-pcs` violet-blue palette from Pantone 2738 C / the vial wordmark.

Sections: solution (the three letters + oil and sebum) -> formula chart (22.98% humectant, then actives scaled so soy 1.5% and witch hazel 0.045% can sit together) -> 5-Free -> range -> how to (four pictograms) -> actives + Formula_up INCI -> suited / not -> spec (pH 7.98 in 7.70 ± 1.00) -> FAQ.

No proof chart. No molecular-weight ladder (that is HES only). No retail routine: cross-sell is the other five vials.

Wired in `bespokePdp.tsx` and the EN / AR / RU product routes. DB row now has `productNumber = '7'`. Cache key bumped to `product-by-id-v18`. Hero squared to `/images/pcs-hero.jpg`. Gallery is box + vial only; main is prepended.

## Files
- `components/product/powersolution/pcsCopy.ts`
- `components/product/powersolution/PcsProductPage.tsx`
- `components/product/powersolution/powersolution.css` (`.ps-pcs`)
- `scripts/square-pcs-hero-image-20260816.py`
- `scripts/update-product-7-power-solution-pcs-selling-copy-20260816.ts`
- `public/images/pcs-hero.jpg`
- DB + AR/RU translations + `lib/products.ts` fallback + `pc7` pairing copy + chatbot one-liner
