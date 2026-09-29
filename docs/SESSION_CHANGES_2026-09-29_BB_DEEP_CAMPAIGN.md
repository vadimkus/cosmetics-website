# Product 59 DEEP MOISTURIZING BEAUTY BOX — "The refill." campaign (29 Sep 2026)

Brief (Vadim): next campaign for https://genosys.ae/products/59, in the family of the earlier
beauty boxes (58). Selling. Full control, CapCut to generate and re-shoot, push to main.

Fourth run of [Beauty Box style v1](./BEAUTY_BOX_CAMPAIGN_STYLE.md) (after 55, 58 and 56).

## Idea

- **THE REFILL.** Desert sun outside and air conditioning inside leave skin running on empty; the
  box refills it and keeps it full. Hook: an empty glass on sun-bleached desert stone.
- **Recurring prop:** a plain glass column of water beside every step pack, filling with the
  routine: a quarter at the cleanser, half at the toner, three quarters at the serum, to the brim
  and stoppered at the cream. Sunlight through it throws pool caustics on every set.
- **Livery:** bone-white case, aqua foam `#96D4CF`, deep-teal stripe and hardware `#0E5B61`.
  Grounds alternate pale aqua `#BEE6E2` and deep teal, sand for the hook, white for the close.
  Navy ink `#0E2A47` and teal tags on light grounds, white / mist / aqua tags on teal.

## Slides

| # | Plate | EN | RU | AR |
|---|---|---|---|---|
| Main | kit case top down on white | DEEP MOISTURIZING | (EN only) | (EN only) |
| 01 | kit case on teal under pool light | THE REFILL. | ДОЛЕЙТЕ ВЛАГИ. | املئيها من جديد. |
| 02 | empty glass on desert stone, hard sun | RUNNING ON EMPTY. | ВЛАГА НА НУЛЕ. | بشرة عطشى. |
| 03 | SNOW O₂ + glass ¼, pale aqua | START CLEAN. | ЧИСТЫЙ СТАРТ. | بداية نظيفة. |
| 04 | SNOW BOOSTER + glass ½, teal | FIRST SIP. | ПЕРВЫЙ ГЛОТОК. | الرشفة الأولى. |
| 05 | glass brimming over, a drop running down | +82% HYDRATION AFTER ONE USE. | +82% УВЛАЖНЕНИЯ ПОСЛЕ ОДНОГО РАЗА. | +82% ترطيب بعد استخدام واحد. |
| 06 | hyaluron serum + glass ¾, pale aqua | DRAW IT IN. | ВТЯНУТЬ ВЛАГУ. | اسحبي الماء. |
| 07 | hyaluron cream + full stoppered glass, teal | LOCK IT IN. | ЗАКРЫТЬ ВЛАГУ. | احبسي الماء. |
| 08 | three mask sachets fanned on wet aqua glass | THREE TOP-UPS. | ТРИ ДОЗАПРАВКИ. | ثلاث جرعات إضافية. |
| 09 | water droplets beaded on aqua | DEWY BY DEFAULT. | КОЖА, ПОЛНАЯ ВОДЫ. | بشرة مليئة بالماء. |
| 10 | blank card on aqua linen, AM · PM set on it | FILL UP TWICE A DAY. | ДОЛИВАЙТЕ ДВАЖДЫ В ДЕНЬ. | املئي مرتين يومياً. |
| 11 | hand carrying the closed case on teal | FIVE SINGLES. ONE KIT. | ПЯТЬ СРЕДСТВ. ОДИН НАБОР. | خمسة منتجات. صندوق واحد. |
| 12 | the singles on white + spec card | REFILLED. | ДО КРАЁВ. | حتى الحافة. |

## Render (CapCut, GPT Image 2.5 · 2k · Medium · 1:1)

- Workspace `~/Desktop/Insta_Olga/bb_deep/campaign/`: `_scripts/dm_refs.py` (kit case, glass
  column, caustics, packs at real mm scale), `dm_prompts.py`, `dm_batch.sh` (CapCut driver with a
  retry on every step), `dm_slides.py` + `dm_copy.py` (type EN / RU / AR), `dm_export.py`,
  `sheet.py`, `zoom.py`. Picks in `picks/`, masters in `final/`.
- Picks: main `main_3`, s1 `s1_1`, s2 `s2_1`, s3 `s3_4`, s4 `s4_3`, s5 `s5_1`, s6 `s6_1`, s7 `s7_3`,
  s8 `s8_3`, s9 `s9_2`, s10 `s10_4`, s11 `s11_2`, s12 `s12_4`. Every pick's pack print was read at
  full size; takes with misspelt small print ("rvitalizing", "hyalronic", "INSTANIT",
  "without without") were rejected. No re-rolls needed.
- CapCut driver: `generate` now reads `CAPCUT_FAIL_AFTER` (default 600 s; this batch 240 s) so a
  failed Medium generation retries in minutes; `dm_batch.sh` retries clicks refused because
  another app had focus. One slide 1 generation failed server-side and passed on retry.
- Typesetter: `ar_w` gives an Arabic-only measure (slide 8, where the right-aligned Arabic would
  otherwise run onto the sachets). Slides 3, 6 and 9 were reworded to stay clear of the phrasings
  the product 59 test forbids ("layer by layer", cooling on contact, "not stripped").

## Site

- `public/images/bb_deep_campaign/main.jpg` + `s1–s12.jpg` + `{ru,ar}/s1–s12.jpg` (37 files,
  218–517 KB), registered in `lib/localizedProductImages.ts`; the main is not translated.
- Page copy `components/product/beautybox/copy/deepMoisturizing.ts` EN/AR/RU in the campaign
  voice ("The refill."), with per-item fact chips, a serum-vs-cream FAQ and a fourth proof card
  (betaine 3%). Kept: the SNOW O₂ pregnancy and breastfeeding warning (now in every language,
  replacing the English line that called the serum and cream cleared), fragrance and essential
  oils by product, no weekly mask frequency. Sourcing block: bubble agent corrected to 8%.
- Central RU/AR `data/product59LocalizedCopy.ts` descriptions rewritten; quick facts (+82%
  hydration · 7 pieces · Hyaluron duo · Fragrance-free toner · Three sea algae masks · Save AED
  197.70); `bb-water` palette moved to aqua and deep teal (`beautybox.css`).
- Cut-out `cutout/59-v3.webp` (Vision on the text-free main pick, normalised, coverage 0.429);
  old repair rectangles for the previous photo removed, revision 3 noted, report and manifest.
- `scripts/update-product-59-campaign-gallery.ts` writes `image`, `images` and EN/RU/AR
  descriptions after checking all 37 URLs return 200. The old main stays on disk for past orders.
- Style guide updated with the fourth run, the 59 livery and its prop.

## Live (29 Sep 2026)

- Commit `3378ce308` pushed to main; deploy served the files at 22:23.
- Updater applied: `image` `/images/bb_box_deep/Main.jpeg` → `/images/bb_deep_campaign/main.jpg`,
  `images` null → 12 slides, descriptions written.
- Revalidated `/products/59`, `/ru/products/59`, `/ar/products/59`, `/products`, `/`, tag `products`.
- Web: EN/RU/AR pages carry the 12 slides and "The refill." / "Долейте влаги." /
  "املئيها من جديد."; browser shows the new main, gallery and aqua palette.
- Mobile API `/api/mobile/products/59`: main + 12 slides per locale (`ru/`, `ar/`), new
  descriptions and quick facts. No OTA needed.
- Checks: `npx tsc --noEmit` clean, jest 147 suites / 1,602 tests passed, eslint clean.
