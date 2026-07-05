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

## Notes

- White (`bg-white`) letterboxing chosen because nearly all product photos are
  studio shots on white/near-white; seams are invisible on the white cards.
- The hover `scale-105/110` zoom animations are preserved.
