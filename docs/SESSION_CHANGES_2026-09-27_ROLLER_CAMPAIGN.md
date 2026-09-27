# Product 1 GENOSYS DTS Microneedle Roller: "EVERY NEEDLE COUNTS." campaign

**Date:** 27 Sep 2026
**Page:** `/products/1` (EN / RU / AR, standard product layout)

## What shipped

- Main packshot + 12 gallery slides in EN, RU and AR:
  `public/images/roller_campaign/{main.jpg, s1-s12.jpg, ru/, ar/}` (1600 px, q88, 4:4:4).
- Plates alternate the native render red (deep crimson, close to the logo red `#C41230`) and
  white. White type on red, graphite `#2B2B2B` on white, numerals in GENOSYS red on white.
- Page copy in selling voice: EN DB fields, RU/AR in `data/product1LocalizedCopy.ts` (+ DB
  `descriptionRu` / `descriptionAr`), quick facts in `lib/productQuickFactsCatalog.ts`,
  fallback in `lib/products.ts`.
- New listing cut-out `public/images/cutout/1-v2.webp` from the roller packshot (the previous
  one traced the seven-device family photo). Routine step thumbnails for `'1'` use the new main.

## Slides

| # | Plate | Headline | Claim underneath |
|---|---|---|---|
| 1 | red | EVERY NEEDLE COUNTS. | disk-cut needles, sterile, one session |
| 2 | white | CUT FROM DISKS. | each row cut from one metal disk; no wire, no glue |
| 3 | red | 540 NEEDLES. | 0.25 mm head; a typical wire roller carries 192 |
| 4 | white | 0.2 MM NEEDLES. | finer than the usual 0.25-0.3 mm |
| 5 | red | YELLOW TO RED. | gamma-sterilised, the indicator turns yellow to red |
| 6 | white | FIVE LENGTHS. | 0.25 · 0.5 · 1.0 · 1.5 · 2.0 mm |
| 7 | red | 500,000 CHANNELS. | up to that many in a ten-minute session |
| 8 | white | HORIZONTAL. VERTICAL. DIAGONAL. | slow, even passes, no zig-zags |
| 9 | red | MADE FOR THE AMPOULE. | Power Solution ampoule, then roll |
| 10 | white | ONE SESSION. ONE ROLLER. | sealed, sterile, discard after |
| 11 | red | THE DTS FAMILY. | same disk needles in the eye roller and the stamp |
| 12 | white | EVERY NEEDLE COUNTS. + spec card | 0.25-2.0 mm, 540 disk needles, 0.2 mm SUS 304(H), CE · ISO 13485, Korea |

Every figure is from the DTS MG "Overview of Microneedling" deck (comparison chart, needle
counts per length, gamma indicator, 3-year expiry, 500,000 channels / 10 min) and the
Intertek/Rollers CE + ISO 13485 certificates. Left out on purpose: collagen / wound-healing
physiology, the in-vitro "40x absorption" figure, redness-duration comparisons.

## Dossier removed

- "thinner than the 0.25-0.3 mm standard in the manufacturer comparison", "from a manufacturer
  whose quality management system is certified" (EN, RU, AR, quick facts).
- The "Product documentation" block on the page (it handed out the full DTS MG training deck,
  with alopecia studies and wound-healing slides): removed from `data/productConfig.ts`. The
  deck stays in `public/documents/PPT/` for `/training`.
- Old fallback description ("25% thinner than competitors", "450 ultra-thin needles", collagen).

## Size variant fix

The DB variants, `productConfig` and the details line said **0.1 / 0.15 / 0.2 mm**. The roller
is sold in **0.25 / 0.5 / 1.0 / 1.5 / 2.0 mm**: that is the web size picker
(`utils/productPricing.ts`), the five MoySklad items (codes 00001-00005) and past orders
(1.0 mm and 1.5 mm were bought). Mobile showed the wrong three and its orders could not match a
MoySklad item. Fixed in `data/productConfig.ts`, `components/product/ProductInfo.tsx`, the copy,
and the DB (`0.1mm -> 1.0mm`, `0.15mm -> 1.5mm`, `0.2mm -> 2.0mm`, renamed in place so variant
ids in carts and favourites hold). Needle counts per the deck: 540 at 0.25 mm, 450 at 0.5 and
1.0 mm, 405 at 1.5 and 2.0 mm.

## Code

- `components/product/ProductImageGallery.tsx`: the standard-layout gallery now runs every path
  through `localizeProductImage`, so RU/AR slides appear on standard pages (bespoke pages
  already did this). Only folders registered in `lib/localizedProductImages.ts` change.
- `lib/localizedProductImages.ts`: `/images/roller_campaign` registered for ru + ar.
- `components/product/ProductContentDisplay.tsx` + `messages/{en,ru,ar}.json`: detail labels for
  `needleMaterial`, `availableLengths`, `construction`, `sterilization`, `shelfLife`,
  `certification` (RU/AR pages showed them in English).
- `components/product/peptidegel/peptideGelLocalizedCopy.ts`: an em dash in one RU alt text
  (from the product 37 campaign) was failing `__tests__/lib/noDashes.test.ts` on main.

## Generation

The screen was locked, so CapCut could not be driven. Renders came from Cursor's image
generator with the supplied packshots as references (1024 px), Lanczos-upscaled to 2560 with
a light unsharp mask for typesetting. Red plates stay native: the renders' reds carry almost no
green, so a gain pull to `#C41230` multiplied green ~18x and turned the needle drum yellow.

Working folder: `~/Desktop/roller/campaign/` (`_gen/gi/` renders, `picks/`, `final/`,
`_scripts/roller_slides.py`, `roller_copy.py`, `make_prompts.py`).

## Verified live

EN / RU / AR pages: 13 images (main + `s1-s12`, `ru/` and `ar/` on those locales), sizes
0.25-2.0 mm, no documentation block, no dossier phrases. Mobile API: same gallery per locale and
the five correct variants.

## DB

`scripts/update-product-1-campaign-gallery.ts --apply` after the deploy: image, gallery, EN
fields, `descriptionRu/Ar`, variant rename. It refuses to write until all 37 image URLs return
200.
