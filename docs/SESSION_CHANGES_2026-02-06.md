# Session Changes - February 6, 2026

## Summary

Full pricing/discount audit of native mobile app API routes, aligning them with the web checkout routes fixed on February 5. Created comprehensive documentation covering the complete pricing architecture.

---

## Changes Made

### Mobile API Route Fixes

**1. `/api/mobile/orders/route.ts`** (Native app COD orders)
- Added `Math.round(x * 100) / 100` rounding for `subtotal` and `discountAmount` after accumulation loops to prevent floating-point drift (e.g., `187.4999999` → `187.50`)
- Now stores `discountPercentage` in DB order record (field existed in schema but was never populated by mobile routes)
- Customer confirmation email now passes `bundleDiscountPercentage` and `bundleDiscountAmount` for template consistency
- Admin notification email now passes same bundle discount fields
- GET single-order response now includes `discountPercentage`, `bundleDiscountPercentage`, `bundleDiscountAmount`
- GET order-list response now includes same three fields
- POST response now includes same three fields

**2. `/api/mobile/checkout/stripe/route.ts`** (Native app Stripe card payments)
- Added rounding for `serverSubtotal` and `discountAmount`
- Now stores `discountPercentage` in DB on both CREATE and UPDATE order paths

**3. `/api/mobile/payments/applepay/intent/route.ts`** (Native app Apple Pay)
- Added rounding for `serverSubtotal` and `discountAmount`
- Now stores `discountPercentage` in DB on both CREATE and UPDATE order paths

### Documentation Created

**1. `docs/PRICING_DISCOUNT_AUDIT.md`** (NEW)
- Complete architecture diagram (web vs mobile channels)
- Discount types (VIP, Bundle, Black Friday)
- Discount exclusion rules and single sources of truth
- Web checkout flow (forward + reverse calculations)
- Native mobile app flow (server-authoritative)
- All audit findings from Phase 1 (web, Feb 5) and Phase 2 (mobile, Feb 6)
- Calculation logic reference with formulas
- Database schema reference
- Testing checklist
- Complete file modification log

**2. `docs/EMAIL_CHANGELOG.md`** (UPDATED)
- Added Version 1.7.0 (mobile route discount parity)
- Added Version 1.6.0 (bundle discount waterfall & cross-route consistency)

**3. `docs/README.md`** (UPDATED)
- Added `PRICING_DISCOUNT_AUDIT.md` to Quick Links (Important priority)
- Added to Orders & Checkout section
- Updated last-modified date

**4. `docs/SESSION_CHANGES_2026-02-06.md`** (NEW)
- This file

---

## Context

This was the second phase of a two-session pricing audit:

- **Phase 1 (Feb 5)**: Audited and fixed web checkout routes (COD, Support-Link, Stripe, Stripe webhook) for discount calculation discrepancies, especially around bundle discount handling and waterfall display
- **Phase 2 (Feb 6)**: Audited and fixed native mobile app API routes for the same class of issues, ensuring all channels write consistent data to the shared database and produce consistent emails

### Key Finding

Mobile web users (Safari/Chrome on phone) were **already covered** by Phase 1 fixes because they use the same responsive website and web API routes as desktop users. Phase 2 specifically targeted the native mobile app API routes (`/api/mobile/*`).

---

## TypeScript Compilation

All modified files pass TypeScript compilation with zero errors. The only TS errors in the project are pre-existing test file issues in `__tests__/` (unrelated to these changes).
