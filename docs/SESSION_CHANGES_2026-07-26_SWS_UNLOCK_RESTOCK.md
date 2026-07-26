# POWER SOLUTION SWS unlock — back in stock

Date: 2026-07-26

## Change

- DB product `id: 8` (`POWER SOLUTION SWS`, 580 AED): `inStock: false` → `true`
- Removed restock note from `lib/restockInfo.ts` (`Available in 14 days`)
- Static catalogue `lib/products.ts` already had `inStock: true`

## How

```bash
npx tsx --env-file=.env.local scripts/unlock-sws-product-8.ts
```

Korea PO receive (DM-GME-260710) brought SWS ampules back to warehouse stock.
