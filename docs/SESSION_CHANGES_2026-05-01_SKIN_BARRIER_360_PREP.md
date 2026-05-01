# Skin Barrier 360 Product Experience Prep

Date: 2026-05-01

## Context

Prepared dormant code for a desktop-first interactive product media experience, starting with product `27`, `SKIN BARRIER PROTECTING CREAM`.

This is intentionally not wired into the live product detail page yet. The current PDP behavior remains unchanged until the optimized 360 assets are uploaded and the config is marked ready.

## Files Prepared

- `lib/productExperience.ts`
  - Adds product-experience configuration for product `27`.
  - Predefines the expected 36-frame asset paths:
    `/products/27/360/skin-barrier-001.webp` through `/products/27/360/skin-barrier-036.webp`.
  - Keeps the product status at `asset-pending`.

- `components/product/Product360Spin.tsx`
  - Reusable drag-to-rotate 360 image viewer.
  - Supports mouse, touch/pointer dragging, keyboard arrow rotation, reset, frame counter, and nearby-frame preloading.

- `components/product/ProductImmersiveMedia.tsx`
  - Dormant media shell for future PDP activation.
  - Supports tabs for `360 View`, `Photos`, `Video`, and later `3D / AR`.
  - Only exposes the 360 and 3D tabs when the product experience is marked `ready`.

## Asset Requirements

Expected final optimized asset folder:

```text
public/products/27/360/
  skin-barrier-001.webp
  skin-barrier-002.webp
  ...
  skin-barrier-036.webp
```

Frame rules:

- Frame `001` must be the front view.
- Frames should rotate clockwise in sequence.
- Use 36 frames at 10 degrees each for a full rotation.
- Export as square `webp`, ideally 1000-1400 px.
- Target 60-120 KB per frame where possible.

## Capture Runbook

The raw input can be shot on an iPhone. The preferred setup is:

- Camera: iPhone 17 Pro Max or similar recent iPhone.
- Mount: tripod. Do not hand-hold.
- Surface: manual or motorized turntable.
- Background: plain white or light gray.
- Lighting: two soft lights at left/right, or one large softbox plus reflector.
- Product placement: product must sit exactly in the turntable center.
- Camera position: same height as the product center, not from above.
- Lens: use the iPhone telephoto/portrait-friendly lens if distance allows; avoid ultra-wide because it distorts packaging.
- Exposure/focus: lock AE/AF before starting the rotation.
- Flash: off.
- Live Photo: off.
- Filters/HDR effects: avoid filters; keep the look neutral and repeatable.

Recommended turntable sequence:

1. Set the product front-facing and take frame `001`.
2. Rotate clockwise by 10 degrees.
3. Take the next photo.
4. Repeat until the product returns to the front.
5. Total: 36 photos per product/set.

Acceptable fallback:

- 24 photos at 15 degrees can work for a quick test.
- For the first premium desktop launch, use 36 photos at 10 degrees.

Shoot separately if possible:

- Tube alone: 36 frames.
- Box alone: 36 frames.
- Tube + box hero composition: optional 36 frames if the scene is stable.

Additional non-rotation detail shots:

- Tube front label.
- Tube back label.
- Tube side seams.
- Cap front/side/top/bottom.
- Box front/back/left/right/top/bottom.
- Tube beside box for scale.

## Upload Instructions

When raw photos are ready, upload the full folder without editing:

```text
skin-barrier-raw/
  IMG_0001.HEIC
  IMG_0002.HEIC
  ...
```

Raw filename order is not critical if the photos were taken in sequence. The processing step will sort by capture time or visible rotation order, then export the web-ready frame set.

Preferred raw formats:

- HEIC, JPG, PNG, or ProRAW/DNG are all acceptable.
- If using ProRAW, expect larger uploads; quality is good, but processing takes longer.
- For speed, normal high-resolution iPhone HEIC/JPG is enough if lighting is clean.

## Quality Gate

Before activating the PDP viewer, check:

- Product stays centered across all frames.
- No frame is blurry.
- White tube is not blown out.
- Green label remains readable.
- Back/side frames do not jump due to product being off-center.
- Background and shadows remain consistent.
- No hand, tripod, turntable edge, or room reflection appears in the product.

## Raw Photo Processing Plan

When raw images are supplied:

1. Select the cleanest full rotation sequence.
2. Sort by capture order.
3. Crop all frames to the same square ratio.
4. Center the tube consistently across all frames.
5. Resize and convert to optimized `webp`.
6. Rename to `skin-barrier-001.webp` ... `skin-barrier-036.webp`.
7. Place optimized files in `public/products/27/360/`.
8. Mark product `27` experience status as `ready`.
9. Replace the current PDP gallery call with `ProductImmersiveMedia`.

## Activation Notes

Activation should be a small follow-up change:

- Use `getReadyProductExperience(product.id, product.productNumber)` from `lib/productExperience.ts` to fetch the prepared config.
- Build gallery images from the same image source used by the current `ProductImageGallery`.
- Pass `product.videoUrl` through to `ProductImmersiveMedia`.
- Keep current `ProductImageGallery` as fallback if no ready experience exists.

Do not mark the experience ready until all 36 optimized frames exist, otherwise the viewer will request missing files.
