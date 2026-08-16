# Product 24 EyeCell EYE CONTOUR CREAM — audit and bespoke page — 2026-08-15

## What
Same rolling pass as products 12, 19, 38 and 51: Intertek first, then selling-tone rewrite, then a dedicated editorial page in EN / AR / RU. Image discrepancies went into the existing desktop worklist, same DATA-object pattern as product 38.

Live target: https://genosys.ae/products/24

Artwork worklist: `~/Desktop/genosys-artwork-corrections.html` (product 24 block)

## Sources
- `Registration DOC/Formula_up/Formula-GENOSYS EyeCell EYE CONTOUR CREAM.pdf` — finished concentrations. Arbutin 2.0000%. Adenosine 0.0400%. Signed DTS MG, Narae Han.
- `Registration DOC/SA/SA-GENOSYS EyeCell EYE CONTOUR CREAM.pdf` — HALOXYL 0.0500% premix, AHP-5 (H15) 5.0000% premix, pH 6.5 ± 1.0, PAO not documented, leave-on.
- `Registration DOC/Artwork/[GENOSYS]EYECELL EYE CREAM.pdf` — English: wrinkles, dark circles, puffiness; firmer / brighter / more defined; AM & PM; avoid pregnancy / lactation; 20g. Russian and Arabic panels are drifted.
- `Registration DOC/COA/COA-GENOSYS EyeCell EYE CONTOUR CREAM(L1236B).pdf` — light yellow cream, pH 6.64 inside 6.30 ± 1.00. Lot omitted on the page.
- `Intertek_folder/Quali-quanti Ingredients/EyeCell EYE CONTOUR CREAM.pdf` — 2018 COTDE sheet. Cross-check only. Peptide premix trap.
- DTS MG deck `public/documents/PPT/GENOSYS EyeCell EYE ZONE CARE SYSTEM.pdf` — line context. 14-volunteer / 28-day peptide page and Botox / wound-healing language are cut.

## Distinctive fact
This is a **daily all-in-one leave-on eye cream**. The Korean functional pair is **Arbutin 2%** (brightening) and **Adenosine 0.04%** (wrinkle care). That is the product.

Peptides sit at cosmetic trace (Acetyl Hexapeptide-8 **0.0025%** finished). Haloxyl is the manufacturer's name for a **0.05% premix**, not a 0.05% active. Squalane 2.5% and jojoba 2% seal the contour.

## Cut from live copy
- Peptide complex as the engine (2018 quali 0.90% / 0.90% / 0.50% were premix solutions)
- Haloxyl as a dark-circle treatment / 0.05% active
- Callus / stem-cell regeneration
- Lift and tighten as a result
- Microcirculation / blood flow / wound healing
- 10 Years Back (bottle render only; not on registered artwork; not a study)
- Botox / B. Toxin / muscle-relaxant
- 14-volunteer / 28-day peptide trial as this SKU's clinical
- Fragrance-free (orange peel oil + limonene)
- All skin types including sensitive as a blanket
- Pregnancy-safe (pack says avoid)
- Clinical percentages (none for this finished cream)
- PAO (SA says supplementary studies are needed)
- Lot codes
- The contract manufacturer (DTS MG only)

Gallery main / s1 / s6 still print "10 Years Back" on the bottle. Gallery s4 still says "Intertek formula" and "NO INVENTED CLINICAL PERCENTAGES". Those are later image jobs, already logged in the desktop HTML. The editorial copy does not repeat them. Engine figure is `s4.jpeg` (Arbutin 2% + Adenosine 0.04%).

16 Aug evening: studio slides are on the page, not only in the thumbs. Lookbook after the stats (s1–s6). s2 beside what it does. s4 beside the dose. s5 beside how-to. No proof section.

## Page
`components/product/eyecream/` — Cerabarrier primitives, champagne / bronze palette from the EyeCell slides.

Sections: Wrinkles · Dark circles · Puffiness → Arbutin 2% engine → serum first, cream seals → actives + Formula_up INCI → suited / not (pregnancy, peanut, Botox story) → routine (10 / 33 / 17 / 24) → spec (20g, pH 6.64 in 6.30 ± 1.00, no lot, no PAO) → FAQ → reviews.

No proof chart. No quantified clinical for this finished cream.

Wired in `bespokePdp.tsx` and the EN / AR / RU product routes. DB row now has `productNumber = '24'`. Cache key bumped to `product-by-id-v9`.

## Files
- `components/product/eyecream/eyecreamCopy.ts`
- `components/product/eyecream/eyecream.css`
- `components/product/eyecream/EyeCreamProductPage.tsx`
- `scripts/update-product-24-eye-contour-cream-selling-copy-20260815.ts`
- DB + AR/RU translations + quick facts + `lib/products.ts` fallback + routine strings
