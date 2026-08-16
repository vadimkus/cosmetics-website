# Bespoke PDP audit: studio slides on the page, not only in the thumbs

**Date:** 16 Aug 2026
**Scope:** every bespoke product page in `components/product/`

## Why

Products 17, 18, 19 and 24 had already been reworked so the studio / claim slides
run inside the page: a lookbook grid after the stats strip, and a sticky figure
beside "what it does" and "how to use". Products 65 and 66 already carried
inline art of their own. Everything else was still shipping six studio slides
that only ever appeared as 80 px thumbnails under the hero.

This pass brought the rest of the range up to the same standard.

## The pattern

1. `STUDIO_SLIDES` constant, built from the product's own gallery.
2. Lookbook grid after the stats strip: 1 / 2 / 3 columns, `aspect-square`,
   `object-contain`, staggered `CeraReveal`.
3. Sticky figure beside "what it does" (`EFFECTS_IMAGE`).
4. Sticky figure beside "how to use" (`HOWTO_IMAGE`), section widened from
   `max-w-[900px]` to `max-w-[1200px]`.
5. Engine figure left as the page already chose it. Where that figure is a
   claim slide rather than a packshot, `object-cover` became `object-contain`
   so the headline printed inside the artwork is not cropped.

## What each page got

| # | Page | Lookbook | Beside what it does | Beside how to use |
|---|---|---|---|---|
| 4 | Power Solution HES | s1new–s7 | — | — |
| 10 | Snow O₂ Cleanser | S1–S6 | S5 | S4 |
| 11 | Skin Defender Remover | S1b–S6b | S5b | S4b |
| 12 | EPI Peeling Gel | s1–s6 | s5 | s4 |
| 13 | SRS | — | — | sss2 |
| 14 | Microbiome Mist | S1–S6 | S6 | S4 |
| 15 | Problem Control Toner | S1–S6 | S5 | S4 |
| 33 | Eye Peptide Gel Patch | s1–s6 | s3 | s5 |
| 34 | Overnight Cream Mask | S1–S5 | — | S5 |
| 37 | Peptide Gel Mask | s1c–s5c | s4c | s3c |
| 38 | EZ CO₂ Mask Kit | s1–s8 | s5 | s6 |
| 51 | Bio-Ferment Powder Mask | — | — | bferment_model |
| 53 | Collagen Mask | S1–S5 | S5 | S4 |
| 60 | Bio-Meso 60000 | S1–S6 | — | — |
| 61 | HR³ Scalp Brush | s1–s4 | s3 | s2 |
| 63 | Revita Glow BB | s1–s4 | — | s4 |
| 64 | Hair Stamp | s1–s4 | — | — |
| 65 | Bio-Meso 5000 | s1–s4 | — | — |
| 66 | Cerabarrier | S1–S3 | — | — |

Engine figure switched to `object-contain` on 14, 15, 33, 34, 38 and 53.

Product 66 runs a three-slide lookbook because S4 and S5 already appear
further down as the per-size spec figures. Products 60 and 65 render theirs
through `BioMesoPageConfig.slides`, and the Power Solutions through
`PowerSolutionVariant.studioSlides`, so the layout stays shared.

## Slides that stay in the lookbook only

Per the gallery rule, no studio slide was taken off a page. Slides carrying a
claim the editorial copy does not make are still shown, but they were not
promoted to a section figure, and they remain queued for re-export in
`~/Desktop/genosys-artwork-corrections.html`:

- **34** S1 / S2 / S4 sell oxygen therapy and the growth-factor list
- **37** s1c / s2c / s5c print patented thermo-sensitive delivery
- **51** ferment_high leads on six growth-factor peptides
- **53** S2 carries brightening and anti-ageing lines
- **61** s1 prints +50% absorption and a circulation line
- **33** main / s1 / s6 still print "10 Years Back"

## Gallery data bug found and fixed

Four products listed their main image inside the `images` array. Both web and
mobile prepend `product.image`, so the thumbnail strip opened on the same shot
twice.

| Product | Before | After |
|---|---|---|
| 63 Revita Glow | main + s1–s4 | s1–s4 |
| 62 Sensitive Skin Beauty Box | main only | empty |
| 3 HairGen Booster | main + 3 | 3 |
| 42 Intensive Blemish Balm | main + 1 | 1 |

Fixed in the DB and in the `lib/products.ts` / `data/productConfig.ts`
fallbacks. Cache key bumped to `product-by-id-v29`. Re-audit returns clean.

Scripts: `scripts/audit-gallery-duplicates-20260816.ts`,
`scripts/fix-gallery-main-duplicates-20260816.ts`,
`scripts/fix-product-63-gallery-duplicate-20260816.ts`.

## Products with no studio slides to place

These are an image-production gap, not a page bug. Nothing was invented to
fill the space:

- **16** Snow Booster: one size-comparison figure, already the engine
- **35** Hydro Cool: one pouch shot
- **52** PDRN Mask: two images, both already inline
- **50** Eye Zone Care Kit: member packshots, already inline
- **55–58** beauty boxes: no gallery
- **5, 6, 7, 8, 9** Power Solutions: two legacy packshots each, no slide set

Product 4 is the only ampoule with a real deck, so it is the only one whose
lookbook renders; the other five leave `studioSlides` empty and the section
does not appear.

## Files

- `components/product/{snowo2,remover,epi,mist,pcttoner,eyepatch,overnight,peptidegel,ezco2,collagenmask}/*ProductPage.tsx`
- `components/product/{scalpbrush,hairstamp,revitaglow,cerabarrier,bioferment,srs}/*ProductPage.tsx`
- `components/product/biomeso/BioMesoProductPage.tsx`, `BioMesoExpertProductPage.tsx`
- `components/product/powersolution/PowerSolutionProductPage.tsx` plus the six variant copy files
- `lib/productsDb.ts` (cache `product-by-id-v29`), `lib/products.ts`, `data/productConfig.ts`
- `scripts/add-studio-slides-to-pages-20260816.py` and parts 2 and 3
- `scripts/contact-sheet-20260816.py`, `scripts/audit-bespoke-galleries-20260816.ts`
