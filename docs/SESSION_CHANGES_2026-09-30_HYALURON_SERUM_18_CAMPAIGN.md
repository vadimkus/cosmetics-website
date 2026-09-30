# Product 18 MOISTURE REPLENISHING HYALURON SERUM: "Drink up." campaign (30 Sep 2026)

37 September order mentions; sister of product 29 ("Sealed fresh.", bright sky blue and white).

## Story and livery

- Hook: Dubai AC dries skin all day, and dehydration hits oily skin too (DTS MG deck: a condition,
  not a skin type). The serum is the "fill" step of the hyaluron pair; product 29's cream seals.
- Livery from the pack's own inks: black glass and Pantone 306 cyan on near-black grounds,
  alternating with coconut white. Recurring motif: cyan water-caustic light.
- Slides: 1 Drink up · 2 The AC never sleeps · 3 Oily, still thirsty · 4 2,000 ppm hyaluronic acid ·
  5 Coconut-water serum · 6 Blue by nature (no pigment added) · 7 Pat it in · 8 After one use
  (50.81 → 52.238, 21 women aged 20–59) · 9 Fill, then seal (with the 50 g cream) · 10 Cleanse. Pat.
  Seal. card · 11 30 ml, 12 months after opening · 12 close with spec.
- RU headline "Напоите кожу.", AR "اروي بشرتكِ."

## Packs

- Bottle: the real black dropper cut-out used in the product 29 campaign (from hyalserum1.jpg).
- Carton: Vision cut-out of the Intertek photo `Pics/front_updated22062024.jpg`.
- Heights: carton 44×44×105 mm (dieline) → bottle ~100 mm; cream tube 130 mm.

## Production

- Workspace `~/Desktop/Insta_Olga/hsserum18/campaign/` (`_scripts/c18_*`). CapCut GPT Image 2.5,
  2k Medium. Picks: main_2, s1_4, s2_4, s3_4, s4_4, s5_1, s6_4, s7_4, s8_2, s9_4, s10_2, s11_4, s12_4.
- A generation left in flight by a restarted batch put the driver one generation behind: every step
  fetched the previous step's images. Relabelled by content (all 13 checked), the last plate fetched
  by hand. s12 is inset at 66% on its white backdrop so the spec column fits.
- 37 progressive JPEGs (1600 px, 163–483 KB) in `public/images/hsserum_campaign/{,ru/,ar/}`.
- Cut-out `public/images/cutout/18-v2.webp` (coverage 0.442).

## CapCut driver (`~/Desktop/Insta_Olga/aws/campaign/_scripts/capcut_ui.py`)

- Prompt click goes back to the measured text-line point whenever it sits inside the field: with a
  reference thumbnail the field's reported box reaches below the visible text.
- Upload waits up to 12 s for the reference thumbnail instead of 3 s.
- `c18_batch.sh` pauses while CapCut is not in front and resumes, instead of burning retries.

## Site

- `components/product/hsserum/hsserumCopy.ts`: EN rewritten to selling voice (no carton / leftover /
  deck / documents language, no "not +52%" undercuts); RU/AR headline to the campaign line.
- `HsserumProductPage.tsx`: gallery and the three section figures localize per locale; figures are
  s4 / s10 / s8.
- `lib/productQuickFactsCatalog.ts`: product 18 EN facts rewritten (RU/AR unchanged).
- `data/productLocalizedCopyAudit.ts`: RU/AR descriptions lead with the campaign line.
- `lib/localizedProductImages.ts`, `lib/productCutouts.ts`, `lib/products.ts`, `lib/routineStepImages.ts`,
  `components/profile/OrderHistory.tsx`, `components/profile/DownloadsSection.tsx`.
- DB: `npx tsx --env-file=.env.local scripts/update-product-18-campaign-gallery.ts --apply` after the
  deploy (HEAD-checks all 37 files first).

## Checks

- Full Jest 148 suites / 1605 tests pass; `tsc --noEmit` clean; eslint clean on changed files.

## Live (30 Sep 2026, 13:28)

- Deploy `c04450f3e` served all 37 files; DB updated with `--apply` (image, 12-slide gallery,
  description EN/RU/AR). Revalidated `/products/18`, `/ru/products/18`, `/ar/products/18`,
  `/products`, `/` and tag `products`.
- Web: "Drink up." / "Напоите кожу." / "اروي بشرتكِ."; RU and AR serve all 12 localized slides;
  no `hyaluron_serum` slides left.
- Mobile API: main + 12 slides, 12 localized per locale, description opens with the campaign line.
