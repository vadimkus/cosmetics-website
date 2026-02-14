# Session Changes — February 14, 2026

## Fix: lastLoginSource Not Set for Google OAuth Users

### Summary

Fixed a bug where users registering or logging in via Google OAuth (both mobile app and web) were not getting their `lastLoginSource` field set. This caused the admin User Management page to show no device badge (e.g., "Mobile App", "Desktop", "Mobile Web") for these users.

**Reported symptom**: Alex Krapotkin registered via mobile app using Google OAuth but had no "Mobile App" badge in the admin panel.

---

### Root Causes

1. **`addUser()` silently dropped `lastLoginSource`** — The `baseData` object in `lib/userStorageDb.ts` did not include `lastLoginSource` or `lastLoginAt`, so even when callers passed these fields, they were ignored by `prisma.user.create()`.

2. **Mobile Google OAuth didn't pass `lastLoginSource`** — The `/api/mobile/auth/google` endpoint didn't set `lastLoginSource: 'mobile_app'` during registration or login.

3. **Mobile email/password registration didn't set `lastLoginSource`** — The `/api/mobile/auth/register` endpoint (which uses `tx.user.create()` directly) was missing `lastLoginSource: 'mobile_app'`.

4. **Web Google OAuth endpoints didn't set `lastLoginSource`** — Both `/api/auth/google/callback` and `/api/auth/google/verify` didn't detect the device or set `lastLoginSource` for new or returning users.

---

### Files Changed

| File | Change |
|------|--------|
| `lib/userStorageDb.ts` | Added `lastLoginSource` and `lastLoginAt` to `baseData` in `addUser()` |
| `app/api/mobile/auth/google/route.ts` | Added `lastLoginSource: 'mobile_app'` for both registration and login paths |
| `app/api/mobile/auth/register/route.ts` | Added `lastLoginSource: 'mobile_app'` to `UserCreateInput` |
| `app/api/auth/google/callback/route.ts` | Added User-Agent device detection + `lastLoginSource` for registration and login |
| `app/api/auth/google/verify/route.ts` | Added User-Agent device detection + `lastLoginSource` for registration and login |

---

### Auth Endpoints — lastLoginSource Coverage (After Fix)

| Endpoint | Source Set | Method |
|----------|-----------|--------|
| `/api/auth/register` | `desktop_web` / `mobile_web` | User-Agent detection |
| `/api/auth/login` | _(not checked — verify separately)_ | — |
| `/api/auth/google/callback` | `desktop_web` / `mobile_web` | User-Agent detection (NEW) |
| `/api/auth/google/verify` | `desktop_web` / `mobile_web` | User-Agent detection (NEW) |
| `/api/auth/apple/callback` | `desktop_web` / `mobile_web` | User-Agent detection (already existed) |
| `/api/mobile/auth/login` | `mobile_app` | Hardcoded (already existed) |
| `/api/mobile/auth/register` | `mobile_app` | Hardcoded (NEW) |
| `/api/mobile/auth/google` | `mobile_app` | Hardcoded (NEW) |

---

### Risk Assessment

- **No breaking changes** — All modifications are additive (setting a nullable field that was previously left `null`)
- **Worst-case failure** — Wrong badge or no badge; never a failed registration
- **No schema changes** — `lastLoginSource` column already exists in the database

---

### Notes

- The backfill logic in `/api/admin/users` (tags users with `expoPushToken` as `mobile_app`) remains as a safety net
- Users who already registered without `lastLoginSource` will get their badge updated on their next login
- Alex Krapotkin's badge will update on his next mobile app login
