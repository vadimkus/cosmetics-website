# Korea PO — PI missing lines added (2026-06-12)

**PO:** `Korea reorder 2026-06-03 T1+T2` (`61767a0d-5f3a-11f1-0a80-191700184737`)  
**PI source:** DM GME 260605 proforma (paid commodity lines, page 1)

## Result

| | Before | After |
|---|---:|---:|
| **Lines** | 18 | **31** |
| **Units** | 1,580 | **2,346** |
| **Sum (buy)** | 42,081.00 AED | **56,760.10 AED** |

[Open PO](https://online.moysklad.ru/app/#purchaseorder/edit?id=61767a0d-5f3a-11f1-0a80-191700184737)

## 13 lines added from PI

| Inv | Code | Product | Qty | Line AED |
|-----|------|---------|----:|---------:|
| GCMA06 | `00063` | Collagen mask 23g | 500 | 1,450.00 |
| GCMA11 | `00189` | Overnight cream mask 100g | 20 | 1,060.00 |
| GCCR34 | `00034` | Anti-wrinkle cream 250g | 10 | 620.00 |
| GCCR31 | `00123` | Multi-Vita radiance cream 230g | 10 | 620.20 |
| GCCR39 | `54458` | Hyaluron cream 50g | 30 | 1,080.00 |
| GCCR09 | `00041` | Multi Sun SPF40 40g | 20 | 558.00 |
| GCCR07 | `00039` | Postcream pro box 12×20g | 6 | 1,343.40 |
| GCCR43 | `54465` | Postcream 100g | 5 | 265.00 |
| GCEX01 | `00129` | EPI peeling gel 100g | 20 | 500.00 |
| GCFO01 | `00143` | Cushion Ivory | 30 | 1,560.00 |
| GCFO02 | `00144` | Cushion Beige | 100 | 5,200.00 |
| GCHR13 | `00050` | HR³ scalp peeling 100ml | 10 | 382.00 |
| GMHR02 | `54471` | HR³ scalp brush | 5 | 40.50 |

**Add total:** +14,679.10 AED · +766 units

## Ignored (no MoySklad SKU or sample/FOC)

- **GCAP01** — PDRN Homecare Ampoule 5000 ×5 (no product in catalog)
- **GCCL03**, **GCCR42/20/22**, **GCCL05/06** — sample / registration lines
- **GCMA09** sea-algae bulk — already represented by **`00140` ×600** on PO

## Not changed (already on PO — PI qty may differ)

Existing 18 lines kept as-is. Examples where PI qty ≠ PO qty (not auto-updated):

| Code | PO qty | PI qty |
|------|-------:|-------:|
| `00024` | 15 | 20 |
| `00188` | 80 | 100 |
| `00190` | 40 | 50 |
| `00191` | 30 | 50 |
| `00053` | 120 | 150 |
| `54472` | 40 | 30 |
| `54473` | 60 | 30 |

Say if you want PI qty reconciliation on these existing lines too.

## Qty reconciliation (2026-06-12) — done

| Code | Was | PI | Change |
|------|----:|---:|--------|
| `00024` | 15 | 20 | +5 |
| `00188` | 80 | 100 | +20 |
| `00190` | 40 | 50 | +10 |
| `00191` | 30 | 50 | +20 |
| `00053` | 120 | 150 | +30 |
| `54472` | 40 | 30 | −10 |
| `54473` | 60 | 30 | −30 |
| `00038` | 50 | — | **removed** (not on PI; postcream = `00039` box ×6) |

**PO after recon:** **57,958.60 AED** · **30 lines** · matches PI paid commodity qty.

Script: `scripts/moysklad-reconcile-korea-po-pi-qty-20260612.js`

```bash
node --import dotenv/config scripts/moysklad-update-korea-po-pi-missing-lines-20260612.js --commit
```
