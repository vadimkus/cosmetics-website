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

*Commit: `17eac5f3` — fix: track user activity across all login methods for accurate online status*
