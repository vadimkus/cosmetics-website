# API Security & Code Quality Audit — March 23, 2026

**Commit:** `44947514` on `main`  
**Scope:** All API routes, checkout flows, auth endpoints in `cosmetics-website`  
**Build verified:** Yes (`next build` passes after all fixes)

---

## Summary

Full audit of the Genosys website codebase (genosys.ae). Found 11 issues across API routes, checkout flows, and page components. Applied 6 zero-risk fixes (no impact on site functionality, native app, or order flow). 5 items deferred as low-priority or requiring architectural changes.

---

## Fixes Applied (6)

### 1. CRITICAL — Unauthenticated Account Deletion

**File:** `app/api/profile/route.ts`  
**Problem:** `DELETE /api/profile` accepted a `userId` from the JSON body with zero authentication. Any HTTP client could delete any user account by guessing or enumerating user IDs.  
**Root cause:** Legacy route left behind after the secure `/api/profile/delete` (which verifies `genosys_session` cookie) was implemented.  
**Fix:** Replaced the handler with a `410 Gone` response pointing callers to `/api/profile/delete`.  
**Impact:** Zero. No frontend code (web or native) calls this endpoint. All deletion flows use `/api/profile/delete`.

### 2. HIGH — Open Cache Revalidation Endpoint

**File:** `app/api/revalidate/route.ts`  
**Problem:** Both `GET` and `POST` handlers only enforce the `REVALIDATE_SECRET` check when the env var is set. If `REVALIDATE_SECRET` is missing from the production environment, anyone can call `revalidatePath()` or `revalidateTag()` with arbitrary values — busting ISR cache on demand.  
**Fix:** Changed from `if (revalidateSecret && secret !== revalidateSecret)` to `if (!revalidateSecret || secret !== revalidateSecret)`. Both GET and POST now reject all requests when the secret is not configured.  
**Impact:** Zero, as long as `REVALIDATE_SECRET` is set in the Vercel production environment. If it was previously unset, this route now correctly rejects all calls instead of silently allowing them.

### 3. MEDIUM — Test Email Double Body Read

**File:** `app/api/test-email/route.ts`  
**Problem:** The handler called `await request.json()` at the top to extract `type` and `testEmail`, then called it again inside the `welcome` and `discount-assigned` switch branches. The second call reads an already-consumed stream — `userName`, `password`, `discountType`, `discountPercentage`, and `customerName` were always undefined.  
**Fix:** Parse the body once into a `body` variable and destructure all fields from it.  
**Impact:** Zero on production (route is gated by `requireDevelopment()`). Fixes broken test email behavior in local dev for the `welcome` and `discount-assigned` email types.

### 4. MEDIUM — Validation After Logging (3 Routes)

**Files:**  
- `app/api/checkout/route.ts`
- `app/api/stripe/create-payment-intent/route.ts`
- `app/api/stripe/create-checkout-session/route.ts`

**Problem:** All three routes logged `items.length` in a `debugLog()` call before validating that `items` exists and is an array. If a malformed request omitted `items`, the log line threw a `TypeError`, which was caught by the outer `try/catch` and returned as a `500 Internal Server Error` instead of a clean `400 Bad Request`.  
**Fix:** Moved the `items` validation guard above the `debugLog()` call. The log now only runs after `items` is confirmed to be a non-empty array.  
**Impact:** Zero on happy path. Only changes error handling for malformed requests (500 → 400).

### 5. MEDIUM — Missing Items Guard on COD Route

**File:** `app/api/checkout/route.ts`  
**Problem:** Unlike the two Stripe routes (which had `if (!items || !Array.isArray(items) || items.length === 0)` guards), the COD checkout route had no such validation. An empty `items: []` payload could create a zero-item order in the database.  
**Fix:** Added the same items validation guard used by the Stripe routes, placed before the debug log.  
**Impact:** Zero on happy path. The frontend disables the checkout button when the cart is empty. This is defense-in-depth for API-level requests.

### 6. LOW — Stripe Error Message Mismatch

**File:** `app/api/checkout/route.ts`  
**Problem:** When a `paymentMethod: 'stripe'` request reached the COD endpoint, the error message directed callers to `/api/stripe/create-checkout-session`. The actual embedded Stripe checkout on the website uses `/api/stripe/create-payment-intent`.  
**Fix:** Updated both the error message and the debug log to reference `create-payment-intent`.  
**Impact:** Zero. This error path is never triggered by normal frontend usage. Corrects developer-facing messaging only.

### Bonus — exactOptionalPropertyTypes Type Fix

**File:** `app/api/checkout/route.ts`  
**Problem:** The items validation guard (Fix 4) narrowed `items` from `any` to `any[]`, which caused TypeScript to actually type-check the `.map()` return value. This exposed a pre-existing violation: `color: enhanced.color || undefined` produces `string | undefined`, but `OrderItemData.color` is `color?: string` — and with `exactOptionalPropertyTypes: true`, the property must be either absent or `string`, not explicitly `undefined`.  
**Fix:** Changed `color: enhanced.color || undefined` and `size: enhanced.size || undefined` to conditional spreads (`...(enhanced.color ? { color: enhanced.color } : {})`), matching the pattern already used for `bundleDiscount` on the adjacent line.  
**Impact:** Zero. Behavioral equivalent — the property is present with a string value or absent entirely.

---

## Not Fixed (5) — Deferred

### 7. Client-Trusted Prices (Mostly Fixed Apr 26, 2026)

**Original files:** `app/api/checkout/route.ts`, `app/api/stripe/create-payment-intent/route.ts`, `app/api/stripe/create-checkout-session/route.ts`  
**Original issue:** Checkout routes derived order totals from `item.product.price` sent by the frontend.

**Current state:** Current web and mobile payment/order routes now recompute line pricing from server product data via the pricing contract/cart pricing helpers. The legacy `/api/checkout` route is disabled by default with `410 Gone`.

**Remaining lower-risk integrity follow-ups:** Invoice generation and manual admin notification still accept submitted monetary payloads for document/email rendering. These do not capture payment, but should be rebuilt from stored order data in a future cleanup.

### 8. App Version Platform Fallback (Low Risk)

**File:** `app/api/mobile/app-version/route.ts`  
**Issue:** The `platform` query parameter is cast via `as 'ios' | 'android'` (compile-time only). Any invalid value (typo, missing) silently falls back to the iOS App Store URL.  
**Why deferred:** The native app sends `Platform.OS` which is always `ios` or `android`. No real-world impact.  
**Recommendation:** Add explicit validation if the endpoint is ever exposed to non-native callers.

### 9. Checkout WhatsApp Order Number (Low Risk, UX)

**File:** `app/checkout/CheckoutClient.tsx`  
**Issue:** A random `GEN...` string is generated client-side on mount for the WhatsApp support message. This is not the real server-assigned order number. If a user contacts support before completing checkout, the referenced order doesn't exist.  
**Why deferred:** Minor UX issue. The WhatsApp button is a help channel, not order tracking.  
**Recommendation:** Change the message to reference "my checkout" rather than a fake order number, or populate the real order number after successful submission.

### 10. Analytics Email Priority (Low Risk, Data Quality)

**File:** `app/api/analytics/track/route.ts`  
**Issue:** `data.userEmail` from the client body is used before falling back to the session cookie email. A client could send any email, polluting analytics data.  
**Why deferred:** Analytics data quality issue, not a security vulnerability or user-facing bug.  
**Recommendation:** Check the session cookie first and only fall back to client-provided email if no session exists.

### 11. Locale Location Page Duplication (Low Risk, Maintenance)

**Files:** `app/ar/locations/[city]/page.tsx`, `app/ru/locations/[city]/page.tsx`  
**Issue:** The English location page uses a shared `LocationPageClient` component, but the Arabic and Russian pages each duplicate the full `locations` data object and UI (~500 lines). Phone numbers, addresses, shipping text, and metadata can drift between locales.  
**Why deferred:** Refactoring into a shared component is a larger change that could introduce layout or RTL regressions.  
**Recommendation:** Extract location data into a shared `lib/locationsData.ts` and pass locale-specific strings via the translation system.

---

## Files Changed

| File | Change |
|------|--------|
| `app/api/profile/route.ts` | Replaced unauthenticated DELETE with 410 Gone |
| `app/api/revalidate/route.ts` | Made REVALIDATE_SECRET mandatory (GET + POST) |
| `app/api/test-email/route.ts` | Single body parse; removed duplicate `request.json()` calls |
| `app/api/checkout/route.ts` | Added items guard, moved validation before log, fixed Stripe error text, fixed `exactOptionalPropertyTypes` violation |
| `app/api/stripe/create-payment-intent/route.ts` | Moved validation before log |
| `app/api/stripe/create-checkout-session/route.ts` | Moved validation before log |

---

## Verification

- All 6 files pass linting (zero new warnings)
- `next build` succeeds with zero TypeScript errors
- No changes to frontend components, cart logic, or order data flow
- Native mobile app uses separate `/api/mobile/*` routes — completely unaffected
- Web checkout (COD + Stripe) happy path unchanged; only error-path behavior improved
