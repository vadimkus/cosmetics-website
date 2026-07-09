# Korea reorder double-check — live MoySklad (2026-07-07)

**Scripts:** `moysklad-restock-analysis.js --horizon=90 --target=120`  
**Report:** `docs/MOYSKLAD_RESTOCK_2026-07-07.txt`

## PO pipeline status (verified)

| PO | Status | Notes |
|----|--------|-------|
| **DM GME 260616 ship** | **Fully received + paid** (55,453 AED) | Landed 2026-07-03 |
| **Korea reorder 2026-06-03 T1+T2** | **Fully received + paid** (58,129 AED) | No in-transit on any SKU |
| **DM GME 260513** | Fully received | May shipment |

**Nothing in transit.** Next Korea PO is net-new.

## Corrections vs prior advice (same day)

| Item | Prior call | Double-check |
|------|------------|--------------|
| **54475** PDRN Homecare | Order 30 | **Remove** — 74 avail, 605d cover (new SKU, slow ramp) |
| **54484** Cerabarrier 200ml | Order 40 | **Remove** — 91 avail, 1170d cover (launch stock enough) |
| **00140** Sea Algae Mask | Do not order | **Add ~150** — 1,174 avail but **1,044 sold/90d** (~111d cover; consignment burn) |
| **00144** Beige Cushion | Optional +80 | **Add ~100** — 350 avail, 307/90d; **Oct–Dec25 sold 259** vs Jul–Sep 114 |
| **00041** SPF40 | Not listed | **Add ~40** — 146 avail, model gap 38; summer pair to SPF50 |
| **54472** Revita Bright | Order 30 | **Reduce to ~20** — model gap 15 only |

## Revised Korea PO (rounded for DTS)

### Tier A — order now (~790 u)

| Code | Product | Qty | Model | Avail | 30d | Notes |
|------|---------|----:|------:|------:|----:|-------|
| 54461 | Makeup Remover 200ml | **50** | 48 | 4 | 13 | ~9d left |
| 54467 | PDRN Mask Pack | **250** | 232 | 40 | 68 | Oct–Dec25 **240** sold Q4 |
| 54457 | Ultra Shield SPF50 | **230** | 223 | 53 | 69 | Summer; 145/90d vs 77 last Jul–Sep |
| 00020 | Power Solution SWS 2ml | **260** | 259 | 81 | 85 | 124/90d vs 30 last Jul–Sep |

### Tier B — same shipment (~320 u)

| Code | Product | Qty | Model | Avail | 30d |
|------|---------|----:|------:|------:|----:|
| 54464 | Cushion #3 Camel | **130** | 127 | 57 | 46 |
| 00035 | Problem Control Cream 50g | **50** | 51 | 33 | 21 |
| 00195 | Hyaluron Serum 30ml | **60** | 56 | 40 | 24 |
| 00038 | Post Cream 20g | **80** | 80 | 68 | 37 |

### Tier C — season + Oct buffer (~325 u)

| Code | Product | Qty | Model | Avail | 30d | Notes |
|------|---------|----:|------:|------:|----:|-------|
| 00140 | Sea Algae Mask 23g | **150** | 102 | 1,174 | 319 | High consignment velocity |
| 00144 | Cushion #2 Beige | **100** | 94 | 350 | 111 | Oct peak heavier than summer |
| 00041 | Multi Sun SPF40 | **40** | 38 | 146 | 46 | Summer SPF stack |
| 00069 | Power Solution CTS 2ml | **55** | 53 | 55 | 27 | Peel season |
| 54473 | Revita BB #02 Natural | **40** | 36 | 40 | 19 | Jun PO 30 already sold through |
| 54472 | Revita BB #01 Bright | **20** | 15 | 49 | 16 | Pair line |
| 00037 | Barrier Cream 100g | **15** | 12 | 32 | 11 | PLAN bucket |
| 54462 | Holiday Kit #2 | **4** | 1 | 0 | 0 | Stockout |

**Total: ~1,435 units** (12 SKUs core + algae/cushion/SPF season lines)

## Confirmed do NOT order

| Code | Avail | 90d sold | Days cover (90d rate) |
|------|------:|---------:|----------------------:|
| 00012 Peptide mask | 1,852 | 1,172 | 142 |
| 00063 Collagen mask | 1,781 | 1,023 | 157 |
| 00053 Eye patch box | 189 | 108 | 158 |
| 00188 Microbiome mist | 236 | 155 | 137 |
| 00051 Hair tonic | 173 | 77 | 202 |
| 00021 Snow cleanser 180ml | 284 | 192 | 133 |
| 00022 Snow booster toner | 179 | 74 | 218 |
| 54475 PDRN Homecare | 74 | 11 | 605 |
| 54484 Cerabarrier 200ml | 91 | 7 | 1,170 |
| 54470 PDRN Expert | 105 | 25 | 378 |
| 00042 EGF Oxymask | 12 | 22 | **discontinued** |

## Timing

Order **this week** → ~6 weeks → **mid-Aug** landing (late summer + Oct clinic ramp).
