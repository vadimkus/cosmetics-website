# Session: ARFI Nails Barsha — replenishment shipment + stock note PDF

**Date:** 2026-06-09  
**Customer:** ARFI NAILS BEAUTY SALON (`39a1aa83-a5a6-11f0-0a80-1cbc00050fea`)  
**Contract:** 25 (`739936aa-a809-11f0-0a80-07ba002a8e67`)  
**Script:** `scripts/moysklad-create-arfi-barsha-replenishment-demand-20260609.js`

## Request

Consignment **Отгрузка** (demand/shipment) for ARFI Nails Barsha + **Consignment Stock Note** PDF to `~/Desktop/orders/`.

## Shipment

| Field | Value |
|-------|-------|
| Name | **06324** |
| ID | `c75b9b67-63d4-11f1-0a80-01ad0019b887` |
| Total | **1,020.00 AED** |

## Lines (@ clinic list, VAT incl.)

| Code | Product | Qty | Unit | Line |
|------|---------|-----|------|------|
| `00190` | Multi Functional Anti-Wrinkle Cream 50g | 2 | 145.00 | 290.00 |
| `00191` | Multi Functional Anti-Wrinkle Serum 30ml | 2 | 165.00 | 330.00 |
| `54467` | Skin Reboot PDRN mask Pack (30 sheets) | 2 | 200.00 | 400.00 |

## PDF

`/Users/vadimkus/Desktop/orders/GENOSYS_ARFI_Nails_Barsha_06324_Consignment_Stock_Note.pdf`

Template: MoySklad `Genosys_Consignment_Stock_Note` (`09ef2604-4a14-4571-bc17-dc266c9190c3`).

## Links

- [Shipment 06324](https://online.moysklad.ru/app/#demand/edit?id=c75b9b67-63d4-11f1-0a80-01ad0019b887)

## Re-run

```bash
node --import dotenv/config scripts/moysklad-create-arfi-barsha-replenishment-demand-20260609.js --commit
```
