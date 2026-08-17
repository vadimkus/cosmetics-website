# SHINE MEDICAL CENTER LLC OPC — clinic order (Dibba)

**Date:** 2026-07-16  
**Customer:** SHINE MEDICAL CENTER LLC OPC (`51c7851a-37da-11f1-0a80-148900411927`) · 050 374 5371  
**Ship:** Al Rifaa, Aspin Commercial Tower, office 3801, near Dibba Hospital, Dibba Al Fujairah

## Posted

| Doc | Number | Sum (AED) |
|-----|--------|----------:|
| Sales order | **GENCardM2607165371** | **1,195.00** |
| Invoice | **04826** | **1,195.00** |
| Shipment | **06549** | **1,195.00** |

- [Order GENCardM2607165371](https://online.moysklad.ru/app/#customerorder/edit?id=b424112d-80d7-11f1-0a80-1843000f3433)
- [Invoice 04826](https://online.moysklad.ru/app/#invoiceout/edit?id=b4720866-80d7-11f1-0a80-1843000f3463)
- [Shipment 06549](https://online.moysklad.ru/app/#demand/edit?id=b52b40d1-80d7-11f1-0a80-15c0000f3d31)

**PDF:** `~/Desktop/orders/GENOSYS_Shine_Medical_Center_04826.pdf`

**Delivery signoff:** `~/Desktop/orders/Delivery-Signoff-04826-SHINE-MEDICAL.pdf`  
Delivery date: **Friday 18 July 2026** · Dibba Al Fujairah · payment due **17 August 2026** (30 days net).

## Lines @ clinic list (VAT incl.)

| Code | Product | Qty | Price | Line |
|------|---------|----:|------:|-----:|
| 54467 | Skin Reboot PDRN Mask Pack | 1 | 200.00 | 200.00 |
| 00013 | Hydro Cool Modeling Mask 1kg | 1 | 300.00 | 300.00 |
| 00015 | SRS 1 Vial 2ml | 10 | 40.50 | 405.00 |
| 00065 | Power Solution PCS 1 Vial 2ml | 10 | 29.00 | 290.00 |

**Skipped:** `00020` Power Solution SWS ×10 — **0 stock** (expired write-off 2026-07-13, Korea reorder not yet received).

## Script

```bash
node --import dotenv/config scripts/moysklad-create-shine-medical-center-order-invoice-demand-20260716.js --commit
```

No paymentin posted (clinic invoice — payment TBD).
