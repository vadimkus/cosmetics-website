# Product 1 Microneedle Roller: protocol, quick facts, English copy

**Date:** 15 Sep 2026
**Page:** `/products/1` (EN / RU / AR)

## Routine

Vadim's chair sequence replaces the four-step "home" routine:

1. Snow O₂ Cleanser
2. Snow Booster Toner (`routineSnowBoosterDescMicroneedling`)
3. Power Solution ampoule (`routinePowerSolutionTitle`, links to CTS / product 6; copy names all six)
4. Microneedle Roller (rewritten: slow controlled passes, practitioner sets length and interval, single use)
5. Peptide Gel Mask or Bio-Ferment mask (`routineTreatmentMaskTitle`, links to 37; 20-40 min / 15-20 min)
6. Soothing Repair Postcream

Heading `recommendedMicroneedlingRoutine` is now "Recommended microneedling protocol" (was "home"). Hyaluron Serum step dropped. Spicule rule from 14 Jul still holds: no 60 / 65 with the roller.

## Quick facts widget

Screenshot showed "1 useful details · Format 0.25mm · Official GENOSYS product formula." on a device page. The roller had no catalog entry, so the only fact was the size variant.

- Added a six-fact catalog entry for `'1'` in `lib/productQuickFactsCatalog.ts` (disk system, 0.2 mm SUS 304(H), 540 / 450 needles, gamma-sterile single use, CE + ISO 13485, professional scope).
- `ProductQuickFactsHelper` now returns `null` when the only facts are Format / shade, and shows "Verified GENOSYS device specification." instead of "product formula" for devices (no ingredients + device category).

## English DB copy

English still carried the pre-audit copy that the 21 Aug RU/AR audit had removed: universal "450 needles", "25% thinner than competitors", "300% better penetration", broad scar / pigment / pore / wrinkle promises, "once every 4-6 weeks", "clean and sanitize after each use". Ported the audited content to English via `scripts/update-product-1-en-copy-20260915.ts` (description, details, features, benefits, structured how-to-use, precautions).

## Also

- `lib/routineStepImages.ts`: `'6'` → `/images/CTS.jpg`; `'65'` → `main2c.jpg`.
- `docs/CHATBOT_KNOWLEDGE.md`: roller fact line updated.
- "Product documentation" PDF (Overview of Microneedling deck) kept; it is the source for the numbers above.

## Files

- `lib/productRoutines.ts`, `lib/routineStepLinks.ts`, `lib/routineStepImages.ts`
- `messages/{en,ru,ar}.json`
- `lib/productQuickFactsCatalog.ts`, `components/product/ProductQuickFactsHelper.tsx`
- `scripts/update-product-1-en-copy-20260915.ts`
