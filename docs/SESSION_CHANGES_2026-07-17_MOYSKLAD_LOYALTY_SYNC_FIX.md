# MoySklad sync — loyalty rewards total mismatch (2026-07-17)

## Symptom

Admin **Push to MoySklad** failed:

`mapped total AED 605.00 does not match order total AED 535.00`

Order: **GENCardM2607176967** / Alesya Sokolenko (`olesya.11.89@mail.ru`)

## Cause

| Component | AED |
|---|---:|
| PDRN Mask Pack + Mist | 560 |
| Free collagen promo | 0 |
| Shipping | 45 |
| **Mapped (no loyalty)** | **605** |
| GENOSYS Rewards (1,400 pts) | −70 |
| **Website total** | **535** |

Loyalty discount was never passed into `createMoySkladOrder`.

## Fix

- `lib/moysklad.ts` — `loyaltyDiscountAmount` / `applyLoyaltyDiscountToPositions`
- `app/api/admin/orders/[id]/push-moysklad/route.ts` — pass loyalty fields
- Unit test: `__tests__/lib/moyskladLoyaltyDiscount.test.ts`

## This order

Pushed via `scripts/moysklad-push-alesya-sokolenko-gencardm2607176967-20260717.ts` after the fix.

**Deploy** required before admin UI push works for other loyalty orders.
