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

---

## Email: Duplicate Discount Display Fix

### Summary

Order confirmation emails (customer + admin) were showing both `(50% OFF)` in green text and `-50% VIP` as a purple badge for VIP customers — redundant. Fixed to show only one: the badge when present, otherwise the generic `(XX% OFF)` text.

### Fix Applied

- `lib/email/htmlGenerators.ts` — `renderEnhancedItemRows()`: badge takes priority; `(XX% OFF)` only when no badge
- `lib/email/templates.ts` — COD order confirmation item renderer: same logic
- `lib/email/templates.ts` — Admin new order item renderer: same logic

### Affected Emails

COD, Stripe, Support-link, Admin new order confirmation.

### Documentation

- [EMAIL_CHANGELOG.md](./EMAIL_CHANGELOG.md) — Version 3.0.1
- [EMAIL_TEMPLATES.md](./EMAIL_TEMPLATES.md) — Updated discount display rules

---

## Product 27: Video Addition (barrier.mp4)

### Summary

Added product video for SKIN BARRIER PROTECTING CREAM (product 27). Video displays on website and native app — no app rebuild required.

### What Was Done

1. **Video file**: `public/videos/barrier.mp4` (8.6MB)
2. **Database**: Set `videoUrl = '/videos/barrier.mp4'` via `scripts/set-product-video.ts`
3. **productConfig**: Added `videoUrl: '/videos/barrier.mp4'` to product 27 entry
4. **pricingEngine**: Merged `videoUrl` from productConfig (same pattern as images) — API now returns video from productConfig OR database

### How Product Videos Work

| Source | Website | Native App |
|--------|---------|------------|
| DB `product.videoUrl` | Product page renders `<video>` below gallery | API passes through to app |
| productConfig `videoUrl` | Not used directly (website uses DB) | API merges via `getProductVideoUrl(configKey)` |

The website product page (`ProductPageClientRefactored.tsx`) renders a video player when `product.videoUrl` is set. The mobile API's `generateEnhancedProductData` returns `videoUrl` from either productConfig or DB.

### Script: set-product-video.ts

To add or update a product video in the database:

```bash
npx tsx scripts/set-product-video.ts <productNumber> <videoUrl>
# Example:
npx tsx scripts/set-product-video.ts 27 /videos/barrier.mp4
```

Requires `DATABASE_URL` in `.env.local`.

### Files Modified

| File | Change |
|------|--------|
| `public/videos/barrier.mp4` | New video file |
| `data/productConfig.ts` | Added `videoUrl` for product 27 |
| `lib/pricingEngine.ts` | Import `getProductVideoUrl`, merge videoUrl from productConfig |
| `scripts/set-product-video.ts` | New script to set product video in DB |

### Adding Videos to Other Products

1. Place MP4 in `public/videos/` (e.g. `myproduct.mp4`)
2. Run: `npx tsx scripts/set-product-video.ts <productNumber> /videos/myproduct.mp4`
3. Add to `data/productConfig.ts`: `videoUrl: '/videos/myproduct.mp4'`
4. Commit and push — website and native app will show the video

---

## Native App: Product Video Sound Fix

### Summary

Product videos in the native app played without sound (web/mobile web had audio). Fixed in `genosys-mobile-app` by calling `Audio.setAudioModeAsync({ playsInSilentModeIOS: true })` before playback.

### Root Cause

On iOS, `expo-av` defaults to respecting the physical mute switch — videos play muted when the silent switch is on.

### Fix

- **Repo:** `genosys-mobile-app`
- **File:** `app/product/[id].js`
- **Change:** Import `Audio` from `expo-av`; call `Audio.setAudioModeAsync({ playsInSilentModeIOS: true })` in `ProductVideo`'s `handlePlay` before starting playback

### Deployment

**App rebuild required** — client-side change. Rebuild and submit to TestFlight.

### Documentation

- **genosys-mobile-app** repo: `docs/core/SESSION_LOG_2026_02_13.md`
- **genosys-mobile-app** repo: `docs/core/PRODUCT_DETAIL_UPDATES.md` — Section 5

---

## Additional Product Content (Later in Session)

### Product 31: Second Image (radiance_both.jpg)

- **Product:** MULTI VITA RADIANCE CREAM
- **Image:** `public/images/Second/radiance_both.jpg`
- **Changes:** Added as 2nd image to productConfig
- **Commit:** `d4a5b0ba`

### Product 40: Video (sun.mp4)

- **Product:** MULTI SUN CREAM [SPF 40 PA++]
- **Video:** `public/videos/sun.mp4` (10MB)
- **Changes:** Added `videoUrl: '/videos/sun.mp4'` to productConfig; set in database via `set-product-video.ts`
- **Commit:** `65e7e031`

### Product 52: Third Image (pdrn_big2.jpg)

- **Product:** SKIN REBOOT PDRN MASK PACK
- **Image:** `public/images/Second/pdrn_big2.jpg`
- **Changes:** Added as 3rd image to productConfig: `['/images/PDRN.png', '/images/Second/pdrnnn.jpg', '/images/Second/pdrn_big2.jpg']`
- **Commit:** `e4f0b2f5`

---

## Product Documentation — Native App Fix

### Summary

The native app did not show the product documentation section (PDF guides) for all products with documentation. For example, product 63 (REVITA GLOW BLEMISH BALM CREAM) had documentation on the website but no download section on the product detail page in the native app.

### Root Cause

- The mobile API did not include `documentation` in its response
- The native app relied entirely on a hardcoded local `PRODUCT_DOCS` object in `data/productConfig.js`, which was out of sync with the website's `productConfig.ts` (22 entries vs 23 — product 63 was missing)

### Fix Applied

**1. API side** (`cosmetics-website`):

- Added `documentation` field to `EnhancedProductData` interface in `lib/pricingEngine.ts`
- Populated it from `getProductDocumentation(configKey)` in `generateEnhancedProductData()`
- All 23 products with documentation in `productConfig.ts` are now served via the API

**2. Native app side** (`genosys-mobile-app`):

- Updated `getProductDocs(productId, product)` to accept an optional `product` parameter
- **Priority 1:** API-provided `product.documentation` (dynamic — no app update needed for future docs)
- **Priority 2:** Hardcoded `PRODUCT_DOCS` (static fallback)
- Added product 63 to local `PRODUCT_DOCS` as fallback
- Product detail page now passes `product` to `getProductDocs()`

### Products with Documentation (23 total)

1, 11, 12, 14, 15, 18, 21, 29, 31, 33, 38, 39, 41, 43, 45, 46, 48, 49, 50, 51, 52, 60, 63

### Deployment

- **Vercel:** Auto-deploy on push to main (API change)
- **Native app:** **Rebuild required** — client-side change to read API docs

### Adding Documentation to New Products (Future)

1. Add to `data/productConfig.ts` in cosmetics-website:
   ```typescript
   documentation: [
     { title: 'Product Name Guide', url: '/documents/ppt/FILENAME.pdf', type: 'pdf' }
   ]
   ```
2. Push to main — API will serve it automatically
3. **No app rebuild needed** for future additions — app prefers API data

### Documentation

- [MOBILE_APP_PRODUCTCONFIG_FIX.md](./MOBILE_APP_PRODUCTCONFIG_FIX.md) — Section 6
