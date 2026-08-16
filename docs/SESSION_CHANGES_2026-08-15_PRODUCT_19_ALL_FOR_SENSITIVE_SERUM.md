# Product 19 ALL FOR SENSITIVE SERUM — audit and bespoke page — 2026-08-15

## What
Same rolling pass as products 4 (HES) and 5 (CVS): Intertek first, then selling-tone rewrite, then a dedicated editorial page in EN / AR / RU.

Live target: https://genosys.ae/products/19

## Sources
- `Registration DOC/Formula_up/Formula-GENOSYS ALL FOR SENSITIVE SERUM.pdf` — finished concentrations
- `Registration DOC/SA/SA-GENOSYS ALL FOR SENSITIVE SERUM.pdf` — trade names
- `Registration DOC/Artwork/[GENOSYS]ALL FOR SENSITIVE SERUM.pdf` — pack claims
- `Registration DOC/COA/COA-GENOSYS ALL FOR SENSITIVE SERUM 30ml(WOC056).pdf` — lab spec (lot code not printed)

No dedicated DTS MG deck. No efficacy study (2019 Intertek report is micro + metals only).

## Distinctive fact
**MultiEx BSASM® Plus at 1%** of the batch (safety assessment). Seven botanicals: Centella, Polygonum, Scutellaria, green tea, licorice, chamomile, rosemary.

A July 2026 audit read the INCI list only and banned the name. That is the same failure already logged on products 10, 16, 28, 29 and 63. The formula lists what the premix delivers as finished extract; the SA names the premix. Both are true. The page names the complex the way product 4 names BIOPHYTEX.

Phytolex SC is also in the SA, at **0.001%**. Real, not featured.

## Cut from live copy
- Healing / repair / anti-inflammatory / immune-boosting (EN DB, AR, RU)
- Beta-glucan as a healing / immune active
- Aloe and witch hazel as lead actives (0.001% premixes)
- Fragrance-free (orange peel oil + limonene are in the formula)
- Panthenol / madecassoside (invented by `Protocol_Sensitive.pdf` — that PDF is not linked)
- Lot codes

## Page
`components/product/afs/` — Cerabarrier primitives, lime/charcoal palette from the pack.

Sections: Relieve · Protect · Moisturize → MultiEx engine → five no-additions → AM & PM + video → actives + INCI → suited / not → routine → spec (pH 5.77, 5.20–6.20, no lot) → FAQ → reviews.

Wired in `bespokePdp.tsx` and the EN / AR / RU product routes. `getBespokePdpLayout` and `getRoutineProducts` now fall back to `product.id` because legacy rows had `productNumber` null. The DB row is now `productNumber = '19'`.

## Files
- `components/product/afs/afsCopy.ts`
- `components/product/afs/afs.css`
- `components/product/afs/AfsProductPage.tsx`
- `components/product/bespokePdp.tsx`
- `app/products/[id]/page.tsx`, `app/ar/products/[id]/page.tsx`, `app/ru/products/[id]/page.tsx`
- `data/productTranslations.ts`, `data/productTranslationsRu.ts`
- `lib/products.ts` (static fallback description)
- `lib/productsDb.ts` (cache key `product-by-id-v3`)
- `scripts/update-product-19-afs-selling-copy-20260815.ts` (already applied)

16 Aug evening: studio slides are on the page, not only in the thumbs. Lookbook after the stats (s1–s6). s2 beside what it does. s4 beside the MultiEx dose. s5 beside how-to. s1 beside the five no-additions.

## Pairing
Cream 27 copy stays NMF amino acids. The serum now names MultiEx; the cream is not claimed to share it.
