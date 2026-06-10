# DM GME 260513 — Postcream box → loose 20g (purchase chain correction)

**Date:** 2026-06-10  
**Script:** `scripts/moysklad-modify-po-dts-260513-postcream-box-to-loose-20260610.js`  
**Marker:** `DM-GME-260513-POSTCREAM-BOX-TO-LOOSE-2026-06-10`

## Why

Korea shipment **DM GME 260513** (GCCR07) was booked as **7× professional box** `00039` (12×20g). Warehouse/sales use loose vial SKU `00038`. Correct the full linked purchase chain to **84× loose** while preserving document totals.

## Document chain (unchanged IDs / numbers)

| Step | Type | Number | ID | Sum |
|------|------|--------|-----|-----|
| 1 | Purchase order | DM GME 260513 | `5521fcbb-5466-11f1-0a80-0b2a0023de1d` | **51,755.90 AED** |
| 2 | Supplier invoice | 00171 | `62a46c92-5780-11f1-0a80-1b7c00251bab` | **51,755.90 AED** |
| 3 | Supply (posted) | 00183 | `581e3e1d-5781-11f1-0a80-04f500247c11` | **51,755.90 AED** |
| 4 | Outgoing payment | 00606 | `63148935-5781-11f1-0a80-076a00242076` | **51,755.90 AED** |

## Line change — Soothing Repair Post Cream 20g

| | SKU | Qty | Unit buy | Line total |
|---|-----|----:|---------:|-----------:|
| **Before** | `00039` (box 12×20g) | 7 | 223.90 AED | **1,567.30 AED** |
| **After** | `00038` (loose 20g) | 84 | 70×18.66 + 14×18.65 | **1,567.30 AED** |

**Pricing logic:** 7 × box buyPrice (22,390 fils) = 156,730 fils → split across 84 pcs as **70 @ 1,866** + **14 @ 1,865** fils (exact; P/12 = 1865.83… is not an integer fil).

Product IDs:
- `00039` box: `ebb38e3d-42b8-11ea-0a80-0475000baa7d`
- `00038` loose: `bc185527-42b8-11ea-0a80-0095000bf07a`

## Execution

1. Unposted **payment 00606** → **supply 00183** → **invoice 00171**
2. Deleted `00039` position on PO / invoice / supply; added two `00038` lines (70 + 14) on each
3. Reposted invoice → supply → payment
4. PO description appended with marker + correction note

## Verification (post-commit)

| Doc | `00039` | `00038` qty | `00038` line AED | Sum |
|-----|---------|------------:|-----------------:|----:|
| PO DM GME 260513 | none | 84 | 1,567.30 | 51,755.90 ✓ |
| Invoice 00171 | none | 84 | 1,567.30 | 51,755.90 ✓ |
| Supply 00183 | none | 84 | 1,567.30 | 51,755.90 ✓ |
| Payment 00606 | — | — | — | 51,755.90 ✓ |

## Warehouse stock impact

| SKU | Before on hand | After on hand | Δ from supply repost |
|-----|---------------:|--------------:|---------------------:|
| `00039` | 5 | **−2** | −7 (receipt no longer books boxes) |
| `00038` | 0 | **84** | +84 (receipt now books loose) |

**Manual follow-up:** `00039` shows **−2** available because **2 of the 7 received boxes** were already unpacked for sales (loss/enter) while the supply still credited 7 boxes. Supply repost correctly removes the 7-box receipt; it does **not** reverse prior unpack movements. Options:

1. **Accept** −2 boxes as “already consumed from this shipment” and use the new **84 loose** on hand for sales/consignment, or  
2. Post a small **enter** of 2× `00039` if physical boxes remain, or **loss** of 2× `00039` to zero out the negative if boxes are gone.

Prior unpack example: Shakirovna Ladies commission demand (`SESSION_CHANGES_2026-06-10_SHAKIROVNA_LADIES_COMMISSION_DEMAND.md`) used loss/enter `00039` → `00038`.

## Usage

```bash
node --import dotenv/config scripts/moysklad-modify-po-dts-260513-postcream-box-to-loose-20260610.js
node --import dotenv/config scripts/moysklad-modify-po-dts-260513-postcream-box-to-loose-20260610.js --commit
```

## Related

- `docs/SESSION_CHANGES_2026-05-20_DTS_PO_DM_GME_260513.md` — original PO (GCCR07 as 7× box)
- `docs/SESSION_CHANGES_2026-06-03_KOREA_REORDER_RECHECK.md` — supply 00183 / postcream stock note
