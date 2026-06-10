# Saba Yousuf — retail order + paymentin + print

**Date:** 2026-06-06  
**Script:** `scripts/moysklad-create-saba-yousuf-order-invoice-demand-paymentin-20260606.js --commit`

## Customer

- **Saba Yousuf** (created) — `eba14483-615f-11f1-0a80-191f00328aeb`

## Lines

| Code | Product | Qty | Price |
|------|---------|-----|-------|
| 00053 | EyeCell Eye Peptide Gel Patch (box) | 1 | 380 AED |
| — | Delivery Dubai | 1 | 45 AED |
| **Total** | | | **425 AED** VAT incl. |

## Documents

| Step | Type | Number | ID |
|------|------|--------|-----|
| 1 | Customer order | `GENCardM260606SABA` | `ecced450-615f-11f1-0a80-007b0031f0b1` |
| 2 | Invoice | **04627** | `ed1201f0-615f-11f1-0a80-02640032d4f2` |
| 3 | Отгрузка | **06304** | `edb7573e-615f-11f1-0a80-0cc5003122b4` |
| 4 | **Incoming payment** (paymentin, bank) | **05713** | `edfdec84-615f-11f1-0a80-08090032a2dc` |

- Shipment **fully paid** via **paymentin** (not cashin).
- Order state set to delivered.

## Print

- Template: **Genosys_Invoice_Legal_TAX_RETAIL_PRINT** (landscape — not `Genosys_Invoice_Legal_TAX` portrait)
- Template ID: `b2cde0a1-ec18-4ea5-ac56-813a26308f10`
- PDF (reprint): `~/Desktop/GENOSYS_Saba_Yousuf_04627_RETAIL_PRINT.pdf`
- Sent to EPSON_L3260_Series with landscape orientation
