# Product 10 SNOW O₂ CLEANSER: "It fizzes." campaign (30 Sep 2026)

Second most-ordered product still on legacy images (55 September order mentions).

## Story and livery

- Hook: the one cleanser that goes on a **dry** face and bubbles by itself. SNOW BOOSTER (16) already
  ran "Let it snow." in snow and sky blue, so this set avoids snow entirely.
- Livery from the pack's own inks: apricot-peach (Pantone 169) alternating with charcoal slate
  (Pantone 432), burnt-orange tags. Recurring motif: the white micro-bubble foam.
- Slides: 1 It fizzes · 2 A Dubai day, on your skin · 3 Start dry · 4 Watch it rise · 5 8% bubble maker ·
  6 Circles, not scrubbing · 7 Make-up, lifted (SKIN DEFENDER for eyes and lips) · 8 Rinse. Soft, not
  tight · 9 Then the Booster · 10 Dry. Fizz. Rinse. how-to card with the pregnancy / breastfeeding
  precaution · 11 Two sizes · 12 close with spec.
- RU headline "Играет пузырьками.", AR "منظّف فوّار."

## Packs

- 180 ml: the real container PNG (label front sentence matches the registered artwork).
- 500 ml: no photograph of the white bottle exists. Shape taken from the July studio main Vadim
  approved; that render printed an invented sentence, so the registered front block from the 180 ml
  label was multiplied over it (`c10_assets.py`). Worth replacing with a real photo when available.
- Heights from the dielines: 180 ml carton 60×60×148 → bottle 146 mm; SNOW BOOSTER carton
  45.5×45.5×195.5 → 193 mm; 500 ml estimated 200 mm.

## Production

- Workspace `~/Desktop/Insta_Olga/cleanser10/campaign/` (`_scripts/c10_*`). CapCut GPT Image 2.5,
  2k Medium. Picks: main_2, s1_4, s2_4, s3_4, s4_4, s5_2, s6_4, s7_1, s8_4, s9_1, s10_1, s11_2, s12_1.
- s12 came back with the bottles filling the frame; the plate is inset at 66% on its own white
  backdrop (feathered) so the spec column fits.
- 37 progressive JPEGs (1600 px, 135–518 KB) in `public/images/snowo2_campaign/{,ru/,ar/}`.
- Cut-out `public/images/cutout/10-v3.webp` (coverage 0.309).

## CapCut driver fixes (`~/Desktop/Insta_Olga/aws/campaign/_scripts/capcut_ui.py`)

- A restarted CapCut opened windowed and later dropped to a maximized window; the fixed Generate point
  then landed on the timeline and Vadim had to click Generate himself.
- Full screen is now read and set through Accessibility (`AXFullScreen`), not the Quartz window list.
- The prompt field is found through Accessibility; the paste click lands on its text (bottom edge),
  and the pasted prompt is read back before Generate.
- Generate is found on a fresh screenshot every time (the large cyan pill in the lower left) and
  clicked at its centre; if it is not on screen the driver stops instead of clicking blind.

## Site

- `components/product/snowo2/snowo2Copy.ts`: EN rewritten to selling voice (no carton / leftover /
  documents language, no Phytolex undercut, new FAQ on make-up and what comes after).
- `snowo2LocalizedCopy.ts`: RU/AR hero, engine point, actives, FAQ and closing moved off undercuts.
- `SnowO2ProductPage.tsx`: gallery and the three section figures localize per locale; figures are
  s4 / s5 / s10.
- `data/productLocalizedCopyAudit.ts` RU/AR descriptions lead with the campaign line;
  `lib/productQuickFactsCatalog.ts` product 10 facts rewritten EN/RU/AR.
- `lib/localizedProductImages.ts`, `lib/productCutouts.ts`, `lib/products.ts`,
  `lib/routineStepImages.ts`, `components/profile/OrderHistory.tsx`, `lib/blogImageDimensions.server.ts`.
- DB: `npx tsx --env-file=.env.local scripts/update-product-10-campaign-gallery.ts --apply` after the
  deploy (HEAD-checks all 37 files first).

## Checks

- Full Jest 148 suites / 1605 tests pass; `tsc --noEmit` clean; eslint clean on changed files.
