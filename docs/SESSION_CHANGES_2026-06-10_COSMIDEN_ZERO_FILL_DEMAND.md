# Cosmiden — zero-fill consignment demand (2026-06-10)

**Customer:** COSMIDEN MEDICAL CENTER L.L.C (`d7b0a67f-d5a2-11ef-0a80-16cd0019b6b8`)  
**Agreement:** **15** (`69b01872-d7dd-11ef-0a80-0725003ffada`)

## Request

Stock sheet **31.05.2026**: ship **×1** for every line at **0** stock.  
**Exclude** Soothing Repair Post Cream 20g (`00038`) — clinic still has 2 on hand.

## Logic

| Category | SKUs | Action |
|----------|------|--------|
| Stock > 0 on sheet | `00037`, `00035`, `54464`, `00053`, `00129`, `00038` | Skip |
| Already on demand **06333** | `00022`, `00143`, `00144`, `00063`×20, `00140`×20 | Skip (no duplicate) |
| Zero on sheet, not above | 11 SKUs below | **×1 each** on new demand |

## Created document

| Field | Value |
|-------|--------|
| **Отгрузка** | **06334** |
| ID | `92984271-64c2-11f1-0a80-1120001cd432` |
| Sum | **1,560.00 AED** (11 pcs, VAT incl.) |
| State | Shipped |
| [Edit](https://online.moysklad.ru/app/#demand/edit?id=92984271-64c2-11f1-0a80-1120001cd432) |

## Lines

| Code | Product | Qty | Unit | Line |
|------|---------|----:|-----:|-----:|
| `00021` | Snow O₂ Cleanser 180ml | 1 | 165.00 | 165.00 |
| `00145` | Problem Control Toner 200ml | 1 | 130.00 | 130.00 |
| `00122` | Multi-Vita Radiance Cream 50g | 1 | 145.00 | 145.00 |
| `00031` | Intensive Hydro Soothing Cream 50g | 1 | 145.00 | 145.00 |
| `00190` | Multi Functional Anti-Wrinkle Cream 50g | 1 | 145.00 | 145.00 |
| `54458` | Moisture Replenishing Hyaluron Cream 50g | 1 | 145.00 | 145.00 |
| `00042` | EGF Repair Oxymask Cream 50ml | 1 | 145.00 | 145.00 |
| `54457` | Ultra Shield Sun Cream SPF50 50g | 1 | 125.00 | 125.00 |
| `00040` | Intensive Blemish Balm Cream 50g | 1 | 125.00 | 125.00 |
| `00054` | EyeCell Eye Contour Serum 10ml | 1 | 185.00 | 185.00 |
| `00041` | Multi Sun Cream SPF40 40g | 1 | 105.00 | 105.00 |

## Script

`scripts/moysklad-create-cosmiden-demand-zero-fill-20260610.js`

```bash
node --import dotenv/config scripts/moysklad-create-cosmiden-demand-zero-fill-20260610.js
node --import dotenv/config scripts/moysklad-create-cosmiden-demand-zero-fill-20260610.js --commit
```

Marker: `Cosmiden zero-fill stock sheet 20260531 excl postcream 2026-06-10`.

## Note on post cream

Demand **06333** (same day) still includes **1× `00038`** from the earlier historical restock request. This zero-fill demand correctly **excludes** post cream per the latest sheet rule. Remove `00038` from **06333** manually in MoySklad if that line should not ship.

## Related

- Demand **06333**: masks ×20 + historical SKUs — see [SESSION_CHANGES_2026-06-10_COSMIDEN_CONSIGNMENT_RESTOCK_DEMAND.md](./SESSION_CHANGES_2026-06-10_COSMIDEN_CONSIGNMENT_RESTOCK_DEMAND.md)

---

## Merged into demand 06333 (2026-06-10, later same day)

This отгрузка (**06334**) was **deleted** after its 11 lines were combined with **06333** (minus **`00038`** on **06333**). Single surviving document:

| Field | Value |
|-------|--------|
| **Отгрузка** | **06333** |
| ID | `028bedba-64c1-11f1-0a80-1120001c6c1b` |
| Sum | **2,710.00 AED** (16 lines / 54 pcs, VAT incl.) |
| [Edit](https://online.moysklad.ru/app/#demand/edit?id=028bedba-64c1-11f1-0a80-1120001c6c1b) |

Merge script: `scripts/moysklad-merge-cosmiden-demands-06333-06334-20260610.js`

```bash
node --import dotenv/config scripts/moysklad-merge-cosmiden-demands-06333-06334-20260610.js
node --import dotenv/config scripts/moysklad-merge-cosmiden-demands-06333-06334-20260610.js --commit
```

See [SESSION_CHANGES_2026-06-10_COSMIDEN_CONSIGNMENT_RESTOCK_DEMAND.md](./SESSION_CHANGES_2026-06-10_COSMIDEN_CONSIGNMENT_RESTOCK_DEMAND.md) for full merged line list context.
