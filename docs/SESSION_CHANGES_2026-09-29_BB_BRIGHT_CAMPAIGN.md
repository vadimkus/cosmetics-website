# Product 56 SKIN BRIGHTENING BEAUTY BOX — "Let the light in." campaign (29 Sep 2026)

Brief (Vadim): new campaign for https://genosys.ae/products/56 in the family of the earlier beauty
boxes. The main follows 55 and 58 (kit case on white, `GENOSYS BEAUTY BOX` tag, box name, caps line
under the case). Every slide re-shot in CapCut so nothing is layered, 2k Medium 1:1 (16 credits per
image), no dossier wording. Full authority; push to main.

Third run of [Beauty Box style v1](./BEAUTY_BOX_CAMPAIGN_STYLE.md) (after 55 "The Oil Change" and
58 "Time, well kept").

## Idea

- **LET THE LIGHT IN.** Dull skin is a fogged window. The box clears the glass and keeps it clear:
  window light falls across every step slide, the peel wipes a golden stripe through fogged glass,
  the proof slide opens a blind onto a bright garden, the mask slide is moonlight on dusk linen,
  and the close is "LIGHTS ON."
- **Recurring prop:** the window-pane shadow. Every step slide carries the same four-pane light, so
  the steps never read as 55 or 58 in a new colour.
- **Palette:** ivory `#F4EDE1`, sunlit amber `#E9A33E`, dusk navy for the mask slide, navy ink
  `#0E2A47`, amber tags `#B8660F` on light grounds, ivory on amber, glow `#F4B85A` on dusk. Kit
  case hardware (latches, hinges, stripe) in amber.

## Facts used (Intertek first, from the copy module's sourcing block)

- SNOW O₂ 180 ml: goes on a dry face, bubbles up on its own, massage and rinse, no scrubbing.
- SNOW BOOSTER 200 ml: fragrance-free, betaine, readies skin for the serum.
- MULTI VITA RADIANCE SERUM 30 ml: a full 2% niacinamide, stable vitamin C, patented MELAZERO®,
  Korean brightening registration, −28% surface melanin after two weeks.
- MULTI VITA RADIANCE CREAM 50 g: the same 2% niacinamide, macadamia oil and squalane, −29.7%.
- EPI TURNOVER BOOSTING PEELING GEL 100 g: papaya enzymes loosen dead skin, plant cellulose rolls
  it away, once or twice a week.
- SOOTHING BOMB SEA ALGAE MASK: sea algae sheet, 15 to 20 minutes, then serum and cream.
- Removed from the page: lot and batch codes, assay figures, patch-test protocol wording, the mask's
  10% / 5.035% figures, "whitening" in every language. Snow O₂'s bubble agent corrected to 8%.

## Slides

| # | Plate | EN | RU | AR |
|---|---|---|---|---|
| Main | kit case top down on white, six singles in routine order | SKIN BRIGHTENING | (EN only) | (EN only) |
| 01 | kit case on amber, window light | LET THE LIGHT IN. | ВПУСТИТЕ СВЕТ. | دعي الضوء يدخل. |
| 02 | fogged window, one wiped stripe onto a garden | DULL SKIN IS A FOGGED WINDOW. | ТУСКЛАЯ КОЖА КАК ЗАПОТЕВШЕЕ ОКНО. | البشرة الباهتة نافذة يغطيها الضباب. |
| 03 | SNOW O₂ in its own foam, ivory, window light | CLEAR. | ЧИСТО. | صفاء. |
| 04 | SNOW BOOSTER misting on amber | READY FOR LIGHT. | ГОТОВО К СВЕТУ. | جاهزة للضوء. |
| 05 | blind half raised over a bright garden | −28% LESS PIGMENT IN TWO WEEKS. | −28% МЕНЬШЕ ПИГМЕНТА ЗА ДВЕ НЕДЕЛИ. | −28% تصبّغ أقل خلال أسبوعين. |
| 06 | serum in a shaft of light, ivory | SWITCH ON. | ВКЛЮЧИТЕ СВЕТ. | أشعلي الضوء. |
| 07 | cream tube and swatch on amber | HOLD THE GLOW. | СОХРАНИТЕ СИЯНИЕ. | احتفظي بالإشراق. |
| 08 | EPI tube in a golden stripe wiped through fog, squeegee | WIPE THE GLASS. | ПРОТРИТЕ СТЕКЛО. | امسحي الزجاج. |
| 09 | mask sachet on dusk linen, moonlit window | LIGHTS DOWN. | ПРИГЛУШИТЕ СВЕТ. | أطفئي الأضواء. |
| 10 | blank card on linen, AM · PM schedule set on it | MORNING AND NIGHT. | УТРОМ И ВЕЧЕРОМ. | صباحاً ومساءً. |
| 11 | hand in an ivory knit sleeve carrying the closed case | SIX SINGLES. ONE KIT. | ШЕСТЬ СРЕДСТВ. ОДИН НАБОР. | ستة منتجات. صندوق واحد. |
| 12 | the six on white with the spec card | LIGHTS ON. | СВЕТ ВКЛЮЧЁН. | الأضواء مُضاءة. |

## Render (CapCut, GPT Image 2.5 · 2k · Medium · 1:1)

- Workspace `~/Desktop/Insta_Olga/bb_bright/campaign/`: `_scripts/bbp_batch.sh` (CapCut driver),
  `bbp_refs.py` (plates + pack cut-outs at real mm scale), `make_prompts.py`, `bbp_slides.py` +
  `bbp_copy.py` (type EN / RU / AR), `bbp_export.py`, `sheet.py`. Picks in `picks/`, masters in
  `final/`.
- Main, 01, 03, 04 and 06–09, 12 were re-shot from scale references; 02, 05, 10 and 11 are
  text-to-image concept plates. Nothing is pasted into a final.
- Picks: main `main_1`, s1 `s1_1`, s2 `s2_3`, s3 `s3_2`, s4 `s4_4`, s5 `s5_1`, s6 `s6_2`, s7 `s7_2`,
  s8 `s8_1`, s9 `s9_1`, s10 `s10_2`, s11 `s11_2`, s12 `s12_3`. Pack print checked at full size on
  every pick; no re-rolls were needed.
- Typesetting: `−` added to the Latin-run pattern so "−28%" stays whole in Arabic; the slide 10
  schedule is a left-aligned block centred on the card measured in the pick (x 1322–2085), with its
  own Arabic right edge; Arabic slide 10 headline joined to two lines (صباحاً / ومساءً.).
- CapCut driver (`Insta_Olga/aws/campaign/_scripts/capcut_ui.py`) now types through key codes and
  switches to the US layout while typing (CapCut's window had the Russian input source, so paths in
  "Go to Folder" came out empty); upload fails loudly if the reference does not attach.

## Site

- `public/images/bb_bright_campaign/main.jpg` + `s1–s12.jpg` + `{ru,ar}/s1–s12.jpg` (1600 px
  progressive, 37 files, 195–486 KB). Registered in `lib/localizedProductImages.ts`; the main is
  not translated.
- Page copy `components/product/beautybox/copy/skinBrightening.ts` EN/AR/RU rewritten in selling
  voice ("Let the light in."); `bb-amber` palette unchanged, comment header updated
  (`beautybox.css`).
- Central RU/AR `data/product56LocalizedCopy.ts`; quick facts `lib/productQuickFactsCatalog.ts`
  (Brighter in two weeks · 6 products inside · 2% niacinamide, twice · Patented MELAZERO® · Weekly
  peel included · Save AED 224.40).
- Cut-out `cutout/56-v2.webp` (Vision on the text-free main pick, then the builder's normalise;
  coverage 0.399): `build-cutouts.py` revision + comment, report, manifest.
- DB: `scripts/update-product-56-campaign-gallery.ts` writes `image` = main, `images` = s1–s12,
  EN description and RU/AR descriptions; checks all 37 URLs return 200 before writing. Old main
  image left on disk for past orders.
