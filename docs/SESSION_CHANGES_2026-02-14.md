# Session Changes — February 14, 2026

## Part 1: Fix lastLoginSource Not Set for Google OAuth Users

### Summary

Fixed a bug where users registering or logging in via Google OAuth (both mobile app and web) were not getting their `lastLoginSource` field set. This caused the admin User Management page to show no device badge (e.g., "Mobile App", "Desktop", "Mobile Web") for these users.

**Reported symptom**: Alex Krapotkin registered via mobile app using Google OAuth but had no "Mobile App" badge in the admin panel.

---

### Root Causes

1. **`addUser()` silently dropped `lastLoginSource`** — The `baseData` object in `lib/userStorageDb.ts` did not include `lastLoginSource` or `lastLoginAt`, so even when callers passed these fields, they were ignored by `prisma.user.create()`.

2. **Mobile Google OAuth didn't pass `lastLoginSource`** — The `/api/mobile/auth/google` endpoint didn't set `lastLoginSource: 'mobile_app'` during registration or login.

3. **Mobile email/password registration didn't set `lastLoginSource`** — The `/api/mobile/auth/register` endpoint (which uses `tx.user.create()` directly) was missing `lastLoginSource: 'mobile_app'`.

4. **Web Google OAuth endpoints didn't set `lastLoginSource`** — Both `/api/auth/google/callback` and `/api/auth/google/verify` didn't detect the device or set `lastLoginSource` for new or returning users.

### Files Changed (Part 1)

| File | Change |
|------|--------|
| `lib/userStorageDb.ts` | Added `lastLoginSource` and `lastLoginAt` to `baseData` in `addUser()` |
| `app/api/mobile/auth/google/route.ts` | Added `lastLoginSource: 'mobile_app'` for both registration and login paths |
| `app/api/mobile/auth/register/route.ts` | Added `lastLoginSource: 'mobile_app'` to `UserCreateInput` |
| `app/api/auth/google/callback/route.ts` | Added User-Agent device detection + `lastLoginSource` for registration and login |
| `app/api/auth/google/verify/route.ts` | Added User-Agent device detection + `lastLoginSource` for registration and login |

---

## Part 2: Fix "Never" Shown for All Web Users — Full Activity Tracking Rework

### Summary

Web users always showed **"Never"** as their last active time in the admin dashboard, even when they had recently logged in and were actively using the site. This was because `lastActiveAt` was only updated for mobile app users — web login routes and the session endpoint had no activity tracking at all.

### Root Cause

| Problem | Explanation |
|---------|-------------|
| Web login routes didn't track activity | All web auth routes (`/api/auth/login`, Google OAuth, Apple Sign-In, passkey, register) set `lastLoginAt` and `lastLoginSource` but never called `trackUserActivityNow()` to update `lastActiveAt` |
| No web heartbeat existed | The `GET /api/auth/session` endpoint is called every ~5 minutes by `UserRefreshWrapper` on the client side, but had no activity tracking — so web users' `lastActiveAt` was never refreshed after login |
| Mobile Apple route missing fields | `/api/mobile/auth/apple` didn't set `lastLoginSource: 'mobile_app'` for new or existing users |
| Passkey route missing fields | `/api/auth/passkey/login-verify` didn't set `lastLoginSource` or call `trackUserActivityNow()` |
| Mobile Google route missing activity | `/api/mobile/auth/google` didn't call `trackUserActivityNow()` for new or existing users |

### Solution

Added `trackUserActivityNow()` to every login/registration path, and added `trackUserActivity()` (throttled heartbeat) to the session endpoint:

#### Login Routes — Immediate Activity Tracking

| Route | What Was Added |
|-------|---------------|
| `app/api/auth/login/route.ts` | Import `trackUserActivityNow`, call after successful login |
| `app/api/auth/google/callback/route.ts` | Import `trackUserActivityNow`, call for new and existing users |
| `app/api/auth/apple/callback/route.ts` | Import `trackUserActivityNow`, call for all Apple Sign-In paths (promo, no-promo, existing) |
| `app/api/auth/passkey/login-verify/route.ts` | Import `trackUserActivityNow`, call after passkey verification. Also added `lastLoginSource` detection via User-Agent |
| `app/api/auth/register/route.ts` | Import `trackUserActivityNow`, call after user creation |
| `app/api/mobile/auth/google/route.ts` | Import `trackUserActivityNow`, call for new and existing users |
| `app/api/mobile/auth/apple/route.ts` | Import `trackUserActivityNow`, call for new and existing users. Also added missing `lastLoginSource: 'mobile_app'` |

#### Session Endpoint — Web Heartbeat

| Route | What Was Added |
|-------|---------------|
| `app/api/auth/session/route.ts` | Import `trackUserActivity` (throttled), call on every session check. Since `UserRefreshWrapper` calls this every ~5 minutes, web users now get continuous activity tracking with zero new client-side code |

#### Admin API Cleanup

| Route | What Changed |
|-------|-------------|
| `app/api/admin/users/route.ts` | Simplified backfill logic — removed aggressive reset of `desktop_web` values, kept only safe idempotent backfill for push token users |

#### Admin UI Improvements

| File | What Changed |
|------|-------------|
| `components/admin/AdminUsersManager.tsx` | Added `Clock` and `UserPlus` icons. New helper functions: `formatRelativeTime()`, `formatDateTime()`, `formatFullDateTime()`. Each user row now shows: last active (relative), last login (formatted), registration date. Pulsing green dot for online users. Full datetime on hover tooltips |

### Files Changed (Part 2)

| File | Lines Changed |
|------|--------------|
| `app/api/auth/login/route.ts` | +5 (import + trackUserActivityNow call) |
| `app/api/auth/google/callback/route.ts` | +8 (import + 2x trackUserActivityNow calls) |
| `app/api/auth/apple/callback/route.ts` | +7 (import + 3x trackUserActivityNow calls) |
| `app/api/auth/passkey/login-verify/route.ts` | +15 (import + loginSource detection + trackUserActivityNow call) |
| `app/api/auth/register/route.ts` | +6 (import + trackUserActivityNow call) |
| `app/api/auth/session/route.ts` | +22/-17 (import + trackUserActivity heartbeat, removed verbose logging) |
| `app/api/mobile/auth/google/route.ts` | +8 (import + 2x trackUserActivityNow calls) |
| `app/api/mobile/auth/apple/route.ts` | +13 (import + lastLoginSource + 2x trackUserActivityNow calls) |
| `app/api/admin/users/route.ts` | +12/-39 (simplified backfill) |
| `components/admin/AdminUsersManager.tsx` | +118/-22 (new timestamp formatting, UI improvements) |
| **Total** | **10 files, 168 insertions, 73 deletions** |

### Risk Assessment

- **No auth flows modified** — Login/logout/session cookie handling is identical
- **All trackUserActivityNow calls wrapped in try/catch** — If DB write fails, login still succeeds
- **Session heartbeat is fire-and-forget** — Never blocks the response
- **No schema changes** — All three fields (`lastActiveAt`, `lastLoginAt`, `lastLoginSource`) already existed
- **No new dependencies** — Uses existing `activityTracker.ts` library
- **Worst-case failure** — Activity timestamp doesn't update (same broken state as before)

### How to Verify

1. Log in on desktop web → Admin should show "Online now" + "Desktop" badge
2. Log in on mobile browser → Admin should show "Online now" + "Mobile Web" badge
3. Log in via mobile app → Admin should show "Online now" + "App" badge
4. Stay logged in for 10 minutes → Should still show "Online now" (session heartbeat)
5. Log out, wait 6 minutes → Should show "6m ago"

---

## Auth Endpoints — Complete Coverage (After Both Fixes)

| Endpoint | `lastLoginAt` | `lastLoginSource` | `lastActiveAt` |
|----------|--------------|-------------------|----------------|
| `/api/auth/login` | ✅ | ✅ UA detection | ✅ `trackUserActivityNow()` |
| `/api/auth/google/callback` | ✅ | ✅ UA detection | ✅ `trackUserActivityNow()` |
| `/api/auth/apple/callback` | ✅ | ✅ UA detection | ✅ `trackUserActivityNow()` |
| `/api/auth/passkey/login-verify` | ✅ | ✅ UA detection | ✅ `trackUserActivityNow()` |
| `/api/auth/register` | ✅ | ✅ UA detection | ✅ `trackUserActivityNow()` |
| `/api/auth/session` | — | — | ✅ `trackUserActivity()` (heartbeat) |
| `/api/mobile/auth/login` | ✅ | ✅ `mobile_app` | ✅ `trackUserActivityNow()` |
| `/api/mobile/auth/google` | ✅ | ✅ `mobile_app` | ✅ `trackUserActivityNow()` |
| `/api/mobile/auth/apple` | ✅ | ✅ `mobile_app` | ✅ `trackUserActivityNow()` |
| `/api/mobile/user/profile` | — | — | ✅ `trackUserActivity()` (heartbeat) |
| `/api/mobile/orders` | — | — | ✅ `trackUserActivity()` (heartbeat) |

---

## Related Documentation

- [ADMIN_ONLINE_USERS_FEATURE.md](./ADMIN_ONLINE_USERS_FEATURE.md) — Full feature reference
- [ADMIN_USER_MANAGEMENT.md](./ADMIN_USER_MANAGEMENT.md) — Admin page reference
- [SESSION_LOG_2026_02_11.md](./SESSION_LOG_2026_02_11.md) — Previous fix: updateUser() not saving lastLoginSource

---

## Part 3: Fix Native App Showing Only 1 Product Image (Gallery Missing Main Image)

### Summary

Products with gallery images in the database (but no `productConfig` override) showed only **1 image** in the native app instead of 2. The mobile web showed both correctly. The fix is server-side — no app rebuild needed.

### Root Cause

The mobile API (`pricingEngine.ts`) passed through DB `product.images` as-is when no `productConfig` images existed. The DB `images` field contains only **gallery images** (e.g., `["/images/Second/tonicc.jpg"]`), not the main product image. The API sent this directly, so the native app received a 1-image array.

The mobile web handled this correctly because `ProductImageGallery.tsx` combines `[mainImage, ...galleryImages]` client-side. The native app's `getProductImages()` trusted the API array as-is.

### Affected Products

| Product # | Product Name | `image` (main) | `images` (DB gallery) |
|-----------|-------------|-----------------|----------------------|
| 43 | HR³ MATRIX HAIR TONIC α | `/images/HT.jpg` | `["/images/Second/tonicc.jpg"]` |
| 45 | SCALP PEELING | `/images/scal.jpg` | `["/images/Second/pp.jpg"]` |

Product 44 (HR³ MATRIX HAIR SOLUTION α) also has DB `images`, but has a `productConfig` override that already includes the main image — so it was unaffected.

### Fix

**File**: `lib/pricingEngine.ts` — `generateEnhancedProductData()`

When DB `images` are used (no productConfig override), the API now combines the main image with gallery images, matching the web's behavior:

```typescript
// Before: passed through raw DB images (gallery only)
mergedImages = product.images

// After: combines main + gallery, avoiding duplicates
const galleryImages = JSON.parse(product.images)
const mainImage = product.image
const combined = [mainImage, ...galleryImages.filter(img => img !== mainImage)]
mergedImages = JSON.stringify(combined)
```

### API Response Before vs After

**Before** (product 43):
```json
{
  "image": "/images/HT.jpg",
  "images": "[\"/images/Second/tonicc.jpg\"]"
}
```
App saw 1 image (and it was the wrong one — the secondary, not the main).

**After** (product 43):
```json
{
  "image": "/images/HT.jpg",
  "images": "[\"/images/HT.jpg\",\"/images/Second/tonicc.jpg\"]"
}
```
App now shows 2 images in the gallery carousel with pagination dots.

### Web Compatibility

The web's `ProductImageGallery.tsx` does `[mainImage, ...parsedImages.filter(img !== mainImage)]` — so even with the main image now included in `images`, the deduplication prevents duplicates. No change in web behavior.

### Risk Assessment

- **No app rebuild needed** — server-side only fix
- **No web changes** — deduplication in `ProductImageGallery.tsx` handles the new format
- **No breaking changes** — `images` field format is unchanged (JSON string array)
- **Worst-case failure** — If JSON.parse fails, falls back to raw `product.images` (same as before)

### Files Changed

| File | Change |
|------|--------|
| `lib/pricingEngine.ts` | Combine `product.image` + `product.images` gallery (deduped) when no productConfig override |

---

### Related Documentation

- [MOBILE_APP_PRODUCTCONFIG_FIX.md](./MOBILE_APP_PRODUCTCONFIG_FIX.md) — Full productConfig images/colors/docs fix reference
- [ADMIN_ONLINE_USERS_FEATURE.md](./ADMIN_ONLINE_USERS_FEATURE.md) — Full activity tracking feature reference
- [ADMIN_USER_MANAGEMENT.md](./ADMIN_USER_MANAGEMENT.md) — Admin page reference

---

### Commits

| Commit | Description |
|--------|-------------|
| `17eac5f3` | fix: track user activity across all login methods for accurate online status |
| `4855feee` | docs: update activity tracking and admin user management documentation |
| `af6f01be` | fix: include main image in API gallery for products with DB images |

---

## Part 4: Product Gallery — POWER SOLUTION CVS (Product 5) Not Updating

### Summary

User added second and third images (`cvs_big1.jpg`, `cvs_big2.jpg`) to product 5 via `lib/products.ts` and pushed to main. After hard refresh, **no change** on https://genosys.ae/products/5 — still showed only the main image.

### Root Cause

**Production loads product data from the PostgreSQL database (Prisma), not from `lib/products.ts`.** The static file is for seeding/reference only. The product's `images` column in the database was `null`, so only the single `image` field was displayed.

### Fix

1. **Direct database update** — Ran SQL via `pg` to set `images` and `productNumber`:
   - `images`: `null` → `["/images/CVS.jpg","/images/Second/cvs_big1.jpg","/images/Second/cvs_big2.jpg"]`
   - `productNumber`: `null` → `"5"`

2. **Static file** — `lib/products.ts` was already updated (commit `09e555ba`) for consistency.

### Key Lesson

> **Always update product data in the database, not just `lib/products.ts`.** Production data comes exclusively from PostgreSQL via Prisma.

### Documentation

- [GSC_FIXES_2026-02-14.md](./GSC_FIXES_2026-02-14.md) — Section 7 documents this fix in full

### Commits

| Commit | Description |
|--------|-------------|
| `09e555ba` | Add gallery images for POWER SOLUTION CVS (product 5) — static file only |
| `51a8b7f1` | docs: add product gallery DB update to GSC fixes documentation |

---

## Part 5: MoySklad (МойСклад) Accounting Integration

### Problem

Customer orders placed on genosys.ae needed to be manually entered into MoySklad accounting system. This was error-prone and time-consuming.

### Solution

Built an automatic one-way sync: **genosys.ae → MoySklad**.

When a customer places an order (via any checkout flow), a corresponding customer order is automatically created in MoySklad with:
- Customer as counterparty (found by phone/email or auto-created)
- Line items mapped to MoySklad product IDs (55+ products mapped)
- Organization: Genosys Middle East FZ-LLC
- Warehouse: Genosys Warehouse
- Currency: AED
- State: Новый (New)

### Integration Points

| Checkout Flow | File | Trigger |
|--------------|------|---------|
| Web COD | `app/api/checkout/route.ts` | After order saved |
| Stripe (web + mobile) | `app/api/webhooks/stripe/route.ts` | After payment confirmed |
| Mobile COD | `app/api/mobile/orders/route.ts` | After order saved |

### Safety Features

- **Non-blocking**: MoySklad calls are fire-and-forget — never blocks checkout
- **No overwrites**: Never modifies existing MoySklad data
- **Graceful degradation**: Silently disabled if env vars not set
- **Idempotent counterparties**: Searches before creating

### Files Created/Modified

| File | Change |
|------|--------|
| `lib/moysklad.ts` | **NEW** — Main integration module (API client, product mapping, order creation) |
| `app/api/checkout/route.ts` | Added MoySklad sync after COD order creation |
| `app/api/webhooks/stripe/route.ts` | Added MoySklad sync after Stripe payment confirmation |
| `app/api/mobile/orders/route.ts` | Added MoySklad sync after mobile COD order creation |
| `.env.example` | Added `MOYSKLAD_LOGIN` and `MOYSKLAD_PASSWORD` template |
| `docs/MOYSKLAD_INTEGRATION.md` | **NEW** — Full integration documentation |

### Env Vars Required

Added to **Vercel Dashboard → Project Settings → Environment Variables** (completed Feb 14, 2026):

```
MOYSKLAD_LOGIN=vadimkus@ikosmetologist
MOYSKLAD_PASSWORD=***
```

Status: **LIVE** — integration is active in production after Vercel redeploy.

### Risk Assessment

| Area | Risk | Reason |
|------|------|--------|
| Login/auth flow | **ZERO** | Not touched |
| Mobile app (auth, products, profile) | **ZERO** | Not touched |
| Cart/bag | **ZERO** | Not touched |
| Stripe payment processing | **ZERO** | Payment logic unchanged |
| Order saving to database | **ZERO** | MoySklad code runs AFTER order is saved |
| Email confirmations | **ZERO** | MoySklad code runs independently |
| Web COD checkout response | **NEAR ZERO** | Fire-and-forget with `.catch()` |
| Stripe webhook response | **NEAR ZERO** | Fire-and-forget with `.catch()` |
| Mobile COD checkout response | **NEAR ZERO** | Fire-and-forget with `.catch()` |

**Pattern used**: Identical to existing email sending — `.then().catch()` with no `await`. Even if MoySklad API goes offline, all existing app functionality continues unaffected. Build passed with zero TypeScript errors.

### Commits

| Commit | Description |
|--------|-------------|
| `9825eed0` | feat: integrate MoySklad accounting — auto-create orders on checkout |

### Documentation

- [MOYSKLAD_INTEGRATION.md](./MOYSKLAD_INTEGRATION.md) — Full integration documentation
