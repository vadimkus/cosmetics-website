# Mobile Viewport Height Fix (100dvh)

> **Last Updated**: February 2026
> **Issue**: Scroll bounce on iOS mobile browsers
> **Solution**: Replace `vh` units with `dvh` (Dynamic Viewport Height)

## The Problem

On iOS Safari and other mobile browsers, the viewport height changes when the address bar shows/hides during scrolling. Using `min-h-screen` (which equals `100vh`) causes:

1. **Scroll bounce**: Page content jumps when address bar appears/disappears
2. **Content clipping**: Bottom content hidden behind browser UI
3. **Poor UX**: Users cannot fully scroll to bottom of page

## The Solution

Replace viewport height units:

| Before | After |
|--------|-------|
| `min-h-screen` | `min-h-[100dvh]` |
| `min-h-[calc(100vh-Xpx)]` | `min-h-[calc(100dvh-Xpx)]` |
| `h-screen` | `h-[100dvh]` |

### What is `dvh`?

**Dynamic Viewport Height (dvh)** is a CSS unit that:
- Equals the viewport height **excluding** browser UI (address bar, toolbar)
- Updates dynamically as browser UI shows/hides
- Provides consistent, predictable layouts on mobile

### Browser Support

| Browser | Support |
|---------|---------|
| Safari iOS 15.4+ | ✅ Full |
| Chrome 108+ | ✅ Full |
| Firefox 101+ | ✅ Full |
| Edge 108+ | ✅ Full |
| Older browsers | Falls back to `vh` gracefully |

---

## Files Updated

The following files were updated to use `100dvh`:

### Core Pages

| File | Change |
|------|--------|
| `app/success/SuccessClient.tsx` | `min-h-screen` → `min-h-[100dvh]` |
| `app/checkout/page.tsx` | `min-h-screen` → `min-h-[100dvh]` |
| `app/checkout/success/StripeSuccessClient.tsx` | `min-h-screen` → `min-h-[100dvh]` |
| `app/checkout/cancelled/CheckoutCancelledClient.tsx` | `min-h-screen` → `min-h-[100dvh]` |
| `app/cart/page.tsx` | `min-h-screen` → `min-h-[100dvh]` |
| `app/orders/page.tsx` | `min-h-screen` → `min-h-[100dvh]` |
| `app/profile/page.tsx` | `min-h-screen` → `min-h-[100dvh]` |

### Product Pages

| File | Change |
|------|--------|
| `app/products/ProductsPageClient.tsx` | `min-h-screen` → `min-h-[100dvh]` |
| `app/products/[id]/ProductPageClientRefactored.tsx` | `min-h-screen` → `min-h-[100dvh]` |

### Auth Pages

| File | Change |
|------|--------|
| `app/login/LoginClient.tsx` | `min-h-screen` → `min-h-[100dvh]` |
| `app/forgot-password/page.tsx` | `min-h-screen` → `min-h-[100dvh]` |
| `app/reset-password/[token]/page.tsx` | `min-h-screen` → `min-h-[100dvh]` |

### Other Pages

| File | Change |
|------|--------|
| `app/favorites/FavoritesClient.tsx` | `min-h-screen` → `min-h-[100dvh]` |
| `app/track/[orderNumber]/OrderTrackingClient.tsx` | `100vh` → `100dvh` in calc |
| `app/skin-recommendation/SkinRecommendationClient.tsx` | `min-h-screen` → `min-h-[100dvh]` |
| `app/faq/FAQClient.tsx` | `min-h-screen` → `min-h-[100dvh]` |

---

## Implementation Guide

### Basic Usage

```tsx
// Before
<div className="min-h-screen bg-gray-50">
  {/* content */}
</div>

// After
<div className="min-h-[100dvh] bg-gray-50">
  {/* content */}
</div>
```

### With Calculations

```tsx
// Before - subtract header height
<div className="min-h-[calc(100vh-64px)]">
  {/* content */}
</div>

// After
<div className="min-h-[calc(100dvh-64px)]">
  {/* content */}
</div>
```

### Bottom Padding for Safe Areas

For pages that need to account for device safe areas (notches, home indicators):

```tsx
// Use fixed Tailwind padding instead of env()
<div className="min-h-[100dvh] pb-24 md:pb-16">
  {/* content */}
</div>
```

---

## Testing Checklist

When modifying viewport heights, test on:

- [ ] iPhone Safari (address bar show/hide)
- [ ] iPhone Chrome
- [ ] Android Chrome
- [ ] Desktop browsers (should work unchanged)

### Test Procedure

1. Open page on mobile device
2. Scroll down slowly
3. Observe address bar hiding
4. Scroll up slowly
5. Observe address bar showing
6. **Expected**: No content jumping or bounce

---

## Related CSS Units

| Unit | Description |
|------|-------------|
| `vh` | 1% of viewport height (static, includes browser UI) |
| `dvh` | 1% of dynamic viewport height (excludes browser UI) |
| `svh` | 1% of small viewport height (minimum, UI hidden) |
| `lvh` | 1% of large viewport height (maximum, UI visible) |

For most use cases, `dvh` is the best choice for mobile-friendly layouts.

---

## References

- [MDN: Viewport units](https://developer.mozilla.org/en-US/docs/Web/CSS/length#viewport-percentage_lengths)
- [CSS Tricks: The Large, Small, and Dynamic Viewport Units](https://css-tricks.com/the-large-small-and-dynamic-viewports/)
- [Can I Use: dvh](https://caniuse.com/viewport-unit-variants)
