# Session Changes — February 15, 2026

## Part 1: MoySklad Refactor — Automatic to Manual Admin Push

### Problem

The automatic MoySklad order sync (implemented Feb 14) was unreliable on Vercel's serverless runtime. Despite multiple attempts (fire-and-forget promises, `next/server` `after()`, direct `await` before response), real checkout orders were not consistently being created in MoySklad, even though a standalone test endpoint worked perfectly.

**Root cause**: Vercel serverless functions can terminate unpredictably after the HTTP response is sent, and even blocking the response with `await` was inconsistent for external API calls to MoySklad.

### Solution

Switched from automatic sync to a **manual admin push button**:

1. **Removed** automatic MoySklad calls from all 3 checkout routes
2. **Added** `moySkladOrderId` and `moySkladSyncedAt` columns to the Order model
3. **Created** `POST /api/admin/orders/[id]/push-moysklad` endpoint with admin auth + CSRF
4. **Added** "Push to MoySklad" button to the admin order detail view (`OrderDetails.tsx`)
5. **Deleted** the temporary `/api/test-moysklad` debug endpoint

### Files Changed

| File | Change |
|------|--------|
| `app/api/checkout/route.ts` | Removed `createMoySkladOrder` import and call |
| `app/api/webhooks/stripe/route.ts` | Removed `createMoySkladOrder` import and call |
| `app/api/mobile/orders/route.ts` | Removed `createMoySkladOrder` import and call |
| `prisma/schema.prisma` | Added `moySkladOrderId` (String?) and `moySkladSyncedAt` (DateTime?) to Order model |
| `app/api/admin/orders/[id]/push-moysklad/route.ts` | **NEW** — Admin endpoint to push order to MoySklad |
| `components/admin/OrderDetails.tsx` | Added "Push to MoySklad" button + "Synced to MoySklad" badge |
| `app/admin/page.tsx` | Passed `getAdminHeaders`, `showToast`, `onMoySkladPushed` props to OrderDetails |
| `app/api/orders/cod-confirmation/route.ts` | Added `moySkladOrderId: null` to fallback order object (TypeScript) |
| `app/api/orders/support-link/route.ts` | Added `moySkladOrderId: null` to fallback order object (TypeScript) |
| `app/api/test-moysklad/route.ts` | **DELETED** — Debug endpoint no longer needed |
| `docs/MOYSKLAD_INTEGRATION.md` | Updated to reflect manual push workflow |

### Admin UI

- **Before push**: Orange "Push to MoySklad" button appears below the order Total
- **After push**: Green "Synced to MoySklad" badge replaces the button
- **Already pushed**: API returns 409 to prevent duplicate orders
- Toast notifications show success or error messages

### Risk Assessment

- **Zero risk to checkout flow**: MoySklad is completely decoupled from all checkout routes
- **Zero risk to emails**: Email confirmations are unchanged
- **Zero risk to existing orders**: The new columns are nullable, existing orders unaffected
- **Database migration**: Used `prisma db push` (additive only — two nullable columns)

---

## Part 2: PCS Product Gallery Images

### Change

Added second and third gallery images for **POWER SOLUTION PCS** (product ID: 7) on [genosys.ae/products/7](https://genosys.ae/products/7).

### Files Changed

| File | Change |
|------|--------|
| `lib/products.ts` | Changed `images: null` to `images: JSON.stringify(['/images/PCS.jpg', '/images/Second/pcs_big1.jpg', '/images/Second/pcs_big2.jpg'])` for product 7 |
| `public/images/Second/pcs_big1.jpg` | **NEW** — Second product image |
| `public/images/Second/pcs_big2.jpg` | **NEW** — Third product image |

### Pattern

Follows the same pattern as other PRO Solution products:
- **CVS** (product 5): `[CVS.jpg, cvs_big1.jpg, cvs_big2.jpg]`
- **CTS** (product 6): `[CTS.jpg, cts_big.jpg, cts_big2.jpg]`
- **PCS** (product 7): `[PCS.jpg, pcs_big1.jpg, pcs_big2.jpg]` ← new

---

## Part 3: Fix Duplicate Discount Display on Order Success Page

### Problem

On the order confirmation page (`/success`), the VIP discount was shown **twice**:

1. **Per-item**: Strikethrough original price (AED 580.00), green discounted price (AED 290.00), "(50% OFF)" text, and "-50% VIP" badge
2. **Breakdown section**: "Retail Price (1 item) → 580.00 AED" (strikethrough), then "Your Discount (50%) → -290.00 AED", then "Net Subtotal → 290.00 AED"

This was redundant and confusing — the customer sees the same discount info in two places.

### Fix

The "waterfall" breakdown (Retail → Discount → Net Subtotal) is now only shown when there is a **bundle discount** (where it adds clarity for the multi-step discount calculation). For **VIP-only discounts**, the breakdown shows a simple "Net Subtotal" line since the per-item display already clearly communicates the discount with strikethrough prices and badges.

### Files Changed

| File | Change |
|------|--------|
| `app/success/SuccessClient.tsx` | Show waterfall only for bundle discounts; VIP-only shows simple "Net Subtotal" |

### Before vs After (VIP-only order)

**Before:**
```
POWER SOLUTION PCS          AED 580.00 → AED 290.00
  (50% OFF)  -50% VIP

Retail Price (1 item)         580.00 AED  ← duplicate
Your Discount (50%)          -290.00 AED  ← duplicate
Net Subtotal                  290.00 AED
Shipping (Dubai)               45.00 AED
VAT (5%)                       15.95 AED
Total                         350.95 AED
```

**After:**
```
POWER SOLUTION PCS          AED 580.00 → AED 290.00
  (50% OFF)  -50% VIP

Net Subtotal                  290.00 AED
Shipping (Dubai)               45.00 AED
VAT (5%)                       15.95 AED
Total                         350.95 AED
You saved: 290.00 AED
```

Bundle orders still show the full waterfall breakdown.

---

## Part 4: MoySklad Delivery Service Mapping

### Change

When an order is pushed to MoySklad from the admin panel, the shipping charge is now added as a **service line item** (not just a text description). This ensures MoySklad's accounting totals match the website order total exactly.

### Mapping

| Emirate | Shipping (AED) | MoySklad Service UUID |
|---------|---------------|----------------------|
| Dubai | 45 | `a97cfeeb-814e-11ea-0a80-004a001516bd` |
| Sharjah | 70 | `52864050-59a7-11eb-0a80-022e00579624` |
| Abu Dhabi | 70 | `212036af-814f-11ea-0a80-011700157c7d` |
| Al Ain | 80 | `41b80390-814f-11ea-0a80-03ae0014ec85` |
| Fujairah | 80 | `557d2277-814f-11ea-0a80-03ae0014ed65` |
| RAK | 80 | `a9d199bf-b909-11ea-0a80-03ec0015b2d7` |

### Files Changed

| File | Change |
|------|--------|
| `lib/moysklad.ts` | Added `DELIVERY_SERVICE_MAP`, `getMoySkladDeliveryServiceId()`, and shipping line-item logic in `createMoySkladOrder` |

### Technical Details

- Shipping is added as `@type: service` (not `product`) in MoySklad positions
- VAT is set to 0 / disabled for shipping line items
- If no emirate mapping is found, a warning is logged and shipping is mentioned in the description only
- Uses fuzzy matching (`.includes()`) for emirate name variations

---

## Part 5: Google Search Console — Structured Data Fixes

### Problem

Google Search Console flagged two sets of issues on genosys.ae product pages:

**Issue Set 1 — Merchant Listings:**
| Issue | Severity | Status |
|-------|----------|--------|
| Missing field `shippingDetails` (in `offers`) | Non-critical | **Fixed** |

**Issue Set 2 — Product Snippets:**
| Issue | Severity | Status |
|-------|----------|--------|
| Missing field `priceValidUntil` (in `offers`) | Non-critical | **Fixed** |
| Missing field `aggregateRating` | Non-critical | **Cannot fix** (no real reviews) |
| Missing field `review` | Non-critical | **Cannot fix** (no real reviews) |

### Fix 1: shippingDetails (Merchant Listings)

The existing `shippingDetails` in `ProductSchema.tsx` was hardcoded with `"value": "0"` (free shipping), which was inaccurate — shipping is only free for orders over 1000 AED.

**Replaced** with an array of two accurate shipping options:

```json
"shippingDetails": [
  {
    "@type": "OfferShippingDetails",
    "shippingRate": { "value": "45", "currency": "AED" },
    "shippingDestination": { "addressCountry": "AE", "addressRegion": "Dubai" },
    "deliveryTime": { "transitTime": { "minValue": 0, "maxValue": 1 } }
  },
  {
    "@type": "OfferShippingDetails",
    "shippingRate": { "value": "70", "currency": "AED" },
    "shippingDestination": { "addressCountry": "AE" },
    "deliveryTime": { "transitTime": { "minValue": 1, "maxValue": 2 } }
  }
]
```

Also added `shippingDetails` to `ProductsListSchema.tsx` and `CollectionPageSchema.tsx` (previously missing entirely).

### Fix 2: priceValidUntil (Product Snippets)

`priceValidUntil` was already present in `ProductSchema.tsx` (individual product pages) but **missing** from the listing and collection page schemas. Added to both.

Also added `itemCondition: "https://schema.org/NewCondition"` for completeness.

### Why aggregateRating and review Cannot Be Fixed

These fields require **real customer review data**. Google explicitly prohibits fabricated reviews in structured data and can penalize sites that include them. The code in `ProductSchema.tsx` (lines 223-232) is already pre-wired to include `aggregateRating` when a real review system is implemented — just uncomment the block and connect real data.

### Files Changed

| File | Change |
|------|--------|
| `components/schema/ProductSchema.tsx` | Replaced fake free-shipping `shippingDetails` with accurate Dubai (45 AED) + UAE (70 AED) array |
| `components/schema/ProductsListSchema.tsx` | Added `shippingDetails`, `priceValidUntil`, `itemCondition` to listing offers |
| `components/schema/CollectionPageSchema.tsx` | Added `shippingDetails`, `priceValidUntil`, `itemCondition` to collection offers |

### Shipping Rates Reference

Rates match `lib/mobileCheckoutConfig.ts`:

| Emirate | Shipping (AED) |
|---------|---------------|
| Dubai | 45 |
| Abu Dhabi | 70 |
| Sharjah | 70 |
| Ajman | 70 |
| Ras Al Khaimah | 70 |
| Fujairah | 70 |
| Umm Al Quwain | 70 |
| **Free threshold** | **1,000 AED** |

---

## Part 6: Product Video — ULTRA SHIELD SUN CREAM SPF 50+ (Product 39)

### Change

Added product video `spf50.mp4` to [genosys.ae/products/39](https://genosys.ae/products/39) (ULTRA SHIELD SUN CREAM [SPF 50+ PA++++]).

The video renders below the image gallery using the existing `<video>` player in `ProductPageClientRefactored.tsx` (controls, playsInline, preload="none", GENOSYS logo poster).

### Files Changed

| File | Change |
|------|--------|
| `lib/products.ts` | Added `videoUrl: '/videos/spf50.mp4'` to product 39 |
| `public/videos/spf50.mp4` | **NEW** — Product video file (~5.5 MB) |

### Bug Fix: Video Not Appearing

The initial commit (`a4af9e8d`) only added `videoUrl` to `lib/products.ts`, which is the **static fallback** data. However, the product page loads data through `pricingEngine.ts`, which reads `videoUrl` from `data/productConfig.ts` first (priority source via `getProductVideoUrl()`). Since `productConfig['39']` had no `videoUrl`, the merge logic resolved to `null`.

**Fix** (`9b33ae21`): Added `videoUrl: '/videos/spf50.mp4'` to `data/productConfig.ts` under the `'39'` entry — matching the pattern used by products 27, 28, 29, and 40.

### Video Data Flow (Reference)

```
productConfig.videoUrl  →  (priority)
        ↓ if undefined
product.videoUrl (DB)   →  (fallback)
        ↓ if null
null                    →  video element not rendered
```

Source: `lib/pricingEngine.ts` lines 533-535

### Files Changed

| File | Change |
|------|--------|
| `lib/products.ts` | Added `videoUrl: '/videos/spf50.mp4'` to product 39 (static fallback) |
| `data/productConfig.ts` | Added `videoUrl: '/videos/spf50.mp4'` to product 39 config (actual source) |
| `public/videos/spf50.mp4` | **NEW** — Product video file (~5.5 MB) |

### Pattern

Uses the existing `videoUrl` field on the `Product` type (`types/index.ts` line 94). The product page component already renders a `<video>` element when `product.videoUrl` is set.

---

## Part 7: GSC Fix — Remove Invalid `audience` Field from Product Schema

### Problem

Google Search Console flagged **"Invalid object type for field audience"** in Merchant listings structured data. The `audience` property with `@type: "Audience"` is not a recognized field on `schema.org/Product` for Google's Merchant listings validator.

### Fix

Removed the entire `audience` block from `components/schema/ProductSchema.tsx`:

```json
// REMOVED:
"audience": {
  "@type": "Audience",
  "audienceType": "Skincare Professionals and Consumers",
  "geographicArea": {
    "@type": "Country",
    "name": "United Arab Emirates"
  }
}
```

Geographic and audience targeting is already communicated through other valid fields:
- `seller.address.addressCountry: "AE"` — seller location
- `shippingDetails.shippingDestination.addressCountry: "AE"` — shipping region
- Google Search Console geo-targeting settings

### Files Changed

| File | Change |
|------|--------|
| `components/schema/ProductSchema.tsx` | Removed `audience` block (9 lines) |

---

## Commits

| Hash | Message |
|------|---------|
| `bf8fa75b` | refactor: switch MoySklad from auto-sync to manual admin push button |
| `9adf3fac` | fix: add Push to MoySklad button to the actual OrderDetails view |
| `8cc35bcf` | add gallery images for POWER SOLUTION PCS (product 7) |
| `3034a16b` | fix: remove duplicate discount display on order success page |
| `9958d70a` | docs: add session log for Feb 15 and update MoySklad integration docs |
| `87611e2b` | feat: add delivery service as line item in MoySklad orders |
| `961ec66b` | fix: add shippingDetails structured data to resolve Google Search Console warning |
| `5559fc11` | fix: add priceValidUntil and itemCondition to listing/collection schema offers |
| `dc435a93` | docs: update session log with delivery mapping and GSC structured data fixes |
| `a4af9e8d` | add product video for ULTRA SHIELD SUN CREAM SPF 50+ (product 39) — lib/products.ts only |
| `f10104ad` | fix: remove invalid audience field from Product structured data |
| `7326f407` | docs: add SPF 50+ video and audience field fix to session log |
| `9b33ae21` | fix: add spf50 video to productConfig for product 39 — actual fix (data/productConfig.ts) |
