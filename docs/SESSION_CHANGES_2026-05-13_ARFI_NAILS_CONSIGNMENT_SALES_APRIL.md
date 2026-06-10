# Session Changes — 2026-05-13 — ARFI Nails consignment sales (April 2026)

## Context

Two **полученный отчёт комиссионера** documents from Altegio **Анализ продаж**, period **01.04.2026–30.04.2026** (screenshots Barsha / Jumeirah).

## Script

`scripts/moysklad-create-arfi-nails-consignment-sales-april-20260513.js`

## Created documents

| Branch | MoySklad agent | № | Sum (VAT incl.) | Positions | Link |
|--------|----------------|---|-----------------|-----------|------|
| Barsha | ARFI NAILS BEAUTY SALON | **01355** | 1,127.00 AED | 11 pcs / 5 lines | [edit](https://online.moysklad.ru/app/#commissionreport/edit?id=d0c40651-4ee3-11f1-0a80-188400230f01) |
| Jumeirah | ARFI NAILS BEAUTY SALON 2 | **01356** | 565.00 AED | 4 pcs / 4 lines | [edit](https://online.moysklad.ru/app/#commissionreport/edit?id=d1c232fe-4ee3-11f1-0a80-14520022dc20) |

### Barsha lines

| Code | Qty | Product |
|------|-----|---------|
| 00194 | 1 | Multi Vita Radiance Serum 30ml |
| 54464 | 1 | BB Cushion #3 Camel |
| 00140 | 4 | Soothing Bomb Sea Algae Mask |
| 00144 | 3 | BB Cushion #2 Beige |
| 00190 | 2 | Multi Functional Anti-Wrinkle Cream 50g |

### Jumeirah lines

| Code | Qty | Product |
|------|-----|---------|
| 00041 | 1 | Multi Sun SPF40 40g |
| 00191 | 1 | Multi Functional Anti-Wrinkle Serum 30ml |
| 54464 | 1 | BB Cushion #3 Camel |
| 00190 | 1 | Multi Functional Anti-Wrinkle Cream 50g |

## Contracts

- Barsha: **25** (`739936aa-a809-11f0-0a80-07ba002a8e67`)
- Jumeirah: **30** (`383ebfbb-f052-11f0-0a80-0035000650e3`)

Document moment filed: **2026-05-13 14:00:00**. Commission period on docs: **2026-04-01 … 2026-04-30**.

## Consignment sales invoice PDF + print

Template: MoySklad **Invoice_Consignment_Sales_Genosys** (`commissionreportin` custom export).

Script: `scripts/moysklad-export-arfi-consignment-sales-pdfs-20260513.js`

Desktop PDFs:

- `/Users/vadimkus/Desktop/GENOSYS_ARFI_Nails_Barsha_Consignment_Sales_01355.pdf`
- `/Users/vadimkus/Desktop/GENOSYS_ARFI_Nails_Jumeirah_Consignment_Sales_01356.pdf`

Printed via macOS `lp` (default printer). Use `--no-print` to save only.

## Отгрузка в договор комиссии + Consignment Stock Note

Pairs commissioner reports **01355** / **01356** (same SKU/qty). Template **Genosys_Consignment_Stock_Note** (`09ef2604-4a14-4571-bc17-dc266c9190c3`).

Script: `scripts/moysklad-create-arfi-nails-replenishment-demands-stock-note.js`

| Branch | Отгрузка | Sum | Demand UI |
|--------|-----------|-----|-----------|
| Barsha | **06142** | 1,127.00 AED | [06142](https://online.moysklad.ru/app/#demand/edit?id=7cdaee82-4ee5-11f1-0a80-165000230cd8) |
| Jumeirah | **06143** | 565.00 AED | [06143](https://online.moysklad.ru/app/#demand/edit?id=8dc7f356-4ee5-11f1-0a80-0c4b00243e70) |

Desktop stock notes:

- `GENOSYS_ARFI_Nails_Barsha_06142_Consignment_Stock_Note.pdf`
- `GENOSYS_ARFI_Nails_Jumeirah_06143_Consignment_Stock_Note.pdf`

Printed via `lp`. Flags: `--only=barsha|jumeirah`, `--no-print`, `--date=YYYY-MM-DD`.
