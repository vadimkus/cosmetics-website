# Skin quiz tile images reshot (28 Nov 2026)

Vadim: "reshoot these images in capcut, make them look better and nice and upload, use gpt 2.5 model."
Page: `https://genosys.ae/skin-recommendation`, step 1 "What's your skin type?" (five tiles: Dry, Oily, Combination, Normal, Sensitive).

## What changed

| Area | Before | After |
|---|---|---|
| Artwork | five pale procedural macros, 960 x 720, 9-26 KB (Aug 2026) | five photographed macros, 21:9, 1600 x 680 WebP, 35-80 KB, made with GPT Image 2.5 in CapCut (`2k · Medium · 21:9`) |
| Files | `public/images/skin-types/{dry,oily,combination,normal,sensitive}.webp` | `public/images/skin-types/{dry,oily,combination,normal,sensitive}-v2.webp` (v1 files left in place: `/images/*` is immutable for a year) |
| Wiring | `lib/skinTypeVisuals.ts` | same file, five paths point at `-v2` (the only place the paths live) |
| Strength | `.skinrec-option__image` opacity 0.62, hover 0.78, selected 0.4 | 0.82, hover 0.94, selected 0.5 in `app/skin-recommendation/skin-recommendation.css` |

Not touched: tile layout, wash gradient, labels, descriptions, icons, RTL mirroring, quiz logic.

Commit: `69cd82319` on `main` (7 files).

## The five pictures

| Tile | Subject | CapCut take |
|---|---|---|
| Dry | wind-rippled champagne sand with glints on the ridges | Q1_dry_2 |
| Oily | golden oil droplets and spheres on champagne glass | Q2_oily_3 |
| Combination | matte sage plaster meeting dewy droplet-covered glass | Q3_combination_4 |
| Normal | champagne-ivory satin ribbon in balanced S-folds | Q4_normal_1 |
| Sensitive | one backlit white-blush feather on blush ivory | Q5_sensitive_1 |

All prompts ask for: photoreal 21:9 macro (Hasselblad, 100 mm / 85 mm for silk), subject in the right 45 % of the frame and vertically centred, left half empty blurred ivory-cream copy space, no text, people, hands or packaging.
Why that composition: a white wash covers the left ~60 % of every tile (0.97 to 0.72 white), and the label plus two lines of copy sit over it.

## How it was judged

1. Every take viewed at full size (physics, material realism, no stray text or objects, copy space).
2. `preview_cards.py` mock of the real tile at 0.62 / 0.80 / 0.90 against the August set.
3. Real-page test: opened the live page in the browser, swapped the five `<img>` sources for the new files and the CSS opacity, then checked desktop (306 x 146 tiles), phone (324 x 124 tiles) and the selected state before committing.
4. Oily take 1 had droplets running under the end of the first text line; take 3 keeps them in the right third.

Credits: 5 CapCut runs x 16 = 80 (Q1 was run twice because the first prompt paste failed before generating, no credits lost on the failure).

## Where the work lives

`~/Desktop/GENOSYS/03_PRODUCTS_TRAINING/Images/SKIN_QUIZ_CARDS_2026-11/` (README, `01_FINAL/` five files, prompts, all takes, `run_batch.sh`, `preview_cards.py`, boards, archive of the v1 files).

## Roll back

Point the five `image` paths in `lib/skinTypeVisuals.ts` back to the v1 filenames and restore the three opacity values (0.62 / 0.78 / 0.4).
