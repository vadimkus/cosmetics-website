# Shakirovna Elite + Esthetic Clinic — Отгрузка в договор по строкам счетов 01351 / 01352

**Date:**2026-05-12

## Source

Consignment tax invoices (PDF):

- **Invoice_Consignment_Sales_ELITE.pdf** — TAX INVOICE **01351** dated 10.05.2026 — **ELITE SHAKIROVNA LADIES SALON L.L.C**
- **Invoice_Consignment_Sales_Clinic.pdf** — TAX INVOICE **01352** dated 10.05.2026 — **SHAKIROVNA ESTHETIC CLINIC L.L.C**

## Created shipments (`Отгрузка` / `demand`)

| Customer | Contract | Номер отгрузки | Сумма AED | ID |
|----------|----------|----------------|-----------|-----|
| ELITE SHAKIROVNA LADIES SALON L.L.C | **21** `c24b0b09-5e34-11f0-0a80-1b1c0008232a` | **06131** | 781.00 | `703ba3c2-4df9-11f1-0a80-1b5900bee944` |
| SHAKIROVNA ESTHETIC CLINIC L.L.C | **26** `d08f670e-b993-11f0-0a80-19750031f04a` | **06132** | 145.00 | `71a27383-4df9-11f1-0a80-0ee500c082b4` |

- [06131 Elite](https://online.moysklad.ru/app/#demand/edit?id=703ba3c2-4df9-11f1-0a80-1b5900bee944)  
- [06132 Clinic](https://online.moysklad.ru/app/#demand/edit?id=71a27383-4df9-11f1-0a80-0ee500c082b4)

**Moment:** 2026-05-12 16:00:00 · **State:** отгружен (`50d70717-4582-11ea-0a80-05e3001273a2`)

## Lines (mirror PDF / отчёты комиссионера)

**Elite (01351):**

| Code | Product | Qty |
|------|---------|-----|
| 54458 | Moisture Replenishing Hyaluron Cream 50g | 1 |
| 00041 | Multi Sun Cream SPF40/PA++ 40g | 2 |
| 00063 | Intensive Repair Collagen Mask 23g | 2 |
| 00144 | Skin Caring Blemish Balm Cushion #2 Biege | 2 |
| 00140 | Soothing Bomb Sea Algae Mask 23g | 5 |

**Clinic (01352):**

| Code | Product | Qty |
|------|---------|-----|
| 00035 | Intensive Problem Control Cream 50g | 1 |

## Script

`scripts/moysklad-create-shakirovna-elite-clinic-shipments-invoice-lines-20260512.js`

- `--report=elite` / `clinic` / `all` (default `all`)
