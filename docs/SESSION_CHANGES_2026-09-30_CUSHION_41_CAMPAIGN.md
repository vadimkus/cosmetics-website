# Product 41 SKIN CARING BLEMISH BALM CUSHION — "Shade to go." campaign (30 Sep 2026)

Brief (Vadim): "next one?" after product 57. Picked 41 as the top seller still on old photos
(63 of the September order and session notes mention the cushion, more than any other product).

## Idea

- **SHADE TO GO.** "Shade" both ways: the sun shade you carry and the colour shade you wear.
  The Dubai sun finds you all day (office window, car, terrace); this compact goes with you.
- **Recurring motif:** a mashrabiya, the Gulf's carved sun screen. Hard afternoon sun through the
  lattice lays a star-and-cross shadow across every plate.
- **Positioning (DTS MG deck):** long-wear base plus touch-ups during the day, "for the correction
  of makeup", which is what separates it from product 63.
- **Livery:** warm sand and limestone alternating with near-black stone. Near-black ink, cocoa body
  and terracotta tags on sand; white headlines, mist body and sand-gold tags on black.

## Slides

| # | Plate | EN | RU | AR |
|---|---|---|---|---|
| Main | carton + open compact on white | (no type) | | |
| 01 | open compact on a limestone ledge, lattice shadow | SHADE TO GO. | ТЕНЬ С СОБОЙ. | ظلّكِ معكِ. |
| 02 | mashrabiya screen, sun pouring in | THE SUN FINDS YOU. | СОЛНЦЕ НАЙДЁТ ВАС. | الشمس تجدكِ. |
| 03 | closed compact on black stone, star light | SPF50+ PA++++ | SPF 50+ PA++++ | SPF50+ PA++++ |
| 04 | hand pressing the puff into the pad | ONE PRESS. THREE JOBS. | ОДНО КАСАНИЕ. ТРИ ЗАДАЧИ. | لمسة واحدة. ثلاث مهام. |
| 05 | formula swipe on black marble | 2% NIACINAMIDE | 2% НИАЦИНАМИД | 2% نياسيناميد |
| 06 | woman touching up in a café by the screen | TOUCH UP. DON'T START OVER. | ПОПРАВИТЬ, НЕ ПЕРЕДЕЛЫВАТЬ. | لمسة تصحيح، لا بداية جديدة. |
| 07 | three swatches on limestone + shade labels | THREE SHADES. SAME PROTECTION. | ТРИ ОТТЕНКА. ОДНА ЗАЩИТА. | ثلاث درجات. الحماية نفسها. |
| 08 | waterdrop puff on black satin, droplet at the tip | SHAPED LIKE A DROP. | В ФОРМЕ КАПЛИ. | على شكل قطرة. |
| 09 | open compact on a café table, Burj at sunset | GOLDEN HOUR, COVERED. | ЗОЛОТОЙ ЧАС ПОД ЗАЩИТОЙ. | جاهزة للساعة الذهبية. |
| 10 | how-to card on linen | PRESS. PAT. BUILD. | ПРИЖАТЬ. ПОХЛОПАТЬ. НАСЛОИТЬ. | اضغطي. ربّتي. كثّفي. |
| 11 | carton + compact on black stone | 30 G IN THE BOX. | 30 Г В КОРОБКЕ. | 30 غ في العلبة. |
| 12 | carton + compact on white + spec | SHADE TO GO. | ТЕНЬ С СОБОЙ. | ظلّكِ معكِ. |

## Production

- All plates CapCut GPT Image 2.5, 2k Medium 1:1. Pack plates re-shoot references built from the
  real packs cut out with Vision: the open compact (site cut-out 41), and from the Intertek photos
  the closed compact, the carton front and the waterdrop puff (outline restored from its convex hull
  where the crop clipped it). True relative scale: carton 98 mm, compact 83 mm, puff 62 mm.
- Carton shape: the first main batch turned the carton into a cube because the prompt said "square
  carton standing upright". Prompt now says a low, wide box about 1.5 times as wide as tall; main
  re-rolled (`mainb_2`), s11 and s12 shot with the fix.
- Pad emboss: s9_2 and s9_4 stamped letters into the cushion pad ("GENOSYS", "GE…SYS"); the real
  pad carries the emblem only. Picked s9_1; prompt now says emblem alone, no letters.
- s7 re-rolled: the first swatches sat mid-frame under the headline. Now low in the frame, with
  `#01 IVORY / #02 BEIGE / #03 CAMEL` set over each swatch.
- s9 was planned as "MIRROR IN THE LID", but the lid faces the camera, so it became "GOLDEN HOUR,
  COVERED." with the mirror in the body line.
- Print check at full resolution on every pack take: carton band, `#03 CAMEL`, `DERMATOLOGICALLY
  TESTED`, CBC PROFESSIONAL, lid logos and puff strap all clean on the picks.
- 37 progressive JPEGs (1600 px, 227–518 KB) in `public/images/cushion_campaign/{,ru/,ar/}`.

## Copy

- Held to the audited RU/AR rules in `__tests__/data/product41LocalizedCopy.test.ts`: no "only the
  colour changes", no "treats", no post-treatment suitability in RU/AR, the two-hour reapplication
  line kept, waterproof wording on the puff only.
- `bbCushionCopy.ts`: hero headline and opening line in the campaign voice (EN, AR_AUDITED,
  RU_AUDITED); the rest of the page copy unchanged.
- `data/product41LocalizedCopy.ts`: central RU/AR descriptions open with the campaign line.
- Quick facts realigned so EN, RU and AR say the same thing per row: SPF 50+ / PA++++, covers /
  protects / cares, niacinamide + adenosine, cushion + refill, triple fixing polymers, water
  resistance not claimed (with the two-hour top-up).
- DB description EN (campaign voice) + RU/AR from the data file, via the updater.

## Code

- `lib/products.ts`, `lib/routineStepImages.ts`, `DownloadsSection.tsx`, training catalogue and
  mobile training route, SEO landing cards EN/RU/AR → `/images/cushion_campaign/main.jpg`.
- `lib/localizedProductImages.ts` registers `/images/cushion_campaign`.
- Page: how-to figure is now the localized s10 card; the shade guide and puff cross-section
  figures (`cushion_2/s4`, `s2`) stay because they explain what no campaign slide does.
- Cut-out `public/images/cutout/41-v2.webp` (carton + compact, coverage 0.337), `lib/productCutouts.ts`,
  `scripts/cutout/build-cutouts.py`.
- `scripts/update-product-41-campaign-gallery.ts` (HEAD-checks all 37 assets before writing).
- Test: campaign assertions added to `__tests__/data/product41LocalizedCopy.test.ts`.

## Ship

- `npx tsc --noEmit` clean; `npx jest` 148 suites, 1,604 passed, 3 skipped.
- Commit `cbe55abf8` pushed to main; all 37 images 200 after the Vercel deploy.
- DB applied: image `/images/cushion_2/main.jpeg` → `/images/cushion_campaign/main.jpg`, gallery
  6 old slides → 12 campaign slides, description EN/RU/AR.
- Revalidated tag `products`, `/products/41`, `/ru/products/41`, `/ar/products/41`, `/products`, `/`.
- Live check found the RU/AR pages still showing the EN slides: the cushion page's gallery never
  ran `localizeProductImage` (the how-to card did). Fixed in `47142f067`.
- Mobile API: main + 12 per locale (`/ru/`, `/ar/` slides), `localizedDescription` opens with the
  campaign line in RU and AR.

## Reel (30 Sep 2026)

- 20 s "Shade to go." Reel: Seedance 2.5 from 11 text-free plates (`~/Desktop/Cushion_41_Reel/seedance_refs/`,
  prompt `SEEDANCE_PROMPT.txt`), source `0930_974.mp4`. Came back clean: all 11 shots in order, no Ai mark, logos
  correct, lid never moves, pad emblem only.
- Type pass `cushion41/campaign/_scripts/c41_reel_type.py` (Manrope Regular caps, campaign palette), audio to
  −16.0 LUFS / −1.5 dBTP. Instagram master `~/Desktop/Cushion_41_Reel/GENOSYS_Cushion_Reel_v1.mp4` + dark cover.
- Site: `public/videos/cushion-reel-web.mp4` (720×1280, 1.1 Mbps, 2.9 MB, metadata stripped) replaces
  `/videos/cushion.mp4` in `data/productConfig.ts`, the `lib/products.ts` fallback and the DB after deploy.
  9:16 poster `public/images/cushion_campaign/reel-poster.jpg` ("SHADE TO GO." frame). Video caption in EN/AR/RU
  now describes the Reel (the old one described the swatch demo). The old `cushion.mp4` file stays on disk.
- Shipped `ef951d1a6`; video + poster 200 after the Vercel deploy. DB `videoUrl` set with
  `scripts/set-product-video.ts 41 /videos/cushion-reel-web.mp4`. Revalidated tag `products`, `/products/41`,
  `/ru/products/41`, `/ar/products/41`. Live HTML in EN/RU/AR references the reel and poster with the new caption,
  no `/videos/cushion.mp4` left; mobile API `data.videoUrl` = `/videos/cushion-reel-web.mp4`.

## Files outside the repo

- `~/Desktop/Insta_Olga/cushion41/campaign/`: `_assets/` (real pack cut-outs), `_scripts/` (refs,
  prompts, batch, slides, copy, export), `_gen/` (references and all takes), `picks/`,
  `final/{,ru,ar}` with contact sheets.
