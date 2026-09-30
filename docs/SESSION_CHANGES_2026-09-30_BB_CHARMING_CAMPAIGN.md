# Product 57 CHARMING LOOK BEAUTY BOX — "Curtain up." campaign (30 Sep 2026)

Brief (Vadim): run the next beauty box campaign, product 57, EN/RU/AR, selling voice, push to main.

Sixth run of [Beauty Box style v1](./BEAUTY_BOX_CAMPAIGN_STYLE.md) (after 55, 58, 56, 59 and 62).

## Idea

- **CURTAIN UP.** Office light, phone cameras, Dubai sun: the skin is on stage from morning to
  night. The box gets it ready (cleanse, tone, cushion) and takes it all off again (remover,
  overnight mask). Hook: a make-up mirror ringed with bulbs.
- **Recurring prop:** every step pack stands on a small round stage riser in plum velvet with a
  thin gold band, in a soft spotlight, as if waiting in the wings.
- **Livery:** bone-white case, blush foam `#EAC4C0`, plum stripe and hardware `#7A2E5C`. Grounds
  alternate deep plum and pale blush `#F6E4E1`, white for the close. Navy ink `#0E2A47` and plum
  tags on blush, white / mist / blush tags on plum.

## Slides

| # | Plate | EN | RU | AR |
|---|---|---|---|---|
| Main | kit case top down on white, one closed cushion | CHARMING LOOK | (EN only) | (EN only) |
| 01 | kit case on plum | CURTAIN UP. | ЗАНАВЕС ПОДНЯТ. | ارفعي الستار. |
| 02 | bulb-lit make-up mirror and vanity, blush | ALL EYES ON YOU. | ВСЕ ВЗГЛЯДЫ НА ВАС. | كل الأنظار عليكِ. |
| 03 | SNOW O₂ on the riser, plum | ON DRY SKIN. | НА СУХУЮ КОЖУ. | على بشرة جافة. |
| 04 | SNOW BOOSTER on the riser, blush | MIST OVER MAKE-UP. | ПОВЕРХ МАКИЯЖА. | رذاذ فوق المكياج. |
| 05 | pink parasol in a spotlight, plum | SPF50+ PA++++ | SPF50+ PA++++ | SPF50+ PA++++ |
| 06 | cushion open on the riser, blush | THREE IN ONE PRESS. | ТРИ В ОДНОМ КАСАНИИ. | ثلاثة في لمسة واحدة. |
| 07 | remover on the riser, plum | CURTAIN DOWN. | ЗАНАВЕС ОПУЩЕН. | أسدلي الستار. |
| 08 | overnight mask on the riser, blush | LEAVE IT ON. | ОСТАВЬТЕ НА НОЧЬ. | اتركيه حتى الصباح. |
| 09 | powder puff on plum satin | SOFT FOCUS. | МЯГКИЙ ФОКУС. | تركيز ناعم. |
| 10 | blank card on blush silk, AM · PM set on it | RUNNING ORDER. | ПОРЯДОК ВЫХОДА. | ترتيب العرض. |
| 11 | hand carrying the closed case, plum | FIVE SINGLES. ONE KIT. | ПЯТЬ СРЕДСТВ. ОДИН НАБОР. | خمسة منتجات. صندوق واحد. |
| 12 | the five singles on white + spec column | BACKSTAGE, BOXED. | ГРИМЁРКА В НАБОРЕ. | الكواليس، في صندوق. |

SPF50+ PA++++ is credited to the cushion alone. Betaine 3% and "no added fragrance" are the
toner's; niacinamide 2% and adenosine 0.04% are the cushion's and the overnight mask's. The box
holds six pieces: the cushion ships with its sealed 15 g refill (Vadim confirmed 30 Sep), so
"5 products · 6 pieces" and "15 g + 15 g refill" stay in the copy.

## Render (CapCut, GPT Image 2.5 · 2k · Medium · 1:1)

- Workspace `~/Desktop/Insta_Olga/bb_charming/campaign/`: `_scripts/bbc_refs.py` (kit case,
  riser, packs at real mm scale: SNOW O₂ 165, Booster 195, cushion 83, remover 172, mask 158),
  `bbc_prompts.py`, `bbc_batch.sh`, `bbc_slides.py` + `bbc_copy.py`, `bbc_export.py`, `sheet.py`,
  `zoom.py`.
- Picks: main `mainm_2`, s1 `s1c_3`, s2 `s2_2`, s3 `s3b_1`, s4 `s4b_2`, s5 `s5_1`, s6 `s6_2`,
  s7 `s7_2`, s8 `s8_2`, s9 `s9_2`, s10 `s10_4`, s11 `s11_2`, s12 `s12d_2`.
- **One cushion in the case (Vadim, 30 Sep).** The first kit reference put the refill pan in the
  pocket under the compact, so the case showed two black circles. The refill is gone from the
  reference and the prompt now asks for one closed compact alone in its pocket. CapCut still
  invents a second disc in the empty foam about half the time (main takes f–l); every such take
  was rejected.
- **Print.** At kit and line-up scale CapCut misreads the real claim lines ("SOC ic", "clearsing",
  "botarated", "multi viamins", "skin skin", "SKIN RESCUR"); 0 of 12 line-up takes and most kit
  takes failed. No hand restoring. Fix: build the next reference from CapCut's own correct take.
  `rehost()` lifts the whole case from `s1c_3` onto white (main `mainm`), and `lift()` cuts the
  four packs out of `mainm_2` with Vision and stands them in the line-up (s12 `s12d`/`s12e`); the
  open compact stays the real pack art. 3 of 4 `s12d` takes came back word-perfect.
- Typesetter: slide 2 column narrowed to stay off the mirror bulbs (RU headline touched them);
  Arabic right edges set on slides 2 and 6 so the mirrored column clears the mirror and the lid.

## Site

- `public/images/bb_charming_campaign/main.jpg` + `s1–s12.jpg` + `{ru,ar}/s1–s12.jpg` (37 files,
  193–432 KB), registered in `lib/localizedProductImages.ts`; the main is not translated.
- Page copy `components/product/beautybox/copy/charmingLook.ts` EN/AR/RU in the campaign voice;
  SNOW O₂ bubble agent corrected to 8%, reapply-outdoors line, SNOW O₂ pregnancy warning, the
  "made for use after professional treatment" suitability line replaced (ask the practitioner).
- Central RU/AR `data/product57LocalizedCopy.ts` descriptions open with the campaign line; quick
  facts realigned so EN, RU and AR say the same thing per row (SPF50+ PA++++ cushion · 5 products,
  6 pieces · Three shades · Mist over make-up · Remover + overnight mask · Save AED 228);
  `bb-mauve` palette moves to blush + plum. RU/AR SEO landing cards point at the new main.
- Cut-out `cutout/57-v2.webp` (Vision on the text-free main pick, normalised, coverage 0.42),
  revision 2 noted in `build-cutouts.py`, map and report updated.
- `scripts/update-product-57-campaign-gallery.ts` writes `image`, `images` and EN/RU/AR
  descriptions after checking all 37 URLs return 200. The old main stays on disk for past orders.

## Live (30 Sep 2026)

- Commit `4258f10b2` pushed to main; deploy served the files at 08:53.
- Updater applied: `image` `/images/bbbox_charming/main.jpeg` →
  `/images/bb_charming_campaign/main.jpg`, `images` `null` → 12 slides, descriptions written.
- Revalidated `/products/57`, `/ru/products/57`, `/ar/products/57`, `/products`, `/`, tag `products`.
- Web: EN/RU/AR pages carry the new main and 12 slides (RU/AR from their own `ru/`, `ar/` folders),
  headlines "Curtain up." / "Занавес поднят." / "ارفعي الستار.", no reference to the old main.
- Mobile API `/api/mobile/products/57` (`X-API-Key`, `x-locale`): main + 12 slides per locale,
  RU/AR slides from their folders, new `localizedDescription`. No OTA needed.
- Checks: `npx tsc --noEmit` clean, jest 148 suites / 1,604 tests passed.
- Style guide: production rule 2 now records the lift-from-a-clean-take fix and the one-cushion rule.
