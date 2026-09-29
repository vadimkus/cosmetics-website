# Product 62 SENSITIVE SKIN BEAUTY BOX — "Handle with care." campaign (29 Sep 2026)

Brief (Vadim): run the next campaign for https://genosys.ae/products/62, in the family of the
earlier beauty boxes.

Fifth run of [Beauty Box style v1](./BEAUTY_BOX_CAMPAIGN_STYLE.md) (after 55, 58, 56 and 59).

## Idea

- **HANDLE WITH CARE.** Reactive skin flushes at the smallest thing; the box treats it like
  something fragile, from the first step to the last. Hook: a dandelion clock one breath from
  scattering.
- **Recurring prop:** every step pack stands on a small plump oat-linen cushion with a sage piped
  edge, the way a fragile piece is set down in a museum case.
- **Livery:** bone-white case, oat foam `#E2D5BC`, sage stripe and hardware `#5E7F63`. Grounds
  alternate pale oat `#F0E9DB` and sage, white for the close. Navy ink `#0E2A47` and deep-sage
  tags `#4E6B53` on oat, white / mist / oat tags on sage.

## Slides

| # | Plate | EN | RU | AR |
|---|---|---|---|---|
| Main | kit case top down on white | SENSITIVE SKIN | (EN only) | (EN only) |
| 01 | kit case on sage | HANDLE WITH CARE. | ОБРАЩАТЬСЯ БЕРЕЖНО. | تعاملي معها بعناية. |
| 02 | dandelion clock, seeds drifting, oat | ONE BREATH AWAY. | НА ОДНО ДЫХАНИЕ. | على بُعد نَفَس. |
| 03 | SNOW O₂ on the cushion, pale oat | NO SCRUBBING. | БЕЗ ТРЕНИЯ. | بلا فرك. |
| 04 | SNOW BOOSTER on the cushion, sage | NOTHING PERFUMED. | НИЧЕГО ЛИШНЕГО. | بلا عطر. |
| 05 | blush petal on still water in a porcelain dish | −26% REDNESS IN FOUR WEEKS. | −26% ПОКРАСНЕНИЯ ЗА ЧЕТЫРЕ НЕДЕЛИ. | −26% احمرار خلال أربعة أسابيع. |
| 06 | All For Sensitive Serum on the cushion, pale oat | SEVEN PLANTS. | СЕМЬ РАСТЕНИЙ. | سبعة نباتات. |
| 07 | Skin Barrier cream on the cushion, sage | 5,000 PPM. | 5 000 PPM. | 5,000 ppm. |
| 08 | overnight mask + sea algae sachet on the cushion | RESCUE NIGHTS. | НОЧИ SOS. | ليالي الإنقاذ. |
| 09 | white feather on oat cashmere | SOFT LANDING. | МЯГКАЯ ПОСАДКА. | هبوط ناعم. |
| 10 | blank card on oat linen, chamomile, AM · PM set on it | GENTLE, TWICE A DAY. | БЕРЕЖНО ДВАЖДЫ В ДЕНЬ. | بلطف مرتين يومياً. |
| 11 | hand carrying the closed case on sage | SIX SINGLES. ONE KIT. | ШЕСТЬ СРЕДСТВ. ОДИН НАБОР. | ستة منتجات. صندوق واحد. |
| 12 | the six singles on white + spec card | WITH CARE. | ВСЁ БЕРЕЖНО. | بعناية. |

Every figure on a slide is on the member's own page: redness −26% and water loss −15% are the
overnight mask's four-week trial and say so; 5,000 ppm Ceramide NP and 17.49% glycerin are the
barrier cream's; MultiEx BSASM® Plus 1% (seven plants) is the serum's; betaine 3% and "no parfum,
no essential oils" are the toner's. No box-level calming or barrier-repair claim.

## Render (CapCut, GPT Image 2.5 · 2k · Medium · 1:1)

- Workspace `~/Desktop/Insta_Olga/bb_sensitive/campaign/`: `_scripts/sen_refs.py` (kit case,
  cushion, packs at real mm scale: SNOW O₂ 165, Booster 195, serum 108, both 100 g tubes ~160,
  sachet 150), `sen_prompts.py`, `sen_batch.sh`, `sen_slides.py` + `sen_copy.py`,
  `sen_export.py`, `sheet.py`, `zoom.py`. Serum, cream and overnight-mask packs come from the site
  cut-outs `19`, `27`, `34-v2`.
- Picks: main `main_2`, s1 `s1b_4`, s2 `s2_2`, s3 `s3_2`, s4 `s4b_3`, s5 `s5_1`, s6 `s6_2`, s7
  `s7b_2`, s8 `s8_2`, s9 `s9_4`, s10 `s10_2`, s11 `s11_2`, s12 `s12_1`.
- Rejected on print: s4 take with "Gene Biotech System"; serum takes reading "corrects" for
  "protects"; barrier-cream takes reading "SFC PROFESSIONAL"; overnight-mask takes reading
  "non-ceramide" / "pon-ceramide". s4 and s7 were re-rolled (`s4b`, `s7b`), s1 got a fourth take.
- The first light prompt showed the sheer curtain at the left edge, behind the type column; the
  step prompts now keep the window out of frame (noted in the style guide).
- Typesetter: soft shade behind the type on slides 4 and 7 (white on sage over light streaks);
  slide 8 column narrowed and Arabic edges set on 5 and 8 to stay off the dish and the tube.

## Site

- `public/images/bb_sensitive_campaign/main.jpg` + `s1–s12.jpg` + `{ru,ar}/s1–s12.jpg` (37 files,
  199–509 KB), registered in `lib/localizedProductImages.ts`; the main is not translated.
- Page copy `components/product/beautybox/copy/sensitiveSkin.ts` EN/AR/RU in the campaign voice,
  with a full sourcing block traced to the Intertek files. **English corrected**: it claimed the
  toner and both masks were fragrance-free and quoted a 3% bubble agent. Intertek: only the toner
  is free of parfum and essential oils; the overnight mask carries perfuming oils with citral,
  geraniol and limonene, the sheet mask peppermint oil; the SNOW O₂ bubble agent is 8%. EN also
  dropped the "rebuilding after treatments" suitability line, which contradicted RU/AR (aftercare
  is a look-elsewhere case). SNOW O₂ pregnancy warning in every language.
- Central RU/AR `data/product62LocalizedCopy.ts` descriptions rewritten; quick facts realigned so
  EN, RU and AR describe the same fact in each row (−26% redness · 6 products · 5,000 ppm
  ceramide · Seven-plant serum · Toner with no parfum · Save AED 304); `bb-oat` palette takes sage.
- Cut-out `cutout/62-v4.webp` (Vision on the text-free main pick, normalised, coverage 0.408);
  old repair rectangles for the previous photo removed, revision 4 noted, report and manifest.
- `scripts/update-product-62-campaign-gallery.ts` writes `image`, `images` and EN/RU/AR
  descriptions after checking all 37 URLs return 200. The old main stays on disk for past orders.

## Live (29 Sep 2026)

- Commit `38cecf91b` pushed to main; deploy served the files at 23:41.
- Updater applied: `image` `/images/bb_box_sensitive/Main-v2.jpeg` →
  `/images/bb_sensitive_campaign/main.jpg`, `images` `[]` → 12 slides, descriptions written.
- Revalidated `/products/62`, `/ru/products/62`, `/ar/products/62`, `/products`, `/`, tag `products`.
- Web: EN/RU/AR pages carry the 12 slides (RU/AR from their own `ru/`, `ar/` folders) and
  "Handle with care." / "Обращаться бережно." / "تعاملي معها بعناية."; browser shows the new main,
  the campaign gallery and `--cera-rose` resolving to sage `#5e7f63`. The mauve buy button is the
  site-wide `--cera-cta`, shared by every box page.
- Mobile API `/api/mobile/products/62` (`x-locale`): main + 12 slides per locale, new
  `localizedDescription` in RU/AR, realigned quick facts. No OTA needed.
- Checks: `npx tsc --noEmit` clean, jest 147 suites / 1,602 tests passed, eslint clean.
