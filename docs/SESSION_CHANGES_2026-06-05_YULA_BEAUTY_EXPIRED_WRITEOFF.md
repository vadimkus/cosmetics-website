# Yula Beauty Salon LLC — expired consignment write-off

## Reason

Expired stock at salon (photo 2026-06-04): cushions, serums, toner, patches — written off from commission agreement **12**.

## Documents

| Step | Doc | Sum | Notes |
|------|-----|-----|--------|
| 1 | **Возврат покупателя 00297** | 1,410.00 AED (list) | Virtual return — reduces consignment balance |
| 2 | **Списание 00008-00438** | 398.30 AED (buy) | Warehouse loss @ buyPrice |

Marker: `YULA-BEAUTY-EXPIRED-WRITE-OFF-2026-06-04`

## Lines (9 pcs)

| Code | Product | Qty |
|------|---------|-----|
| `00143` | Cushion #1 Ivory | 2 |
| `00030` | All For Sensitive Serum 30ml | 2 |
| `00029` | Problem Control Serum 30ml | 2 |
| `00145` | Problem Control Toner 200ml | 2 |
| `00053` | Eye Peptide Gel Patch (box) | 1 |

- [Sales return](https://online.moysklad.ru/app/#salesreturn/edit?id=a819964b-600c-11f1-0a80-1486001d32df)
- [Loss](https://online.moysklad.ru/app/#loss/edit?id=a89a8a9b-600c-11f1-0a80-0b96001d487c)

## Script

`scripts/moysklad-create-yula-beauty-expired-writeoff-20260605.js`

Not billed to salon — COGS on loss document per `docs/CONSIGNMENT_STOCK_RECONCILIATION.md`.
