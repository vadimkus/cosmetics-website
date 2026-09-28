# Product 58 ANTI-AGING BEAUTY BOX — "Time, well kept" campaign (28 Sep 2026)

Brief (Vadim): campaign for https://genosys.ae/products/58 in the spirit of product 55, but a new
idea rather than a reskin. Selling voice, no dossier, every image generated in CapCut and
regenerated wherever something was pasted on top. Push to main.

Second run of [Beauty Box style v1](./BEAUTY_BOX_CAMPAIGN_STYLE.md) (after 55, "The Oil Change").

## Idea

- **TIME, WELL KEPT.** Anti-aging told as fine watchmaking: lines belong on a watch dial, not on
  a face. Guilloché dials, a brass micrometer and loupe, watch gears with a ruby jewel, a sundial,
  a pocket watch whose blank dial carries the schedule, "keep good time" at the close.
- **Recurring prop:** every pack stands on a round brass-rimmed pedestal shaped like a watch
  caseback, so the step slides never read as 55 in a new colour.
- **Palette:** garnet velvet `#7A1D2E`, brass `#B8925A`, champagne ground `#D6BC92`, ivory, navy
  ink on light grounds, ivory type on garnet. Kit case hardware (latches, hinges, stripe) in brass.

## Facts used (Intertek first)

- SNOW O₂ Cleanser 180 ml: goes on a dry face, bubbles up on its own, no scrubbing.
- SNOW BOOSTER 200 ml: fragrance-free, betaine 3% and Lactobacillus/Pumpkin Ferment 1%, goes over
  make-up.
- Multi Functional Anti-Wrinkle Serum 30 ml and Cream 50 g: Korean dual-function registration
  (wrinkle improvement + brightening); niacinamide 2% and adenosine 0.04% in both, tested on every
  batch (latest 98.65% / 100.54% niacinamide, 96.25% / 103.75% adenosine); bakuchiol 0.1% in both.
  Cream: glycerin 8%, mango seed butter 0.8%, propolis.
- Intensive Repair Collagen Mask 23 g ×5: glycerin 10% and sodium hyaluronate 0.5%
  (quali-quanti 10.000 / formula 10.052; 0.500), centella, witch hazel, pomegranate, soy;
  15 to 20 minutes (artwork). EN frequency follows product 53's EN page; RU/AR carry none.
- Removed: firmness and elasticity claims, "clinically proven", the 18.062% humectant-base
  figure, "the pack does not say" lines, hard-coded prices in RU/AR copy (the page computes the
  saving live).

## Slides

| # | Plate | EN | RU | AR |
|---|---|---|---|---|
| Main | kit case top down on white, five singles in routine order | ANTI-AGING | (EN only) | (EN only) |
| 01 | kit case on champagne | TIME, WELL KEPT. | ВРЕМЯ НА ВАШЕЙ СТОРОНЕ. | الوقت في صفّكِ. |
| 02 | guilloché dial, brass hands | FINE LINES BELONG ON A WATCH DIAL. | ТОНКИЕ ЛИНИИ УМЕСТНЫ ТОЛЬКО НА ЦИФЕРБЛАТЕ. | الخطوط الدقيقة مكانها على مينا الساعة. |
| 03 | SNOW O₂ on a pedestal, garnet, bubbles | CLEAN START. | ЧИСТЫЙ СТАРТ. | بداية نظيفة. |
| 04 | SNOW BOOSTER on a pedestal, ivory, mist | RESET. | БАЛАНС. | إعادة ضبط. |
| 05 | brass micrometer and loupe on garnet velvet | 2% · 0.04% MEASURED, NOT GUESSED. | ИЗМЕРЕНО, А НЕ НА ГЛАЗ. | مقاسة بدقة، لا بالتخمين. |
| 06 | serum on a pedestal, watch gears, ruby | TWO JOBS. ONE SERUM. | ДВЕ ЗАДАЧИ. ОДИН ФЛАКОН. | مهمّتان. سيروم واحد. |
| 07 | cream tube on a pedestal with a swatch | CASE CLOSED. | ДЕЛО ЗАКРЫТО. | ختام مُحكم. |
| 08 | five masks fanned on garnet satin, brass alarm clock | AFTER HOURS. | ВЕЧЕРНИЙ РЕЖИМ. | بعد الدوام. |
| 09 | brass sundial on stone at golden hour | WORKS BY DAY, TOO. | РАБОТАЕТ И ДНЁМ. | يعمل نهاراً أيضاً. |
| 10 | open pocket watch, schedule on the dial | WIND IT TWICE A DAY. | ЗАВОДИТЕ ДВАЖДЫ В ДЕНЬ. | اضبطيه مرتين يومياً. |
| 11 | hand in a garnet sleeve carrying the closed case | ONE CASE. EVERY STEP. | ОДИН КЕЙС. ВСЕ ШАГИ. | علبة واحدة. كل الخطوات. |
| 12 | the five on white with the spec card | KEEP GOOD TIME. | ВРЕМЯ ПОД КОНТРОЛЕМ. | وقت مضبوط. |

## Render (CapCut, GPT Image 2.5 · 2k · 1:1)

- Workspace `~/Desktop/Insta_Olga/bb_age/campaign/`: `_scripts/bbp_batch.sh` (CapCut driver),
  `bbp_refs.py` (empty plates + pack cut-outs at real mm scale), `bbp_slides.py` + `bbp_copy.py`
  (type EN / RU / AR), `bbp_export.py`. Prompts in `_prompts/` (verbatim pack print in
  `_packs.py`), picks in `picks/`, masters in `final/`, contact sheets `final/_contact_{en,ru,ar}.jpg`.
- Every product slide and the main were re-shot in CapCut from the scale reference; nothing is
  left pasted. Pack print re-rolled until brand and hero lines read correctly (`mainr2`, `mainr3`,
  `s1rd`, `s1re`). The serum is drawn from the real bottle (black glass fading to clear), the
  cream from the current white tube with red lettering.
- Picks: main `mainr3_2`, s1 `s1rd_1`, s2 `s2_2`, s3 `s3r_3`, s4 `s4r_2`, s5 `s5_3`, s6 `s6r_2`,
  s7 `s7r_2`, s8 `s8r_2`, s9 `s9_1`, s10 `s10_2`, s11 `s11_1`, s12 `s12r2_1`. `mainr3_4` was a
  corrupt CapCut download and was skipped.
- Typesetting fixes: `₂` added to the Latin run so "SNOW O₂" stays whole in Arabic; per-slide
  Arabic right edge (`ar_x`) on 08, 10, 11, 12 where mirroring put type over the clock, watch bow
  or sleeve.

## Site

- `public/images/bb_age_campaign/main.jpg` + `s1–s12.jpg` + `{ru,ar}/s1–s12.jpg` (1600 px
  progressive, q88 4:4:4 stepped down to fit ~520 KB; 37 files, 211–519 KB). Registered in
  `lib/localizedProductImages.ts`; the main is not translated.
- Page copy `components/product/beautybox/copy/antiAging.ts` EN/RU/AR rewritten in selling voice
  on the facts above; palette `bb-garnet` moved to ivory / champagne / garnet (`beautybox.css`).
- Central RU/AR `data/product58LocalizedCopy.ts`, quick facts `lib/productQuickFactsCatalog.ts`,
  tests `product58LocalizedCopy`, `product53LocalizedCopy` (shared mask copy), `productQuickFactsCatalog`.
- Cut-out `cutout/58-v3.webp`: Vision on the text-free main pick, then the builder's normalise
  (`build-cutouts.py` revision + comment, old keypaper part removed, report, manifest).
- DB: `scripts/update-product-58-campaign-gallery.ts --apply` after the deploy (checks all 37 URLs
  return 200 first): image, gallery, EN/RU/AR description.

## Live check (28 Sep 2026)

- Code `9b5415e7a` live after ~6 min. Updater dry run: all 37 URLs 200; `--apply` done (before:
  `bbox_age/main-v2.jpg`, `images` null). Revalidated tag `products`, `/products/58` EN/RU/AR,
  `/products` EN/RU/AR, `/`.
- HTML: `/products/58` renders `main.jpg` + the 12 EN slides; `/ru/` and `/ar/` render their own
  `ru/` and `ar/` slides; `bb-garnet`; cut-out `58-v3`. Browser (`/ar/products/58`): kit shot on
  the stage, Arabic thumbnails, no broken images.
- Mobile API `/api/mobile/products/58` (x-api-key, x-locale): 13 images per locale = main + 12
  locale slides; `localizedDescription` RU/AR carry the new copy.
