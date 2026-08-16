# Product 17 EyeCell EYE CONTOUR SERUM — audit and bespoke page — 2026-08-15

## What
Same rolling pass as products 12, 19, 24, 38 and 51: Intertek first, then selling-tone rewrite, then a dedicated editorial page in EN / AR / RU. Image discrepancies went into the existing desktop worklist, same DATA-object pattern as product 24.

Live target: https://genosys.ae/products/17

Artwork worklist: `~/Desktop/genosys-artwork-corrections.html` (product 17 block)

## Sources
- `Registration DOC/Formula_up/Formula-GENOSYS EyeCell EYE CONTOUR SERUM.pdf` — finished concentrations. Arbutin 2.0000%. Adenosine 0.0400%. Sodium hyaluronate 0.20002%. Signed DTS MG, Narae Han.
- `Registration DOC/SA/SA-GENOSYS EyeCell EYE CONTOUR SERUM.pdf` — HALOXYL 0.1000% premix, AHP-5 (H15) 5.0000% premix, pH 6.0 ± 1.0, PAO not documented, leave-on.
- `Registration DOC/Artwork/[GENOSYS]EYECELL EYE SERUM.pdf` — English: intensive serum; deep wrinkles, dark circles, eye puffs; AM & PM pat; avoid pregnancy / lactation; 10ml. Russian and Arabic panels are drifted. RU invents 20 ml.
- `Registration DOC/COA/COA-GENOSYS EyeCell EYE CONTOUR SERUM(L0614B).pdf` — light yellow viscous liquid, pH 5.37 inside 6.00 ± 1.00. Lot omitted on the page.
- `Intertek_folder/Quali-quanti Ingredients/EyeCell EYE CONTOUR SERUM.pdf` — 2018 COTDE sheet. Cross-check only. Peptide premix trap.
- DTS MG deck `public/documents/PPT/GENOSYS EyeCell EYE ZONE CARE SYSTEM.pdf` — line context. 14-volunteer / 28-day peptide page and Botox / wound-healing language are cut.

## Distinctive fact
This is the **first-layer intensive eye serum**. The Korean functional pair is **Arbutin 2%** (brightening) and **Adenosine 0.04%** (wrinkle care). That is the product.

Peptides sit at cosmetic trace (Acetyl Hexapeptide-8 **0.0025%** finished). Haloxyl is the manufacturer's name for a **0.10% premix**, not a 0.10% active. Sodium hyaluronate **0.20%** is the serum comfort figure. Then cream 24 seals.

No peanut oil and no retinyl palmitate in this serum. The pack still says avoid during pregnancy and lactation.

## Cut from live copy
- Peptide complex as the engine (2018 quali 0.90% / 0.90% / 0.50% were premix solutions)
- Haloxyl as a dark-circle treatment / 0.10% active
- Callus / stem-cell regeneration
- Lift and tighten as a result
- 10 Years Back / Turn Years Back (bottle render only; not on registered artwork; not a study)
- Botox / B. Toxin / muscle-relaxant
- 14-volunteer / 28-day peptide trial as this SKU's clinical
- Fragrance-free (pack does not print it; page does not invent it)
- All skin types including sensitive as a blanket
- Pregnancy-safe (pack says avoid)
- Clinical percentages (none for this finished serum)
- PAO (SA says supplementary studies are needed)
- Lot codes
- The contract manufacturer (DTS MG only)

Gallery main prints "Turn Years Back". s1 and s7 still print "10 Years Back" on the bottle. s3 and s4 are the same file. Gallery s6 still says "Intertek formula" and "No invented clinical percentages". Those are later image jobs, already logged in the desktop HTML. The editorial copy does not repeat them. Engine figure is `s6.jpeg` (Arbutin 2% + Adenosine 0.04%).

16 Aug evening: studio slides are on the page, not only in the thumbs. Lookbook after the stats (s1, s2, s3, s5, s6, s7; s4 skipped as a duplicate of s3). s2 beside what it does. s6 beside the dose. s5 beside how-to.

## Page
`components/product/eyeserum/` — Cerabarrier primitives, cool silver / lilac palette from the black syringe applicator.

Sections: Deep wrinkles · Dark circles · Eye puffs → Arbutin 2% engine → pat the serum, cream seals → actives + Formula_up INCI → suited / not (pregnancy, Botox story, cream-first) → routine (10 / 33 / 17 / 24) → spec (10ml, pH 5.37 in 6.00 ± 1.00, no lot, no PAO) → FAQ → reviews.

No proof chart. No quantified clinical for this finished serum.

Wired in `bespokePdp.tsx` and the EN / AR / RU product routes. DB row now has `productNumber = '17'`. Cache key bumped to `product-by-id-v10`.

Chatbot leftover: `MULTI PEPTIDE ANTI-WRINKLE {{id:17}}` pointed at this serum. Remapped to product 22.

## Files
- `components/product/eyeserum/eyeserumCopy.ts`
- `components/product/eyeserum/eyeserum.css`
- `components/product/eyeserum/EyeSerumProductPage.tsx`
- `scripts/update-product-17-eye-contour-serum-selling-copy-20260815.ts`
- DB + AR/RU translations + quick facts + `lib/products.ts` fallback + routine strings
