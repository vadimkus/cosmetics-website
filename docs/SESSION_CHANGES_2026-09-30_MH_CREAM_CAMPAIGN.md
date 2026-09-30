# Product 29 MOISTURE REPLENISHING HYALURON CREAM — "Sealed fresh." campaign (30 Sep 2026)

Brief (Vadim): run a new campaign for https://genosys.ae/products/29, creative, a good selling
story, packshots in `~/Desktop/moisture`, EN / RU / AR, no dossier, push to main when ready.

## Idea

- **SEALED FRESH.** Dubai air takes water from skin all day. The cream puts water back
  (glycerin 9%, PENTAVITIN) and puts a lid on it (1,000.9 ppm high-weight hyaluronic acid).
  Hook: a grape beside a raisin, the same fruit with the water gone.
- **Recurring metaphor:** the glass cloche (the cream on slide 1, a rose kept fresh on the 72-hour
  slide), a waxy leaf holding water drops, a syrupy glycerin drop.
- **Sizes:** 50 g as carry-on on an airplane tray table (cabin air is dry), 250 g for the shelf or
  the clinic. Pairing with product 18 Hyaluron Serum: "Serum fills, cream seals."
- **Livery:** deep navy and pale sky blue alternating, white for the close. Navy ink on sky,
  white type and cyan tags on navy.

## Slides

| # | Plate | EN | RU | AR |
|---|---|---|---|---|
| Main | 50 g + 250 g on white with water drops | (no type) | | |
| 01 | 50 g tube under a glass cloche, navy | SEALED FRESH. | СВЕЖЕСТЬ ПОД ЗАМКОМ. | نضارة محفوظة. |
| 02 | dewy green grape + golden raisin, sky | GRAPE OR RAISIN? | ВИНОГРАД ИЛИ ИЗЮМ? | عنب أم زبيب؟ |
| 03 | water drop on navy satin | +82% HYDRATION AFTER ONE USE. | +82% УВЛАЖНЕНИЯ ПОСЛЕ ОДНОГО НАНЕСЕНИЯ. | +82% ترطيب بعد استخدام واحد. |
| 04 | white rose under a cloche, sky | 72 HOURS LATER. | 72 ЧАСА СПУСТЯ. | بعد 72 ساعة. |
| 05 | waxy leaf with water drops, navy | 1,000.9 PPM. | 1 000,9 PPM. | 1,000.9 ppm. |
| 06 | glycerin drop from a glass rod, sky | 9% GLYCERIN. | 9% ГЛИЦЕРИНА. | 9% غليسرين. |
| 07 | 50 g tube + cream swirl, top down, sky | FRESH TO THE TOUCH. | СВЕЖЕСТЬ НА КОЖЕ. | انتعاش عند اللمس. |
| 08 | Hyaluron Serum + 50 g on wet navy glass | FILL. THEN SEAL. | НАПОЛНИТЬ. ЗАПЕЧАТАТЬ. | املئي. ثم احبسي. |
| 09 | 50 g on an airplane tray table, sunrise window | CARRY-ON SIZE. | В РУЧНУЮ КЛАДЬ. | يرافقك في الطائرة. |
| 10 | woman massaging cream into cheek, sky | MORNING. NIGHT. | УТРОМ. ВЕЧЕРОМ. | صباحاً. مساءً. |
| 11 | 50 g + 250 g on wet navy glass | 50 G. 250 G. | 50 Г. 250 Г. | 50 غ. 250 غ. |
| 12 | pair on white + spec card | SEALED FRESH. | СВЕЖЕСТЬ ПОД ЗАМКОМ. | نضارة محفوظة. |

## Production

- All plates in CapCut, GPT Image 2.5, 2k Medium 1:1. Pack plates are re-shoots of
  scale-accurate references built from the real container PNGs (50 g at 130 mm, 250 g at 200 mm).
  The cabin plate (s9) was shot empty first, then the tube placed on the tray and re-shot.
- s2 re-rolled: the first raisin came out grape-sized and read as a date. Now a small golden raisin.
- Print check at full resolution on every pack take. CapCut rewrote the small claim line on the
  texture shot (s7, "intensive hydration"), the cabin shot (s9, invented barrier and elasticity
  lines) and the close (s12, "moisture hydration" / "long-lasting hydration") across all takes
  and re-rolls. Those three got the label restored from the reference
  (`_scripts/mh_restore.py` on top of `print_restore.py`: per-tube alignment, only the ink is
  swapped, the take keeps its own paper and light). s7 is now shot straight rather than angled.
- s12 plate scaled to 80% on its own 251-grey studio white so the spec card clears the 250 g cap.
- Type: s9 sits on the tray (the upper left is the seat). RU s1 headline set in three lines.
  AR s4 column stops short of the cloche.
- 37 progressive JPEGs (1600 px, 157–510 KB) in `public/images/mhcream_campaign/{,ru/,ar/}`.

## Copy (selling voice, all three languages)

- `components/product/mhcream/mhcreamCopy.ts` rewritten EN / RU / AR; central RU/AR in
  `data/productLocalizedCopyAudit.ts`; six quick facts in `lib/productQuickFactsCatalog.ts`;
  `pc29*` cross-sell strings in `messages/en.json` (the unsupported aquaporin line is gone);
  DB description EN/RU/AR and ingredient notes.
- Kept: 1,000.9 ppm high-weight hyaluronic acid, Hyaluronan 11 Multi-Complex, glycerin 9%,
  PENTAVITIN 0.615%, five mushrooms, geranium flower oil with citronellol and geraniol, pH 6.00
  inside the 6.0 ± 1.0 specification, three years unopened, +82% hydration straight after one use
  and still higher at 72 hours (21 women, 20–59).
- Left out: mushroom antioxidant or anti-inflammatory action, aquaporin, wrinkles or elasticity,
  "all skin types", pregnancy safety, "fragrance-free", lot codes, dossier wording.
- Arabic uses أمتعة المقصورة / للسفر, never حقيبة (guarded by `__tests__/lib/bagWording.test.ts`).

## Code

- `MhcreamProductPage.tsx`: section art and gallery localized with `localizeProductImage`;
  routine fixed from `PRODUCT_ROUTINES['19']` to `'29'`.
- `lib/localizedProductImages.ts` registers `/images/mhcream_campaign`.
- Product 29 image references moved to `/images/mhcream_campaign/main.jpg` in `lib/products.ts`,
  `lib/routineStepImages.ts`, `components/profile/DownloadsSection.tsx`,
  `app/training/trainingCatalogue.ts`, `app/api/mobile/training/route.ts`.
- Cut-out `public/images/cutout/29-v2.webp` (both tubes at true scale), `lib/productCutouts.ts`,
  `scripts/cutout/build-cutouts.py`.
- New test `__tests__/data/product29Copy.test.ts`.
- `scripts/update-product-29-campaign-gallery.ts` (HEAD-checks all 38 assets before writing).

## Ship

- `npx tsc --noEmit` clean; `npx jest` 1,604 passed, 3 skipped.
- Commit `13834b6` pushed to main; images 200 after the Vercel deploy.
- DB applied: image `/images/hyaluron/main.jpeg` → `/images/mhcream_campaign/main.jpg`, gallery
  6 old slides → 12 campaign slides, description EN/RU/AR, ingredients.
- Revalidated `/products/29`, `/ru/products/29`, `/ar/products/29`, `/products`, `/`, tag `products`.
- Live: EN page "Sealed fresh" with 12 slides; RU and AR pages serve 12 localized slides each;
  mobile API returns main + 12 and the new description.

## Files outside the repo

- `~/Desktop/moisture/campaign/`: `_scripts/` (refs, prompts, batch, restore, slides, copy,
  export), `_gen/` (references and all takes), `picks/`, `final/{,ru,ar}` with contact sheets.
