# Product 37 PEPTIDE GEL MASK — audit and bespoke page — 2026-08-15

## What
Same rolling pass as products 12, 17, 19, 24, 33, 34, 35, 38 and 51: Intertek first, then selling-tone rewrite, then a dedicated editorial page in EN / AR / RU. Image discrepancies went into the existing desktop worklist.

Live target: https://genosys.ae/products/37

Artwork worklist: `~/Desktop/genosys-artwork-corrections.html` (product 37 block)

## Sources
- `Registration DOC/Formula_up/Formula-GENOSYS PEPTIDE GEL MASK.pdf` — finished concentrations. Signed DTS MG, Narae Han. Glycerin 19.921%. Ceratonia Siliqua Gum 2.200%. Chondrus Crispus Extract 0.800%. Dipotassium Glycyrrhizate 0.100%. Acetyl Hexapeptide-8 0.0000054% (0.05 ppm). Sodium Hyaluronate 0.0005%. Hydrolyzed Collagen 0.002%. No Niacinamide. No Adenosine.
- `Registration DOC/SA/SA-GENOSYS PEPTIDE GEL MASK.pdf` — Face mask. Function moisturizing, soothing. Type leave on (leftover essence stays; the sheet comes off). pH 5.0-7.0. PAO not documented. Dermatological patch test allows "Dermatologically tested". English pack has no pregnancy line. ARGIRELINE premix 0.012%. Multicare-Plus premix 0.3000%. ELOGLYN glycerin premix 20%.
- `Registration DOC/Artwork/[GENOSYS]PEPTIDE GEL MASK.pdf` — English: after dermatological procedures; 20-40 minutes then remove; massage remaining essence; refrigerate for a better cooling effect; 38g including mesh × 5. Korean: Acetyl Hexapeptide-8 0.05ppm. AR writes 20 minutes only. RU invents healing and a required LED pairing.
- `Registration DOC/COA/COA-GENOSYS PEPTIDE GEL MASK(OF001).pdf` — Translucent gel. pH 5.62 inside 5.0-7.0. Net 40.12g against >38g. Lot omitted on the page. Contract manufacturer omitted.

## Distinctive fact
This is a **face hydrogel sheet**. 38g including mesh, five in the box. After a dermatological procedure. Moisturizing, soothing. Sit **20 to 40 minutes**, take the sheet off, massage the leftover in. **Glycerin 20%** is the pouch. That is the product.

The name says PEPTIDE. Finished Acetyl Hexapeptide-8 is **0.05 ppm**. Hyaluronic acid is **0.0005%**. Collagen is **0.002%**. Do not hero any of them.

This is not product 33. The EyeCell eye patch carries Niacinamide 2% and Adenosine 0.04%. This sheet has neither. Keep it off the eyes.

No pregnancy line on the English pack. Do not invent avoid or pregnancy-safe.

## Cut from live copy
- Peptide as the engine / other peptides
- Hyaluronic acid and hydrolyzed collagen as cards
- Patented thermo-sensitive / transdermal cosmetic delivery / melts on contact / boosts delivery
- Botox / lift / firm / nourish as a result
- Healing damaged tissue (RU panel)
- Required LED pairing (RU panel; English pack is silent)
- 15-20 minutes or 20 minutes only (artwork EN is 20-40)
- 2-3 times a week
- All skin types
- Fragrance-free (no Parfum, but Citrus Junos and castor oil are in it)
- Pregnancy-safe or pregnancy-avoid
- Clinical hydration percentages
- PAO
- Lot codes
- The contract manufacturer (DTS MG only)

Gallery s1c, s2c and s5c still print patented thermo-sensitive delivery. Those are later image jobs, already logged in the desktop HTML. The editorial copy does not repeat them. Engine figure is `main.jpeg` (clean pouch).

## Page
`components/product/peptidegel/` — Cerabarrier primitives, royal-blue palette from the white-and-blue pouch.

Sections: Moisturize · Soothe · Cool · After a procedure → Glycerin 20% engine → sit 20-40 minutes, then remove → actives + Formula_up INCI → suited / not (eye patch 33, bandage allergy, Botox story, leave-on only) → routine (gentle cleanse / mist / 37 / postcream 25) → spec (38g × 5, pH 5.62 in 5.0-7.0, no lot, no PAO) → FAQ → reviews.

No proof chart. No quantified clinical for this finished mask.

Wired in `bespokePdp.tsx` and the EN / AR / RU product routes. DB row now has `productNumber = '37'`. Cache key bumped to `product-by-id-v14`.

## Files
- `components/product/peptidegel/peptideGelCopy.ts`
- `components/product/peptidegel/peptidegel.css`
- `components/product/peptidegel/PeptideGelProductPage.tsx`
- `scripts/update-product-37-peptide-gel-mask-selling-copy-20260815.ts`
- DB + AR/RU translations + quick facts + `lib/products.ts` fallback + routine strings + `pc37` pairing copy
