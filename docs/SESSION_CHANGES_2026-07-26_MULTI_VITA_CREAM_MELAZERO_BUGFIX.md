# MULTI VITA RADIANCE CREAM — MELAZERO misattribution bugfix — 2026-07-26

## Bug
Cream product **31** (and kit / recommendation copy pairing it with serum **21**) incorrectly claimed **MELAZERO®** and serum actives (3-O-Ethyl Ascorbic Acid / panthenol-serum framing). Brand PDF / Intertek for the cream use **Astaxanthin + Multi Vita 12**.

## Fixes
1. `lib/products.ts` id `31` — Astaxanthin / Vita 12 description; sunscreen caveat
2. `data/productTranslations.ts` — beauty-box cream blurbs + product 31 AR UV softening
3. `data/productTranslationsRu.ts` — beauty-box cream blurb + product 31 RU UV softening
4. `messages/{en,ar,ru}.json` + mobile `i18n/messages/{en,ar,ru}.json` — `pc21Benefit1Text` no longer says MELAZERO in *both* products
5. Live DB product `31` — description UV wording softened (no MELAZERO was present)

## Clinical note (slides)
Brand chart: melanin 3.443 → 2.419 ≈ **−29.7%** in 2 weeks (already in slides session doc).

## Script
`scripts/fix-product-31-cream-copy-20260726.ts` (ran with `--apply`)
