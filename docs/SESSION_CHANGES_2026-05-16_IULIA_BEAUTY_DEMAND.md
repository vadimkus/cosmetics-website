# IULIA BEAUTY SALON LLC — Отгрузка

Date: 2026-05-16

## Request

Create a MoySklad `Отгрузка` for **IULIA BEAUTY SALON LLC** under the client’s commission agreement, matching the delivery note / screenshot:

- Snow O₂ Cleanser 180ml ×1
- Skin Rescue Overnight Cream Mask 100g ×1
- Moisture Replenishing Hyaluron Cream 50g ×1
- Multi Vita Radiance Serum 30ml ×1

## Customer / Agreement

- MoySklad customer: `IULIA BEAUTY SALON LLC`
- Counterparty ID: `96500719-c90e-11f0-0a80-19c8002d2932`
- Contract: `28` (commission)
- Contract ID: `f2dad83f-c91f-11f0-0a80-09d3003136c5`

## Created Document

- `Отгрузка`: **06178**
  - ID: `8b92e0f1-5140-11f1-0a80-156600424312`
  - Total: **645.00 AED** VAT-inclusive (clinic `salePrice`)
  - Lines: **4** | Quantity: **4**
  - `shared: true`, contract linked
  - UI: `https://online.moysklad.ru/app/#demand/edit?id=8b92e0f1-5140-11f1-0a80-156600424312`

## Line mapping

| Code | Product | Qty |
|---|---|---:|
| `00021` | Genosys Snow O₂ Cleanser 180ml | 1 |
| `00189` | Genosys Skin Rescue Overnight Cream Mask 100g | 1 |
| `54458` | Genosys Moisture Replenishing Hyaluron Cream 50g | 1 |
| `00194` | Genosys Multi Vita Radiance Serum 30ml | 1 |

## Script

`scripts/moysklad-create-iulia-beauty-demand-20260516.js`
