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

**IMPORTANT**: Styles are defined in CSS (not inline) for proper vendor prefix support.

```tsx
// Component uses CSS class for styling
<nav 
  className="mobile-web-footer-nav"
  dir={dir}
  aria-label="Mobile navigation"
>
  {/* Navigation buttons */}
</nav>
```

### Required CSS (globals.css)

```css
/* Mobile web footer navigation - sticky at bottom */
.mobile-web-footer-nav {
  position: -webkit-sticky;  /* CRITICAL: WebKit prefix for Chrome iOS */
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 80px;
  background-color: #fff;
  border-top: 1px solid #e5e7eb;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding-bottom: 10px;
  /* NOTE: Do NOT use margin-top: auto - causes whitespace at bottom of long pages */
}

/* Make body flex container for sticky footer on mobile */
@media (max-width: 767px) {
  body {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    min-height: 100dvh; /* Dynamic viewport height for mobile */
  }
  
  body > main,
  main.flex-1 {
    flex: 1 0 auto;  /* This handles pushing footer to bottom */
  }
}

/* Hide on desktop */
@media (min-width: 768px) {
  .mobile-web-footer-nav {
    display: none !important;
  }
}
```

### Common Pitfall: margin-top: auto

**DO NOT use `margin-top: auto`** on the footer! While it seems logical for pushing the footer down, it causes a large white space at the bottom of pages with long content.

The flex container setup handles footer positioning correctly:
- `body { display: flex; flex-direction: column; min-height: 100dvh }` - Makes body a flex column
- `main { flex: 1 0 auto }` - Main content grows to fill available space
- Footer naturally sits at the bottom without needing `margin-top: auto`

### Why CSS Classes Instead of Inline Styles

| Approach | Vendor Prefixes | Browser Support |
|----------|-----------------|-----------------|
| Inline styles | ❌ Cannot use `-webkit-sticky` | Limited |
| CSS classes | ✅ Full vendor prefix support | Full |

**Critical**: Chrome iOS uses WebKit engine and requires `-webkit-sticky` prefix for proper sticky positioning. Inline React styles cannot include vendor prefixes properly.

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
- Footer appears to "jump" or float in middle of screen

### Failed Attempts

1. **High z-index** (`2147483647`) - No effect
2. **GPU compositing** (`transform: translate3d(0,0,0)`) - Made it worse
3. **CSS containment** (`contain: layout style paint`) - No effect
4. **React Portal** to body - No effect
5. **`!important` everywhere** - No effect
6. **Disable transitions** (`transition: none`) - No effect
7. **`position: fixed` with padding-bottom on content** - Footer still jumps (Feb 2026)

### Working Solution

Switch from `position: fixed` to `position: sticky` with proper vendor prefixes:

1. **Use CSS classes** (not inline styles) for vendor prefix support
2. **Add `-webkit-sticky`** prefix before `sticky` for Chrome iOS (WebKit engine)
3. **Body must be flex container** with `min-height: 100dvh`
4. **Use `<nav>` semantic element** for accessibility

```css
.mobile-web-footer-nav {
  position: -webkit-sticky;  /* WebKit (Chrome iOS, Safari) */
  position: sticky;          /* Standard */
  bottom: 0;
  margin-top: auto;
}
```

### Why This Works

- Sticky elements are positioned relative to their scroll container
- Not affected by viewport height changes (address bar)
- `-webkit-sticky` ensures Chrome iOS (which uses WebKit) applies sticky correctly
- `margin-top: auto` in flex container pushes footer to bottom when content is short

## Visibility Logic

```typescript
// Only show on mobile web (not PWA, not desktop)
if (!isClient || isPWA || !isMobile || shouldHideFooter) {
  return null
}

// Hide on specific pages
const shouldHideFooter = 
  /\/products\/[a-zA-Z0-9_-]+$/.test(pathname) ||  // Product detail
  pathname.includes('/pdf-viewer') ||
  pathname.includes('/pwa-login')

// Note: Checkout page now shows the sticky footer (updated Jan 13, 2026)
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
5. **Use CSS classes for sticky** - inline styles cannot include `-webkit-sticky` prefix
6. **Never use GPU compositing** (`transform: translate3d`) on sticky footer - it makes glitches worse
7. **Use semantic `<nav>` element** for accessibility
8. **Never use `margin-top: auto`** on footer - causes whitespace at bottom of long pages
9. **Add `flex-shrink: 0` and `min-height`** to prevent compression in flex containers
10. **Clear browser cache** when testing footer changes - stale CSS causes misleading behavior

## Debugging White Space Issues

If white space appears below the footer when scrolling:

### ❌ Things That Don't Work

| Approach | Why It Fails |
|----------|--------------|
| `position: fixed` with body padding | Chrome iOS address bar glitches |
| Inline styles | Can't use `-webkit-sticky` vendor prefix |
| Override `min-h-screen` | Doesn't address root cause |
| Viewport height JS fix (`--vh`) | Adds complexity, doesn't solve issue |
| `overscroll-behavior: none` | May break expected scroll behavior |

### ✅ What Works

1. Use documented sticky implementation (see CSS above)
2. Clear browser cache and restart browser
3. Ensure `flex-shrink: 0` on footer to prevent compression

## Changelog

| Date | Change | Reason |
|------|--------|--------|
| Jan 13, 2026 | Initial sticky implementation | Fixed Chrome iOS glitches |
| Feb 3, 2026 | Added `min-height: 80px` and `flex-shrink: 0` | Prevent footer compression |
| Feb 1, 2026 | Moved styles to CSS class | Enable `-webkit-sticky` vendor prefix |
| Feb 1, 2026 | Changed `<div>` to `<nav>` | Semantic HTML for accessibility |
| Feb 1, 2026 | Removed `margin-top: auto` | Fixed whitespace at bottom of long pages |

---

*Last updated: February 3, 2026*
