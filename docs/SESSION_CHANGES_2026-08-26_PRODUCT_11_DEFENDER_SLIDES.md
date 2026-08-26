# Product 11 — SKIN DEFENDER campaign slides (2026-08-26)

Product 11 moves off the `/images/remover/` set and onto the August 2026 campaign
set in `public/images/defender_0/`.

## Naming

Ten files arrived from WhatsApp, two of them byte-identical. Named to the same
convention product 52 uses, so the two products read the same on disk.

| New name | Was | Slide |
|---|---|---|
| `Main.jpeg` | `Main.jpeg` | HERO A — clean bottle on white |
| `Packshot-tall.jpeg` | `Insta.jpeg` | HERO B — the vertical cut |
| `S1.jpeg` | `…14.45.00 (2).jpeg` | GENTLE YET EFFECTIVE CLEANSING. |
| `S2.jpeg` | `…14.45.00 (3).jpeg` | EFFECTIVE REMOVAL. GENTLE FORMULA. |
| `S3.jpeg` | `…14.45.00 (4).jpeg` | BIPHASIC TECHNOLOGY. |
| `S4.jpeg` | `…14.45.00 (5).jpeg` | 10 VITAMIN COMPLEX |
| `S5.jpeg` | `…14.45.01.jpeg` | EYES. LIPS. DELICATE BY NATURE. |
| `S6.jpeg` | `…14.45.01 (1).jpeg` | SHAKE WELL. / APPLY TO A COTTON PAD. / GENTLY WIPE. |
| `Closing.jpeg` | `Closing.jpeg` | SLIDE 7 / FINAL |

`…14.45.00.jpeg` was a duplicate of `Main.jpeg` and was deleted rather than named.

`Packshot-tall.jpeg` is 941×1672 (9:16) and carries campaign copy, so it is not
the clean 4:5 hero it was described as. It stays on disk for social and out of
the gallery, which is how product 52 treats its own tall packshot, so nothing on
the page depends on that discrepancy.

## Where they are used

- DB product 11: `image` → `Main.jpeg`; `images` → `S1`–`S6` + `Closing` (7).
  Main is never listed in `images` — web and mobile both prepend it.
- Bespoke page `RemoverProductPage.tsx` inline art repointed:
  `EFFECTS_IMAGE` → `S2` (carries the non-greasy line), `HOWTO_IMAGE` → `S6`
  (shake and wipe), `ENGINE_IMAGE` → `S3` (the two-layer diagram the engine
  section describes in words). All three containers are `aspect-square` and the
  slides are exactly 1:1, so they fill with no letterboxing and no blend mode.
- Static fallback `lib/products.ts`, `lib/routineStepImages.ts`,
  `app/training/trainingCatalogue.ts`, `app/api/mobile/training/route.ts`,
  `components/profile/DownloadsSection.tsx` all repointed to `Main.jpeg`.
- `lib/productCutouts.ts` rekeyed to `Main.jpeg`; `public/images/cutout/11.webp`
  rebuilt from it (coverage 0.193, 47.9 KB).

## Claims check against Intertek

Source: `Registration/Intertek/GENOSYS SKIN DEFENDER LIP & EYE MAKEUP REMOVER/`.

Supported:

- **10 VITAMIN COMPLEX** — the formula carries exactly ten vitamin entries:
  Panthenol, Tocopherol, Tocopheryl Acetate, Niacinamide, Biotin, Folic Acid,
  Pyridoxine, Cyanocobalamin, Sodium Ascorbyl Phosphate, Thiamine HCl.
- **Palmitoyl Tripeptide-5** and **Acetyl Tetrapeptide-5** — both in the formula
  under exactly those INCI names.
- **200 ml** — artwork reads `NET WT. 200 ml / 6.76 fl. oz.`
- **South Korea** — artwork reads `Seoul, South Korea`.
- **DERMATOLOGICALLY TESTED** — on the registered artwork.
- **Biphasic** — the product is a visible oil-over-water two-layer system and the
  pack instructs shaking before use.

Open:

- **OPHTHALMOLOGICALLY TESTED**, on `Closing.jpeg` and `Packshot-tall.jpeg`, is
  not on the registered artwork and no certificate is in the local archive. The
  2017 Safety Assessment for the predecessor recommended the test be carried
  out. Vadim confirmed the test was done and the certificate is simply not
  archived here, and asked to publish as-is. Worth filing the certificate with
  the dossier when DTS MG sends it.

## Notes

- `public/images/cutout/11.webp` was replaced under its own filename. `/images/*`
  is served immutable for a year, but the old and new cut-outs are the same
  bottle at 0.186 vs 0.193 coverage, so a cached visitor sees no meaningful
  difference. Keeping the `<productNumber>.webp` convention was worth more than
  cache-busting a visually identical asset.
- `build-cutouts.py` reads `/tmp/imgs.json`, which is a stale dump. Run
  `scripts/cutout/dump-product-images.ts > /tmp/imgs.json` first or it silently
  rebuilds from the previous hero. It did exactly that on the first attempt here.
- Old `/images/remover/` assets are removed in a follow-up pass, after the new
  files are live, per the order-email image rule.
