# Session Changes — Product Card Full-Image Previews (No Clipping)

**Date:** 2026-07-05
**Scope:** Website (genosys.ae)

## Problem

Product card previews cropped product photos (`object-cover`), cutting off jars,
boxes, and tubes — visible on the /products grid (e.g. Bio-Ferment jar bottom
clipped, PDRN box edges cut). Only a hardcoded list of "problem" products
(collagen mask, beauty boxes, 63, 16) used `object-contain`.

## Change

Show the **full image** on every product preview — `object-contain` on a white
background everywhere a card/thumbnail renders `product.image`:

| File | What changed |
|---|---|
| `components/ProductCard/ProductImage.tsx` | Default is now `object-contain bg-white p-2` for ALL products (removed per-product exception list). Revita Glow (63) keeps its `p-1 scale-110` zoom to offset whitespace baked into its render. |
| `components/product/ProductRecommendation.tsx` | Related-products thumbnails: `object-cover` → `object-contain p-2`, container `bg-gray-100` → `bg-white`. |
| `components/home/HomeDesktopSections.tsx` | Home bestsellers grid tiles: `object-cover` → `object-contain p-3`, tile `bg-gray-50` → `bg-white`. |
| `components/products/ProductSearch.tsx` | Search dropdown 40px thumbnails: `object-cover` → `object-contain bg-white`. |

Not changed (already correct): `ConcernProductGrid.tsx` (already
`object-contain p-3`), home hero product tiles (already contain), PDP gallery
(`ProductImageGallery` — intentional cover with zoom view available).

## Verification

- Local dev (`localhost:3000/products`): all cards show complete product
  photos — Bio-Ferment jar, PDRN kraft box, ampoule sets, devices — no crop.
- Same `ProductCard` renders mobile web / PWA / desktop grids, so the fix
  applies at every breakpoint (`h-24 sm:h-32 md:h-40 lg:h-48`).

## Follow-up (same day): square preview frames — FINAL SOLUTION

Two intermediate attempts were rejected:

1. White letterboxing (contain in the old wide 3:2 frame) — gray studio
   shots ended in white side bars, looked "cut".
2. Blurred backdrop fill behind the contained image — looked like a photo
   floating in a frosted frame; user did not like it.

Root cause: the preview frame was wide (`w-full` × fixed `h-24…h-48` ≈ 3:2)
while product photos are square (1024×1024). Any fit either crops (cover) or
letterboxes (contain).

Final fix: the preview frame is now **square (`aspect-square`) with
`object-contain`, no padding, white background, no backdrop**:

- Square studio shots (Bio-Ferment, PDRN mask, Cerabarrier…) fill the frame
  100% edge-to-edge — their own background reaches the card edges.
- Non-square white-background renders letterbox invisibly on white.
- Nothing is ever cropped.

This matches the pattern the concern-page grid already used successfully.

Applied in:

- `components/ProductCard/ProductImage.tsx` (products grid, favorites, PWA)
- `components/product/ProductRecommendation.tsx` (related products → aspect-square)
- `components/home/HomeDesktopSections.tsx` (home bestsellers, padding removed)
- `components/ConcernProductGrid.tsx` (padding removed, `bg-gray-50` → `bg-white`)

## Follow-up: Cerabarrier (66) main image swap

Its main was `/images/cera/main_wide.jpeg` (1474×1024) — the only wide main
left, so it letterboxed inside the new square frame. Swapped the DB `image`
to the square `/images/cera/main2.jpeg` (1024×1024) via
`scripts/update-product-66-main-image.ts`; gallery unchanged. New file
committed (was untracked).

## Notes

- Cards are taller than before (square preview vs 3:2) — standard
  e-commerce card proportions.
- The hover `scale-105/110` zoom animations are preserved; Revita Glow (63)
  keeps its `scale-110` to offset baked-in whitespace.
- Search dropdown thumbnails (40px) keep plain white contain.
