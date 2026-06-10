# First Person Marina — Consignment Replenishment Shipment

**Date:** 2026-06-01 (UAE)

## Request

Create **Отгрузка в договор комиссии** for **First Person Ladies Salon (Marina)** under agreement **00024**.

## Customer / Contract

| Field | Value |
|--------|--------|
| Customer | **First Person Ladies Salon (Marina)** |
| Counterparty ID | `af21a79a-63cd-11ea-0a80-02b2000e2aeb` |
| Agreement | **00024** — `56ca0166-c388-11eb-0a80-093a001d1ee0` |

## Posted Document

| Type | Number | Sum | Units | ID |
|------|--------|-----|-------|-----|
| Отгрузка | **06259** | **1,585.00 AED** | 12 | `966daf5f-5db7-11f1-0a80-1d5c0080ccd2` |

[Open shipment](https://online.moysklad.ru/app/#demand/edit?id=966daf5f-5db7-11f1-0a80-1d5c0080ccd2)

## Lines

| Code | Product | Qty | Unit AED | Line AED |
|------|---------|----:|---------:|---------:|
| `00021` | Snow O₂ Cleanser 180ml | 2 | 165.00 | 330.00 |
| `00022` | Snow Booster Toner 200ml | 1 | 130.00 | 130.00 |
| `00041` | Multi Sun SPF40 | 1 | 105.00 | 105.00 |
| `54457` | Ultra Shield SPF50 50g | 2 | 125.00 | 250.00 |
| `00052` | HR³ Matrix Shampoo 300ml | 1 | 170.00 | 170.00 |
| `00051` | HR³ Matrix Hair Tonic 70ml | 2 | 145.00 | 290.00 |
| `00188` | Microbiome Mist 80ml | 2 | 80.00 | 160.00 |
| `00144` | Cushion #2 Beige | 1 | 150.00 | 150.00 |

## Script

`scripts/moysklad-create-persona-marina-consignment-demand-20260601.js`

```bash
node --import dotenv/config scripts/moysklad-create-persona-marina-consignment-demand-20260601.js --commit
```
