# TONETRENDZ — customer folder PDFs (invoice + stock note)

**Date:** 2026-06-21  
**Folder:** `/Users/vadimkus/Desktop/Drive/Genosys/Contract_Customers/Toner_Trends/`  
**Script:** `scripts/moysklad-export-tonetrendz-folder-pdfs-20260621.js`

## Tax invoice (normal / pro consumables)

| Field | Value |
|-------|-------|
| Invoice | **04685** (`6f2623c2-6a0c-11f1-0a80-048a0002fd02`) |
| Total | **835.00 AED** (paid — paymentin **05779**) |
| Order | **GENCardM2606162913** |
| Shipment | **06371** |
| Template | **Genosys_Invoice_Legal_TAX** |
| File | `Genosys_Invoice_04685_TONETRENDZ.pdf` |

Lines: Snow O₂ Cleanser 500ml ×1, Power Solution AWS vials ×20.

License **1626587** prints on invoice via counterparty fax field (Face Room pattern).

## Consignment stock note (copy)

| Field | Value |
|-------|-------|
| Shipment | **06326** / **10,695 AED** / agreement **36** (29 lines / 106 pcs) |
| File | `Genosys_Consignment_Stock_Note_06326_TONETRENDZ.pdf` |

Added 2026-06-21: shampoo `00052`×2, eye cream `00055`×2, eye serum `00054`×2, hair tonic `00051`×2, EyeCell kit `00059`×2 (+2,350 AED).

## Re-export invoice

```bash
node --import dotenv/config scripts/moysklad-export-tonetrendz-folder-pdfs-20260621.js --commit --invoice-only
```

Full folder sync (invoice + stock note):

```bash
node --import dotenv/config scripts/moysklad-export-tonetrendz-folder-pdfs-20260621.js --commit
```
