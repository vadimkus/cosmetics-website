# Session Changes — 2026-07-09 — Search: variant colors/sizes now searchable

## Problem

Searching "beige cushion" (web + mobile) returned nothing, while the misspelled "biege cushion" oddly returned the CHARMING LOOK BEAUTY BOX.

## Root causes

1. Cushion shades (Beige / Ivory / Camel) live in `variants[].color` — a field neither search implementation looked at. Same gap for variant sizes (0.25mm roller needles, 600ml cleanser, 250g creams).
2. The Beauty Box description contained the literal typo "Biege" — which is why only the misspelled query matched it.

## Fixes

- **Web** `lib/productSearch.ts`: haystack now includes `product.size` + all `variants[].color` / `variants[].size`.
- **Mobile** `app/(tabs)/shop.js` (genosys-mobile-app repo): same haystack extension. Shipped via OTA to both runtimes:
  - 1.11.0 (main): update group `ab93669c-498b-4e48-ad5d-0d054c45748a`
  - 1.10.5 (release branch cherry-pick `f3abbc8`): update group `760e1655-08c0-4c18-a05a-fc1d4093373b`
- **Data**: "Biege" → "Beige" fixed in the CHARMING LOOK BEAUTY BOX description via `scripts/fix-biege-typo-20260709.js` (run against production, verified live).

## Verified queries (against live catalog)

| Query | Before | After |
|---|---|---|
| beige cushion | 0 hits | Beauty Box + Skin Caring BB Cushion |
| ivory cushion | 0 | 2 hits |
| camel | 0 | 3 hits |
| 0.25mm | 0 | Microneedle Roller |
| 600ml cleanser | 0 | Cerabarrier Biome Gel Cleanser |
