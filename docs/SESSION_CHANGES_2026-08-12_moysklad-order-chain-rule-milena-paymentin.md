# SESSION CHANGES — 2026-08-12 — Order chain rule + Milena JBR paymentin

## Rule
`.cursor/rules/moysklad-order-chain.mdc` (alwaysApply)

Default paid sales chain:

**SO → INV → SHIP → payment in → SO Доставлен**

Exceptions only when Vadim says SO-only / unpaid / consignment / bank-ref later.

## Milena JBR corrected
| Doc | Number | Sum |
|-----|--------|----:|
| SO | GENCardM260812MILJCAM5 | 750 AED → **Доставлен** |
| Invoice | 04924 | 750 AED |
| Shipment | 06676 | 750 AED |
| Payment in | **06072** (not on live docs) → **06087** 17 Aug | 750 AED |

## Scripts
- `scripts/moysklad-create-milena-jbr-04924-paymentin-20260812.js`
- `scripts/moysklad-create-milena-jbr-camel-cushion-order-20260812.js` updated for full chain
