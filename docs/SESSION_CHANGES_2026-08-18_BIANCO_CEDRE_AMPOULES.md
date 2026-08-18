# Bianco Cedre — SWS/CVS/HES/SRS/PDRN + EZ mask (2026-08-18)

**Customer:** Bianco Spa FZCO (Cedre Center)  
**Agent:** `4c134860-9a4e-11ee-0a80-09ea0005ef84`  
**Ship:** Cedre Center, Dubai Silicon Oasis, Dubai  
**Amount:** **2,570 AED** unpaid (clinic list, VAT included)

Invoice sale — **not** consignment. Agreement **00073** not attached.

| Doc | Number | Status |
|-----|--------|--------|
| SO | **GENCardM260818CEDRE** | Доставлен - Ждем оплату |
| INV | **04941** | Issued (reissued after EZ mask add) |
| SHIP | **06697** | Shipped (invoice-only) |

| Code | Item | Qty | Unit | Line |
|------|------|----:|-----:|-----:|
| 00020 | Power Solution SWS 1 Vial 2ml | 10 | 29 | 290 |
| 00067 | Power Solution CVS 1 Vial 2ml | 10 | 29 | 290 |
| 00071 | Power Solution HES 1 Vial 2ml | 10 | 29 | 290 |
| 00015 | SRS 1 Vial 2ml | 20 | 40.5 | 810 |
| 54467 | Skin Reboot PDRN mask Pack | 1 | 200 | 200 |
| 00011 | EZ CO₂ MASK Professional Box | 3 | 230 | 690 |
| — | Delivery Dubai | 1 | 45 | 0 (100% off) |

PDF: `~/Desktop/orders/GENOSYS_Bianco_Cedre_04941.pdf` (not printed)

https://online.moysklad.ru/app/#customerorder/edit?id=bc4a7afa-9ad6-11f1-0a80-0cbb00208e84  
https://online.moysklad.ru/app/#invoiceout/edit?id=bcbcdbce-9ad6-11f1-0a80-083f001fd016  
https://online.moysklad.ru/app/#demand/edit?id=be504f80-9ad6-11f1-0a80-01f4001f8bd2

Scripts:
- `scripts/moysklad-create-bianco-cedre-ampoules-order-20260818.js --commit`
- `scripts/moysklad-amend-bianco-cedre-04941-ez-mask-20260818.js --commit`
