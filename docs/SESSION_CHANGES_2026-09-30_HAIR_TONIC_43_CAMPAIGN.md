# Product 43 HR³ MATRIX HAIR TONIC α: "Keep a cool head." campaign (30 Sep 2026)

Taken instead of product 12, which already carries the 12-slide set Vadim locked on 18 Sep.

## Framing (unchanged from 17 Aug)

- Scalp tonic, function "scalp nourishing, hair conditioning". No hair-loss, regrowth, density or
  shedding claim, no 5α-reductase, no Korean functional designation, no caffeine / copper-peptide
  mechanism. Source audit: `SESSION_CHANGES_2026-08-17_HR3_MATRIX_LINE_SOURCE_AUDIT.md`.
- The salicylate precaution list (salicylate sensitivity, diabetes, circulatory disorders, renal
  impairment, infected or reddened scalp, menstruation, pregnancy, under-3s) has its own slide (11).

## Story and livery

- Hook: Dubai summer heat, sweat, caps and helmets; the menthol chill answers it.
- Livery from the pack: the carton's black and the bottle's amber, with ice-mint accents; slate-black
  grounds alternate with pale mint-grey. Recurring motif: a fine cool spray mist.
- Slides: 1 Keep a cool head · 2 48°C. Scalp included · 3 Spray. Feel the chill · 4 0.3% menthol (+
  menthyl lactate and a second cooling agent) · 5 A cleaner scalp (salicylic acid 0.25%) · 6 Softer
  hair (panthenol 0.2%) · 7 Massage in circles · 8 Don't rinse (3-4 h+) · 9 Tested in every batch ·
  10 Spray. Massage. Leave. card (3 months after opening) · 11 Check first · 12 close with spec.
- RU headline "Холодная голова.", AR "حافظي على برودة رأسكِ."

## Pack

- Bottle: Vision cut-out of the August studio main (`hair_tonic/main.jpeg`); its label matches the
  registered artwork (`Registration DOC/Artwork/[GENOSYS]HR3 MATRIX HAIR TONIC α.pdf`, page 2).
  ~150 mm with the nozzle (carton front ~38 × 157 mm from the dieline).
- No carton on any plate: the only carton photo (`Intertek/pics/Hair_tonic_Genosys.PNG`) is the
  superseded "HAIR TONIC" print carrying the 5α-reductase claim.

## Production

- Workspace `~/Desktop/Insta_Olga/tonic43/campaign/` (`_scripts/c43_*`). CapCut GPT Image 2.5, 2k
  Medium, one batch, no lag offset. Picks: main_2, s1_4, s2_4, s3_4, s4_1, s5_4, s6_1, s7_4, s8_1,
  s9_1, s10_2, s11_4, s12_1.
- s7 runs its headline as one band across the top (the raised arms fill the left); AR s7 anchors at
  x 1300 so it clears the head. AR s2 drops the period after "48°C" (bidi).
- 37 progressive JPEGs (1600 px, 123-500 KB) in `public/images/tonic_campaign/{,ru/,ar/}`.
- Cut-out `public/images/cutout/43-v2.webp` (coverage 0.148).

## Site

- `components/product/hr3/hairTonicCopy.ts`: EN rewritten to selling voice. Dossier words gone
  (assayed, certificate, declared, released against), the three batch results kept as "tested in
  every batch", undercuts removed ("botanicals that do not", "we would rather lose the sale"). The
  caffeine note became a cross-sell to the MEDI Scalp Shampoo (caffeine 1%). Safety list intact.
- `hairTonicLocalizedCopy.ts`: RU/AR headline to the campaign line; certificate / "заявленных" /
  "المعلنة" wording replaced with batch-tested phrasing.
- `HairTonicProductPage.tsx`: gallery localizes per locale.
- `lib/productQuickFactsCatalog.ts`: product 43 EN facts replaced. They were live with
  "Copper Tripeptide-1 stimulates dermal papilla cells and helps inhibit 5α-reductase pathways",
  "Anagen-support actives" and "thinning-concern scalp routines". RU/AR unchanged.
- `data/product43LocalizedCopy.ts`: RU/AR descriptions lead with the campaign line.
- `lib/products.ts`: fallback description no longer says "improves the conditions of hair loss" /
  "KFDA approved"; image and 12-slide gallery point at `tonic_campaign`.
- `lib/localizedProductImages.ts`, `lib/productCutouts.ts`, `lib/routineStepImages.ts`,
  `components/profile/OrderHistory.tsx`, `components/profile/DownloadsSection.tsx`,
  `app/training/trainingCatalogue.ts`, `app/api/mobile/training/route.ts`.
- DB: `npx tsx --env-file=.env.local scripts/update-product-43-campaign-gallery.ts --apply` after the
  deploy (HEAD-checks all 37 files first).

## Open

- Product 45's EN quick facts still carry "Serenoa extract targets common scalp concerns linked to
  thinning" (same framing issue, not touched here).

## Checks

- Full Jest 148 suites / 1605 tests pass; `tsc --noEmit` clean; eslint clean on changed files.
