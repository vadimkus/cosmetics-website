# Product 9 POWER SOLUTION AWS - audit and bespoke page - 2026-08-16

## What
Same rolling pass as products 4, 5, 8, 12, 17, 19, 24, 33, 34, 35, 37, 38 and 51: Intertek first, then selling-tone rewrite, then a dedicated editorial page in EN / AR / RU. Image discrepancies went into the existing desktop worklist.

Live target: https://genosys.ae/products/9

Artwork worklist: `~/Desktop/genosys-artwork-corrections.html` (product 9 block)

## Sources
- `Registration DOC/Formula_up/Formula-GENOSYS POWER SOLUTION AWS.pdf` - finished concentrations. Signed DTS MG, Narae Han. Adenosine 0.0400%. Butylene glycol 12.515%. Glycerin 9.0858%. Soy ferment 2.5000%. Sodium hyaluronate 0.1002%. Allantoin 0.1000%. Copper tripeptide-1 0.0010% (10 ppm). sh-Polypeptide-7 0.00066% (6.6 ppm). Acetyl hexapeptide-8 0.00025% (2.5 ppm). Palmitoyl tripeptide-1 0.00020% (2 ppm). Ceramide NP 0.00004% (0.4 ppm).
- `Registration DOC/SA/SA-GENOSYS POWER SOLUTION AWS.pdf` - Face serum, leave-on, adults. Applied on the face and not rinsed off.
- `Registration DOC/Artwork/[GENOSYS]POWER SOLUTION AWS.pdf` - English: Anti-Wrinkle Solution; function anti-wrinkle; reduces the appearance of wrinkles and improves skin firmness; 2 ml x 10; four pictograms cleanse / open / apply / absorb; 5-Free; avoid pregnancy/lactation; keep off the eyes. Korean: 주름개선 기능성 화장품, 주성분 아데노신. Russian panel invents a dermaroller recommendation. Arabic panel is thin.
- `Registration DOC/COA/COA-GENOSYS POWER SOLUTION AWS(L1031A).pdf` - Light yellow viscous liquid. pH 4.93 inside 4.80 ± 1.00. SG 1.028 inside 1.000-1.050. 2.12 ml against 2 ml. Adenosine 0.04% came back at 99.94% of the declaration. Lot omitted on the page. Contract manufacturer omitted.

The 2011 Quali-quanti sheet is a superseded formula. Ignored, same rule as CVS and SWS.

## Distinctive fact
This is the **wrinkle ampoule** of the six Power Solutions. **Adenosine 0.04%** is the vial. Korea registers it as a wrinkle-improving functional cosmetic and names adenosine as the principal ingredient. Leave-on. Cleanse, open, apply, absorb. Ten sealed 2 ml glass vials.

Soy ferment is **2.5%** by weight. Ceramide NP is **0.4 ppm**. Acetyl hexapeptide-8 is **2.5 ppm**. They are in the formula. They are not the engine.

English carton does **not** mention a roller. Same call as CVS and SWS, opposite of HES. The roller survives in the FAQ only, as what GENOSYS designs around.

Not fragrance-free: hinoki cypress water is a fragrance ingredient. 5-Free names artificial fragrance. Those are different sentences.

pH 4.93 inside 4.80 ± 1.00. Do not call it near-neutral.

No pregnancy-safe line. The English carton prints avoid during pregnancy and lactation (two artemisia extracts).

## Cut from live copy
- Microneedling as the product's purpose / "apply during microneedling" / licensed-only
- Efficacy test on improving wrinkles (no deck, no Intertek figure)
- Ceramide, acetyl hexapeptide-8 and a firming peptide complex as co-leads
- Botox / muscle-relax / expression-line mechanism
- Healing / regeneration / prevent new wrinkles / reverse ageing
- All skin types
- Fragrance-free
- Arbutin 2% (a leftover Arabic/Russian card copied from SWS)
- IGF-1 analogue
- The Russian carton claims (dermaroller recommendation)
- Lot codes
- The contract manufacturer (DTS MG only)

## Page
`components/product/powersolution/` - shared Power Solution layout, new `awsCopy.ts` + `AwsProductPage.tsx` + `.ps-aws` magenta palette from Pantone 221 C / the vial wordmark.

Sections: solution (the three letters + adenosine 0.04%) -> formula chart (21.60% humectant, then actives scaled so soy 2.5% and adenosine 0.04% can sit together) -> 5-Free -> range -> how to (four pictograms) -> actives + Formula_up INCI -> suited / not -> spec (pH 4.93 in 4.80 ± 1.00) -> FAQ.

No proof chart. No molecular-weight ladder (that is HES only). No retail routine: cross-sell is the other five vials.

Wired in `bespokePdp.tsx` and the EN / AR / RU product routes. DB row now has `productNumber = '9'`. Cache key bumped to `product-by-id-v16`. Hero squared to `/images/aws-hero.jpg`. Gallery is box + vial only; main is prepended.

## Files
- `components/product/powersolution/awsCopy.ts`
- `components/product/powersolution/AwsProductPage.tsx`
- `components/product/powersolution/powersolution.css` (`.ps-aws`)
- `scripts/square-aws-hero-image-20260816.py`
- `scripts/update-product-9-power-solution-aws-selling-copy-20260816.ts`
- `public/images/aws-hero.jpg`
- DB + AR/RU translations + `lib/products.ts` fallback + `pc9` pairing copy + chatbot one-liner
