# Admin User Management

> **Last updated**: March 30, 2026  
> **Related**: [ADMIN_ONLINE_USERS_FEATURE.md](./ADMIN_ONLINE_USERS_FEATURE.md), [SESSION_CHANGES_2026-02-14.md](./SESSION_CHANGES_2026-02-14.md), [ADMIN_ANALYTICS_DASHBOARD.md](./ADMIN_ANALYTICS_DASHBOARD.md) (same 5MB pattern)

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
- `search` — Filter by name, email, phone (case-insensitive)
- `limit` — Max users (default 1000)
- `offset` — Pagination offset

**Response** (~0.2MB for 515 users):
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
  "total": 515,
  "limit": 1000,
  "offset": 0,
  "hasMore": false
}
```

> **Note**: `profilePicture` is excluded from the list response to stay under Prisma Accelerate's 5MB limit. Use the single-user GET endpoint below to fetch it.

### GET /api/admin/users/[id]

**Auth**: Admin required

Fetches a single user including `profilePicture`. Called on demand when opening a customer profile from the user list.

**Response**:
```json
{
  "success": true,
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "John Doe",
    "profilePicture": "data:image/jpeg;base64,...",
    "..."
  }
}
```

### PUT /api/admin/users/[id]

**Auth**: Admin + CSRF required

**Body**: `{ canSeePrices?, discountType?, discountPercentage?, name?, email?, phone?, address?, birthday?, profilePicture? }`

Sends discount assignment email when discount is newly assigned or changed.

### DELETE /api/admin/users/[id]

**Auth**: Admin + CSRF required

Deletes user and cleans up related `user_actions` analytics records.

---

## 5MB Response Limit Fix (Mar 30, 2026)

### Problem

Admin Users tab showed **"No users found"** despite 515 registered users. The API was returning **500** silently:

```
P6009: The response size of the query exceeded the maximum of 5MB with 5MB.
```

**Root cause**: `profilePicture` (base64-encoded `@db.Text`) was included in the `findMany` query for all 515 users. With profile pictures averaging ~10KB each, the total response exceeded Prisma Accelerate's 5MB response cap.

This is the same pattern as the [Analytics Dashboard 5MB fix](./ADMIN_ANALYTICS_DASHBOARD.md) from February 2026.

### Solution

| Change | Before | After |
|--------|--------|-------|
| List query `select` | Included `profilePicture` | Excluded — 5MB+ → 0.2MB |
| Individual user fetch | No GET endpoint | New `GET /api/admin/users/[id]` returns full user with `profilePicture` |
| Customer profile open | Used list data directly | Lazy-loads `profilePicture` via GET on click |

### Why It Happened

The query grew past 5MB as user count increased from ~378 (Feb 2026) to 515 (Mar 2026). Users uploading profile pictures via the mobile app tipped the response over the limit.

### Lesson: Prisma Accelerate 5MB Limit

Prisma Accelerate enforces a **5MB response limit** per query. Any `findMany` that returns `@db.Text` or binary-like fields at scale will hit this. Always:
- Exclude large text fields from list queries
- Fetch them per-record on demand
- Monitor response size as user count grows

---

## Files

| File | Purpose |
|------|---------|
| `app/admin/page.tsx` | Admin dashboard, fetches users, lazy-loads profilePicture |
| `components/admin/AdminUsersManager.tsx` | User table, filters, badges, timestamps |
| `app/api/admin/users/route.ts` | GET users list — order stats, backfill, sorting (no profilePicture) |
| `app/api/admin/users/[id]/route.ts` | GET single user (with profilePicture), PUT, DELETE |
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
| **Mar 30, 2026** | **5MB fix**: Remove `profilePicture` from list query (P6009). Add `GET /api/admin/users/[id]`. Lazy-load profile picture in CustomerProfile. Response: 5MB+ → 0.2MB. |
