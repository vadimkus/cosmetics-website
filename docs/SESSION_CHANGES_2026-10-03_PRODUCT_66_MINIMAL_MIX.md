# Session changes - 3 Oct 2026 - Product 66 CERABARRIER, minimalist slides mixed into the studio set

Vadim on https://genosys.ae/products/66: "keep existing slides + add more, so we have a mix,
minimalism + existing. we need to enhance existing campaign. shoot additional + push to main".

## Gallery (14 slides, main unchanged)

The Aug 2026 studio slides `cera_o/s1-s7` stay as they are. Seven minimalist slides `cera_o/m1-m7`
(+ `ru/`, `ar/`) sit between them:

`m1, s1, s2, m2, s3, m3, s4, m4, s5, m5, s6, m6, m7, s7`

| File | Plate | EN headline | RU | AR |
|---|---|---|---|---|
| m1 | red silk shedding a stream of water, blush | WASHED. STILL SOFT. | ЧИСТО. И МЯГКО. | نظيفة. وناعمة. |
| m2 | blush brick wall, red | THE BARRIER'S OWN BRICKS. | КИРПИЧИ САМОГО БАРЬЕРА. | لبنات الحاجز نفسه. |
| m3 | five red spheres, blush; giant 5 | 5 CERAMIDES. | 5 КЕРАМИДОВ. | 5 سيراميدات. |
| m4 | dandelion clock, red | PRO + PRE. IN ONE GEL. | ПРО + ПРЕ. В ОДНОМ ГЕЛЕ. | بروبيوتيك + بريبايوتيك. في جل واحد. |
| m5 | one clear gel drop, blush; giant pH 6.37 | MILD BY NUMBERS. | МЯГКОСТЬ В ЦИФРАХ. | لطيف بالأرقام. |
| m6 | red sun disc and crescent, blush | DAY AFTER DAY. | ДЕНЬ ЗА ДНЁМ. | يومًا بعد يوم. |
| m7 | the real 600 ml and 200 ml bottles, red | 200 ML HOME. 600 ML CLINIC. | 200 МЛ — ДОМ. 600 МЛ — КАБИНЕТ. | 200 مل للمنزل. 600 مل للعيادة. |

Two colours: pack red `#B41B21` (the label stripe and the studio slides' type) and blush `#F4D9DA`
(the pack's pale pink print). Manrope Regular, Noto Sans Arabic for AR. No people, no Dubai, no tools.

## Facts and the 21 Aug audit

Copy is held to `SESSION_CHANGES_2026-08-21_PRODUCT_66_LOCALIZATION_AUDIT.md`, which removed barrier
repair or strengthening, microbiome balancing, base-make-up removal, guaranteed no-tightness, all-skin
and universal twice-daily claims. A first draft ("WASHED. NOT STRIPPED.", "THE WALL STAYS UP.",
"IN BALANCE.", "MORNING. NIGHT.") made those claims and was rewritten before export; the forbidden
patterns from `__tests__/data/product66LocalizedCopy.test.ts` were run over all three languages.
Sources: Intertek `Cerrabar/200ml` formula, COA (pH 6.37 inside 6.50 ± 0.50) and pack artwork ("a daily
cleanser ... supporting a long-lasting moisture barrier for a soft, hydrated finish"; lather, massage,
rinse with lukewarm water). No lot code, no manufacturer, no test house, no 145.8% / 2.4x.

## Production

Workspace `~/Desktop/Insta_Olga/cera66/` (`_scripts/c66_*`):

- `c66_prompts.py` + `c66_batch.sh`: CapCut GPT Image 2.5, 2k Medium 1:1, prompt only, one pass of
  seven (16 credits each). Picks n1/3, n2/2, n3/2, n5/2, n6/2, n8/1, n7/1.
- `c66_packs.py`: m7 composites the real bottles from `cutout/66-v2.webp` onto the empty red plate,
  with contact shadows, red rim bounce and a softened alpha edge, so every label is the real print.
- `c66_copy.py`, `c66_art.py` (from stamp67v3 `s3_art.py`; adds a `unit` role for "pH"),
  `c66_export.py` (1600 px progressive JPEG, 146-307 KB).

## Site

- `public/images/cera_o/m1-m7.jpg` + `ru/`, `ar/` (21 new files; nothing overwritten).
- `lib/localizedProductImages.ts`: m1-m7 added to the `cera_o` RU/AR lists.
- `__tests__/data/product66LocalizedCopy.test.ts`: gallery constant is the new 14-slide order.
- DB: `scripts/update-product-66-minimal-mix-20261003.ts --apply` (images field only, HEAD-checks
  all 42 URLs first). Revalidated `products` tag and `/products/66` in EN/RU/AR.
- Live: EN/RU/AR pages carry the seven new slides (RU/AR their localized files); mobile API returns
  them, `locale=ar` with the `ar/` files.
- Commit `c0c6db6b6`.

## 4 Oct 2026: two-sizes slide re-shot, dossier language removed

Vadim on m7 (200 ML HOME. 600 ML CLINIC.): "reshoot this slide and remove dossier language, fix as required".

- **m7 → m7b**: the composite (cut-out pasted on the plate) read as pasted. Re-shot in CapCut GPT Image 2.5
  from that composite as reference (`_gen/ref/r7.jpg`, prompt `r7`, `c66_batch_ref.sh`): one real photograph,
  shaded glossy bottles, red bounce, floor reflection. Take r7_1; every label checked at full size and reads
  as the real print, so no artwork paste was needed. Composite kept as `picks/n7_composite.png`.
- **Slide copy** (m2 → m2b, m4 → m4b, m5 → m5b, EN/RU/AR): no "specification", "ferment lysates" or "in the
  formula". 2: "Ceramides and cholesterol are what the skin barrier is built from. This gel carries both."
  4: "Two probiotic ferments and three prebiotics: fructan, chicory and dandelion root." 5: "A gentle pH,
  with an amino-acid cleanser at the heart of the gel."
- **RU/AR page and record copy** (`cerabarrierCopy.ts` RU_AUDITED / AR_AUDITED, `data/product66LocalizedCopy.ts`):
  the 21 Aug audit had written them in examiner voice (DTS MG presentation, "confirmed by documents",
  "original report not found", trace concentrations, "not proven", "the pack does not set a frequency",
  the 25.59 → 56.19 debunk, 5.0000076%). Rewritten as selling copy on the same facts, still without the
  audit's removed claims: headline "Чистая кожа. Мягкое ощущение." / "بشرة نظيفة وملمس ناعم."; the proof
  block is now "after the wash" (pH 6.37, five ceramides, what the buyer feels, a short precaution);
  make-up FAQ is honest guidance (remove long-wear make-up first); frequency "daily cleanser" from the pack.
- Test: the "unreproducible deck claim" case is replaced by one that fails on dossier vocabulary, DTS MG,
  the deck figures and the six-decimal percentages in RU/AR. 10 product-66 suites, 136 tests pass.
- DB: `scripts/update-product-66-selling-copy-20261004.ts --apply` (gallery m1, s1, s2, m2b, s3, m3, s4, m4b,
  s5, m5b, s6, m6, m7b, s7 and descriptionRu / descriptionAr; EN untouched). Revalidated; live EN/RU/AR pages
  and the mobile API (`locale=ar`) serve the b slides; no audit phrase left on the RU/AR pages.
- Commit `61a6a73b9`. Not run: `scripts/update-product-66-localized-copy-20260821.ts` would write the
  audit's dossier wording into the EN record too; leave it unapplied.

## 4 Oct 2026: 145.8% / 2.4x removed, s4 re-shot as s4b

Vadim: take the deck hydration figures out of the English copy too, and reshoot s4.

- **s4 → s4b** (EN/RU/AR, `cera_o/{,ru/,ar/}s4b.jpeg`): same photo. `~/Desktop/Insta_Olga/cera66/s4/s4_clean.py`
  erases the old type block by block (normalized-blur fill + grain, within 0.5 level of the backdrop, droplets kept);
  `s4_type.py` sets new copy in the s4 layout: AFTER THE WASH / SOFT. A SOFT, HYDRATED FINISH / DAILY. A GEL
  CLEANSER FOR EVERY DAY / "Supports a long-lasting moisture barrier, wash after wash." / Dermatologically tested.
  Made in Korea. (RU ПОСЛЕ УМЫВАНИЯ / МЯГКО. / КАЖДЫЙ ДЕНЬ.; AR بعد الغسل / ناعمة. / يوميًا.). Manrope ExtraLight
  for the large words, red `#B2222C` as on s4.
- **EN copy** (`cerabarrierCopy.ts`): hero bullet, two stats, proof block ("After the wash", pH 6.37 and five
  ceramides, "Dermatologically tested") and the "Will it dry my skin out?" answer no longer cite the figures.
  Proof image is s4b with new alt text. Quick facts (`productQuickFactsCatalog.ts`, 66): EN "Amino-acid cleansing"
  and "Gentle pH 6.37"; RU/AR rows without trace-level, presentation or "not fragrance-free" wording.
- **DB** (`scripts/update-product-66-no-hydration-figure-20261004.ts --apply`): EN description sentence and two
  benefits rewritten, gallery s4 → s4b. Live EN/RU/AR pages and the mobile API: no 145.8 or 2.4x, s4b served.
- Tests: 46 suites, 541 passing (`ProductQuickFactsHelper` now expects "Amino-acid cleansing"). Commit `fdb77e2dd`.
- The RU/AR base objects `_RU` / `_AR` in `cerabarrierCopy.ts` still hold the old figures but every such field is
  overridden by RU_AUDITED / AR_AUDITED, so none of it renders.

## 4 Oct 2026: Seedance 2.5 reel kit ("Washed. Still soft.")

- `~/Desktop/Cerabarrier_66_Reel/`: `SEEDANCE_PROMPT.txt` (20 s, 9:16, 11 shots, ~104 BPM warm minimal deep
  house with water-drop percussion and a wordless hum, no lyrics; end hold on white 18.2–20 s for the end card)
  and `seedance_refs/` 01–11, all text-free: Main, n1 silk + water, n2 brick wall, n3 five spheres, n5
  dandelion, n6 gel drop, s3 cropped to the gel/water/foam strip (x ≥ 440), s4 clean plate (water face),
  s6 cropped to cheek + fingertips (x ≥ 650, clear of "NO TIGHTNESS."), n8 sun + crescent, n7 two sizes on red.
- Product lock: two white pump bottles (600 ml / 200 ml), pumps never pressed, nothing dispensed; gel and foam
  appear only as their own texture shot. Visuals carry no claims; headlines come in the type pass.
