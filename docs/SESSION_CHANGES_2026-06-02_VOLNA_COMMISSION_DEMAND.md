# Salon Volna — Commissioner Report + Shipment (May 2026)

**Date:** 2026-06-02 (UAE)

## Customer / Contract

| Field | Value |
|--------|--------|
| Customer | **Volna Beauty Salon L.L.C** |
| Counterparty ID | `aeaaf63a-2985-11f0-0a80-0dfc0049a5f1` |
| Agreement | **19** — `40556e6d-2986-11f0-0a80-03d10049fb5c` |
| Commission period | **2026-05-01 → 2026-05-31** |

## Posted Documents

| Type | Number | Sum | Units | Lines | ID |
|------|--------|-----|-------|-------|-----|
| Отчет комиссионера | **01366** | **1,034.00 AED** | 14 | 7 | `2deedb16-5e28-11f1-0a80-0661000afef0` |
| Отгрузка | **06265** | **1,524.00 AED** | 15 | 8 | `2e67203a-5e28-11f1-0a80-0cb9000bc8c3` |

- [Report](https://online.moysklad.ru/app/#commissionreport/edit?id=2deedb16-5e28-11f1-0a80-0661000afef0)
- [Shipment](https://online.moysklad.ru/app/#demand/edit?id=2e67203a-5e28-11f1-0a80-0cb9000bc8c3)

## Report lines (sold items)

| Code | Product | Qty | Line AED |
|------|---------|----:|---------:|
| `54457` | Ultra Shield SPF50 50g | 2 | 250.00 |
| `54458` | Hyaluron Cream 50g | 2 | 290.00 |
| `00055` | EyeCell Eye Contour Cream 20ml | 1 | 185.00 |
| `00012` | Peptide Gel Mask 39g | 2 | 76.00 |
| `00063` | Collagen Mask 23g | 3 | 54.00 |
| `00140` | Sea Algae Mask 23g | 3 | 54.00 |
| `54472` | Revita Glow BB #01 Bright 50g | 1 | 125.00 |

## Shipment extra (replenishment)

| Code | Product | Qty | Line AED |
|------|---------|----:|---------:|
| `00059` | EyeCell Eye Zone Care Kit (box) | 1 | 490.00 |

## Notes

- Sheet label “Hyaluron Cream 50ml” → MoySklad **`54458` Hyaluron Cream 50g**.

## Script

`scripts/moysklad-create-volna-commission-demand-20260602.js`

```bash
node --import dotenv/config scripts/moysklad-create-volna-commission-demand-20260602.js --commit
```
