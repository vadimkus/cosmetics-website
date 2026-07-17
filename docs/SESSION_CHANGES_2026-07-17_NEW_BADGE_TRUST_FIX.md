# New badge trust fix — 2026-07-17

## Problem

Category pills on `/products` (mobile + desktop filters) hardcoded **NEW** on
`cream`, `cleanser`, `skin-concern`, `beauty-boxes`, and `bio-meso`. That made
longstanding lines and a UI discovery tool look like new launches.

## Fix

- Added `lib/productBadges.ts` as the single source of truth:
  - **Product launches:** `63` (Revita Glow), `66` (Cerabarrier)
  - **Category NEW:** empty (re-enable only if a whole filter group is new)
- Wired website: `ProductsPageClient`, `ProductFilters`, `ProductInfo`, `pricingEngine`
- Wired mobile API: `/api/mobile/categories` no longer returns Cream / Beauty Boxes as new
- Restored catalog category order (routine flow) instead of “NEW categories first”
- Mobile app `shop.js`: removed hardcoded `Skin Concern` → NEW; no longer reorders by badge

## How to add a future New badge

1. Product launch → add ID to `NEW_LAUNCH_PRODUCT_IDS` in `lib/productBadges.ts`
2. Whole new category filter → add filter id + display name to the category lists there
