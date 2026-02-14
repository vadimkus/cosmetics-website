# Admin User Management

> **Last updated**: February 14, 2026  
> **Related**: [ADMIN_ONLINE_USERS_FEATURE.md](./ADMIN_ONLINE_USERS_FEATURE.md), [SESSION_CHANGES_2026-02-14.md](./SESSION_CHANGES_2026-02-14.md)

## Overview

The Admin User Management page (`/admin` → Users tab) displays all registered users with their contact info, order statistics, status badges, and device/login source. Administrators can search, filter, edit, and delete users.

---

## Page Structure

### Table Columns

| Column | Content |
|--------|---------|
| **User** | Avatar, name, email, online indicator, device badge, last active time |
| **Contact** | Phone, address |
| **Orders** | Order count, total spent (AED) |
| **Status** | Admin badge, "Can see prices", discount badge (e.g. CLINIC 50%) |
| **Actions** | Edit, Delete |

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
| Smartphone | Mobile App | `mobile_app` | Purple |

No badge shown when `lastLoginSource` is `null` (unknown).

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
| `lastLoginSource` | User model | Set on login/registration |
| `lastActiveAt` | Activity tracker | Throttled updates |
| `canSeePrices` | User model | Admin-editable |
| `discountType`, `discountPercentage` | User model | Admin-editable |

---

## lastLoginSource — Complete Reference

### All Auth Endpoints (as of Feb 14, 2026)

| Endpoint | Source Set | Method |
|----------|-----------|--------|
| `/api/auth/register` | `desktop_web` / `mobile_web` | User-Agent detection |
| `/api/auth/login` | `desktop_web` / `mobile_web` | User-Agent detection |
| `/api/auth/google/callback` | `desktop_web` / `mobile_web` | User-Agent detection |
| `/api/auth/google/verify` | `desktop_web` / `mobile_web` | User-Agent detection |
| `/api/auth/apple/callback` | `desktop_web` / `mobile_web` | User-Agent detection |
| `/api/mobile/auth/login` | `mobile_app` | Hardcoded |
| `/api/mobile/auth/register` | `mobile_app` | Hardcoded |
| `/api/mobile/auth/google` | `mobile_app` | Hardcoded |

### Detection Logic

**Web endpoints** (User-Agent regex):

```typescript
const userAgent = request.headers.get('user-agent') || ''
const isMobile = /mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase())
const loginSource = isMobile ? 'mobile_web' : 'desktop_web'
```

**Mobile app endpoints**: Always `'mobile_app'` (identified by `x-api-key` header).

### Backfill Logic (Admin Users API)

When `GET /api/admin/users` is called:

1. **expoPushToken users** → Set `lastLoginSource: 'mobile_app'` (reliable signal)
2. **desktop_web users without expoPushToken** who haven't logged in today → Reset to `null` (avoid stale wrong data)

### Key Implementation Details

- **addUser()** (`lib/userStorageDb.ts`): Must include `lastLoginSource` and `lastLoginAt` in `baseData` — previously these were silently dropped.
- **updateUser()**: Correctly maps `lastLoginSource` (fixed Feb 11, 2026).
- **Direct Prisma creates** (e.g. mobile register): Must explicitly add `lastLoginSource: 'mobile_app'` to `UserCreateInput`.

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
      "email": "...",
      "name": "...",
      "phone": "...",
      "address": "...",
      "profilePicture": "...",
      "isAdmin": false,
      "canSeePrices": true,
      "discountType": "CLINIC",
      "discountPercentage": 50,
      "lastLoginAt": "...",
      "lastLoginSource": "mobile_app",
      "lastActiveAt": "...",
      "createdAt": "...",
      "orderCount": 0,
      "totalSpent": 0,
      "lastOrderDate": null
    }
  ],
  "total": 42,
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
| `components/admin/AdminUsersManager.tsx` | User table, filters, badges |
| `app/api/admin/users/route.ts` | GET users, order stats, backfill |
| `app/api/admin/users/[id]/route.ts` | PUT/DELETE user |
| `lib/activityTracker.ts` | Online status, lastActiveAt |
| `lib/userStorageDb.ts` | addUser, updateUser, findUserByEmail |

---

## Changelog

| Date | Change |
|------|--------|
| Feb 9–10, 2026 | Online users, lastActiveAt, login source tracking |
| Feb 11, 2026 | Fixed updateUser() not saving lastLoginSource |
| Feb 14, 2026 | Fixed addUser() dropping lastLoginSource; added Google OAuth + mobile register coverage |
