# Mobile App productConfig Fix — February 13, 2026

## Summary

Fixed a critical bug where the native iOS app did not display:
1. **Multiple product images** (second/third images from `productConfig`)
2. **Color variants** (e.g., Revita Glow BB Cream #01 Bright / #02 Natural)

The website showed these correctly; only the native app was affected. The fix is **server-side only** — no app rebuild required.

---

## Problems Identified

### 1. Product Images Not Showing in Native App

- **Symptom**: Products with multiple images (e.g., SOOTHING REPAIR POSTCREAM, SKIN BARRIER CREAM) showed only the main image in the native app, while the website displayed the full gallery.
- **User report**: "I can see these images on the website - all good but not in native app"

### 2. Color Selector Missing for Revita Glow BB Cream

- **Symptom**: Product 63 (REVITA GLOW BLEMISH BALM CREAM) has color options (#01 Bright, #02 Natural) on the website but no color selector appeared in the native app.
- **User report**: "No color selector in native app for Revita glow, though it's working on website"

---

## Root Cause

The mobile API uses `lib/pricingEngine.ts` to generate enhanced product data. The engine looked up `productConfig` using `product.id`:

- **Database products**: `product.id` is a **CUID** (e.g., `cmxyz123abc...`)
- **productConfig keys**: Use **product numbers** (e.g., `'25'`, `'27'`, `'63'`)

Because `PRODUCT_CONFIG['cmxyz123abc...']` does not exist, all config lookups returned `undefined`. The API therefore:
- Returned only `product.images` from the DB (often `null`) instead of merging `productConfig.images`
- Returned empty `colorVariants` instead of `productConfig.colors`

The website worked because it uses `lib/products.ts` (static data) where `id` is the product number, or it fetches from the API with different resolution logic in components like `ProductImageGallery` and `useProductImages` that use `product.id` — which on the website comes from the products list where IDs are product numbers.

---

## Products Affected

### Products with Second/Additional Images (23 total)

| Product # | Product Name | Image Count |
|-----------|--------------|-------------|
| 6 | CTS | 3 |
| 9 | AWS | 3 |
| 10 | SNOW O₂ CLEANSER | 3 |
| 11 | SKIN DEFENDER | 2 |
| 12 | EPI TURNOVER BOOSTING PEELING GEL | 2 |
| 13 | SRS | 3 |
| 15 | INTENSIVE PROBLEM CONTROL TONER | 2 |
| 16 | BOOSTER | 2 |
| 19 | ALL FOR SENSITIVE SERUM | 2 |
| 21 | MULTI VITA RADIANCE SERUM | 2 |
| 25 | SOOTHING REPAIR POSTCREAM | 2 |
| 26 | EGF CREAM | 2 |
| 27 | SKIN BARRIER PROTECTING CREAM | 2 |
| 30 | PROBLEM CONTROL CREAM | 2 |
| 35 | HYDRATING MASK | 2 |
| 38 | EZ CO₂ MASK KIT | 3 |
| 39 | ULTRA SHIELD SUN CREAM SPF50 | 2 |
| 40 | ULTRA SHIELD SUN CREAM SPF40 | 2 |
| 42 | SKIN CARING BLEMISH BALM CUSHION | 2 |
| 50 | EYE ZONE CARE KIT | 2 |
| 51 | BIO-FERMENT AGE DEFYING POWDER MASK | 2 |
| 52 | SKIN REBOOT PDRN MASK PACK | 3 |
| 63 | REVITA GLOW BB CREAM | 3 + colors |

### Products with Color Variants

| Product # | Product Name | Colors |
|-----------|--------------|--------|
| 41 | SKIN CARING BLEMISH BALM CUSHION | Beige, Ivory, Camel |
| 63 | REVITA GLOW BLEMISH BALM CREAM | #01 Bright, #02 Natural |

### Other Features Affected (Badges, Size Fallback)

- **Badges**: Best seller, professional, new, limited edition — were not applied when `product.id` was a CUID
- **Size variant pricing**: Fallback from `productConfig` when DB variants are absent
- **Color variant pricing**: Future expansion for products with color-based pricing

---

## Fix Applied

### 1. Added `resolveConfigKey()` Helper

**File**: `lib/pricingEngine.ts`

```typescript
/**
 * Resolves the correct key for productConfig lookups.
 * DB products use CUID as `id`, but productConfig keys are product numbers (e.g. '25').
 * This helper returns productNumber when available, falling back to id.
 */
function resolveConfigKey(product: { id: string; productNumber?: string | null }): string {
  return product.productNumber || product.id
}
```

### 2. Applied `resolveConfigKey` to All Config Lookups

| Function | What Changed |
|----------|--------------|
| `calculateProductPricing` | `getProductConfig(resolveConfigKey(product))` for size/color variant pricing |
| `generateProductVariants` | `getProductSizes(resolveConfigKey(product))` for fallback size variants |
| `generateProductBadges` | `badgeKey = resolveConfigKey(product)` for best seller, professional, new, limited edition |
| `generateEnhancedProductData` | `configKey = resolveConfigKey(product)` for images and color variants |

### 3. Merged productConfig Images into API Response

**Before**: API returned only `product.images` from DB (often `null`).

**After**: Same priority as website:
1. `productConfig.images` (if present)
2. `product.images` from DB
3. Fallback: single main image

```typescript
const configImages = getProductImages(configKey)
let mergedImages: string | null = null
if (configImages.length > 0) {
  mergedImages = JSON.stringify(configImages)
} else if (product.images) {
  mergedImages = product.images
}
```

### 4. Color Variants Now Use configKey

```typescript
const colors = getProductColors(configKey)  // was: getProductColors(product.id)
```

### 5. Merged productConfig videoUrl into API Response (February 13, 2026)

**Before**: API returned only `product.videoUrl` from DB.

**After**: Same priority as images — productConfig first, then DB:

```typescript
const configVideoUrl = getProductVideoUrl(configKey)
const mergedVideoUrl = configVideoUrl || product.videoUrl || null
```

This allows adding videos via `productConfig` without requiring a DB update. Product 27 (SKIN BARRIER PROTECTING CREAM) uses `barrier.mp4` — see [SESSION_CHANGES_2026-02-13.md](./SESSION_CHANGES_2026-02-13.md#product-27-video-addition-barriermp4).

### 6. Merged productConfig documentation into API Response (February 13, 2026)

**Before:** API did not include product documentation (PDF guides) in its response. The native app relied on a hardcoded local `PRODUCT_DOCS` object, which was out of sync (e.g., product 63 was missing).

**After:** Same priority as images and video — productConfig first:

```typescript
const docs = getProductDocumentation(configKey)
const documentation = docs.length > 0 ? docs : null
```

The API now returns a `documentation` array of `{ title, url, type }` objects. The native app's `getProductDocs(productId, product)` prefers API-provided docs over local config, so future documentation additions on the website appear in the app without an app rebuild.

**Products with documentation:** 1, 11, 12, 14, 15, 18, 21, 29, 31, 33, 38, 39, 41, 43, 45, 46, 48, 49, 50, 51, 52, 60, 63

---

## Deployment & Rebuild Requirements

| Requirement | Answer |
|-------------|--------|
| **Native app rebuild?** | **No** — fix is server-side only |
| **Vercel deployment?** | Yes — deploy the updated API (automatic on push to main) |
| **Existing app compatibility?** | Yes — app already expects `images` (JSON array) and `colorVariants` in API response; it simply wasn't receiving them before |

The native app was built to display multiple images and color selectors when the API provides them. The API was not providing the data. After deployment, the API returns the correct data and the existing app will display it.

---

## API Response Shape (Unchanged)

The response structure did not change — only the *content* of existing fields:

```json
{
  "success": true,
  "data": {
    "id": "...",
    "image": "/images/SRC.jpg",
    "images": "[\"/images/SRC.jpg\",\"/images/Second/soothrep.png\"]",
    "videoUrl": "/videos/barrier.mp4",
    "documentation": [
      { "title": "Product Name Guide", "url": "/documents/ppt/GUIDE.pdf", "type": "pdf" }
    ],
    "colorVariants": [
      { "value": "Bright", "label": "#01 Bright" },
      { "value": "Natural", "label": "#02 Natural" }
    ],
    ...
  }
}
```

- `images`: JSON string array of image URLs (unchanged format)
- `videoUrl`: Product video URL (from productConfig or DB)
- `documentation`: Array of `{ title, url, type }` for PDF guides (from productConfig)
- `colorVariants`: Array of `{ value, label, hex? }` (unchanged format)

---

## Files Modified

| File | Changes |
|------|---------|
| `lib/pricingEngine.ts` | Added `resolveConfigKey()`, applied to all config lookups; merged productConfig images, videoUrl, and documentation into `generateEnhancedProductData` |
| `data/productConfig.ts` | (Earlier session) Added `images` for products 25, 27; added `videoUrl` for product 27; added `.gitignore` exception for `productConfig.ts` |
| `public/images/Second/soothrep.png` | (Earlier session) Second image for product 25 |
| `public/images/Second/bar_big.jpg` | (Earlier session) Second image for product 27 |
| `public/videos/barrier.mp4` | (Feb 13) Product video for SKIN BARRIER PROTECTING CREAM |
| `scripts/set-product-video.ts` | (Feb 13) Script to set product videoUrl in database |

---

## Git Commits

| Commit | Description |
|--------|-------------|
| `fca8a036` | feat(product-25): Add second image to SOOTHING REPAIR POSTCREAM |
| `75a51baa` | feat(product-27): Add second image to SKIN BARRIER PROTECTING CREAM |
| `cf336bf6` | fix(product-27): Update bar_big.jpg image |
| `5386216f` | fix(mobile-api): Include productConfig images and color variants in API |
| `e26f32c0` | fix(mobile-api): Use productNumber for all productConfig lookups |

---

## Adding New Product Images in the Future

1. Add image file to `public/images/Second/` (or appropriate folder)
2. Update `data/productConfig.ts`:
   ```typescript
   'XX': {
     id: 'XX',
     images: ['/images/MAIN.jpg', '/images/Second/newimage.jpg'],
     pricing: { basePrice: ... }
   }
   ```
3. Commit and push — no app rebuild needed

---

## Adding New Product Videos

1. Place MP4 in `public/videos/` (e.g. `myproduct.mp4`)
2. Run: `npx tsx scripts/set-product-video.ts <productNumber> /videos/myproduct.mp4` (requires `DATABASE_URL` in `.env.local`)
3. Add to `data/productConfig.ts`:
   ```typescript
   'XX': {
     id: 'XX',
     videoUrl: '/videos/myproduct.mp4',
     ...
   }
   ```
4. Commit and push — website and native app will show the video (no app rebuild needed)

---

## Adding New Product Documentation (PDF Guides)

1. Add PDF file to `public/documents/ppt/` (e.g., `GENOSYS_PRODUCT_GUIDE.pdf`)
2. Update `data/productConfig.ts`:
   ```typescript
   'XX': {
     id: 'XX',
     documentation: [
       { title: 'Product Name Guide', url: '/documents/ppt/GENOSYS_PRODUCT_GUIDE.pdf', type: 'pdf' }
     ],
     ...
   }
   ```
3. Commit and push — API will include documentation in product response
4. **No app rebuild needed** — native app prefers API-provided docs over local config

---

## Related Documentation

- [MOBILE_API_ENHANCED_DOCUMENTATION.md](./MOBILE_API_ENHANCED_DOCUMENTATION.md) — API reference
- [MOBILE_APP_CHANGES_SUMMARY.md](./MOBILE_APP_CHANGES_SUMMARY.md) — Mobile app changes log
- [docs/README.md](./README.md) — Documentation index

---

*Last updated: February 13, 2026*
