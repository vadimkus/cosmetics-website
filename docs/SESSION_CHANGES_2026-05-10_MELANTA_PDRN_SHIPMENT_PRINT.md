# Session: Melanta — PDRN replenishment shipment + consignment stock note print

**Date:** 2026-05-10  
**Counterparty:** Melanta Poly Clinic L.L.C · **contract 14**

## Shipment (Отгрузка)

| Field | Value |
|-------|--------|
| № | **06116** |
| Sum | **400.00 AED** (incl. VAT) — 2 × PDRN mask pack `54467` |
| Link | https://online.moysklad.ru/app/#demand/edit?id=14f2017e-4b87-11f1-0a80-0c46005781a6 |

Only **replenishment** demand created (no paired «отчёт комиссионера по продажам» for this movement).

## Print template

- MoySklad custom template **`Genosys_Consignment_Stock_Note`** (`20f67808-4cfd-4c45-a1e1-7d567c658c21`)
- PDF saved: **`~/Desktop/GENOSYS_Melanta_06116_Consignment_Stock_Note.pdf`**
- Script sent job to default printer via **`lp`** (Epson in run output); use `--no-print` to skip.

## Script

`scripts/moysklad-create-melanta-pdrn-shipment-print-20260510.js`
