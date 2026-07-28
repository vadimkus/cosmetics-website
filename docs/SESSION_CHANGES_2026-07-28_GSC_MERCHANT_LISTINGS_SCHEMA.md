# Session — GSC Merchant listings structured data (2026-07-28)

## Problem

Google Search Console emailed non-critical Merchant listings issues on
`https://genosys.ae/`:

1. Missing field `shippingDetails` (in `offers`)
2. Missing field `hasMerchantReturnPolicy` (in `offers`)
3. Missing field `description`

## Root cause

`components/schema/HomeItemListSchema.tsx` (homepage featured products ItemList)
emitted nested `@type: Product` with `offers.price` (fixed 2026-07-11) but
without Merchant listing fields. PDP `ProductSchema.tsx` already had full
shipping + return policy + description.

`CollectionPageSchema` / `ProductsListSchema` could omit or empty-string
`description` when DB text was missing.

## Fix

- Homepage nested Products: add `description`, `offers.shippingDetails`,
  `offers.hasMerchantReturnPolicy` (aligned with list/collection schemas).
- Collection + products list + PDP: always emit a non-empty `description`
  (DB text or short GENOSYS fallback).

## Follow-up

In Search Console → Merchant listings → open each issue → **Validate fix**.
