# Bianco JGE Ladies — customer order + invoice (2026-05-09)

## Request

Sales order and customer invoice from spreadsheet for **BIANCO JGE Ladies Salon L.L.C**; print invoice.

## Created in MoySklad

| Document | Value |
|----------|--------|
| Customer | `BIANCO JGE Ladies Salon L.L.C` (`f10054f9-da25-11ef-0a80-115c0005d233`) |
| Contract | `16` (`9f41e7f0-e3a2-11ef-0a80-0152001c1301`) |
| **Заказ покупателя** | **`GENCardM2605096278`** — `b3ff0cee-4b9c-11f1-0a80-0636005d109a` |
| **Счет покупателю** | **`04486`** — `b475c4f1-4b9c-11f1-0a80-1d26005ae2d3` |
| Moment | `2026-05-09 15:30:00` |
| Total | **2,099.00 AED** VAT-inclusive |

- Order UI: `https://online.moysklad.ru/app/#customerorder/edit?id=b3ff0cee-4b9c-11f1-0a80-0636005d109a`
- Invoice UI: `https://online.moysklad.ru/app/#invoiceout/edit?id=b475c4f1-4b9c-11f1-0a80-1d26005ae2d3`

## Lines (list prices)

| Code | Qty | Description |
|------|-----|-------------|
| 00011 | 1 | EZ CO₂ MASK Professional Box |
| 00013 | 2 | Hydro Cool Modeling Mask 1kg |
| 00018 | 1 | Power Solution AWS (sheet: 1 box → 1 vial in MoySklad) |
| 00069 | 1 | Power Solution CTS |
| 00067 | 1 | Power Solution CVS |
| 00071 | 2 | Power Solution HES |
| 00065 | 1 | Power Solution PCS |
| 00020 | 1 | Power Solution SWS |
| 00015 | 2 | SRS 1 vial (sheet: 2 box → 2 vials) |
| 00063 | 10 | Intensive Repair Collagen Mask 23g |
| 00001 | 7 | Standard Detachable Manual Roller 0.25mm |

## Print / PDF

- Use template **Genosys_Invoice_Legal_TAX** (ID **`5e56cd7d-ce85-4db5-8771-d7531f9ffd71`** — list: `GET …/entity/invoiceout/metadata/customtemplate`) in `POST …/entity/invoiceout/{id}/export` with `{ template, extension: "pdf" }`.
- **04486** exported to Desktop as `GENOSYS_Bianco_JGE_04486_Legal_TAX.pdf` and sent to the default printer (`lp`).
- Script `scripts/moysklad-create-bianco-jge-order-invoice-20260509.js` bakes in this template for all future runs with `--commit`.

## JSON export

- `tmp/moysklad-invoice-04486.json` (via `scripts/fetch-moysklad-invoice.js 04486`)
