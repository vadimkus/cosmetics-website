# Arabic Translation Audit — May 16, 2026

## Context

Vadim requested a careful check of Arabic website translations after recent Russian copy fixes.

## What Was Reviewed

- `messages/ar.json`
- Arabic homepage hardcoded copy
- Footer and trust copy
- Arabic SEO metadata for home, products, product detail, about, cart, checkout, blog, locations, contact, partners, login, signup, favorites, brand, FAQ, training, and not-found pages
- Concern/category Arabic SEO data in `lib/concernsData.ts`
- Arabic schema copy and invoice/WhatsApp text
- Database-stored Arabic product and blog fields for the same repeated problem patterns

## Main Corrections

- Replaced awkward literal `مهنية` in customer-facing product/cosmetics copy with the more natural `احترافية`.
- Corrected `ضباب` for mist to `رذاذ`.
- Corrected typo `الفوقبنفسجية` to `فوق البنفسجية`.
- Replaced product-sale references to microneedling `أجهزة` with `رولرات الميكرونيدلينغ` where the live website sells rollers, not devices.
- Improved repeated UAE/location wording such as `إمارات الإمارات`.
- Improved several translated-sounding phrases in hero, homepage trust block, footer, FAQ, product metadata, and WhatsApp inquiry copy.
- Applied safe text replacements to live Arabic blog fields in the database for four posts that still contained the old wording.
- Left `التدريب المهني` and `الحساب المهني` where the meaning is genuinely professional/training/account context.

## Verification

- `npx eslint` passed for all edited TS/TSX files, excluding `app/ar/not-found.tsx` because it has pre-existing `<img>` lint errors unrelated to the Arabic copy.
- `messages/ar.json` was validated with `JSON.parse`.
- Database re-scan returned no hits for the audited problem patterns in Arabic product/blog fields.

## Remaining Note

Archived translation scripts still contain old Arabic wording, but they are historical utilities and not live website copy.
