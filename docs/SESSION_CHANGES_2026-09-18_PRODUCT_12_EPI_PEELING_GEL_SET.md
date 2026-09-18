# Product 12, EPI TURNOVER BOOSTING PEELING GEL: September 2026 set

Date: 2026-09-18. Folder `public/images/epi_peel_o/`.

## Files

`Main.jpeg` (tube packshot, 1122x1402 padded to 1402 square on white), `S1`-`S8.jpeg`
(1254 square, q88) from the eight UUID PNGs Vadim dropped in the folder. Source PNGs
stay on disk untracked.

## Locked sequence (Vadim, 18 Sep)

| # | Headline | File |
|---|---|---|
| 01 | Not everything needs therapy. | S1 |
| 02 | Keep the good part. Lose the wrapper. | S2 |
| 03 | 3% cellulose. Zero attachment issues. | S3 |
| 04 | Sweet fruit. Dirty work. | S4 |
| 05 | Exfoliation without the personal vendetta. | S5 |
| 06 | Survival skills run in the formula. | S6 |
| 07 | We could have stopped at peeling. Could we? | S7 |
| 08 | One minute. No closure needed. (ritual) | S8 |
| 09 | It's supposed to ball up. (the roll) | not delivered |
| 10 | The hardest part? Waiting until next time. (1-2x a week) | not delivered |
| 11 | Rough patch? You've been served. (face / elbows / knees / heels) | not delivered |
| 12 | Good riddance. (final / product) | not delivered |

Slots 09-12 append as `S9`-`S12.jpeg` when the files arrive; DB `images` then extends.

## Claims on the slides, checked against `Registration DOC/Formula_up/Formula-GENOSYS EPI
TURNOVER BOOSTING PEELING GEL.pdf`

- Cellulose 3.000000%. ✓
- Allantoin 0.100000%. ✓
- "0.01% desert complex": fig 0.00385 + date 0.00385 + Opuntia coccinellifera 0.00045 +
  Opuntia ficus-indica 0.00045 + baobab 0.00030 = 0.0089%, rounds to 0.01%. ✓
- Papaya fruit extract, moringa seed extract, sodium hyaluronate, jojoba seed oil all present. ✓

## Where it landed

- DB `image` + `images` via `scripts/set-product-12-set-20260918.ts --apply` after deploy.
- `data/productConfig.ts`: legacy config gallery for 12 removed (config wins over DB); now
  DB-only per the product-gallery-images rule.
- `lib/products.ts` fallback, `lib/routineStepImages.ts`, `app/training/trainingCatalogue.ts`,
  `app/api/mobile/training/route.ts`, `components/profile/DownloadsSection.tsx` repointed to
  `epi_peel_o/Main.jpeg`.
- `EpiProductPage`: EFFECTS = S3 (cellulose), HOWTO = S8 (ritual), ENGINE = Main.
- Cut-out `cutout/12-v2.webp` (REVISION 12 -> 2), clean single-pass trace.
- Old `epi/` files stay on disk for historical order items.

## Closing card (12:04)

`Closing.png` (2560 square) added as `S9.jpeg` (1600, q88) at the end of the gallery.
The render printed **50 g**; the product is **100 g** (DB size, description, Intertek
`EPI TURNOVER BOOSTING PEELING GEL 100g_container.png`), so the figure was retouched
to 100 g before export (`Closing_100g.png`, untracked). Everything else on the card
matches the carton: EPG line, dermatologically tested, South Korea.
