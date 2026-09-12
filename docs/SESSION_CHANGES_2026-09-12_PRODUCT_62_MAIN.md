# Product 62 — Sensitive Skin Beauty Box main image (12 Sep 2026)

`bb_box_sensitive/main_a.png` (2048 px kit shot with title) -> `Main-v2.jpeg` at 1600 px q86. Faint "Ai" generator mark in the top-left corner painted out first. Old `main.jpeg` removed.

Six items on the shot match the page: Snow O2, Snow Booster, All For Sensitive Serum, Skin Barrier Protecting Cream, Skin Rescue Overnight Cream Mask, Soothing Bomb masks.

Cutout: Vision dropped the white box on every crop (box ~230 grey on a ~253 sweep). Added a `keypaper` part mode to `build-cutouts.py` that keys on that narrow tonal gap; serum re-traced with `vision`. Shipped `cutout/62-v2.webp`, cutout map remapped, cache key v85. DB via `scripts/set-product-62-main-20260912.ts --apply` after deploy.
