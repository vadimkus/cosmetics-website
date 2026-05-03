# Mobile Admin Navigation Fix

Date: 2026-05-03

## Context

On mobile web at `https://genosys.ae/admin`, the owner admin cockpit showed orders and admin stats, but the public mobile footer (`Home / Orders / Bag`) appeared at the bottom. That hid the admin-specific Orders / Users navigation, leaving no clear way to switch to Users from the mobile admin screen.

## Changes

- `components/footer/mobileBottomNavShared.tsx` now hides the public mobile footer on `/admin` routes.
- `components/admin/MobileOwnerAdmin.tsx` now renders visible admin navigation pills inside the sticky admin header:
  - Orders, with open-order count.
  - Users, with total-user count.
- The admin bottom navigation remains as a fallback and now uses a higher z-index than normal mobile chrome.

## Verification

- Focused ESLint on changed files passed.
- `npx tsc --noEmit` passed.
