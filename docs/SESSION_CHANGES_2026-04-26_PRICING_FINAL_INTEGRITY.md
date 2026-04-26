# Pricing Final Integrity Pass - Apr 26, 2026

## Context

This pass closed the remaining lower-risk pricing surfaces after the main checkout hardening:

- Invoice email generation
- Manual admin order notification resend
- Development-only order calculation debug endpoint

The payment and order creation routes already recompute totals server-side. These remaining routes did not capture money, but they could display client-submitted totals in emails or debug output.

## Changes

- `/api/invoice/generate` now requires an `orderNumber`, loads the stored order, and builds invoice line items/totals from the database instead of the submitted request body.
- `/api/admin/manual-order-notification` now sends notifications from the stored order record only. Submitted customer names, items, and totals are ignored.
- `/admin/manual-notification` was simplified to request only an existing order number because totals are no longer manually entered.
- `/api/debug/order-calculation` now resolves product records server-side and uses the shared contract-backed cart pricing helper plus shared shipping/VAT config.
- Added `getOrderByNumber()` to `lib/orderStorageDb.ts` for canonical order lookup with items.
- Added regression coverage to ensure invoice/admin notification emails use stored order data when a request submits tampered totals.

## Verification

```bash
npx eslint app/api/invoice/generate/route.ts app/api/admin/manual-order-notification/route.ts app/admin/manual-notification/page.tsx app/api/debug/order-calculation/route.ts lib/orderStorageDb.ts __tests__/api/invoice-admin-pricing-integrity.test.ts
npm test -- --runInBand __tests__/api/invoice-admin-pricing-integrity.test.ts __tests__/api/cod-confirmation-pricing.test.ts __tests__/api/mobile-orders-pricing.test.ts
```

Result: 3 test suites passed, 7 tests passed.

