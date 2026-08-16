# Product 11 SKIN DEFENDER LIP & EYE MAKEUP REMOVER - audit and bespoke page - 2026-08-16

## What
Same rolling pass as products 4-10, 12, 17, 19, 24, 33, 34, 35, 37, 38, 50 and 51: Intertek first, then selling-tone rewrite, then a dedicated editorial page in EN / AR / RU.

This is the next unused formulated cosmetic on the generic PDP after Snow O₂. Devices 1-3 stay skipped.

Live target: https://genosys.ae/products/11

Artwork worklist: `~/Desktop/genosys-artwork-corrections.html` (product 11 block)

## Sources
- `Intertek/GENOSYS SKIN DEFENDER LIP & EYE MAKEUP REMOVER/Formula-GENOSYS SKIN DEFENDER LIP & EYE MAKEUP REMOVER.pdf` - finished concentrations. Signed DTS MG, Narae Han. Cetyl Ethylhexanoate 27.845%. Disiloxane 13.000%. Isohexadecane 9.000%. Lactobacillus Ferment 0.500%. Palmitoyl Tripeptide-5 0.0000000650% (0.65 ppb). Acetyl Tetrapeptide-5 0.0000000500% (0.5 ppb). Vitamins sit below 0.00003%.
- `Intertek/GENOSYS SKIN DEFENDER LIP & EYE MAKEUP REMOVER/Artwork-GENOSYS SKIN DEFENDER LIP & EYE MAKEUP REMOVER.pdf` - Function: Makeup remover. Front sentence: fresh, non-greasy lip & eye makeup remover with multi vitamins and firming peptides. DERMATOLOGICALLY TESTED. Application: shake well, cotton pad on lip and eye area, hold a few seconds, gently wipe. Precautions: external use, keep off eyes, rinse with cool water, stop if irritation. 200 ml. EAN `8809975190530`. 12M after opening. Korean carton names Green Cos - DTS MG only on the page.
- `Intertek_folder/Safety Assessment Report/11 PROFESSIONAL BIPHASIC MAKEUP REMOVER.pdf` - August 2017. Predecessor formula (cyclopentasiloxane 39%, lavender, Palmitoyl Tripeptide-1 / Tetrapeptide-7). Does not describe the current bottle. Ignored for figures.
- `Ingredient lists_old` / Quali-quanti `GENOSYS PROFESSIONAL BIPHASIC MAKEUP REMOVER.pdf` - the same superseded WINNOVA sheet. Ignored.
- Current product-folder COA is a scan with no extractable text. Older WIH036 COA is the predecessor SKU. No pH printed on the page.

No DTS MG deck with a quantified clinical figure is on file. Do not invent a waterproof %, a sting-free trial, or an eye-comfort study.

## Distinctive fact
This is a **biphasic lip-and-eye makeup remover**. The carton function is **makeup remover**. Shake the yellow oil into the water. Cotton pad. Hold a few seconds. Wipe. The oil layer is nearly half the bottle: **cetyl ethylhexanoate 27.8% + disiloxane 13% + isohexadecane 9% = 49.845%**.

Not a face wash. Not a vitamin treatment. Not a peptide treatment. Not a Korean functional cosmetic. There is no principal ingredient to name.

Lactobacillus ferment at **0.5%** is the largest named extra in the water. It is in the formula. It is not the remover.

How-to is the carton four steps. Leftover copy and gallery S4 invented an optional rinse and a fifth cleanser step. Those are not the ritual. The routine can say wash the face next.

12 months after opening. Dermatologically tested. No ophthalmological claim on the carton.

## Cut from live copy
- 10-vitamin complex / Vita 10 as the engine
- Firming peptides / Palmitoyl Tripeptide-5 / Acetyl Tetrapeptide-5 as the reason to buy
- Waterproof
- Without irritation / no sting as a guarantee
- Ophthalmologically tested
- All skin types / sensitive
- Fragrance-free
- A fifth "follow with cleanser" how-to step
- 50/50 essence cares
- Natural yellow, no artificial pigment
- Lot codes (`WIH036`)
- The contract manufacturer (DTS MG only)

## Images
Hero stays `/images/remover/Main2.jpg` (current biphasic bottle, already on the live page).

Gallery (main not included):
- `/images/remover/carton.jpeg` - Intertek Pics/1, bottle + cream carton
- `/images/remover/pack.jpeg` - Intertek Pics/2, carton front + bottle back (how-to)
- `/images/remover/carton-side.jpeg` - Intertek Pics/3, multilingual carton

Claim-graphic slides `S1b` to `S6b` stay on disk for orders already sent. They are not in the new gallery.

Video stays `/videos/remover.mp4`.

## Page
`components/product/remover/` - Cerabarrier primitives + cream / dark-gold palette from the yellow oil layer (`#8f7814` on warm paper `#f6f3ea`). Kept clear of Snow O₂ ember, Epi mint, and Eye Kit crimson.

Sections: effects (shake / hold / wipe) -> engine (oil layer 49.8%) -> how to (four carton steps + product video) -> actives + registered INCI -> suited / not -> makeup routine (remover, Snow O₂, mist, hyaluron cream) -> FAQ.

Wired in `bespokePdp.tsx` and the EN / AR / RU product routes. Cache key bumped to `product-by-id-v21`.

`PRODUCT_ROUTINES['11']` left as remover / cleanse / mist / cream.

## Files
- `components/product/remover/removerCopy.ts`
- `components/product/remover/RemoverProductPage.tsx`
- `components/product/remover/remover.css`
- `public/images/remover/carton.jpeg`
- `public/images/remover/pack.jpeg`
- `public/images/remover/carton-side.jpeg`
- `scripts/update-product-11-skin-defender-remover-selling-copy-20260816.ts`
