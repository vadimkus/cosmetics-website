# Session Log - February 11, 2026

## Summary

This session focused on fixing discount display issues for beauty boxes across the website and email templates, plus adding product images.

---

## Changes Made (All Local - No Commits)

### 1. Beauty Box Discount Display Fix

**Problem**: Beauty boxes have a built-in 15% bundle discount, but the display logic was either:
- Hiding the discount entirely (after previous fix), or
- Incorrectly showing the user's VIP discount percentage (e.g., 50%) instead of the actual 15% bundle discount

**Solution**: Updated all display locations to show:
- Original retail price with strikethrough (e.g., ~~AED 1,390.00~~)
- Discounted price in green (e.g., **AED 1,181.50**)
- Orange badge: `-15% Box`

**Beauty Box Original Prices** (from `lib/discountUtils.ts`):
| Box Name | Original Price | Sale Price (15% off) |
|----------|---------------|---------------------|
| Problem Skin Care Beauty Box | AED 1,318 | AED 1,120.30 |
| Skin Brightening Beauty Box | AED 1,496 | AED 1,271.60 |
| Charming Look Beauty Box | AED 1,520 | AED 1,292.00 |
| Anti-Aging Beauty Box | AED 1,390 | AED 1,181.50 |
| Deep Moisturizing Beauty Box | AED 1,318 | AED 1,120.30 |
| Sensitive Skin Beauty Box | AED 1,696 | AED 1,441.60 |

#### Files Modified:

**a) `app/success/SuccessClient.tsx`**
- Added `BEAUTY_BOX_ORIGINAL_PRICES` lookup map
- Added `getBeautyBoxOriginalPrice()` helper function
- Modified item rendering to show strikethrough + green price + orange badge for beauty boxes
- Regular items with VIP/bundle discounts continue to show purple/green badges

**b) `lib/email/htmlGenerators.ts`**
- Renamed `isDiscountExcludedItem()` to `isFixedPriceItem()` (devices + Hydro Cool Mask only)
- Added `BEAUTY_BOX_ORIGINAL_PRICES` and `getBeautyBoxOriginalPrice()` helpers
- Updated `renderEnhancedItemRows()` to show beauty box discount with strikethrough and `-15% Box` badge (orange: `#fff7ed`/`#c2410c`)

**c) `lib/email/templates.ts` - Customer Order Confirmation**
- Added `BEAUTY_BOX_PRICES`, `getBBOriginal()`, `isFixedPrice()` helpers
- Updated item rendering in `orderConfirmation` template to show beauty box discount correctly

**d) `lib/email/templates.ts` - Admin New Order Email**
- Added same helpers (`BB_PRICES`, `getBBOrig()`, `isFixed()`)
- Updated admin email item rendering for consistent beauty box discount display

**e) `app/checkout/CheckoutClient.tsx`**
- Updated order summary section to show strikethrough original price + green discounted price for any item with a discount (beauty boxes, VIP items, bundle items)
- Applied to both mobile and desktop order summary views

---

### 2. Product Image Additions

**a) Product 10 - SNOW O₂ CLEANSER**
- Added image: `/images/Second/cleanserboth.jpg`
- Files modified:
  - `data/productConfig.ts`: `images: ['/images/SNOW.jpg', '/images/Second/cleanser_big.jpg', '/images/Second/cleanserboth.jpg']`
  - `lib/products.ts`: Updated `images` field

**b) Product 15 - INTENSIVE PROBLEM CONTROL TONER**
- Added image: `/images/Second/problem_both.jpg`
- Files modified:
  - `data/productConfig.ts`: Added `images: ['/images/PRS.jpg', '/images/Second/problem_both.jpg']`
  - `lib/products.ts`: Updated `images` from `null` to include both images

---

## Items Not Changed (Expected Behavior)

### Apple Sign-In on Localhost
- **Error**: "Invalid web redirect url" when trying Apple Sign-In on localhost
- **Reason**: This is expected - Apple OAuth requires registered redirect URLs that must be `https://` and match exactly what's configured in Apple Developer Console
- **Solution**: Use email/password or Google login for local testing. Apple Sign-In works correctly in production on `genosys.ae`

---

## Testing Checklist

### Beauty Box Discount Display
- [ ] Place a beauty box order and verify email shows:
  - Original price strikethrough
  - Discounted price in green
  - `-15% Box` badge (orange)
- [ ] Verify order success page shows same display
- [ ] Verify admin email shows same display
- [ ] Verify checkout page order summary shows strikethrough for discounted items

### Product Images
- [ ] Visit https://localhost:3000/products/10 - verify new image in gallery
- [ ] Visit https://localhost:3000/products/15 - verify new image in gallery

### Regression Testing
- [ ] Regular products with VIP discount still show purple VIP badge
- [ ] Bundle builder items still show green Bundle badge
- [ ] Free items still show "FREE" in green
- [ ] Devices (GenoLED, Gentron, HairGen) show no discount badges
- [ ] Hydro Cool Mask shows no discount badges

---

### 3. Admin Users Page - Login Source Device Badge Fix

**Problem**: The admin users page (`/admin` → Users tab) was supposed to show a device badge indicating how each user last logged in (Desktop, Mobile Web, or App), but no badges were appearing.

**Root Cause**: The `lastLoginSource` field was **never being saved to the database**. 

The bug was in `lib/userStorageDb.ts` in the `updateUser()` function. This function explicitly maps each field before passing to Prisma. It had a mapping for `lastLoginAt` but was **missing** the mapping for `lastLoginSource`. So every login attempt called:

```typescript
await updateUser(user.id, { 
  lastLoginAt: new Date().toISOString(),
  lastLoginSource: loginSource  // <-- silently ignored!
})
```

The `lastLoginSource` value was silently dropped because no mapping existed.

**Solution (2 fixes)**:

**a) `lib/userStorageDb.ts`** - Added the missing field mapping in `updateUser()`:
```typescript
if (updates.lastLoginSource !== undefined) {
  updateData.lastLoginSource = updates.lastLoginSource === '' ? null : updates.lastLoginSource
}
```

**b) `components/admin/AdminUsersManager.tsx`** - Made the device badge more visible:
- Moved from a tiny icon next to the timestamp to a proper **pill badge** on the same row as the username (next to "Online" badge)
- Shows icon + label text on desktop (e.g., "Desktop", "Mobile Web", "App")
- Shows icon only on mobile to save space
- Color coded:
  - **Desktop**: Gray background (`bg-gray-50`)
  - **Mobile Web**: Blue background (`bg-blue-50`)
  - **App**: Purple background (`bg-purple-50`)

**Where `lastLoginSource` is set** (all these routes were working correctly, just the save was broken):

| Route | Source Value |
|-------|-------------|
| `app/api/auth/login/route.ts` | `desktop_web` or `mobile_web` (based on User-Agent) |
| `app/api/auth/register/route.ts` | `desktop_web` or `mobile_web` (based on User-Agent) |
| `app/api/auth/apple/callback/route.ts` | `desktop_web` or `mobile_web` (based on User-Agent) |
| `app/api/mobile/auth/login/route.ts` | `mobile_app` (always) |

**Note**: Existing users will get their badge populated on their **next login**. Current users show no badge because the field was never previously saved.

---

### 4. Admin Users Page - Clickable Filter Legend

**Feature**: Made the legend items (Online, Has orders, No orders, Desktop, Mobile Web, App) into clickable filter buttons.

**Implementation** (`components/admin/AdminUsersManager.tsx`):

**New State:**
```typescript
type StatusFilter = 'online' | 'hasOrders' | 'noOrders' | null
type DeviceFilter = 'desktop_web' | 'mobile_web' | 'mobile_app' | null

const [statusFilter, setStatusFilter] = useState<StatusFilter>(null)
const [deviceFilter, setDeviceFilter] = useState<DeviceFilter>(null)
```

**Filter Logic:**
- Status filters are mutually exclusive (only one at a time)
- Device filters are mutually exclusive (only one at a time)
- Status + Device filters work together (AND logic)
- Clicking an active filter toggles it off

**Filters Available:**

| Filter | Type | Description |
|--------|------|-------------|
| Online | Status | Users active in last 5 minutes |
| Has orders | Status | Users with orderCount > 0 |
| No orders | Status | Users with orderCount = 0 |
| Desktop | Device | lastLoginSource = 'desktop_web' |
| Mobile Web | Device | lastLoginSource = 'mobile_web' |
| App | Device | lastLoginSource = 'mobile_app' |

**UI Features:**
- Pill-shaped buttons with hover effects
- Active filters have colored background + ring highlight
- **Clear** button appears when any filter is active
- Results count banner: "Showing 5 of 120 users • Online • App"
- Empty state shows "Clear filters" button when no results match

**Visual Design:**
- Online: Green highlight when active
- Has orders: Green highlight
- No orders: Gray highlight
- Desktop: Gray highlight
- Mobile Web: Blue highlight
- App: Purple highlight

---

### 5. Login Source Backfill — Accuracy Fix

**Problem**: After the initial `lastLoginSource` fix (#3), a backfill was run that set all users to `desktop_web` if they didn't have an `expoPushToken`. This was **inaccurate** — we don't know the device of historical users who never had the field saved. Many users showed a "Desktop" badge when they may have been mobile users.

**Root Cause**: The first backfill assumed "no push token = desktop". In reality, it just means "unknown" — mobile web users and app users who declined push notifications would also lack a push token.

**Solution** (`app/api/admin/users/route.ts`):

The backfill now runs on every admin users fetch and applies three rules:

| Rule | Condition | Action | Accuracy |
|------|-----------|--------|----------|
| 1. Tag app users | `expoPushToken` is not null, any `lastLoginSource` | Set to `mobile_app` | **Confirmed** — only native app registers push tokens |
| 2. Reset bad backfill | `lastLoginSource = 'desktop_web'`, no push token, last login before today | Reset to `null` | Honest — we don't know their device |
| 3. Keep recent logins | `lastLoginSource = 'desktop_web'`, logged in today or later | Keep as-is | **Accurate** — the `userStorageDb.ts` fix is now saving correctly |

**Result after refresh:**

| User type | Badge shown | Accuracy |
|-----------|-------------|----------|
| Has push token | **App** (purple) | Confirmed |
| Logged in after today's fix | Correct badge (Desktop/Mobile Web/App) | Confirmed |
| Historical user, no push token | No badge | Honest — unknown until next login |

**Key Principle**: Better to show **no badge** than an inaccurate one. All users will get correctly tagged on their next login now that `userStorageDb.ts` is fixed.

---

## Files Changed Summary (Final)

| File | Type | Description |
|------|------|-------------|
| `app/success/SuccessClient.tsx` | Modified | Beauty box 15% discount display |
| `lib/email/htmlGenerators.ts` | Modified | Beauty box discount in HTML emails |
| `lib/email/templates.ts` | Modified | Beauty box discount in customer & admin emails |
| `app/checkout/CheckoutClient.tsx` | Modified | Strikethrough prices in order summary |
| `data/productConfig.ts` | Modified | Added images for products 10, 15 & 16 |
| `lib/products.ts` | Modified | Added images for products 10, 15 & 16 |
| `lib/userStorageDb.ts` | Modified | Fixed missing `lastLoginSource` field mapping |
| `components/admin/AdminUsersManager.tsx` | Modified | Device badge + clickable filter legend |
| `app/api/admin/users/route.ts` | Modified | Login source backfill with accuracy fix |
| `components/header/MobileWebHeader.tsx` | Modified | Swipe-up-to-close gesture on hamburger menu |

---

## Testing Checklist (Updated)

### Beauty Box Discount Display
- [ ] Place a beauty box order and verify email shows: strikethrough + green price + `-15% Box` badge
- [ ] Verify order success page shows same display
- [ ] Verify admin email shows same display
- [ ] Verify checkout page order summary shows strikethrough for discounted items

### Product Images
- [ ] Visit http://localhost:3000/products/10 — verify new image in gallery
- [ ] Visit http://localhost:3000/products/15 — verify new image in gallery

### Admin Users Page
- [ ] Device badges: users with push tokens show purple "App" badge
- [ ] Device badges: users who log in after fix show correct badge
- [ ] Device badges: historical users show no badge (not fake "Desktop")
- [ ] Clickable filters: "Online" filter shows only active users
- [ ] Clickable filters: "Has orders" / "No orders" filters work
- [ ] Clickable filters: "Desktop" / "Mobile Web" / "App" filters work
- [ ] Clickable filters: "Clear" button resets all filters
- [ ] Results count banner shows when filters are active

### Regression Testing
- [ ] Regular products with VIP discount still show purple VIP badge
- [ ] Bundle builder items still show green Bundle badge
- [ ] Free items still show "FREE" in green
- [ ] Devices (GenoLED, Gentron, HairGen) show no discount badges
- [ ] Hydro Cool Mask shows no discount badges

---

## Deployment Notes

All changes are **local only** — no commits made. To deploy:

1. Test locally with a test order
2. Review changes: `git diff`
3. Stage: `git add -A`
4. Commit: `git commit -m "Fix beauty box discount, product images, admin login badge + filters + backfill"`
5. Push to trigger deployment

---

## Related Previous Changes (Same Session, Earlier)

From the earlier part of this session:
- Mobile app badge clearing fix (`contexts/NotificationContext.js`)
- Mobile app beauty box order details display (`app/profile/orders/[id].js`)
- Various security and code quality improvements across both codebases
- Android app alignment with iOS (`app.json` intent filters)

See `/Users/vadimkus/genosys-mobile-app/docs/core/SESSION_LOG_2026_02_11.md` for mobile app changes.

---

### 6. Mobile Web Hamburger Menu — Swipe-Up-to-Close Gesture

**Feature**: Added the ability to swipe up on the mobile web hamburger dropdown menu to close it, providing a native mobile-like UX.

**File Modified**: `components/header/MobileWebHeader.tsx`

**Implementation Details**:

1. **Touch event handlers** added to the menu panel:
   - `onTouchStart` — Records initial Y position and timestamp
   - `onTouchMove` — Tracks vertical swipe direction and applies visual feedback
   - `onTouchEnd` — Determines whether to close menu based on distance/velocity

2. **Smart scroll detection** — The swipe-to-close gesture only activates when the menu content is scrolled to the top (`scrollTop <= 0`). If the menu has scrollable content, normal scrolling still works as expected.

3. **Visual feedback during swipe**:
   - Menu panel translates upward with resistance factor (0.6x)
   - Opacity fades proportionally as you swipe
   - Smooth CSS transitions when releasing

4. **Velocity-aware closing** — Menu closes if either:
   - User swipes more than **80px** upward, OR
   - User swipes fast (velocity > 0.3 px/ms) even if distance is short

5. **Snap-back** — If swipe doesn't meet threshold, panel smoothly animates back to original position

6. **Drag handle indicator** — A small gray pill bar (`w-10 h-1 bg-gray-300 rounded-full`) at the top of the menu hints at swipeable behavior

7. **Body scroll lock** — Added `body { overflow: hidden }` when menu is open to prevent background scrolling

**State Added**:
```typescript
const [swipeOffset, setSwipeOffset] = useState(0)
const [isSwiping, setIsSwiping] = useState(false)
const touchStartY = useRef(0)
const touchStartTime = useRef(0)
const isScrolledToTop = useRef(true)
const menuPanelRef = useRef<HTMLDivElement>(null)
```

**Callbacks Added**:
```typescript
const handleMenuTouchStart = useCallback((e: ReactTouchEvent<HTMLDivElement>) => { ... }, [])
const handleMenuTouchMove = useCallback((e: ReactTouchEvent<HTMLDivElement>) => { ... }, [isSwiping])
const handleMenuTouchEnd = useCallback(() => { ... }, [isSwiping, swipeOffset, setShowMobileMenu])
```

**CSS Applied Dynamically**:
```typescript
style={{
  animation: !isSwiping && swipeOffset === 0 ? 'slideDown 0.2s ease-out' : undefined,
  transform: swipeOffset > 0 ? `translateY(-${swipeOffset}px)` : undefined,
  transition: isSwiping ? 'none' : 'transform 0.25s ease-out',
  opacity: swipeOffset > 0 ? Math.max(1 - swipeOffset / 400, 0) : 1,
}}
```

**Closing Methods Now Available**:
1. Tap the X button in header
2. Tap the backdrop (blurred area behind menu)
3. **Swipe up** on the menu panel ← NEW
4. Tap any navigation link (auto-closes)

**Testing**:
- [ ] Open hamburger menu on mobile web (not PWA)
- [ ] Swipe up — menu should close with smooth animation
- [ ] Swipe up slowly, release early — menu should snap back
- [ ] Scroll down in menu, then swipe up — should scroll content, not close
- [ ] Scroll to top in menu, then swipe up — should close menu
- [ ] Verify drag handle pill is visible at top of menu
