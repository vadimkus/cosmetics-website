# Product 28 campaign slides

Date: 27 Aug 2026
Product: 28, INTENSIVE HYDRO SOOTHING CREAM

New campaign set in `public/images/hydro_soothing_o/`, 1254 x 1254 each.

## Order

The delivered filenames did **not** run in narrative order, so each was opened
and matched to its slide rather than trusted:

| File as delivered | Renamed | Slide |
| --- | --- | --- |
| `...57.42.jpeg` | `S1.jpeg` | WHEN SKIN NEEDS CALM. |
| `...57.42 (1).jpeg` | `S2.jpeg` | COOL. CALM. COMFORT. |
| `...57.42 (4).jpeg` | `S3.jpeg` | MOISTURE. COMFORT. DEFENCE. |
| `...57.42 (2).jpeg` | `S4.jpeg` | CALM, BUILT IN. |
| `...57.42 (3).jpeg` | `S5.jpeg` | MOISTURE, HELD CLOSE. |
| `...57.42 (5).jpeg` | `S6.jpeg` | COMFORT, RESTORED. |
| `Closing.jpeg` | unchanged | Commercial close, 50g + 250g |
| `Main.jpeg` | unchanged | Product card hero |

`(2)` is slide 4 and `(4)` is slide 3. Renaming by suffix would have put the
ingredient slide before the benefits slide.

## Claims

Slide 4 names six ingredients. All six check out against
`Ingredient lists_old/GENOSYS INTENSIVE HYDRO SOOTHING CREAM.pdf`:

| On the slide | In the formula |
| --- | --- |
| Aloe Barbadensis Leaf Extract | present, 1.000% |
| Snail Secretion Filtrate | present |
| Hyaluronic Acid | Sodium Hyaluronate |
| Lactobacillus / Pumpkin Ferment Extract | present, 1.000% |
| Beta-Glucan | present |
| Phytolex SC | Phaseolus Radiatus + Betula Platyphylla Japonica Bark + Rumex Crispus Root |

Phytolex SC is a supplier trade name and appears in no INCI list under that
name, which is exactly the case the source-of-truth rule warns about. It
resolves through the three botanical extracts above, all three present.

## What changed

- `product.image` -> `/images/hydro_soothing_o/Main.jpeg`
- `product.images` -> S1 to S6 plus Closing, seven gallery slides
- Six static references repointed off `/images/HSC.jpg`: `products.ts`,
  `routineStepImages.ts`, the three `seoLandingPages*.ts`, and the cut-out
  manifest
- Cut-out rebuilt as `28-v2.webp`. A new number because `/images/*` is served
  immutable for a year, so replacing the file in place would leave every repeat
  visitor on the old one

The old files stay on disk. `/images/HSC.jpg` is referenced by historic order
emails, and `repair-dead-order-item-images.ts` reports 0 unresolved rows across
2,028 order items, which is only true while the file exists.

## A trap in the cut-out builder, now closed

`build-cutouts.py` reads the catalogue from `/tmp/imgs.json`, an export that has
to be made by hand first. The first rebuild here ran against the previous day's
copy, traced the **old** packshot, wrote a file byte-identical to the one it was
replacing, and printed `built 66 of 66`. Nothing in the output was wrong; it was
simply answering a question about yesterday.

It now refuses an export older than an hour, prints the command to refresh it,
and prints the source path for every product it builds.
