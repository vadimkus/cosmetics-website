# Session Changes - February 9, 2026

## Summary

Eleven fixes and enhancements across the native app (genosys-mobile-app), focused on WebView page cleanup and haptic feedback:

1. **WebView empty space (Partners page)** — Hidden header spacer div was leaving ~80px blank gap at top
2. **WebView bottom padding (FAQ page)** — `pb-32` padding for PWA tab bar created blank space at bottom
3. **WebView hamburger/strange nav (Contact page)** — Comprehensive CSS/JS injection to hide all website navigation variants
4. **WebView sub-nav still visible (Locations, Brand pages)** — Sub-nav div lacked `border-b` class, so CSS selector missed it
5. **WebView sub-nav still visible (Delivery page)** — Added structure-based computed-style detection, independent of class names
6. **Haptic: Payment method buttons (Settings)** — Added medium tap haptic to COD/Card selection on Payment Settings page
7. **Haptic: Place Order button** — Added medium tap haptic to the Place Order button on checkout page
8. **Haptic: Checkout payment method buttons** — Added medium tap haptic to COD/Card selection on checkout page
9. **Haptic: Proceed to Checkout button** — Added medium tap haptic to the checkout button on bag page

---

## Fix 1: WebView Empty Space — Header Spacer

### Problem

On the Partners page (and other pages) in the native app WebView, a large blank white space appeared between the native header bar and the page content, even though the website's header was hidden.

### Root Cause

The website's `PWAHeader` and `MobileWebHeader` components render a **spacer div** after the fixed header to push content below it:

```html
<div class="md:hidden" style="height: calc(env(safe-area-inset-top, 0px) + 80px)" aria-hidden="true"></div>
```

When the injected CSS hid the header with `display: none`, this spacer div remained visible, creating ~80px of empty space.

### Fix

| File | Change |
|------|--------|
| `app/webview.js` | Added CSS rule `div[aria-hidden="true"] { display: none !important; height: 0 !important; }` and JS-based cleanup targeting `aria-hidden` divs with safe-area heights |

### Commits (genosys-mobile-app)

```
ee6e334 fix: hide header spacer and in-page sub-navigation in WebView
```

---

## Fix 2: WebView Bottom Padding Blank Space

### Problem

FAQ page (and other pages) showed a large blank space at the bottom of the content in the native app WebView.

### Root Cause

Website pages add `pb-32` (128px bottom padding) via Tailwind when `isAppLikeMode` is true, to account for the PWA/mobile-web bottom tab bar. In the native app WebView, this padding is unnecessary since the native app has its own tab bar.

### Fix

| File | Change |
|------|--------|
| `app/webview.js` | Added CSS rule `[class*="pb-32"], [class*="pb-24"], [class*="pb-20"] { padding-bottom: 0 !important; }` and JS-based `paddingBottom = '0px'` stripping |

### Commits (genosys-mobile-app)

```
db48aee fix: remove bottom padding blank space in WebView pages
```

---

## Fix 3: Comprehensive Website Navigation Hiding

### Problem

The Contact page showed a hamburger menu and "strange navigation" in the WebView header. Different pages rendered different header variants (MobileWebHeader with hamburger, PWAPageWrapper sub-nav, in-page sticky headers), and the original CSS injection didn't catch all of them.

### Fix

Overhauled the injected CSS/JS in `webview.js` to comprehensively hide all website chrome:

| Target | CSS Selector | Purpose |
|--------|-------------|---------|
| `<header>` elements | `header { display: none !important; height: 0 !important; }` | PWAHeader, MobileWebHeader, desktop Header |
| Sticky/fixed top bars | `[class*="sticky"][class*="top-0"]`, `[class*="fixed"][class*="top-0"]` | Any header variation |
| Nav overlays | `[class*="z-50/z-40"][class*="fixed"][class*="inset-0"]` | Hamburger menu overlays |
| Header spacers | `div[aria-hidden="true"]` | All spacer divs |
| Sub-nav headers | `div[class*="justify-between"][class*="px-5"][class*="py-4"]` | "< Products \| Title \| Profile" bars |
| Chat widget | `button[aria-label*="Genie"]` | Website's own chat button |
| Bottom bars | `[class*="fixed"][class*="bottom-0"]` | PWA bottom tab bars |
| Bottom padding | `[class*="pb-32/24/20"]` | PWA tab bar padding |

| File | Change |
|------|--------|
| `app/webview.js` | Rewrote CSS injection with comprehensive selectors; added JS `MutationObserver` patterns |

### Commits (genosys-mobile-app)

```
0d13c0a fix: comprehensively hide all website navigation in WebView
```

---

## Fix 4: Sub-Nav on Locations/Brand Pages

### Problem

The "< Products | Locations | Profile icon" sub-navigation header was still showing on the Locations and Brand pages in the WebView, even after the comprehensive CSS fix.

### Root Cause

The Partners page sub-nav uses `border-b border-gray-100` in its class list:
```html
<div class="flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100">
```

But Locations and Brand pages omit `border-b`:
```html
<div class="flex items-center justify-between px-5 py-4 bg-white">
```

The CSS selector required `border-b` to match, so these pages were missed.

### Fix

| File | Change |
|------|--------|
| `app/webview.js` | Removed `border-b` requirement from CSS selectors: changed `div[class*="border-b"][class*="justify-between"]...` to `div[class*="justify-between"][class*="px-5"][class*="py-4"]`. Also updated JS pattern matching. |

### Commits (genosys-mobile-app)

```
6b1de13 fix: hide sub-nav on Locations/Brand pages and strip bottom padding
```

---

## Fix 5: Structure-Based Sub-Nav Detection (Delivery Page)

### Problem

The Delivery page sub-nav header was still visible despite the class-name CSS fix. Tailwind CSS may compile class names differently in production, making `class*=` attribute selectors unreliable.

### Fix

Added a **structure-based detection** using `window.getComputedStyle()` that doesn't rely on class names at all:

```javascript
// Check computed styles instead of class names
var style = window.getComputedStyle(el);
if (style.display === 'flex' && style.justifyContent === 'space-between' && style.alignItems === 'center') {
  // Verify structure: SVG back arrow OR rounded avatar circle
  var hasBackArrow = el.querySelector('svg path[d*="M15 19l-7-7"]');
  var hasAvatar = el.querySelector('div[class*="rounded-full"]');
  if (hasBackArrow || hasAvatar) {
    el.style.display = 'none';
  }
}
```

| File | Change |
|------|--------|
| `app/webview.js` | Added computed-style-based detection for `display:flex` + `justify-content:space-between` + `align-items:center` with 3 children containing SVG back arrow or avatar circle |

### Commits (genosys-mobile-app)

```
dbe70b0 fix: add structure-based sub-nav detection for Delivery and other pages
```

---

## Fix 6–9: Haptic Feedback

### Overview

Added `mediumTap` haptic feedback to key action buttons across the app using the existing `utils/haptics.js` utility (which wraps `expo-haptics` with silent fallback for unsupported devices).

| Button | Screen | File | Haptic Type |
|--------|--------|------|-------------|
| COD / Card Payment radio buttons | Profile > Payment Settings | `app/profile/payment.js` | `mediumTap` |
| Place Order | Checkout | `app/checkout.js` | `mediumTap` |
| COD / Card Payment radio buttons | Checkout | `app/checkout.js` | `mediumTap` |
| Proceed to Checkout | Bag | `app/(tabs)/bag.js` | `mediumTap` |

### Commits (genosys-mobile-app)

```
e703357 feat: add haptic feedback to payment method selection buttons
0e96ef6 feat: add haptic feedback to Place Order button
2bec638 feat: add medium haptic to checkout payment method buttons
a2c799b feat: add haptic feedback to Proceed to Checkout button
```

---

## All Files Changed

### genosys-mobile-app (Native App)

| File | Changes |
|------|---------|
| `app/webview.js` | Comprehensive CSS/JS injection to hide all website headers, spacers, sub-navigation, bottom bars, and padding in WebView. Added structure-based computed-style detection. |
| `app/profile/payment.js` | Added `mediumTap` haptic to payment method selection |
| `app/checkout.js` | Added `mediumTap` haptic to Place Order button and payment method selection |
| `app/(tabs)/bag.js` | Added `mediumTap` haptic to Proceed to Checkout button |

---

## Build Status

| Build | Version | Status | Changes |
|-------|---------|--------|---------|
| 42 | 1.1.0 | TestFlight | Red icon, social login fixes |
| 43 | 1.1.0 | TestFlight | Chatbot floating panel, in-app links, WebView fixes |
| 44 | 1.1.0 | TestFlight | PDF downloads, chatbot expand, WebView header hiding |
| **Local (Expo)** | — | **Testing** | **WebView cleanup (spacers, sub-nav, padding), haptic feedback** |

**Note:** No new TestFlight build submitted. All changes are being tested locally via Expo per user request.

---

## Git Summary (genosys-mobile-app)

```
ee6e334 fix: hide header spacer and in-page sub-navigation in WebView
db48aee fix: remove bottom padding blank space in WebView pages
0d13c0a fix: comprehensively hide all website navigation in WebView
6b1de13 fix: hide sub-nav on Locations/Brand pages and strip bottom padding
dbe70b0 fix: add structure-based sub-nav detection for Delivery and other pages
e703357 feat: add haptic feedback to payment method selection buttons
0e96ef6 feat: add haptic feedback to Place Order button
2bec638 feat: add medium haptic to checkout payment method buttons
a2c799b feat: add haptic feedback to Proceed to Checkout button
```
