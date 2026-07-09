# Viktoriia Klymenko — consignment replenishment demand (2026-07-02)

**Customer:** Viktoriia Klymenko (`fadad040-1090-11f1-0a80-00c800748f51`)  
**Agreement:** **33** (`419cb77b-1091-11f1-0a80-103000292afc`)  
**Script:** `scripts/moysklad-create-viktoriia-klymenko-demand-20260702.js --commit`

## Posted

| | |
|--|--|
| **Shipment (demand)** | **06449** |
| **Sum** | **680.00 AED** (was 490 — patch +1 on 2026-07-02) |
| **ID** | `bb83b7e6-75d1-11f1-0a80-114400335645` |

[Open shipment](https://online.moysklad.ru/app/#demand/edit?id=bb83b7e6-75d1-11f1-0a80-114400335645)

## PDF (`~/Desktop/orders/`)

`GENOSYS_Viktoriia_Klymenko_Consignment_Stock_Note_06449.pdf`

## Lines

| Code | Product | Qty | Unit AED |
|------|---------|----:|---------:|
| `00053` | EyeCell Eye Peptide Gel Patch (box) | **2** | 190.00 |
| `00143` | Skin Caring Blemish Balm Cushion #1 Ivory | 2 | 150.00 |

**Amend (2026-07-02):** patch box qty 1 → 2 (+190 AED). Script: `scripts/moysklad-fix-viktoriia-klymenko-demand-add-patch-20260702.js --commit`

## Run

```bash
cd /Users/vadimkus/cosmetics-website
node --import dotenv/config scripts/moysklad-create-viktoriia-klymenko-demand-20260702.js
node --import dotenv/config scripts/moysklad-create-viktoriia-klymenko-demand-20260702.js --commit
```
