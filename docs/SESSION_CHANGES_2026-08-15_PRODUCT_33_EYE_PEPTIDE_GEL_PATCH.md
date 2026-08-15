# Product 33 EyeCell EYE PEPTIDE GEL PATCH — audit and bespoke page — 2026-08-15

## What
Same rolling pass as products 12, 17, 19, 24, 38 and 51: Intertek first, then selling-tone rewrite, then a dedicated editorial page in EN / AR / RU. Image discrepancies went into the existing desktop worklist, same DATA-object pattern as product 17.

Live target: https://genosys.ae/products/33

Artwork worklist: `~/Desktop/genosys-artwork-corrections.html` (product 33 block)

## Sources
- `Registration DOC/Formula_up/Formula-GENOSYS EyeCell EYE PEPTIDE GEL PATCH .pdf` — finished concentrations. Note the trailing space in the filename. Niacinamide 2.0000%. Adenosine 0.0400%. Acetyl Hexapeptide-8 0.00000470% (46.5 ppb). Signed DTS MG, Narae Han.
- `Registration DOC/SA/SA-GENOSYS EyeCell EYE PEPTIDE GEL PATCH.pdf` — eye mask, take-off, pH 5.50-7.50, PAO not documented, no pregnancy / lactation warning on English artwork, bandage / compress allergy caution, MADEWHITE™ 0.009% premix, MultiEx BSASM Plus ~0.093% premix.
- `Registration DOC/Artwork/[GENOSYS]EYECELL EYE PEPTIDE GEL PATCH.pdf` — English: calming and moisturizing; under the eyes and/or eyebrow bones; 20-40 minutes then remove; 101g / 60 pieces / 30 applications; Acetyl Hexapeptide-8 46.5ppb. Russian, Arabic and Turkish panels are drifted.
- `Registration DOC/COA/COA-GENOSYS EyeCell EYE PEPTIDE GEL PATCH(NL009).pdf` — colorless transparent gel / transparent yellow, pH 6.85 inside 5.5-7.5. Lot omitted on the page. Contract manufacturer omitted.
- `Ingredient lists_old/EyeCell EYE PEPTIDE GEL PATCH.pdf` — legacy sheet. Cross-check only.
- DTS MG deck `public/documents/PPT/GENOSYS EyeCell EYE PEPTIDE GEL PATCH.pdf` — line context. Patented / transdermal language is cut.

## Distinctive fact
This is a **take-off hydrogel eye mask**. 20 to 40 minutes, then remove. 101g / 60 patches / 30 applications. The Korean functional pair is **Niacinamide 2%** (brightening) and **Adenosine 0.04%** (wrinkle care). That is the product.

The name says PEPTIDE. Finished Acetyl Hexapeptide-8 is **46.5 ppb**. Made White is a **0.009% premix**. MultiEx is a **0.093% premix**. Do not hero either.

No pregnancy line on the English pack. Do not invent avoid or pregnancy-safe.

## Cut from live copy
- Peptide as the engine
- Made White / madecassoside as a hero
- Multi 12 Complex as a card
- Patented / transdermal cosmetic delivery
- 10 Years Back (jar render only; not on registered artwork; not a study)
- Botox / lift / firm as a result
- Eye-bag improvement as a registered function
- 15-20 minutes or 20-30 minutes (artwork EN is 20-40)
- Fragrance-free (Parfum is in it)
- All skin types including sensitive as a blanket
- Pregnancy-safe or pregnancy-avoid (pack prints neither)
- Clinical percentages (none for this finished mask)
- PAO (SA says supplementary studies are needed)
- Lot codes
- The contract manufacturer (DTS MG only)

Gallery main, s1 and s6 still print 10 Years Back on the jar. s2 still says patented + transdermal. s4 still says Intertek formula. s6 overlay still says firming. Those are later image jobs, already logged in the desktop HTML. The editorial copy does not repeat them. Engine figure is `s4.jpeg` (Niacinamide 2% + Adenosine 0.04% + 46.5 ppb).

## Page
`components/product/eyepatch/` — Cerabarrier primitives, burgundy / wine palette from the black jar.

Sections: Calm · Moisturize · Brighter look · Smoother lines → Niacinamide 2% engine → sit 20-40 minutes, then remove → actives + Formula_up INCI → suited / not (leave-on only, bandage allergy, Botox story, fragrance-free) → routine (10 / 33 / 17 / 24) → spec (101g, 60 patches, pH 6.85 in 5.50-7.50, no lot, no PAO) → FAQ → reviews.

No proof chart. No quantified clinical for this finished mask.

Wired in `bespokePdp.tsx` and the EN / AR / RU product routes. DB row now has `productNumber = '33'`. Cache key bumped to `product-by-id-v11`.

## Files
- `components/product/eyepatch/eyepatchCopy.ts`
- `components/product/eyepatch/eyepatch.css`
- `components/product/eyepatch/EyePatchProductPage.tsx`
- `scripts/update-product-33-eye-peptide-gel-patch-selling-copy-20260815.ts`
- DB + AR/RU translations + quick facts + `lib/products.ts` fallback + routine strings + `pc33` pairing copy
