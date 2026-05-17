# MoySklad Paid Website Order Status

Date: 2026-05-17

## Request

When a customer successfully pays on the website and the admin clicks **Sync with MoySklad**, the newly created MoySklad customer order should not stay in `Новый`; it should start as `Оплачен - Ждет доставки`.

## Change

Updated `lib/moysklad.ts` so customer order creation chooses the initial MoySklad state by website payment method:

- `stripe` / `apple_pay` with website `paymentStatus = paid` -> `Оплачен - Ждет доставки`
- `cod` / unpaid / pending fallback -> `Новый`

MoySklad state IDs:

- `Новый`: `e1a0abf2-33c5-11ea-0a80-043f000b275a`
- `Оплачен - Ждет доставки`: `909556cd-8f70-11ea-0a80-016b00219616`

## Notes

- Existing already-synced MoySklad orders are not modified by this code change.
- The admin push route remains idempotent and still rejects orders already synced to MoySklad.
- `docs/MOYSKLAD_INTEGRATION.md` was updated with the new status rule.
