# Product 16 SNOW BOOSTER — "Let it snow" campaign (27 Sep 2026)

Brief (Vadim): new campaign for https://genosys.ae/products/16, two variants (200 ml spray,
1000 ml pump), folder `~/Desktop/booster` (both container PNGs), CapCut, main + 12 slides,
EN / RU / AR, full control, "we are selling", check the page against the dossier.

## Dossier check

Every claim on the slides and the page was checked against Intertek, not the old copy:

- `Registration DOC/Formula_up/Formula-GENOSYS SNOW BOOSTER.pdf` (DTS MG, signed): betaine 3%,
  glycerin 5.7815%, butylene glycol 4.55%, dipropylene glycol 3.99745%, PG 0.50015%, sodium
  lactate 0.3% (humectant base about 18%).
- `Registration DOC/Artwork/[GENOSYS]SNOW BOOSTER(200ml).pdf`: function toner; "daily toner for
  all skin types, moisturizes and soothes skin with various botanical extracts, refines skin
  with pH balancing after cleansing"; "apply or spray sufficiently morning and evening… it can
  be used even on the make up"; dermatologically tested; PAO 6M.
- `Registration DOC/COA/…200ml` and `…1000ml`: translucent liquid, pH 6.14 / 6.17 inside
  5.00–7.00. Lot codes and the contract manufacturer stay off every surface.
- SA: face and décolleté, leave-on (used in the how-to).

Kept out: brightening, sebum / pores, oxygen, fragrance-free, a cotton-pad mask, layers,
Phytolex as the engine, any hydration %.

## System

- Label colours: snow white `#FFFFFF`, label sky cyan `#63CCE9` (median of the stripe), type in
  the label slate `#333F48` (Pantone 432 C), Manrope Regular caps.
- Idea: LET IT SNOW. The fine spray falls like snow — moisture back after every cleanse, even
  over makeup. Close: YOUR DAILY SNOW.

| # | Plate | Visual | Headline |
|---|---|---|---|
| Main | white | 1000 + 200 ml on powder snow, flakes | (no type) |
| 01 | white | 200 ml mist turning to snow | LET IT SNOW. |
| 02 | sky | just-washed face, towel | CLEAN FACE. THIRSTY SKIN. |
| 03 | white | water drop holding a snowflake | HOLDS WATER. 3% |
| 04 | sky | lab cylinder of water, snow on the rim | A BASE OF WATER. 18% |
| 05 | white | one clear water-thin swipe | LIGHT AS WATER. |
| 06 | sky | made-up woman misting her face with the 200 ml | EVEN ON MAKEUP. |
| 07 | white | paper sun + sky-cyan paper moon | MORNING. EVENING. |
| 08 | sky | palms pressed to dewy cheeks | SPRAY. PRESS. DONE. |
| 09 | white | white lotus on icy water | CALM. SOFT. REFINED. |
| 10 | sky | drop and ripples | BALANCED. pH 6.14 |
| 11 | white | the pair on snow | TWO SIZES. ONE FORMULA. |
| 12 | sky | the pair on a snow drift + card | YOUR DAILY SNOW. |

## Render (CapCut, GPT Image 2.5 · 2k · Medium · 1:1)

- References from the container PNGs: `campaign/ref_200_white.png` (01, 06) and
  `campaign/ref_pair_white.png` (1000 + 200 ml at true relative height; main, 11, 12).
- The Mac locked mid-run; `_scripts/run_after_unlock.py` waited for the unlock, set 1:1 and ran
  the reference-free jobs; `caffeinate` kept the display awake after.
- 02, 06 and 08 re-rendered (02b, 06b, 08b) so the person stays in the right half, clear of the
  headline. `capjob.py` now retries and skips a CapCut file the decoder cannot read (three
  such files this run).
- Picks: main v2, 01 v1, 02b v4, 03 v2, 04 v1, 05 v3, 06b v2, 07 v3, 08b v3, 09 v2, 10 v3,
  11 v3, 12 v1. 16 jobs × 16 credits.

## Typeset

- `campaign/_scripts/booster_slides.py [en|ru|ar|main] [n...]` (scalp engine; backdrop measured
  from each render's empty corner and pulled to white or `#63CCE9`), copy in `booster_copy.py`.
- EN all at full size. RU shrinks: 01 head 0.65 (ПУСТЬ ИДЁТ), 02 0.89, 08 0.94, 09 0.79, 11 0.83,
  12 0.96. AR all full size. Every EN / RU / AR line: 0 busy px within 28 px.
- Masters `campaign/final/NN.png`, `final/{ru,ar}/NN.png`, `final/_contact_{en,ru,ar}.jpg`,
  `final/main_clean.png`.

## Site

- `public/images/booster_campaign/main.jpg` + `s1–s12.jpg` + `{ru,ar}/s1–s12.jpg` (1600 px, q88,
  4:4:4, progressive, 119–366 KB). Registered in `lib/localizedProductImages.ts`.
- `BoosterProductPage.tsx`: gallery localized per locale; four slides in the body — s2 beside
  "What it does", s3 in place of the plain packshot beside the formula, s8 beside How to use,
  s11 beside Specifications.
- `boosterCopy.ts` EN rewritten in the selling voice of the RU/AR overrides (same claims): the old
  EN argued against the product ("the carton stops here", "not why you pick this bottle").
- Cut-out: `cutout/16.webp` already shows the current label; the report source moves to the new
  main, `lib/productCutouts.ts` regenerated.
- `lib/products.ts` fallback. DB: `scripts/update-product-16-campaign-gallery.ts --apply` after
  the deploy — image, gallery and the EN text fields (description, productDetails, keyFeatures,
  benefits, ingredients, howToUse, directions). Before: image `/images/Second/main_booster.jpg`,
  gallery `["/images/Second/main_booster2.png"]`; both files stay (routine images use them).

## Live check (27 Sep 2026)

- Code `523aaa7f5` live after ~5 min; DB `--apply` done (before: `Second/main_booster.jpg` +
  `["/images/Second/main_booster2.png"]`); revalidated `/products/16` EN/RU/AR, `/`, `/products`
  EN/RU/AR.
- `/products/16`, `/ru/products/16`, `/ar/products/16`: new main + all 12 slides in the locale's
  own folder (no EN slide on RU/AR), `main_booster2` gone. EN body shows the new copy
  ("Fresh moisture in one spray.", "Daily moisture, nothing heavy."); no lot code, no contract
  manufacturer.
- Mobile API `/api/mobile/products/16`: main + 12 slides, `ru/` and `ar/` per `x-locale`.
