# Inventory write-off — expired + prospect gifts (2026-06-15)

Warehouse **Loss** at **buyPrice** — mix of expired stock and samples/gifts to prospects.

## Posted

| | |
|---|---|
| **Loss** | **00008-00445** |
| **Total @ buyPrice** | **564.90 AED** |
| **Link** | https://online.moysklad.ru/app/#loss/edit?id=ed5a13ce-68d3-11f1-0a80-009900acf62a |
| **Marker** | `GIFT-EXPIRED-WRITE-OFF-2026-06-15` |

## Lines

| Code | Product | Qty | Buy/unit | Line |
|------|---------|----:|---------:|-----:|
| `00020` | Power Solution SWS 1 Vial 2ml | 15 | 8.22 | 123.30 |
| `00071` | Power Solution HES 1 Vial 2ml | 5 | 8.20 | 41.00 |
| `00065` | Power Solution PCS 1 Vial 2ml | 5 | 8.22 | 41.10 |
| `00069` | Power Solution CTS 1 Vial 2ml | 5 | 8.20 | 41.00 |
| `00015` | Skin Renewal Peeling System SRS 1 Vial 2ml | 5 | 13.40 | 67.00 |
| `00012` | Peptide Gel Mask 39g (single pcs) | 15 | 10.06 | 150.90 |
| `00011` | EZ CO₂ MASK Professional Box | 1 | 63.90 | 63.90 |
| `00022` | Snow Booster Toner 200ml | 1 | 36.70 | 36.70 |
| **TOTAL** | **52 pcs** | — | — | **564.90** |

VAT off on loss lines (standard pattern).

## Mapping note

User **PC** = Power Solution **PCS** vial (`00065`), same line as SWS/HES/CTS/SRS ampoules.

## Script

`scripts/moysklad-create-expired-gift-writeoff-20260615.js`

```bash
node --import dotenv/config scripts/moysklad-create-expired-gift-writeoff-20260615.js --commit
```
