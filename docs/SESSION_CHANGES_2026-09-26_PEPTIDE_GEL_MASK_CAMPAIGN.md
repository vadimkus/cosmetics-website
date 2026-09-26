# Product 37 PEPTIDE GEL MASK — "Blue means cool" campaign — 2026-09-26

Live target: https://genosys.ae/products/37

Working folder: `~/Desktop/peptide/`
- Source pack art: `PEPTIDE GEL MASK_pouch.png`, `PEPTIDE GEL MASK_outer box.png`,
  `PEPTIDE GEL MASK_new pouch with outer box.png` (pouch cropped at the left, not used as a reference)
- `campaign/PROMPTS.txt` — Main + 12 Seedance 2.5 prompts with negatives, headlines and support copy
- `campaign/ref_pouch_white.png` — pouch flattened on white, attach on 01 only
- `campaign/ref_box_pouch_white.png` — pouch beside the box (name panel visible), attach on Main and 12 only
- Renders go back into `~/Desktop/peptide/` as `Main.png`, `s1.png` … `s12.png`

## Concept
Sister campaign to product 53 ("RED MEANS STOP"). The mask line becomes a colour code.
Skin leaves a treatment running warm; the sheet is the instant cool-down.
Palette: GENOSYS royal blue `#0152C3` (pouch blue panel median) + white.
Type: Manrope Regular caps, blue on white slides, white on blue slides.

## Slides
| # | Slide | Headline | Visual |
|---|---|---|---|
| Main | Packshot | — | Pouch + box, ice cubes, white |
| 01 | Hero | BLUE MEANS / COOL. | Pouch front-on, crushed ice, low cold mist |
| 02 | The heat | STILL FEELING / THE HEAT? | Blown-out match, smoke ribbon, blue |
| 03 | The number | 20% · ONE FIFTH / GLYCERIN. | Jelly pie chart, one blue fifth |
| 04 | The gel | NOT A SHEET. / A GEL. | Clear hydrogel mask lifted by fingertips, blue |
| 05 | The calm | LICORICE, / NOT CANDY. | Licorice root bundle, blue silk bow |
| 06 | The cling | IT HOLDS ON. / YOU LET GO. | Plaster face wearing a clear gel mask, blue |
| 07 | The time | SIDE A. / THEN SIDE B. | White turntable, translucent blue vinyl |
| 08 | The fridge | FRIDGE, / THEN FACE. | Open white fridge, cold mist, blue |
| 09 | The ritual | PRESS IT ON. / SWITCH OFF. | Woman on sofa, gel mask, headphones |
| 10 | The clinic | THE CLINIC'S / LAST STEP. | Treatment room, clinician in blue scrubs |
| 11 | The encore | SHEET OFF. / NOW THE ENCORE. | Profile, massaging leftover essence, blue |
| 12 | Final card | KEEP / YOUR COOL. | Pouch + box right, end card left |

## Claim sources (Intertek, `Registration DOC/`)
- `Artwork/[GENOSYS]PEPTIDE GEL MASK.pdf` — pouch front: "instant cooling down and soothing effects,
  and moisturizes skin after dermatological procedures"; function moisturizing, soothing; refreshes;
  apply closely, 20~40 minutes, remove, massage remaining essence; refrigerate for a better cooling
  effect; 38 g including mesh × 5; carton "Highly adhesive to skin"; dermatologically tested; Korea.
- `Formula_up/Formula-GENOSYS PEPTIDE GEL MASK.pdf` — water 76.459%, glycerin 19.921%, carob gum
  2.200%, Chondrus crispus 0.800%, dipotassium glycyrrhizate 0.100%. Acetyl hexapeptide-8
  0.0000054%; all botanicals 0.003% or less.
- `SA/SA-GENOSYS PEPTIDE GEL MASK.pdf` — function moisturizing, soothing; pH 5.0–7.0.

## Kept off every slide
Peptide as the active, Botox / lift / firming / anti-wrinkle / anti-ageing, collagen or hyaluronic
acid heroes, healing, "patented thermo-sensitive" and delivery claims (printed on the carton, cut in
the 2026-08-15 audit), clinical percentages, all skin types, fragrance-free, pregnancy lines, LED
pairing, 15–20 or 20-minute-only timing, lot codes, contract manufacturer.

The new set replaces gallery `s1c`–`s5c`, which still print patented thermo-sensitive delivery.

## Render run (CapCut, GPT Image 2.5 · 2k · Medium · 1:1)
Main + s1–s12 are in `~/Desktop/peptide/` at 2560 × 2560. 13 jobs × 16 credits
(Main by hand, s1–s12 driven from the agent; credits 825 → 633).

- CapCut writes every generation to
  `~/Movies/CapCut/User Data/Projects/com.lveditor.draft/0915/ai_material/` as an obfuscated
  PNG: blocks of T bytes from offset 0, first A bytes of each block XORed with one byte
  (first byte ^ 0x89), plain trailer after IEND. T and A differ per file.
  `campaign/_scripts/capcut_decode.py` fits T/A from chunk headers and verifies every image
  chunk CRC; `decode_batch.py` decodes a list in parallel. Decoded files carry no Ai mark, so
  no demark step is needed for this set.
- All four variants per slide are in `_gen/raw/` (named `<mtime>_<uuid>.png`);
  `_gen/overview.jpg` shows the picks.
- Main: batch 2 variant 3. The first Main batch moved the box logo onto the blue lid and was
  rejected.

## Typeset EN / RU / AR (21:25–21:50)

- Script: `~/Desktop/peptide/campaign/_scripts/pep_slides.py [en|ru|ar|main] [n...]`, copy in
  `pep_copy.py`, Noto Sans Arabic in `campaign/_fonts/`. Same engine as product 53
  (`red_slides.py`) without the demark step. Backdrops pulled to the brand pair with the
  distance-weighted gain: white `#FBFBFB`→`#FFFFFF`, blue measured `#0145B1`–`#0147B8`→`#0152C3`
  (pouch blue). 09 (bedroom wall) untouched; 10 gets a white window-light haze over the curtain
  (0,0–1020,960, 220 px feather, 85%, saturated pixels excluded so the clinician's scrubs stay blue).
- Type: Manrope Regular, headline 140, support 64, x 120, top 200; ink blue on white, white on blue.
  01 headline fits to 880 px (BLUE / MEANS / COOL.); 03 stacks ONE FIFTH / GLYCERIN., 20% (400 px)
  and support above the jelly plate; 12 is the end card (KEEP / YOUR COOL. in blue, PEPTIDE / GEL
  MASK, 5 × 38 G, 20–40 MIN) with the claims and shop lines as a footer in the free bottom band.
- EN copy per slide is the PROMPTS.txt copy, unchanged. Every EN line sits at full size.
- RU: terms from `peptideGelLocalizedCopy.ts` (гидрогель, эссенция, камедь рожкового дерева,
  хондрус, дикалия глицирризат, солодка, decimal comma). 01 is СИНИЙ / ЗНАЧИТ / ХОЛОД. (ПРОХЛАДА
  forced a 0.63 shrink). Shrunk blocks: 01 head 0.91, 03 head 0.83, 04 support 0.93, 10 0.88/0.90,
  12 head 0.87.
- AR: Noto Sans Arabic Medium, right-aligned in the EN column, Latin runs in Manrope, feminine
  address. Fix: brackets fall back to Manrope and were drawn unmirrored, giving `)2.2%(`;
  `runs()` now mirrors `()[]{}` in fallback runs (verified by glyph shape on 04).
- Every EN / RU / AR line clears the picture: 0 non-backdrop px within 28 px.
- Masters: `campaign/final/NN.png`, `final/{ru,ar}/NN.png`, contact sheets in each;
  `final/main_clean.png` = Main with the backdrop pulled to pure white, no type.

## Site

- `public/images/peptide_campaign/main.jpg` + `s1–s12.jpg` + `{ru,ar}/s1–s12.jpg`
  (1600 px, q88, 4:4:4, progressive, 205–438 KB). Registered in `lib/localizedProductImages.ts`.
- `PeptideGelProductPage.tsx`: gallery and section figures localized (effects s2, engine s3,
  how-to s9); engine `figureAlt` updated in EN / RU / AR.
- `data/productConfig.ts`: the product 37 `images` array (old s1c–s5c) is removed, so the gallery is
  DB-only. The config gallery would otherwise override the DB in the mobile API
  (`lib/pricingEngine.ts`).
- `lib/products.ts` fallback, cut-out report source moved to the new main, `lib/productCutouts.ts`
  regenerated (same `cutout/37.webp`, the pouch alone).
- DB: `scripts/update-product-37-campaign-gallery.ts --apply` after the deploy (checks all 37 URLs
  are 200 first). Before: image `/images/peptide_mask/main.jpeg`, gallery `peptide_mask/s1c–s5c`.
  Old files stay on disk; `routineStepImages` and `OrderHistory` still use the old `main.jpeg`.
