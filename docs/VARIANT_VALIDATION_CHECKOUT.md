# Variant Validation at Checkout — Color & Size Selection

**Date**: March 28, 2026
**Last Updated**: March 28, 2026 (v3 — config fallback + price update)
**Scope**: Website (cosmetics-website) + Mobile App (genosys-mobile-app)
**Trigger**: Order #0u8i5fdt submitted with BB Cushion and no color selected

---

## Problem

Customers could complete checkout without selecting required product variants:

- **Color**: BB Cushion, RevitaGlow BB Cream, and beauty boxes with color options could be ordered with `color: null`
- **Size**: Creams with 50g/250g options, toners with 200ml/500ml, etc. could theoretically pass through without explicit size selection

The root cause was that "quick add to bag" flows (shop grid, favorites, concern pages) bypassed the product detail page where variant selection normally happens. No validation existed at checkout to catch missing variants.

---

## Fix Summary

### Three layers of defense:

1. **Bag/Cart**: Color and size selectors now appear directly in the bag for any product that has multiple variants — customers can pick or change before checkout
2. **Checkout gate**: `handleSubmit` blocks order submission if any paid item is missing a required color or size, with a localized alert directing the user back to the bag
3. **Config fallback**: Selectors work even for cart items stored in localStorage before the Prisma `include: { variants: true }` fix — hardcoded config data (`productConfig.ts`) is used as the primary source

---

## Website Changes

### 1. `types/index.ts`
- Added `updateSize` method to `CartState` interface

### 2. `lib/cartStore.ts`
- Added `updateSize(productId, newSize, oldSize?, selectedColor?)` function
- Mirrors `updateColor` logic: finds item by composite key, merges duplicates if switching to an existing variant, otherwise updates in-place
- **Price update on size change**: calls `getPriceForSize(product, newSize)` to update `product.price` when the size changes (e.g., 50g = 290 AED → 250g = 420 AED). Without this, the subtotal and total would show the old size's price.

### 3. `components/cart/CartItem.tsx`
- **Color selector**: Now dynamic — uses `getProductColorOptions()` as primary source, falls back to `product.variants` for any product not in the hardcoded config
- **Size selector**: Uses `getProductSizes()` from `data/productConfig.ts` as primary source, falls back to `product.variants`. This dual-source approach ensures selectors render even when cart items in localStorage predate the Prisma `include: { variants: true }` fix.
- Both selectors are RTL-aware and responsive (smaller on mobile, larger on desktop)
- `handleColorChange` and `handleSizeChange` wired to store

### 4. `lib/productsDb.ts`
- Added `include: { variants: true }` to all 7 Prisma product query functions (`getAllProducts`, `getProductById` ×2, `getProductsByCategory`, `searchProducts`, `getSkinRecommendations` ×2)
- Ensures `product.variants` is populated on all product objects fetched from the database, so new cart items will always have variant data

### 5. `app/checkout/CheckoutClient.tsx`
- Validation gate in `handleSubmit` (after payment method check, before order assembly):
  - Checks all cart items for missing color (product has 2+ unique colors in variants)
  - Checks all cart items for missing size (product has 2+ unique sizes in variants)
  - Shows `alert()` with product names and directs user back to cart
  - Resets submission state so user can retry

### 6. Translation strings (`messages/en.json`, `ru.json`, `ar.json`)
- `checkout.variantRequiredMessage`: "Please select color/size for: {products}. Go back to your cart to choose."

### Data Flow: Why Two Sources Are Needed

```
New items:  Product Page → addItem(product) → product.variants ✅ (Prisma fix)
Old items:  localStorage → product.variants ❌ (missing, added before fix)
Fallback:   getProductSizes(id) / getProductColorOptions(id) → hardcoded config ✅ (always works)
```

The hardcoded config in `data/productConfig.ts` serves as a reliable fallback that doesn't depend on when the item was added to the cart. Over time, as users refresh their carts, all items will have `product.variants` from the Prisma fix, but the config fallback ensures zero downtime.

---

## Mobile App Changes

### 1. `contexts/CartContext.js`
- Added `updateSize(productId, newSize, oldSize, selectedColor)` function
- Same merge logic as `updateColor`
- Also recalculates product price from the new size variant (important: 50g = 290 AED vs 250g = 420 AED)
- Exposed on context value

### 2. `app/(tabs)/bag.js`
- Added `updateColor` and `updateSize` to `useCart()` destructure
- **Color chips**: Rendered from `product.colorVariants` (API data), with haptic feedback on tap
- **Size chips**: Rendered from `product.variants` (deduplicated), blue highlight for selected
- Falls back gracefully: no chips shown for single-variant products
- 8 new StyleSheet entries for chip layout

### 3. `app/checkout.js`
- Enhanced validation gate (was color-only, now both):
  - `itemsMissingColor`: checks `product.colorVariants` array
  - `itemsMissingSize`: checks `product.variants` for 2+ unique sizes
  - Smart title/message: "Color Selection Required" / "Size Selection Required" / "Selection Required" depending on what's missing
  - "Go to Bag" button navigates to `/(tabs)/bag`

### 4. Translation strings (`i18n/messages/en.json`, `ru.json`, `ar.json`)
- `checkout.colorRequiredTitle/Message` (existed from prior fix)
- `checkout.sizeRequiredTitle/Message` (new)
- `checkout.variantRequiredTitle/Message` (new — combined)
- `checkout.goToBag` (existed)

---

## Products Affected

### Color variants (from database `product_variants` with color field):
| Product | Colors |
|---------|--------|
| SKIN CARING BLEMISH BALM CUSHION (ID 41) | Beige, Ivory, Camel |
| RevitaGlow BB (ID 63) | Bright, Natural |

### Size variants (from database `product_variants` with multiple sizes):
| Product | Sizes |
|---------|-------|
| INTENSIVE HYDRO SOOTHING CREAM | 50g, 250g |
| INTENSIVE PROBLEM CONTROL CREAM | 50g, 250g |
| MOISTURE REPLENISHING HYALURON CREAM | 50g, 250g |
| MULTI VITA RADIANCE CREAM | 50g, 230g |
| MULTI FUNCTIONAL ANTI-WRINKLE CREAM | 50g, 250g |
| INTENSIVE PROBLEM CONTROL TONER | 200ml, 500ml |
| SNOW BOOSTER | 200ml, 1000ml |
| SNOW O₂ CLEANSER | 180ml, 500ml |
| SOOTHING REPAIR POSTCREAM | 20g, 100g |
| Microneedle Roller | 0.1mm–0.5mm |

---

## Deployment

- **Website**: Deploy via Vercel (merge to main triggers auto-deploy)
- **Mobile App**: JS-only changes — deploy via `eas update` (OTA) without App Store/Play Store review
