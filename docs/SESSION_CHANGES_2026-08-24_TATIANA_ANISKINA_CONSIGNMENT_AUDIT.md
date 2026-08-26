# Tatiana Aniskina — consignment audit (2026-08-24)

**Customer:** Tatiana Aniskina Nail Master (`603f398e-bd3d-11eb-0a80-00570009cb13`)  
**Agreement:** **00025** Commission (`f68e2d8d-c3c5-11eb-0a80-05f500276179`)  
**Script:** `scripts/inspect-tatiana-aniskina-consignment-20260824.js` (read-only)

## Did we forget the consignment contract on sales?

**No.** All **96** commission reports are on **00025**. Zero reports without a contract.

2025–2026: **no** off-contract demands, **no** regular invoices. Recent sales are reports on the agreement, then paymentin.

Older (2021–2024) there are **21** paid regular invoices/demands without the contract. Those were cash/invoice sales from the warehouse, not this year’s flow.

## Today (already posted in MoySklad)

| Doc | Name | Amount | Note |
|-----|------|-------:|------|
| Report | **01437** | **295** | Ivory `00143` ×1 @150 + Hyaluron cream 50g `54458` ×1 @145. ON-C. **Paid** |
| Paymentin | **06119** | **295** | Linked to 01437 |
| Paymentin | **06118** | **0** | Junk leftover, also linked to 01437. Safe to delete. |

## Book stock still at her (after 01437)

**79 units / 32 SKUs** on agreement 00025.

| Code | Book | In | Sold | Product |
|------|-----:|---:|-----:|---------|
| 00001 | 1 | 1 | 0 | Roller 0.25mm |
| 00021 | 1 | 12 | 11 | Snow O₂ 180ml |
| 00025 | 1 | 1 | 0 | Snow Booster 1000ml |
| 00030 | 3 | 6 | 2 | All For Sensitive Serum |
| 00031 | 2 | 4 | 1 | HSC 50g |
| 00034 | 1 | 1 | 0 | Anti-Wrinkle Cream 250g (Aug 1 replenish, never sold) |
| 00035 | 1 | 3 | 1 | Problem Control Cream 50g |
| 00037 | 1 | 2 | 1 | Skin Barrier 100g |
| 00040 | 2 | 9 | 7 | BB cream 50g |
| 00041 | 3 | 15 | 12 | Multi Sun SPF40 |
| 00042 | 1 | 12 | 10 | EGF Oxymask |
| 00052 | 2 | 7 | 4 | Hair Shampoo 300ml |
| 00053 | 2 | 13 | 10 | Eye Peptide Patch box |
| 00055 | 1 | 8 | 5 | Eye Contour Cream |
| 00057 | 1 | 1 | 0 | Mesopecia KIT Stamp |
| 00063 | 10 | 84 | 74 | Collagen mask |
| 00122 | 2 | 10 | 7 | Radiance Cream 50g |
| 00129 | 1 | 14 | 13 | EPI peeling gel |
| 00140 | 10 | 57 | 47 | Sea algae mask |
| 00143 | 3 | 27 | 24 | Ivory cushion |
| 00144 | 5 | 87 | 80 | Beige cushion |
| 00145 | 1 | 2 | 1 | Problem Control Toner 200 |
| 00188 | 5 | 27 | 22 | Mist 80ml |
| 00189 | 2 | 11 | 9 | Overnight cream mask |
| 00190 | 2 | 7 | 5 | Anti-Wrinkle Cream 50g |
| 00191 | 1 | 5 | 4 | Anti-Wrinkle Serum 30ml |
| 00195 | 3 | 4 | 1 | Hyaluron Serum 30ml |
| 54457 | 2 | 6 | 4 | Ultra Shield SPF50 |
| 54461 | 1 | 2 | 1 | Defender 200ml |
| 54464 | 5 | 13 | 8 | Camel cushion |
| 54475 | 1 | 1 | 0 | PDRN 5000 (Jul 6 extra, never sold) |
| 54484 | 2 | 2 | 0 | CERABARRIER 200 (Jul 6 extra, never sold) |

**Negative:** `00056` Mesopecia KIT Roller **−1** (sold on reports more than ever shipped on the contract).

## Why books can look fatter than the shelf

Not a missing-contract bug. Typical causes that fit this ledger:

1. She sold items and never sent a sales list (collagen 10, algae 10, beige 5, camel 5, mist 5 still on books).
2. Replenishment shipped extras that never came back as sold: Jul **06485** added PDRN 5000 + CERABARRIER ×2; Aug **06615** added Anti-Wrinkle Cream 250g. All three still book > 0 sold.
3. Physical loss / testers / gifts never written off.

## Shelf count vs book (24 Aug night, after 01437)

Photos: cushions, shampoo+eye cream, 3 serums, loose MVC tube, 12 boxed creams, 12 tall/other.

01437 already removed 1 Ivory + 1 Hyaluron cream 50g from the book. Do not sell those two again.

### Photographed — sold / short vs book

| Code | Product | Book | Shelf | Delta | Clinic | Line |
|------|---------|-----:|------:|------:|-------:|-----:|
| 00143 | Ivory cushion | 3 | 1 | **−2** | 150 | 300 |
| 00144 | Beige cushion | 5 | 3 | **−2** | 150 | 300 |
| 54464 | Camel cushion | 5 | 3 | **−2** | 150 | 300 |
| 00030 | AFS serum | 3 | 2 | **−1** | 165 | 165 |
| 00190 | Anti-Wrinkle Cream 50g | 2 | 1 | **−1** | 145 | 145 |
| 00040 | BB cream 50g | 2 | 1 | **−1** | 125 | 125 |
| 54484 | CERABARRIER 200 | 2 | 1 | **−1** | 190 | 190 |
| | | | | | | **1,525** |

### Photographed — match

Shampoo 2, Eye Contour 1, Hyaluron Serum 3, Anti-Wrinkle Serum 1, Radiance 50g boxed 2, SPF40 3, PCC 50g 1, USC 2, HSC 50g 2, Toner 200 1, Barrier 1, Oxymask 1, PDRN 5000 1, Snow O₂ 180 1, Snow Booster 1000 1, Defender 1, EPI 1, Overnight 2.

### Photographed — surplus (shelf > book)

| Code | Product | Book | Shelf | Note |
|------|---------|-----:|------:|------|
| 54458 | Hyaluron Cream 50g | 0 | 1 | 01437 already took the last book unit; she still has a box |
| 00123 | Radiance Cream 230g | 0 | 1? | Loose MVC tube. Count only if it is the 230g, not a 50g pulled from a box |

### Never in any photo — still on book (treat as sold only if the 6 photos are the full shelf)

| Code | Product | Book | Clinic | Line |
|------|---------|-----:|-------:|-----:|
| 00063 | Collagen mask | 10 | 18 | 180 |
| 00140 | Sea algae mask | 10 | 18 | 180 |
| 00188 | Mist 80ml | 5 | 80 | 400 |
| 00053 | Eye peptide patch | 2 | 190 | 380 |
| 00034 | Anti-Wrinkle Cream 250g | 1 | 210 | 210 |
| 00057 | Mesopecia KIT Stamp | 1 | 550 | 550 |
| 00001 | Roller 0.25mm | 1 | 115 | 115 |
| | | **30** | | **2,015** |

`00056` Mesopecia roller stays **−1** on books. Shelf 0. Do not sell again — needs a +1 shipment or a write-off correction.

**If photos = complete shelf:** missing **39 pcs**, sales report **1,525 + 2,015 = 3,540 AED** (plus stamp 550 already in that).  
**If photos = creams/cushions/serums only:** post **1,525 AED** and ask her where masks / mist / kits are.

## 2026 sales (all ON-C, all paid)

| Report | Date | AED | Paid |
|--------|------|----:|------|
| 01207 | 4 Jan | 160 | yes |
| 01220 | 11 Jan | 294 | yes |
| 01232 | 24 Jan | 145 | yes |
| 01357 | 16 May | 342 | yes |
| 01377 | 9 Jun | 559 | yes |
| 01401 | 6 Jul | 520 | yes |
| 01420 | 1 Aug | 185 | yes |
| 01437 | 24 Aug | 295 | yes |
