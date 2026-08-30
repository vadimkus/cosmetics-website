# Product 23 — ND Cell ANTI-WRINKLE CREAM campaign set

Date: 2026-08-30

## What changed

The page had been running on two legacy images (`/images/ND.jpg` and
`/images/Second/nd_big1.jpg`), the thinnest asset set in the catalogue. It now
carries a full campaign set of ten files in `public/images/nd_cell_o/`.

## Renaming

Ten files arrived as WhatsApp exports plus three lowercase names. Renamed to the
house convention used by `blemish_o`, `hydro_o` and `pdrn_mask_new`.

| New name | Slide copy |
|---|---|
| `Main.jpeg` | packshot, bottle square on white |
| `S1.jpeg` | YOUR FACE DOESN'T END AT THE JAWLINE. |
| `S2.jpeg` | DON'T JUST ADD WATER. KEEP IT THERE. |
| `S3.jpeg` | 5%. THE NUMBER THAT DEFINES IT. (squalane) |
| `S4.jpeg` | 0.04%. NOT A DECORATIVE DOSE. (adenosine) |
| `S5.jpeg` | BUILT TO SEAL. (six-row formula table) |
| `S6.jpeg` | FROM COLLARBONE. UP. |
| `S7.jpeg` | BELOW THE JAW. TWICE A DAY. |
| `Closing.jpeg` | ND CELL ANTI-WRINKLE CREAM / 50 g |
| `Insta.jpeg` | portrait story crop, **not** in the gallery |

Order is positioning → mechanism → the two doses worth naming alone → the whole
formula → how to apply → how often. `Insta.jpeg` is 941×1672, a story crop, so it
stays out of the gallery. All files are ≤ 157 KB at 1254 px, so no resizing.

## Claim verification

Every figure was checked against the Intertek dossier before shipping. All
twelve claims supported. Sources: `Ingredient lists_old/ND Cell ANTI-WRINKLE
CREAM.pdf` (COTDE manufacturing formula), `Registration DOC/COA/COA-GENOSYS ND
Cell ANTI-WRINKLE CREAM(L1109B).pdf`, `Registration DOC/SA/SA-GENOSYS ND CELL
ANTI-WRINKLE CREAM.pdf`, `Label/[GENOSYS]NDCELL ANTI-WRINKLE CREAM.pdf`.

- Squalane 5.000000%, dimethicone 3.000000%, Vitamin E 1.000000%, panthenol
  0.300000%, allantoin 0.200000%, adenosine 0.040000% — the S5 table matches
  exactly.
- Squalane genuinely is the largest ingredient after water: water 80.272520%,
  squalane 5.000000%, dimethicone 3.000000%. Position two in the registered INCI.
- Glycerin is 0.702960%, so the slide's 0.7% is a correct rounding.
- "Vitamin E" on the slide is **Tocopheryl Acetate** in the INCI. Fine for
  consumer copy; use the INCI name in anything regulatory or formulator-facing.
- Adenosine 0.04% is the Korean functional dose; the registered label carries the
  MFDS wrinkle-improvement wording with adenosine named as the active.
- The 92.60% assay is real and sits inside its "more than 90%" spec, but it is
  **batch L1109B specific**, not a fixed property of the formula. An earlier
  batch (L1002U) read 105.55%. Worth knowing if the slide outlives current stock.

Full report: `VisionDrive/al-futtaim/notes/2026-08-30_nd-cell-anti-wrinkle-cream-claims-verification.md`

## Code changes

- DB `product.image` and `product.images` for product 23.
- `lib/products.ts`, `lib/routineStepImages.ts`, `components/profile/OrderHistory.tsx`
  static fallbacks.
- `scripts/cutout/build-cutouts.py` — `REVISION["23"] = 2`, because the output
  filename is keyed by product number and `23.webp` already existed under an
  immutable cache. Rebuilt to `23-v2.webp`, no floor trim needed.
- `components/product/ndcell/ndcell.css` — `--cera-shot: #eef4f5`.

`NdCellProductPage.tsx` needed no edit: it derives the gallery, the figure, the
closing card and the sticky thumbnail from `product.image` / `product.images`.

## The closing band

`cerabarrier.css` defaults `--cera-shot` to `#eeeeee`, the studio grey the
catalogue was shot on, so a raw packshot sits on it without showing an edge. That
buys nothing once the shot is a cut-out, and left a neutral grey patch under this
page's slate-teal palette. Now `#eef4f5`, the same tone as `.cera-stage`, since
both are surfaces a packshot sits on. Small print gains contrast on the way:
`--cera-muted` #5f7376 goes from 4.31:1 (failing) to 4.50:1 (passing).

**Still outstanding:** roughly 23 other bespoke pages inherit the same studio
grey behind a cut-out and have the same mismatch. Fixed per-page so far (32, 23).

## Legacy assets — deliberately kept

`/images/ND.jpg` and `/images/Second/nd_big1.jpg` are no longer referenced by the
page, but **were not deleted**. Nine order items still point at `/images/ND.jpg`.
Removing it needs the documented sequence: run
`scripts/repair-dead-order-item-images.ts` dry, delete, run with `--apply`, then
run once more requiring zero unresolved. `nd_big1.jpg` has zero order references
and is safe to drop at any time.

## Verification

- 120 suites, 1387 tests passing.
- All ten assets return 200 on genosys.ae.
- `/products/23` HTML references all nine gallery paths and `cutout/23-v2.webp`,
  with zero references to the old paths.
