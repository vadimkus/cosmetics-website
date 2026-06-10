# Session Changes — 2026-06-10 — Bio Meso PDRN Ampoule 60000 Retail Price

## What changed

Product **60 — Bio Meso PDRN Ampoule 60000** (`cmk449na90077e9k5anpfqz4o`) was created with `price: 0` + `isPriceOnRequest: true` ("Price on request", not orderable).

Set via `scripts/set-product-60-price.ts` (direct DB update):

| Field | Before | After |
|---|---|---|
| `price` | 0 | **600 AED** (retail) |
| `isPriceOnRequest` | true | **false** |
| `inStock` | true | true |

## Verification

- `GET https://genosys.ae/api/products/60` → `price: 600`, `isPriceOnRequest: false`, `inStock: true`
- Product page now shows Add to Cart (UI hides ordering only when `isPriceOnRequest` is true)
- Mobile API reads the same DB row, so the app shows 600 AED as well
- Product is DB-only (not in `lib/products.ts`), so `sync-product-prices-from-products-ts.ts` will not overwrite it
