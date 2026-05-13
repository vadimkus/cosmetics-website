# Admin Bundle Discount Breakdown

**Date:** 2026-05-13

## Context

Customer order **GENCardM2605129487** was created from the website Bundle Builder and paid by Stripe.
The customer confirmation view correctly showed per-line bundle pricing:

- Original retail price
- **-20% Bundle** discount label
- Discounted line price
- Free promo items

In `/admin`, the order detail page only showed the final stored unit price, e.g. `AED 200.00 each`, without the original price or bundle discount context.

## Investigation

The database already stores the required discount metadata:

| Field | Value |
|-------|-------|
| `order.bundleDiscountPercentage` | `20` |
| `order.bundleDiscountAmount` | `259.20` |
| Paid `order_items.bundleDiscount` | `20` per paid bundle line |
| Promo `order_items.size` | `__PROMO__` sentinel |

The issue was display-only in `components/admin/OrderDetails.tsx`.

## Change

Updated `components/admin/OrderDetails.tsx` so admin order details now show:

- Original unit price struck through for bundle lines
- Discounted unit price in green
- `-20% Bundle` badge per discounted line
- Line total before/after discount
- Per-line savings
- `FREE` label for zero-price promo items
- Hide the internal `__PROMO__` sentinel from the visible size display
- Order breakdown includes informational `Bundle savings included` value

No checkout, Stripe, database, MoySklad, or order-total calculation behavior was changed.

## Verification

- `npx eslint components/admin/OrderDetails.tsx` passed.
- Cursor lints for `components/admin/OrderDetails.tsx`: no errors.
- Direct DB check for `GENCardM2605129487` confirmed bundle fields are populated.
