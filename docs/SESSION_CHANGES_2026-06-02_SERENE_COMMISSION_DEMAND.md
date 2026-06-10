# Serene Skin Beauty — Commissioner Report + Shipment (May 2026)

**Date:** 2026-06-02 (UAE)

## Customer / Contract

| Field | Value |
|--------|--------|
| Customer | **Serene Skin Beauty Salon LLC** |
| Counterparty ID | `993395aa-8da2-11ec-0a80-006b0038cd99` |
| Agreement | **00060** — `dc5c469a-d943-11ed-0a80-05bd0013eb27` |
| Commission period | **2026-05-01 → 2026-05-31** |

## Posted Documents

| Type | Number | Sum | Units | Lines | ID |
|------|--------|-----|-------|-------|-----|
| Отчет комиссионера | **01369** | **865.00 AED** | 16 | 6 | `97be6a0f-5e9d-11f1-0a80-02590029225e` |
| Отгрузка | **06271** | **865.00 AED** | 16 | 6 | `987375b8-5e9d-11f1-0a80-0cb90028f416` |

- [Report 01369](https://online.moysklad.ru/app/#commissionreport/edit?id=97be6a0f-5e9d-11f1-0a80-02590029225e)
- [Shipment 06271](https://online.moysklad.ru/app/#demand/edit?id=987375b8-5e9d-11f1-0a80-0cb90028f416)

## Lines (report = shipment)

| User request | Code | Product | Qty | Line AED |
|--------------|------|---------|----:|---------:|
| Sun block SPF 50 | `54457` | Ultra Shield Sun Cream SPF50 50g | 1 | 125.00 |
| Sun block SPF 40 | `00041` | Multi Sun Cream SPF40/PA++ 40g | 1 | 105.00 |
| BB cushion Biege | `00144` | Skin Caring Blemish Balm Cushion #2 Biege | 1 | 150.00 |
| Mist | `00188` | Microbiome Energy Infusing Mist 80ml | 2 | 160.00 |
| Defender remover | `54461` | Skin Defender Lip & Eye Makeup Remover 200ml | 1 | 145.00 |
| Sea algae masks | `00140` | Soothing Bomb Sea Algae Mask 23g | 10 | 180.00 |

## Script

`scripts/moysklad-create-serene-commission-demand-20260602.js`

```bash
node --import dotenv/config scripts/moysklad-create-serene-commission-demand-20260602.js --commit
```
