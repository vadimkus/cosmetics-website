# GENOSYS Cosmetics Website - Project Guide

## Overview

This is the official e-commerce website for **GENOSYS Middle East FZ-LLC**, a distributor of professional Korean dermacosmetics in the UAE. The website serves both as a desktop web application and a mobile-first Progressive Web App (PWA).

**Live URL:** https://genosys.ae

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling |
| **Prisma** | Database ORM |
| **PostgreSQL** | Database (via Neon) |
| **Vercel** | Hosting & deployment |
| **PWA** | Progressive Web App capabilities |

## Project Structure

```
cosmetics-website/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── blog/              # Blog pages
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout flow
│   ├── login/             # Authentication
│   ├── orders/            # Order history
│   ├── products/          # Product catalog
│   ├── profile/           # User profile
│   ├── skin-recommendation/ # AI Skin Analysis
│   ├── ar/                # Arabic locale routes
│   └── ru/                # Russian locale routes
├── components/            # Reusable React components
│   ├── ar/               # AR/3D components (TensorFlow, Three.js)
│   └── ...               # Other components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── messages/              # i18n translation files (en.json, ar.json, ru.json)
├── prisma/                # Database schema
├── public/                # Static assets
├── scripts/               # Build & maintenance scripts
└── docs/                  # Documentation
```

---

## Critical Concepts

### 1. Three Display Modes

The website operates in THREE different modes. **Always consider all three when making UI changes:**

| Mode | Detection | Header | Footer |
|------|-----------|--------|--------|
| **Desktop Web** | `window.innerWidth >= 768` | Full `Header` component | Full `Footer` component |
| **Mobile Web** | `window.innerWidth < 768 && !isPWA` | `MobileWebHeader` | `MobileWebFooterNav` |
| **PWA (Installed App)** | `display-mode: standalone` | `PWAHeader` | `MobileFooterNav` |

**Key files:**
- `components/Header.tsx` - Desktop header
- `components/MobileWebHeader.tsx` - Mobile web header (hamburger menu)
- `components/MobileWebFooterNav.tsx` - Mobile web bottom nav (Home, Orders, Bag)
- `components/PWAHeader.tsx` - PWA header
- `components/MobileFooterNav.tsx` - PWA bottom nav

### 2. Localization (i18n)

The site supports **three languages**:
- English (default): `/products`, `/cart`, etc.
- Arabic (RTL): `/ar/products`, `/ar/cart`, etc.
- Russian: `/ru/products`, `/ru/cart`, etc.

**Key files:**
- `messages/en.json`, `messages/ar.json`, `messages/ru.json` - Translation strings
- `lib/i18n.ts` - `getLocalizedPath()`, `getLocaleFromPath()` utilities
- `hooks/useTranslation.ts` - Translation hook

**RTL Support:**
- Arabic uses Right-to-Left layout
- Always use `isRTL` or `dir === 'rtl'` checks
- Use `flex-row-reverse` for RTL layouts
- Check `useTranslation()` hook for `dir` value

### 3. Authentication State

**Key pattern for profile icons:**

```tsx
const { user } = useAuth()

// Profile icon styling
<div className={`w-8 h-8 rounded-full flex items-center justify-center ${user ? 'bg-red-600' : 'bg-gray-400'}`}>
  <span className="text-sm font-semibold text-white">
    {user?.name?.charAt(0)?.toUpperCase() || 'G'}
  </span>
</div>

// Green online dot - ONLY when logged in
{user && (
  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
)}
```

**Rules:**
- Grey icon (`bg-gray-400`) when logged out
- Red icon (`bg-red-600`) when logged in
- Green dot ONLY when logged in
- Default initial is "G" (for GENOSYS) when logged out

---

## Mobile-Specific Patterns

### Pages with Custom Mobile Headers

Many pages have their own mobile headers instead of using `MobileWebHeader`. These pages:
1. Hide `MobileWebHeader` via the `isOnSimpleHeaderPage` check
2. Implement their own header with: Back button, Title, Profile icon

**Pattern:**

```tsx
const { isPWA } = usePWAMode()
const [isMobileWeb, setIsMobileWeb] = useState(false)

useEffect(() => {
  const checkMobile = () => {
    const isMobile = window.innerWidth < 768
    const isPWAMode = window.matchMedia('(display-mode: standalone)').matches
    setIsMobileWeb(isMobile && !isPWAMode)
  }
  checkMobile()
  window.addEventListener('resize', checkMobile)
  return () => window.removeEventListener('resize', checkMobile)
}, [])

const isAppLikeMode = isPWA || isMobileWeb

// Then in JSX:
{isAppLikeMode && (
  <div className="flex items-center justify-between px-5 py-4 bg-white border-b">
    {/* Back button */}
    <button onClick={() => router.push(...)}>
      <ChevronLeft /> Back
    </button>
    
    {/* Title */}
    <span className="font-semibold">Page Title</span>
    
    {/* Profile icon */}
    <button onClick={() => router.push('/profile')}>
      {/* Profile icon with conditional green dot */}
    </button>
  </div>
)}
```

### Pages with Hidden Footer Nav

The `MobileWebFooterNav` hides on certain pages. Check `shouldHide` in:
`components/MobileWebFooterNav.tsx`

Currently hidden on:
- `/login` and auth pages
- `/blog` pages
- `/skin-recommendation`
- `/pwa-login`
- `/pdf-viewer`
- Product detail pages (`/products/[id]`)

### Pages with Hidden Header

The `MobileWebHeader` hides on pages listed in `isOnSimpleHeaderPage`:
`components/MobileWebHeader.tsx`

---

## Key Hooks

| Hook | Purpose | File |
|------|---------|------|
| `useAuth()` | Authentication state, user info, login/logout | `components/AuthProvider.tsx` |
| `useTranslation()` | Get `t()` function, `locale`, `dir` | `hooks/useTranslation.ts` |
| `usePWAMode()` | Detect if running as installed PWA | `hooks/usePWAMode.ts` |
| `useIsMobile()` | Detect mobile viewport (<768px) | `hooks/useIsMobile.ts` |
| `useCartStore()` | Zustand cart state | `lib/cartStore.ts` |
| `useFavorites()` | Favorites/wishlist state | `components/FavoritesProvider.tsx` |

### Cart Store Subscription Pattern

The cart uses Zustand with persist middleware. **Important:** For reactive updates (like badge counts), subscribe to the store:

```tsx
const [cartCount, setCartCount] = useState(0)

useEffect(() => {
  // Function to update cart count
  const updateCount = () => {
    const state = useCartStore.getState()
    const newCount = state.items.reduce((total, item) => total + item.quantity, 0)
    setCartCount(newCount)
  }
  
  // Initial count
  updateCount()
  
  // Subscribe to store changes (handles both hydration and updates)
  const unsubscribe = useCartStore.subscribe(updateCount)
  
  // Also check after short delay for localStorage hydration
  const timer = setTimeout(updateCount, 100)
  
  return () => {
    unsubscribe()
    clearTimeout(timer)
  }
}, [])
```

**Why this pattern?**
- Zustand persist loads from localStorage asynchronously
- `getTotalItems()` may return 0 on initial render before hydration
- Subscription ensures updates trigger re-renders

---

## AR Components

### Overview

AR features are located in `components/ar/`:

| Component | Description | Status |
|-----------|-------------|--------|
| `ARSkinAnalysisCamera` | Real-time skin analysis with face overlays | ✅ Active |
| `Product3DViewer` | 3D product visualization | 🔜 Stage 2 |

### ARSkinAnalysisCamera

Live skin analysis using TensorFlow.js and camera feed.

**Features:**
- Real-time face zone detection
- Live metrics (oiliness, hydration, redness)
- Stability detection for accurate readings
- Lighting quality indicator

**Usage in Skin Recommendation:**

```tsx
import { ARSkinAnalysisCamera } from '@/components/ar'

// Toggle between modes
const [analysisMode, setAnalysisMode] = useState<'photo' | 'live'>('photo')
const [showARCamera, setShowARCamera] = useState(false)

// Render
{showARCamera && (
  <ARSkinAnalysisCamera
    onAnalysisComplete={handleAnalysisComplete}
    onClose={() => setShowARCamera(false)}
  />
)}
```

### Product3DViewer (Stage 2)

Foundation for Three.js 3D product visualization.

**Current (Preview):**
- CSS 3D transforms on product images
- Drag-to-rotate, zoom controls
- WebXR AR detection

**Planned (Stage 2):**
- GLTF/GLB 3D model loading
- Full Three.js rendering
- WebXR AR product placement

### AR Dependencies

```json
{
  "@tensorflow/tfjs": "ML framework",
  "@mediapipe/face_mesh": "Face detection",
  "three": "3D rendering (Stage 2)",
  "@types/three": "TypeScript types"
}
```

**Documentation:** See `docs/AR_SKIN_ANALYSIS_ENHANCEMENT.md` for detailed implementation notes.

---

## Common Patterns

### Localized Navigation

```tsx
import { getLocalizedPath } from '@/lib/i18n'
import { useTranslation } from '@/hooks/useTranslation'

const { locale } = useTranslation()

// Navigate to localized path
router.push(getLocalizedPath('/products', locale))

// Link component
<Link href={getLocalizedPath('/cart', locale)}>Cart</Link>
```

### Responsive Classes

```tsx
// Mobile-first approach
className="text-sm md:text-base lg:text-lg"
className="px-4 md:px-6 lg:px-8"
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

// Hide on mobile, show on desktop
className="hidden md:block"

// Show on mobile, hide on desktop
className="md:hidden"
```

### RTL Support

```tsx
const { dir } = useTranslation()
const isRTL = dir === 'rtl'

// Flex direction
className={`flex ${isRTL ? 'flex-row-reverse' : ''}`}

// Text alignment
className={isRTL ? 'text-right' : 'text-left'}

// Icon rotation (for arrows)
className={`${isRTL ? 'rotate-180' : ''}`}

// Margin/padding
className={`${isRTL ? 'mr-2' : 'ml-2'}`}
```

---

## Testing Checklist

When making UI changes, always test:

- [ ] Desktop view (≥768px)
- [ ] Mobile web view (<768px, in browser)
- [ ] PWA mode (if applicable)
- [ ] English locale
- [ ] Arabic locale (RTL)
- [ ] Russian locale
- [ ] Logged in state
- [ ] Logged out state

---

## Build & Deployment

### Local Development
```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # Run linter
```

### Deployment
- Automatic deployment via Vercel on push to `main`
- Build must pass before deployment

### Common Build Issues

1. **TypeScript errors**: Check type annotations, especially for locale types (`'en' | 'ar' | 'ru'`)
2. **Missing translations**: Ensure all three locale files have the same keys
3. **Prisma issues**: Run `npx prisma generate` if schema changed

---

## Important Files Reference

| File | Description |
|------|-------------|
| `app/layout.tsx` | Root layout with providers |
| `components/MobileWebHeader.tsx` | Mobile hamburger menu header |
| `components/MobileWebFooterNav.tsx` | Mobile bottom navigation (with cart badge) |
| `components/MobileFooterNav.tsx` | PWA bottom navigation (with cart badge) |
| `app/login/LoginClient.tsx` | Login page with mobile-specific design |
| `hooks/useTranslation.ts` | Translation hook |
| `lib/i18n.ts` | Localization utilities |
| `lib/cartStore.ts` | Zustand cart store with persist |
| `messages/*.json` | Translation strings |
| `components/ar/ARSkinAnalysisCamera.tsx` | Live AR skin analysis |
| `components/ar/Product3DViewer.tsx` | 3D product viewer (Stage 2) |
| `components/SkinAnalysisCamera.tsx` | Photo-based skin analysis |
| `app/skin-recommendation/SkinRecommendationClient.tsx` | Skin analysis page |
| `docs/AR_SKIN_ANALYSIS_ENHANCEMENT.md` | AR feature documentation |

---

## Recent Changes Log

### January 15, 2026 (Session 2)

1. **AR-Enhanced Skin Analysis**
   - Added Live AR analysis mode with real-time face tracking
   - Photo/Live AR toggle in skin recommendation page
   - Face zone overlays (forehead, nose, cheeks, chin)
   - Live metrics: oiliness, hydration, redness
   - Stability detection for accurate readings
   - Files: `components/ar/ARSkinAnalysisCamera.tsx`, `app/skin-recommendation/SkinRecommendationClient.tsx`

2. **3D Product Viewer Foundation (Stage 2)**
   - Prepared Three.js infrastructure for 3D product visualization
   - CSS 3D transforms as current preview
   - WebXR AR detection for compatible devices
   - Files: `components/ar/Product3DViewer.tsx`, `components/ar/index.ts`

3. **Mobile Cart Badge Fix**
   - Fixed bag icon not showing item count on mobile
   - Improved Zustand persist hydration handling
   - Added store subscription for reactive updates
   - Files: `components/MobileWebFooterNav.tsx`, `components/MobileFooterNav.tsx`

### January 15, 2026 (Session 1)

1. **Clean Mobile Login Screen**
   - Full-screen login without header/footer on mobile
   - Language selector, social login, email/password form
   - Files: `app/login/LoginClient.tsx`, `hooks/useIsMobile.ts`

2. **Blog Mobile Experience**
   - Added Blog to hamburger menu
   - Custom mobile headers for blog list and posts
   - Hidden footer nav on blog pages
   - Files: `components/MobileWebHeader.tsx`, `app/blog/[slug]/BlogPostClient.tsx`

3. **Profile Icon Fix**
   - Grey background when logged out
   - Green dot only when logged in
   - Fixed in 7+ files across the app

4. **Payment Cancelled Page**
   - Mobile header with navigation
   - Removed redundant elements
   - Hidden "Back to Home" on mobile

5. **Skin Analysis Page**
   - Hidden footer for full-screen experience

---

## Contact & Resources

- **Repository**: GitHub (private)
- **Hosting**: Vercel
- **Database**: Neon PostgreSQL
- **Domain**: genosys.ae

---

## Quick Checklist for New Changes

Before submitting any UI change:

1. ✅ Does it work on desktop?
2. ✅ Does it work on mobile web?
3. ✅ Does it work in PWA mode (if applicable)?
4. ✅ Does it support RTL (Arabic)?
5. ✅ Does it handle logged-in vs logged-out states?
6. ✅ Are translations added for all 3 locales?
7. ✅ Does the build pass (`npm run build`)?
8. ✅ No linter errors?
