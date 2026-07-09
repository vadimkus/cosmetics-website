# Salon Volna — PDRN mask consignment shipment (2026-06-19)

## Customer / Contract

| Field | Value |
|---|---|
| Customer | **Volna Beauty Salon L.L.C** |
| Contract | **19** |
| Counterparty ID | `aeaaf63a-2985-11f0-0a80-0dfc0049a5f1` |

## Shipment (Отгрузка)

| Field | Value |
|---|---|
| Number | **06388** |
| Sum | **800.00 AED** |
| ID | `9349acd7-6bd7-11f1-0a80-112d001c85e2` |

[Open shipment](https://online.moysklad.ru/app/#demand/edit?id=9349acd7-6bd7-11f1-0a80-112d001c85e2)

## Lines @ clinic (оптовая)

| Code | Product | Qty | Price AED |
|---|---|---:|---:|
| 54467 | Skin Reboot PDRN mask Pack (30 sheets) 350g | 4 | 200 |

## Script

```bash
node --import dotenv/config scripts/moysklad-create-volna-pdrn-mask-demand-20260619.js --commit
```
