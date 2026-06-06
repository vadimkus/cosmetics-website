# Admin MoySklad Sync — Full Retail Chain with PaymentIn

**Date:** 2026-06-06

## Change

Updated the `/admin` “Push to MoySklad” flow for website orders.

Before:

- `customerorder` only

Now:

1. `customerorder` (SO)
2. `invoiceout` (invoice)
3. `demand` (отгрузка)
4. `paymentin` (incoming payment) for paid online orders

## Important behavior

- Incoming payment is created as **`paymentin`**, not `cashin`.
- `paymentin` is linked to the created `demand`.
- `paymentin` is created only when website order has:
  - `paymentMethod` = `stripe` or `apple_pay`
  - `paymentStatus` = `paid`
- COD / unpaid / pending orders still create SO → invoice → отгрузка, but no paymentin is created.
- Paid online orders stay in customer-order state **"Оплачен - Ждет доставки"** after sync (not auto-set to **"Доставлен"**).
- Existing database field `moySkladOrderId` still stores the MoySklad customer order ID for backward compatibility with the admin “Synced” badge.
- API response now also returns `moySkladInvoiceId`, `moySkladDemandId`, and `moySkladPaymentInId`.

## Files changed

- `lib/moysklad.ts`
- `app/api/admin/orders/[id]/push-moysklad/route.ts`
- `components/admin/OrderDetails.tsx`
- `components/admin/MobileOwnerAdmin.tsx`
- `app/admin/orders/page.tsx`
- `docs/MOYSKLAD_INTEGRATION.md`

## Verification

- `npx tsc --noEmit --pretty false` passes.
