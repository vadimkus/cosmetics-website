# Product 59 — Deep Moisturizing Beauty Box main image (12 Sep 2026)

New studio kit shot (`main_a.jpg`, 2048 px, title + box + five products) -> `public/images/bb_box_deep/Main.jpeg` at 1600 px q86. Old `main.jpeg` (1024 px) removed; case-only rename registered with a two-step `git mv`.

Contents on the shot match the page's five items: Snow O2, Snow Booster, Hyaluron Serum, Hyaluron Cream, Soothing Bomb masks.

Cutout: Vision dropped the black serum and the white box, so `PARTS["59"]` re-traces both crops. Shipped as `cutout/59-v2.webp`. `lib/productCutouts.ts` remapped, cache key v81. Gallery unchanged. DB via `scripts/set-product-59-main-20260912.ts --apply` after deploy.
