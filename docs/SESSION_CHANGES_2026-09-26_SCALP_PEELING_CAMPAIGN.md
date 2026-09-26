# Product 46 HR³ MATRIX SCALP PEELING α — "Cold start" campaign (26 Sep 2026)

Brief (Vadim): new campaign for https://genosys.ae/products/46, folder `~/Desktop/scalp`, main + 12
slides, EN / RU / AR, upload when ready, full control, "always check page - no need for dossier".

Source pack: `~/Desktop/scalp/HR3 MATRIX SCALP PEELING ALPHA_container.png` (amber glass dropper,
transparent background). Reference for CapCut: `campaign/ref_bottle_white.png` (2400 square).
Prompts: `~/Desktop/scalp/campaign/PROMPTS.txt`, paste files in `campaign/_paste/`.

## System

- Two colours: bottle amber `#5F221A` (median of the glass) and white. Manrope Regular caps: amber
  on white, white on amber. Renders came back `#4B1C11`–`#5A2013` and are pulled to `#5F221A`.
- Idea: COLD START. The most cooling agent GENOSYS makes, and the first step of HR³ MATRIX.
  Close: START COLD. The bottle appears only on Main, 01 and 12 (reference attached).

| # | Visual | Headline | Claim (page) |
|---|---|---|---|
| 01 | Bottle on white, ice and mist | COLD START. | step one of HR³ MATRIX, cold on contact |
| 02 | White cap, wax jar, sweatband on amber | YOUR SCALP WEARS IT ALL. | dissolves sebum, sweat, styling residue on contact |
| 03 | Lab cylinder a third full | BUILT TO CUT OIL. 33.6% | alcohol denat. 33.6% + propylene glycol 12%, flashes off |
| 04 | Mint frozen in ice, amber | THE COLDEST THING WE MAKE. 1.7% | menthol 0.9% + menthyl lactate 0.8%, most in any GENOSYS product |
| 05 | Hourglass of snow | COLD NOW. COLD LATER. | menthol immediate, menthyl lactate carries on for minutes |
| 06 | Clear streak evaporating, amber | GONE IN SECONDS. | flashes off, leaves nothing behind |
| 07 | Beaker + cotton swabs | NO SHOWER. A SWAB. | decant ~5 ml, soak a swab, not rinsed off |
| 08 | Swab on a hair parting | RUB IT LIKE YOU MEAN IT. | grip below the head, work the parting firmly |
| 09 | Ice numeral 1, amber | STEP ONE. | clean, dry scalp ready for Hair Solution α |
| 10 | Trichologist swabbing a sectioned parting | SECTION. SWAB. REPEAT. | section by section |
| 11 | Dryer + hourglass, amber | DRY FIRST. HEAT LATER. | flammable at this strength, let dry before heat |
| 12 | Bottle on ice, amber light shaft | START COLD. + card | 100 ml, 1.7% cooling, not rinsed off, dermatologically tested (bottle print), made in Korea |

Kept out (page rules): "gentle", disinfecting, salicylic acid as the active, any hair-loss /
regrowth / DHT / circulation / anti-inflammatory claim, copper peptide or saw palmetto as a reason
to buy, "5 minutes" (RU/AR page only, not on EN), microneedling at home, lot codes, price.

## Render run (CapCut, GPT Image 2.5 · 2k · Medium · 1:1)

- `campaign/_scripts/capjob.py` drives one job (attach / prompt / go): waits for 4 new files in
  CapCut's `ai_material`, decodes them (`/tmp/capcut_decode.py`), drops the uploaded reference
  (not 2560 px) and writes `_gen/<name>_sheet.jpg`. `run_rest.sh` ran 02–11 unattended.
- CapCut clears the prompt after a run but can leave the reference; hover shows an × at the
  thumbnail's top-right (logical 197,175).
- Picks: Main v2, 01 v1, 02 v2, 03 v3, 04 v4, 05 v3, 06 v1, 07 v2, 08 v1, 09 v2, 10 v4, 11 v4,
  12 v2. All raw variants in `_gen/raw/`. 13 jobs × 16 credits.

## Typeset

- `campaign/_scripts/scalp_slides.py [en|ru|ar|main] [n...]` (product 37 engine), copy in
  `scalp_copy.py`. The Arabic Latin-run pattern now includes `³` and `α`, so "HR³ MATRIX" and
  "Hair Solution α" stay one run inside Arabic lines.
- EN all at full size. RU shrinks: 01 head 0.67 (ХОЛОДНЫЙ), 04 head 0.79 / support 0.95, 08
  support 0.92, 10 head 0.83. AR all at full size. Every EN / RU / AR line: 0 busy px within 28 px.
- RU/AR terms from the live page: денатурированный спирт, пропиленгликоль, ментол, ментиллактат,
  себум, остатки стайлинга, ватная палочка, не смывается; الكحول المغيّر، البروبيلين غليكول،
  منثول، منثيل لاكتات، عود قطني، لا يُشطف, feminine address.
- Masters: `campaign/final/NN.png`, `final/{ru,ar}/NN.png`, contact sheets; `final/main_clean.png`.

## Site

- `public/images/scalp_campaign/main.jpg` + `s1–s12.jpg` + `{ru,ar}/s1–s12.jpg` (1600 px, q88,
  4:4:4, progressive, 133–511 KB). Registered in `lib/localizedProductImages.ts`;
  `ScalpPeelingProductPage.tsx` gallery localized.
- Cut-out: the old `cutout/46.webp` showed the superseded label layout. `46-v2.webp` is normalised
  (build-cutouts `normalize`, 7% margin, q86) from the supplied transparent container PNG, since
  the new main has ice around the bottle; REVISION 46 → 2, report + `lib/productCutouts.ts`
  regenerated.
- `lib/products.ts` fallback. DB: `scripts/update-product-46-campaign-gallery.ts --apply` after the
  deploy. Before: image `/images/scal.jpg`, gallery `["/images/Second/pp.jpg"]`.

### Live (23:21)

- Commit `a8881d5e5` deployed; DB gallery applied (image `scalp_campaign/main.jpg`, gallery
  s1–s12); `/products/46`, `/ru/products/46`, `/ar/products/46` revalidated.
- Live HTML: EN page serves the 12 EN slides, RU the 12 `ru/` renders, AR the 12 `ar/` renders;
  new main and `cutout/46-v2.webp` on all three; `Second/pp.jpg` gone. Mobile API returns main +
  12 slides, localized for `x-locale: ru` / `ar`.

### Section figures on the page

The slides were only in the gallery. `ScalpPeelingProductPage.tsx` now places four of them in the
body, localized per language through `localizeProductImage`:

| Section | Slide | Layout |
|---|---|---|
| What is actually doing the work | s3 (33.6% alcohol) | beside the header, cards below |
| Cooling | s4 (1.7% cooling agents) | beside the header, table below |
| How to use | s10 (section, swab, repeat) | replaces the plain packshot beside the steps |
| Precautions | s11 (dry first, heat later) | sticky beside the single-column list |

`SlideFigure` = square, rounded 28 px, `object-contain`, `CeraReveal`. Checked on the dev server in
EN at desktop width, plus AR (right-to-left, `ar/s4.jpg`).
