# Product 21 — Multi Vita Radiance Serum campaign slides (9 Sep 2026)

Source: `public/images/radiance_serum_oo/` (Olga Artjomova, INSTRUCTIONS.txt, two emails 15:02 / 15:09 GST). Folder left untracked; source PNGs are 33 MB.

## Sequence shipped (her chain, unchanged)

| Slot | File | Slide |
|---|---|---|
| Main | `Main.jpeg` (kept, updated 8 Sep) | HERO, no text |
| S1 | `01_DARK_SPOTS` | DARK SPOTS. CONSIDER THIS YOUR NOTICE. -28.0% surface melanin, 6.190 -> 4.457 |
| S2 | `02_KNIFE_NIACINAMIDE` | 2.00% niacinamide |
| S3 | `03_VITA_12` | Vita 12 complex ladder |
| S4 | `04_MELAZERO` | MELAZERO, loquat 0.04%, spearmint 0.01% |
| S5 | `05_PH_FORMULA` | pH 5.94, spec 6.1 +/- 0.5 |
| S6 | `06_TOLERANCE` | 100% panel, 21 women 20-59 |
| S7 | `07_RITUAL` | 2-3 drops, pat, AM + PM, SPF |
| S8 | `08_FINAL_LIGHT_LOOKS_GOOD_ON_YOU` | payoff + commerce |

Excluded: `extra_KEEP_THE_GLOW.png` (941x1672 stories format, not in her chain), `00a_HERO` / `Main3` (same packshot as the current Main).

Every figure on the slides matches the verified block in `components/product/mvserum/mvserumCopy.ts` (COA pH, DTS MG deck trial and panel, artwork ppm).

## Code

- `public/images/radiance_serum/S1..S8.jpeg`, 1254 px, JPEG q86. Old `s1..s5.jpeg` removed; case-only rename registered with a two-step `git mv` so Vercel serves the uppercase names.
- `data/productConfig.ts` gallery -> S1..S8 (config wins over DB, so both were updated).
- `components/product/mvserum/MvserumProductPage.tsx` section art: effects S1, engine S3, how-to S7, proof S6.
- `lib/productsDb.ts` cache key v74.
- `scripts/set-product-21-slides-20260909.ts --apply` after deploy: DB `images` -> S1..S8.

Mobile app reads the same DB/config via API; no OTA needed.

## Open item from Olga

FINAL slide: redraw the small bottle (original shape, logo on the silver collar, label sharp at 10x). Not done in this pass; slide shipped as delivered.

## Update 17:15 — FINAL slide bottle redraw (done)

Replaced the generated small bottle on the FINAL slide with the studio packshot cutout (`cutout/21-v2.webp`), same footprint (base y=1145, centre x=1032), contact shadow and faded reflection added, old bottle and reflection erased from the floor gradient by row interpolation. Copy on the slide untouched. Shipped as `S8b.jpeg` (new name, immutable cache); `S8.jpeg` removed. Cache key v75. Fixed PNG kept beside the source as `radiance_serum_oo/08_FINAL_..._fixed_bottle.png` (untracked) for Olga.
