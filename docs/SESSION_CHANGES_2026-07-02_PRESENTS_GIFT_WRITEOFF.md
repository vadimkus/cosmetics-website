# Promotional presents write-off @ buyPrice (2026-07-02)

**Script:** `scripts/moysklad-create-presents-gift-writeoff-20260702.js`  
**Marker:** `PRESENTS-WRITE-OFF-GIFT-2026-07-02`

## Posted

| Field | Value |
|-------|-------|
| **Loss №** | **00008-00456** |
| **ID** | `3d0515bb-7638-11f1-0a80-1b13004cbf57` |
| **Sum (buy cost)** | **259.83 AED** |
| **Units** | 25 pcs / 6 lines |

- [Open in MoySklad](https://online.moysklad.ru/app/#loss/edit?id=3d0515bb-7638-11f1-0a80-1b13004cbf57)

## Lines @ buyPrice

| Code | Qty | Buy/unit AED | Line AED | Product |
|------|----:|-------------:|---------:|---------|
| `54467` | 1 | 42.50 | 42.50 | Skin Reboot PDRN Mask Pack 350g |
| `00013` | 1 | 58.03 | 58.03 | Hydro Cool Modeling Mask 1kg |
| `54466` | 1 | 34.00 | 34.00 | Bio-Ferment Age Defying Powder Mask 300g |
| `00140` | 10 | 3.31 | 33.10 | Soothing Bomb Sea Algae Mask 23g |
| `00063` | 10 | 2.94 | 29.40 | Intensive Repair Collagen Mask 23g |
| `54472` | 2 | 31.40 | 62.80 | Revita Glow BB #01 Bright 50g |
| **TOTAL** | **25** | | **259.83** | |

VAT on loss lines: off (`vatEnabled: false`).

## Post command

```bash
node --import dotenv/config scripts/moysklad-create-presents-gift-writeoff-20260702.js --commit
```
