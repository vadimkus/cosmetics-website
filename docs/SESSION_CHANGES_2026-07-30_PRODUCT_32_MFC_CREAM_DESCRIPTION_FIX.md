# Session Changes — 2026-07-30 — Fix MFC Cream (32) Peptide 6 false claim

## Bug
`lib/products.ts` product **32** (MULTI FUNCTIONAL ANTI-WRINKLE CREAM) description
incorrectly listed **Anti-aging Peptide 6**. Intertek PPTX / formula / artwork /
COA confirm peptides are **serum 22 only**. Cream actives: Bakuchiol, propolis,
collagen, adenosine, niacinamide, mango butter, ceramides · AM/PM massage.

## Fix
- `lib/products.ts` id 32: rewritten description (no Peptide 6; Intertek-aligned key ingredients + AM/PM).
- DB product 32: description, ingredients (removed “peptide and barrier actives” wording), howToUse, directions.
- AR `data/productTranslations.ts` + RU `data/productTranslationsRu.ts` product 32: aligned copy.
- Script: `scripts/fix-product-32-mfc-cream-description.ts`

## Left alone
- Serum **22** Peptide 6 claims (correct).
- Marketing slide notes already warned about this trap (`SESSION_CHANGES_2026-07-30_MFC_CREAM_6_SLIDES.md`).

## Verify
- https://genosys.ae/products/32 description has no Peptide 6
- Key ingredients list Bakuchiol / Propolis / Collagen / Adenosine / Niacinamide / Mango / Ceramides
- Serum https://genosys.ae/products/22 still lists Peptide 6
