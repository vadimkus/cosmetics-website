# Session — GSC Product Snippets Critical Fix: Homepage offers.price (2026-07-11)

## Problem

Google Search Console emailed: *"Product snippets structured data issues
detected in https://genosys.ae/ — Top critical issue: Either 'price' or
'priceSpecification.price' should be specified (in 'offers')."* Critical
issues block the pages from Product rich results.

## Root cause

`components/schema/HomeItemListSchema.tsx` (used on `/`, `/ar`, `/ru`
homepages) emitted the "What's popular right now" featured-products rail as an
`ItemList` whose `ListItem.item` was `@type: Product` with **no `offers` at
all** (a past decision deliberately omitted price to avoid drift with the PDP
schema). Google treats any `@type: Product` it crawls as a Product snippet
candidate and flags missing offer price as critical.

All other Product emitters were already correct:
- `ProductSchema.tsx` (PDP) — full Offer with price, skips unpriced products
- `ProductsListSchema.tsx` — filters to `price > 0 && !isPriceOnRequest`
- `CollectionPageSchema.tsx` — only nests Product when `item.price > 0`

## Fix

In `HomeItemListSchema.tsx` featured items now:
- include a full `offers` block — `price` (live DB retail), `priceCurrency:
  AED`, `priceValidUntil` (next year-12-31, same convention as
  `ProductSchema`), `availability` (InStock/OutOfStock), `itemCondition`, `url`
- include `brand: GENOSYS`
- products with `price <= 0` or `isPriceOnRequest` fall back to **URL-only
  ListItems** (name + url, no nested Product) — Google's recommended
  summary-page pattern, generates no Product snippet at all

## Verification (live, post-deploy)

`https://genosys.ae/` featured ItemList now emits e.g.:
- INTENSIVE REPAIR COLLAGEN MASK — price 36 AED, InStock
- SOOTHING BOMB SEA ALGAE MASK — price 36 AED, InStock
- SKIN CARING BLEMISH BALM CUSHION — price 300 AED, InStock
- ULTRA SHIELD SUN CREAM — price 250 AED, InStock

Same component serves `/ar` and `/ru`, so all three locale homepages are fixed.

## Follow-up

- In Search Console → Enhancements → Product snippets → open the issue and
  click **Validate Fix** so Google recrawls (takes a few days to clear).

## Commit

`4803eb3f` — Fix GSC critical Product snippets error: add offers.price to
homepage featured products JSON-LD (deployed to Vercel, verified live).
