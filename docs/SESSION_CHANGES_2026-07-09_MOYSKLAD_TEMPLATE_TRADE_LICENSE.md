# MoySklad print templates — trade license 5023192

**Date:** 2026-07-09  
**Issue:** B2B invoice templates still print `Trade License: I14330AT` (old RAKEZ ref).  
**Correct:** **5023192** (confirmed by Vadim 2026-07-09; matches website `lib/siteConfig.ts`).

## API limitation

MoySklad Remap **can download** custom templates (`GET …/metadata/customtemplate/{id}` → `content` URL) but **cannot upload/replace** them:

- `PUT /entity/customtemplate/{id}` → `1037` wrong Content-Type (all types tried)
- `PUT …/metadata/customtemplate/{id}` → `405` not supported

**Upload must be done in MoySklad UI** (Settings → Print forms → edit template → replace file).

## What we did

1. Downloaded all 6 Genosys templates from live MoySklad
2. Patched binary `.xls`: `I14330AT` → `5023192` (UTF-16LE safe replace)
3. Saved ready-to-upload files + backups + README

**Output folder:** `~/Desktop/MoySklad_Templates_updated/`  
**Upload guide:** `~/Desktop/MoySklad_Templates_updated/README_UPLOAD.md`  
**Script:** `scripts/moysklad-patch-template-trade-license.py`

## Templates patched

| File | MoySklad name | Use |
|------|---------------|-----|
| Genosys_Invoice_Legal_TAX.xls | Genosys_Invoice_Legal_TAX | B2B clinic invoices |
| Genosys_Invoice_Legal_TAX_RETAIL_PRINT.xls | Genosys_Invoice_Legal_TAX_RETAIL_PRINT | Retail invoices |
| Genosys_Invoice_PROFORMA.xls | Genosys_Invoice_PROFORMA | Customer orders |
| Genosys_Consignment_Stock_Note.xls | Genosys_Consignment_Stock_Note | Consignment shipments |
| Invoice_Consignment_Sales_Genosys.xls | Invoice_Consignment_Sales_Genosys | Commission reports |
| Invoice_Consignment_Report_Genosys.xls | Invoice_Consignment_Report_Genosys | Commission reports |

`Invoice_Bagus` — no `I14330AT` in file (unchanged).

## Local fix

- `scripts/moysklad-export-bianco-soa-2026.js` — SOA HTML header updated to 5023192

## Manual upload steps (5 min)

1. MoySklad → ⚙️ **Настройки** → **Печатные формы**
2. For each template above: open → **Заменить файл** → pick matching `.xls` from Desktop folder
3. Print-test invoice **04787** with `Genosys_Invoice_Legal_TAX` — confirm header shows **5023192**
