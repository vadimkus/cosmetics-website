# Shakirovna Ladies Beauty Saloon — Commissioner Report + Replenishment Shipment

**Date:** 2026-06-10 (UAE)

## Request

Screenshot 2026-06-10: **18 SKU / 51 pcs** sold on consignment → `Полученный отчёт комиссионера` + matching `Отгрузка` under agreement **00030**, identical lines.

## Customer / Contract

| Field | Value |
|--------|--------|
| Customer | **Shakirovna Ladies Beauty Saloon** |
| Counterparty ID | `93775ae5-d18d-11ea-0a80-02e00008417d` |
| Agreement | **00030** — `f5a1958d-c3ca-11eb-0a80-048e0027cbcb` |
| Marker | `SHAKIROVNA-LADIES-COMMISSION-DEMAND-SCREEN-2026-06-10` |

## Posted Documents

| Type | Number | Sum (AED) | Units | Lines | ID |
|------|--------|----------:|------:|------:|-----|
| Отчет комиссионера | **01378** | **4,038.00** | 51 | 18 | `4870dbb4-64ba-11f1-0a80-0bc50019ee7d` |
| Отгрузка | **06331** | **4,038.00** | 51 | 18 | `49538f1f-64ba-11f1-0a80-16d4001aab84` |

- [Report 01378](https://online.moysklad.ru/app/#commissionreport/edit?id=4870dbb4-64ba-11f1-0a80-0bc50019ee7d)
- [Shipment 06331](https://online.moysklad.ru/app/#demand/edit?id=49538f1f-64ba-11f1-0a80-16d4001aab84)

**Verification:** report and demand match exactly — 18 codes, 51 pcs, same unit prices, same total **4,038.00 AED**.

## Lines (report = shipment)

| Code | Product | Qty | Unit AED | Line AED |
|------|---------|----:|---------:|---------:|
| `00041` | Multi Sun Cream SPF40 40ml | 1 | 105.00 | 105.00 |
| `00144` | Skin Caring Blemish Balm Cushion #02 Beige | 1 | 150.00 | 150.00 |
| `00189` | Skin Rescue Overnight Cream Mask 100g | 1 | 170.00 | 170.00 |
| `00029` | Problem Control Serum 30ml | 2 | 165.00 | 330.00 |
| `00035` | Intensive Problem Control Cream 50g | 2 | 145.00 | 290.00 |
| `00052` | HR³ Matrix Scalp & Hair Shampoo 300ml | 1 | 170.00 | 170.00 |
| `00122` | Multi Vita Radiance Cream 50g | 1 | 145.00 | 145.00 |
| `00038` | Soothing Repair Post Cream **20g** | 1 | 102.00 | 102.00 |
| `00040` | Intensive Blemish Balm Cream 50g | 2 | 125.00 | 250.00 |
| `54467` | Skin Reboot PDRN mask Pack | 2 | 200.00 | 400.00 |
| `54457` | Ultra Shield Sun Cream SPF50/PA++++ 50g | 1 | 125.00 | 125.00 |
| `00140` | Soothing Bomb Sea Algae Mask 23g (screen 25g) | 24 | 18.00 | 432.00 |
| `00053` | EyeCell Eye Peptide Gel Patch (box) | 1 | 190.00 | 190.00 |
| `00063` | Intensive Repair Collagen Mask 23g | 3 | 18.00 | 54.00 |
| `00188` | Microbiome Energy Infusing Mist 80ml | 3 | 80.00 | 240.00 |
| `00037` | Skin Barrier Protecting Cream 100ml | 1 | 225.00 | 225.00 |
| `00021` | Snow O₂ Cleanser 180ml | 2 | 165.00 | 330.00 |
| `00191` | Multi Functional Anti-Wrinkle Serum 30ml | 2 | 165.00 | 330.00 |

## Stock prep — `00038` post cream 20g

Warehouse had **0 loose** `00038` (Lips for Kiss demand **06316** took 20× on 2026-06-08). **No substitution** to `54465` (100g).

| Step | Document | Detail |
|------|----------|--------|
| Loss | **00008-00443** | Unpack 1× box `00039` (12×20g) |
| Enter | **00010-00116** | Enter 1× loose `00038` for this shipment |

Korea PO (2026-06-03) has **50× `00038`** on order — not yet received.

## Script

`scripts/moysklad-create-shakirovna-ladies-salon-commission-demand-20260610.js`

```bash
node --import dotenv/config scripts/moysklad-create-shakirovna-ladies-salon-commission-demand-20260610.js
node --import dotenv/config scripts/moysklad-create-shakirovna-ladies-salon-commission-demand-20260610.js --commit
```

## Related

- Prior same-customer pair: report **01354** + shipment **06133** — [SESSION_CHANGES_2026-05-12_SHAKIROVNA_LADIES_SALON_COMMISSION_REPORT.md](./SESSION_CHANGES_2026-05-12_SHAKIROVNA_LADIES_SALON_COMMISSION_REPORT.md)
- Stock recon 2026-05-29 — [SESSION_CHANGES_2026-05-29_SHAKIROVNA_LADIES_STOCK_RECON.md](./SESSION_CHANGES_2026-05-29_SHAKIROVNA_LADIES_STOCK_RECON.md)
