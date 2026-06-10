# Rise UP — Opening Consignment Shipment

**Date:** 2026-06-01 (UAE)

## Request

Post opening **Отгрузка в договор комиссии** for **Rise UP** (agreement **34**) with approved SKU/qty list at clinic list (`salePrice`).

## Customer / Contract

| Field | Value |
|--------|--------|
| Customer | Rise UP — `b83e0d80-5d8f-11f1-0a80-065d0075240c` |
| Agreement | **34** — `c91330fa-5d90-11f1-0a80-1af00073b7c8` |

## Posted Document

| Type | Number | Sum AED | Lines | Units | ID |
|------|--------|---------|-------|-------|-----|
| Отгрузка | **06255** | **10,720.00** | 32 | 96 | `0d9baefc-5d92-11f1-0a80-018800752c62` |

[Open shipment](https://online.moysklad.ru/app/#demand/edit?id=0d9baefc-5d92-11f1-0a80-018800752c62)

## Lines Posted

| Code | Product | Qty |
|------|---------|----:|
| `00012` | Peptide Gel Mask | 5 |
| `00140` | Sea Algae Mask | 10 |
| `00063` | Collagen Mask | 10 |
| `00144` | Cushion Beige | 3 |
| `00143` | Cushion Ivory | 3 |
| `54464` | Cushion Camel | 3 |
| `00041` | Multi Sun SPF40 | 4 |
| `54457` | Ultra Shield SPF50 | 4 |
| `00053` | Eye Peptide Gel Patch (box) | 4 |
| `00055` | Eye Contour Cream 20ml | 2 |
| `00054` | Eye Contour Serum 10ml | 2 |
| `00040` | Blemish Balm Cream 50g | 2 |
| `00031` | Hydro Soothing Cream 50g | 2 |
| `00035` | Problem Control Cream 50g | 2 |
| `54458` | Hyaluron Cream 50g | 2 |
| `00190` | Anti-Wrinkle Cream 50g | 2 |
| `00122` | Radiance Cream 50g | 2 |
| `54472` | Revita Glow BB #01 Bright 50g | 2 |
| `54473` | Revita Glow BB #02 Natural 50g | 2 |
| `00030` | All For Sensitive Serum | 2 |
| `00027` | Anti-Wrinkle Serum | 2 |
| `00195` | Hyaluron Serum | 2 |
| `00191` | Anti-Wrinkle Serum (MF) | 2 |
| `00194` | Radiance Serum | 2 |
| `00029` | Problem Control Serum | 2 |
| `00188` | Microbiome Mist | 6 |
| `00052` | HR³ Scalp Shampoo | 2 |
| `00051` | HR³ Hair Tonic | 2 |
| `00022` | Snow Booster Toner 200ml | 2 |
| `00189` | Overnight Cream Mask 100g | 2 |
| `00129` | EPI Peeling Gel 100g | 2 |
| `00145` | Problem Control Toner 200ml | 2 |

**Note:** `54457` counted once (SPF50 ×4, not duplicated under 50g creams). `00054` once (×2).

## Script

`scripts/moysklad-create-rise-up-opening-consignment-20260601.js`

```bash
node --import dotenv/config scripts/moysklad-create-rise-up-opening-consignment-20260601.js --commit
```
