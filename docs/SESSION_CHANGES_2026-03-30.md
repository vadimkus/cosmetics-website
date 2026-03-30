# Session Changes — March 30, 2026

## Admin Users List: Empty Due to Prisma Accelerate 5MB Limit

### Symptom

Admin dashboard → Users tab showed **"No users found"** with 515 registered users in the database. Orders (99+) and Products (63) loaded normally.

### Root Cause

`GET /api/admin/users` included `profilePicture` (base64-encoded `@db.Text`) in the `findMany` query for all users. With 515 users, the response exceeded **Prisma Accelerate's 5MB response limit** (error `P6009`), causing a silent 500.

```
P6009: The response size of the query exceeded the maximum of 5MB with 5MB.
Consider refining the query by narrowing the selection set or applying appropriate filters.
```

The client's error handling set `users` to `[]` on non-200 responses, showing "No users found" with no visible error.

### Why It Appeared Now

User count grew from ~378 (Feb 2026) to 515 (Mar 2026). More users uploading profile pictures via the mobile app pushed the total response past 5MB.

### Fix

**Commit**: `fa11d839` — 3 files changed

| File | Change |
|------|--------|
| `app/api/admin/users/route.ts` | Removed `profilePicture: true` from `select` fields. Response: **5MB+ → 0.2MB** |
| `app/api/admin/users/[id]/route.ts` | Added `GET` handler — returns full user including `profilePicture` for a single user |
| `app/admin/page.tsx` | `handleSelectCustomer` now fetches `profilePicture` on demand via `GET /api/admin/users/[id]` when opening CustomerProfile. Also updated segmentation `onUserClick` to use the same lazy-load path. |

### Verification

```bash
# Before fix: API returned 500 (P6009)
# After fix:
curl -s -w "%{http_code}" "https://genosys.ae/api/admin/users?limit=3" -H "X-Admin-Email: admin@genosys.ae"
# → 200, returns 515 users in ~0.2MB
```

### Pattern: Prisma Accelerate 5MB Limit

This is the **second** time this limit has caused a production issue:

| Date | Endpoint | Field | Fix |
|------|----------|-------|-----|
| Feb 2026 | `GET /api/analytics` | `userSession.findMany()` | Replaced with aggregate queries |
| **Mar 2026** | `GET /api/admin/users` | `profilePicture` (base64 Text) | Excluded from list, lazy-load per user |

**Rule**: Never include `@db.Text` or large blob fields in `findMany` queries that return unbounded rows through Prisma Accelerate. Fetch them per-record on demand.

### Related Documentation

- [ADMIN_USER_MANAGEMENT.md](./ADMIN_USER_MANAGEMENT.md) — Updated with 5MB fix section, new GET endpoint, changelog
- [ADMIN_ANALYTICS_DASHBOARD.md](./ADMIN_ANALYTICS_DASHBOARD.md) — Same pattern (Feb 2026)

---

## Google Play Download Badge on Homepage

### What Changed

Added a **"GET IT ON Google Play"** badge next to the existing App Store badge on the homepage hero section.

**Commit**: `abb4cf10` — `feat: add Google Play download badge to homepage hero`

### File Changed

| File | Change |
|------|--------|
| `components/Hero.tsx` | Added Google Play badge with Play Store SVG icon, localized text (EN/AR/RU), side-by-side layout with App Store badge |

### Details

- **Link**: `https://play.google.com/store/apps/details?id=ae.genosys.app`
- **Both mobile and desktop** layouts updated
- **Localized** for all 3 languages:
  - EN: "GET IT ON / Google Play"
  - AR: "متوفر على / Google Play"
  - RU: "Доступно в / Google Play"
- **Layout**: Flex row with `gap-2` (mobile) / `gap-3` (desktop) — badges sit side by side
- **Style**: Matches App Store badge — black background, white text, rounded corners, hover state

### Where Badges Appear

| Location | App Store | Google Play |
|----------|-----------|-------------|
| Homepage Hero (mobile) | Yes | **Yes (new)** |
| Homepage Hero (desktop) | Yes | **Yes (new)** |
| Login page | Yes | Not yet |
| Login modal | Yes | Not yet |
| Mobile nav drawer | Yes | Not yet |
| 404 pages | Yes | Not yet |

### Deployment

- Pushed to `main` at `abb4cf10`
- Vercel auto-deployed to production
- Live at [genosys.ae](https://genosys.ae)
