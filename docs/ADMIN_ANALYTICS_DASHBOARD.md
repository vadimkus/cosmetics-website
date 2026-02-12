# Admin Analytics Dashboard

> **Purpose**: Admin dashboard analytics tab showing page views, visitors, orders, sessions, and UX metrics. Uses aggregate queries to stay within Prisma Accelerate's 5MB response limit.

**Last updated**: February 12, 2026

---

## Overview

The Analytics tab in the admin dashboard (`/admin`) displays:

- Total page views, unique visitors, orders placed, revenue
- Top pages, countries, cities
- Device and browser breakdown
- UX metrics: bounce rate, avg session duration, avg page views per session
- PDF download stats

**API**: `GET /api/analytics?type=overview&days=30` (and other types)

---

## 5MB Response Limit Fix (Feb 2026)

### Problem

The analytics API was returning **500** with:

```
The response size of the query exceeded the maximum of 5MB with 5.01MB
```

**Root cause**: `prisma.userSession.findMany()` was fetching **all** user session rows into memory. With many sessions, the response exceeded Prisma Accelerate's 5MB limit.

### Solution

Replaced `findMany()` with aggregate queries that return only computed values:

| Before | After |
|--------|-------|
| `prisma.userSession.findMany(...)` | `prisma.userSession.count(...)` |
| `sessions.filter(s => s.isBounce).length` | `prisma.userSession.count({ where: { isBounce: true } })` |
| `sessions.reduce(...) / sessions.length` | `prisma.userSession.aggregate({ _avg: { duration: true, pageViews: true } })` |

**Files changed**: `app/api/analytics/route.ts`

**Affected endpoints**:
- `type=overview` — UX metrics (bounce rate, avg duration, avg page views)
- `type=ux-metrics` — Same aggregates, standalone

---

## Default Time Range

**Changed from**: `'all'` (entire history)  
**Changed to**: `30` days

The "all time" query runs 10+ parallel Prisma queries with no date filter, which can timeout on Vercel's serverless functions. Using 30 days as the default keeps the initial load fast. Users can still select "All time" from the dropdown.

**File**: `components/AnalyticsDashboard.tsx` — `useState<'all' | number>(30)`

---

## Error Handling

### API Route

- Returns `{ error, detail }` on 500 — `detail` contains the actual error message
- Logs full error with `errorLog`

### Dashboard Component

- Shows error message in red box when API returns non-200
- Parses `detail` from JSON error response for clearer display
- Retry button to re-fetch without full page refresh

---

## API Types

| Type | Description |
|------|-------------|
| `overview` | Main dashboard data + UX metrics |
| `realtime` | Visitors in last 5 minutes |
| `timeline` | Recent page view activity |
| `countries` | Top countries by visitor count |
| `cities` | Top cities by visitor count |
| `devices` | Device type breakdown |
| `browsers` | Top 10 browsers |
| `ux-metrics` | Bounce rate, avg duration, avg page views, orders |
| `pdf-downloads` | PDF download stats |

---

## Database Models Used

- `PageView` — page views, device, browser, country, city
- `UserSession` — sessions, bounce, duration, page views
- `Order` — orders, revenue
- `PDFDownload` — PDF download tracking
- `User` — user registrations

---

## Related Documentation

- [SESSION_CHANGES_2026-02-12.md](./SESSION_CHANGES_2026-02-12.md) — Session log with analytics fixes
