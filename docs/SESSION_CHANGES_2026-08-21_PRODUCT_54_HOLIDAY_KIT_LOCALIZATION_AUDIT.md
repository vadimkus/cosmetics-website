# Product 54 Holiday Kit RU/AR localization audit

Date: 21 August 2026  
Product: `54` — Holiday Kit  
Status: discontinued seasonal set, out of stock, still public

## Physical contents verified

The current production row and the current hero asset agree on the four-piece set:

- Multi Vita Radiance Serum — `30 ml` — product `21`
- Multi Vita Radiance Cream — `50 g` — product `31`
- Snow O₂ Cleanser — `180 ml` — product `10`
- GENOSYS mirror — accessory

Sources checked:

- production product `54`, id `cmhf1a6p400000xfa0iu3bw42`
- `public/images/Hol_kit_v2.jpg`
- archived `scripts/archive/one-off-fixes/fix-miror-description.ts`
- MoySklad mapping for `Holiday Kit` / `OXY VITA Holiday KIT`
- reorder and stockout session records, including the explicit decision not to reorder
- current product config, which has no competing product-54 content declaration

No newer source showed a changed physical assortment. The visible asset shows the same three
retail products and mirror as the production description.

## Component evidence reused

No claims were inferred from the seasonal box itself. Customer copy reuses the completed
source audits for:

- product `10`, Snow O₂ Cleanser: dry-face application, bubbles from Methyl
  Perfluoroisobutyl Ether `8%`, circular massage, tepid-water rinse, dermatological test
  statement, eye and pregnancy/lactation precautions
- product `21`, Multi Vita Radiance Serum: `30 ml`, niacinamide `2%`, panthenol `1%`,
  stable vitamin C derivative `0.1%`, two or three drops, morning/evening use, daytime SPF,
  gradual introduction if stinging occurs, pregnancy and fragrance precautions
- product `31`, Multi Vita Radiance Cream: `50 g`, niacinamide `2%`, macadamia oil `13%`,
  squalane `1%`, normal-to-dry-skin scope, morning/evening use after serum, daytime SPF,
  pregnancy/lactation and fragrance precautions

All three skincare components independently carry the dermatological-test statement.
Therefore, the set can say that all three skincare products are dermatologically tested.
The copy explicitly excludes the mirror from that statement.

## Corrections

- Replaced the machine-like RU/AR summary with premium natural Russian and polished neutral
  MSA.
- Made discontinued/out-of-stock status explicit on the PDP, quick facts, fallback and
  chatbot. The public record remains visible for reference and is never presented as
  currently purchasable.
- Normalized the exact order to cleanser → serum → cream. The mirror is identified as an
  accessory, not a treatment step.
- Removed the old complete-routine and all-skin implication.
- Removed unsupported kit-level claims for barrier protection, twelve-vitamin performance,
  free-radical protection, slowing ageing, collagen activation, UV/environmental shielding,
  oxygen delivery and irritation-free cleansing.
- Kept only source-supported component claims and exact sizes.
- Renamed the RU/AR catalog category from generic holiday kits to seasonal gift sets, which
  does not imply live stock.

## Implementation

- Canonical localized module: `data/product54LocalizedCopy.ts`
- Canonical audit registry and runtime maps:
  - `data/productLocalizedCopyAudit.ts`
  - `data/productTranslationsRu.ts`
  - `data/productTranslations.ts`
- Git tracking exception: `.gitignore`
- Quick facts and fallback:
  - `lib/productQuickFactsCatalog.ts`
  - `lib/products.ts`
- Three-step PDP/mobile routine: `lib/productRoutines.ts`
- Seasonal category labels: `messages/ru.json`, `messages/ar.json`
- Product-specific out-of-stock SEO descriptions:
  - `app/products/[id]/page.tsx`
  - `app/ru/products/[id]/page.tsx`
  - `app/ar/products/[id]/page.tsx`
- Chatbot product entry, availability guard and claim boundary: `lib/chatbot/config.ts`
- Idempotent production updater:
  `scripts/update-product-54-localized-copy-20260821.ts`
- Focused regression:
  `__tests__/data/product54LocalizedCopy.test.ts`

## Production normalization

The updater writes and verifies:

- `productNumber: "54"`
- `size: "1 box"`
- corrected EN/RU/AR names and complete customer copy
- exact structured contents, order, component facts and warnings
- `category: "kits"`
- `inStock: false`
- `isHidden: false`
- `skinType`, `targetConcerns`, `usage` and `ageGroup`: `null`

It resolves the row by product number, stable CUID or exact name, rejects a conflicting owner,
reads the updated row back and fails on any mismatch. A second run must report every
`changed` flag as `false`.

Applied successfully to production row `cmhf1a6p400000xfa0iu3bw42`.

- First run changed RU/AR names, EN/RU/AR copy, all structured fields and `size`.
- `productNumber`, category, out-of-stock/public status and cleared targeting fields were
  already correct and remained unchanged.
- Read-back parity returned `verified`.
- The second run returned every `changed` flag as `false` with parity `verified`.

## Verification

- `npx tsc --noEmit` — passed.
- Focused ESLint over runtime, maps, fallback and tests — passed.
- Direct `--no-ignore` ESLint of the updater — passed.
- Full audited-copy, product 54 and routine Jest suites — `178/178` passed.
- Scoped `git diff --check` — passed.

No commit or push was created.
