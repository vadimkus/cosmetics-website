# Product 36 SOOTHING BOMB SEA ALGAE MASK: "CALM ON CONTACT." campaign

**Date:** 27 Sep 2026
**Page:** `/products/36` (EN / RU / AR, bespoke `SeaAlgaeProductPage`)

## What shipped

- Main packshot + 12 gallery slides in EN, RU and AR:
  `public/images/seaalgae_campaign/{main.jpg, s1-s12.jpg, ru/, ar/}` (1600 px, q88, 4:4:4).
- Pale mint `#E4F1EB` plates (pulled) with deep green `#0F4D3A` type and `#1E7A5C` accents;
  native deep green plates with white type and `#A8E0C8` numerals.
- Five slides on the page beside their sections: s5 (sheet), s8 (formula), s3 (sea algae),
  s10 (colour), s11 (when to use). Gallery and figures swap RU/AR through
  `localizeProductImage`.
- New listing cut-out `public/images/cutout/36-v2.webp`; routine step thumbnail for `'36'`.
- The actives cards now read the RU/AR ingredients from `data/product36LocalizedCopy.ts`
  (`withFullInciFallback`, as on the AFS and Bio-Ferment pages); they had shown the English DB
  entries on every locale.

## Slides

| # | Plate | Headline | Claim underneath |
|---|---|---|---|
| 1 | mint | CALM ON CONTACT. | one sheet, 25 g of essence, twenty minutes |
| 2 | green | SOOTHING. COOLING. MOISTURISING. | everything the name promises |
| 3 | mint | SEA ALGAE + CENTELLA. | red and brown sea algae with centella asiatica |
| 4 | green | 25 G OF ESSENCE. | soaked through, still dripping |
| 5 | mint | EUCALYPTUS SHEET. | Eucalace® fibres, finer and denser, hold and give more |
| 6 | green | IT BREATHES. | air moves through the spunlace |
| 7 | mint | 15-20 MINUTES. | lift, pat the rest in, no rinse |
| 8 | green | 5% GLYCERIN. | with methylpropanediol 10% and betaine |
| 9 | mint | ALLANTOIN + PANTHENOL. | two classic calmers, 0.1% each |
| 10 | green | GREEN BY NATURE. | gardenia fruit extract, no artificial pigment |
| 11 | mint | AFTER SUN. AFTER FLIGHTS. AFTER LONG DAYS. | the evenings skin has had enough |
| 12 | mint | CALM ON CONTACT. + spec card | Eucalace®, sea algae · centella, dermatologically tested, Korea |

## Pack

Two pouch designs were in `~/Desktop/green`. The campaign shows the one on the registered
artwork (`Registration DOC/Artwork/[GENOSYS]SOOTHING BOMB SEA ALGAE MASK.pdf`): sentence-case
"SAM provides intensive relief…" line and a DERMATOLOGICALLY TESTED badge. The older design
(uppercase line, no badge) is the one in `Intertek/Soothing Bomb Sea Mask/Front.jpg`.

## Dossier removed

- The "It is in there. It is not what is working." section on the sea algae (ppm doses, "we
  would rather repeat them") -> "From the sea": the two algae and centella named plainly.
- FAQ "Is the sea algae doing anything at 10 ppm? Honestly, no" -> "What does it feel like?".
- "No efficacy trial exists for this mask…" lab disclaimer; "What the batch sheet says" -> "Clean,
  tested, Korean"; "straight off the manufacturer's quantitative formula"; "the pouch says so,
  and it is worth taking seriously"; "a comfort mask, not a treatment"; "a sheet mask is a
  top-up rather than a routine".
- DB EN: "real ingredients, but the humectants are what do the work", "Named because they are
  in the formula, with no effect attached", "2-3 times per week", "safe for all skin types".
- Central RU/AR: "algae at exactly 10 ppm", "in trace concentrations".
- Fallback: "healing power of the ocean", "25g x 10ea", "Efficacy test on skin hydration".
- EN quick facts rewritten to match RU/AR (the EN set still carried "sheet occlusion helps
  drive soothing essence…" and "ideal after… device treatments").

## Claims added

- **Dermatologically tested**: printed on the registered pouch artwork. The 17 Aug audit had
  banned it because neither face of the older pouch carried it; the RU/AR test list no longer
  forbids it (`__tests__/data/productLocalizedCopyAudit.test.ts`).
- Soothing / cooling / moisturising: the benefits line in the DTS MG training manual and deck.

## Data fix

Full INCI in the DB read "Polyglutamic Acid" where the registered artwork prints
"Polyglyceryl-10 Myristate". Fixed, and the RU/AR INCI moved to the pouch order
(`PRODUCT_36_FULL_INCI` in `data/product36LocalizedCopy.ts`) so "in the same order as the pouch
in your hand" is true in all three languages.

## Generation

Cursor's image generator with the registered pouch PNG as reference (1024 px), Lanczos-upscaled
to 2560 with a light unsharp mask for typesetting. Working folder `~/Desktop/green/campaign/`
(`_gen/gi/`, `picks/`, `final/`, `_scripts/green_slides.py`, `green_copy.py`). The Arabic run
splitter now keeps `®` with its word, so "Eucalace®" is one left-to-right run.

## DB

`scripts/update-product-36-campaign-gallery.ts --apply` after the deploy: image, gallery, EN
fields, `descriptionRu/Ar`, Full INCI. It refuses to write until all 37 image URLs return 200.
