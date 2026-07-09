# Abeer Mekki — consignment sold SPC ROM SOC MSC (2026-06-30)

**ABEER MEKKI BEAUTY LADIES CENTER - L.L.C - S.P.C** · agreement **31** · +971556717564 · Al Ain representative

Sold items from consignment shelf (photo 2026-06-30). **10% Al Ain representative discount** on each line (clinic list × 0.9).

**Commissioner report only** — no demand (Abeer settlement pattern).

## Posted

| Type | # | Total | ID |
|------|---|------:|-----|
| Commissioner report | **01386** | **598.50 AED** | `257d2bb8-7434-11f1-0a80-077a000f2726` |

- [Report 01386](https://online.moysklad.ru/app/#commissionreport/edit?id=257d2bb8-7434-11f1-0a80-077a000f2726)
- PDF: `~/Desktop/orders/GENOSYS_ABEER_MEKKI_Consignment_Sales_01386.pdf`

## Correction (2026-06-30)

Demand **06433** was posted in error and **deleted** — report **01386** remains the correct document.

## Lines

| Code | Product | Qty | List | −10% unit | Line |
|------|---------|----:|-----:|----------:|-----:|
| `00037` | Skin Barrier Protecting Cream 100g (SPC) | 1 | 225.00 | **202.50** | 202.50 |
| `00189` | Skin Rescue Overnight Cream Mask 100g (ROM) | 1 | 170.00 | **153.00** | 153.00 |
| `00021` | Snow O₂ Cleanser 180ml (SOC) | 1 | 165.00 | **148.50** | 148.50 |
| `00041` | Multi Sun Cream SPF40/PA++ 40g (MSC) | 1 | 105.00 | **94.50** | 94.50 |
| **TOTAL** | | **4** | | | **598.50** |

## Script

`scripts/moysklad-create-abeer-mekki-commission-demand-20260630.js` (report only)

```bash
node --import dotenv/config scripts/moysklad-create-abeer-mekki-commission-demand-20260630.js --commit
```
