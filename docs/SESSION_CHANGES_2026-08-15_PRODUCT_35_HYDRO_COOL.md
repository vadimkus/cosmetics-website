# Product 35 HYDRO COOL MODELING MASK — audit and bespoke page — 2026-08-15

## What
Same rolling pass as products 12, 17, 19, 24, 33, 34, 38 and 51: Intertek first, then selling-tone rewrite, then a dedicated editorial page in EN / AR / RU. Image discrepancies went into the existing desktop worklist.

Live target: https://genosys.ae/products/35

Artwork worklist: `~/Desktop/genosys-artwork-corrections.html` (product 35 block)

## Sources
- `Registration DOC/Formula_up/Formula-GENOSYS HYDRO COOL MODELING MASK.pdf` — finished concentrations. Signed DTS MG, Narae Han. Diatomaceous Earth 65.165%. Glucose 12%. Algin 9%. Calcium Sulfate 6%. Peppermint extract 0.1%. Centella / Ceramide NP / Allantoin / Sodium Hyaluronate 0.01% each. Parfum + peppermint oil + limonene present.
- `Registration DOC/Artwork/[GENOSYS]HYDRO COOL MODELING MASK.pdf` — English: hydrating, soothing; mix 30g with water; except eyes and eyebrows; peel 15-20 minutes; 1kg; dermatologically tested. Korean: powder 1 : water 0.8, mix 1-2 minutes, wipe residue with toner. Russian: 10:8. No pregnancy line. No PAO.
- `Registration DOC/COA/COA-GENOSYS HYDRO COOL MODELING MASK(230807AD007G4).pdf` — blue powder, coagulation 5-10 minutes. No pH. Lot omitted. Contract manufacturer omitted.
- Quali-quanti sheet confirms the same earth stack; uses Ceramide 3 and omits Limonene. Prefer Formula_up + artwork.

No safety assessment on file. No dedicated DTS MG clinical deck under this SKU name. Do not borrow Bio-Ferment's +218%.

## Distinctive fact
This is the **clinic-kilo cooling alginate**. 1kg blue powder. Mix **30g** with water at **1 : 0.8**, it sets, it peels, and it stays cool until you take it off. Diatomaceous earth is **65%** of the pouch. That is the product.

Sodium Hyaluronate, Ceramide NP, Allantoin and Centella each sit at **0.01%**. They are in the formula. They are not the engine. Bio-Ferment (51) is the 300g mask that holds moisture.

## Cut from live copy
- Hyaluronic acid / ceramide / allantoin / centella as heroes
- Collagen synthesis
- Pore minimizing
- Barrier support as a dose claim
- All skin types
- Rub the residue in, then rinse
- 20-30 minutes (pack is 15-20)
- 1:1.5 (that is Bio-Ferment)
- Invented weekly cadence
- Fragrance-free
- Pregnancy invent
- PAO
- A clinical percentage
- Lot codes
- The contract manufacturer (DTS MG only)

Gallery `HYDR.jpg` is the studio hero (blue powder dish). `hmask_big.jpg` is an older packshot whose printed how-to and INCI do not match the registered artwork (20-30 min, lips vs eyebrows, Tetrapotassium, Mentha). Those are later image jobs, already logged in the desktop HTML. The editorial copy follows the artwork PDF.

## Page
`components/product/hydrocool/` — Cerabarrier primitives, ice-blue palette from the powder.

Sections: Cool · Soothe · Peel → earth 65% engine → mix 30g at 1 : 0.8 + video → actives + carton INCI → suited / not (Bio-Ferment, fragrance, 0.01% list) → routine (cleanse / mist / 35 / hyaluron cream) → spec (1kg, no pH, no lot, no PAO) → FAQ → reviews.

No proof chart. There is no trial on file.

Wired in `bespokePdp.tsx` and the EN / AR / RU product routes. DB row now has `productNumber = '35'`. Cache key bumped to `product-by-id-v13`.

## Files
- `components/product/hydrocool/hydroCoolCopy.ts`
- `components/product/hydrocool/hydrocool.css`
- `components/product/hydrocool/HydroCoolProductPage.tsx`
- `scripts/update-product-35-hydro-cool-selling-copy-20260815.ts`
- DB + AR/RU translations + quick facts + `lib/products.ts` fallback + routine strings + chatbot leftovers
