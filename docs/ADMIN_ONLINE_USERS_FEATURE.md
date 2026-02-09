# Admin Online Users Feature

> **Date**: February 9, 2026  
> **Status**: Implemented and tested  
> **Build**: Passing

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

## Future Enhancements

Potential improvements for later:
- Real-time updates via WebSocket (polling currently)
- Filter toggle to show "Online only" users
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
