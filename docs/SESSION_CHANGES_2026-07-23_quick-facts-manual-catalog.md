# Quick Facts Rework — Manual Catalog (2026-07-23)

## Goal
Rework PDP Quick Facts dropdowns:
- Remove “Popular with customers” / units-sold
- Replace weak on-page benefit copy with valuable sales points (%, clinical, actives)
- Source from manuals / verified slide docs — not from the same PDP benefits/features block
- 10 QA iterations before push

## Implementation
- New: `lib/productQuickFactsCatalog.ts` — EN/RU/AR catalog (32 SKUs, 6 facts each)
- Updated: `components/product/ProductQuickFactsHelper.tsx`
  - Catalog first
  - Ingredient-active fallback only (no benefits / keyFeatures / description recycle)
  - Sales proof removed (unitsSold prop kept for call-site compatibility only)
- Updated tests: `__tests__/components/ProductQuickFactsHelper.test.tsx`

## Priority examples (manual-sourced)
| SKU | Highlights |
|---|---|
| 41 Cushion | SPF 50+ PA++++ · >60% moisture essence · 9 peptides · cushion+refill · no “40% peptide” |
| 66 Cerabarrier | +145.8% post-wash hydration · 2.4× · pink ceramide · microbiome |
| 52 PDRN mask | Sodium DNA 1,000 ppm · TEWL ~35% · barrier ~40–45% |
| 15 Toner | Sebum −50% / 4 weeks · Anti Sebum P · 360° spray |
| 29 HA cream | +82% immediate · 72-hour hold |
| 21 Multi Vita serum | Multi Vita 12 · MELAZERO® · ~28% melanin · 100% panel |

## 10 QA iterations
1. PASS — no sales / popular proof in helper or catalog  
2. PASS — cushion 41 matches PDF (SPF 50+ / >60% / 9 peptides; no 40% peptide)  
3. PASS — Cerabarrier clinical 145.8% + 2.4×  
4. PASS — PDRN 52 has 1,000 ppm + TEWL  
5. PASS — Toner clinical −50% sebum  
6. PASS — HA cream +82% and 72h  
7. PASS — helper does not read `product.benefits` / `product.keyFeatures`  
8. PASS — every catalog SKU has exactly 6 localized facts  
9. PASS — priority retail SKUs covered  
10. PASS — each `t()` has EN/RU/AR title+text arity  

Coverage: **32 / 64** products have curated catalog facts; remaining SKUs use ingredient-active fallback + size/shade.

## Sources
- `public/documents/ppt/*.pdf` (extracted via `pdftotext` to `/tmp/genosys-manuals/`)
- Verified session slide docs (`docs/SESSION_CHANGES_*_SLIDES.md`)
- Live product list: `https://genosys.ae/api/products`
