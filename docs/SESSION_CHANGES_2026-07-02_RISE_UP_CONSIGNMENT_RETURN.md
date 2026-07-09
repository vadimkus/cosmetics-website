# Rise UP — consignment return to warehouse (2026-07-02)

Physical stock collected from **Rise UP** (Agreement **34**). Photo inventory 2026-07-02.

## Customer

| | |
|---|---|
| **Clinic** | Rise UP |
| **Counterparty ID** | `b83e0d80-5d8f-11f1-0a80-065d0075240c` |
| **Contract** | **34** (`c91330fa-5d90-11f1-0a80-1af00073b7c8`) |
| **Contact** | Irina Kovalenko · +971501025360 · Irina_01-01@mail.ru |
| **Premises** | Office 906, The Metropolis Tower, Business Bay, Dubai |

## MoySklad

| | |
|---|---|
| **Return** | **00301** |
| **Return ID** | `420f9824-760a-11f1-0a80-013400400383` |
| **UI** | https://online.moysklad.ru/app/#salesreturn/edit?id=420f9824-760a-11f1-0a80-013400400383 |
| **Total** | **1,430.00 AED** VAT incl. |
| **Units** | **10 pcs** · **6 SKUs** |
| **Script** | `scripts/moysklad-create-rise-up-consignment-return-20260702.js` |

## Documents

| File | Path |
|------|------|
| Return note PDF | `~/Desktop/orders/GENOSYS_Rise_UP_Consignment_Return_00301.pdf` |
| Return note HTML | `~/Desktop/orders/GENOSYS_Rise_UP_Consignment_Return_00301.html` |

## Lines

| Code | Product | Qty | Line AED |
|------|---------|----:|---------:|
| `54464` | Skin Caring Blemish Balm Cushion #3 Camel | 4 | 600.00 |
| `54473` | Revita Glow BB Cream #02 Natural 50g | 1 | 125.00 |
| `54472` | Revita Glow BB Cream #01 Bright 50g | 1 | 125.00 |
| `00035` | Intensive Problem Control Cream 50g | 1 | 145.00 |
| `00031` | Intensive Hydro Soothing Cream 50g | 1 | 145.00 |
| `54461` | Skin Defender Lip & Eye Makeup Remover 200ml | 2 | 290.00 |
| | **TOTAL** | **10** | **1,430.00** |

## Amendment (2026-07-03)

Photo recount: only **1× Natural BB** returned (was posted as 2). MoySklad return **00301** amended; PDF refreshed.

- **Script:** `scripts/moysklad-fix-rise-up-consignment-return-00301-20260703.js --commit`
- **Change:** `54473` qty **2 → 1** (−125 AED, −1 pc)

## Notes

- Open commissioner report **01394** (**5,004 AED** sold) remains due separately from this return.
- Opening consignment shipment **06255** unchanged; this return reduces Rise UP consignment balance by **10** units.
