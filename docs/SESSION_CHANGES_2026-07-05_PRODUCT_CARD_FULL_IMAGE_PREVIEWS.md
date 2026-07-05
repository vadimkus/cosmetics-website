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

## Follow-up (same day): blurred backdrop fill

Plain white letterboxing made the new gray studio shots (Bio-Ferment, PDRN
mask, Cerabarrier) look like cut-out patches — the image's gray background
ended abruptly with white bars on the sides.

Fix: each preview frame now renders a second copy of the same photo behind
the contained image — `object-cover`, `scale-125`, `blur-lg`, `opacity-80`,
requested at 64px/quality 30 (tiny extra payload). The blur extends the
photo's own background colors edge-to-edge, so the frame is always fully
filled while the product itself stays complete and uncropped.

Applied in:

- `components/ProductCard/ProductImage.tsx` (products grid, favorites, PWA)
- `components/product/ProductRecommendation.tsx` (related products)
- `components/home/HomeDesktopSections.tsx` (home bestsellers)
- `components/ConcernProductGrid.tsx` (skin-concern pages, `bg-gray-50` → `bg-white`)

## Notes

- The hover `scale-105/110` zoom animations are preserved.
- Search dropdown thumbnails (40px) keep plain white contain — too small for
  a backdrop to matter.
