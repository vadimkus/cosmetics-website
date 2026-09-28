# Product 15 INTENSIVE PROBLEM CONTROL TONER — "Oil off. Cool on." campaign (28 Sep 2026)

Brief (Vadim): new campaign for https://genosys.ae/products/15, folder `~/Desktop/problem_boost`
(both container PNGs), every image generated in CapCut and re-shot there when a product is
placed on top, two variants (200 ml spray, 500 ml pump), remove the dossier voice, we are
selling, make it cool, main + 12 slides.

## Sources (Intertek first)

- `Intertek/Genosys Intensive Problem Control Toner/Formula-…pdf` (DTS MG, signed): zinc PCA
  0.5%, butylene glycol 5.42327% + glycerin 4.975% + dipropylene glycol 3% (13.4% base),
  panthenol / allantoin / trehalose 0.1% each, tea tree extract + leaf oil, peppermint, rosemary,
  the four Anti Sebum P extracts, cooling agents (menthyl lactate, ethyl menthane carboxamide,
  methyl diisopropyl propionamide + caprylic/capric triglyceride = SNOW ICE).
- Artwork 200 ml / 500 ml: function oil control; "helps remove excess oil and sebum for
  blemish-prone skin while adding quick hydration"; apply or spray AM/PM; 200 ml 360° spray,
  upside down for the back; dermatologically tested. Korean panel: patented sebum ingredient.
- COA: transparent light-yellow liquid, pH 4.81 inside 4.30–5.50. Lot and lab stay off.
- DTS MG professional deck (`public/documents/PPT/GENOSYS FACIAL TREATMENT_Professional_2025.pdf`,
  pp. 26–34): non-comedogenic, tested by QACS Ltd.; about 50% less sebum after 4 weeks (192.6 →
  97.0); Anti Sebum P = patented four-botanical complex; SNOW ICE cooling; cotton wipe and a
  5–10 min pad mask. Not used: copper tripeptide-1 (not in the formula) and the 68.2% / 79.96%
  in-vitro figures; "93.8% sebum improvement rate" (undefined).

## System

- Cobalt from the label band `#1E3A8A`, navy body `#10204F`, ice type `#F2F7FF` / frost
  `#C9DCFF` on cobalt plates, accent `#2F62D6`. Manrope ExtraBold / Medium, Noto Sans Arabic.
- Idea: OIL OFF. COOL ON. The toner takes the shine off and the cooling complex lands cold.

| # | Plate | Headline |
|---|---|---|
| Main | 200 ml + 500 ml on white, ice at the bases | (no type) |
| 01 | 200 ml firing a cold mist cone, cobalt set with vapour | OIL OFF. COOL ON. |
| 02 | midday shine on blemish-prone skin | SHINY BY NOON? |
| 03 | frosted cobalt glass, condensation | ~50% LESS SEBUM. |
| 04 | drop on brushed zinc | ZINC PCA 0.5%. |
| 05 | face turned into cold mist | COOL ON CONTACT. |
| 06 | fingertips on a clear matte cheek | MADE NOT TO CLOG. |
| 07 | water crown splash on cobalt | MATTE, NOT DRY. |
| 08 | tea tree, peppermint, rosemary on crushed ice | TEA TREE & PEPPERMINT. |
| 09 | hand holding the 200 ml upside down over the shoulder | UPSIDE DOWN? STILL SPRAYS. |
| 10 | soaked cotton pads on forehead and cheeks | SOAK. PRESS. 10 MIN. |
| 11 | the pair on an ice block, cobalt | HOME. CLINIC. |
| 12 | the pair on frosted white with ice + spec card | STAY MATTE. STAY COOL. |

RU: МИНУС БЛЕСК. ПЛЮС СВЕЖЕСТЬ. … МАТОВО. И СВЕЖО. AR: وداعاً للمعان. أهلاً بالانتعاش. …

## Render (CapCut, GPT Image 2.5 · 2k · Medium · 1:1)

- Scripts in `~/Desktop/problem_boost/campaign/_scripts/`: `pct_batch.sh` (CapCut driver),
  `pct_refs.py` (references: the two PNGs share one pixel scale, so the 200 ml stands at 83% of
  the 500 ml with its pump; the 500 ml always right so its spout points out), `pct_restore.py`
  (real print back on the re-shoots), `pct_slides.py` + `pct_copy.py` (type), `pct_export.py`.
- Product slides and the main were re-shot in CapCut from the references (`s1r`, `s9r`,
  `s11r`, `s12r`, `mainr`), never left pasted. The first main swapped the bottles because the
  prompt named the 500 ml first; prompts now name the order as in the reference.
- CapCut rewrote the small claim line under the band ("for balancing skin tone … acne-prone
  skin" — not on the pack) and "CONTOL" on the upside-down bottle. `pct_restore.py` restores
  every label block from the reference ink (print_restore.py) and pastes the 500 ml band whole,
  shifted to the take's band colour.
- Re-renders: s6 (the bead read as a tear → fingertips on a matte cheek, s6b), s8 (leaves under
  the type → botanicals held to the lower third, s8b). s9 plate and re-shoot returned one tile
  each (three blocked each time).
- Picks: main mainr v3 (print restored), 01 s1r v2*, 02 v3, 03 v2, 04 v4, 05 v1, 06 s6b v4,
  07 v4, 08 s8b v4, 09 s9r v1*, 10 v4, 11 s11r v1*, 12 s12r v3* (* print restored).

## Typeset

- Every EN / RU / AR line clear of the subject; RU shrinks only where a line would pass its
  group (02 0.77, 05 0.69, 06 0.61, 09 0.73, 10 0.67). Type moves: 01 mid-left in the dark band
  between the mist and the floor fog, 04 and 10 bottom-left, 08 centred, the rest top-left.
- Masters `campaign/final/NN.png`, `final/{ru,ar}/NN.png`, `final/_contact_{en,ru,ar}.jpg`,
  `final/main_clean.png`.

## Site

- `public/images/pct_campaign/main.jpg` + `s1–s12.jpg` + `{ru,ar}/s1–s12.jpg` (1600 px,
  progressive, q88 4:4:4 stepped down to fit ~520 KB; 187–517 KB). Registered in
  `lib/localizedProductImages.ts`.
- `PctTonerProductPage.tsx`: gallery localized per locale; s7 beside "What it does", s4 beside
  the formula, s10 beside How to use. Palette nudged to the campaign cobalt (`pctToner.css`).
- Copy in selling voice, all three locales (`pctTonerCopy.ts` EN, `pctTonerLocalizedCopy.ts`
  RU/AR, legacy AR/RU objects removed): no "the carton stops here", "not why you pick this
  bottle", "named active", "DTS MG deck", copper peptide or trace percentages. Central RU/AR
  (`data/productLocalizedCopyAudit.ts`): specific gravity and measured fill removed, Anti Sebum
  P stated as the patented complex, the trace salicylic row replaced by SNOW ICE. Quick facts,
  `pc15*` pairing block, `lib/products.ts` fallback, routine / training / downloads images.
- Cut-out `cutout/15-v3.webp` from the two container PNGs at the main's layout
  (`build-cutouts.py` REVISION 15 → 3), manifest regenerated.
- Tests: `__tests__/data/product15Copy.test.ts` (EN sells the verified facts, no dossier voice);
  product 15 audit test now forbids specific gravity and measured fill.
- DB: `scripts/update-product-15-campaign-gallery.ts --apply` after the deploy — image,
  gallery and the EN text fields; RU/AR descriptions from the central copy. The old
  `/images/problem/` files stay on disk (older orders and emails may reference them).
