# Product 49 GENO-LED IR II: EN brought in line with RU/AR

Date: 2026-09-28.

RU/AR were rewritten on 27 Sep (`d5d1cd9b4`) inside the August audit's limits
(`SESSION_CHANGES_2026-08-21_PRODUCT_49_GENO_LED_LOCALIZATION_AUDIT.md`). EN still carried
the claims that audit removed. EN now sells the same verified hardware in the same voice:
1,710 LEDs, five wavelengths, the dose table, the two ways the modes combine, the panel
timer and auto shut-off, 70 W electrical, and the comparison with GENO-LED IR.

## Removed from EN

- "Professional LED therapy" (eyebrow, image alt, chatbot, device-category SEO)
- per-colour effects: cell renewal, circulation, collagen and elastin, acne bacteria, oil,
  reactive skin, redness, "depth", recovery
- "no contact, no downtime", "no heat damage, no photo-ageing", "nothing touches the skin",
  "Contact: none" spec row
- "the dome holds the distance" and even-coverage claims
- "straight after needling is its most common use"; the interval is set by the specialist
- "CE-certified adapter"
- the 2019 study presented without noting it ran on the previous-generation unit
- the pairing block's "prepares skin for deeper mask ingredient absorption", "activates skin
  cells", "skin rejuvenation" (`pc49*` in `messages/en.json`)
- eye-protection and photosensitising-medication rules, which RU/AR also leave to the manual
  for the unit, since no IR II manual is on file

## Where

- `components/product/genoled/genoLedCopy.ts` EN; the sourcing note now covers all three locales
- `components/product/genoled/GenoLedProductPage.tsx` image alt
- `messages/en.json` `pc49*`, mirroring RU/AR
- `lib/productQuickFactsCatalog.ts` product 49 EN facts, mirroring RU/AR
- `lib/chatbot/config.ts`, `lib/concernsData.ts` (device category description)
- `data/product49LocalizedCopy.ts` new `PRODUCT_49_EN_RECORD`; `lib/products.ts` fallback matches it
- DB: `scripts/update-product-49-en-copy-20260928.ts` writes description, productDetails,
  keyFeatures, benefits, howToUse and directions, then verifies the write
- `__tests__/data/product49LocalizedCopy.test.ts` now also checks EN

Not touched: `skinType`, `targetConcerns` and `usage` on the record, and the name-based concern
map in `lib/productsDb.ts`. The August audit cleared these, but they have been set again.

Also fixed: the CVS Arabic cart buttons said الحقيبة (handbag); now السلة, per `bagWording.test.ts`.
