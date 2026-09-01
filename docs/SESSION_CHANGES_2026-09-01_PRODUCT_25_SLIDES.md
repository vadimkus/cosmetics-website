# Product 25 — Soothing Repair Postcream campaign slides

Date: 2026-09-01

Nine campaign slides plus a clean packshot replaced the two legacy images this
product had been running on.

## Files

Dropped into `public/images/soothing_rep_o/` as WhatsApp exports and renamed to
the house convention. The export order was not the running order, so each file
was opened and matched to its headline rather than renamed by sequence:

| File | Slide |
|---|---|
| `Main.jpeg` | Clean two-tube packshot, no campaign copy — the product card |
| `S1.jpeg` | MORE THAN POST-TREATMENT. |
| `S2.jpeg` | 18.4% HUMECTANT SYSTEM. |
| `S3.jpeg` | RECOVERY HAS AN ARCHITECTURE. |
| `S4.jpeg` | MORE THAN ONE KIND OF STRESS. |
| `S5.jpeg` | CLEAN. STILL SENSITIVE. |
| `S6.jpeg` | HAIR OFF. SKIN STILL FEELS IT. |
| `S7.jpeg` | AFTER THE INTENSITY. THEN RECOVERY. |
| `S8.jpeg` | AFTER MORE. DO LESS. |
| `Closing.jpeg` | SOOTHING REPAIR POSTCREAM — 20 g / 100 g |

`Story.jpeg` shipped in the same batch and is on disk, but it is the 9:16
Instagram cut, not a square PDP slide, so it is deliberately out of the gallery.

## Claims checked before publishing

Two slides carry figures. Both were checked against the Intertek dossier.

**Slide 2, "18.4% humectant system".** The current formula
(`Intertek/Soothing repair post cream 100g/Formula-GENOSYS SOOTHING REPAIR
POSTCREAM (2021).pdf`) gives butylene glycol at 12.000000% and glycerin at
6.390000%, which sum to 18.39%. The dossier lists the function of both as
*Humectants*, so the framing is the manufacturer's own rather than ours.

Worth knowing for anyone re-checking this: the older list in
`Ingredient lists_old/GENOSYS SOOTHING REPAIR POSTCREAM.pdf`, issued 2011, gives
butylene glycol 11.34% and glycerin 5.00%. Those figures would not support the
claim. The 2021 formula is the current one.

**Slide 3, the five actives.** All present in the 2021 formula: the centella
complex as its three actives (asiaticoside 0.008%, madecassic acid 0.006%,
asiatic acid 0.006%), sh-polypeptide-7, dipotassium glycyrrhizate 0.200%,
panthenol 0.050%, scutellaria baicalensis root extract 0.200%.

## Wiring

Gallery moved off the `productConfig` array onto the DB `images` field, matching
what product 52 did, so the two can no longer disagree. `Main.jpeg` is not in
that array: the web gallery and the mobile app both prepend `product.image`.

- DB `image` and `images` set by `scripts/set-product-25-slides-20260901.ts`
- `data/productConfig.ts` — gallery array removed, comment left in its place
- `lib/products.ts` — static fallback packshot repointed
- Cutout rebuilt from the new packshot. Revision bumped to 2 in
  `scripts/cutout/build-cutouts.py`, so the file is `25-v2.webp`; `/images/*` is
  immutable for a year and rewriting `25.webp` would never reach a repeat visitor.

The old `/images/SRC.jpg` stays on disk so historical order emails keep
resolving, but every live surface now shows the new packshot: SEO landing cards
in all three locales, `lib/routineStepImages.ts`, and the order-history
fallback map.

The bespoke page needed no change. It builds its gallery from `product.image`
plus `product.images`, so it picked the slides up on its own.

## Verified

All ten assets and the cutout return 200. The page HTML references all ten in
order with no trace of the old packshot, and the gallery reports 10 images.
