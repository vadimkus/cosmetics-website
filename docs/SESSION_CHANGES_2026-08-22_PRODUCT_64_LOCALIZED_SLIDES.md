# Product 64 localized studio slides

Date: 22 August 2026

## Scope

Arabic and Russian studio slides for product 64, HR3 MATRIX HAIR STAMP, across
the localized website and the locale-aware mobile API.

## Implementation

- Added the translated artwork under:
  - `public/images/needles2/ar/`
  - `public/images/needles2/ru/`
- Filenames mirror the canonical English set: `s1`–`s5` and `closing`.
  `Main.jpeg` is a plain packshot with no text on it, so it is deliberately not
  duplicated per locale.
- Compressed every file to JPEG quality 62; the largest is now 185 KB, down from
  the 465–605 KB the exports arrived at.
- Registered the set in `lib/localizedProductImages.ts`. The database record is
  untouched: the swap happens at render, English is unaffected, and the mobile
  routes read the same manifest through the `x-locale` header.
- `HairStampProductPage` now localizes both the gallery and the four inline
  figures (mechanism `s3`, protocol `s4`, spec `s1`, closing band).

## Russian s1 withheld

The supplied Russian `s1` renders a missing-glyph box after each of the three
product names — `HAIR STAMP ⊠`, `HAIRGEN BOOSTER ⊠`, `HR³ MATRIX HAIR SOLUTION
α ⊠` — where a trademark symbol failed to embed. The file is on disk but is not
listed in the manifest, so Russian keeps the English `s1` in both the gallery
and the spec section until a corrected export arrives. That is the manifest's
intended safe failure: an unregistered slide silently stays English rather than
404ing.

The remaining eleven slides were reviewed against the English originals and are
clean. The garbled small print on the carton in `closing` is pre-existing in the
live English asset and was not introduced here.

## Verification

- `npm test -- --runInBand __tests__/lib/localizedProductImages.test.ts`
  - 22 tests passed, including the manifest-on-disk check.
- `npx tsc --noEmit`
  - passed.
