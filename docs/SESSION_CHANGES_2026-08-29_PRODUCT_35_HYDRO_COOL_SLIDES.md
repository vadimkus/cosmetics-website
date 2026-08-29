# Product 35 — Hydro Cool Modeling Mask campaign slides

**Date:** 2026-08-29
**Page:** https://genosys.ae/products/35

## What changed

The gallery went from one legacy figure (`/images/Second/hmask_big.jpg`) to the
eight-slide campaign set, and the packshot moved from `/images/HYDR.jpg` to the
new `Main.jpeg`.

| Slide | File | Headline |
|---|---|---|
| Main | `Main.jpeg` | packshot, 1kg pouch on white |
| 1 | `S1.jpeg` | COOL UNTIL YOU PEEL. |
| 2 | `S2.jpeg` | COOL. SOOTHE. PEEL. |
| 3 | `S3.jpeg` | 65.165% DIATOMACEOUS EARTH. |
| 4 | `S4.jpeg` | 30 G. / 1 : 0.8 / WATER. |
| 5 | `S5.jpeg` | CREAM TO PEELABLE. / 5–10 MINUTES. |
| 6 | `S6.jpeg` | 15–20 MINUTES. / COOL UNTIL IT COMES OFF. |
| 7 | `S7.jpeg` | FORMULA COMPOSITION. |
| 8 | `Closing.jpeg` | HYDRO COOL MODELING MASK / 1 KG |

## Two files arrived out of order

WhatsApp's `(6)` is "15–20 minutes" and its `(7)` is "cream to peelable", which
is the reverse of how they read. They were renamed by content, so `S5` comes
from `(7)` and `S6` from `(6)`. Renaming by arrival number would have put the
peel step before the set step.

## Not a gallery slide

`WhatsApp Image 2026-08-29 at 00.38.30.jpeg` is portrait (576×1024) and reads
"TREATMENT DONE. SKIN STILL NEEDS CALM." — a story asset, not one of the eight.
Kept as `Story.jpeg`, out of the rail.

## Claims verified

Against `Intertek/Intertek_folder/Quali-quanti Ingredients/GENOSYS HYDRO COOL
MODELING MASK.pdf`. Every figure on slides 3 and 7 matches the dossier exactly:

Diatomaceous earth 65.1650 · glucose 12 · algin 9 · calcium sulfate 6 ·
tetrasodium pyrophosphate 5 · magnesium oxide 2 · peppermint extract 0.1 ·
menthol 0.01 · centella asiatica, ceramide, allantoin, sodium hyaluronate 0.01.

Slide 7 prints Ceramide 3 as **Ceramide NP**, which is the same ingredient under
its current INCI name — correct, not a discrepancy.

The 1 : 0.8 ratio on slide 4 is not in the formula table; it was already an
established claim in the product description and is unchanged.

## Other edits

- The figure in the complex section moved from the old packshot to `S3`. That
  section is about what the powder is made of, so it now shows the powder and
  its share rather than a second view of the pouch. `figureAlt` updated in EN,
  AR and RU.
- Cutout rebuilt as `35-v2.webp`. New number because `/images/*` is served
  immutable for a year.
- `Main.jpeg` resized 4096→2000px. It sits at 545KB against a ~500KB target;
  left there rather than run a second compression generation over a flat silver
  packshot for 50KB.

## Old assets

`HYDR.jpg` was cited by **six order items**. Those rows were repaired to the new
path with `scripts/repair-dead-order-item-images.ts --apply` before the file was
deleted, and the follow-up sweep reports zero unresolved dead paths.

## Verified live

All nine assets return 200, `HYDR.jpg` returns 404, and the rendered page
references the full set in order.
