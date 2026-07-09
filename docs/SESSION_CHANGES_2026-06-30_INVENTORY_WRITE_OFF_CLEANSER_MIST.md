# Warehouse write-off — cleanser 180ml + mist (2026-06-30)

**Script:** `scripts/moysklad-create-inventory-writeoff-cleanser-mist-20260630.js`

## Posted

| Field | Value |
|-------|-------|
| **Loss №** | **00008-00452** |
| **ID** | `92c40a8c-7453-11f1-0a80-04ae001606a1` |
| **Sum (buy cost)** | **58.75 AED** |
| **Units** | 2 pcs |

- [Open in MoySklad](https://online.moysklad.ru/app/#loss/edit?id=92c40a8c-7453-11f1-0a80-04ae001606a1)

## Lines @ buyPrice

| Code | Qty | Buy/unit | Line | Product |
|------|----:|---------:|-----:|---------|
| `00021` | 1 | 40.40 | 40.40 | Snow O₂ Cleanser 180ml |
| `00188` | 1 | 18.35 | 18.35 | Microbiome Energy Infusing Mist 80ml |
| **TOTAL** | **2** | | **58.75** | |

```bash
node --import dotenv/config scripts/moysklad-create-inventory-writeoff-cleanser-mist-20260630.js --commit
```
