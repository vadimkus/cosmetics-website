# GENOSYS Summer Replenishment Forecast

Date: 2026-04-28

## Source

Live MoySklad analysis using:

- Current stock, reserves and available stock
- 30 / 90 / 180 / 365-day turnover
- May-August 2025 summer movement
- Summer weighting for SPF, hydration, post-sun repair and masks

Forecast target:

- `150` days cover for SPF, hydration and masks
- `120` days cover for other active fast-moving SKUs

## Recommendation Summary

Initial model output was intentionally aggressive because it targeted `150` days of cover for summer categories. After a live stock sanity check refreshed on 2026-04-29, the practical recommendation is:

- Base order: approximately `1,190` units.
- Optional top-ups: approximately `430` units.
- Full order if lead time is long: approximately `1,620` units.

The base order prioritizes SPF, hydration repair, radiance, anti-wrinkle, BB creams, and stockouts. Sheet masks remain optional because current cover is still decent.

## Final Base Order

| Code | Product | Qty |
|---|---|---:|
| `00041` | Genosys Multi Sun Cream SPF40/PA++ 40g | 120 |
| `54457` | Genosys Ultra Shield Sun Cream SPF50/PA++++ 50g | 120 |
| `00188` | Genosys Microbiome Energy Infusing Mist 80ml | 70 |
| `00189` | Genosys Skin Rescue Overnight Cream Mask 100g | 70 |
| `54458` | Genosys Moisture Replenishing Hyaluron Cream 50g | 50 |
| `00037` | Genosys Skin Barrier Protecting Cream 100g | 60 |
| `00194` | Genosys Multi Vita Radiance Serum 30ml | 60 |
| `00190` | Genosys Multi Functional Anti-Wrinkle Cream 50g | 60 |
| `00122` | Genosys Multi-Vita Radiance Cream 50g | 50 |
| `00021` | Genosys Snow O2 Cleanser 180ml | 70 |
| `00191` | Genosys Multi Functional Anti-Wrinkle Serum 30ml | 50 |
| `00040` | Genosys Intensive Blemish Balm Cream 50g | 50 |
| `00129` | Genosys EPI Turnover Boosting Peeling Gel 100g | 40 if Montaji/import OK |
| `00031` | Genosys Intensive Hydro Soothing Cream 50g | 30 |
| `54473` | Genosys Revita Glow BB Cream #02 Natural 50g | 60 |
| `00051` | Genosys HR3 Matrix Hair Tonic 70ml | 30 |
| `00195` | Genosys Moisture Replenishing Hyaluron Serum 30ml | 20 |
| `54472` | Genosys Revita Glow BB Cream #01 Bright 50g | 40 |
| `00055` | Genosys EyeCell Eye Contour Cream 20ml | 30 |
| `54465` | Genosys Soothing Repair Post Cream 100g | 20 |
| `00145` | Genosys Problem Control Toner 200ml | 20 |
| `54461` | Genosys Skin Defender Lip & Eye Makeup Remover 200ml | 15 |
| `00036` | Genosys Intensive Problem Control Cream 250g | 10 |
| `00024` | Genosys Snow O2 Cleanser 500ml | 20 |
| `00123` | Genosys Multi Vita Radiance Cream 230g | 10 |
| `54471` | Genosys HR3 Matrix Scalp Brush | 5 |
| `00052` | Genosys HR3 Matrix Scalp & Hair Shampoo 300ml | 10 |

## Optional Top-Ups

Only add these if supplier lead time / freight timing is long or we want a bigger summer buffer.

| Code | Product | Qty |
|---|---|---:|
| `00140` | Genosys Soothing Bomb Sea Algae Mask 23g | 200 |
| `00063` | Genosys Intensive Repair Collagen Mask 23g | 200 |
| `00053` | Genosys EyeCell Eye Peptide Gel Patch (box) | 20 |
| `00011` | Genosys EZ CO2 MASK - Professional Box (5 treatments) | 10 |
| `00057` | Genosys HR3 Matrix Mesopecia KIT Stamp (box) | 2 |

## Do Not Order Now / Watch

| Code | Product | Available today | 90d sold | Days cover |
|---|---|---:|---:|---:|
| `54467` | Genosys Skin Reboot PDRN Mask Pack | 151 | 114 | 119 |
| `00012` | Genosys Peptide Gel Mask 39g | 1314 | 787 | 150 |
| `00013` | Genosys Hydro Cool Modeling Mask 1kg | 108 | 64 | 152 |
| `00030` | Genosys All For Sensitive Serum 30ml | 40 | 27 | 133 |

## Important Controls

- Do not reorder `00042` Genosys EGF Repair Oxymask Cream 50ml unless supplier confirms it is active again. It is currently treated as discontinued / sell-through.
- Order `00129` EPI Turnover Boosting Peeling Gel only if Montaji renewal/import compliance is confirmed.
- Do not reorder `54467` Genosys Skin Reboot PDRN Mask Pack in this PO. MoySklad shows roughly `151` available and the business view is that current stock is sufficient; keep it on watch instead.
- Treat sheet-mask quantities as optional top-ups, not urgent. SPF, hydration repair, radiance serum/cream, anti-wrinkle serum/cream, and BB creams are more important for this PO.
