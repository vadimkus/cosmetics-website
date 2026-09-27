# Product 40 MULTI SUN CREAM SPF 40 PA++: "YOUR DAILY SHADE." campaign

**Date:** 27 Sep 2026
**Page:** `/products/40` (EN / RU / AR, bespoke `MultiSunProductPage`)

## What shipped

- Main packshot + 12 gallery slides in EN, RU and AR:
  `public/images/multisun_campaign/{main.jpg, s1-s12.jpg, ru/, ar/}` (1600 px, q88, 4:4:4).
- Sky-blue and warm-ivory plates, all native (the renders carry real sky and sunlight
  gradients). Headlines in the tube crimson `#A71932`, body in navy `#1D2B45`.
- Five slides on the page beside their sections: s3 (filters), s2 (reading the label), s4
  (texture), s8 (calm finish), s7 (lab / heat). Gallery and figures swap RU/AR through
  `localizeProductImage`.
- New listing cut-out `public/images/cutout/40-v2.webp`, normalised from the supplied
  transparent tube PNG (Vision tore the lit edge of the white tube on white). Routine step
  thumbnail for `'40'` uses the new main.

## Slides

| # | Plate | Headline | Claim underneath |
|---|---|---|---|
| 1 | sky | YOUR DAILY SHADE. | light daily protection that sits under make-up |
| 2 | ivory | SPF 40 PA++ | UVB and UVA protection every morning |
| 3 | sky | FOUR FILTERS. | 18.50%: three organic filters and titanium dioxide |
| 4 | ivory | UNDER MAKE-UP. | sets quickly, sits smoothly under foundation |
| 5 | sky | LIGHT AS DAYLIGHT. | soft, non-greasy, quick to spread |
| 6 | ivory | CITY. OFFICE. SCHOOL RUN. | the everyday sunscreen |
| 7 | sky | HEAT-TESTED AT 50 °C. | tested stable at 50 °C, made for Gulf summers |
| 8 | ivory | CALM UNDER THE SUN. | centella, scutellaria root, rose and grape callus |
| 9 | sky | FACE. NECK. EVERY MORNING. | last step of skincare, 15 minutes before going out |
| 10 | ivory | TWO FINGERS. | the amount; less cream, less protection |
| 11 | sky | EVERY TWO HOURS. | reapply, and after a swim, sweat or towel |
| 12 | ivory | YOUR DAILY SHADE. + spec card | SPF 40 · PA++ · 40 g, heat-tested, dermatologically tested, Korea |

## Dossier removed

- The batch-assay section ("Every UV filter checked in the finished cream", declared vs
  measured 7.21% / 4.96% / 2.98% / 2.75%) on EN / RU / AR, the RU/AR ingredient cards, key
  features and quick facts.
- The octinoxate section (kept as an FAQ answer pointing to Ultra Shield) and the EU-limit column
  of the filter table ("5.00% against a 5% cap").
- The fragrance section listing each allergen with its percentage (the INCI names them; safety
  and FAQ keep the fragrance note).
- "Filled at 41.07 g", cfu counts, "honestly marked moderate UVA", "the declared concentration
  equals the European limit".
- DB EN: "the only UVA cover is titanium dioxide, which is why this rates… rather than PA++++",
  "Every filter was assayed on the batch", the SCCS endocrine note, "Named because they are in
  the formula; nothing on this page rests on them", "the carton says so", "safe for all skin
  types".
- Fallback: "skin glowing effect", "Mannan", the pentapeptide soothing claim.

## Kept as honest guidance

PA++ is moderate UVA (RU "умеренная", AR "متوسطة"); not water resistant, reapply after
swimming, sweat or towelling; every two hours outdoors; 15 minutes before going out; octinoxate
7.50% with Ultra Shield as the octinoxate-free option; fragrance 0.25% with a patch-test note.

## Tests

`__tests__/data/product40LocalizedCopy.test.ts` and `productLocalizedCopyAudit.test.ts` no longer
require the measured assay values in the page copy; the declared filter percentages, pH 6.71,
0.25%, the allergen names (via the INCI) and the application / reapplication wording stay
required, and the forbidden-claims list is unchanged.

## Arabic typesetting fix

`draw_rtl` now forces Latin runs left to right. raqm guesses a direction per run, and a run with
no letters ("50°") came out as "°50". Patched in the roller and sea algae scripts as well (their
slides had no such run).

## Generation

Cursor's image generator with the supplied tube PNG as reference (1024 px), Lanczos-upscaled to
2560 with a light unsharp mask. Two renders were redone because the small slogan read "GENOSTS".
Working folder `~/Desktop/sun40/campaign/` (`_gen/gi/`, `picks/`, `final/`,
`_scripts/sun_slides.py`, `sun_copy.py`).

## DB

`scripts/update-product-40-campaign-gallery.ts --apply` after the deploy: image, gallery, EN
fields and `descriptionRu/Ar`. It refuses to write until all 37 image URLs return 200.
