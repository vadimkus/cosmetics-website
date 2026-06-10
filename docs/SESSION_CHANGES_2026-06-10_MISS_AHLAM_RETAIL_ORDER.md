# Miss Ahlam — retail sales order (2026-06-10)

**Date:** 2026-06-10 (UAE)

## Request

New customer **Miss Ahlam** — sales order only + horizontal proforma PDF → `~/Desktop/orders/`.

**Phone:** +971565565504

## Customer (new)

| Field | Value |
|--------|--------|
| Name | Miss Ahlam |
| Phone | +971565565504 |
| ID | `5351c6d5-64a3-11f1-0a80-08200013fa76` |

## Sales order

| Field | Value |
|--------|--------|
| Number | **GENCardM2606105504** |
| Sum | **2,384.00 AED** |
| ID | `54e48f88-64a3-11f1-0a80-008b00146cc1` |

[Order UI](https://online.moysklad.ru/app/#customerorder/edit?id=54e48f88-64a3-11f1-0a80-008b00146cc1)

No invoice / shipment posted yet.

## Lines (retail, VAT incl.)

| Code | Product | Qty | Unit | Line |
|------|---------|-----|------|------|
| `54470` | BIO-MESO PDRN Expert Ampoule 60000 | 1 | 600.00 | 600.00 |
| `00021` | Snow O₂ Cleanser 180ml | 1 | 330.00 | 330.00 |
| `00022` | Snow Booster Toner 200ml | 1 | 260.00 | 260.00 |
| `54467` | Skin Reboot PDRN mask Pack | 1 | 400.00 | 400.00 |
| `00038` | Soothing Repair Post Cream 20g | 1 | 204.00 | 204.00 |
| `54457` | Ultra Shield SPF50/PA++++ 50g | 1 | 250.00 | 250.00 |
| `00189` | Skin Rescue Overnight Cream Mask 100g | 1 | 340.00 | 340.00 |
| **Total** | | | | **2,384.00 AED** |

**Stock note:** `00038` postcream 20g was **0 on hand** at order time — line still added on the SO.

## PDF

| File | Template | Size |
|------|----------|------|
| `~/Desktop/orders/GENOSYS_Miss_Ahlam_GENCardM2606105504.pdf` | Genosys_Invoice_PROFORMA (landscape) | 68,301 bytes |

## Script

`scripts/moysklad-create-miss-ahlam-retail-order-20260610.js`

```bash
node --import dotenv/config scripts/moysklad-create-miss-ahlam-retail-order-20260610.js --commit
```
