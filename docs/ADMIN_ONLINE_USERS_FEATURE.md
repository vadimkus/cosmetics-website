# Admin Online Users Feature

> **Date**: February 9-10, 2026  
> **Status**: Implemented and tested  
> **Build**: Passing
> **Updated**: February 10, 2026 - Added login source tracking

## Overview

This feature adds real-time online status tracking for users in the admin portal. Administrators can now see which users are currently active on the website or mobile app, with visual indicators and activity timestamps.

## Features

### 1. Online Status Indicator
- **Green dot** on user avatar when online
- **"Online" badge** next to user name
- Users are considered online if active within the last **5 minutes**

### 2. Last Active Timestamp
- Shows human-readable time since last activity
- Examples: "Online now", "5m ago", "2h ago", "Yesterday", "3d ago"
- Falls back to date format for older activity

### 3. Smart Sorting
- Online/recently active users automatically appear **at the top** of the users list
- Secondary sort by registration date

### 4. Legend
- Updated with green dot indicator explanation
- Located in the Users section header

## Technical Implementation

### Database Schema

Added `lastActiveAt` field to the User model:

```prisma
model User {
  // ... existing fields
  lastActiveAt DateTime? // Tracks last user activity for online status
  // ...
}
```

### Activity Tracking Library

**File**: `lib/activityTracker.ts`

```typescript
// Throttled activity update (max once per minute)
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
- **Non-blocking**: Uses fire-and-forget pattern

### API Endpoints Updated

Activity tracking is integrated into key authenticated endpoints:

| Endpoint | Tracking Type |
|----------|---------------|
| `POST /api/mobile/auth/login` | Immediate (`trackUserActivityNow`) |
| `GET /api/mobile/user/profile` | Throttled (`trackUserActivity`) |
| `GET /api/mobile/orders` | Throttled (`trackUserActivity`) |

### Admin API Changes

**File**: `app/api/admin/users/route.ts`

- Added `lastActiveAt` to returned user fields
- Changed sorting to: `lastActiveAt DESC, createdAt DESC`

### Frontend Component

**File**: `components/admin/AdminUsersManager.tsx`

Changes:
1. Added `lastActiveAt` to User interface
2. Added `isUserOnline()` and `formatLastActive()` helper functions
3. Green dot indicator on avatar (absolute positioned)
4. "Online" badge next to user name
5. Last active timestamp below email
6. Updated legend with online indicator

## Visual Design

### Online User Row
```
┌─────────────────────────────────────────────────────────┐
│ [Avatar]● │ John Doe [Online]        │ Contact │ Orders │
│           │ john@email.com           │         │        │
│           │ Online now               │         │        │
└─────────────────────────────────────────────────────────┘
```

### Legend
```
● Online    [green bg] Has orders    [white bg] No orders
```

## Configuration

### Thresholds

| Setting | Value | Location |
|---------|-------|----------|
| Online threshold | 5 minutes | `lib/activityTracker.ts` |
| Throttle period | 1 minute | `lib/activityTracker.ts` |
| Memory cleanup | >1000 entries | `lib/activityTracker.ts` |

### Customization

To change the online threshold (e.g., to 10 minutes):

```typescript
// In lib/activityTracker.ts
export function isUserOnline(lastActiveAt: Date | null | undefined): boolean {
  if (!lastActiveAt) return false
  const tenMinutesAgo = Date.now() - 10 * 60 * 1000  // Changed from 5
  return new Date(lastActiveAt).getTime() > tenMinutesAgo
}
```

## Files Changed

| File | Change |
|------|--------|
| `prisma/schema.prisma` | Added `lastActiveAt` field to User model |
| `lib/activityTracker.ts` | **NEW** - Activity tracking library |
| `app/api/admin/users/route.ts` | Added `lastActiveAt` to select, updated sorting |
| `app/api/mobile/auth/login/route.ts` | Added immediate activity tracking on login |
| `app/api/mobile/user/profile/route.ts` | Added throttled activity tracking |
| `app/api/mobile/orders/route.ts` | Added throttled activity tracking |
| `components/admin/AdminUsersManager.tsx` | UI updates for online indicator |

## Testing

### Manual Testing

1. **Login Test**:
   - Log in via mobile app
   - Check admin portal - user should show "Online" immediately

2. **Activity Test**:
   - Use the app (view profile, orders)
   - Verify "Online" status persists

3. **Timeout Test**:
   - Wait 5+ minutes without activity
   - Refresh admin portal - should show "Xm ago" instead of "Online"

4. **Sorting Test**:
   - Verify online users appear at top of list
   - Verify recently active users sort above inactive users

### Build Verification

```bash
cd /Users/vadimkus/cosmetics-website
npm run build
```

Build passes with 0 errors in modified files.

---

## Login Source Tracking (Added February 10, 2026)

### Overview

Administrators can now see which platform/device each user last logged in from. This helps identify whether customers are using the desktop website, mobile website, or native mobile app.

### Login Source Icons

| Icon | Label | Value | Color |
|------|-------|-------|-------|
| 🖥️ Monitor | Desktop | `desktop_web` | Gray |
| 📱 TabletSmartphone | Mobile Web | `mobile_web` | Blue |
| 📱 Smartphone | Mobile App | `mobile_app` | Purple |

### Detection Logic

**Mobile App** (`/api/mobile/auth/login`):
- Always sets `lastLoginSource: 'mobile_app'`
- No detection needed - this endpoint is only called by the native app

**Web Login** (`/api/auth/login`):
```typescript
const userAgent = request.headers.get('user-agent') || ''
const isMobileDevice = /mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase())
const loginSource = isMobileDevice ? 'mobile_web' : 'desktop_web'
```

**Apple Sign-In** (`/api/auth/apple/callback`):
- Same User-Agent detection as web login
- Works for both new users and returning users

**Registration** (`/api/auth/register`):
- Sets `lastLoginSource` on account creation
- Uses same User-Agent detection

### Database Schema

```prisma
model User {
  // ... existing fields
  lastLoginSource    String?   // desktop_web, mobile_web, mobile_app
}
```

### Admin UI Display

The login source icon appears next to the "last active" timestamp:

```
┌─────────────────────────────────────────────────────────┐
│ [Avatar]● │ John Doe [Online]        │ Contact │ Orders │
│           │ john@email.com           │         │        │
│           │ 5m ago 📱                │         │        │
└─────────────────────────────────────────────────────────┘
```

### Legend Update

```
● Online    🖥️ Desktop    📱 Mobile Web    📱 Mobile App    
[green bg] Has orders    [white bg] No orders
```

### Files Changed for Login Source

| File | Change |
|------|--------|
| `prisma/schema.prisma` | Added `lastLoginSource String?` |
| `app/api/mobile/auth/login/route.ts` | Sets `mobile_app` |
| `app/api/auth/login/route.ts` | Detects desktop_web/mobile_web |
| `app/api/auth/apple/callback/route.ts` | Detects for Apple Sign-In |
| `app/api/auth/register/route.ts` | Sets on registration |
| `app/api/admin/users/route.ts` | Returns `lastLoginSource` |
| `lib/userStorageDb.ts` | Added to UserData interface |
| `components/admin/AdminUsersManager.tsx` | Added icons and legend |

---

## Future Enhancements

Potential improvements for later:
- Real-time updates via WebSocket (polling currently)
- Filter toggle to show "Online only" users
- Filter by login source (show only mobile app users)
- Activity heatmap (most active hours)
- Export online users list
- Push notification to admin when VIP customer comes online

## Rollback

If needed, to rollback this feature:

1. Remove `lastActiveAt` from `prisma/schema.prisma`
2. Run `npx prisma db push` to remove the column
3. Revert changes to the 6 files listed above

---

*Documentation created: February 9, 2026*  
*Updated: February 10, 2026 - Added login source tracking*
