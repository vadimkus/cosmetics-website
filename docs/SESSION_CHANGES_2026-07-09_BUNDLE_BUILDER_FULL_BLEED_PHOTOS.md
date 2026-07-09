# Session Changes — Bundle Builder Full-Bleed Product Photos (2026-07-09)

## Problem

Product photos in the bundle builder ("Build My Set") showed ugly white edges
("white endings") compared to the normal products-page cards:

- **Web**: the card image frame used `bg-gray-50` + `p-4` (plus `p-2` on the
  image), so the white/gray studio photos floated inside a gray box with
  visible edges. The products page card uses a pure white square frame with
  zero padding, which is why photos look clean there.
- **Mobile**: the tile was white + `contentFit="contain"`, but 47 of the main
  product photos are **956×662 landscape** studio shots with a light gray
  backdrop (~rgb 210-230). On the square tile they letterboxed with white
  bands above/below the gray photo.

Constraint from Vadim: re-editing image files / backgrounds is NOT an option.

## Fix

Center-crop verification: cropped all landscape studio shots to a center
square and visually confirmed nothing important is lost (products are
centered with generous side margins). Beauty Boxes (0.8 portrait photos) are
excluded from the bundle builder by the API (`notIn: ['Beauty Boxes', 'PRO
Solution']`), so cover-cropping is safe for every eligible product.

### Web — `app/bundle-builder/BundleBuilderClient.tsx`

- Browse card: `bg-gray-50 p-4` + `object-contain p-2` → `bg-white` +
  `object-cover` (edge-to-edge, matches products-page card frame).
- Selected-items strip thumbs (w-14): `object-contain p-1` → `object-cover`.
- Detail modal images (250px / 200px): `bg-gray-50` + `object-contain p-4` →
  `bg-white border border-gray-100` + `object-cover`.

### Mobile — `genosys-mobile-app/app/bundle-builder.js`

- Product card image: `contentFit="contain"` → `"cover"`.
- Summary sheet thumbs: `contentFit="contain"` → `"cover"`.

## Deployment

- Web: commit `2f6580f9`, Vercel production Ready.
- Mobile: commit `c698ade` on main, OTA published to runtime **1.11.0**;
  cherry-picked to `release/1.10.5` (commit `0532aaa`), OTA published to
  runtime **1.10.5**.

Same session, earlier: PDP video click-to-play play button shipped to mobile
(both runtimes) and desktop share button moved next to the product title
(`SESSION_CHANGES` in respective commits `f792e6c` / `56cb0e31`).
