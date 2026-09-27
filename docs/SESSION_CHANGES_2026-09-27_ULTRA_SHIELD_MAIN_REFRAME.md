# Product 39 ULTRA SHIELD SUN CREAM: main re-framed to match SPF 40

**Date:** 27 Sep 2026
**Page:** `/products/39`, shop grid, routine steps, SEO landing cards, training catalogue

## Why

On the Sun shelf the Ultra Shield tube filled 72% of its card height on a 251 grey, next to
the Multi Sun SPF 40 tube at 88% on pure white. The two read as different sizes.

## What shipped

- `public/images/ultra/main-v4.jpg` (1600 px, q90, 4:4:4). The tube stands at 87.8% of the
  frame, centred and topped exactly as on `multisun_campaign/main.jpg`, on 255 white with a soft
  floor shadow to the lower left.
- `public/images/cutout/39-v4.webp`, normalised from the supplied transparent container PNG
  like 40-v2 (white tube on white tears under Vision). Report entry and `lib/productCutouts.ts`
  regenerated with `scripts/cutout/write-manifest.py`; version map `"39": 4`.
- Every live reference moved from `main-v3.jpeg` to `main-v4.jpg`: `lib/products.ts`,
  `lib/routineStepImages.ts`, `lib/seoLandingPages{,Ru,Ar}.ts`, `app/training/trainingCatalogue.ts`,
  `app/api/mobile/training/route.ts`, `components/profile/{OrderHistory,DownloadsSection}.tsx`.
  `main-v3.jpeg` stays on disk for order history and the blog poster.
- DB: `scripts/set-product-39-main-20260927.ts --apply` after the deploy (checks the main and
  cutout return 200 first).

## Generation

Working folder `~/Desktop/Insta_Olga/ultra/main_resize/`. Reference: the 5000 px transparent
container PNG scaled to the SPF 40 framing on white (`_gen/ref_usc_main.png`), re-shot in the
CapCut desktop app with `_prompts/usc_main.txt`; take 1 picked for its rounded shading and floor
shadow. All print came back right except the embossed crimp code ("711EK"), which was copied back
from the aligned reference ("711EM"). The background was rebuilt: CapCut leaves 1-4 level blotches
that show once 251 is lifted to 255, so the backdrop is a smoothed field clamped to white with the
real floor shadow deepened, and the tube is kept pixel for pixel.

## Tooling

- `capcut_ui.py`: `activate` uses `open -a CapCut` (AppleScript `activate` was refused while
  another app was in use), and clicks now refuse to fire unless CapCut is in front, like keystrokes.
- `print_restore.py`: the regions file can name a separate `fit` area for the alignment.
