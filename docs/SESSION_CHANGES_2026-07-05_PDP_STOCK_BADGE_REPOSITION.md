# Session Changes — PDP "In Stock" Badge Repositioned Above the Photo

**Date:** 2026-07-05
**Scope:** Website (genosys.ae) — Product Detail Page (PDP)

## Problem

On the product detail page the "In Stock" / "Sold Out" badge was an
**absolute overlay** sitting on top of the main product image
(`absolute top-2 md:top-3 … z-30`). On several products the badge
**overlapped the photo** (covering the top of the jar/box label), and on
tall studio shots it clipped into the artwork.

## Change

`components/product/ProductImageGallery.tsx` — moved the stock badge **out**
of the main-image container and **above** it as its own row.

- Before: badge was `absolute` inside the `aspect-square` image frame (overlay).
- After: a `flex mb-2` row renders the badge **above** the image container,
  aligned `justify-end` in LTR / `justify-start` in RTL, so it never touches
  the photo.

Badge markup itself is unchanged:
- **In stock** → green pill (`bg-green-500`, rounded-full, pulsing dot,
  `t('product.inStock')`), with `flex-row-reverse` applied in RTL so the dot
  sits on the correct side.
- **Sold out** → red uppercase label (`bg-red-600`,
  `t('product.soldOut')`).

### Thumbnail rail alignment

Because the badge row now sits above the main image, the **vertical thumbnail
rail** (visible at `lg+`, `lg:order-1`) would start higher than the main
image. Added `lg:pt-10` to the thumbnail navigation container so the rail
top-aligns with the top of the main image (below the new badge row).

## Verification

- `/products/65` (Bio-Meso 5000): green "In Stock" pill sits above the square
  photo, no overlap.
- RTL (Arabic): pill aligns to the left edge, dot on the correct side.
- Desktop `lg+`: thumbnail rail visually aligns with the top of the main image.

## Notes

- Same component renders mobile web, PWA, and desktop PDP, so the fix applies
  at every breakpoint.
- Badge no longer depends on `z-index` stacking over the image — simpler and
  no overlap risk on any photo aspect ratio.
- See also `SESSION_CHANGES_2026-07-05_PRODUCT_CARD_FULL_IMAGE_PREVIEWS.md`
  for the same-day product-card preview (grid) image work.
