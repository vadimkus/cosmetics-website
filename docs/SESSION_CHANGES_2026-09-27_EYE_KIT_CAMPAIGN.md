# Product 50 EyeCell EYE ZONE CARE KIT: "RESTED EYES." campaign

**Date:** 27 Sep 2026
**Page:** `/products/50` (EN / RU / AR, bespoke `EyeKitProductPage`)

## What shipped

- Main packshot + 12 gallery slides in EN, RU and AR:
  `public/images/eyekit_campaign/{main.jpg, s1-s12.jpg, ru/, ar/}` (1600 px, q88, 4:4:4).
- Two plate families, all native: charcoal `#161618` with pearl headlines, soft-grey body and a
  bright crimson accent, and pearl-rose with the kit's crimson `#C22236` headlines and charcoal
  body.
- Page: gallery is now main + the 12 localized slides (the member packshots stay in the
  contents list). New "concern" split with s2, s3 beside the four steps, new eye-roller split
  with s6, and s4 / s8 / s5 on top of the serum, patch and roller cards.
- New listing cut-out `public/images/cutout/50-v2.webp` (the whole group, traced cleanly).
- Fallback record in `lib/products.ts` points at the campaign main and slides.

## Slides

| # | Plate | Headline | Claim underneath |
|---|---|---|---|
| 1 | charcoal | RESTED EYES. | serum, eye roller, gel patches and cream: one routine |
| 2 | pearl | DARK CIRCLES. EYE BAGS. CROW'S FEET. | brighter, smoother, well-rested skin around the eyes |
| 3 | charcoal | FOUR STEPS. | 1 cleanse · 2 serum + roller · 3 gel patches · 4 cream |
| 4 | rose | SERUM FIRST. | arbutin 2% brightens, adenosine 0.04% smooths, fine metal tip |
| 5 | charcoal | 0.25 MM. | 60 fine needles, made for the eye zone, only in this kit |
| 6 | rose | GENTLE ROLLS. | over the serum, horizontally and vertically, a few minutes |
| 7 | charcoal | 20-40 MINUTES. | cooling hydrogel, niacinamide 2% + adenosine 0.04% |
| 8 | pearl | 60 PATCHES. | under the eyes or on the brow bones, pat the essence in |
| 9 | charcoal | SEAL WITH CREAM. | arbutin 2% + adenosine 0.04% with squalane and jojoba oil |
| 10 | rose | YOURS ALONE. | soak the roller 5 minutes in chlorhexidine before reuse |
| 11 | charcoal | ONE BOX. | three products cost less than separately, roller only here |
| 12 | rose | RESTED EYES. + spec card | sizes, actives, dermatologically tested, Korea |

Every slide claim traces to the registered kit artwork (`[GENOSYS]EYECELL KIT.pdf`: order of
use, horizontal / vertical rolling for a few minutes, patches 20-40 min, the 5-minute
chlorhexidine soak, crow's feet / eye bags / dark circles) or the component formulas
(squalane 2.5% and jojoba 2% in the cream).

## Label repair on the renders

The image generator garbles small print. `_scripts/eye_label_fix.py` wipes the generated label
on every serum and cream bottle (column interpolation, so each bottle keeps its own shading) and
sets the real label mask from the supplied container photos at the bottle's scale. It also
removes an invented "EyeCell" print from the roller handles: the real eye roller is plain white.

## Dossier removed

- EN bespoke: "registered Korean kit with its own barcode, not a box assembled here", "The
  carton writes the order", "The kit has no trial of its own", "That is the carton sentence",
  "Is this a peptide kit? Does it replace Botox?", "The facts that belong on a card", "On the
  carton", the beauty-box FAQ, the English-panel vs patch 20-minute footnote.
- Outdated "450-needle face roller" references (product 1 is now a single-use roller in five
  lengths) on EN / RU / AR, central RU/AR key features and quick facts.
- Central RU/AR: "предупреждение на коробке", "коробка не устанавливает универсальную
  частоту", "Коробка требует особой осторожности", and the AR equivalents. Frequency now reads
  "подбирается индивидуально" / "بشكل فردي".
- Quick facts: "Registered Korean kit / Own carton, own barcode".
- DB EN: "Registered four-piece", "Carton sequence", "Peptides sit at cosmetic trace", "The kit
  carton says avoid".

## Kept as honest guidance

Pregnancy and breastfeeding (avoid), peanut oil in the cream, retinyl palmitate, orange peel
oil / limonene and fragrance (not fragrance-free), no roller with a keloid tendency,
stainless-steel allergy, dermatitis or broken skin, keep away from the eye, 20-40 minutes then
remove, roller for personal use only.

## Tests

`__tests__/data/product50LocalizedCopy.test.ts`: the frequency requirement moved to the selling
phrase, and a new case keeps carton / dossier voice and the "450-needle" references off every
product 50 surface (EN bespoke included).

## Generation

Cursor's image generator with the supplied serum, cream, patch, roller and box packshots as
references (1024 px), Lanczos-upscaled to 2560 with a light unsharp mask. Slide 2 was redone
(the backdrop cut into the face), slide 5 (needles too long), slide 8 (patches must be clear,
as on the patch page) and slide 12 (the kit crowded the close card). Working folder
`~/Desktop/Eye_kit/campaign/` (`_gen/gi/`, `picks/` with `picks/_orig/` before the label fix,
`final/`, `_scripts/eye_slides.py`, `eye_copy.py`, `eye_label_fix.py`).

## DB

`scripts/update-product-50-campaign-gallery.ts --apply` after the deploy: image, gallery, EN
fields and `descriptionRu/Ar`. It refuses to write until all 37 image URLs return 200.
