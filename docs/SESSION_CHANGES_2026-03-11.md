# Session Changes - March 11, 2026

## Summary

1. **Fixed bundle item price display** — per-item `bundleDiscount` column added to prevent wrong original price on mixed bundle orders
2. **Fixed `exactOptionalPropertyTypes` type error** — Vercel build failure in admin email mapping
3. **Removed discontinued support-link payment method** — 1,100+ lines of dead code cleaned out across 15 files

---

## Bug: Wrong Bundle Item Price Display

### Root Cause

Bundle discount info (`fromBundle`, `bundleDiscountPercent`) was sent per-item during checkout but **never stored** in the `OrderItem` database table. Only an order-level `bundleDiscountPercentage` was saved.

Display logic (success page, email templates, mobile order detail) attempted to reverse-calculate original prices using the order-level percentage — but applied it to **all** items, including non-bundle items. This inflated the "original" price of non-bundle items like the Eye Contour Cream (370 AED shown as 435.29 AED).

### Fix: Per-Item `bundleDiscount` Column

Added `bundleDiscount Float?` to the `OrderItem` model. When an item is part of a "Build Your Set" bundle, its bundle discount percentage is now stored directly on the item. Non-bundle items have `NULL`.

### Files Changed (19 files across 2 repos)

#### Schema & Data Layer
- `prisma/schema.prisma` — Added `bundleDiscount Float?` to `OrderItem` model
- `lib/orderStorageDb.ts` — Added `bundleDiscount` to `OrderItemData` interface and `addOrder` create logic

#### Checkout Routes (6 active routes — store `bundleDiscount` per item)
- `app/api/stripe/create-payment-intent/route.ts` — Website Stripe checkout
- `app/api/checkout/route.ts` — Legacy website COD checkout
- `app/api/orders/cod-confirmation/route.ts` — Website COD confirmation
- `app/api/mobile/checkout/stripe/route.ts` — Mobile Stripe checkout (+ `CheckoutItem` interface)
- `app/api/mobile/payments/applepay/intent/route.ts` — Mobile Apple Pay checkout (+ `CheckoutItem` interface)
- `app/api/mobile/orders/route.ts` — Mobile COD order creation (`validatedItems`)
- ~~`app/api/orders/support-link/route.ts`~~ — Removed (see support-link removal below)

#### Display Logic (use per-item `bundleDiscount` instead of order-level inference)
- `app/success/SuccessClient.tsx` — Success page item display (+ `OrderItem` interface)
- `lib/email/htmlGenerators.ts` — Email item rendering (`renderEnhancedItemRows`)
- `lib/email/templates.ts` — Customer confirmation AND admin notification email templates
- `lib/email/types.ts` — Added `bundleDiscount` to `OrderHTMLItem`, `OrderConfirmationEmailData`, `AdminNewOrderEmailData`

#### API Responses (return `bundleDiscount` per item)
- `app/api/orders/success/[orderNumber]/route.ts` — Success page API (select + map)
- `app/api/mobile/orders/route.ts` — Mobile orders API (all 4 item mappings: GET by ID, GET list, POST response, email items)
- `app/api/webhooks/stripe/route.ts` — Stripe webhook email data (+ `OrderItem` interface, customer + admin emails)

#### Mobile App (genosys-mobile-app)
- `app/profile/orders/[id].js` — Order detail screen uses per-item `bundleDiscount` with fallback; fixed badge to show correct per-item percentage

### Backward Compatibility

- `bundleDiscount` is nullable — existing orders have `NULL` for all items
- Display logic falls back to order-level `bundleDiscountPercentage` when per-item field is `NULL` (legacy behavior preserved)
- New orders will have accurate per-item bundle data

### Deployment

- **Database migration**: `ALTER TABLE "order_items" ADD COLUMN "bundleDiscount" DOUBLE PRECISION;` — **DONE** (applied via `prisma db execute`)
- **Website**: Auto-deployed via Vercel on push to `main`
- **Mobile app**: Requires Expo build for next release

### Verification Checklist

- [x] `bundleDiscount Float?` in Prisma schema
- [x] `bundleDiscount` in `OrderItemData` interface
- [x] `addOrder` stores `bundleDiscount` per item
- [x] All 7 checkout routes pass `bundleDiscount` to order items
- [x] Success page API returns `bundleDiscount` per item
- [x] Mobile orders API returns `bundleDiscount` in all 4 item mappings
- [x] Success page display uses per-item `bundleDiscount` with legacy fallback
- [x] Email `renderEnhancedItemRows` uses per-item `bundleDiscount`
- [x] Customer confirmation email template uses per-item `bundleDiscount`
- [x] Admin notification email template uses per-item `bundleDiscount`
- [x] Stripe webhook passes `bundleDiscount` to both customer and admin emails
- [x] Mobile app order detail uses `it.bundleDiscount` with legacy fallback
- [x] Mobile app badge shows correct per-item discount percentage
- [x] Production DB column added
- [x] Zero lint errors

---

## Fix: `exactOptionalPropertyTypes` Type Error

### Problem

Vercel build failed on commit `f815e8e` with:

```
Type error: Object literal may only specify known properties, and 'bundleDiscount' does not exist in type '...' with 'exactOptionalPropertyTypes: true'.
Types of property 'bundleDiscount' are incompatible.
Type 'number | undefined' is not assignable to type 'number | null'.
```

**File:** `app/api/mobile/orders/route.ts` line 571

### Root Cause

The inline type annotation for the admin email item declared `bundleDiscount?: number | null`, but the value was `item.bundleDiscount ?? undefined`. With `exactOptionalPropertyTypes: true`, TypeScript rejects `undefined` as a value for a property typed as `number | null` (the `?` only allows the property to be *omitted*, not explicitly set to `undefined`).

### Fix

Changed `?? undefined` to `?? null` — a one-character fix that matches the declared type.

### Why other `?? undefined` usages are safe

The other `bundleDiscount: item.bundleDiscount ?? undefined` assignments (in customer email mapping and Stripe webhook) target types that explicitly include `| undefined` in their union (`bundleDiscount?: number | null | undefined`), so `undefined` is valid there.

### Commit

`9dbfc402` — `fix: resolve exactOptionalPropertyTypes type error in admin email bundleDiscount`

---

## Refactor: Remove Discontinued Support-Link Payment Method

### Context

The "pay by link" (support-link) payment method was disabled from the checkout UI in February 2026. Only COD and Stripe (online payment) remain as active payment methods. The API route, email templates, service functions, translation keys, and UI code were all still present as dead code — approximately 1,100 lines of unreachable code that added maintenance burden and unnecessary attack surface.

### What Was Removed

| Category | Files | Lines Removed |
|----------|-------|---------------|
| **API routes** | `app/api/orders/support-link/route.ts` (deleted), `app/api/send-sample-support-link/route.ts` (deleted) | ~520 |
| **Email generator** | `generateSupportLinkOrderHTML` from `lib/email/htmlGenerators.ts` | ~220 |
| **Type definition** | `'supportLink'` from `EmailTranslationSection` in `lib/email/types.ts` | 1 |
| **Service function** | `submitSupportLinkOrder` from `services/orders.ts` | 6 |
| **Checkout UI** | Commented-out support-link flow in `app/checkout/CheckoutClient.tsx` | ~25 |
| **Success page** | Support-link conditional branches in `app/success/SuccessClient.tsx` (confetti, cart clear, heading, steps) | ~30 |
| **Template preview** | Support-link tab, v1 function, v2 case from `app/template/page.tsx` | ~120 |
| **Translations** | `orderEmail.supportLink` section + `step*SupportLink` keys from `messages/{en,ar,ru}.json` | ~75 |
| **Test scripts** | `app/api/test-email/route.ts` (case removed), `scripts/create-test-orders.ts` (SUP type removed), `scripts/send-sample-emails.js` (SUP call removed) | ~50 |
| **Comments** | `lib/email/index.ts` comment updated | 1 |

**Total: ~1,100 lines removed across 15 files (2 deleted, 13 modified)**

### Also Fixed

- `app/template/page.tsx` — Several templates were reusing `orderEmail.supportLink.dear` as a generic "Dear {name}" greeting. These were remapped to `orderEmail.statusUpdate.dear` (identical format, still exists).
- `app/template/page.tsx` — COD template was using `orderEmail.supportLink.continueShopping` for its CTA. Remapped to `orderEmail.stripePaymentConfirmation.continueShopping`.

### Active Payment Methods (post-cleanup)

| Method | Website | Mobile App |
|--------|---------|------------|
| **Stripe (online card)** | ✅ | ✅ |
| **COD (cash on delivery)** | ✅ | ✅ |
| **Apple Pay** | — | ✅ |

### Commit

`1e0e357d` — `refactor: remove discontinued support-link payment method`

---

## Full bundleDiscount Audit (19/19 PASS)

Before the above changes, a complete methodical audit was performed reading the actual code in every file. All 19 touchpoints verified correct:

| # | Check | Path | Result |
|---|-------|------|--------|
| 1 | Schema | `prisma/schema.prisma` | ✅ |
| 2 | OrderItemData interface | `lib/orderStorageDb.ts` | ✅ |
| 3 | addOrder function | `lib/orderStorageDb.ts` | ✅ |
| 4 | Website Stripe checkout | `app/api/stripe/create-payment-intent/route.ts` | ✅ |
| 5 | Legacy COD checkout | `app/api/checkout/route.ts` | ✅ |
| 6 | COD confirmation | `app/api/orders/cod-confirmation/route.ts` | ✅ |
| 7 | Support link | `app/api/orders/support-link/route.ts` (now removed) | ✅ |
| 8 | Mobile Stripe (interface + push + create) | `app/api/mobile/checkout/stripe/route.ts` | ✅ |
| 9 | Mobile Apple Pay (interface + push + create) | `app/api/mobile/payments/applepay/intent/route.ts` | ✅ |
| 10 | Mobile COD POST | `app/api/mobile/orders/route.ts` | ✅ |
| 11 | Success page API (select + map) | `app/api/orders/success/[orderNumber]/route.ts` | ✅ |
| 12 | Mobile orders API (5 spots) | `app/api/mobile/orders/route.ts` | ✅ |
| 13 | Success page client | `app/success/SuccessClient.tsx` | ✅ |
| 14 | Email htmlGenerators | `lib/email/htmlGenerators.ts` | ✅ |
| 15 | Email orderConfirmation | `lib/email/templates.ts` | ✅ |
| 16 | Email adminNewOrder | `lib/email/templates.ts` | ✅ |
| 17 | Email types | `lib/email/types.ts` | ✅ |
| 18 | Stripe webhook | `app/api/webhooks/stripe/route.ts` | ✅ |
| 19 | Mobile app | `genosys-mobile-app/app/profile/orders/[id].js` | ✅ |

---

## Commits (this session)

| Commit | Description |
|--------|-------------|
| `9dbfc402` | Fix `exactOptionalPropertyTypes` type error in admin email bundleDiscount |
| `1e0e357d` | Remove discontinued support-link payment method (15 files, ~1,100 lines) |
