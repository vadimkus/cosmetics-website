# Product 68 GLASS SKIN RITUAL KIT — new product + "Full moon glow." campaign (29 Sep 2026)

Brief (Vadim): the DTS MG holiday kit is already in MoySklad; photos and the kit PDF are in
`~/Desktop/Insta_Olga/holiday_kit_v`. Two kits, the only difference is the Revita Glow shade.
Create the product on the site with a `#01 Bright` / `#02 Natural` selector at the MoySklad price,
re-shoot the campaign in CapCut keeping the real boxes (new setting and story), publish.

## Product

- MoySklad: **54501** GLASS SKIN RITUAL KIT #01 Bright, **54502** #02 Natural, both **740 AED**,
  40 units each at launch (kits created 23 Sep, `SESSION_CHANGES_2026-09-23_GLASS_SKIN_RITUAL_KITS.md`).
- Contents: Moisture Replenishing Hyaluron Serum 30 ml, Moisture Replenishing Hyaluron Cream 50 g,
  Revita Glow BB Cream 50 g SPF 38 PA+++ (#01 Bright or #02 Natural), puff, holiday mirror case.
- Site record: id and productNumber **68**, category Beauty Boxes, size `1 kit`, `noDiscount`,
  no DB variants. The shade is a colour option in `data/productConfig.ts`; `lib/moysklad.ts` maps
  each value to its SKU (and the standalone Revita Glow shade mapping was fixed at the same time).
- Regular price for the saving line: 870 AED (`BEAUTY_BOX_REGULAR_PRICES`), shown as "Bundle 15% off";
  kit excluded from Black Friday and beauty-box stacking.

## Campaign — "FULL MOON GLOW."

- Idea from the box art: the Korean moon jar (dalhangari), porcelain that glows from within, as
  the picture of glass skin. Grounds alternate moonlit navy and porcelain white; box-script gold.
- 2k Medium 1:1 in CapCut (16 credits per image), every plate a single generation from a scale
  reference built around the real box, tray, bottle, tubes and case (`_scripts/hk_refs.py`).
- Slides: 1 box under a full moon in snow · 2 moon jar ("It doesn't shine. It glows.") · 3 serum
  in moonlit ripples (FILL) · 4 cream on porcelain (SEAL) · 5 moon phases, +82% hydration after one
  use · 6 Revita Glow with case and swatch (GLOW) · 7 two tubes before a silver and a gold moon
  (#01 Bright / #02 Natural) · 8 open mirror case holding the moon · 9 moon jar beside the box in a
  gallery · 10 AM/PM card · 11 gift on ivory silk with a gold tassel (re-shot as `s11b` to free
  the upper left) · 12 open kit flat lay with the spec card.
- Every label and box print checked at full size before picking (serum, cream, both BB shades,
  box front on 1, 9, 11, 12).
- Typeset EN/RU/AR (`_scripts/hk_slides.py`, `hk_copy.py`): Manrope ExtraBold/Medium, Noto Sans
  Arabic, Latin runs (`+82%`, `#01 Bright`, `SPF 38 PA+++`) kept left to right inside Arabic.
- Exported with `_scripts/hk_export.py` to `public/images/glass_skin_campaign/` (main + s1–s12,
  `ru/`, `ar/`; 37 files, 183–480 KB, 1600 px progressive JPEG).

## CapCut driver fix

The batch stalled on slide 3 with "reference did not attach". `capcut_ui.py` had no empty-slot
template for the 1710 px display, so `ref_present()` fell back to a brightness test and read the
dark navy s3 reference as an empty slot. Saved `aws/campaign/_scripts/empty_slot_1710.png`;
detection now compares against the empty tile and works for dark references.

## Site

- `BeautyBoxProductPage.tsx`: shade picker generalised by `config.shade` (`cushion` for 57,
  `revita` for 68); `beautyBoxes.ts` registers 68 with palette `bb-moon`.
- Copy module `components/product/beautybox/copy/glassSkinRitual.ts` (EN/AR/RU, selling voice),
  central RU/AR `data/product68LocalizedCopy.ts` (+ `.gitignore` exception), quick facts, routine
  heading, `lib/localizedProductImages.ts` entry, cut-out `cutout/68.webp` (Vision on the
  text-free main pick, coverage 0.326; `build-cutouts.py` note, report row, `productCutouts.ts`).
- Tests: `productOptions` lists 68; `product57LocalizedCopy` checks the generalised shade flag and
  that box 57 keeps `shade: 'cushion'`; Arabic bag wording uses السلة. 147 suites green, tsc clean.

## Live (29 Sep 2026)

- Commit `9d8257f02` pushed to main; deploy served the files at 17:25.
- `scripts/create-product-68-glass-skin-ritual-kit.ts --apply`: product 68 created (all 37 files
  returned 200 first).
- Revalidated `/products/68`, `/ru/products/68`, `/ar/products/68`, `/products`, `/`, tag `products`.
- Web: EN/RU/AR pages render the 12 slides, 740 AED and the shade radiogroup; in the browser the RU
  gallery loads `ru/s1–s12`.
- Mobile API `/api/mobile/products/68`: main + 12 slides per locale (`ru/`, `ar/`), colorVariants
  `#01 Bright` / `#02 Natural`, 740 AED with the 870 AED regular price, RU/AR descriptions,
  quick facts and routine. No OTA needed.

## Workspace

`~/Desktop/Insta_Olga/holiday_kit_v/campaign/`: `_scripts/` (refs, prompts, batch, typesetter,
copy, export), `_gen/gi/` (all takes), `picks/` (main, s1–s12), `final/` (EN, `ru/`, `ar/`).
