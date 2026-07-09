# Promotional presents write-off @ buyPrice (2026-07-03)

**Script:** `scripts/moysklad-create-presents-gift-writeoff-20260703.js --commit`  
**Marker:** `PRESENTS-WRITE-OFF-GIFT-2026-07-03`

## Posted

| Doc | Number | Buy cost AED |
|-----|--------|-------------:|
| Списание (loss) | **00008-00460** | **518.14** |

https://online.moysklad.ru/app/#loss/edit?id=aa12beaa-7706-11f1-0a80-0d9f00254749

## Lines

| Code | Product | Qty | buy/unit | Line |
|------|---------|----:|---------:|-----:|
| 00011 | EZ CO₂ MASK Professional Box (5 treatments) | 1 | 58.03 | 58.03 |
| 54470 | BIO-MESO PDRN Expert Ampoule 60000 (3mlx4) | 2 | 84.47 | 168.94 |
| 54475 | BIO-MESO PDRN Homecare Ampoule 5000 | 2 | 34.15 | 68.30 |
| 00020 | Power Solution SWS 1 Vial 2ml | 10 | 8.22 | 82.20 |
| 00122 | Multi-Vita Radiance Cream 50g | 1 | 38.17 | 38.17 |
| 00194 | Multi Vita Radiance Serum 30ml | 1 | 40.00 | 40.00 |
| 00063 | Intensive Repair Collagen Mask 23g | 10 | 2.94 | 29.40 |
| 00140 | Soothing Bomb Sea Algae Mask 23g | 10 | 3.31 | 33.10 |
| | | **37 pcs** | | **518.14** |

## SKU notes

- **EZ mask** → `00011` professional box (5 treatments), same SKU as Valeria Borscheva EZ mask order.
- **SWS ampules ×10** → loose vials `00020`, not box `00019`.
- **Radiance cream 50g** → `00122`; **radiance serum** → `00194`.

## Re-run

```bash
node --import dotenv/config scripts/moysklad-create-presents-gift-writeoff-20260703.js --commit
```
