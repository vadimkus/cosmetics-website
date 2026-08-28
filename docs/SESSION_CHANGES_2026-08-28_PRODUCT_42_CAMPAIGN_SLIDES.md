# Product 42 - new campaign slides

Date: 2026-08-28
Product: 42, INTENSIVE BLEMISH BALM CREAM [SPF 30 PA++], 50g
Live: https://genosys.ae/products/42

## What changed

The gallery was two images. It is now a nine-image campaign set.

| Position | File | Slide |
|---|---|---|
| Main | `Main.jpeg` | Clean packshot, no campaign copy |
| 1 | `S1.jpeg` | WHEN SKIN STILL SHOWS IT. |
| 2 | `S2.jpeg` | ONE SHADE. THAT'S THE POINT. |
| 3 | `S3.jpeg` | MORE EVEN. STILL YOUR SKIN. |
| 4 | `S4.jpeg` | COVER. DON'T BUILD A MASK. |
| 5 | `S5.jpeg` | START THIN. BUILD ONLY WHERE YOU NEED IT. |
| 6 | `S6.jpeg` | 30 - PROTECTION, BUILT IN. |
| 7 | `S7.jpeg` | FIVE THINGS LEFT OUT. |
| 8 | `Closing.jpeg` | Product card, SHOP |

All in `public/images/blemish_o/`. The WhatsApp filename order did not match
the narrative order, so each file was opened and identified before renaming.

`Insta.jpeg` is in the same folder and deliberately out of the gallery: it is
900x1600, a story format, and the gallery stage is square.

## Claim verification

Checked against the Intertek dossier before publishing.

- **2% arbutin** (S7 footnote). `Quali-quanti Ingredients/GENOSYS INTENSIVE
  BLEMISH BALM CREAM.pdf` gives Arbutin 2.000% W/W; the safety assessment
  (`Registration DOC/SA/`) repeats 2.00. Confirmed.
- **Five no-additions** (S7). The carton panel in
  `Label/[GENOSYS]INTENSIVE BLEMISH BALM CREAM.pdf` reads "5 No-additions:
  Paraben, Artificial Fragrance, Mineral oil, Ethanol, Phenoxyethanol" - the
  slide lists exactly these five. The INCI list carries no paraben, no
  phenoxyethanol, no mineral oil, no alcohol and no fragrance; preservation
  runs on caprylyl glycol, 1,2-hexanediol, glyceryl caprylate and
  caprylhydroxamic acid. Confirmed.
- **SPF 30 PA++** (S6). On the label. Three filters: titanium dioxide 7.700%,
  ethylhexyl methoxycinnamate 7.000%, octocrylene 5.000%.
- **Korean triple-function** (Closing). The Korean panel registers the product
  for whitening, wrinkle improvement and UV protection.
- **Dermatologically tested** (Closing). On the carton.
- **Post-treatment marks** (S1). The label describes covering redness and
  blemishes after dermatological treatment.

## Files touched

- `public/images/blemish_o/` - ten files renamed to house convention
- database `product.image` and `product.images` for 42
- `data/productConfig.ts` - removed the `images` array. Config wins over the
  database where both exist, so leaving it would have pinned the page to the
  old shot. This product is now database-only, per the gallery rule.
- `lib/products.ts`, `lib/routineStepImages.ts`, the three
  `lib/seoLandingPages*.ts` - repointed off `/images/BLEM.jpg`
- `scripts/cutout/build-cutouts.py` - revision 2 for product 42
- `lib/productCutouts.ts` - regenerated, now `/images/cutout/42-v2.webp`

The packshot sits on a glossy floor with a mirror reflection, which usually
needs a measured `FLOOR` entry to stop Vision tracing the reflection as
product. It traced cleanly here, so no entry was added.

`/images/BLEM.jpg` and `/images/cutout/42.webp` are left on disk. Historical
order emails and a clinic pricelist script still reference the old packshot,
and `/images/*` is served immutable for a year.
