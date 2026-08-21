# Product 55 Russian and Arabic localization audit

**Date:** 21 Aug 2026  
**Product:** PROBLEM SKIN CARE BEAUTY BOX  
**Scope:** customer-facing Russian and Arabic product, bundle, routine, concern,
SEO and chatbot surfaces

## Authoritative contents

- SNOW O₂ Cleanser 180 ml × 1
- Intensive Problem Control Toner 200 ml × 1
- Problem Control Serum 30 ml × 1
- Intensive Problem Control Cream 50 g × 1
- Soothing Bomb Sea Algae Mask 25 g × 3

The box therefore contains five products and seven retail units. Component order
comes from `PRODUCT_ROUTINES['55']`, which also supplies the shared beauty-box
PDP and mobile routine payload.

## Source boundaries

The rewrite reuses only claims retained by the completed source audits for
products 10, 15, 20, 30 and 36. It removes treatment positioning, guaranteed
clearing, inflammation reduction, pore-unblocking stories, oxygen-therapy
language, ocean-healing language, irritation-free promises and effects assigned
to trace botanicals.

Key retained facts include:

- SNOW O₂ is applied to a dry face, allowed to form an air foam, massaged gently
  and rinsed with tepid water. The current formula contains 8% Methyl
  Perfluoroisobutyl Ether.
- Toner: zinc PCA 0.5%, moisturizing base 13.398%, salicylic acid 0.001%.
- Serum: zinc PCA 0.05%; lightweight, oil-free and fragrance-free.
- Cream: zinc PCA 0.05%, trehalose 1.5%, xylitol 0.5%, no traditional oil phase.
- Mask: Eucalace® sheet, methylpropanediol 10%, glycerin 5.035%, allantoin and
  panthenol 0.1% each; peppermint oil 0.005%; 15–20 minutes.

## Routine and warnings

AM and PM: cleanser → toner → serum → cream. On an optional mask evening, use
the mask for 15–20 minutes after toner, then continue with serum and cream. No
unsupported weekly frequency is stated.

The localized copy preserves sunscreen guidance and discloses the relevant
routine warnings: fragranced cleanser and cream; salicylic acid and tea tree oil
in the toner; peppermint oil in the mask; the cleanser's limonene, SLES and
printed pregnancy/lactation warning; and the mask's plaster/compress caution.

## Pricing

The established component arithmetic is 330 + 260 + 330 + 290 + (36 × 3) =
1,318 AED. A box price of 1,120.30 AED is exactly 15% lower, a saving of 197.70
AED. Customer copy does not hard-code those figures: the bespoke PDP calculates
the separate total, saving amount and saving percentage from live product
records and hides a non-positive saving.

## Implementation

- Canonical RU/AR payload: `data/product55LocalizedCopy.ts`
- Canonical runtime maps and audit ownership:
  `data/productTranslationsRu.ts`, `data/productTranslations.ts`,
  `data/productLocalizedCopyAudit.ts`
- Dedicated beauty-box PDP copy:
  `components/product/beautybox/copy/problemSkin.ts`
- Shared surfaces: quick facts, routine messages, concern pages, RU/AR SEO
  landing pages and chatbot fallback
- Idempotent production updater:
  `scripts/update-product-55-localized-copy-20260821.ts`
- Focused regression test:
  `__tests__/data/product55LocalizedCopy.test.ts`

The updater normalizes `productNumber` to `"55"` and size to
`"1 set · 7 pieces"`, clears bundle-level ingredients, skin type and target
concerns that wrongly described the box as a formulated treatment, and writes
the exact localized payload.

## Production parity and validation

- The updater was run twice successfully against production; product 55 resolves
  to `cmhowxw4x00008ofct2ivnq2j`.
- Production `descriptionRu` and `descriptionAr` exactly equal the canonical
  constants. The normalized size is `1 set · 7 pieces`; unsupported
  `ingredients`, `skinType` and `targetConcerns` are null.
- Live component prices remain 330 + 260 + 330 + 290 + (36 × 3) = 1,318 AED.
  Against the live 1,120.30 AED box price, the saving is still exactly 15%.
- `npx tsc --noEmit`: passed.
- Focused ESLint: passed with no warnings.
- Product 55 localization, shared quick-facts, routine and mobile pricing tests:
  60 passed across four suites.
- Scoped `git diff --check`: passed.
