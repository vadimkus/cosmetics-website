# Cosmiden — consignment restock demand (2026-06-10)

**Customer:** COSMIDEN MEDICAL CENTER L.L.C (`d7b0a67f-d5a2-11ef-0a80-16cd0019b6b8`)  
**Agreement:** **15** (`69b01872-d7dd-11ef-0a80-0725003ffada`)

## Request

Clinic asked to restock **×1 each** product from their historical/current consignment range, **plus**:

- Collagen mask ×**20**
- Sea algae mask ×**20**

Masks mapped to MoySklad **23g** SKUs (`00063`, `00140`).

## Created document

| Field | Value |
|-------|--------|
| **Отгрузка** | **06333** |
| ID | `028bedba-64c1-11f1-0a80-1120001c6c1b` |
| Sum | **1,252.00 AED** (44 pcs, VAT incl.) |
| State | Shipped |
| [Edit](https://online.moysklad.ru/app/#demand/edit?id=028bedba-64c1-11f1-0a80-1120001c6c1b) |

## Lines

| Code | Product | Qty | Unit | Line |
|------|---------|----:|-----:|-----:|
| `00022` | Snow Booster Toner 200ml | 1 | 130.00 | 130.00 |
| `00143` | Blemish Balm Cushion #1 Ivory | 1 | 150.00 | 150.00 |
| `00144` | Blemish Balm Cushion #2 Beige | 1 | 150.00 | 150.00 |
| `00038` | Soothing Repair Post Cream 20g | 1 | 102.00 | 102.00 |
| `00063` | Intensive Repair Collagen Mask 23g | **20** | 18.00 | 360.00 |
| `00140` | Soothing Bomb Sea Algae Mask 23g | **20** | 18.00 | 360.00 |

## Script

`scripts/moysklad-create-cosmiden-demand-restock-20260610.js`

```bash
node --import dotenv/config scripts/moysklad-create-cosmiden-demand-restock-20260610.js
node --import dotenv/config scripts/moysklad-create-cosmiden-demand-restock-20260610.js --commit
```

Marker: `Cosmiden consignment restock historical x1 masks x20 2026-06-10`.

## Prior Cosmiden docs

- Demand **06286** (2026-06-05): masks ×10 + ×10 only
- Commission reports **01343** (May), **01376** (Jun masks)

---

## Merge into single demand (2026-06-10, later same day)

Demands **06333** and **06334** were merged into **06333** only (agreement **15**). Post cream **`00038` excluded**. Demand **06334** deleted.

| Field | Value (after merge) |
|-------|---------------------|
| **Отгрузка** | **06333** (surviving) |
| ID | `028bedba-64c1-11f1-0a80-1120001c6c1b` |
| Sum | **2,710.00 AED** (16 lines / 54 pcs, VAT incl.) |
| State | Shipped |
| Removed | **06334** `92984271-64c2-11f1-0a80-1120001cd432` |

Merge script: `scripts/moysklad-merge-cosmiden-demands-06333-06334-20260610.js`

Marker on **06333**: `Cosmiden merged demand 06333+06334 2026-06-10 (excl. 00038 post cream)`.

See also [SESSION_CHANGES_2026-06-10_COSMIDEN_ZERO_FILL_DEMAND.md](./SESSION_CHANGES_2026-06-10_COSMIDEN_ZERO_FILL_DEMAND.md) (former **06334** lines now on **06333**).
