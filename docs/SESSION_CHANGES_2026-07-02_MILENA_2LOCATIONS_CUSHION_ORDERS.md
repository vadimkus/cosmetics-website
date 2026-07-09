# Milena — 2 locations, cushion orders (2026-07-02)

Clinic prices **150 AED** per cushion (Beige `00144`, Camel `54464`). No delivery lines.

## Location 1 — Al Wasl, Jumeirah

**Customer:** Milena AESTHETIC CLINIC LLC (`10d5bed0-c15e-11f0-0a80-1aae00102afc`)  
**Address:** Villa D01, 892 Al Wasl Rd, Umm Suqeim 1, Dubai

| Type | № | Sum | Link |
|------|---|-----|------|
| Заказ | **GENCardM260702MILW** | **1,500.00 AED** | https://online.moysklad.ru/app/#customerorder/edit?id=3b6912f5-760b-11f1-0a80-013400405026 |
| Счёт | **04752** | **1,500.00 AED** | https://online.moysklad.ru/app/#invoiceout/edit?id=3ba1ac33-760b-11f1-0a80-04b10040ddfc |
| Отгрузка | **06455** | **1,500.00 AED** | https://online.moysklad.ru/app/#demand/edit?id=3c41ecad-760b-11f1-0a80-11440040723a |

| Code | Product | Qty |
|------|---------|----:|
| `00144` | Cushion #2 Beige | 5 |
| `54464` | Cushion #3 Camel | 5 |

**PDF:** `~/Desktop/orders/GENOSYS_Milena_Wasl_04752.pdf`  
Template **Genosys_Invoice_Legal_TAX**. Re-export: `scripts/moysklad-export-milena-invoice-pdf-legal-tax-20260702.js`

## Location 2 — Rimal, JBR

**Customer:** Milena AESTHETIC CLINIC LLC (JBR Branch) (`b16bd870-da6d-11f0-0a80-1902000d2f93`)  
**Address:** Rimal 03, Plaza Level, Shop R03, JBR, Dubai

| Type | № | Sum | Link |
|------|---|-----|------|
| Заказ | **GENCardM260702MILJ** | **900.00 AED** | https://online.moysklad.ru/app/#customerorder/edit?id=3eb43d88-760b-11f1-0a80-0c5e004212fd |
| Счёт | **04753** | **900.00 AED** | https://online.moysklad.ru/app/#invoiceout/edit?id=3ef7036d-760b-11f1-0a80-0ffa0041fa4e |
| Отгрузка | **06456** | **900.00 AED** | https://online.moysklad.ru/app/#demand/edit?id=3fabb9a8-760b-11f1-0a80-08b50042451a |

| Code | Product | Qty |
|------|---------|----:|
| `00144` | Cushion #2 Beige | 3 |
| `54464` | Cushion #3 Camel | 3 |

**PDF:** `~/Desktop/orders/GENOSYS_Milena_JBR_04753.pdf`  
Template **Genosys_Invoice_Legal_TAX**. Re-export: `scripts/moysklad-export-milena-invoice-pdf-legal-tax-20260702.js`

## Script

`scripts/moysklad-create-milena-2locations-cushion-orders-20260702.js --commit`
