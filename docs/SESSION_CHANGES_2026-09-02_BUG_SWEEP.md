# Bug sweep: money path, auth, app runtime

**Date:** 2 September 2026
**Repos:** `cosmetics-website`, `genosys-mobile-app`

Three parallel code audits, every finding re-read against the source before
anything was changed. Fixed what was confirmed and cheap enough to do safely
today; the rest is listed at the end with why it waits.

## Fixed

### Anyone could cancel anyone's order (Critical)

`POST /api/orders/[id]/cancel` checked only the CSRF token, which every visitor
is issued on page load. No session, no ownership, no status check: an order id
was enough to cancel a stranger's shipped order and trigger the loyalty
reversal on it. Now requires a session, the order must belong to that email,
and only an unpaid PENDING order can be cancelled from here (the one case the
website shows the button for, and the rule the mobile route already applied).
Missing and someone-else's orders get the same 404 so ids cannot be probed.
Eight tests in `__tests__/api/orders-cancel-auth.test.ts`.

### COD order number came from the browser (High)

The checkout page mints `CODW` + date + four random digits and the server stored
whatever arrived: any string, or a number another order already held. It now
keeps the page's number only when well-formed and unused, otherwise mints one
server-side, and the response carries the final number. The page follows that
number to the success screen.

Found alongside it: the page redirected to the success screen even when the
server answered 4xx, so a rejected order (validation, rate limit) told the
customer it was placed when nothing existed. It now shows the server's message
and stays put. Only a network timeout still falls through, since the server may
be finishing the save. New `checkout.orderNotPlaced` string in EN, RU, AR.

### Earned points survived a cancellation (High)

Cancelling reversed what the customer had spent at checkout but never what a
delivered order had paid out, so DELIVERED -> CANCELLED left them holding the
points. `reverseEarnForOrder` writes an `EARN_REVERSAL` row under the same
`(orderId, type)` idempotency as the rest of the ledger and recalculates stats.
Wired into the admin status route.

### Payment-status poll leaked name and email (Medium)

`GET /api/stripe/payment-status` is unauthenticated and keyed by the Stripe id
that sits in the redirect URL. It returned `customerEmail`, `customerName` and
`customer_email` in both response shapes. The success page reads only items,
number, total and status, so the PII is gone from the response.

### Google sign-in accepted unverified addresses (Medium)

`verifyGoogleIdToken` never read `email_verified`. A Google account carrying an
unverified non-Gmail address is a claim about someone else's email, and the
flow links by email to whichever existing account has it. Now rejected. Gmail
and Workspace addresses are always verified, so real users are unaffected.

### Admin login kept a plaintext branch (Medium)

A `===` comparison for non-bcrypt admin passwords, timing-leaky by nature. The
only admin has been on bcrypt for months; the branch was dead code that could
only help an attacker. Removed.

### Reset token prefix in debug log (Low)

`passwordReset.ts` logged the first ten characters of the plaintext reset token
under `DEBUG_LOG`. Removed.

### Mobile app

- **Checkout could spin forever.** Order POSTs go through `authenticatedFetch`
  for the token-refresh retry, which bypassed `httpClient`'s 15 s limit. They
  now carry their own `AbortController` and surface a timeout message.
- **A broken saved cart line crashed the bag on open.** A stored item with no
  product survived load; `bag.js`'s `keyExtractor` and every cart method then
  read `item.product.id`. Lines without a product id are dropped once at load,
  and the key is defensive.
- **Order detail could show the wrong order.** Tap A, back, tap B: A's fetch
  landing second overwrote B. A request sequence guards the writes.

## Verified, not fixed today

Each is real. Each is bigger than a same-day change should be.

1. **Revoked tokens keep working on data routes for up to 30 days.** Only the
   heartbeat, refresh and validate routes compare `tokenVersion`; the ~50 data
   routes verify the signature and stop. After a password reset a stolen token
   still works against the API directly. The auth-then-load pattern varies too
   much across those files for a codemod; the fix is a shared
   `requireMobileUser` / `requireWebUser` helper and a route-by-route migration.
2. **Loyalty redemption is quoted, then deducted later.** Two checkouts in
   flight can both be granted the same points; the ledger goes negative. Needs
   an atomic reserve inside the order transaction.
3. **COD DB-timeout fallback.** When the save times out the route still emails
   and returns success; the redemption settles in a background retry that only
   logs on failure. Needs an ops alert or a shorter, honest failure.
4. **Admin status transitions have no state machine.** PENDING -> DELIVERED is
   accepted and awards points immediately.
5. **Login falls back to an unsigned JSON cookie if JWT signing throws**, then
   returns 200 with a cookie the next request rejects.
6. **Password-reset lookup bcrypt-compares every live token** (O(n)).
7. **Mobile 401 retry repeats a POST with no idempotency key.**

## Checked and found correct

Server-side repricing on all three checkout paths; Stripe webhook signature
and idempotent paid-transition; loyalty earn and redeem idempotency via the
unique index; quantity and stock enforced server-side; admin routes behind
`requireAdminAuth`; mobile cancel ownership; order-list and success-page
ownership; CSRF on all mutations; rate limits on checkout; single-use reset
tokens; bcrypt-null guard for social accounts on email login; JWT hard-fails
without a secret in production; profile update allowlist blocks `isAdmin`.
App: hooks order on all screens; 1,619 i18n keys present in all three
locales; `finally { setLoading(false) }` on every auth path; token in
SecureStore; Live Activity calls behind a Platform guard; notification routing
resolves to a real screen.
