# Session Changes - March 11, 2026

## Summary

Fixed bundle item price display bug affecting both website and mobile app. Previously, per-item bundle discount info was lost after checkout — causing wrong "original price" display on mixed orders (bundle + non-bundle items).

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

#### Checkout Routes (7 routes — store `bundleDiscount` per item)
- `app/api/stripe/create-payment-intent/route.ts` — Website Stripe checkout
- `app/api/checkout/route.ts` — Legacy website COD checkout
- `app/api/orders/cod-confirmation/route.ts` — Website COD confirmation
- `app/api/orders/support-link/route.ts` — Support link checkout
- `app/api/mobile/checkout/stripe/route.ts` — Mobile Stripe checkout (+ `CheckoutItem` interface)
- `app/api/mobile/payments/applepay/intent/route.ts` — Mobile Apple Pay checkout (+ `CheckoutItem` interface)
- `app/api/mobile/orders/route.ts` — Mobile COD order creation (`validatedItems`)

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
