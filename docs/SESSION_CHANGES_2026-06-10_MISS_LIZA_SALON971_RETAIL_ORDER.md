# Miss Liza (Salon 971) — retail order (2026-06-10)

**Date:** 2026-06-10 (UAE)

## Request

Existing customer **Miss Liza** — The Platinum One, Arjan (Salon 971).

| Step | Document |
|------|----------|
| 1 | Заказ покупателя |
| 2 | Счёт покупателю |
| 3 | Отгрузка |

**Lines (clinic list / MoySklad salePrice, VAT incl.):**

| Code | Product | Qty | Unit AED | Line AED |
|------|---------|-----|----------|----------|
| `00053` | EyeCell Eye Peptide Gel Patch (box) | 1 | 190.00 | 190.00 |
| `54467` | Skin Reboot PDRN mask Pack | 1 | 200.00 | 200.00 |
| `00021` | Snow O₂ Cleanser 180ml | 1 | 165.00 | 165.00 |
| `00011` | EZ CO₂ Mask Kit (Professional Box) | 1 | 230.00 | 230.00 |
| **Total** | | | | **785.00 AED** |

Originally posted at **retail** (1,570 AED) — corrected same day to clinic list.

Landscape retail invoice PDF → `~/Desktop/orders/`.

## Customer

| Field | Value |
|--------|--------|
| Name | Miss Liza |
| Phone | +971585511025 |
| Address | The Platinum One, Arjan |
| ID | `54f61271-f117-11f0-0a80-09440004ed3f` |

## Documents (posted)

| Step | Type | Number | Sum AED | ID |
|------|------|--------|---------|-----|
| Order | Заказ покупателя | **GENCardM2606101025** | 785.00 | `ef4e7d81-649e-11f1-0a80-0d6c001370a8` |
| Invoice | Счёт покупателю | **04650** | 785.00 | `ef8847a1-649e-11f1-0a80-1ba8001387d1` |
| Shipment | Отгрузка | **06330** | 785.00 | `f0553916-649e-11f1-0a80-112000133291` |

**Chain:** order → invoice → **shipment from invoice only**.

**Payment:** not posted (unpaid).

Links:

- [Order](https://online.moysklad.ru/app/#customerorder/edit?id=ef4e7d81-649e-11f1-0a80-0d6c001370a8)
- [Invoice 04650](https://online.moysklad.ru/app/#invoiceout/edit?id=ef8847a1-649e-11f1-0a80-1ba8001387d1)
- [Shipment 06330](https://online.moysklad.ru/app/#demand/edit?id=f0553916-649e-11f1-0a80-112000133291)

## PDF

| File | Size |
|------|------|
| `~/Desktop/orders/GENOSYS_Miss_Liza_04650.pdf` | 96,760 bytes |

Template: **Genosys_Invoice_Legal_TAX_RETAIL_PRINT** (horizontal / landscape).

## Script

`scripts/moysklad-create-miss-liza-salon971-retail-order-invoice-20260610.js`

```bash
node --import dotenv/config scripts/moysklad-create-miss-liza-salon971-retail-order-invoice-20260610.js --commit
```

Marker: `MISS-LIZA-SALON971-CLINIC-2026-06-10`.

## Price correction (same day)

Initial post used **retail** (1,570 AED). Amended to **clinic list** (MoySklad salePrice) = **785 AED**; PDF re-exported.

```bash
node --import dotenv/config scripts/moysklad-create-miss-liza-salon971-retail-order-invoice-20260610.js --fix-clinic-prices
```
