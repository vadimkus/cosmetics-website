# Product 43 RU/AR localization audit

Date: 21 August 2026

## Scope

Completed the Russian and Arabic customer-copy audit for product 43, HR³ MATRIX HAIR TONIC α, across the canonical product payload, bespoke PDP, quick facts, recommendation messages, hair/scalp concern page, chatbot catalog and database.

## Sources used

- `Registration DOC/Formula_up/Formula-GENOSYS HR3 MATRIX HAIR TONIC α.pdf` for the current α formula and concentrations.
- `Registration DOC/Artwork/[GENOSYS]HR3 MATRIX HAIR TONIC α.pdf` for registered function, morning/evening use, circular massage, 3–4 hour leave-on time, three-month PAO, under-3 restriction and salicylate contraindications.
- `Registration DOC/COA/COA-GENOSYS HR3 MATRIX HAIR TONIC α(NF002).pdf` for the measured dexpanthenol, L-menthol, salicylic acid, pH, fill and microbiology results.
- `Intertek_folder/Safety Assessment Report/23 HR3 MATRIX HAIR TONIC.pdf` only for the HRIPT/dermatologically-tested evidence; its older composition was not used.
- DTS MG Hair Tonic Alpha presentation was checked but its hair-growth, 5α-reductase and thickening claims were excluded.
- The older `Ingredient lists_old/HR3 MATRIX HAIR TONIC.pdf` formula was checked and rejected as the non-α 23% alcohol formula.

## Customer-copy corrections

- Canonical RU/AR payload now declares 70 ml, 9.5% denatured alcohol, all three cooling components, salicylic acid 0.25%, panthenol 0.2%, allantoin 0.1% and the exact trace concentrations.
- The bespoke RU/AR PDP now uses professional selling copy without the former audit-like voice.
- Exact contraindications are visible: salicylate sensitivity, diabetes, circulatory disorders, renal impairment, scalp infection/redness, menstruation, pregnancy and possible pregnancy.
- Usage is aligned everywhere: morning and evening, circular massage, leave on for at least 3–4 hours, three months after opening.
- Removed hair-growth, hair-loss-treatment, follicle-strengthening, circulation, penetration, collagen, antioxidant and roller-pairing claims.
- Recommendation blocks now distinguish the shampoo, tonic and ampoule without assigning unsupported synergy or therapeutic effects.
- Hair/scalp concern copy now presents the line as cosmetic scalp care and directs unexplained hair loss to medical diagnosis.

## Database parity

Applied `scripts/update-product-43-hair-tonic-record-20260817.ts` idempotently.

- Record ID: `43`
- `productNumber`: `43`
- RU name: `Тоник для кожи головы HR³ MATRIX HAIR TONIC α`
- AR name: `تونيك فروة الرأس HR³ MATRIX HAIR TONIC α`
- RU/AR descriptions contain the alcohol disclosure and 3–4 hour use.
- `productDetails`, `keyFeatures`, `benefits`, `ingredients` and `howToUse` parse as valid JSON.
- Concerns are now `["hair","scalp-care"]`, with no treatment claim.

## Verification

- Focused Jest localization suite: 166 tests passed.
- Edited-file ESLint: passed.
- TypeScript: passed.
