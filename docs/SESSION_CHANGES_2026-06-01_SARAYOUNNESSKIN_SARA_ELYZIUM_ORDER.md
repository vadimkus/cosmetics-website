# Miss Sarayounesskin Sara — PDRN / mask / cushion order + invoice

**Customer:** Miss Sarayounesskin Sara (`b852cef4-183e-11f1-0a80-19e6000a846f`)  
**Phone:** +971501712883  
**Address:** Elyazia Beauty Center, Street 15 Villa 57B — Mirdif, Dubai  
**Note:** User clarified “Elyzium” = this existing counterparty (not a new entity).

## Created documents

| Doc | Name | Sum | ID |
|-----|------|-----|-----|
| Sales order | `GENCardM2606014891` | **1,050 AED** | `dbbbe419-5d96-11f1-0a80-110c0076e68b` |
| Invoice | **04595** | **1,050 AED** | `dbfdc23d-5d96-11f1-0a80-0b6800771501` |
| Shipment | **06256** | **1,050 AED** | `78c37b97-5d97-11f1-0a80-17aa00786ee7` |
| Cash in | **00167** | **1,050 AED** | `79f253d7-5d97-11f1-0a80-065d007716c3` |

**Order UI:** https://online.moysklad.ru/app/#customerorder/edit?id=dbbbe419-5d96-11f1-0a80-110c0076e68b  
**Invoice UI:** https://online.moysklad.ru/app/#invoiceout/edit?id=dbfdc23d-5d96-11f1-0a80-0b6800771501  
**Shipment UI:** https://online.moysklad.ru/app/#demand/edit?id=78c37b97-5d97-11f1-0a80-17aa00786ee7  
**Cash in UI:** https://online.moysklad.ru/app/#cashin/edit?id=79f253d7-5d97-11f1-0a80-065d007716c3

**Status:** fully paid — invoice → shipment (from invoice only) → cash in; order marked delivered.

## Lines (clinic salePrice, VAT incl.)

| Code | Product | Qty | Price |
|------|---------|-----|-------|
| `54470` | BIO-MESO PDRN Expert Ampoule 60000 | 2 | 300 AED |
| `54470` | same (FOC) | 1 | 100% discount |
| `00013` | Hydro Cool Modeling Mask 1kg | 1 | 300 AED |
| `00143` | Ivory BB cushion | 1 | 150 AED |

**Paid total:** 2×300 + 300 + 150 = **1,050 AED**

## Fix applied

Initial run created a duplicate counterparty **“Elyzium”** (`daa83e51-5d96-11f1-0a80-018800766cbc`). Order and invoice were **reassigned** to **Miss Sarayounesskin Sara** via API PUT (agent + shipment address).

The orphan **Elyzium** counterparty (`daa83e51-5d96-11f1-0a80-018800766cbc`) was **deleted** via API after reassignment (no linked orders/invoices).

## Script

`scripts/moysklad-create-elyzium-order-invoice-20260601.js` — uses fixed `AGENT_ID` for Sara (no new customer create).

`scripts/moysklad-create-sarayounesskin-sara-shipment-cashin-20260601.js` — shipment + cash in for existing order/invoice.

```bash
node --import dotenv/config scripts/moysklad-create-elyzium-order-invoice-20260601.js
node --import dotenv/config scripts/moysklad-create-elyzium-order-invoice-20260601.js --commit

node --import dotenv/config scripts/moysklad-create-sarayounesskin-sara-shipment-cashin-20260601.js --commit
```
