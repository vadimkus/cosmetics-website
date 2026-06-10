# Persona Dubai Marina — Отгрузка 2026-05-05

## Request

Create MoySklad **Отгрузка** under commission agreement **00024** for **Persona Dubai Marina** / `First Person Ladies Salon (Marina)`.

## Document

| Field | Value |
|--------|--------|
| **Номер** | `06092` |
| **ID** | `3680d8cf-487d-11f1-0a80-0bab001f4fe3` |
| **Sum** | **2,250.00 AED** VAT-inclusive |
| **Lines** | 7 (14 units) |
| **Состояние** | Отгружен (`50d70717-4582-11ea-0a80-05e3001273a2`) |
| **Edit** | https://online.moysklad.ru/app/#demand/edit?id=3680d8cf-487d-11f1-0a80-0bab001f4fe3 |

## Контрагент и договор

- **Agent:** `af21a79a-63cd-11ea-0a80-02b2000e2aeb` — First Person Ladies Salon (Marina)
- **Contract:** `56ca0166-c388-11eb-0a80-093a001d1ee0` — **00024**

## Позиции (код → кол-во)

| Code | Product | Qty |
|------|---------|-----|
| 00035 | Intensive Problem Control Cream 50g | 2 |
| 00021 | Snow O₂ Cleanser 180ml | 2 |
| 00022 | Snow Booster Toner 200ml | 1 |
| 00144 | Skin Caring Blemish Balm Cushion #2 Biege | 2 |
| 00052 | HR³ Matrix Scalp & Hair Shampoo 300ml | 3 |
| 00051 | HR³ Matrix Hair Tonic 70ml | 2 |
| 54467 | Skin Reboot PDRN mask Pack (30 sheets) 350g | 2 |

**Note:** User text “Hair toner” was mapped to **HR³ Matrix Hair Tonic 70ml** (`00051`), consistent with other Persona Marina scripts. If they meant a different SKU, adjust in MoySklad.

## Script

`scripts/moysklad-create-persona-marina-demand-20260505.js`

- Only creates **demand** (no commission report).
- `Dup` guard: same agent + same calendar day + description marker.
