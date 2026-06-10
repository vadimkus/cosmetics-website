# ARAK / Korean House — trial SKU selection (YTD data)

**Date:** 2026-06-08  
**Customer:** ARAK SALE OF COSMETICS L.L.C (`33c7fa5e-6325-11f1-0a80-1a4600828ae8`)  
**Method:** MoySklad `report/profit/byproduct`, 2026-01-01 → 2026-06-08

## Why the approach changed

Initial suggestion leaned on generic “home care” categories. **Actual YTD sales** show a sharper pattern:

- **Mask singles dominate** — collagen `#2` and sea algae `#3` by volume (2,270 units combined).
- **BB cushion Beige is #4** (436 pcs) — makeup + SPF story for retail.
- **Cleanser #5**, **PDRN pack #6** — core trial must include these, not optional extras.
- **SPF40** (#10, 153 pcs) outsells many serums; valid retail sun choice vs SPF50 (#7) for a lower ticket Ajman shop.

User-confirmed core + data-backed adds replace the earlier Skin Barrier / Hydrofit / generic list.

## Final trial assortment

### Core (user confirmed)

| Code | Product | YTD | Stock |
|------|---------|-----|------:|
| `00021` | Snow O₂ Cleanser 180ml | 268 | 151 |
| `00063` | Collagen mask 23g | 1,144 | 1,354 |
| `00140` | Sea algae mask 23g | 1,126 | 570 |
| `00041` | Multi Sun SPF40 40g | 153 | 168 |
| `00129` | EPI Peeling Gel 100g | 88 | 85 |
| `00144` | Cushion Beige | 436 | 255 |
| `54464` | Cushion Camel | 97 | **31** |
| `00194` | Multi Vita Radiance Serum | 99 | 66 |
| `00122` | Multi-Vita Radiance Cream | 111 | 106 |

### Add (top retail, not in core)

| Code | Product | YTD | Rationale |
|------|---------|-----|-----------|
| `54467` | PDRN mask pack 30 sheets | 208 | Company #5 SKU; Korean House narrative |
| `00188` | Microbiome Mist 80ml | 204 | #6 SKU; 80 AED entry; UAE hydration |
| `00022` | Snow Booster Toner 200ml | 102 | Cleanser companion |
| `00189` | Overnight Cream Mask 100g | 123 | Night care repeat purchase |
| `54458` | Hyaluron Cream 50g | 99 | Pairs with mist |
| `00040` | Blemish Balm Cream 50g | 88 | Problem skin without extra cushions |

### Optional

- `00051` / `00052` — HR³ tonic + shampoo (license includes hair care; 82 / 64 YTD)

## Suggested trial qty

See table in [SESSION_CHANGES_2026-06-05_KOREAN_HOUSE_UAE_DISTRIBUTION_INQUIRY.md](./SESSION_CHANGES_2026-06-05_KOREAN_HOUSE_UAE_DISTRIBUTION_INQUIRY.md) — ~**176 units** goods + testers on cleanser, EPI, SPF40, radiance cream, one cushion.

**Wholesale pricing:** use standard reseller tier (not in this note); proforma to be built on commit.

## Next step

Prepaid proforma → payment → delivery to Shop 17, Rashideya 3, Ajman.
