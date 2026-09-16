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
