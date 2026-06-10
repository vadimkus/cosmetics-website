# Korea reorder recheck — live MoySklad (2026-06-03)

**Run:** `node --import dotenv/config scripts/moysklad-restock-analysis.js --horizon=90 --target=120`  
**Report:** `docs/MOYSKLAD_RESTOCK_2026-06-03.txt`  
**Data as of:** 2026-06-03 ~14:14 UAE

---

## 1. Olena Zybenok — invoice 04605 ✅

| Doc | Number | Sum |
|-----|--------|-----|
| Order | GENCardW2606021798 | **1,049.60 AED** |
| Invoice | 04605 | **1,049.60 AED** |

Fix script dry-run: **0 lines to update** — bundle 20% on paid lines, promo lines at 0 AED.  
See `docs/SESSION_CHANGES_2026-06-03_OLENA_ZYBENOK_ORDER_INVOICE_DELTA.md`.

---

## 2. DM GME 260513 shipment ✅

- **Physical arrival:** 2026-05-21 (AWB 17620493281)
- **MoySklad supply:** **00183** posted 2026-05-24, sum **51,755.90 AED** (= PO DM GME 260513)
- **Also:** supply **00182** (260508 rectified) 2026-05-16
- **Catalogues + sample boxes:** **carton 27 of 27** — see `docs/SESSION_CHANGES_2026-06-02_DM_GME_260513_PACKING_BOX27.md`

**Not in May Korea receipts (00182 + 00183):**

| Code | Product | Notes |
|------|---------|--------|
| `00140` | Sea Algae Mask 23g | No Korea line; high consignment burn (~12/day) |
| `00022` | Snow Booster Toner 200ml | Not ordered May |
| `00037` | Skin Barrier Cream 100g | Not ordered May |
| `54467` | PDRN mask pack 30 sheets | Not ordered May |

**May hair line (why tonic is still critical):** `00051` received **50** (30 + 20) but **43 sold in last 30d** → **36** on hand (~25 days).

**Post cream 20g:** May brought **7× postcream boxes** (`00039`, 84 vials). Loose SKU `00038` shows **3** — likely mostly still in boxes or allocated to consignment.

---

## 3. Live restock flags (90-day horizon, 120-day target)

### CRITICAL — order now

| Code | Product | Stock | 30d sold | Days left | Script order |
|------|---------|------:|---------:|----------:|-------------:|
| `00038` | Soothing Repair Post Cream 20g | 3 | 11 | **8** | 41 |
| `00051` | HR³ Matrix Hair Tonic 70ml | 36 | 43 | **25** | 136 |

### URGENT — this week

| Code | Product | Stock | 30d sold | Days left | Script order |
|------|---------|------:|---------:|----------:|-------------:|
| `00004` | Manual Roller 1.5mm | 1 | 1 | 30 | 3 |
| `00037` | Skin Barrier Cream 100g | 19 | 12 | 48 | 29 |
| `00053` | EyeCell Gel Patch (box) | 82 | 50 | 49 | 118 |
| `00052` | HR³ Shampoo 300ml | 42 | 25 | 50 | 58 |
| `54464` | BB Cushion #3 Camel | 42 | 25 | 50 | 58 |
| `00022` | Snow Booster Toner 200ml | 57 | 33 | 52 | 75 |
| `00140` | Sea Algae Mask 23g | 637 | 359 | 53 | 799 |

### PLAN — 2–3 weeks

| Code | Product | Stock | Days left | Script order |
|------|---------|------:|----------:|-------------:|
| `00024` | Snow O₂ Cleanser 500ml | 16 | 69 | 12 |
| `00194` | Multi Vita Radiance Serum | 71 | 69 | 54 |
| `54470` | PDRN Expert Ampoule 60000 | 7 | 70 | 5 |
| `00190` | Anti-Wrinkle Cream 50g | 60 | 72 | 40 |
| `00021` | Snow O₂ Cleanser 180ml | 170 | 74 | 106 |
| `00191` | Anti-Wrinkle Serum 30ml | 54 | 81 | 26 |
| `00188` | Microbiome Mist 80ml | 186 | 86 | 74 |

**Script PO total:** **1,634 units** (~142,854 AED retail; supplier cost ~40–60%).

---

## 4. Do NOT reorder (confirmed)

| Code | Reason | Stock |
|------|--------|------:|
| `00042` | Discontinued (Oxymox) | 18 |
| `00028` | Replaced by radiance line | — |
| `00012` | Peptide mask — May +1000/+500; **2,295** on hand | 2,295 |
| `00063` | Collagen mask — May +500; **1,431** on hand | 1,431 |
| `54457` / `00041` | SPF — May restock + consignment; **126 / 172** on hand, low retail turnover | OK |
| `54467` | PDRN sheet pack — **109** on hand, slow mover | OK |

---

## 5. Recommended Korea PO (rounded for ordering)

Priorities for **next DTS invoice** (~6–8 week lead). Quantities rounded from script; sea algae kept large because **not in May PO** and **~12 units/day** consignment burn.

### Tier 1 — ship immediately

| Code | Product | Qty |
|------|---------|----:|
| `00051` | HR³ Matrix Hair Tonic 70ml | **150** |
| `00038` | Soothing Repair Post Cream 20g | **50** |
| `00140` | Soothing Bomb Sea Algae Mask 23g | **600** |
| `00037` | Skin Barrier Protecting Cream 100g | **30** |
| `00022` | Snow Booster Toner 200ml | **80** |
| `00053` | EyeCell Eye Peptide Gel Patch (box) | **120** |
| `00052` | HR³ Scalp & Hair Shampoo 300ml | **60** |
| `54464` | BB Cushion #3 Camel | **60** |

**Tier 1 subtotal:** ~**1,150** units

### Tier 2 — same container if space/budget

| Code | Product | Qty |
|------|---------|----:|
| `00021` | Snow O₂ Cleanser 180ml | **100** |
| `00188` | Microbiome Mist 80ml | **80** |
| `00190` | Anti-Wrinkle Cream 50g | **40** |
| `00194` | Multi Vita Radiance Serum 30ml | **50** |
| `00191` | Anti-Wrinkle Serum 30ml | **30** |
| `00024` | Snow O₂ Cleanser 500ml | **15** |
| `54470` | PDRN Expert Ampoule 60000 | **10** |
| `00004` | Manual Roller 1.5mm | **5** |

**Tier 2 subtotal:** ~**330** units

### Marketing (optional — carton 27 already had 100 catalogues)

| Item | Qty | Note |
|------|----:|------|
| GENOSYS Catalogue | 50–100 | Only if warehouse/clinic stock low |
| Sample boxes (mixed) | 1–2 each | Summer clinic openings |

**Combined order:** ~**1,480 units** (Tiers 1+2), vs script **1,634** (difference mainly sea algae rounding 600 vs 799).

**MoySklad draft PO (T1+T2):** `scripts/moysklad-create-po-dts-korea-reorder-20260603.js`  
Dry run: `node --import dotenv/config scripts/moysklad-create-po-dts-korea-reorder-20260603.js`  
Post: add `--commit`. Tier 1 only: `--tier1-only`.

---

## 6. Action items

1. **Place Korea PO this week** — hair tonic + post cream 20g are true stockout risks before next air shipment lands.
2. **Sea algae `00140`** — largest line; was **never** on DM GME 260513; consignment reports (Jun 1–2) show heavy pull across Persona, Love My Body, Volna, etc.
3. **Post `00038` vs box `00039`** — consider unpacking/receiving loose 20g from May boxes if warehouse shows 3 singles while boxes sit unopened.
4. **Do not add** peptide/collagen/SPF to Korea list until stock drops below ~90-day cover.
