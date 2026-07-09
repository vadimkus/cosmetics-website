# Korea season top-up advice — after PO DM GME 260616 — 2026-06-18

**Data:** MoySklad live stock + turnover (30d/90d), Jun 2025 vs Jun 2026 MTD, open POs **260616** (493 u, ETA ~2026-07-07) and **Korea reorder 2026-06-03 T1+T2** (2,341 u, ETA 2026-08-01).

## What 260616 already covers

PDRN Expert ×70, PDRN Homecare ×50 (new), Snow O₂ 180ml ×100, toner ×80, cleanser 500ml ×20, CO₂ mask box ×50, overnight mask 100g ×20, postcream box ×10 + 100g ×10, HairGen ×5 + stamps ×10, roller ×5, sample/tester boxes.

**Does not cover:** sea algae, hair tonic/shampoo (except device), eyepatches, cushions/Revita, SPF50, makeup remover, problem-control toner, power-solution singles (CTS/AWS), EyeCell kit.

## Still to buy ON TOP of 260616 (120-day cover model)

| Priority | Code | Product | Stock | PO616 | Extra qty | Why |
|---|---|---|---:|---:|---:|---|
| **NOW** | 54461 | Skin Defender makeup remover 200ml | 9 | 0 | **55** | ~17d cover; Jun26 16 vs Jun25 6 |
| **NOW** | 54457 | Ultra Shield SPF50 50g | 106 | 0 | **80** | Summer; Jun26 40 vs Jun25 16 |
| **NOW** | 00145 | Problem Control Toner 200ml | 27 | 0 | **30** | ~58d cover; steady clinic SKU |
| **NOW** | 00069 | Power Solution CTS 2ml vial | 59 | 0 | **55** | Jun26 18 vs Jun25 0; CTS box not enough singles |
| **WEEK** | 54465 | Soothing Repair Post Cream 100g | 16 | 10 | **25** | 616 only partial vs 120d need |
| **WEEK** | 00144 | BB Cushion #2 Beige | 327 | 0 | **50–100** | Jun26 98 vs Jun25 47; retail hero |
| **WEEK** | 00053 | EyeCell gel patch box | 212 | 0 | **120** | Jun26 41 sold; not on 616 |
| **WEEK** | 00140 | Sea Algae Mask 23g | 1,047 | 0 | **200–400** | **314/30d**; Jun26 242 vs Jun25 122 — consignment burn |
| **PLAN** | 54464 | BB Cushion #3 Camel | 87 | 0 | **60** | Jun26 24 vs Jun25 5 |
| **PLAN** | 00188 | Microbiome Mist 80ml | 260 | 0 | **80** | Jun26 42 vs Jun25 27 |
| **PLAN** | 54472/54473 | Revita Glow Bright/Natural | 64/55 | 0 | **40/60** | New line, Jun MTD ~8 each |
| **PLAN** | 00059 | EyeCell zone care kit | 17 | 0 | **7** | Low stock, kit sales |
| **PLAN** | 54462 | Holiday Kit Coverage #2 | 0 | 0 | **4** | Stockout |

## Covered elsewhere — do not duplicate

- **Jun3 reorder PO** (if submitted to DTS): tonic ×150, algae ×600, eyepatch ×150, shampoo ×60, camel ×60, mist ×100, Revita ×30/30, beige ×100, etc.
- **Hair tonic `00051`:** stock **186** — was critical early Jun; OK now (+150 on Jun PO).
- **PDRN Expert `54470`:** 616 ×70 + stock 8 → covered.
- **Peptide `00012` / collagen `00063`:** 2,115 / 1,660 on hand — **no reorder** despite high Jun sales.

## Recommended supplementary invoice (if Jun3 PO is NOT sent)

**Tier A (~220 units):** 54461×55, 54457×80, 00145×30, 00069×55  
**Tier B (~480 units):** 00140×300, 00053×120, 54464×60, 54465×25, 00144×50  
**Tier C (~190 units):** 00188×80, 54472×40, 54473×60, 00059×7, 54462×4  

**~890 units** on top of 260616 for full Jul–Sep season cover.

If **Jun3 PO is live with DTS**, only **Tier A + 54465×25** likely needed on a small follow-up invoice.

## Action

1. Confirm whether **Korea reorder 2026-06-03** was sent to DTS or superseded by 260616.  
2. If not sent — submit Jun3 basket (or Tier A+B above) **this week**; next air/sea window ~6 weeks.  
3. Re-run: `node --import dotenv/config scripts/moysklad-restock-analysis.js --horizon=90 --target=120`
