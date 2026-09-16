# Bio Meso PDRN Ampoule 60000 main — 16 Sep 2026

Product 60 main replaced with the new render Vadim dropped into
`public/images/6000/main2.png` (2560 px, Seedream plate). Same box-and-four-
syringes layout as the July shot, on a flat white field instead of the glossy
floor.

- Removed the Seedream `Ai` mark top-left; original kept untracked in
  `6000/_ai_backup/main2_with_ai_mark.png`.
- Exported `public/images/6000/main-v2.jpg` at 1600 px, q86 (137 KB). New
  filename because `/images/*` is cached immutable for a year.
- Cut-out rebuilt as `cutout/60-v2.webp` (REVISION 60 -> 2). Vision kept the
  box and dropped the white syringes, so a `vision` PARTS crop
  (x 0.465-0.905, y 0.27-0.885) re-traces them. Manifest regenerated.
- DB `image` repointed with `scripts/set-product-60-main-20260916.ts --apply`
  after the asset deploy went Ready. Gallery `S1-S6` unchanged.
- Old `main.jpg` left in place for historical order items.
- Flagged to Vadim: the render's syringe labels read "PDRN EXTERT AMPOULE
  006080" (real product: "EXPERT ... 60000"). Illegible at page size.

## Gallery re-rendered on the main canvas

The six slides were 1200x896 with skin-tone, beige and clinic backgrounds and
baked-in type; against the flat-white 1600 px main they read as a different
product. Re-rendered as `6000/S1-v2.jpeg` to `S6-v2.jpeg` (1600x1600, white
251 field, Didot headlines echoing the carton serif, Avenir Next body,
GENOSYS logo, `cutout/60-v2` as the product, old photography kept as rounded
insets) by `scripts/render-bio-meso-slides-20260916.py`. Copy carried over
verbatim; em dashes replaced per house style. Order unchanged: hero, product,
in-clinic application, how it works, clinical numbers, next step.

DB `images` repointed with `scripts/set-product-60-slides-20260916.ts --apply`
after the deploy. Old `S1-S6.jpeg` stay on disk.

### Rolled back (21:33)

Vadim asked for the original S1-S6 back. DB `images` restored to
`6000/S1.jpeg`..`S6.jpeg`; `BioMesoExpertProductPage` inline figures and the
4:3 frame reverted (`5a600fc1c`). The `S*-v2.jpeg` renders and the renderer
script stay in the repo, unused. Main stays `main-v2.jpg`.
