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
