# Tatiana Aniskina Nail Master — Отгрузка (2026-05-18)

Date: 2026-05-18

## Request

Create **Отгрузка** under commission contract **00025** for **Tatiana Aniskina Nail Master**, same SKU/qty as the **Полученный отчёт комиссионера** lines:

| Code | Product | Qty |
|------|---------|-----|
| 00040 | Genosys Intensive Blemish Balm Cream 50g | 1 |
| 00122 | Genosys Multi-Vita Radiance Cream 50g | 1 |
| 00140 | Genosys Soothing Bomb Sea Algae Mask 23g | 4 |

## MoySklad IDs (resolved via API)

- Counterparty: `603f398e-bd3d-11eb-0a80-00570009cb13` — Tatiana Aniskina Nail Master  
- Contract: `f68e2d8d-c3c5-11eb-0a80-05f500276179` — **00025**

## Result

- Script: `scripts/moysklad-create-tatiana-aniskina-demand-20260518.js`
- Created demand **06186**, sum **342.00 AED**, state **Отгружен**
- Demand ID: `16f30a67-5290-11f1-0a80-0c8400749f90`
- UI: https://online.moysklad.ru/app/#demand/edit?id=16f30a67-5290-11f1-0a80-0c8400749f90

Run again same day with same marker is blocked by duplicate protection in description.
