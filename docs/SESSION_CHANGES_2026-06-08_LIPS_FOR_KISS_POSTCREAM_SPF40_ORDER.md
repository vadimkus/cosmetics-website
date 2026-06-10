# Lips for Kiss Clinic — SO + invoice + shipment

**Date:** 2026-06-08  
**Customer:** Lips for Kiss Clinic (`9038b70d-c52f-11f0-0a80-0bc5000a2226`)  
**Script:** `scripts/moysklad-create-lips-for-kiss-postcream-spf40-order-invoice-demand-20260608.js --commit`

## Lines (clinic list, VAT incl.)

| Code | Product | Qty | Unit | Line |
|------|---------|----:|-----:|-----:|
| `00038` | Soothing Repair Post Cream **20g** | 20 | 102.00 | 2,040.00 |
| `00041` | Multi Sun Cream SPF40/PA++ 40g | 5 | 105.00 | 525.00 |
| **Total** | | | | **2,565.00 AED** |

**Note:** Request text said post cream **2g × 20** — no 2g SKU; posted as **20g** (`00038`) ×20 (same as prior Lips for Kiss orders).

## Stock prep

Only **3** loose `00038` on hand → unpacked **2×** post cream box (`00039`, 12×20g) via loss **00008-00441** + enter **00010-00115** (+17 loose) before shipment.

## Documents

| Step | Number | ID |
|------|--------|-----|
| Order | **GENCardM260608LFK** | `db18c55e-6328-11f1-0a80-067000844ba1` |
| Invoice | **04639** | `db5c9d77-6328-11f1-0a80-0fc70084c3cf` |
| Shipment | **06316** | `dc2c1999-6328-11f1-0a80-0fc70084c405` |

Invoice state: **Выписан**. Shipment state: **Отгружен**. No paymentin (awaiting payment).
