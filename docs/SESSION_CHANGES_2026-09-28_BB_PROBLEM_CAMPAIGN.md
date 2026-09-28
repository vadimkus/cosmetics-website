# Product 55 PROBLEM SKIN CARE BEAUTY BOX — "The Oil Change" campaign (28 Sep 2026)

Brief (Vadim): campaign for https://genosys.ae/products/55, every image generated in CapCut, no
pasting on top, the items are singles so find a creative way to show a box of them, polish the
main, and set a style the other beauty boxes will follow one by one.

The style system this campaign sets is written up in
[`BEAUTY_BOX_CAMPAIGN_STYLE.md`](./BEAUTY_BOX_CAMPAIGN_STYLE.md) (the kit case, main image
rules, 12-slide grammar, type, palettes and idea seeds for 56, 57, 58, 59 and 62).

## Idea

- **Singles, boxed.** A box of standalone products has no bottle of its own, so the box becomes
  an object: an open bone-white hard-shell kit case, shot from directly above, with a die-cut
  foam insert holding the five products in the order they are used.
- **THE OIL CHANGE.** Problem skin care treated as a precision service schedule for skin that
  shines by noon. Gulf-livery palette: powder blue `#9ACDEB`, signal orange `#F26A21`, bone
  shell `#F2EFE9`, navy ink `#0E2A47`, burnt-orange accent `#C2501A`.

## Facts used (from the audited member copy, Intertek first)

- SNOW O₂ 180 ml: goes on a dry face, builds its own air foam, no scrubbing.
- Intensive Problem Control Toner 200 ml: zinc PCA 0.5% on a 13.4% hydrating base; about 50%
  less sebum after four weeks (finished product study); non-comedogenic, tested by QACS Ltd.
- Problem Control Serum 30 ml: zinc PCA 0.05%; registered in Korea for oil and sebum control.
- Intensive Problem Control Cream 50 g: no traditional oil phase, trehalose 1.5%, xylitol 0.5%,
  zinc PCA 0.05%.
- Soothing Bomb Sea Algae Mask 25 g ×3: Eucalace® sheet, allantoin and panthenol 0.1% each,
  15 to 20 minutes.
- Dropped from the old EN copy: the serum and cream sebum and mark percentages, the
  inflammation cycle, oxygen therapy and "balance oil" claims. No prices in the images; the page
  computes the saving live.

## Slides

| # | Plate | EN | RU | AR |
|---|---|---|---|---|
| Main | kit case top down on white, five singles in routine order | PROBLEM SKIN CARE | (EN only) | (EN only) |
| 01 | kit case on orange | YOUR SKIN IS DUE AN OIL CHANGE. | ВАШЕЙ КОЖЕ ПОРА МЕНЯТЬ МАСЛО. | حان وقت تغيير الزيت. |
| 02 | orange dipstick with a golden drop on blue | SHINY BY NOON? | БЛЕСТИТЕ К ПОЛУДНЮ? | لمعان قبل الظهر؟ |
| 03 | SNOW O₂ in a burst of air foam | FLUSH. | ПРОМЫВКА. | تنظيف عميق. |
| 04 | toner mist from the nozzle on orange | CUT THE SHINE. | МИНУС БЛЕСК. | وداعاً للمعان. |
| 05 | two oil vials, full and half | ~50% LESS SEBUM. | ≈50% МЕНЬШЕ СЕБУМА. | ≈50% زهم أقل. |
| 06 | serum beside a feeler gauge on steel | FINE-TUNE. | ТОНКАЯ НАСТРОЙКА. | ضبط دقيق. |
| 07 | cream tube with a gel swirl | WATER, NOT OIL. | ВОДА, А НЕ МАСЛО. | ماء، لا زيت. |
| 08 | three masks on crushed ice | COOL DOWN. | ПЕРЕДЫШКА. | استراحة باردة. |
| 09 | water beading on blue paint, orange towel | TREAT IT LIKE PAINTWORK. | БЕРЕЖНО, КАК ПОЛИРОВКУ. | عامليها كطلاء سيارتكِ. |
| 10 | clipboard service schedule (type rotated −5.5°) | SERVICE SCHEDULE. | ГРАФИК ОБСЛУЖИВАНИЯ. | جدول الصيانة. |
| 11 | a hand carrying the closed case | FIVE SINGLES. ONE KIT. | ПЯТЬ СРЕДСТВ. ОДИН НАБОР. | خمسة منتجات. صندوق واحد. |
| 12 | the five on white with the spec card | FULL SERVICE. | ПОЛНОЕ ОБСЛУЖИВАНИЕ. | صيانة كاملة. |

## Render (CapCut, GPT Image 2.5 · 2k · 1:1)

- Workspace `~/Desktop/Insta_Olga/bb_problem/campaign/`: `_scripts/bbp_batch.sh` (CapCut driver
  via `Insta_Olga/aws/campaign/_scripts/capcut_ui.py`), `bbp_refs.py` (empty plate + product
  cut-outs at real mm scale), `bbp_slides.py` + `bbp_copy.py` (type EN / RU / AR),
  `bbp_export.py`. Prompts in `_prompts/`, picks in `picks/`, masters in `final/`.
- Every product slide and the main were re-shot in CapCut from the scale reference so the
  products sit in the scene's light; nothing is left pasted.
- Fixes on the way: the toner mist first came from outside the frame (re-plated `p4b`, re-shot
  `s4rb` with the mist from the nozzle); the hero re-shoot turned the toner and cream bands into
  solid blue (`s1rc` rebuilt from the approved main's cut-out with the print held); corrupt
  draft PNGs in the CapCut cache are now skipped in `capcut_ui.py` fetch.
- Typeset: 04 body moved to the clean orange floor (white on white mist was unreadable); 10
  schedule at 66 pt, last line shortened to "+ MASK, AS NEEDED".

## Site

- `public/images/bb_problem_campaign/main.jpg` + `s1–s12.jpg` + `{ru,ar}/s1–s12.jpg`
  (1600 px progressive, q88 4:4:4 stepped down to fit ~520 KB; 37 files, 168–500 KB).
  Registered in `lib/localizedProductImages.ts`; the main is not translated.
- Box gallery order is now kit shot → the box's own slides (DB `images`) → member packshots in
  routine order, on the web page (`BeautyBoxProductPage.tsx`, localized per locale) and in the
  mobile API (`lib/beautyBoxGallery.ts`). A member packshot listed in a box record keeps its
  routine position. Test `__tests__/lib/beautyBoxGallery.test.ts`.
- Palette `bb-pine` → `bb-livery` for 55 (`beautybox.css`, `beautyBoxes.ts`).
- EN copy in `copy/problemSkin.ts` rewritten to the facts above, RU/AR footnotes aligned.
- Cut-out `cutout/55-v4.webp` from the text-free main pick (`build-cutouts.py`, manifest).
- Box 59 (Deep Moisturizing): its `images` field held two outdated packshots and one member
  image (`["/images/Second/main_booster.jpg","/images/hyaluron_serum/main.jpeg","/images/sea_algae/Main.jpeg"]`),
  which the new order would have put ahead of its routine. Cleared to `null` before the deploy,
  so 59 shows main + its five members like 55–58.
- Unrelated fix in the same commit: `lib/chatbot/config.ts` PCT line had an en dash (`5–10`),
  which failed `noDashes.test.ts`.
- DB: `scripts/update-product-55-campaign-gallery.ts --apply` after the deploy (checks all 37
  URLs return 200 first): image, gallery, EN description.
