# Session: ANJANA SPA - FZE — collagen masks SO + invoice + shipment

**Date:** 2026-06-08  
**Customer:** ANJANA SPA - FZE (`d5532af5-6356-11f1-0a80-08090090f8b4`)  
**Script:** `scripts/moysklad-create-anjana-spa-collagen-order-invoice-demand-20260608.js`

## Request

Create sales order, invoice, and shipment for collagen masks:

- **100 pcs** — clinic list **18.00 AED** with **19.4444% discount** → **14.50 AED/pc net**
- Deliver to **Anjana Spa at Rixos Premium Saadiyat Island, Abu Dhabi**

## Redo (2026-06-08)

First run used flat **14.50 AED** line price (no discount). User asked to show full **18 AED** + discount.

Deleted prior docs and recreated same doc numbers:

| Removed | ID |
|---------|-----|
| Shipment 06323 | `f2585224-6357-11f1-0a80-17b9009031bd` |
| Invoice 04645 | `f1b288c1-6357-11f1-0a80-16c9008fc89b` |
| Order GENCardM260608ANJ | `f181f052-6357-11f1-0a80-0ba600919399` |

## Documents (current)

| Doc | Name / ID | Amount (AED) |
|-----|-----------|--------------|
| Sales order | **GENCardM260608ANJ** (`8f223b18-6358-11f1-0a80-0cc5008e6178`) | 1,450.00 |
| Invoice | **04645** (`8f60b4c8-6358-11f1-0a80-0809009138f3`) | 1,450.00 |
| Shipment | **06323** (`9037b78d-6358-11f1-0a80-01a500903e19`) | 1,450.00 |

## Line

| Code | Product | Qty | List | Discount | Net/pc | Total |
|------|---------|-----|------|----------|--------|-------|
| 00063 | Genosys Intensive Repair Collagen Mask 23g | 100 | 18.00 | 19.4444% | 14.50 | 1,450.00 |

VAT included. No delivery line.

## Links

- [Order](https://online.moysklad.ru/app/#customerorder/edit?id=8f223b18-6358-11f1-0a80-0cc5008e6178)
- [Invoice 04645](https://online.moysklad.ru/app/#invoiceout/edit?id=8f60b4c8-6358-11f1-0a80-0809009138f3)
- [Shipment 06323](https://online.moysklad.ru/app/#demand/edit?id=9037b78d-6358-11f1-0a80-01a500903e19)

## Re-run

```bash
node --import dotenv/config scripts/moysklad-create-anjana-spa-collagen-order-invoice-demand-20260608.js --commit --redo
```
