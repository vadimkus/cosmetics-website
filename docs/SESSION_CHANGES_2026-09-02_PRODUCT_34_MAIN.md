# Product 34: new main packshot

**Date:** 2 September 2026

SKIN RESCUE OVERNIGHT CREAM MASK. New studio shot supplied as `Main_new.jpeg`
(1254 x 1254, 66 KB), saved as `public/images/overnight/main-v2.jpeg`: a new
filename because `/images` is served immutable for a year, and not `Main.jpeg`
because that would sit beside `main.jpeg` on a case-sensitive host.

Cutout rebuilt as `34-v2.webp` (revision bumped in `build-cutouts.py`), manifest
regenerated. Repointed: `lib/products.ts`, `routineStepImages`, `OrderHistory`
fallback, training catalogue (web and mobile API), `DownloadsSection`.
`blogImageDimensions` gained the new path and keeps the old one, since posts in
the database still embed it. The old `main.jpeg` stays on disk for the same
reason and for order emails already sent.

Order of operations: code and files pushed first, database switched only after
the CDN returned 200 for both new files (`scripts/set-product-34-main-20260902.ts`
checks that before writing). Verified: mobile API returns `main-v2`, the product
page references only `main-v2` once the 5-minute ISR window passed.

## Campaign slides (16:40)

Eight titles supplied; seven WhatsApp exports plus `Closing.jpeg` in
`public/images/overnight_o/`, renamed by reading each slide:

| File | Title |
|---|---|
| S1 | YOUR SKIN HAD A DAY. |
| S2 | 4 WEEKS. (TEWL -15%, redness -26%) |
| S3 | TWO DOSES. TWO FUNCTIONS. (niacinamide 2%, adenosine 0.04%) |
| S4 | MADE TO HOLD. (glycerin 6%, trehalose 2%) |
| S5 | PALE PINK. BARELY THERE. |
| S6 | PRESS. SMOOTH. LEAVE. (1-2 times a week) |
| S7 | LAST STEP. LEAVE IT ON. |
| Closing | SKIN RESCUE OVERNIGHT CREAM MASK. |

The supplied `Main.jpeg` was byte-identical to the `main-v2.jpeg` deployed
earlier today, so it was dropped and the hero left as it was.

Claims checked: the four ingredient figures match
`Ingredients-GENOSYS SKIN RESCUE OVERNIGHT CREAM MASK.pdf` exactly (glycerin
6.000076, niacinamide 2.0, trehalose 2.0, adenosine 0.04). The four-week TEWL
and erythema figures are the Dr Koziej trial in the DTS MG official PDF
(`~/Desktop/Glass_Skin/01-official-pdfs/`) and were already on the page. The
frequency matches the deck's "once or twice a week".

Bespoke page: engine section now shows S2, ritual section S6. Gallery in the
database switched to S1-S7 + Closing after the CDN served the files (first
attempt refused on a transient connect timeout, by design). Old
`/images/overnight/S1-S5` stay on disk: the blog post built from them embeds
those URLs.

Noticed, not changed: the English short description on the page reads
"Niacinamide 2% is the figure that belongs on a card. The deck sells oxygen
and growth factors. Those print at 0%." That is dossier vocabulary and a
self-undercutting clause in customer-facing copy, against the selling-tone
rule. Left alone under the standing instruction not to alter English PDP copy
without a specific ask.
