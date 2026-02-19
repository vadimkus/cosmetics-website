# Session Changes — 2026-02-19 (Part 2)

## Concern Detail API, Native Screens, Training Nativization, Routine Add-to-Cart, ID Fix

### Summary

Continuation of the Feb 19 session covering: (1) Mobile API for concern detail pages, (2) back-navigation on concern pages, (3) protocol PDFs on concern pages, (4) POWER SOLUTION CTS addition, (5) native concern-detail screen replacing WebView, (6) native Training Materials screen, (7) routine product chip add-to-cart across all platforms, (8) product ID mismatch fix, (9) breadcrumb removal on mobile, (10) toast messages + toggle behavior, (11) interaction model change (tap vs long-press), (12) TestFlight build 64.

---

## 10. Mobile API — Concern Detail Endpoint

Created `app/api/mobile/concerns/[slug]/route.ts` to serve concern page data to the native app.

| Detail | Value |
|--------|-------|
| Endpoint | `GET /api/mobile/concerns/:slug` |
| Auth | `x-api-key` header required |
| Locale | `x-locale` header (en/ar/ru) |
| Cache | `s-maxage=3600, stale-while-revalidate=600` |

**Response structure:**
```json
{
  "success": true,
  "data": {
    "slug": "acne-treatment",
    "icon": "🔴",
    "seo": { "h1": "...", "intro": "...", "heroShort": "..." },
    "why": { "title": "...", "points": [...] },
    "protocolPdf": { "url": "...", "title": "...", "description": "...", "fileSize": "..." },
    "routine": [{ "title": "...", "subtitle": "...", "steps": [...] }],
    "products": [{ "id": "...", "productNumber": "10", "name": "...", "price": 330, ... }],
    "faq": [{ "q": "...", "a": "..." }],
    "relatedConcerns": [{ "slug": "...", "icon": "...", "h1": "..." }],
    "routineEssentials": [{ "productId": "10", "name": "...", "price": "330 AED" }]
  },
  "meta": { "locale": "en", "productCount": 7, "processingTime": "120ms" }
}
```

**Key implementation detail:** The API extracts all `productNumber` values referenced in routine step URLs across all locales and fetches those products from the DB, merging them with the concern-matched products. This ensures every routine product chip has full product data for add-to-cart functionality.

---

## 11. Concern Page Enhancements (Web)

### Back-Navigation
Added a back link to the Skin Concerns list at the top of each concern page (EN/AR/RU).

### Protocol PDFs
Added downloadable protocol PDF sections to concern pages that have associated protocols (e.g., acne, sensitivity, pigmentation).

### POWER SOLUTION CTS
Added POWER SOLUTION CTS product to the scars-treatment concern page.

### Breadcrumb Removal (Mobile)
Hidden visible breadcrumb navigation on mobile web/PWA (`hidden sm:block`) while keeping it for desktop and SEO structured data schemas.

---

## 12. Native Concern Detail Screen

Replaced WebView-based concern detail pages with a fully native screen (`app/concern-detail.js`).

| Feature | Implementation |
|---------|---------------|
| Header | Back button + concern title |
| Hero | Icon + H1 + intro text |
| Why section | Expandable points with icons |
| Routine | Collapsible steps with product chips |
| Products grid | 2-column with image, name, price, add-to-bag |
| FAQ | Expandable accordion |
| Protocol PDF | Download button (opens in-app browser) |
| Related concerns | Horizontal scroll cards |
| Routine essentials | 3-card section (cleanser, toner, SPF) |
| RTL | Full Arabic RTL support |
| i18n | EN, AR, RU |

---

## 13. Native Training Materials (WebView → Native)

Converted the last WebView screen in the native app to fully native.

| Before | After |
|--------|-------|
| `router.push('/webview', { url: ... })` | `router.push('/training')` |
| WebView loading website `/training` page | Native screen calling `fetchTraining()` API |
| Slow, inconsistent UI | Native tabs, cards, fast loading |

**Files changed:**
- `app/profile.js` — Changed navigation target
- `services/api.js` — Added `fetchTraining()` function
- `app/training.js` — Refactored to use API service

---

## 14. Routine Product Chip — Add to Cart

### Feature
Single tap/click on a routine step product chip adds/removes the product from the shopping bag across all platforms.

### Evolution
1. **v1 — Double-click**: Initially implemented double-click to add (single click navigates). Had issues with event propagation in native app.
2. **v2 — Single tap toggle + long-press navigate**: Simplified to single click/tap for cart toggle, long press for product page navigation.

### Implementation by Platform

**Web (Desktop / Mobile Web / PWA):**
- Component: `components/RoutineProductChip.tsx` (client component)
- Single click: toggles add/remove from cart
- Long press / right-click (`onContextMenu`): navigates to product page
- Green checkmark + green styling when in cart
- Used in all 3 locale pages (EN, AR, RU)

**Native App (Expo):**
- File: `app/concern-detail.js`
- `onPress`: toggles add/remove from cart with haptic feedback
- `onLongPress` (500ms delay): navigates to product page
- Toast message on add ("Added to bag") and remove ("Removed from bag") — localized EN/AR/RU
- Green checkmark icon + green chip styling when in cart
- Animated toast with fade in/out

### Key Bug Fixes

1. **Parent Pressable stealing taps**: The entire routine step (header + body) was wrapped in a single `Pressable`. Tapping a product chip propagated to the parent, collapsing the step and unmounting the chip. Fixed by wrapping only the header in `Pressable`, leaving the body as a plain `View`.

2. **Product ID mismatch (CUID vs productNumber)**: Routine step URLs use `productNumber` (e.g. `/products/10`) but the DB `id` is a CUID (e.g. `clxyz123...`). The lookup map was keyed only by CUID, so `productLookup["10"]` returned `undefined`. Fixed by:
   - Indexing `productLookup` by both `id` and `productNumber`
   - Using the real `product.id` (CUID) for cart operations (`isInCart`, `removeItem`, `addItem`)
   - API now fetches routine-referenced products that aren't in the concern-matched set

3. **Missing routine products**: Some routine products (cleanser #10, toner #16, SPF #39) aren't matched by the concern's `targetConcerns` filter. Fixed by:
   - **API**: Extracts all productNumbers from routine steps, fetches missing ones by `productNumber`, merges into response
   - **Web**: New `getProductsByNumbers()` helper in `lib/productsDb.ts`, fetches missing routine products, builds `productById` map indexed by both `id` and `productNumber`

---

## 15. TestFlight Build 64

| Detail | Value |
|--------|-------|
| App Version | 1.5.0 |
| Build Number | 64 |
| Commit | `aaa5861` (fix: product lookup by productNumber) |
| Build ID | `bfd4505e-9d5b-4c11-b5cd-b9c07fea228a` |
| Status | Submitted to App Store Connect / TestFlight |

---

## Files Changed

### cosmetics-website

| File | Changes |
|------|---------|
| `app/api/mobile/concerns/[slug]/route.ts` | **New** — Concern detail API endpoint; updated to fetch routine-referenced products |
| `app/products/concern/[slug]/page.tsx` | Back-nav, breadcrumb hiding, RoutineProductChip, routine product fetch |
| `app/ar/products/concern/[slug]/page.tsx` | Same updates for Arabic |
| `app/ru/products/concern/[slug]/page.tsx` | Same updates for Russian |
| `components/RoutineProductChip.tsx` | **New** — Client component for add-to-cart on routine product chips |
| `lib/productsDb.ts` | New `getProductsByNumbers()` helper |

### genosys-mobile-app

| File | Changes |
|------|---------|
| `app/concern-detail.js` | **New** — Native concern detail screen; tap-to-cart, toast, haptics |
| `app/profile.js` | Training Materials: WebView → native navigation |
| `app/training.js` | Refactored to use `fetchTraining()` API |
| `services/api.js` | Added `fetchTraining()` function |

---

## Commits

### cosmetics-website

| Commit | Message |
|--------|---------|
| `cec251bf` | Add mobile API endpoint for concern detail pages |
| `94abee12` | Add back-navigation to Skin Concerns list on concern pages |
| `8336be6b` | Add POWER SOLUTION CTS to scars-treatment concern page |
| `06e6c7b5` | Add Sensitive Skin protocol PDF to concern page |
| `ee7e91c0` | feat: double-click routine product chips to add to cart |
| `2f573fc6` | Hide breadcrumb nav on mobile/PWA for skin concern pages |
| `86faa51e` | fix: remove unused import breaking build + add toggle behavior |
| `c63fc262` | refactor: single click toggles cart, long-press navigates to product |
| `cd005204` | fix: ensure all routine products are available for add-to-cart |

### genosys-mobile-app

| Commit | Message |
|--------|---------|
| `b79be57` | Replace WebView concern pages with fully native screens |
| `e76ae25` | feat: double-tap routine product chips to add to cart + native training |
| `8e4b6d2` | fix: delay single-tap navigation to allow double-tap add-to-cart |
| `9255ce9` | fix: prevent step collapse on product chip tap |
| `69f29b0` | feat: toast message on cart add/remove + double-tap toggles cart |
| `4249b3f` | refactor: single tap toggles cart, long-press navigates to product |
| `aaa5861` | fix: product lookup by productNumber, use real ID for cart ops |

---

*Last updated: February 19, 2026*
