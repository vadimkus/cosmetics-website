# Admin Online Users Feature

> **Date**: February 9-10, 2026  
> **Status**: Implemented and tested  
> **Build**: Passing
> **Updated**: February 14, 2026 — Full activity tracking across all auth routes + admin UI improvements

## Overview

This feature adds real-time online status tracking for users in the admin portal. Administrators can now see which users are currently active on the website or mobile app, with visual indicators, activity timestamps, login timestamps, and registration dates.

## Features

### 1. Online Status Indicator
- **Pulsing green dot** on user avatar when online
- **"Online" badge** next to user name
- Users are considered online if active within the last **5 minutes**

### 2. Activity Timestamps
- **Last active**: Relative time since last activity (e.g., "Just now", "Online now", "5m ago", "2h ago", "Yesterday", "3d ago", "2w ago")
- **Last login**: Formatted date/time of last login (e.g., "Feb 14, 09:30 PM")
- **Registration date**: When the user first registered (e.g., "Jan 12, 2026")
- Full datetime visible on hover tooltip for all timestamps

### 3. Smart Sorting
- Online/recently active users automatically appear **at the top** of the users list
- Users who have never been active sort to the bottom
- Secondary sort by registration date

### 4. Login Source Badges
- **Desktop** (gray badge with Monitor icon) — `desktop_web`
- **Mobile Web** (blue badge with TabletSmartphone icon) — `mobile_web`
- **App** (purple badge with Smartphone icon) — `mobile_app`
- No badge shown when `lastLoginSource` is `null`

### 5. Filters
- **Status filters**: Online, Has orders, No orders
- **Device filters**: Desktop, Mobile Web, App
- **Clear** button when any filter is active

---

## Technical Implementation

### Database Schema

Three fields on the User model power this feature:

```prisma
model User {
  // ... existing fields
  lastLoginAt        DateTime? // Set on every login
  lastLoginSource    String?   // desktop_web, mobile_web, mobile_app
  lastActiveAt       DateTime? // Tracks ongoing activity for online status
  // ...
}
```

**Difference between `lastLoginAt` and `lastActiveAt`:**
- `lastLoginAt` — Updated once per login (set in auth routes). Shows "when did they last log in?"
- `lastActiveAt` — Updated continuously while user is active (throttled to 1x/minute). Shows "are they online right now?"

### Activity Tracking Library

**File**: `lib/activityTracker.ts`

```typescript
// Throttled activity update (max once per minute per user)
trackUserActivity(userId: string): Promise<void>

// Immediate update (for login events)
trackUserActivityNow(userId: string): Promise<void>

// Check if user is online (active within 5 minutes)
isUserOnline(lastActiveAt: Date | null): boolean

// Format last active time for display
formatLastActive(lastActiveAt: Date | null): string
```

**Design Principles**:
- **Fail-safe**: Never throws, never blocks requests
- **Throttled**: Updates DB at most once per minute per user
- **Lightweight**: Minimal performance impact
- **Non-blocking**: Uses fire-and-forget pattern for throttled calls

### How Activity Tracking Works

#### On Login (Immediate)
Every login route calls `trackUserActivityNow(userId)` which immediately sets `lastActiveAt = now()`:

| Endpoint | Login Source Set | Activity Tracked |
|----------|-----------------|-----------------|
| `POST /api/auth/login` | `desktop_web` / `mobile_web` | `trackUserActivityNow()` |
| `GET /api/auth/google/callback` | `desktop_web` / `mobile_web` | `trackUserActivityNow()` |
| `POST /api/auth/apple/callback` | `desktop_web` / `mobile_web` | `trackUserActivityNow()` |
| `POST /api/auth/passkey/login-verify` | `desktop_web` / `mobile_web` | `trackUserActivityNow()` |
| `POST /api/auth/register` | `desktop_web` / `mobile_web` | `trackUserActivityNow()` |
| `POST /api/mobile/auth/login` | `mobile_app` | `trackUserActivityNow()` |
| `POST /api/mobile/auth/google` | `mobile_app` | `trackUserActivityNow()` |
| `POST /api/mobile/auth/apple` | `mobile_app` | `trackUserActivityNow()` |

#### Ongoing Activity (Heartbeat)

**Web users**: The `GET /api/auth/session` endpoint is called every ~5 minutes by `UserRefreshWrapper` on the client side. It now calls `trackUserActivity(userId)` (throttled) to keep `lastActiveAt` fresh while the user has the tab open. No new client-side code was needed — piggybacks on existing session refresh.

**Mobile app users**: The `GET /api/mobile/user/profile` and `GET /api/mobile/orders` endpoints call `trackUserActivity(userId)` (throttled).

### Login Source Detection

**Web endpoints** — detected from User-Agent:
```typescript
const userAgent = request.headers.get('user-agent') || ''
const isMobileDevice = /mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase())
const loginSource = isMobileDevice ? 'mobile_web' : 'desktop_web'
```

**Mobile app endpoints** — always hardcoded:
```typescript
lastLoginSource: 'mobile_app'
```

### Admin API

**File**: `app/api/admin/users/route.ts`

- Returns `lastActiveAt`, `lastLoginAt`, `lastLoginSource`, `createdAt` for each user
- Sorts by: `lastActiveAt DESC NULLS LAST`, then `createdAt DESC`
- Backfill: Tags users with `expoPushToken` as `mobile_app` if `lastLoginSource` is null

### Frontend Component

**File**: `components/admin/AdminUsersManager.tsx`

Key display elements per user row:
1. **Avatar** with pulsing green dot if online
2. **Name** with "Online" badge and device badge
3. **Email**
4. **Activity line** showing:
   - Clock icon + relative time (last active)
   - "Login" + formatted login time
   - UserPlus icon + registration date
5. Full datetime on hover tooltip for all timestamps

Helper functions:
- `isUserOnline(lastActiveAt)` — Checks if within 5 minutes
- `formatRelativeTime(dateStr)` — "Just now", "5m ago", "2h ago", "Yesterday", "3d ago", "2w ago", or formatted date
- `formatDateTime(dateStr)` — "09:30 PM" (today), "Feb 14, 09:30 PM" (this year), "Feb 14, 2025" (older)
- `formatFullDateTime(dateStr)` — Full precision for tooltips

---

## Visual Design

### User Row (Online)
```
┌──────────────────────────────────────────────────────────────────────┐
│ [Avatar]●  │ John Doe [Online] [📱 App]  │ Contact │ Orders │ Status │
│            │ john@email.com               │         │        │        │
│            │ 🕐 Online now · Login 09:30 PM · 👤 Jan 12   │        │
└──────────────────────────────────────────────────────────────────────┘
```

### User Row (Recently Active)
```
┌──────────────────────────────────────────────────────────────────────┐
│ [Avatar]   │ Jane Smith [🖥️ Desktop]     │ Contact │ Orders │ Status │
│            │ jane@email.com               │         │        │        │
│            │ 🕐 2h ago · Login Feb 14, 09:30 PM · 👤 Feb 1  │        │
└──────────────────────────────────────────────────────────────────────┘
```

### Filter Bar
```
● Online    ◻ Has orders    ◻ No orders  |  🖥️ Desktop    📱 Mobile Web    📱 App    [Clear]
```

---

## Configuration

### Thresholds

| Setting | Value | Location |
|---------|-------|----------|
| Online threshold | 5 minutes | `lib/activityTracker.ts` + `AdminUsersManager.tsx` |
| Throttle period | 1 minute | `lib/activityTracker.ts` |
| Memory cleanup | >1000 entries | `lib/activityTracker.ts` |
| Session heartbeat | ~5 minutes | `UserRefreshWrapper` (client-side) |

---

## Files

| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | `lastActiveAt`, `lastLoginAt`, `lastLoginSource` fields on User model |
| `lib/activityTracker.ts` | Activity tracking library — throttled + immediate updates |
| `app/api/auth/session/route.ts` | Web heartbeat — calls `trackUserActivity()` on session check |
| `app/api/auth/login/route.ts` | Web login — `trackUserActivityNow()` + `lastLoginSource` |
| `app/api/auth/google/callback/route.ts` | Web Google OAuth — `trackUserActivityNow()` + `lastLoginSource` |
| `app/api/auth/apple/callback/route.ts` | Web Apple Sign-In — `trackUserActivityNow()` + `lastLoginSource` |
| `app/api/auth/passkey/login-verify/route.ts` | Web passkey — `trackUserActivityNow()` + `lastLoginSource` |
| `app/api/auth/register/route.ts` | Web registration — `trackUserActivityNow()` + `lastLoginSource` |
| `app/api/mobile/auth/login/route.ts` | Mobile login — `trackUserActivityNow()` + `lastLoginSource` |
| `app/api/mobile/auth/google/route.ts` | Mobile Google OAuth — `trackUserActivityNow()` + `lastLoginSource` |
| `app/api/mobile/auth/apple/route.ts` | Mobile Apple Sign-In — `trackUserActivityNow()` + `lastLoginSource` |
| `app/api/mobile/user/profile/route.ts` | Mobile heartbeat — `trackUserActivity()` (throttled) |
| `app/api/mobile/orders/route.ts` | Mobile heartbeat — `trackUserActivity()` (throttled) |
| `app/api/admin/users/route.ts` | Admin API — returns all user fields, sorted by activity |
| `components/admin/AdminUsersManager.tsx` | Admin UI — table with timestamps, badges, filters |

---

## Testing

### Manual Testing

1. **Web Login Test**:
   - Log in via email/password, Google, Apple, or passkey on web
   - Check admin portal — user should show "Online now" immediately
   - `lastLoginSource` should show "Desktop" or "Mobile Web" depending on device

2. **Web Heartbeat Test**:
   - Stay logged in with the tab open for 5+ minutes
   - Refresh admin portal — user should still show "Online now"
   - Close the tab, wait 5+ minutes — should show "Xm ago"

3. **Mobile App Login Test**:
   - Log in via mobile app
   - Check admin portal — should show "Online now" with "App" badge

4. **Timestamp Test**:
   - Verify "Last login" shows correct date/time
   - Verify "Registered" date shows when user created their account
   - Hover over timestamps to see full precision

5. **Sorting Test**:
   - Online users appear at top of list
   - Recently active users sort above inactive users
   - Users who never logged in appear at bottom

---

## Changelog

| Date | Change |
|------|--------|
| Feb 9, 2026 | Initial online users feature — `lastActiveAt`, activity tracker, green indicators |
| Feb 10, 2026 | Added login source tracking — `lastLoginSource`, device badges, detection logic |
| Feb 11, 2026 | Fixed `updateUser()` not saving `lastLoginSource` |
| Feb 14, 2026 (AM) | Fixed `addUser()` dropping `lastLoginSource`; added Google OAuth + mobile register coverage |
| Feb 14, 2026 (PM) | **Major fix**: Added `trackUserActivityNow()` to ALL auth routes (web + mobile). Added session heartbeat for web users. Fixed missing `lastLoginSource` in passkey and mobile Apple routes. Improved admin UI with login timestamps and registration dates. Simplified backfill logic. |

---

## Future Enhancements

Potential improvements for later:
- Real-time updates via WebSocket (polling currently)
- Activity heatmap (most active hours)
- Export online users list
- Push notification to admin when VIP customer comes online

---

*Documentation created: February 9, 2026*  
*Last updated: February 14, 2026*
