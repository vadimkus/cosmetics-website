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

### 3. PWAPageWrapper (`components/PWAPageWrapper.tsx`)

A reusable wrapper component that provides consistent mobile header for content pages.

**Features:**
- Shows header for both PWA and mobile web
- Back button with contextual label ("Products" or "Account")
- Centered page title
- Profile icon with green online indicator
- Bottom padding for sticky footer (`pb-32`)

**Usage:**
```tsx
<PWAPageWrapper 
  title="Page Title"
  defaultBackPath="/products"
>
  {/* Page content */}
</PWAPageWrapper>
```

**Pages using PWAPageWrapper:**
- About (`/about`)
- Contact (`/contact`)
- FAQ (`/faq`)

### 4. Simple Page Headers (Built-in)

Individual pages display a simplified header with:
- Back button (red arrow left + label)
- Page title (centered)
- Profile icon (right)

#### Pages with Built-in Simple Headers

| Page | File | Title |
|------|------|-------|
| Checkout | `app/checkout/CheckoutClient.tsx` | "Checkout" |
| Cart | `app/cart/CartClient.tsx` | "My Bag" |
| Orders | `app/orders/page.tsx` | "My Orders" |
| Product Detail | `app/products/[id]/ProductPageClientRefactored.tsx` | Product name |
| Favorites | `app/favorites/FavoritesClient.tsx` | "Favorites" |
| Success | `app/success/SuccessClient.tsx` | "Order Confirmed" |
| AI Skin Recommendation | `app/skin-recommendation/SkinRecommendationClient.tsx` | "AI Skin Analysis" |
| Privacy Policy | `app/privacy-policy/PrivacyPolicyClient.tsx` | "Privacy Policy" |
| Brand | `app/brand/BrandPageClient.tsx` | "Brand" |
| Delivery | `app/delivery/DeliveryPageClient.tsx` | "Delivery" |
| Training | `app/training/TrainingClient.tsx` | "Training" |
| Locations | `app/locations/LocationsPageClient.tsx` | "Locations" |
| Blog | `app/blog/BlogPageClient.tsx` | "Blog" |
| Partners | `app/partners/PartnersPageClient.tsx` | "Partners" |
| Order Tracking | `app/track/[orderNumber]/OrderTrackingClient.tsx` | "Track Order" |

### 5. Profile Subpages

All profile subpages have built-in headers and mobile web support:

| Page | File | Title |
|------|------|-------|
| Profile | `app/profile/page.tsx` | Uses PWAProfilePage |
| Edit Profile | `app/profile/edit/page.tsx` | "Personal Information" |
| Addresses | `app/profile/addresses/page.tsx` | "Addresses" |
| Add/Edit Address | `app/profile/addresses/add/page.tsx` | "Add/Edit Address" |
| Billing | `app/profile/billing/page.tsx` | "Payment & Billing" |
| Language | `app/profile/language/page.tsx` | "Language" |
| Promo/Notifications | `app/profile/promo/page.tsx` | "Announcements" |

## Mobile Web Detection Pattern

All pages use the same pattern for mobile web detection:

```typescript
const [isMobileWeb, setIsMobileWeb] = useState(false)

useEffect(() => {
  const checkMobile = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) && window.innerWidth < 768
    const isPWAMode = window.matchMedia('(display-mode: standalone)').matches || 
                      (window.navigator as Navigator & { standalone?: boolean }).standalone === true
    setIsMobileWeb(isMobile && !isPWAMode)
  }
  checkMobile()
  window.addEventListener('resize', checkMobile)
  return () => window.removeEventListener('resize', checkMobile)
}, [])

const isAppLikeMode = isPWA || isMobileWeb
```

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

### All Content Pages (Hamburger Menu)

| Removed Element | Reason |
|-----------------|--------|
| Breadcrumbs | Simple header provides back navigation |
| "Back to Home" link | Back button in header serves this purpose |

### Header Changes

| Removed from Header | Added to Footer |
|--------------------|-----------------|
| Cart/Bag icon | Bag tab with badge |

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
| "Back to Home" links | ✅ | ❌ | ❌ |

## Text Changes (Mobile vs Desktop)

| Element | Desktop | Mobile Web |
|---------|---------|------------|
| Add to Cart button | "Add to Cart" | "Add to Bag" |

## File Structure

```
components/
├── MobileWebHeader.tsx         # Mobile web header
├── MobileWebFooterNav.tsx      # Sticky footer navigation
├── PWAPageWrapper.tsx          # Reusable page wrapper (PWA + mobile web)
├── Header.tsx                  # Main header (hidden on mobile)
├── Footer.tsx                  # Desktop footer (hidden on mobile)
├── PWAHeader.tsx               # PWA-specific header
├── PWAProfilePage.tsx          # Profile page for PWA/mobile
├── ProductCard.tsx             # Updated for "Add to Bag" text
└── header/
    ├── HeaderMobileIcons.tsx   # Mobile header icons (AI link)
    ├── HeaderMobileMenu.tsx    # Hamburger menu content
    └── HeaderRussianMobile.tsx # Russian locale mobile header

app/
├── layout.tsx                  # Includes MobileWebHeader & Footer
├── globals.css                 # Mobile flex layout styles
├── products/
│   └── ProductsPageClient.tsx  # Home page (modified)
├── checkout/
│   └── CheckoutClient.tsx      # Simple header, no order summary duplicate
├── cart/
│   └── CartClient.tsx          # Simple header added
├── orders/
│   └── page.tsx                # Simple header added
├── favorites/
│   └── FavoritesClient.tsx     # Simple header, white background
├── success/
│   └── SuccessClient.tsx       # Simple header added
├── skin-recommendation/
│   └── SkinRecommendationClient.tsx  # Simple header added
├── privacy-policy/
│   └── PrivacyPolicyClient.tsx # Simple header added
├── profile/
│   ├── page.tsx                # Uses PWAProfilePage on mobile
│   ├── edit/page.tsx           # Built-in header with mobile web support
│   ├── addresses/page.tsx      # Built-in header with mobile web support
│   ├── addresses/add/page.tsx  # Built-in header with mobile web support
│   ├── billing/page.tsx        # Built-in header with mobile web support
│   ├── language/page.tsx       # Built-in header with mobile web support
│   └── promo/page.tsx          # Built-in header with mobile web support
├── about/
│   └── AboutPageClient.tsx     # Uses PWAPageWrapper
├── contact/
│   └── ContactClient.tsx       # Uses PWAPageWrapper
├── faq/
│   └── FAQClient.tsx           # Uses PWAPageWrapper
├── brand/
│   └── BrandPageClient.tsx     # Built-in header with mobile web support
├── delivery/
│   └── DeliveryPageClient.tsx  # Built-in header with mobile web support
├── training/
│   └── TrainingClient.tsx      # Built-in header with mobile web support
├── locations/
│   └── LocationsPageClient.tsx # Built-in header with mobile web support
├── blog/
│   ├── page.tsx                # Server component with schema
│   └── BlogPageClient.tsx      # Client component with mobile header
├── partners/
│   ├── page.tsx                # Server component with schema
│   └── PartnersPageClient.tsx  # Client component with mobile header
├── track/[orderNumber]/
│   └── OrderTrackingClient.tsx # Order tracking with mobile header
└── products/[id]/
    └── ProductPageClientRefactored.tsx  # Simple header, product name above image
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
- [x] Hamburger menu opens side nav
- [x] Language switcher works
- [x] AI link navigates to skin analysis
- [x] Logo links to home
- [x] Profile icon shows correct state (logged in/out)

### Footer
- [x] Home tab navigates correctly
- [x] Orders tab navigates correctly
- [x] Bag tab navigates correctly
- [x] Cart badge shows correct count
- [x] Active tab highlighted in red
- [x] Footer visible on checkout page

### Pages with Simple Headers
- [x] Products page shows search immediately (no breadcrumbs)
- [x] Checkout has back button and title
- [x] Cart has back button and title
- [x] Orders list has back button and title
- [x] Product detail has back button and product name
- [x] Product detail shows product name above image on mobile
- [x] Favorites has header and white background
- [x] Success page has header
- [x] AI Skin Recommendation has header
- [x] Privacy Policy has header
- [x] All profile subpages have headers

### Hamburger Menu Pages
- [x] About page has header, no breadcrumbs
- [x] Brand page has header, no breadcrumbs
- [x] Contact page has header, no breadcrumbs
- [x] Delivery page has header, no breadcrumbs
- [x] Training page has header, no breadcrumbs
- [x] FAQ page has header, no breadcrumbs
- [x] Blog page has header, no breadcrumbs
- [x] Locations page has header, no breadcrumbs
- [x] Partners page has header, no breadcrumbs

### Scroll Behavior
- [x] Footer stays at bottom when scrolling
- [x] No visual glitches in Chrome iOS
- [x] Content doesn't get hidden behind footer

### Text Changes
- [x] "Add to Bag" on mobile product cards
- [x] "Add to Bag" on product detail page
- [x] "Add to Cart" preserved on desktop

## Internationalization

All mobile headers support three languages:
- English (en)
- Arabic (ar) - RTL layout
- Russian (ru)

Translation keys used:
- `navigation.aiSkinAnalysis` - AI Skin Analysis link in hamburger menu
- `common.home`, `common.products`, `common.profile`, etc.

## Maintenance Notes

1. **Always test on Chrome iOS** - Most challenging browser for mobile layouts
2. **Use `100dvh`** instead of `100vh` for dynamic viewport support
3. **Keep `isAppLikeMode`** pattern consistent across pages
4. **Don't mix fixed/sticky** positioning for bottom navigation
5. **RTL support** - Verify layout mirrors correctly in Arabic
6. **New pages** - Use `isMobileWeb` detection pattern or `PWAPageWrapper`
7. **Copyright years** - Use dynamic year: `new Date().getFullYear()`

## Related Documentation

- `docs/MOBILE_FOOTER_IMPLEMENTATION.md` - Detailed sticky footer implementation
- `docs/PWA_IMPLEMENTATION.md` - PWA-specific features

---

*Last updated: January 14, 2026*
