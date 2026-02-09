# Session Changes - February 9, 2026

## iOS App Store Launch & Download Links

### Summary
The Genosys UAE iOS app was approved and published to the App Store. Added official "Download on the App Store" badges throughout the website to promote the app.

### App Details

| Field | Value |
|-------|-------|
| App Name | Genosys UAE |
| Version | 1.1.0 |
| Platform | iOS |
| App SKU | GENOSYSUAE001 |
| Apple ID | 6756648064 |
| App Store URL | https://apps.apple.com/app/id6756648064 |

### Features Added

1. **Homepage App Store Badge** (`components/Hero.tsx`)
   - Official Apple badge design (black rounded rectangle)
   - Apple logo + two-line text: "Download on the" / "App Store"
   - Positioned below AI Skin Analysis link
   - Both mobile and desktop layouts
   - Localized for EN, AR, RU

2. **Mobile Web Hamburger Menu** (`components/header/MobileWebHeader.tsx`)
   - Centered badge with subtle border
   - Compact, elegant design matching Apple guidelines
   - Positioned after AI Skin Analysis / Training links
   - Vertically centered Apple icon

### Badge Design

```jsx
// Official Apple App Store badge style
<a 
  href="https://apps.apple.com/app/id6756648064"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg"
>
  <AppleIcon className="w-6 h-6" />
  <div className="flex flex-col leading-tight">
    <span className="text-[10px]">Download on the</span>
    <span className="text-base font-semibold">App Store</span>
  </div>
</a>
```

### Translations

| Language | "Download on the" |
|----------|-------------------|
| English | Download on the |
| Arabic | حمّل من |
| Russian | Загрузите в |

### Files Changed

| File | Change Type | Description |
|------|-------------|-------------|
| `components/Hero.tsx` | Modified | Added App Store badge (mobile + desktop) |
| `components/header/MobileWebHeader.tsx` | Modified | Added App Store button in hamburger menu |

### Commits

1. `8a62f955` - feat: add App Store download links for iOS app launch
2. `24d57b0a` - style: update App Store badge to official Apple design
3. `cac00ed1` - style: refine App Store badge in hamburger menu
4. `a292efc6` - fix: center Apple icon vertically in App Store badge

---

## Admin Online Users Feature

### Summary
Implemented real-time online user tracking in the admin portal. Administrators can now see which users are currently active, with visual indicators and smart sorting.

### Features Added

1. **Online Status Indicator**
   - Green dot on user avatar when online (active within 5 minutes)
   - "Online" badge displayed next to user name
   - Last activity timestamp shown below email

2. **Smart Sorting**
   - Online/recently active users automatically appear at top
   - Secondary sort by registration date

3. **Activity Tracking**
   - Throttled updates (max once per minute per user)
   - Non-blocking, fail-safe implementation
   - Tracks activity on login, profile views, and orders

### Files Changed

| File | Change Type | Description |
|------|-------------|-------------|
| `prisma/schema.prisma` | Modified | Added `lastActiveAt DateTime?` field to User model |
| `lib/activityTracker.ts` | **New** | Activity tracking library with throttling |
| `app/api/admin/users/route.ts` | Modified | Added `lastActiveAt` to select, updated sort order |
| `app/api/mobile/auth/login/route.ts` | Modified | Added immediate activity tracking on login |
| `app/api/mobile/user/profile/route.ts` | Modified | Added throttled activity tracking |
| `app/api/mobile/orders/route.ts` | Modified | Added throttled activity tracking |
| `components/admin/AdminUsersManager.tsx` | Modified | Added online indicator UI, helper functions |

### Database Changes

```sql
-- Added to users table
ALTER TABLE users ADD COLUMN "lastActiveAt" TIMESTAMP;
```

Migration applied via `npx prisma db push`.

### API Changes

**Admin Users API** (`GET /api/admin/users`)
- Now returns `lastActiveAt` field for each user
- Results sorted by `lastActiveAt DESC, createdAt DESC`

**Mobile APIs** (Login, Profile, Orders)
- Now update `lastActiveAt` on authenticated requests

### Testing

- TypeScript compilation: ✅ Passing
- Production build: ✅ Passing (285 pages generated)
- Database schema: ✅ Verified

### Documentation

- Created `docs/ADMIN_ONLINE_USERS_FEATURE.md` - Full feature documentation
- Updated `docs/README.md` - Added Admin Portal section and session log reference

---

## Technical Details

### Activity Tracker Design

```typescript
// Throttle map to prevent DB spam
const lastUpdateMap = new Map<string, number>()
const THROTTLE_MS = 60 * 1000 // 1 minute

// Online threshold
const ONLINE_THRESHOLD_MS = 5 * 60 * 1000 // 5 minutes
```

### UI Components

**Online Indicator (Avatar)**
```jsx
{isUserOnline(user.lastActiveAt) && (
  <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-green-500 border-2 border-white rounded-full" />
)}
```

**Online Badge (Name)**
```jsx
{isUserOnline(user.lastActiveAt) && (
  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-700">
    Online
  </span>
)}
```

---

*Session completed: February 9, 2026*
