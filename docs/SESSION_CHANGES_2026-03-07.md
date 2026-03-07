# Session Changes - March 7, 2026

## Summary

Two production issues fixed:
1. **Google Search Console "Soft 404"** — Order tracking pages returning HTTP 200 for non-existent orders
2. **CSRF Token Cookie Missing** — Mobile/PWA users unable to submit product reviews

---

## 1. Google Search Console Soft 404 Fix

**Reported Issue:** Google Search Console flagged pages with "Soft 404" — pages returning HTTP 200 but displaying error content like "Order Not Found".

**Root Cause:** The `/track/[orderNumber]` pages (EN, AR, RU) used client-side validation only. The server always returned HTTP 200, then the client fetched the order API and displayed "Order Not Found" if the order didn't exist. Google sees 200 + "not found" content = soft 404.

**Changes Made:**

### robots.txt
Added `Disallow` rules for private user pages:
```
Disallow: /track/
Disallow: /share/
Disallow: /certificate/
```

### Order Tracking Pages (server-side validation)
Files:
- `app/track/[orderNumber]/page.tsx`
- `app/ar/track/[orderNumber]/page.tsx`
- `app/ru/track/[orderNumber]/page.tsx`

Added server-side order validation that calls `notFound()` when the order doesn't exist:

```typescript
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { errorLog } from '@/lib/logger'

export default async function OrderTrackingPage({ params }: PageProps) {
  const { orderNumber } = await params

  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      select: { id: true }
    })
    if (!order) notFound()
  } catch (error) {
    errorLog('[ORDER_TRACK_PAGE] DB check failed, falling back to client:', error)
  }
  
  return <OrderTrackingClient orderNumber={orderNumber} />
}
```

**Graceful Fallback:** If the database is unreachable, the error is caught and logged, and the page falls back to client-side tracking (existing behavior). No user disruption.

### OrderTrackingClient.tsx
Replaced `if (!trackingData) return null` with a proper loading state to prevent blank page rendering:

```tsx
if (!trackingData) {
  return (
    <div className={`min-h-[100dvh] bg-gray-50 flex items-center justify-center`} dir={dir}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">{t('common.loading') || 'Loading tracking information...'}</p>
      </div>
    </div>
  )
}
```

**Commit:** `5e96c0b5` — "fix: resolve Google Search Console soft 404 errors"

---

## 2. CSRF Token Cookie Missing Fix (Product Reviews)

**Reported Issue:** Customer on mobile/PWA received error "CSRF token cookie missing. Please refresh the page." when trying to submit a product review.

**Root Cause:** Service Worker stripped `Set-Cookie` headers.

The CSRF protection uses the Double Submit Cookie pattern:
1. Server generates token, sends it in JSON body AND as `Set-Cookie` header
2. Client stores token in memory and browser stores cookie
3. On POST, client sends token in header, server compares with cookie

The problem: Service workers intercept `GET /api/csrf-token`. Per the Fetch specification, when a response is passed through `event.respondWith()`, the browser strips all `Set-Cookie` headers. The token was returned in the JSON body (so `fetchCsrfToken()` succeeded), but the cookie was never actually set. The subsequent POST then failed because the cookie didn't exist.

**Changes Made:**

### public/sw.js
Skip `/api/csrf-token` from service worker interception so the browser processes `Set-Cookie` directly:

```javascript
// Skip CSRF token endpoint — browser must process Set-Cookie directly
if (url.pathname === '/api/csrf-token') {
  return
}
```

### lib/csrfClient.ts
Set cookie client-side via `document.cookie` as defense-in-depth fallback:

```typescript
const data = await response.json()
csrfToken = data.token

// Set cookie client-side as fallback: service workers strip Set-Cookie
// from responses passed through event.respondWith(), so the server's
// Set-Cookie may never reach the browser cookie jar.
if (typeof document !== 'undefined' && csrfToken) {
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `csrf-token=${encodeURIComponent(csrfToken)}; path=/; max-age=86400; SameSite=Lax${secure}`
}
```

### lib/csrf.ts
Changed `sameSite: 'strict'` to `sameSite: 'lax'` for better mobile/PWA compatibility:

```typescript
response.cookies.set(CSRF_TOKEN_COOKIE_NAME, token, {
  httpOnly: false,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',  // was 'strict'
  path: '/',
  maxAge: 60 * 60 * 24
})
```

`SameSite=Lax` still blocks cross-site POSTs (the actual CSRF attack vector) but is more compatible with mobile browsers and PWA contexts.

### app/api/csrf-token/route.ts
Always re-set the cookie in the response, even when an existing token is found (to refresh the 24-hour expiry):

```typescript
if (existingToken) {
  const response = NextResponse.json({ token: existingToken })
  return setCsrfTokenCookie(response, existingToken)  // was: return NextResponse.json({ token: existingToken })
}
```

**Commit:** `921efff0` — "fix: CSRF token cookie missing on review submit (mobile/PWA)"

---

## Files Changed

| File | Change |
|------|--------|
| `public/robots.txt` | Added Disallow for /track/, /share/, /certificate/ |
| `app/track/[orderNumber]/page.tsx` | Server-side order validation with notFound() |
| `app/ar/track/[orderNumber]/page.tsx` | Server-side order validation with notFound() |
| `app/ru/track/[orderNumber]/page.tsx` | Server-side order validation with notFound() |
| `app/track/[orderNumber]/OrderTrackingClient.tsx` | Replace null return with loading state |
| `public/sw.js` | Skip /api/csrf-token from SW interception |
| `lib/csrfClient.ts` | Client-side cookie fallback |
| `lib/csrf.ts` | sameSite: strict → lax |
| `app/api/csrf-token/route.ts` | Always re-set cookie in response |

---

## Testing Notes

### Soft 404 Fix
1. Visit `/track/INVALID-ORDER-123` — should show Next.js 404 page (HTTP 404), not "Order Not Found" with 200
2. Visit `/track/REAL-ORDER-NUMBER` — should work as before
3. Check Google Search Console after Vercel deploy and request re-validation

### CSRF Fix
1. Open site in PWA mode (Add to Home Screen)
2. Navigate to a product page
3. Fill out the review form and submit
4. Should succeed without "CSRF token cookie missing" error

**Note:** Users with cached service workers may need one page refresh for the new SW to activate.

---

## Related Documentation
- [GSC_FIXES_2026-02-14.md](./GSC_FIXES_2026-02-14.md) — Previous Google Search Console fixes
- [PWA_IMPLEMENTATION_SUMMARY.md](./PWA_IMPLEMENTATION_SUMMARY.md) — PWA/Service Worker architecture
- [SECURITY_FIXES.md](./SECURITY_FIXES.md) — Security features including CSRF protection

---

*Session Date: March 7, 2026*
