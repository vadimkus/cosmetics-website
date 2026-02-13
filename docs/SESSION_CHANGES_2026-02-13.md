# Session Changes — February 13, 2026

## Native App productConfig Fix — Images & Color Variants

### Summary

Fixed critical bugs where the native iOS app did not display multiple product images or color variants. The website showed these correctly; only the native app was affected. The fix is **server-side only** — no app rebuild required.

---

### Problems Fixed

1. **Product images**: 23 products with second/third images (from `productConfig`) showed only the main image in the native app
2. **Color selector**: Revita Glow BB Cream (product 63) and Cushion (product 41) color options were missing in the native app

---

### Root Cause

The mobile API's `pricingEngine` used `product.id` (database CUID) for `productConfig` lookups, but config keys are product numbers (`'25'`, `'63'`, etc.). All lookups returned `undefined`.

---

### Fix Applied

- Added `resolveConfigKey(product)` → `product.productNumber || product.id`
- Applied to: `calculateProductPricing`, `generateProductVariants`, `generateProductBadges`, `generateEnhancedProductData`
- Merged `productConfig.images` into API response (same priority as website)

---

### Products Affected (23 with images)

6, 9, 10, 11, 12, 13, 15, 16, 19, 21, 25, 26, 27, 30, 35, 38, 39, 40, 42, 50, 51, 52, 63

---

### Files Modified

- `lib/pricingEngine.ts` — resolveConfigKey, image merge, config lookups
- `data/productConfig.ts` — images for products 25, 27 (earlier in session)
- `public/images/Second/soothrep.png`, `bar_big.jpg` (earlier in session)

---

### Documentation

Full technical documentation: [MOBILE_APP_PRODUCTCONFIG_FIX.md](./MOBILE_APP_PRODUCTCONFIG_FIX.md)

---

### Deployment

- **Vercel**: Auto-deploy on push to main
- **Native app**: No rebuild needed — fix is API-only

---

## Category Pill "New" Badges for Native App

### Summary

The mobile web showed green "New" badges on the **Cream** and **Beauty Boxes** category pills (matching website `ProductsPageClient.tsx` line 445). The native app did not — the categories API only returned plain category names with no badge metadata.

### Fix Applied

**1. API side** (`cosmetics-website`): `app/api/mobile/categories/route.ts`
- Added `categoriesWithBadges` field to the response alongside the existing `data` array
- `categoriesWithBadges`: `[{ name: "Cream", badge: "new" }, { name: "Serum", badge: null }, ...]`
- Backward compatible — `data` remains a plain `string[]`
- Categories with "New" badge controlled by `CATEGORIES_WITH_NEW_BADGE` constant

**2. Native app side** (`genosys-mobile-app`):
- `services/api.js`: Parses `categoriesWithBadges` from API, attaches as `_badgeMap` on the categories array
- `app/(tabs)/shop.js`: New `categoryBadges` state, renders green "New" badge above category pills
- Badge styling: green `#22C55E` background with white text; inverts to white background with red text when pill is active

### Deployment

- **Vercel**: Auto-deploy on push to main (API change)
- **Native app**: **Rebuild required** for TestFlight — this is a client-side UI change

### Files Modified

| Repo | File | Changes |
|------|------|---------|
| cosmetics-website | `app/api/mobile/categories/route.ts` | Added `categoriesWithBadges` field |
| genosys-mobile-app | `services/api.js` | Parse `_badgeMap` from API |
| genosys-mobile-app | `app/(tabs)/shop.js` | `categoryBadges` state, badge rendering, styles |

### To Update "New" Categories in the Future

Edit `CATEGORIES_WITH_NEW_BADGE` in `app/api/mobile/categories/route.ts`:

```typescript
const CATEGORIES_WITH_NEW_BADGE = ['Cream', 'Beauty Boxes']  // add/remove categories here
```

Also update the website's `app/products/ProductsPageClient.tsx` line 445 to match.
