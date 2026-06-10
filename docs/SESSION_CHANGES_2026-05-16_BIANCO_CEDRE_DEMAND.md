# Bianco Spa FZCO (Cedre Center) — Отгрузка

Date: 2026-05-16

## Request

Create a MoySklad `Отгрузка` under commission contract **00073** for **Bianco Spa FZCO (Cedre Center)**:

- Snow Cleanser 180ml ×2
- Snow Booster 200ml ×3
- EGF Repair Oxymask Cream ×2
- Problem Control Cream 50g ×2
- Revita Glow Bright ×1
- Revita Glow Natural ×1

No matching `Полученный отчет комиссионера` was requested.

## Customer / Agreement

- MoySklad customer: `Bianco Spa FZCO (Cedre Center)`
- Counterparty ID: `4c134860-9a4e-11ee-0a80-09ea0005ef84`
- Contract: `00073`
- Contract ID: `34d5fa5e-9ce3-11ee-0a80-10c7001247d8`

## Created Document

- `Отгрузка`: **06174**
  - ID: `82175679-5121-11f1-0a80-17d5003b47dd`
  - Total: **1,550.00 AED** VAT-inclusive (`salePrice` from stock report)
  - Lines: **6** | Quantity: **11**
  - State: отгружен (via API state id `50d70717-4582-11ea-0a80-05e3001273a2`)
  - `shared: true`
  - UI: `https://online.moysklad.ru/app/#demand/edit?id=82175679-5121-11f1-0a80-17d5003b47dd`

## Line mapping

| Code | Product | Qty |
|---|---|---:|
| `00021` | Genosys Snow O₂ Cleanser 180ml | 2 |
| `00022` | Genosys Snow Booster Toner 200ml | 3 |
| `00042` | Genosys EGF Repair Oxymask Cream 50ml | 2 |
| `00035` | Genosys Intensive Problem Control Cream 50g | 2 |
| `54472` | Genosys Revita Glow BB Cream #01 Bright 50g | 1 |
| `54473` | Genosys Revita Glow BB Cream #02 Natural 50g | 1 |

## Script

`scripts/moysklad-create-bianco-cedre-demand-20260516.js` — duplicate protection by marker + same calendar day.
