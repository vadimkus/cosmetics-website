# Session Changes — April 27, 2026 — ARFI Consignment Recommendations

## Context

Vadim requested MoySklad-based recommendations for improving consignment stock for:

- `ARFI NAILS BEAUTY SALON`
- `ARFI NAILS BEAUTY SALON 2`

Goal: check each salon's existing GENOSYS consignment activity and recommend items from available GENOSYS warehouse stock to add/top up.

## Data Sources

- MoySklad counterparties:
  - `ARFI NAILS BEAUTY SALON`
  - `ARFI NAILS BEAUTY SALON 2`
- MoySklad demand documents since `2023-01-01`
- Demand document positions resolved via product entity refs
- Current warehouse stock from `/report/stock/all`
- GENOSYS turnover from `/report/turnover/all` over 30 and 90 days

No MoySklad records were created or modified.

## Script Added

`scripts/moysklad-arfi-consignment-analysis.js`

Read-only analysis script that:

1. Resolves both ARFI counterparties.
2. Pulls demand, return, customer order, and invoice documents for each counterparty.
3. Resolves product positions from MoySklad refs.
4. Cross-checks products against warehouse availability and recent GENOSYS turnover.
5. Writes structured output to `tmp/moysklad-arfi-consignment-analysis.json`.

## Key Findings

### ARFI NAILS BEAUTY SALON

- Demand documents found: `9`
- GENOSYS SKUs seen in demand history: `22`
- Recommended dispatch: `29 units`
- Direction: broad controlled top-up of existing proven sellers.

Top items:

- 3 x `00140` Genosys Soothing Bomb Sea Algae Mask 23g
- 2 x `00063` Genosys Intensive Repair Collagen Mask 23g
- 2 x `00012` Genosys Peptide Gel Mask 39g
- 2 x `00144` Genosys Skin Caring BB Cushion #2 Beige
- 2 x `00021` Genosys Snow O2 Cleanser 180ml
- 2 x `54467` Genosys Skin Reboot PDRN Mask Pack
- 2 x `00188` Genosys Microbiome Energy Infusing Mist 80ml
- 2 x `54457` Genosys Ultra Shield Sun Cream SPF50

### ARFI NAILS BEAUTY SALON 2

- Demand documents found: `2`
- GENOSYS SKUs seen in demand history: `24`
- Recommended dispatch: `28 units`
- Direction: smaller curated refresh, mostly two units per line.

Top items:

- 2 x `00063` Genosys Intensive Repair Collagen Mask 23g
- 2 x `00140` Genosys Soothing Bomb Sea Algae Mask 23g
- 2 x `00144` Genosys Skin Caring BB Cushion #2 Beige
- 2 x `54467` Genosys Skin Reboot PDRN Mask Pack
- 2 x `00041` Genosys Multi Sun Cream SPF40
- 2 x `54457` Genosys Ultra Shield Sun Cream SPF50
- 2 x `00190` Genosys Multi Functional Anti-Wrinkle Cream 50g
- 2 x `00191` Genosys Multi Functional Anti-Wrinkle Serum 30ml

## Important Assumption

MoySklad shows ARFI history as demand documents. These documents are good evidence of consignment activity and item movement, but they are not a confirmed physical shelf count inside each salon. Before dispatching high-value creams/serums, request a quick shelf count or photo from each branch.

## Canvas

Created canvas:

`/Users/vadimkus/.cursor/projects/Users-vadimkus-VisionDrive/canvases/arfi-consignment-recommendations.canvas.tsx`

It contains the split Salon 1 / Salon 2 recommendation tables, warehouse availability, 30/90-day GENOSYS sell-through, and watch/exclude notes.

## Live MoySklad Documents Created

After Vadim approved creating the shipments and requested adding `Multi Vita Radiance Serum 30ml` and `Moisture Replenishing Hyaluron Serum 30ml` to each salon, two live MoySklad `Отгрузка` documents were created.

Script:

`scripts/moysklad-create-arfi-consignment-demands.js`

Created documents:

- `ARFI NAILS BEAUTY SALON`: MoySklad `Отгрузка` `06036`, ID `585544cb-4221-11f1-0a80-09740075fe2c`, total `33` units, `3996.00 AED` VAT-inclusive.
- `ARFI NAILS BEAUTY SALON 2`: MoySklad `Отгрузка` `06037`, ID `5942f4ee-4221-11f1-0a80-03b50076c1d4`, total `32` units, `4242.00 AED` VAT-inclusive.

Verification readback confirmed:

- Both documents are `applicable=true`.
- Both documents are `vatIncluded=true`.
- Each document has `16` product lines.
- Correct counterparties were used:
  - `ARFI NAILS BEAUTY SALON`: `39a1aa83-a5a6-11f0-0a80-1cbc00050fea`
  - `ARFI NAILS BEAUTY SALON 2`: `dc883e47-f051-11f0-0a80-0f7100059e21`

## Missing 50g Creams + Serums Added

Vadim then requested adding `x2` of every GENOSYS `50g` cream and every serum that each salon did not already have.

Script:

`scripts/moysklad-add-arfi-missing-creams-serums.js`

Target product universe:

- 50g creams: `00040`, `00031`, `00035`, `54458`, `00190`, `00122`, `54472`, `54473`, `54457`
- Serums: `00030`, `00027`, `00054`, `00195`, `00191`, `00194`, `00029`

Added to `ARFI NAILS BEAUTY SALON` / `06036`:

- `00040` Genosys Intensive Blemish Balm Cream 50g x2
- `00031` Genosys Intensive Hydro Soothing Cream 50g x2
- `00035` Genosys Intensive Problem Control Cream 50g x2
- `00122` Genosys Multi-Vita Radiance Cream 50g x2
- `00030` Genosys All For Sensitive Serum 30ml x2
- `00027` Genosys Anti-Wrinkle Serum 30ml x2
- `00054` Genosys EyeCell Eye Contour Serum 10ml x2
- `00191` Genosys Multi Functional Anti-Wrinkle Serum 30ml x2
- `00029` Genosys Problem Control Serum 30ml x2

Added to `ARFI NAILS BEAUTY SALON 2` / `06037`:

- `54472` Genosys Revita Glow BB Cream #01 Bright 50g x2
- `54473` Genosys Revita Glow BB Cream #02 Natural 50g x2
- `00030` Genosys All For Sensitive Serum 30ml x2
- `00027` Genosys Anti-Wrinkle Serum 30ml x2
- `00054` Genosys EyeCell Eye Contour Serum 10ml x2

Final verified documents:

- `06036`: `25` product lines, `51` units, `6806.00 AED` VAT-inclusive.
- `06037`: `21` product lines, `42` units, `5772.00 AED` VAT-inclusive.

Final coverage verification across each salon's ARFI demand history:

- `ARFI NAILS BEAUTY SALON`: no missing target 50g cream / serum codes.
- `ARFI NAILS BEAUTY SALON 2`: no missing target 50g cream / serum codes.

Note: during the position update, MoySklad unexpectedly inflated three Salon 1 mask quantities. These were corrected back to the approved quantities (`00140` x3, `00063` x2, `00012` x2) and the final total was re-verified.
