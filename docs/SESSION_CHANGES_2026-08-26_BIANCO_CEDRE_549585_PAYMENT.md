# Bianco Cedre — 5,495.85 AED bank receipt — 2026-08-26

**Customer:** Bianco Spa FZCO (Cedre Center)  
**RAK reference:** `000207887348`  
**Bank receipt:** 26 Aug 2026, 11:40:26

## Exact reconciliation

| Settlement item | Amount (AED) |
|---|---:|
| Reports 00931, 01055, 01300, 01301, 01324, 01335 | 4,459.00 |
| Invoice 04780 / shipment 06492 | 1,040.00 |
| **Gross customer settlement** | **5,499.00** |
| Bank transfer charge: 3.00 + 5% VAT | (3.15) |
| **Net amount received** | **5,495.85** |

The apparent 3.15 AED mismatch was the bank charge, not a partial customer payment.

## MoySklad posting

- Paymentin **06126**: **5,499.00 AED**, fully allocated to all six reports and shipment 06492.
- Paymentout **00687**: **3.15 AED**, paid bank charge.
- Net bank-account movement: **5,495.85 AED**, matching the RAK receipt exactly.
- All six commissioner reports are now **Paid**.
- Shipment **06492** is fully paid.
- SO **GENCardM2607077373** moved from **Доставлен - Ждем оплату** to **Доставлен**.
- Invoice **04941** / shipment **06697** for 2,570 AED remains unpaid and was not touched.

Script: `scripts/moysklad-create-bianco-cedre-549585-paymentin-20260826.js`
