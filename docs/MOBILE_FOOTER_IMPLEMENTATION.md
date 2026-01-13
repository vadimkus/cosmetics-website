# Mobile Footer Navigation Implementation

## Overview

The cosmetics website features a mobile-only sticky footer navigation that provides quick access to Home, Orders, and Bag (cart) pages. This document details the implementation, challenges faced, and the final solution.

## Component Location

`components/MobileWebFooterNav.tsx`

## Features

- **Sticky footer** at the bottom of the viewport
- **Three navigation tabs**: Home, Orders, Bag
- **Cart badge** showing item count (green highlight when items present)
- **RTL support** for Arabic locale
- **Conditional rendering**: Hidden on PWA mode, desktop, product pages, checkout

## Technical Implementation

### Position: Sticky (Final Solution)

```typescript
<div 
  style={{
    position: 'sticky',
    bottom: 0,
    width: '100%',
    height: 80,
    backgroundColor: '#fff',
    marginTop: 'auto',
  }}
>
  {/* Navigation buttons */}
</div>
```

### Required CSS (globals.css)

```css
@media (max-width: 767px) {
  body {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    min-height: 100dvh; /* Dynamic viewport height for mobile */
  }
  
  main.flex-1 {
    flex: 1 0 auto;
  }
}
```

### Why `position: sticky` Instead of `position: fixed`

| Property | `position: fixed` | `position: sticky` |
|----------|-------------------|-------------------|
| Reference | Viewport | Scroll container |
| Chrome iOS address bar | **Causes glitches** | Works correctly |
| Implementation | Simple | Requires flex container |
| Z-index issues | Common | Rare |

## Chrome iOS Issue (Resolved)

### Problem

When using `position: fixed` on Chrome iOS:
- Address bar shows/hides during scroll
- Viewport height changes dynamically
- Fixed elements move with viewport changes
- Results in visual glitches ("slowly changing" icons)

### Failed Attempts

1. **High z-index** (`2147483647`) - No effect
2. **GPU compositing** (`transform: translate3d(0,0,0)`) - Made it worse
3. **CSS containment** (`contain: layout style paint`) - No effect
4. **React Portal** to body - No effect
5. **`!important` everywhere** - No effect
6. **Disable transitions** (`transition: none`) - No effect

### Working Solution

Switch from `position: fixed` to `position: sticky`:
- Sticky elements are positioned relative to their scroll container
- Not affected by viewport height changes
- Requires body to be a flex container with `min-height: 100dvh`

## Visibility Logic

```typescript
// Only show on mobile web (not PWA, not desktop)
if (!isClient || isPWA || !isMobile || shouldHideFooter) {
  return null
}

// Hide on specific pages
const shouldHideFooter = 
  /\/products\/[a-zA-Z0-9_-]+$/.test(pathname) ||  // Product detail
  pathname.includes('/checkout') ||
  pathname.includes('/pdf-viewer') ||
  pathname.includes('/pwa-login')
```

## Related Changes

### Desktop Footer (`components/Footer.tsx`)

Hidden on mobile to avoid duplication:

```typescript
if (isClient && (isPWA || isMobile)) {
  return null
}
```

### Mobile Header

Cart icon removed from header (now in footer):
- `components/header/HeaderMobileIcons.tsx`
- `components/HeaderRussianMobile.tsx`

## Icons

Custom SVG icons matching native app design:

- **HomeIcon**: House shape, filled when active
- **ListIcon**: Three horizontal lines (orders list)
- **BagIcon**: Shopping bag shape, filled when active or has items

### Color Scheme

| State | Color |
|-------|-------|
| Active tab | `#dc2626` (red) |
| Inactive tab | `#8E8E93` (gray) |
| Has items (bag) | `#10b981` (green) |

## Testing

### Browsers Tested

- ✅ Safari iOS
- ✅ Chrome iOS (after sticky fix)
- ✅ Chrome Android
- ✅ Safari macOS (desktop - footer hidden)
- ✅ Chrome macOS (desktop - footer hidden)

### Test Cases

1. Scroll down - footer stays at bottom
2. Scroll up - footer stays at bottom (Chrome iOS address bar appears)
3. Navigate via footer tabs
4. Add item to cart - badge appears
5. RTL mode (Arabic) - layout mirrors correctly

## Maintenance Notes

1. **Do not use `position: fixed`** for mobile footers on iOS
2. **Always use `100dvh`** instead of `100vh` on mobile
3. **Flex container required** for sticky footer to work
4. **Test on Chrome iOS** specifically after any footer changes

---

*Last updated: January 13, 2026*
