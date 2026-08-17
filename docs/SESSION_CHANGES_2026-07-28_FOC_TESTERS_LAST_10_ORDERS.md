# FOC tester mix on last 10 orders (2026-07-28)

## What

Added free testers (100% discount, list 18 AED) to **order + invoice + demand** for the last 10 retail/web orders. Paid totals unchanged. Document moments kept as original.

Script: `scripts/moysklad-add-foc-testers-last-10-orders-20260728.js`  
Marker: `FOC-TESTERS-MIX-LAST10-2026-07-28`

## Mix (always includes shampoo `00121`)

| Order | Customer | Inv / Ship | FOC codes |
|-------|----------|------------|-----------|
| GENCardM2607261121 | Anastasiya | 04864 / 06595 | 00121, 54476, 00135 |
| GENCardM2607269771 | Arina | 04863 / 06594 | 00121, 54476, 00135 |
| GENCardM260726CIEL | Le Ciel | 04860 / 06591 | 00121, 00120, 54479 |
| GENCardM2607260406 | Kseniya | 04862 / 06593 | 00121, 54489, 00135 |
| GENCardM2607261687 | Sara | 04861 / 06592 | 00121, 54489, 00116 |
| GENCardM260726SABA2 | Saba | 04859 / 06590 | 00121, 54479, 00120 |
| GENCardM2607258835 | Olga | 04858 / 06589 | 00121, 00116, 54476 |
| GENCardM2607246931 | Milena | 04857 / 06587 | 00121, 00120, 00135 |
| GENCardW2607246301 | Mariia | 04856 / 06586 | 00121, 54476, 54489 |
| GENCardM2607234104 | Sara | 04855 / 06585 | 00121, 54489, 00116 |

## Stock used (warehouse units)

| Code | Qty | Product |
|------|----:|---------|
| 00121 | 10 | HR³ shampoo tester 30ml |
| 54476 | 4 | Overnight mask samples 2g×50 |
| 00135 | 4 | EPI peeling gel samples |
| 54489 | 4 | Multi Vita Radiance Serum samples 2ml×100 |
| 00120 | 3 | Skin Barrier samples 2g×100 |
| 00116 | 3 | Problem Control Cream samples |
| 54479 | 2 | Hyaluron Cream samples 2g×100 |

Note: most sample SKUs are **box units** in MoySklad (not sachets). FOC exits 1 warehouse unit each.
