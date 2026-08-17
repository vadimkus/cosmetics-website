# Full INCI coverage list — 2026-08-12

Source of truth: Intertek formula / artwork / ingredient certificates only.  
Rule: copy INCI text from documents. Do not invent. Append `Full INCI` card;  
keep existing key-ingredient cards.

Script: `scripts/add-full-inci-from-intertek.ts`  
(`npx tsx --env-file=.env.local scripts/add-full-inci-from-intertek.ts <id> [--apply]`)

## Skip (no cosmetic formula)

Devices / kits / boxes: 1, 3, 47, 48, 49, 50, 54–59, 62  
Tools: 61 Scalp Brush, 64 Hair Stamp

## Done — Full INCI live (formula products)

| ID | Product | INCI cards | Source type |
|---|---|---|---|
| 4 | POWER SOLUTION HES | 1 | Formula PDF |
| 5 | POWER SOLUTION CVS | 1 | Formula_up PDF |
| 6 | POWER SOLUTION CTS | 1 | Formula_up PDF |
| 7 | POWER SOLUTION PCS | 1 | Formula_up PDF |
| 8 | POWER SOLUTION SWS | 1 | Formula_up PDF |
| 9 | POWER SOLUTION AWS | 1 | Formula_up PDF |
| 10 | SNOW O₂ CLEANSER | 1 | Formula_up PDF |
| 11 | SKIN DEFENDER LIP & EYE MAKEUP REMOVER | 1 | Product-folder Formula PDF |
| 12 | EPI TURNOVER BOOSTING PEELING GEL | 1 | Formula_up PDF |
| 13 | SKIN RENEWAL PEELING SYSTEM (SRS) | 1 | Artwork Ingredients block |
| 14 | MICROBIOME ENERGY INFUSING MIST | 1 | Formula xlsx |
| 15 | INTENSIVE PROBLEM CONTROL TONER | 1 | Product-folder Formula PDF |
| 16 | SNOW BOOSTER | 1 | Formula_up PDF |
| 17 | EyeCell EYE CONTOUR SERUM | 1 | Formula_up PDF |
| 18 | MOISTURE REPLENISHING HYALURON SERUM | 1 | Formula_updated PDF |
| 19 | ALL FOR SENSITIVE SERUM | 1 | Formula_up PDF |
| 20 | PROBLEM CONTROL SERUM | 1 | Formula_up PDF |
| 21 | MULTI VITA RADIANCE SERUM | 1 | Product-folder Formula PDF |
| 22 | MULTI FUNCTIONAL ANTI-WRINKLE SERUM | 1 | Formula_up PDF |
| 23 | ND Cell ANTI-WRINKLE CREAM | 1 | Formula_up PDF |
| 24 | EyeCell EYE CONTOUR CREAM | 1 | Formula_up PDF |
| 25 | SOOTHING REPAIR POSTCREAM | 1 | Formula_up PDF |
| 27 | SKIN BARRIER PROTECTING CREAM | 1 | Formula_up PDF |
| 28 | INTENSIVE HYDRO SOOTHING CREAM | 1 | Formula_up PDF |
| 29 | MOISTURE REPLENISHING HYALURON CREAM | 1 | Formula_updated PDF |
| 30 | INTENSIVE PROBLEM CONTROL CREAM | 1 | Formula_up PDF |
| 31 | MULTI VITA RADIANCE CREAM | 1 | Formula_up PDF |
| 32 | MULTI FUNCTIONAL ANTI-WRINKLE CREAM | 1 | Formula_up PDF |
| 33 | EyeCell EYE PEPTIDE GEL PATCH | 1 | Formula_up PDF |
| 34 | SKIN RESCUE OVERNIGHT CREAM MASK | 1 | Ingredients PDF |
| 35 | HYDRO COOL MODELING MASK | 1 | Formula_up (powder; Diatomaceous first) |
| 36 | SOOTHING BOMB SEA ALGAE MASK | 1 | Formula_up PDF |
| 37 | PEPTIDE GEL MASK | 1 | Formula_up PDF |
| 38 | EZ CO₂ MASK KIT | 2 | Gel + Mask Formula_up PDFs |
| 39 | ULTRA SHIELD SUN CREAM | 1 | Product-folder Formula PDF |
| 40 | MULTI SUN CREAM | 1 | Formula_up PDF |
| 41 | SKIN CARING BB CUSHION | 1 | Camel #03 Formula (base shared across shades) |
| 42 | INTENSIVE BLEMISH BALM CREAM | 1 | Formula_up PDF |
| 43 | HR³ MATRIX HAIR TONIC α | 1 | Ingredient certificate PDF |
| 44 | HR³ MATRIX MEDI SCALP SHAMPOO α | 1 | Done earlier (MEDI + Full INCI) |
| 45 | HR³ MATRIX HAIR SOLUTION α | 1 | Formula_up PDF |
| 46 | HR³ MATRIX SCALP PEELING α | 1 | Product-folder Formula PDF |
| 51 | BIO-FERMENT AGE DEFYING POWDER MASK | 1 | Powder formula (Diatomaceous first) |
| 52 | SKIN REBOOT PDRN MASK PACK | 1 | Product-folder Formula PDF |
| 53 | INTENSIVE REPAIR COLLAGEN MASK | 1 | Formula_up PDF |
| 60 | Bio Meso PDRN Ampoule 60000 | 1 | Expert Ampoule 60000 Formula PDF |
| 63 | REVITA GLOW BB CREAM | 1 | Bright #01 Formula (identical to #02) |
| 65 | Bio-Meso PDRN Homecare Ampoule 5000 | 1 | Done earlier |
| 66 | CERABARRIER BIOME GEL CLEANSER | 1 | Cerabarrier Formula PDF |

## Notes

- Product **38**: two cards — `Full INCI (Gel)` and `Full INCI (Mask)`.
- Products **41** / **63**: multi-shade; base INCI shared; pigments may vary slightly by shade.
- Powder masks **35** / **51**: correctly start with Diatomaceous Earth (not Aqua).
- Existing key-ingredient cards were preserved on every update.

## Progress log

| Date | Result |
|---|---|
| 2026-08-12 | List created; batch A applied (5–10, 12, 16) |
| 2026-08-12 | Batch 2: 11, 13–15, 17, 19–20, 23–24, 27–28, 30–31, 35–37, 40, 42–43, 45–46, 53, 66 |
| 2026-08-12 | Final batch: 4, 18, 21–22, 25, 29, 32–34, 38–39, 41, 51–52, 60, 63 — all formula SKUs covered |
