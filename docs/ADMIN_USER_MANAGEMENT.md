# Admin User Management

> **Last updated**: February 14, 2026  
> **Related**: [ADMIN_ONLINE_USERS_FEATURE.md](./ADMIN_ONLINE_USERS_FEATURE.md), [SESSION_CHANGES_2026-02-14.md](./SESSION_CHANGES_2026-02-14.md)

## Overview

The Admin User Management page (`/admin` → Users tab) displays all registered users with their contact info, order statistics, status badges, activity timestamps, and device/login source. Administrators can search, filter, edit, and delete users.

---

## Page Structure

### Table Columns

| Column | Content |
|--------|---------|
| **User** | Avatar (with online dot), name, email, online badge, device badge, last active time, last login time, registration date |
| **Contact** | Phone, address |
| **Orders** | Order count, total spent (AED) |
| **Status** | Admin badge, "Can see prices", discount badge (e.g. CLINIC 50%) |
| **Actions** | Edit, Delete |

### User Column Details

Each user row displays:
1. **Avatar** — First letter of name, with pulsing green dot if online
2. **Name line** — Name + "Online" badge (if active) + device badge (Desktop/Mobile Web/App)
3. **Email** — Truncated if too long
4. **Timestamps line** (three items):
   - Clock icon + relative time since last activity ("Online now", "5m ago", "2h ago", "Yesterday", etc.)
   - "Login" + formatted last login date/time
   - UserPlus icon + registration date
   - All timestamps show full precision on hover

### Badges

#### Status Badges (right column)

| Badge | Condition | Color |
|-------|-----------|-------|
| Admin | `user.isAdmin === true` | Red |
| Can see prices | `user.canSeePrices === true` | Green |
| CLINIC/VIP X% | `user.discountType` exists | Blue |

#### Device Badges (next to user name)

| Icon | Label | Value | Color |
|------|-------|-------|-------|
| Monitor | Desktop | `desktop_web` | Gray |
| TabletSmartphone | Mobile Web | `mobile_web` | Blue |
| Smartphone | App | `mobile_app` | Purple |

No badge shown when `lastLoginSource` is `null` (unknown — will be set on next login).

---

## Filters

### Status Filters

| Filter | Logic |
|--------|-------|
| Online | `lastActiveAt` within last 5 minutes |
| Has orders | `orderCount > 0` |
| No orders | `orderCount === 0` or undefined |

### Device Filters

| Filter | Logic |
|--------|-------|
| Desktop | `lastLoginSource === 'desktop_web'` |
| Mobile Web | `lastLoginSource === 'mobile_web'` |
| App | `lastLoginSource === 'mobile_app'` |

Filters are toggle-style (click to activate, click again to deactivate). A "Clear" button appears when any filter is active, showing the count of matching users.

---

## Timestamp Display

### Relative Time Format (`formatRelativeTime`)

| Time Since Activity | Display |
|---------------------|---------|
| < 1 minute | "Just now" |
| < 5 minutes | "Online now" |
| < 60 minutes | "Xm ago" |
| < 24 hours | "Xh ago" |
| 1 day | "Yesterday" |
| < 7 days | "Xd ago" |
| < 30 days | "Xw ago" |
| Older | Formatted date |

### Date/Time Format (`formatDateTime`)

| Condition | Format | Example |
|-----------|--------|---------|
| Today | Time only | "09:30 PM" |
| This year | Month day + time | "Feb 14, 09:30 PM" |
| Older | Full date | "Dec 15, 2025" |

### Tooltip (hover)

All timestamps show full precision on hover: "Feb 14, 2026, 09:30:45 PM"

---

## Data Sources

### Order Statistics

- **API**: `GET /api/admin/users`
- **Query**: Single SQL aggregation over `orders` table
- **Logic**: `COUNT(*)` and `SUM(total)` per `customerEmail`, excluding `status = 'CANCELLED'`
- **Fields**: `orderCount`, `totalSpent`, `lastOrderDate`

### User Fields (from DB)

| Field | Source | Notes |
|-------|--------|-------|
| `lastActiveAt` | Activity tracker | Updated on every authenticated request (throttled to 1x/min) |
| `lastLoginAt` | Auth routes | Set once per login |
| `lastLoginSource` | Auth routes | Set on login/registration |
| `createdAt` | User model | Set on registration |
| `canSeePrices` | User model | Admin-editable |
| `discountType`, `discountPercentage` | User model | Admin-editable |

---

## lastLoginSource — Complete Reference

### All Auth Endpoints (as of Feb 14, 2026)

| Endpoint | Source Set | Method | Activity Tracked |
|----------|-----------|--------|-----------------|
| `/api/auth/register` | `desktop_web` / `mobile_web` | User-Agent detection | `trackUserActivityNow()` |
| `/api/auth/login` | `desktop_web` / `mobile_web` | User-Agent detection | `trackUserActivityNow()` |
| `/api/auth/google/callback` | `desktop_web` / `mobile_web` | User-Agent detection | `trackUserActivityNow()` |
| `/api/auth/apple/callback` | `desktop_web` / `mobile_web` | User-Agent detection | `trackUserActivityNow()` |
| `/api/auth/passkey/login-verify` | `desktop_web` / `mobile_web` | User-Agent detection | `trackUserActivityNow()` |
| `/api/auth/session` | — (not a login) | — | `trackUserActivity()` (heartbeat) |
| `/api/mobile/auth/login` | `mobile_app` | Hardcoded | `trackUserActivityNow()` |
| `/api/mobile/auth/register` | `mobile_app` | Hardcoded | (via addUser) |
| `/api/mobile/auth/google` | `mobile_app` | Hardcoded | `trackUserActivityNow()` |
| `/api/mobile/auth/apple` | `mobile_app` | Hardcoded | `trackUserActivityNow()` |
| `/api/mobile/user/profile` | — (not a login) | — | `trackUserActivity()` (heartbeat) |
| `/api/mobile/orders` | — (not a login) | — | `trackUserActivity()` (heartbeat) |

### Detection Logic

**Web endpoints** (User-Agent regex):

```typescript
const userAgent = request.headers.get('user-agent') || ''
const isMobile = /mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase())
const loginSource = isMobile ? 'mobile_web' : 'desktop_web'
```

**Mobile app endpoints**: Always `'mobile_app'` (identified by `x-api-key` header).

### Backfill Logic (Admin Users API)

When `GET /api/admin/users` is called, a lightweight idempotent backfill runs:
- Users with `expoPushToken` and `lastLoginSource: null` → Set to `'mobile_app'`

This only affects users who registered before login source tracking was added.

---

## API Reference

### GET /api/admin/users

**Auth**: Admin required

**Query params**:
- `search` — Filter by name, email, phone
- `limit` — Max users (default 1000)
- `offset` — Pagination offset

**Response**:
```json
{
  "success": true,
  "users": [
    {
      "id": "...",
      "email": "user@example.com",
      "name": "John Doe",
      "phone": "585507717",
      "address": "Jlt, Dubai",
      "profilePicture": "...",
      "isAdmin": false,
      "canSeePrices": true,
      "discountType": "CLINIC",
      "discountPercentage": 50,
      "lastLoginAt": "2026-02-14T17:30:00.000Z",
      "lastLoginSource": "mobile_web",
      "lastActiveAt": "2026-02-14T17:35:00.000Z",
      "createdAt": "2026-01-12T10:00:00.000Z",
      "updatedAt": "2026-02-14T17:35:00.000Z",
      "orderCount": 3,
      "totalSpent": 745.00,
      "lastOrderDate": "2026-02-10T12:00:00.000Z"
    }
  ],
  "total": 378,
  "limit": 1000,
  "offset": 0,
  "hasMore": false
}
```

### PUT /api/admin/users/[id]

**Auth**: Admin required

**Body**: `{ canSeePrices?, discountType?, discountPercentage?, ... }`

### DELETE /api/admin/users/[id]

**Auth**: Admin required

---

## Files

| File | Purpose |
|------|---------|
| `app/admin/page.tsx` | Admin dashboard, fetches users |
| `components/admin/AdminUsersManager.tsx` | User table, filters, badges, timestamps |
| `app/api/admin/users/route.ts` | GET users API — order stats, backfill, sorting |
| `app/api/admin/users/[id]/route.ts` | PUT/DELETE user |
| `lib/activityTracker.ts` | Activity tracking — `lastActiveAt` updates |
| `lib/userStorageDb.ts` | `addUser()`, `updateUser()`, `findUserByEmail()` |

---

## Changelog

| Date | Change |
|------|--------|
| Feb 9–10, 2026 | Online users, lastActiveAt, login source tracking |
| Feb 11, 2026 | Fixed updateUser() not saving lastLoginSource |
| Feb 14, 2026 (AM) | Fixed addUser() dropping lastLoginSource; added Google OAuth + mobile register coverage |
| Feb 14, 2026 (PM) | Added `trackUserActivityNow()` to ALL auth routes. Added session heartbeat for web users. Fixed passkey + mobile Apple missing fields. Improved admin UI with login timestamps, registration dates, and relative time formatting. Simplified backfill logic. |
