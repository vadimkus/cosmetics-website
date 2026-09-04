# 2026-09-04 - Product 10 SNOW O₂ CLEANSER: September campaign slides

## What changed

New set supplied as `public/images/cleanser_o/` (1254 x 1254 JPEG, 64-200 KB each).
Renamed from the export names (`ss1`, `s2`..`s7`) to the house pattern:

| File | Slide |
|---|---|
| `Main.jpeg` | Hero packshot, both bottles on white (new render, replaces `cleanser/main_clean.jpeg`) |
| `S1.jpeg` | START CLEAN. FEEL THE DIFFERENCE. |
| `S2.jpeg` | MAKE-UP. DIRT. IMPURITIES. OFF. |
| `S3.jpeg` | 9.94% HUMECTANT SYSTEM (4.1% butylene glycol, 4% glycerin, 1.8% propanediol), pH 5.67 in 5.30-6.30 |
| `S4.jpeg` | THE BUBBLE ENGINE. 8% methyl perfluoroisobutyl ether |
| `S5.jpeg` | 3 CLEANSING AGENTS. 1 CLEAN RINSE. (cocamide DEA, sodium laureth sulfate, decyl glucoside) |
| `S6.jpeg` | DON'T ADD WATER. four steps |
| `S7.jpeg` | EVERY DAY, BACK TO CLEAN. |
| `Closing.jpeg` | Closing frame |

## Claim check

All figures match the current registered formula and COA:

- `Registration DOC/Formula_up/Formula-GENOSYS SNOW O2.pdf`: ether 8.0%, butylene glycol 4.1089%, glycerin 4.0%, propanediol 1.834% (sum 9.94%), cocamide DEA / SLES / decyl glucoside present.
- `Registration DOC/COA/COA-GENOSYS SNOW O₂ 180ml(WOB052).pdf`: pH 5.67, spec 5.30-6.30.

Note: the older `Intertek_folder/Quali-quanti Ingredients/9 SNOW O2.pdf` (2019 formula) shows ether 3%, glycerin 3%, no propanediol, pH 5.80-6.80. The slides and the site copy follow the `Formula_up` revision, which is the one in market.

## Where it landed

- DB product 10: `image` -> `/images/cleanser_o/Main.jpeg`; `images` -> S1-S7 + Closing (`scripts/set-product-10-slides-20260904.ts --apply`).
- Static fallbacks `lib/products.ts`, `data/productConfig.ts` (legacy config gallery, kept in step with DB).
- `lib/routineStepImages.ts`, `components/profile/OrderHistory.tsx` -> new main.
- Bespoke page `SnowO2ProductPage.tsx`: effects section S2, engine section S4 (was the packshot, now `object-contain`), how-to S6.
- Cut-out rebuilt: `public/images/cutout/10-v2.webp`, manifest `lib/productCutouts.ts` (REVISION 10 -> 2 in `build-cutouts.py`).
- `lib/blogImageDimensions.server.ts` entry for the new main.
- `lib/productsDb.ts` cache key bumped `v66` -> `v67`, because the product page's `unstable_cache` kept serving the old gallery after the DB flip (the comment on that key says to do exactly this for out-of-band image swaps).

Old `public/images/cleanser/` files are left in place: 84 order items and past order emails reference `Main.jpg` / `main_clean.jpeg`, and `/images/*` is served immutable.

## Verified live

- `/products/10`, `/ru/products/10`, `/ar/products/10` reference only `cleanser_o/*`; no `cleanser/` paths left in the HTML.
- `/api/products/10` and the mobile products API return the new main and gallery (app is API-driven, no OTA needed).
- Closing band renders `/images/cutout/10-v2.webp`.

Commits: `e0b361f0`, plus the cache-key bump.
