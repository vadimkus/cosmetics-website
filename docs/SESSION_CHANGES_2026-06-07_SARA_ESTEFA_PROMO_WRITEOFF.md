# Sara / Estefa Promotion Write-Off — 2026-06-07

## Context

Promotional presents to Sara / Estefa written off from Genosys Warehouse using MoySklad `loss` (Списание) at purchase price (`buyPrice`).

## MoySklad Document

- **Loss number:** `00008-00440`
- **ID:** `759d5999-6268-11f1-0a80-0d630060aa5a`
- **Marker:** `PROMO-WRITE-OFF-SARA-ESTEFA-2026-06-07`
- **Total buy cost:** **154.95 AED**
- **URL:** https://online.moysklad.ru/app/#loss/edit?id=759d5999-6268-11f1-0a80-0d630060aa5a

## Lines

| Code | Product | Qty | Buy price | Line |
|------|---------|-----|-----------|------|
| `00022` | Snow Booster Toner 200ml | 1 | 36.70 | 36.70 |
| `00188` | Microbiome Energy Infusing Mist 80ml | 1 | 18.35 | 18.35 |
| `00063` | Intensive Repair Collagen Mask 23g | 10 | 2.90 | 29.00 |
| `00140` | Soothing Bomb Sea Algae Mask 23g | 10 | 3.90 | 39.00 |
| `00001` | Standard Detachable Manual Roller 0.25mm | 1 | 31.90 | 31.90 |

## Script

`scripts/moysklad-create-sara-estefa-promotion-writeoff-20260607.js`

Dry-run first confirmed stock and purchase prices, then `--commit` posted the loss.
