# Persona Downtown — Commission Report + Consignment Shipment

**Date:** 2026-06-01 (UAE)

## Customer / Contract

| Field | Value |
|--------|--------|
| Counterparty | First Person Ladies Salon (Downtown) |
| ID | `19f661fb-b43b-11ee-0a80-0d3b00075ace` |
| Contract | **00077** |
| Contract ID | `2092d415-b43b-11ee-0a80-095a000715c8` |

## Created Documents

| Type | Number | Sum AED | ID |
|------|--------|---------|-----|
| Полученный отчет комиссионера | **01362** | 1,151.00 | `e04ac6ad-5d8e-11f1-0a80-1af0007356ad` |
| Отгрузка (договор 00077) | **06254** | 680.00 | `e0fb6cbf-5d8e-11f1-0a80-16af0075885c` |

- [Report 01362](https://online.moysklad.ru/app/#commissionreport/edit?id=e04ac6ad-5d8e-11f1-0a80-1af0007356ad)
- [Shipment 06254](https://online.moysklad.ru/app/#demand/edit?id=e0fb6cbf-5d8e-11f1-0a80-16af0075885c)

## Commission Report Lines (sold)

| Code | Product | Qty | Unit AED | Line AED |
|------|---------|-----|----------|----------|
| `00051` | HR³ Matrix Hair Tonic 70ml | 2 | 145.00 | 290.00 |
| `00012` | Peptide Gel Mask 39g | 4 | 38.00 | 152.00 |
| `00140` | Soothing Bomb Sea Algae Mask 23g | 1 | 18.00 | 18.00 |
| `00063` | Intensive Repair Collagen Mask 23g | 2 | 18.00 | 36.00 |
| `00031` | Intensive Hydro Soothing Cream 50g | 1 | 145.00 | 145.00 |
| `00144` | BB Cushion #2 Beige | 1 | 150.00 | 150.00 |
| `00053` | EyeCell Eye Peptide Gel Patch (box) | 1 | 190.00 | 190.00 |
| `00052` | HR³ Matrix Scalp & Hair Shampoo 300ml | 1 | 170.00 | 170.00 |

**Total:** 13 units · **1,151.00 AED** VAT-inclusive

## Shipment Lines (replenishment)

| Code | Product | Qty | Unit AED | Line AED |
|------|---------|-----|----------|----------|
| `00144` | BB Cushion #2 Beige | 2 | 150.00 | 300.00 |
| `00053` | EyeCell Eye Peptide Gel Patch (box) | 2 | 190.00 | 380.00 |

**Total:** 4 units · **680.00 AED** VAT-inclusive

## Script

`scripts/moysklad-create-persona-downtown-commission-demand-20260531.js`

```bash
node --import dotenv/config scripts/moysklad-create-persona-downtown-commission-demand-20260531.js
node --import dotenv/config scripts/moysklad-create-persona-downtown-commission-demand-20260531.js --commit
```
