# Product 56 Russian and Arabic localization audit

**Date:** 21 Aug 2026  
**Product:** SKIN BRIGHTENING BEAUTY BOX  
**Scope:** customer-facing Russian and Arabic product, bundle, routine, concern,
SEO and chatbot surfaces

## Authoritative contents

- SNOW O₂ Cleanser 180 ml × 1
- SNOW BOOSTER 200 ml × 1
- Multi Vita Radiance Serum 30 ml × 1
- Multi Vita Radiance Cream 50 g × 1
- EPI Turnover Boosting Peeling Gel 100 g × 1
- Soothing Bomb Sea Algae Mask 25 g × 1

The box contains six products and six retail units. The shared routine inventory
uses product numbers 10, 12, 16, 21, 31 and 36.

## Source boundaries and corrections

The rewrite reuses only facts retained by the completed component audits.

- SNOW O₂ is a dry-face rinse-off cleanser. The current formula contains 8%
  Methyl Perfluoroisobutyl Ether. Copy says air foam, not oxygen delivery,
  therapy, all-in-one treatment or irritation-free cleansing.
- SNOW BOOSTER contributes betaine 3% and a water-based moisturizing base. The
  box does not use generic all-skin, daily soothing or fragrance-free claims as
  its sales premise.
- Multi Vita Radiance Serum contributes niacinamide 2%, panthenol 1% and
  3-O-Ethyl Ascorbic Acid 0.1%. The retained two-week measurement is the product
  study, not a promise for the box.
- Multi Vita Radiance Cream contributes niacinamide 2%, macadamia oil 13% and
  squalane 1%. Barrier, antioxidant, free-radical, UV, collagen and VITA 12
  performance stories were removed.
- EPI Peeling Gel is a rinse-off gommage driven by cellulose 3%, used for
  30–60 seconds on dry skin 1–2 times weekly. The box no longer sells papain,
  dead-cell, enzyme, purification, miracle-tree, desert-complex or
  irritation-free stories.
- The Sea Algae mask is a 25 g Eucalace® sheet with methylpropanediol 10%,
  glycerin 5.035%, allantoin and panthenol 0.1% each. Healing-ocean,
  intensive-relief and algae-effect claims were removed.

## Routine and cautions

AM and PM: cleanser → booster → serum → cream. Finish the morning routine with
suitable sunscreen.

Use the peeling gel 1–2 times weekly on dry skin. Use the single mask for
15–20 minutes on a different evening, after cleanser and booster. This avoids
stacking the acidic, alcohol- and fragrance-containing peel with the mask's
peppermint oil.

Localized directions disclose the relevant fragrance, limonene/linalool,
bergamot oil, Alcohol Denat., Hexyl Cinnamal, SLES, peppermint oil,
damaged-skin, plaster/compress, pregnancy and persistent-irritation cautions.

## Pricing

Production prices were read from the six live component records:

330 + 260 + 330 + 290 + 250 + 36 = **AED 1,496**.

The live box price is **AED 1,271.60**, a saving of **AED 224.40**, exactly
**15%**. Customer copy does not hard-code those figures. The bespoke page
calculates the separate total and saving from current product records.

## Implementation

- Canonical RU/AR payload: `data/product56LocalizedCopy.ts`
- Runtime maps and audit ownership:
  `data/productTranslationsRu.ts`, `data/productTranslations.ts`,
  `data/productLocalizedCopyAudit.ts`
- Dedicated beauty-box PDP: `components/product/beautybox/copy/skinBrightening.ts`
- Shared surfaces: quick facts, routine messages, pigmentation concern and RU/AR
  SEO landing pages, chatbot fallback
- Idempotent production updater:
  `scripts/update-product-56-localized-copy-20260821.ts`
- Focused regression: `__tests__/data/product56LocalizedCopy.test.ts`

The updater normalizes `productNumber` to `"56"` and size to
`"1 set · 6 pieces"`, clears unsupported bundle-level ingredients, skin type,
target concerns, usage and age group, writes exact localized payloads, and
fails if read-back parity differs.

## Production parity

The updater resolved production row `cmhoyg0r400008o7s4va63hsw`.

- RU/AR names and descriptions exactly equal the canonical constants.
- Size is `1 set · 6 pieces`.
- `ingredients`, `skinType`, `targetConcerns`, `usage` and `ageGroup` are null.
- First run updated the customer copy and structured fields.
- Second run reported every `changed` flag as `false`.
- Both runs returned `parity: verified`.

## Validation

- `npx tsc --noEmit`: passed.
- Focused ESLint and direct updater ESLint: passed.
- Product-localization, audited-copy, quick-facts, routine and mobile pricing
  tests: 223 passed across six suites.
- Scoped `git diff --check`: passed.

No commit or push was created.
