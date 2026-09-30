# Product 60 BIO-MESO PDRN EXPERT AMPOULE 60000: "Needless to say." art set (30 Sep 2026)

Brief (Vadim): "let's work hard on this ... concept, minimalist, we need a good idea." Built on the
product 39 system (`.cursor/rules/campaign-slides-conceptual.mdc`). Main image (`6000/main-v2.jpg`) and
the audited descriptions unchanged; the page's two inline figures (`6000/S3`, `S4`) stay.

## Idea

- **NEEDLESS TO SAY.** Spicule delivery: the needle's job without the needle. Every slide one metaphor,
  no people.
- Palette: salmon `#F2A48F` (the PDRN is salmon DNA; also skin) + needle steel `#2B2E33` (the carton's
  silver foil, and the needle it replaces). Steel ink on salmon, salmon on steel; real carton on white
  for the card. Manrope Regular 140 / 64, giant numerals for the measured results.

| # | Visual | EN | RU / AR (audited) |
|---|---|---|---|
| 1 | empty velvet pincushion, pinholes only | NEEDLESS TO SAY. | БЕЗ ЛИШНИХ ИГЛ. / غنيّة عن الإبر. |
| 2 | steel caliper, hair-thin gap | 1.0 MM · NEEDLE DEPTH. NO NEEDLES. | 5,72% · ТОЧНАЯ МЕРА. (Hydrolyzed Sponge 5.72022%) |
| 3 | microscope | LOOK CLOSER. 300,000-360,000 spicules per ml | microscopic spicules in a light white lotion |
| 4 | double helix of salmon pearls | THE SALMON SENDS REGARDS. (PDRN from salmon DNA, 1,120 ppm) | ПРИВЕТ ОТ ЛОСОСЯ. / تحيّات من السلمون. |
| 5 | natural sponge on a steel plinth | NATURE'S NEEDLEWORK. (freshwater sponge) | ИГЛЫ ОТ ПРИРОДЫ. / إبر من الطبيعة. |
| 6 | pearl full moon | ONCE IN A FULL MOON. (one session a month) | ОДНО ПРИМЕНЕНИЕ. ЧЕТЫРЕ НЕДЕЛИ. (measured at 1, 2, 4 weeks) |
| 7 | glass filled past the rim | +52.25% FILLED TO THE BRIM. (moisture, 20 women 48 ± 8) | same figures |
| 8 | ball at the top of its bounce | +19.86% BOUNCE BACK. (elasticity) | same |
| 9 | iron on half-crumpled silk | −7.45% IRONED OUT. (wrinkles) | same |
| 10 | white coat on a steel hanger | DOCTOR'S ORDERS. (professional use) | В РУКАХ СПЕЦИАЛИСТА. / بين يدي المختص. |
| 11 | four pearl moons in a row | FOUR MONTHS IN ONE BOX. | ЧЕТЫРЕ АМПУЛЫ В ОДНОЙ КОРОБКЕ. (one per application) |
| 12 | real carton on white | NEEDLESS TO SAY. + card (3 ML × 4, complex 60,000 ppm, panthenol 1%, 17 peptides, 5 ceramides, professional use) | |

## Claims

- English keeps the brochure claims its page carries (1.0 mm needle equivalent, once a month,
  300,000-360,000 spicules per ml), verified in `SESSION_CHANGES_2026-08-13_PRODUCT_60_SOURCE_AUDIT.md`.
- Russian and Arabic follow the 22 Aug audited copy, which states the product is not a microneedling
  device, must not be equated with needle depth, and that the pack sets no monthly interval. So RU/AR
  slides 2, 3, 6, 10 and 11 carry registration-document facts instead; scanned against every pattern
  in `__tests__/data/product60LocalizedCopy.test.ts`.
- 60,000 ppm only ever as the BIO-MESO™ PDRN complex; PDRN itself 1,120 ppm.
- Clinical figures always with the panel (KC Skin Research Center, 20 women aged 48 ± 8, one
  application, four weeks), two decimals as on the page.

## Production

- Workspace `~/Desktop/Insta_Olga/biomeso60/campaign/` (`_scripts/c60_*`), CapCut keys c1-c12.
  Carton: Vision cut-out of `Intertek/Bio-Meso PDRN .../Pics/Front.jpeg`, re-shot square in CapCut
  (c12_4 has the cleanest "60000" and small word). Picks c1_3, c2_2, c3_4, c4_2, c5_2, c6_2, c7_1,
  c8_2, c9_4, c10_2, c11_2, c12_4.
- AR card drops the ™ (it broke the right-to-left order).
- 36 JPEGs (1600 px, 156-273 KB) in `public/images/biomeso_art/{,ru/,ar/}`.

## Site

- `lib/products.ts` fallback gallery, `lib/localizedProductImages.ts` registry,
  `scripts/update-product-60-campaign-gallery.ts` (gallery only, HEAD-checks all 36 first), gallery
  assertions in `__tests__/data/product60LocalizedCopy.test.ts`.
- Full Jest 148 suites pass; tsc clean.
- Live 18:45: deploy `997c9d701`, DB `--apply` (gallery only), revalidated. Web serves the 12 `biomeso_art` slides with the kept main and the S3/S4 inline figures; mobile API main + 12, 12 localized per RU/AR.
