# Mobile Web UX Implementation

## Overview

The cosmetics website implements a native app-like experience for mobile web browsers (not PWA). This provides users with a cleaner, more intuitive interface similar to what they'd expect from a native mobile app.

## Key Components

### 1. Mobile Web Header (`components/MobileWebHeader.tsx`)

A PWA-style header for mobile web browsers featuring:

| Element | Description |
|---------|-------------|
| Hamburger Menu | Opens the side navigation menu |
| Language Switcher | EN/RU/AR with chevron indicator |
| AI Link | Red "AI" text linking to skin analysis |
| Logo | Centered GENOSYS logo |
| Profile Icon | User avatar or login button |

```typescript
// Structure
<header className="mobile-web-header">
  <div className="left-icons">
    <HamburgerMenu />
    <LanguageSwitcher />
    <AILink />
  </div>
  <Logo />
  <ProfileIcon />
</header>
```

#### AI Link Styling
```css
.ai-link {
  font-size: 0.875rem;  /* text-sm */
  font-weight: bold;
  color: #dc2626;       /* red-600 */
}
```

### 2. Sticky Footer Navigation (`components/MobileWebFooterNav.tsx`)

A fixed bottom navigation bar with three tabs:

| Tab | Icon | Destination | Badge |
|-----|------|-------------|-------|
| Home | House | `/` | - |
| Orders | List | `/orders` | - |
| Bag | Shopping bag | `/cart` | Cart item count |

See `docs/MOBILE_FOOTER_IMPLEMENTATION.md` for detailed implementation notes.

### 3. Simple Page Headers

Individual pages display a simplified header with:
- Back button (arrow left)
- Page title (centered)
- Profile icon (right)

#### Pages with Simple Headers

| Page | File | Title |
|------|------|-------|
| Checkout | `app/checkout/CheckoutClient.tsx` | "Checkout" |
| Cart | `app/cart/CartClient.tsx` | "My Bag" |
| Orders | `app/orders/page.tsx` | "My Orders" |
| Product Detail | `app/products/[id]/ProductPageClientRefactored.tsx` | Product name |
| Profile | `app/profile/page.tsx` | Uses PWAProfilePage |

## Removed Elements (Mobile Web Only)

### Products/Home Page (`app/products/ProductsPageClient.tsx`)

The following elements are hidden on mobile web for a cleaner experience:

| Removed Element | Reason |
|-----------------|--------|
| Breadcrumbs ("Home / Products") | Not needed with back navigation |
| "Genosys Middle East FZ-LLC" text | Company info in header already |
| 🇦🇪 United Arab Emirates ❤️ | Reduces clutter |
| Black Friday Mini Counter | Mobile space optimization |
| Logo image | Header has logo |

**Result**: Search field moves up, providing immediate access to product search.

### Header Changes

| Removed from Header | Added to Footer |
|--------------------|-----------------|
| Cart/Bag icon | Bag tab with badge |

## Mode Detection

### `usePWAMode` Hook
```typescript
const { isPWA, isClient } = usePWAMode()
```

### Mobile Device Detection
```typescript
const isMobile = window.innerWidth < 768
// OR using user agent
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
```

### App-Like Mode Logic
```typescript
// Used throughout the codebase
const isAppLikeMode = isPWA || isMobile
```

## Conditional Rendering Matrix

| Component | Desktop | Mobile Web | PWA |
|-----------|---------|------------|-----|
| Desktop Header | ✅ | ❌ | ❌ |
| Mobile Web Header | ❌ | ✅ | ❌ |
| PWA Header | ❌ | ❌ | ✅ |
| Desktop Footer | ✅ | ❌ | ❌ |
| Sticky Footer | ❌ | ✅ | ❌ |
| Breadcrumbs | ✅ | ❌ | ❌ |
| Company Text (Products) | ✅ | ❌ | ❌ |
| Simple Page Headers | ❌ | ✅ | ✅ |

## File Structure

```
components/
├── MobileWebHeader.tsx         # New mobile web header
├── MobileWebFooterNav.tsx      # Sticky footer navigation
├── Header.tsx                  # Main header (modified to hide on mobile)
├── Footer.tsx                  # Desktop footer (hidden on mobile)
├── PWAHeader.tsx               # PWA-specific header
└── header/
    ├── HeaderMobileIcons.tsx   # Mobile header icons
    └── HeaderRussianMobile.tsx # Russian locale mobile header

app/
├── layout.tsx                  # Includes MobileWebHeader & Footer
├── products/
│   └── ProductsPageClient.tsx  # Home page (modified)
├── checkout/
│   └── CheckoutClient.tsx      # Simple header added
├── cart/
│   └── CartClient.tsx          # Simple header added
├── orders/
│   └── page.tsx                # Simple header added
├── profile/
│   └── page.tsx                # Uses PWAProfilePage on mobile
└── products/[id]/
    └── ProductPageClientRefactored.tsx  # Simple header added
```

## CSS Requirements

### globals.css Additions

```css
/* Mobile flex container for sticky footer */
@media (max-width: 767px) {
  body {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    min-height: 100dvh;
  }
  
  main.flex-1 {
    flex: 1 0 auto;
  }
}
```

### layout.tsx Body Classes

```tsx
<body className="flex flex-col min-h-screen">
  <main className="flex-1">
    {children}
  </main>
</body>
```

## Browser Compatibility

| Browser | Status | Notes |
|---------|--------|-------|
| Safari iOS | ✅ Works | Smooth experience |
| Chrome iOS | ✅ Works | After sticky footer fix |
| Chrome Android | ✅ Works | Full compatibility |
| Firefox Mobile | ✅ Works | Full compatibility |
| Samsung Internet | ✅ Works | Full compatibility |

## Testing Checklist

### Header
- [ ] Hamburger menu opens side nav
- [ ] Language switcher works
- [ ] AI link navigates to skin analysis
- [ ] Logo links to home
- [ ] Profile icon shows correct state (logged in/out)

### Footer
- [ ] Home tab navigates correctly
- [ ] Orders tab navigates correctly
- [ ] Bag tab navigates correctly
- [ ] Cart badge shows correct count
- [ ] Active tab highlighted in red

### Pages
- [ ] Products page shows search immediately (no breadcrumbs)
- [ ] Checkout has back button and title
- [ ] Cart has back button and title
- [ ] Orders list has back button and title
- [ ] Product detail has back button and product name

### Scroll Behavior
- [ ] Footer stays at bottom when scrolling
- [ ] No visual glitches in Chrome iOS
- [ ] Content doesn't get hidden behind footer

## Maintenance Notes

1. **Always test on Chrome iOS** - Most challenging browser for mobile layouts
2. **Use `100dvh`** instead of `100vh` for dynamic viewport support
3. **Keep `isAppLikeMode`** pattern consistent across pages
4. **Don't mix fixed/sticky** positioning for bottom navigation
5. **RTL support** - Verify layout mirrors correctly in Arabic

---

*Last updated: January 13, 2026*
