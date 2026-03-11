# Session Changes - March 11, 2026

## Summary

Fixed bundle item price display bug affecting both website and mobile app. Previously, per-item bundle discount info was lost after checkout — causing wrong "original price" display on mixed orders (bundle + non-bundle items).

---

## Bug: Wrong Bundle Item Price Display

### Root Cause

Bundle discount info (`fromBundle`, `bundleDiscountPercent`) was sent per-item during checkout but **never stored** in the `OrderItem` database table. Only an order-level `bundleDiscountPercentage` was saved.

Display logic (success page, email templates, mobile order detail) attempted to reverse-calculate original prices using the order-level percentage — but applied it to ALL items, including non-bundle items. This inflated the "original" price of non-bundle items like the Eye Contour Cream (370 AED shown as 435.29 AED).

### Fix: Per-Item `bundleDiscount` Column

Added `bundleDiscount Float?` to the `OrderItem` model. When an item is part of a "Build Your Set" bundle, its bundle discount percentage is now stored directly on the item. Non-bundle items have `NULL`.

### Files Changed

#### Schema & Data Layer
- `prisma/schema.prisma` — Added `bundleDiscount Float?` to `OrderItem` model
- `prisma/migrations/20260311_add_bundle_discount_to_order_items/migration.sql` — Migration SQL
- `lib/orderStorageDb.ts` — Added `bundleDiscount` to `OrderItemData` interface and `addOrder` create logic

#### Checkout Routes (6 routes — store `bundleDiscount` per item)
- `app/api/stripe/create-payment-intent/route.ts` — Website Stripe checkout
- `app/api/checkout/route.ts` — Legacy website COD checkout
- `app/api/orders/cod-confirmation/route.ts` — Website COD confirmation
- `app/api/orders/support-link/route.ts` — Support link checkout
- `app/api/mobile/checkout/stripe/route.ts` — Mobile Stripe checkout
- `app/api/mobile/payments/applepay/intent/route.ts` — Mobile Apple Pay checkout

#### Display Logic (use per-item `bundleDiscount` instead of order-level inference)
- `app/success/SuccessClient.tsx` — Success page item display
- `lib/email/htmlGenerators.ts` — Email item rendering (`renderEnhancedItemRows`)
- `lib/email/templates.ts` — Order confirmation email template
- `lib/email/types.ts` — Added `bundleDiscount` to `OrderHTMLItem`, `OrderConfirmationEmailData`, `AdminNewOrderEmailData`

#### API Responses (return `bundleDiscount` per item)
- `app/api/orders/success/[orderNumber]/route.ts` — Success page API
- `app/api/mobile/orders/route.ts` — Mobile orders API (all item mappings)
- `app/api/webhooks/stripe/route.ts` — Stripe webhook email data

#### Mobile App
- `genosys-mobile-app/app/profile/orders/[id].js` — Order detail screen uses per-item `bundleDiscount`

### Backward Compatibility

- `bundleDiscount` is nullable — existing orders have `NULL` for all items
- Display logic falls back to order-level `bundleDiscountPercentage` when per-item field is `NULL` (legacy behavior)
- New orders will have accurate per-item bundle data

### Deployment Steps

1. Run migration on production DB: `ALTER TABLE "order_items" ADD COLUMN "bundleDiscount" DOUBLE PRECISION;`
2. Deploy website (Vercel auto-deploy on push)
3. Deploy mobile app update (Expo)
