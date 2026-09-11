# Product 45 — HR³ MATRIX HAIR SOLUTION α images (11 Sep 2026)

Source: `public/images/hair_sol_v/` (Olga's set, 2560 px squares). Resized to 1600 px JPEG q86.

| Slot | Slide |
|---|---|
| Main | box + ten vials, studio white (replaces legacy `/images/HHR.jpg`, 956x662) |
| S1 | ONE AMPOULE. TWO WAYS TO STAMP. |
| S2 | THE PARTING. |
| S3 | STAMP. Press. Lift. Repeat. |
| S4 | HAIRGEN BOOSTER. It stamps for you. |
| S5 | NOURISHES. CONDITIONS. |

No numeric claims on the slides; nothing to verify against the dossier.

## Code
- `lib/products.ts` main + gallery (replaces `Second/hs.jpg`); `lib/routineStepImages.ts`, training catalogue (web + mobile API), `DownloadsSection` -> new Main.
- Cutout rebuilt as `cutout/45-v2.webp` (revision 2 in `build-cutouts.py`), manifest updated.
- `lib/productsDb.ts` cache key v76.
- `scripts/set-product-45-images-20260911.ts --apply` after deploy.

## Update 17:40 — slides used through the bespoke page

`HairSolutionProductPage.tsx` previously had no section art (gallery only). Added, mvserum-style:
- Formula section: two columns, S1 (single vial) sticky beside the four carrier cards.
- Copper table: S5 (scalp and hair) sticky beside the table.
- How to use: S2 (the parting) beside the header; S3 (manual stamp) on the clinic card, S4 (HairGen Booster) on the home card as 4:3 card headers.

## Update 20:45 — S6 added

S6 "A LIGHT GEL. MADE TO STAY PUT." (gel in a glass dish). Appended to the gallery and used as the formula-section art in place of S1, since that section is about the carrier gel. Cache key v77.
Reverted formula-section art to S1 at Vadim's request; S6 stays in the gallery only.

## Update 23:30 — S6 replaced by S6a (vial on side with cap, warm shadow). S6.jpeg removed. Cache key v78.
