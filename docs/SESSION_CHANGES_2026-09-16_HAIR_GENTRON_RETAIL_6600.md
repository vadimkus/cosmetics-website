# Hair-GENTRON retail and Partner pricing

**Date:** 16 September 2026
**Product:** 48, Hair-GENTRON

## Decision

- Regular customer price: **6,600 AED**.
- Professional Partner price: **3,300 AED**.
- Hair-GENTRON remains excluded from Black Friday, bundle, and ordinary
  customer discounts.
- The 3,300 AED Partner price is a narrow product-specific contractual
  exception. Other devices keep their existing no-discount behavior.

## Changes

- Updated the production `products.price` value from 3,300 to 6,600.
- Updated the product's default database variant from 3,300 to 6,600.
- Added server-authoritative Partner pricing in `lib/discountUtils.ts`.
- Updated `data/productConfig.ts` and `lib/products.ts` fallbacks.
- Updated the EN/AR/RU Hair-GENTRON ownership comparison.
- Updated chatbot pricing and the current English hair-care protocol total.
- Added an idempotent database update script:
  `scripts/set-product-48-retail-price-6600.ts`.

## Verification

- Database product price: 6,600.
- Database default variant: 6,600.
- Regular customer pricing test: 6,600.
- Professional Partner pricing test: 3,300.
- Other device no-discount behavior remains unchanged.
- 64 pricing tests passed.
- ESLint and TypeScript passed.
