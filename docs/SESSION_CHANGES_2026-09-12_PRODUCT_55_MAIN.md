# Product 55 — Problem Skin Care Beauty Box main image (12 Sep 2026)

`bb_problem/Main_n.jpg` (2048 px kit shot with title) -> `public/images/bb_problem/Main.jpeg` at 1600 px q86. Only `Main.jpeg` is committed; the other staging files in `bb_problem/` (source PNGs, `_ai_backup`, per-product mains) stay untracked on disk. Old `beauty_boxes/Problem_skin_box.jpeg` left in place (referenced by other pages? no, but harmless).

Contents on the shot match the five items on the page: Snow O2, Problem Control Toner, Problem Control Serum, Problem Control Cream, Soothing Bomb masks.

Cutout: same layout as product 59, `PARTS["55"]` re-traces the box and black serum. Shipped as `cutout/55-v2.webp`, `lib/productCutouts.ts` remapped, cache key v83. DB via `scripts/set-product-55-main-20260912.ts --apply` after deploy.

## Update, 11:55 — Main-v2 + badge moved off the artwork

`Main_nn.jpg` (shorter title, floor reflections) -> `bb_problem/Main-v2.jpeg` (new filename, `Main.jpeg` removed). Cutout `55-v3.webp`, cache key v84.

"In stock" badge in `components/product/cerabarrier/CeraGallery.tsx` (shared by all 52 bespoke pages) no longer overlays the stage. It renders in its own row above the image, end-aligned (start-aligned in RTL), outlined white pill. Reason: the new packshots carry a headline across the top and slides have their own titles, so any overlay collided with type.
