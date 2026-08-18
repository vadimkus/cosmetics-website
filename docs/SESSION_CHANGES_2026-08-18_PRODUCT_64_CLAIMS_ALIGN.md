# Product 64 — page aligned with the corrected record

**Date:** 18 Aug 2026
**Product:** 64 · HR³ MATRIX HAIR STAMP

The English record was stripped of the HairGen Booster leaflet’s drug mechanism
earlier today (`scripts/fix-hairgen-consumable-claims-20260818.ts`). The bespoke
page still printed that mechanism as fact. The copy file documented it as a
deliberate sourcing decision, so it waited for an owner call. The call is: the
record is the corrected one. The page now matches it.

## What left the page

The “How it works” section was four cards. Cards 3 and 4 were the leaflet:

- “A wound-healing response starts” — collagen and elastin from a puncture
- “Circulation improves” — angiogenesis, vasodilation, oxygen to the follicle

The intro also said “the micro-injury itself starts a repair response.” All of
that is gone, in EN, AR and RU.

What stays is the documented delivery: the needles open temporary channels, the
stamp screws onto a sealed vial, the solution goes in during the ten-minute
session. Title is now “The stamp opens the way. The solution goes in.”

## “Medical-grade” is gone

It sat on the same distributor instruction as the 0.3 mm depth, and it is in no
manufacturer document. The Korean registration for the device this stamp fits is
두피관리기기 (scalp care device), not a medical device. Dropped from the spec
table and the details row in all three languages.

0.3 mm stays, with the same caveat product 3 already carries: it is on the
product artwork, not in the DTS MG leaflet or the user manual, confirmation
requested in writing. The spec disclaimer also says this is not the 0.5 mm
roller in the Mesopecia Kit.

## Translations and the static fallback

The Arabic and Russian translation files still had the old wound-healing /
circulation / hair-growth paragraph. Those overlay the mobile API, so a phone
user would have kept seeing the leaflet after the website page was clean.
Rewritten to match the corrected English record.

`lib/products.ts` is the static catalogue used if the database is down. It still
had the original wound-healing paragraph. Same rewrite, so an outage cannot
resurrect the claim.

## Files

| File | Change |
|---|---|
| `components/product/hairstamp/hairstampCopy.ts` | Science rewritten to two delivery cards; medical-grade dropped; sourcing header updated |
| `components/product/hairstamp/HairStampProductPage.tsx` | Stale comment (needle count/depth/material “deliberately absent”) corrected |
| `data/productTranslations.ts` | AR record 64 rewritten |
| `data/productTranslationsRu.ts` | RU record 64 rewritten |
| `lib/products.ts` | Static fallback description rewritten |

## Still not on this page

- Clinical figures (the leaflet’s “clinical” section is before/after photos)
- Treatment frequency (undocumented for Booster + stamp)
- Any hair-loss, growth, wound-healing or circulation claim
- Needle material of any grade
