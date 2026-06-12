# Inventory warehouse write-off (2026-06-12)

## Posted

| | |
|---|---|
| **Loss** | **00008-00444** |
| **Total @ buyPrice** | **446.30 AED** |
| **Link** | https://online.moysklad.ru/app/#loss/edit?id=85119de6-6620-11f1-0a80-1d57003762a2 |

## Lines

| Code | Product | Qty | Buy/unit | Line |
|------|---------|----:|---------:|-----:|
| `00188` | Microbiome Energy Infusing Mist 80ml | 2 | 18.35 | 36.70 |
| `00063` | Intensive Repair Collagen Mask 23g | 10 | 2.90 | 29.00 |
| `00140` | Soothing Bomb Sea Algae Mask 23g | 10 | 3.90 | 39.00 |
| `00189` | Skin Rescue Overnight Cream Mask 100g | 1 | 53.00 | 53.00 |
| `00021` | Snow O₂ Cleanser 180ml | 6 | 48.10 | 288.60 |

VAT off on loss lines (same pattern as other gift/inventory write-offs).

## Script

`scripts/moysklad-create-inventory-writeoff-20260611.js`

```bash
node --import dotenv/config scripts/moysklad-create-inventory-writeoff-20260611.js --commit
```
