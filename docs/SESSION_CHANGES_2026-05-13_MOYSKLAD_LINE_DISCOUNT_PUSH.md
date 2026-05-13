# MoySklad Line Discount Push

**Date:** 2026-05-13

## Context

Order **GENCardM2605129487** was a website Bundle Builder order paid by Stripe.
The website/admin stored correct discounted totals, but the MoySklad customer order initially showed final net line prices with `0%` discount.

Required MoySklad behavior:

- Paid bundle lines should show full retail unit price plus **20%** line discount.
- Promo gift lines should show full retail unit price plus **100%** line discount.
- Printed MoySklad documents should visibly show the customer what was discounted.
- Website checkout, Stripe, stored order totals, and admin pricing logic must remain unchanged.

## Change

Updated only the admin MoySklad push payload:

- `app/api/admin/orders/[id]/push-moysklad/route.ts`
  - Reads free promo product retail prices from the product table.
  - Sends `retailPrice` and `discountPercent` to the MoySklad integration layer.
  - Reconstructs bundle retail price from stored final unit price and `order_items.bundleDiscount`.
  - Treats `size === "__PROMO__"` + zero price as a 100% promo gift.

- `lib/moysklad.ts`
  - `MoySkladOrderItem` now accepts optional `retailPrice` and `discountPercent`.
  - Customer order positions now send full price to MoySklad and set the line `discount`.
  - Existing final website price remains available as `price`, but MoySklad uses `retailPrice ?? price` for printable discount display.

## Verification

DB/order payload check for **GENCardM2605129487** produced:

| Item | Qty | MoySklad Price | Discount | Line Total |
|------|----:|---------------:|---------:|-----------:|
| EPI Turnover Boosting Peeling Gel | 1 | 250 | 20% | 200.00 |
| Sea Algae Mask | 1 | 36 | 20% | 28.80 |
| Bio-Ferment Powder Mask | 1 | 250 | 20% | 200.00 |
| PDRN Mask Pack | 1 | 400 | 20% | 320.00 |
| Collagen Mask | 10 | 36 | 20% | 288.00 |
| Collagen Mask promo | 1 | 36 | 100% | 0.00 |
| Sea Algae Mask promo | 1 | 36 | 100% | 0.00 |

Computed total remains **1,036.80 AED**.

MoySklad readback for current order `3292698b-4e6d-11f1-0a80-0bd3000a8c04` confirmed the same price/discount values.

Checks:

- `npx eslint app/api/admin/orders/[id]/push-moysklad/route.ts lib/moysklad.ts` passed.
- Cursor lints for changed files: no errors.
