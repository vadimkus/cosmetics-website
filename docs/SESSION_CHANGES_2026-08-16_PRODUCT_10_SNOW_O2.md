# Product 10 SNOW O2 CLEANSER - audit and bespoke page - 2026-08-16

## What
Same rolling pass as products 4, 5, 6, 7, 8, 9, 12, 17, 19, 24, 33, 34, 35, 37, 38 and 51: Intertek first, then selling-tone rewrite, then a dedicated editorial page in EN / AR / RU. Image discrepancies went into the existing desktop worklist.

This is the first unused formulated cosmetic on the generic PDP after the six Power Solutions. Devices 1-3 were skipped: they are hardware.

Live target: https://genosys.ae/products/10

Artwork worklist: `~/Desktop/genosys-artwork-corrections.html` (product 10 block, claim rows added)

## Sources
- `Registration DOC/Formula_up/Formula-GENOSYS SNOW O2.pdf` - finished concentrations. Signed DTS MG, Narae Han. Methyl Perfluoroisobutyl Ether 8.0000%. Cocamide DEA 6.0000%. Butylene glycol 4.1089%. Glycerin 4.0000%. Isopropyl myristate 3.9200%. Sodium laureth sulfate 2.4000%. Propanediol 1.8340%. Decyl glucoside 0.8220%. Parfum 0.1500%. Hinoki water 0.1080%. Limonene 0.1080%. Phaseolus radiatus 0.0030%. The 2015 Quali-quanti / Ingredient lists_old sheet is a superseded formula (silicones, ether at 3%). Ignored.
- `Registration DOC/SA/SA-GENOSYS SNOW O2.pdf` - December 2020 amendment. Face cleansing, rinse-off, adults. Applied on the face and rinsed off. pH 5.3-6.3. Opaque viscous liquid. Premixes: NF 38 = Methyl Perfluoroisobutyl Ether 8%; PHYTOLEX SC 0.2000%; MULTIEX PHYTROGEN 0.0100%. Patch test non-irritant supports "dermatologically tested", not a no-irritation promise.
- `Registration DOC/Artwork/[GENOSYS]SNOW O2(180ml).pdf` - Function: facial cleanser. Apply on dry face, avoiding eyes. When oxygen bubbles occur, circular massage, rinse with tepid water. Front sentence: naturally generated oxygen bubbles clean make-up dirt and skin impurities. Dermatologically tested. Avoid pregnancy/lactation. Korean carton names WINNOVA as the contract manufacturer - DTS MG only on the page.
- `Registration DOC/COA/COA-GENOSYS SNOW O2 180ml(WOB052).pdf` - Opaque viscous liquid. pH 5.67 inside 5.30-6.30. 181.89 ml against 180 ml. About three years unopened. Lot omitted on the page.

No DTS MG deck with a quantified clinical figure is on file. Do not invent an oxygen-therapy %, a sebum %, or a sensitive-skin trial.

## Distinctive fact
This is a **dry-skin oxygen-bubble facial cleanser**. The carton function is **facial cleanser**. Apply on a dry face. Bubbles form. Circular massage. Tepid rinse. The bubbles come from **Methyl Perfluoroisobutyl Ether at 8%**, the second-largest ingredient after water.

Not oxygen therapy. Not a leave-on. Not a nutrifying wash. Not a Korean functional cosmetic. There is no principal ingredient to name.

Phytolex finished actives sit at **0.003%**. MultiEx finished actives sit at **0.001%**. They are in the formula. They are not the engine.

Humectant total is **9.94%**. Sodium laureth sulfate is **2.4%**. Fragrance is present.

How-to is the carton four steps. Leftover copy and gallery S4 invented a wet-finger second cycle. That is not the ritual.

pH 5.67 inside 5.30 to 6.30.

Pregnancy note is carton-printed. No fish collagen in this wash.

## Cut from live copy
- Oxygen therapy / nutrifying / vitamin O2 / spa treatment
- Phytolex / MultiEx as co-leads or the reason to buy
- Without irritation as a guarantee
- All skin types including sensitive
- Fragrance-free / sulfate-free / paraben-free as badges
- Wet-finger second cycle as the how-to
- A Korean functional licence
- Lot codes (`WOB052`, `WIE048`)
- The contract manufacturer (DTS MG only)

## Page
`components/product/snowo2/` - Cerabarrier primitives + ice-white / ember-orange palette from the pump wordmark (`#d35400` / `#9a3d00` on warm paper `#f6f3ee`).

Sections: effects (apply dry / bubbles / rinse) -> engine (ether 8%) -> how to (four carton steps + product video) -> actives + Formula_up INCI -> suited / not -> brightening routine -> FAQ.

Two sizes in the hero picker: 180 ml = 330 AED, 500 ml = 510 AED. No proof chart. No clinical percentages.

Hero stays `/images/cleanser/main_clean.jpeg` (already square). Gallery is S1-S6; main is prepended. Video is `/videos/cleanser.mp4`.

Wired in `bespokePdp.tsx` and the EN / AR / RU product routes. DB row now has `productNumber = '10'`. Cache key bumped to `product-by-id-v19`.

## Files
- `components/product/snowo2/snowo2Copy.ts`
- `components/product/snowo2/SnowO2ProductPage.tsx`
- `components/product/snowo2/snowo2.css`
- `scripts/update-product-10-snow-o2-selling-copy-20260816.ts`
- DB + AR/RU translations + `lib/products.ts` fallback + `pc10` pairing copy + chatbot one-liner
