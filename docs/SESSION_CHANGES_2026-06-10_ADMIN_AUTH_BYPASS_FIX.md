# Session Changes — 2026-06-10 — Admin Auth Bypass Fix (SEC-1)

## Context

A repo audit (Jun 10, 2026) found the most critical security issue in the codebase:
`verifyAdminAuth()` in `lib/adminAuth.ts` fell back to trusting an **unsigned
`x-admin-email` header** (or `admin-email` cookie) when no signed session cookie
was present. Any request carrying a known admin email gained full admin access
to all `/api/admin/*` routes — no password, no signature, no rate limit.

Two more routes had the same vulnerability class independently:

- `app/api/admin/chat-stats/route.ts` — bespoke `X-Admin-Email` header check
- `app/api/whatsapp/send/route.ts` — `isAuthorized = (apiKey match) || adminEmail`
  (any non-empty header value allowed unauthenticated WhatsApp sends via Twilio)

## Changes Made

### 1. `lib/adminAuth.ts`
- **Removed the legacy email-only fallback** (former lines 116–150). The only
  accepted credential is now a valid HMAC-signed `admin-session` cookie
  (set by `POST /api/auth/admin-login`).
- **Timing-safe signature comparison** in `verifyAdminSessionToken()` —
  replaced `!==` with length-check + `crypto.timingSafeEqual` (removes timing
  oracle).

### 2. `app/api/admin/chat-stats/route.ts`
- Replaced bespoke `X-Admin-Email` header check with `requireAdminAuth(request)`.
- Cleaned an unused `tableError` catch binding (lint).

### 3. `app/api/whatsapp/send/route.ts`
- Removed the `x-admin-email` header from the authorization condition.
- Auth is now: internal API key (`x-api-key` === `INTERNAL_API_KEY`, with
  non-empty-key guard) OR signed admin session via `verifyAdminAuth`.

### 4. `__tests__/lib/adminAuth.test.ts` (new)
- 11 regression tests: header-only and cookie-email-only requests are rejected
  (and never hit the DB); valid signed cookie accepted; tampered/forged/expired
  tokens rejected; demoted admin rejected; token round-trip and malformed-token
  cases.

## Why Nothing Breaks (verified before editing)

- **Admin panel:** login sets the signed `admin-session` cookie (24h) and the
  UI's localStorage marker also expires at 24h — aligned lifetimes. All admin
  fetches are same-origin, so the cookie is always sent; the `X-Admin-Email`
  header the UI still sends is now a harmless no-op.
- **Mobile apps (iOS/Android):** zero references to the header; apps use
  `/api/mobile/*` with JWT + `x-api-key` — untouched.
- **Stripe:** webhook is signature-verified; checkout routes never call
  `verifyAdminAuth` — untouched.
- **Google/Apple login (web + app):** uses `createSessionToken` /
  `generateMobileToken` from `lib/jwt.ts` — untouched.
- **Crons/scripts:** `vercel.json` has no crons; no script uses the header.
- **WhatsApp order-status flow:** uses `/api/whatsapp/order-status` with the
  internal API key, not `/api/whatsapp/send` — untouched.

## Verification

- New test suite: 11/11 passing.
- `npx tsc --noEmit`: clean.
- `npx eslint` on all changed files: clean.
- Full Jest suite: identical to pre-change baseline (27 suites passing; the
  1 failing suite, `__tests__/lib/pricingEngine.test.ts` with 11 failures, was
  confirmed failing on unmodified HEAD — pre-existing, unrelated).

## Post-Deploy Checks (manual)

1. Log into `/admin`, click through Orders / Products / Users / Chatbot /
   Newsletter tabs.
2. Confirm the bypass is closed:
   `curl -X GET https://genosys.ae/api/admin/orders -H "x-admin-email: <admin email>"`
   → must return **401**.
3. Place a test order from the mobile app (sanity).

## Known Edge Case (accepted)

If the browser's `admin-session` cookie is purged while the localStorage UI
marker persists (<24h), the dashboard renders but API calls return 401 with
error toasts. Fix: log out and back in. Previously the insecure header fallback
masked this.

## Related Backlog (NOT done in this session)

- Rotate leaked secrets (`.env.bak` in this repo, `.env.backup` in
  genosys-mobile-app — both git-tracked with live DB credentials) + history scrub.
- `app/api/auth/admin-verify` restores UI auth state from email alone — tighten.
- `app/api/whatsapp/order-status` allows calls without API key ("allowing" branch).
- Guard `app/api/admin/create-payment-blog` (unauthenticated DB write) and
  `app/api/init-db`; fix `ping-search-engines` Bearer check.
- JWT secret fallback derived from `DATABASE_URL` (`lib/jwt.ts:24–32`) — hard-fail
  in prod; remove legacy JSON cookie branch **together with** the JSON fallback
  writers in `app/api/auth/google/callback/route.ts:324–335` and
  `app/api/auth/apple/callback/route.ts` (must die together).
- No CI — add lint/typecheck/jest/gitleaks workflow.
- Pre-existing `pricingEngine.test.ts` failures (11) — investigate separately.

See the full audit in chat session from Jun 10, 2026.
