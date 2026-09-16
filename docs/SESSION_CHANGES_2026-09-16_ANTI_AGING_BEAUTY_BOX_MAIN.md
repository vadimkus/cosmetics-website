# Anti-Aging Beauty Box main — 16 Sep 2026

Product 58 main image replaced with the new studio kit shot Vadim dropped into
`public/images/bbox_age/main2.png` (2560 px, Seedream plate).

- Removed the Seedream `Ai` mark from the top-left corner; original kept
  untracked in `bbox_age/_ai_backup/main2_with_ai_mark.png`.
- Exported `public/images/bbox_age/main-v2.jpg` at 1600 px, q86, progressive
  (212 KB). New filename because `/images/*` ships with a one-year immutable
  cache; overwriting `main.jpg` in place would leave repeat visitors on the old
  shot.
- Contents on the shot match the page: Snow O2, Snow Booster, Multi Functional
  Anti-Wrinkle Cream, Multi Functional Anti-Wrinkle Serum, five Intensive Repair
  Collagen Masks.
- `lib/productCutouts.ts` maps the new path to the existing `cutout/58.webp` so
  the tinted-panel pages keep their cut-out.
- DB `image` repointed with `scripts/set-product-58-main-20260916.ts --apply`
  after the asset deploy went Ready. `images` stayed `null`.
- Old `main.jpg` left in place: historical order items reference it.
- `main2.png` staging file stays untracked on disk.
