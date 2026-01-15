# Mobile Login Screen - Clean Full-Screen Design

## Overview

The login page on the cosmetics website now displays a clean, full-screen design on mobile devices (screen width < 768px). This removes navigation, header, and footer elements to provide a focused, app-like login experience.

## Implementation Date
January 15, 2026

## Files Modified

### 1. `app/login/LoginClient.tsx`
- Added mobile detection using `useIsMobile` hook
- Added conditional rendering for mobile vs desktop views
- Mobile view features:
  - No header/footer/navigation
  - Language selector at top left (EN/RU/AR dropdown)
  - Centered GENOSYS logo with UAE branding
  - Toggle-style Google/Apple social login buttons
  - Email/Password form with labels
  - Privacy policy checkbox (required before login)
  - Sign In button (disabled until privacy consent)
  - Forgot Password link
  - Sign Up toggle

### 2. `hooks/useIsMobile.ts` (New File)
- Custom React hook for responsive mobile detection
- Uses `window.innerWidth` with configurable breakpoint (default: 768px)
- Handles SSR by returning `isClient` flag
- Listens to window resize events

## Design Specifications

### Mobile Layout (< 768px)
```
┌─────────────────────────────┐
│ EN ▼                        │  ← Language selector
│                             │
│      [GENOSYS LOGO]         │  ← Centered logo
│   🇦🇪 United Arab Emirates ❤️ │  ← UAE branding
│                             │
│  ┌─────────┐ ┌─────────┐   │
│  │ G Google│ │  Apple  │   │  ← Social login buttons
│  └─────────┘ └─────────┘   │
│                             │
│         ─── or ───          │  ← Divider
│                             │
│  Email                      │
│  ┌─────────────────────┐   │
│  │ Enter your email    │   │  ← Email input
│  └─────────────────────┘   │
│                             │
│  Password                   │
│  ┌─────────────────────┐   │
│  │ Enter your password 👁│   │  ← Password input with toggle
│  └─────────────────────┘   │
│                             │
│  ☐ I agree to Privacy Policy│  ← Required checkbox
│                             │
│  ┌─────────────────────┐   │
│  │      Sign In        │   │  ← Submit button (gray if unchecked)
│  └─────────────────────┘   │
│                             │
│     Forgot Password?        │  ← Link
│                             │
│  Don't have an account?     │
│         Sign Up             │  ← Toggle to registration
└─────────────────────────────┘
```

### Desktop Layout (≥ 768px)
Desktop users see the original login page with:
- Navigation breadcrumb
- Back to Home link
- Full form card with shadow
- Header and footer visible

## Color Scheme

| Element | Color |
|---------|-------|
| Language selector text | `#16A34A` (green) |
| Primary buttons | `#dc2626` (red) |
| Disabled button | `#F3F4F6` (gray) |
| Google button | White with border |
| Apple button | `#6B7280` (gray) |
| Input borders | `#E5E7EB` |
| Privacy link | `#dc2626` (red) |
| Error messages | Red with `#FEF2F2` background |

## Behavior

### Privacy Consent
- User must check the privacy policy checkbox before:
  - Clicking Google login
  - Clicking Apple login
  - Submitting email/password form
- Sign In button appears gray/disabled until checked
- Error message shown if attempting login without consent

### Language Switching
- Dropdown with English, Русский, العربية options
- Redirects to localized login path (`/login`, `/ru/login`, `/ar/login`)
- RTL support for Arabic layout

### Form Validation
- Email field required
- Password field required
- Name field required (registration mode only)
- Shows error messages for invalid inputs

## RTL Support

The mobile login screen fully supports RTL (Right-to-Left) layout for Arabic:
- Language selector moves to top right
- Social buttons reverse order
- Form labels align right
- Input text aligns right
- Toggle text reverses

## Related Files

- `app/pwa-login/page.tsx` - Separate PWA-specific login (redirects PWA users)
- `hooks/usePWAMode.ts` - PWA detection hook
- `hooks/useIsMobile.ts` - Mobile detection hook
- `lib/i18n.ts` - Localization utilities including `getLocalizedPath`
- `components/MobileWebHeader.tsx` - Mobile web header (hidden on login)
- `components/MobileWebFooterNav.tsx` - Mobile footer nav (hidden on login)

## Header/Footer Hiding Logic

The mobile header and footer are hidden on auth-related pages to provide a clean, full-screen experience:

### MobileWebHeader.tsx
Hides on these paths:
- `/login`, `/ru/login`, `/ar/login`
- `/signup`
- `/forgot-password`
- `/reset-password`
- `/pwa-login`
- And various other pages with custom headers

### MobileWebFooterNav.tsx
Hides on these paths:
- `/login` (all locales)
- `/signup`
- `/forgot-password`
- `/reset-password`
- `/pwa-login`
- Product detail pages
- PDF viewer

## Testing

To test the mobile design:
1. Open browser DevTools
2. Toggle device toolbar (mobile view)
3. Set width below 768px
4. Navigate to `/login`

Or access from a mobile device directly.

## Commits

1. `f785c9e5` - Add clean full-screen login design for mobile web users
2. `f950cc87` - Fix TypeScript error: use correct locale type for handleLanguageChange
3. `3aaac467` - Add documentation for mobile login screen design
4. `3f88da15` - Improve payment cancelled page for mobile
5. `7ac096f9` - Update documentation with payment cancelled page changes
6. `f0ff9d03` - Hide mobile header and footer on login/auth pages
7. `8318e25b` - Document header/footer hiding logic for auth pages
8. `ec1507e6` - Hide mobile footer nav on skin-recommendation page
9. `1c1c2887` - Add Blog to mobile menu and full-screen blog experience
10. `07196370` - Remove duplicate heart icon from mobile login page
11. `b99757e3` - Document all mobile full-screen experience updates
12. `781789b8` - Fix profile icon to show grey when logged out (7 files)
13. `44516065` - Hide 'Back to Home' on mobile payment cancelled page

---

# Payment Cancelled Page - Mobile Improvements

## Overview

The payment cancelled page (`/checkout/cancelled`) now has a clean mobile design with proper header navigation.

## Changes Made

### File: `app/checkout/cancelled/CheckoutCancelledClient.tsx`

1. **Mobile Header Added**
   - Back button linking to Cart
   - Page title "Payment Cancelled"
   - Profile icon with green online indicator
   - Sticky header with border

2. **Removed Duplicates**
   - Removed duplicate "Contact Support" text link
   - Consolidated WhatsApp support into single button

3. **Improved Layout**
   - Responsive icon and text sizes for mobile
   - Rounded buttons with proper padding
   - Clean WhatsApp button with icon

## Mobile Layout

```
┌─────────────────────────────────┐
│ ← Cart    Payment Cancelled  👤 │  ← Sticky header
├─────────────────────────────────┤
│                                 │
│            ⊗                    │  ← Red X icon
│     Payment Cancelled           │
│  No charges were made...        │
│                                 │
│  ┌─────────────────────────┐   │
│  │     What happened?       │   │
│  │  • You chose to cancel   │   │
│  │  • Items still saved     │   │
│  │  • No charges made       │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Alternative Options      │   │
│  │ 💳 Try different card    │   │
│  │ 🚚 Cash on Delivery      │   │
│  │ 💬 Contact support       │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │    🛒 Review Cart        │   │  ← Red button
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │  ← Try Checkout Again    │   │  ← Green button
│  └─────────────────────────┘   │
│                                 │
│      Continue Shopping          │
│        🏠 Back to Home          │
│                                 │
│  ┌─────────────────────────┐   │
│  │    Need Help?            │   │
│  │  [📱 WhatsApp Support]   │   │  ← Green pill button
│  └─────────────────────────┘   │
└─────────────────────────────────┘
```

## Features

- **RTL Support**: Full Arabic layout support
- **Localized Messages**: WhatsApp messages in EN/AR/RU
- **Responsive**: Different sizes for mobile vs desktop
- **No Footer Nav**: Navigation is in header on mobile

---

# Skin Analysis Page - Mobile Full-Screen Experience

## Overview

The AI Skin Analysis page (`/skin-recommendation`) now displays as a clean full-screen experience on mobile without the footer navigation.

## Changes Made

### File: `components/MobileWebFooterNav.tsx`
- Added `/skin-recommendation` to the `shouldHide` paths
- Footer nav (Home, Orders, Bag) is hidden on this page

## Result
The page has its own dedicated header and full-screen questionnaire experience without bottom navigation interference.

---

# Blog Pages - Mobile Full-Screen Experience

## Overview

Blog pages now have a clean, app-like experience on mobile with dedicated headers and no footer navigation.

## Changes Made

### 1. `components/MobileWebHeader.tsx`
- Added Blog link to hamburger menu (between Locations and AI Skin Analysis)
- Added `/blog` to pages that hide the default header (blog has its own)

### 2. `components/MobileWebFooterNav.tsx`
- Added `/blog` to `shouldHide` paths
- Footer nav hidden on all blog pages

### 3. `app/blog/BlogPageClient.tsx` (Existing)
- Already had mobile header implementation with:
  - "< Products" back button
  - "Blog" title
  - Profile icon with green online indicator

### 4. `app/blog/[slug]/BlogPostClient.tsx` (New File)
- Client wrapper component for individual blog posts
- Adds mobile header with:
  - "< Blog" back button (returns to blog list)
  - "Article" title
  - Profile icon with green online indicator
- Detects mobile web vs PWA vs desktop
- Full RTL support

### 5. `app/blog/[slug]/page.tsx`
- Wrapped content with `BlogPostClient` component

## Blog Mobile Layout

### Blog List (`/blog`)
```
┌─────────────────────────────────┐
│ ← Products     Blog          👤 │  ← Mobile header
├─────────────────────────────────┤
│                                 │
│        GENOSYS Blog             │
│    Expert insights on...        │
│                                 │
│  ┌─────────────────────────┐   │
│  │ [Image]                  │   │
│  │ Article Title            │   │
│  │ Excerpt text...          │   │
│  │ 👤 Author  📅 Date       │   │
│  │ Read More →              │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ [Image]                  │   │
│  │ Another Article...       │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

### Blog Post (`/blog/[slug]`)
```
┌─────────────────────────────────┐
│ ← Blog       Article         👤 │  ← Mobile header
├─────────────────────────────────┤
│                                 │
│  Home / Blog / Article Title    │
│                                 │
│  [Featured Image]               │
│                                 │
│  Article Title                  │
│  👤 Author  📅 Date  👁 Views   │
│                                 │
│  Article content here...        │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  Comments (3)                   │
│  ...                            │
│                                 │
└─────────────────────────────────┘
```

## Hamburger Menu Update

Blog link added to mobile navigation menu:

```
┌─────────────────────────────────┐
│  Products          Orders       │
│  Favorites         Profile      │
│  ───────────────────────────── │
│  Home              About        │
│  Brand             Delivery     │
│  Contact           FAQ          │
│  Locations         Blog    ← NEW│
│  AI Skin Analysis (red)         │
│  ───────────────────────────── │
│  Login / Logout                 │
└─────────────────────────────────┘
```

---

# Mobile Login - Heart Icon Fix

## Issue
The mobile login page displayed two heart icons next to "United Arab Emirates":
1. Heart emoji (❤️) from translation text
2. Heart icon component from code

## Fix
Removed the duplicate `<Heart>` component from `app/login/LoginClient.tsx`.

### Before
```jsx
<span className="text-gray-600 text-sm">{t('login.unitedArabEmirates')}</span>
<Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
```

### After
```jsx
<span className="text-gray-600 text-sm">{t('login.unitedArabEmirates')}</span>
```

The translation already contains the heart emoji, so only one heart is now displayed.

---

# Summary of All Pages with Full-Screen Mobile Experience

| Page | Header | Footer Hidden | Notes |
|------|--------|---------------|-------|
| `/login` | Clean (no header) | Yes | Language selector, logo, form only |
| `/signup` | Clean (no header) | Yes | Same as login |
| `/forgot-password` | Clean (no header) | Yes | Same as login |
| `/reset-password` | Clean (no header) | Yes | Same as login |
| `/pwa-login` | Clean (no header) | Yes | PWA-specific login |
| `/skin-recommendation` | Custom header | Yes | AI Skin Analysis page |
| `/blog` | Custom header | Yes | Blog list page |
| `/blog/[slug]` | Custom header | Yes | Individual blog posts |
| `/checkout/cancelled` | Custom header | Yes | Payment cancelled page |
| `/products/[slug]` | Custom header | Yes | Product detail pages |
| `/pdf-viewer` | N/A | Yes | PDF viewer |
| `/profile` | Custom header | No | Profile page |
| `/cart` | Custom header | No | Cart page |
| `/orders` | Custom header | No | Orders page |
| `/favorites` | Custom header | No | Favorites page |

## Files Modified Summary

| File | Changes |
|------|---------|
| `components/MobileWebHeader.tsx` | Added Blog link, hide on blog/auth pages |
| `components/MobileWebFooterNav.tsx` | Hide on login, auth, blog, skin-recommendation pages |
| `app/login/LoginClient.tsx` | Clean mobile design, removed duplicate heart |
| `app/blog/[slug]/BlogPostClient.tsx` | New mobile header wrapper |
| `app/blog/[slug]/page.tsx` | Wrapped with BlogPostClient |
| `app/checkout/cancelled/CheckoutCancelledClient.tsx` | Mobile header, consolidated support |
| `hooks/useIsMobile.ts` | Mobile detection hook |
