# Melanta Poly Clinic — demand from SO + delete order (2026-06-15)

Website order **GENCardM2606155578** (755 AED) converted to consignment **Отгрузка** under agreement **14**, then SO deleted.

## Customer

| Field | Value |
|---|---|
| Counterparty | Melanta Poly Clinic L.L.C |
| Agreement | **14** (commission) |
| Agent ID | `c3908257-ccdd-11ef-0a80-11a10053430e` |
| Contract ID | `ca7a8aa6-ccdd-11ef-0a80-18080052ee1c` |

## Source SO (deleted)

| | |
|---|---|
| **Order** | **GENCardM2606155578** |
| **Total** | **755.00 AED** |
| **Status** | Deleted after demand posted |

## Demand posted

| | |
|---|---|
| **Shipment** | **06361** |
| **Total** | **755.00 AED** |
| **State** | отгружен |
| **Link** | https://online.moysklad.ru/app/#demand/edit?id=fa383233-68d7-11f1-0a80-009900add62c |

## Consignment Stock Note PDF

`~/Desktop/GENOSYS_Melanta_06361_Consignment_Stock_Note.pdf` — exported and sent to default printer (EPSON L3260).

Re-export: `node --import dotenv/config scripts/moysklad-export-melanta-consignment-stock-note.js 06361`

## Lines (clinic prices from SO)

| Code | Product | Qty | Price | Line |
|------|---------|----:|------:|-----:|
| `00189` | Skin Rescue Overnight Cream Mask 100g | 2 | 170.00 | 340.00 |
| `00021` | Snow O₂ Cleanser 180ml | 1 | 165.00 | 165.00 |
| `54457` | Ultra Shield Sun Cream SPF50 50g | 2 | 125.00 | 250.00 |
| **TOTAL** | | **5 pcs** | | **755.00** |

## Script

`scripts/moysklad-create-melanta-demand-from-so-20260615.js`

```bash
node --import dotenv/config scripts/moysklad-create-melanta-demand-from-so-20260615.js --commit
```
