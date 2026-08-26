# Product 65 cut-out: reflection debris and a torn carton

Date: 26 Aug 2026
Scope: `scripts/cutout/`, `lib/productCutouts.ts`, `public/images/cutout/`

## What was wrong

On the Bio-Meso PDRN Homecare Ampoule 5000 page the packshot had ragged white
fragments hanging under the box and the tube, as if the product were melting into
the panel.

Two separate faults in one image, both from the same cause. The shot is lit on a
glossy floor, so the product has a mirror reflection under it, and the carton is
white board photographed against a white sweep.

1. **Kept reflection.** Vision read the reflection as more product and held on to
   a torn piece of it. The mask ran to the bottom edge of the frame.
2. **Torn carton.** Contrast across the box's own edge falls from 89 to 33 grey
   levels between 75% and 88% of frame height, so Vision lost the bottom of the
   box and cut a ragged bite out of it.

The trim-to-silhouette step then made both worse: the debris dragged the bounding
box down, so the product was also sized and centred against junk.

## Why it was only this product

All 66 cut-outs were rendered at their bottom edge and reviewed. Product 65 is
the only one carrying a reflection. Connected-component analysis found nothing,
because the reflection is joined to the product rather than floating free - which
is why the automated debris check that was written for this was thrown away
rather than shipped. It cannot see this class of fault and would have given false
assurance.

## The fix

Two per-product tables in `scripts/cutout/build-cutouts.py`, both applied to the
raw Vision mask before the frame is normalised:

- `FLOOR` - where the product meets the floor, as a share of frame height.
  Everything below is cleared. Measured off the photograph with a horizontal rule
  at the contact edge, because the reflection cannot be told from the product by
  shape: it *is* the product.
- `REPAIR` - rectangles Vision drops that are part of the product, restored from
  the source photograph. Vision writes transparent *black*, so the lost pixels
  have to be fetched from the original rather than re-exposed. Used only where the
  shape can be reconstructed exactly: the carton is square-on with vertical sides
  at x=0.185 and x=0.473, holding to within a pixel down to the floor. A curved
  bottle would not qualify.

## Two other things found on the way

**The build report was already truncated.** Running the builder for a subset of
products overwrote the whole report with just those rows, and the manifest is
written from that report. The committed report held **one** row, so a manifest
regenerated from it would have returned every other packshot uncut. The builder
now merges a subset into the existing report, and a test asserts the manifest
covers a gapless run of product numbers.

**Cache.** `/images/*` is served immutable for a year, so the rebuilt file ships
as `65-v2.webp` under a new `REVISION` table rather than replacing `65.webp` in
place. The old file stays on disk: HTML already served to a browser still points
at it.

## Verification

- Rebuilt all 66; the other 65 files came out byte-identical, so the change is
  contained to product 65.
- Silhouette checked against a saturated background, where mask holes show up
  that a cream panel hides.
- `npx jest __tests__/lib/productCutouts.test.ts`, `npx tsc --noEmit`, `eslint`.
