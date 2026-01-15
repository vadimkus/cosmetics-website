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
