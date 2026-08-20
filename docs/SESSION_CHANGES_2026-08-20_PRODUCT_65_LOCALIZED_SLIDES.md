# Product 65 localized studio slides

Date: 20 August 2026

## Scope

Added Arabic and Russian studio slides for product 65, BIO-MESO PDRN HOMECARE
AMPOULE 5000, across the localized website and locale-aware mobile API.

## Implementation

- Added the translated artwork under:
  - `public/images/pdrn_5000_new/ar/`
  - `public/images/pdrn_5000_new/ru/`
- Aligned translated filenames by content with the canonical English gallery.
  The supplied translated sequence used contiguous `S1`–`S7`, while the
  English set uses `S1`, `S2`, `S3`, `S4`, `S6`, `S7`, `S8`.
- Removed duplicate untranslated `Main.jpeg` and `Insta.jpeg` files from both
  locale folders.
- Compressed every customer-facing JPEG below 500 KB.
- Registered the translated files in `lib/localizedProductImages.ts`.
- Updated `BioMesoProductPage` so both gallery slides and inline section figures
  use the active locale. The existing mobile routes use the same manifest
  through the `x-locale` header.

## Russian composition-slide correction

The first supplied Russian composition artwork assigned **1,010 ppm** to
panthenol. It was withheld because the verified split is **1,010 ppm Sodium
DNA** and **10,000 ppm panthenol**. Corrected Russian artwork was received later
on 20 August, verified against the English and Arabic slides, compressed to
146 KB, and published as `ru/S4.jpeg`. The complete Russian set is now localized.

## Verification

- `npm test -- --runInBand __tests__/lib/localizedProductImages.test.ts`
  - 22 tests passed.
- `npx tsc --noEmit`
  - passed.
- The manifest-on-disk test confirms every registered localized path exists.
