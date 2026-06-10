# Eclatant — Consignment Replenishment Shipment

**Date:** 2026-06-01 (UAE)

## Request

Create **Отгрузка в договор комиссии** for **Eclatant** — all items from screenshot **×2** each.

## Customer / Contract

| Field | Value |
|--------|--------|
| Customer | **ECLATANT&CO TRADING CO L.L.C** |
| Counterparty ID | `0df9bafd-1a99-11f0-0a80-08b100073e9f` |
| Agreement | **18** — `132684fd-1a99-11f0-0a80-071f0006a1ec` |

## Posted Document

| Type | Number | Sum | Units | ID |
|------|--------|-----|-------|-----|
| Отгрузка | **06258** | **2,024.00 AED** | 14 | `802c6062-5d9b-11f1-0a80-00400078678f` |

[Open shipment](https://online.moysklad.ru/app/#demand/edit?id=802c6062-5d9b-11f1-0a80-00400078678f)

## Lines (all ×2)

| Code | Product | Qty | Unit AED | Line AED |
|------|---------|----:|---------:|---------:|
| `00021` | Snow O₂ Cleanser 180ml | 2 | 165.00 | 330.00 |
| `00022` | Snow Booster Toner 200ml | 2 | 130.00 | 260.00 |
| `00144` | Cushion #2 Beige | 2 | 150.00 | 300.00 |
| `00143` | Cushion #1 Ivory | 2 | 150.00 | 300.00 |
| `54457` | Ultra Shield SPF50 50g | 2 | 125.00 | 250.00 |
| `00038` | Soothing Repair Post Cream 20g | 2 | 102.00 | 204.00 |
| `00053` | EyeCell Eye Peptide Gel Patch (box) | 2 | 190.00 | 380.00 |

## Script

`scripts/moysklad-create-eclatant-consignment-demand-20260601.js`

```bash
node --import dotenv/config scripts/moysklad-create-eclatant-consignment-demand-20260601.js --commit
```
