# Lips for Kiss Clinic — customer order 2026-05-10

## Request

New **Заказ покупателя** for **Lips for Kiss Clinic**:

- Soothing repair post cream ×10 (user text **2g** — see mapping)
- Moisture replenishing hyaluron cream **50g** ×4
- Multi Sun cream **SPF 40** ×5
- Multi vitamins radiance cream **50g** ×2
- Snow O₂ cleanser **180ml** ×2
- Snow booster **200ml** ×2

## Created

| Field | Value |
|--------|--------|
| **Name** | `GENCardM2605104512` |
| **ID** | `481839af-4d40-11f1-0a80-145000997ef0` |
| **Moment** | `2026-05-10 17:30:00` |
| **Sum** | **3 005,00 AED** VAT-inclusive |
| **Counterparty** | Lips for Kiss Clinic (`9038b70d-c52f-11f0-0a80-0bc5000a2226`) |
| **UI** | https://online.moysklad.ru/app/#customerorder/edit?id=481839af-4d40-11f1-0a80-145000997ef0 |

## Lines (MoySklad codes)

| Code | Product | Qty | Unit AED | Line AED |
|------|---------|-----|----------|----------|
| 00038 | Soothing Repair Post Cream **20g** | 10 | 102.00 | 1 020.00 |
| 54458 | Moisture Replenishing Hyaluron Cream 50g | 4 | 145.00 | 580.00 |
| 00041 | Multi Sun Cream SPF40/PA++ 40g | 5 | 105.00 | 525.00 |
| 00122 | Multi-Vita Radiance Cream 50g | 2 | 145.00 | 290.00 |
| 00021 | Snow O₂ Cleanser 180ml | 2 | 165.00 | 330.00 |
| 00022 | Snow Booster Toner 200ml | 2 | 130.00 | 260.00 |

## Note on “2g” post cream

`SIZE_VARIANT_MAP` / MoySklad usage only documents **20g** (`00038`) and **100g** (`54465`) for Soothing Repair Postcream. This order uses **00038 ×10**. If the clinic meant true **2g** samples, adjust or split lines manually in MoySklad.

## Script

`scripts/moysklad-create-lips-for-kiss-order-20260510.js` — dry-run / `--commit`.
