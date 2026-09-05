# Product 7, POWER SOLUTION PCS: September 2026 campaign slides

Date: 2026-09-05. Commit `2069572c`. DB applied after deploy.

## Files

`public/images/pcs_v/`: `Main.jpeg` (1024, hero: closed box + one vial, x10), `S1`–`S8.jpeg`, `Closing.jpeg`.
Sources were `~/Desktop/Insta_Olga/pcs_v/` (`s1`–`s8`, two PNGs of 2–6 MB). All re-encoded to JPEG,
capped at 2000 px and ≤ ~470 KB. Gotcha: macOS is case-insensitive, so `s1.jpeg` → `S1.jpeg` must go
through a temp name or the cleanup deletes the output.

Slide order: S1 open box · S2 the vial for oil · S3 one vial one treatment (2 ml, 10 vials) ·
S4 the shine is the complaint · S5 22.98% comfort base · S6 5-Free · S7 cleanse/open/apply/absorb ·
S8 oil and sebum control · Closing summary card.

## Claims

Every figure on the slides was already verified in `pcsCopy.ts` against Formula_up / COA L0603U
(butylene glycol 12.9935% + glycerin 9.9857% = 22.98%; 5-Free list; 2 ml × 10; dermatologically
tested; made in Korea). Nothing new to check.

## Where it landed

- DB `image` → `/images/pcs_v/Main.jpeg`, `images` → S1–S8 + Closing (`scripts/set-product-7-slides-20260905.ts`).
- `lib/products.ts` static fallback, `data/productConfig.ts` legacy config gallery (config wins over DB, so both).
- `pcsCopy.ts` variant: `boxImage` S1, `vialImage` S2, `blendGallerySlides` {S1, S2}, `heroOnWhite: true`.
- `lib/blogImageDimensions.server.ts` entry for the new Main.
- `lib/productsDb.ts` cache key v67 → v68.
- Old `pcs-hero.jpg`, `PCS.jpg`, `Second/pcs_big*.jpg` stay on disk for order history.

## Cut-out

`public/images/cutout/7-v2.webp`. Vision kept only the box and dropped the vial and the x10 mark, so
`scripts/cutout/build-cutouts.py` gained a `PARTS` hook: extra rects segmented on their own
(`vision` mode re-runs the segmenter on a crop; `keywhite` keeps pixels darker than the paper, for flat
type) and alpha-composited over the main trace. Product 7 uses one of each.

## Verified live

EN/RU/AR `/products/7` reference Main + all nine slides and `cutout/7-v2.webp`; no `pcs_big` or
`pcs-hero` left in the HTML. Mobile app reads the same DB row, no OTA needed.
