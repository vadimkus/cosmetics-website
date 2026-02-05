# Bundle Builder Feature

## Overview

The Bundle Builder is a professional tool that allows customers to create personalized skincare routines by selecting products from different categories. Customers receive tiered discounts based on the number of products they add to their bundle.

## Access Points

1. **Standalone Page**: `/bundle-builder` (also `/ar/bundle-builder` and `/ru/bundle-builder`)
2. **Beauty Boxes Category**: A "Build Your Own Set" banner appears when viewing the Beauty Boxes category on the products page

## Features

### Routine Steps

Products are organized by skincare routine steps:

| Step | Emoji | Category | Required |
|------|-------|----------|----------|
| Cleanser | 🧴 | Cleanser | ✅ Yes |
| Peeling | ✨ | Peeling | Optional |
| Toner/Mist | 💧 | Toner/Mist | Optional |
| Serum | 💎 | Serum | ✅ Yes |
| Cream | 🤍 | Cream | ✅ Yes |
| Eye Care | 👁️ | Eye care | Optional |
| Mask | 🧖 | Mask | Optional |
| Sun Protection | ☀️ | Sun | Optional |

### Multiple Product Selection

Users can select **multiple products from the same category/step**. The selection works as a toggle:
- Click to add a product
- Click again to remove it
- Step indicator shows count when multiple items selected (e.g., "✓ 2")

### Discount Tiers

| Items | Discount |
|-------|----------|
| 2 products | 5% off |
| 3 products | 10% off |
| 4 products | 15% off |
| 5+ products | 20% off |

### Product Exclusions

The following products are **excluded** from the Bundle Builder:

1. **Beauty Boxes** - They are bundles themselves
2. **PRO Solution category** - Professional products only
3. **Price on Request products** - Professional products (`isPriceOnRequest: true`)
4. **"SKIN RENEWAL PEELING SYSTEM"** - Professional product explicitly excluded
5. **Hidden products** - Not visible to customers
6. **Out of stock products** - Currently unavailable

### Price Visibility (Authentication Required)

Prices are **hidden for non-logged-in users**:

| Element | Logged In | Not Logged In |
|---------|-----------|---------------|
| Product card price | Shows price | "Login to see price" |
| Bundle summary prices | Full pricing breakdown | Item count only |
| Mobile bottom bar | Shows total | "Login to see price" |
| Add to Cart button | Enabled (if ≥2 items) | Hidden |

This follows the same pattern as the rest of the website where prices require authentication.

### UI/UX Design

- **Apple-like design**: Clean, minimal, professional appearance
- **Corporate branding**: Uses website's primary red color palette for the banner
- **Not advertisement-like**: Focused on being a useful tool
- **Mobile-first**: Fully responsive with bottom sheet for bundle summary on mobile
- **Progressive disclosure**: Step-by-step guidance through routine categories
- **Real-time pricing**: Dynamic discount calculation as products are added (for logged-in users)
- **Sticky step indicator**: Stays visible when scrolling through products

## Technical Implementation

### Files Created

```
lib/bundleStore.ts                          # Zustand store for bundle state
app/bundle-builder/page.tsx                 # Server component (data fetching)
app/bundle-builder/BundleBuilderClient.tsx  # Client component (UI)
app/ar/bundle-builder/page.tsx              # Arabic version
app/ru/bundle-builder/page.tsx              # Russian version
components/products/BuildYourSetBanner.tsx  # Entry point banner
```

### Store API (bundleStore.ts)

```typescript
interface BundleState {
  items: BundleItem[]
  currentStep: number
  isOpen: boolean
  
  // Actions
  addItem: (product: Product, step: string) => void  // Toggle behavior: adds or removes
  removeItem: (productId: string) => void
  clearBundle: () => void
  setCurrentStep: (step: number) => void
  
  // Computed
  getPricing: () => BundlePricing
  getItemForStep: (stepId: string) => BundleItem | undefined
  getItemsForStep: (stepId: string) => BundleItem[]  // Returns all items for a step
  getItemCountForStep: (stepId: string) => number    // Returns count for a step
  hasItemForStep: (stepId: string) => boolean
  canAddToCart: () => boolean
}
```

### Authentication Integration

The `BundleBuilderClient` component integrates with authentication:

```typescript
import { useAuth } from '@/components/AuthProvider'
import { canUserSeePrices } from '@/lib/discountUtils'

// In component:
const { user } = useAuth()
const showPrices = canUserSeePrices(user)

// Pass to child components:
<BundleProductCard showPrices={showPrices} />
<BundleSummary showPrices={showPrices} />
```

### Translations

Added to all three language files (`messages/en.json`, `messages/ar.json`, `messages/ru.json`):

- `bundleBuilder.title`
- `bundleBuilder.steps.*` (for each routine step)
- `bundleBuilder.stepDescriptions.*`
- `bundleBuilder.discountTiers.*`
- `bundleBuilder.selected` (for item count display)
- Plus ~30 other keys for UI elements

## Integration

### Products Page Integration

The `BuildYourSetBanner` component is conditionally rendered in `ProductsPageClient.tsx` when the `beauty-boxes` category filter is active:

```tsx
{filters.categories.includes('beauty-boxes') && (
  <div className="mb-6">
    <BuildYourSetBanner />
  </div>
)}
```

### Cart Integration

When a bundle is added to cart, each product is added individually. The bundle discount logic should be applied at checkout (similar to how beauty box discounts work).

## Mobile Responsiveness

- **Desktop**: Side-by-side layout with sticky summary sidebar
- **Mobile**: Full-width product grid with floating bottom bar and slide-up summary sheet
- **Touch targets**: Minimum 44px for all interactive elements
- **Safe area insets**: Properly handled for iOS devices

## Future Enhancements

1. **AI Recommendations**: Suggest products based on skin type or previous purchases
2. **Save Bundles**: Allow users to save and share their bundles
3. **Bundle Templates**: Pre-built routine suggestions users can start from
4. **Skin Analysis Integration**: Connect to existing skin analysis feature for personalized recommendations

---

## Navigation Access

### Hamburger Menu (Mobile Web)

Bundle Builder is accessible from the mobile web hamburger menu:
- Location: After "Products" link
- Style: Highlighted in corporate red with 🎁 emoji
- Text: "🎁 Build Your Set"

**Files**:
- `components/MobileWebHeader.tsx` - Mobile web hamburger menu
- `components/header/HeaderMobileMenu.tsx` - Standard mobile menu

---

## Checkout Flow

### After Adding Bundle to Cart

When user clicks "Add Bundle to Cart":
1. All bundle items are added to cart individually
2. Bundle is cleared from the builder
3. User is **automatically redirected to checkout page**

This ensures a smooth purchase flow without requiring additional navigation.

---

## Changelog

### February 5, 2026

**Bundle Discount Progress Bar**
- Added horizontal progress bar below step indicator
- Green gradient fill showing progress toward max discount
- Milestone markers at 2, 3, 4, 5 items (dots turn green when reached)
- Labels: `0` - `2=5%` - `3=10%` - `4=15%` - `5=20%`
- Status badge showing current items count and discount percentage
- Animated fill with smooth transitions
- Works on both mobile and desktop

**Detailed Discount Breakdown (Your Bundle Summary)**
- Show retail price (original) when user has personal discount
- Show user's personal discount separately (purple text)
- Show bundle discount (green text) applied on top
- Show total savings including both discounts
- Mobile footer now shows "You save X AED" hint
- Translations added for EN, RU, AR (`retailPrice`, `yourDiscount`)

**Example breakdown for user with 50% discount + 5% bundle:**
```
Retail Price:          620.00 AED (struck through)
Your Discount:        -310.00 AED (purple)
Subtotal:              310.00 AED
Bundle Discount (5%):  -15.50 AED (green)
─────────────────────────────────
Total:                 294.50 AED
5% VAT included

       You save 325.50 AED
```

**Product Detail Bottom Sheet (Mobile)**
- Single tap on product card opens detail sheet with:
  - Centered product image (max 200px)
  - Product size below image
  - Full product name
  - Bundle discount badge (shows % that will apply when added)
  - "when added" hint for items not yet in bundle
  - Full localized description (EN/RU/AR)
  - Price with discounts
  - "Add to Set" / "Added to Set" button
  - "Continue Browsing" link
- Double-tap for quick add/remove (power users)
- "Double-tap to quick add" hint shown on first mobile visit
- Translations added: `addToSet`, `addedToSet`, `continueBrowsing`, `doubleTapHint`

**Bottom Sheet Swipe-Down Gesture**
- Reduced swipe threshold from 100px to 50px
- Added velocity detection: fast swipe closes with just 20px drag
- Made drag handle larger (wider bar, more padding)
- Smoother, more responsive dismissal

**UI Improvements**
- Centered "Build Your Set" title in header (absolute positioning)
- Centered "+ Add" button on product cards
- Added "5%" to "VAT included" text
- Removed duplicate "X items Y% OFF" from header (kept in progress bar only)
- Product size moved under image in bundle summary items
- Bundle discount badge (-X%) shown per item in summary

**Mobile Bag Icon**
- Reduced digit size for item count badge (was too large)
- Styling: `text-[10px]` with `min-w-[16px] h-4`

**Chatbot**
- Hidden on `/bundle-builder` page on mobile web (cleaner UX)

**Desktop Product Detail Modal**
- Single click on product card now opens detail modal on desktop (same as mobile bottom sheet)
- Modal features: centered image (250×250px), full description, bundle discount preview, add button
- Animated entrance/exit with backdrop blur
- Click outside or X button to close

**Smart Click Behavior**
- Single click on **unselected** item: opens detail view (learn about product)
- Single click on **selected** item: deselects it (removes tick)
- Double-click/tap: toggles selection (quick add/remove)

**Bug Fixes**
- **CRITICAL**: Fixed user discount being lost for bundle items (now applies user discount first, then bundle discount)
- Fixed product images not loading in detail view (explicit dimensions required for Next.js Image fill mode)
- Fixed cannot deselect items on desktop (click on selected item now deselects)
- Fixed unused variable TypeScript errors (`itemPricing`, `user`)
- Fixed swipe gesture null check for touch events

**Discount Stacking (Correct Behavior)**
```
Original Price:     250 AED
User Discount 50%: -125 AED → 125 AED
Bundle Discount 5%: -6.25 AED → 118.75 AED (final)
```
Cart displays combined discount as "50% + 5% off"

### February 3, 2026

**Mobile UX Improvements**
- Simplified mobile bottom bar: Previous | Skip | Next
- "View Bundle" shown on last step
- Hide inline navigation on mobile (desktop only)
- Summary line clickable to open bundle sheet

**User Discount Display**
- Show user's personal discount badge (e.g., "-50%")
- Display discounted price in red, original struck through
- "5% VAT inclusive" text on all prices
- Prices formatted as `1292.00 AED`

**Checkout Integration**
- Auto-redirect to checkout after adding bundle to cart
- Bundle cleared after adding to cart

**Hamburger Menu Integration**
- Added "🎁 Build Your Set" to mobile web hamburger menu
- Highlighted in corporate red

### February 2, 2026

**Initial Release**
- Created Bundle Builder feature with standalone page and Beauty Boxes integration
- Implemented 8 skincare routine steps with product filtering
- Added tiered discount system (5%/10%/15%/20%)
- Full localization for EN, AR, RU languages
- Mobile-responsive design with bottom sheet summary

**Updates**
- Added multiple product selection per step (toggle behavior)
- Implemented price hiding for non-logged-in users
- Updated banner to use corporate red color palette
- Excluded professional products from bundle builder:
  - PRO Solution category
  - Price on Request products
  - SKIN RENEWAL PEELING SYSTEM
- Changed emojis: Mask (🎭 → 🧖), Cream (🌸 → 🤍)
- Made step indicator sticky for better UX when scrolling
