# Cosmiden / Myline (Mylene) — consignment sales report

**Date:** 2026-07-01  
**Customer:** COSMIDEN MEDICAL CENTER L.L.C (`d7b0a67f-d5a2-11ef-0a80-16cd0019b6b8`) — **Myline / Mylene = Cosmiden**  
**Agreement:** 15 (`69b01872-d7dd-11ef-0a80-0725003ffada`)  
**Source:** GENOSYS consignment stock sheet **as of 30.06.2026** (SOLD QTY column)  
**Report only — no demand.**

## Posted

| | |
|--|--|
| **Report** | **01389** |
| **Sum** | **1,339.00 AED** |
| **Units** | 35 (8 lines) |
| **Period** | June 2026 |
| **ID** | `3c8555d2-754a-11f1-0a80-09f1001e1726` |

## Lines

| Code | Product (sheet → MoySklad) | Qty | Unit | Line |
|------|---------------------------|-----|------|------|
| 00190 | Multi Functional Anti-Wrinkle Cream 50g | 1 | 145.00 | 145.00 |
| 00035 | Intensive Problem Control Cream 50g | 1 | 145.00 | 145.00 |
| 00144 | Cushion #2 Beige | 1 | 150.00 | 150.00 |
| **54464** | Cushion **#3 Camel** | 1 | 150.00 | 150.00 |
| **00063** | Collagen mask **23g** (sheet: 16g) | 13 | 18.00 | 234.00 |
| **00140** | Sea algae mask **23g** (sheet: 16g) | 16 | 18.00 | 288.00 |
| 54457 | Ultra Shield Sun Cream SPF50 | 1 | 125.00 | 125.00 |
| 00038 | Soothing Repair Post Cream 20g | 1 | 102.00 | 102.00 |

## Mapping checks

- **Camel cushion** → `54464` (not `00145`, which is Problem Control Toner).
- **Masks** labelled 16g on sheet → active MoySklad SKUs **23g** (`00063`, `00140`) — same rule as prior Cosmiden reports.

## Overlap note

Partial report **01376** (2026-06-08) already posted masks only: collagen ×14, sea algae ×12.  
This report uses sheet figures **×13 / ×16** plus 6 other sold SKUs. **If 01376 was the same settlement window, delete 01376** to avoid double-counting masks (~468 AED).

## PDF

`~/Desktop/orders/GENOSYS_Cosmiden_Myline_Consignment_Sales_01389.pdf`

## Script

`scripts/moysklad-create-cosmiden-commission-report-20260701.js`

## Payment (2026-07-06)

Full consignment settlement received.

| Doc | Number | Amount |
|-----|--------|-------:|
| Paymentin | **05893** | **1,339.00 AED** |

- [Paymentin 05893](https://online.moysklad.ru/app/#paymentin/edit?id=d041725e-7909-11f1-0a80-0b5500716ee2)
- Report **01389** paid in full: **1,339.00 / 1,339.00 AED**
- Script: `scripts/moysklad-create-cosmiden-paymentin-01389-20260706.js --commit`

## Link

https://online.moysklad.ru/app/#commissionreport/edit?id=3c8555d2-754a-11f1-0a80-09f1001e1726
