# Session changes - 1 Oct 2026 - Product 18 "Drink up." redo + carton rule

MOISTURE REPLENISHING HYALURON SERUM (18, 30 ml, 330 AED). Vadim: the previous set used Dubai pictures
(office window, skyline) and had no message running through it; redo. Also: other serums have no
carton on the main, so decide what is correct.

## Carton decision (rule)

Single-item products show the product alone on the main; the carton goes in the gallery. Sets, kits,
refill packs and multi-vial boxes show the box with its contents. Reasons: the main is the product card
(the thing the buyer uses), a bottle alone is about 40% bigger in the grid tile than bottle + carton,
and the range lines up (19-22 already show the bottle alone). Written into
`.cursor/rules/campaign-slides-conceptual.mdc` (hard rule 1). Follow-up offered: 19-22 sit on grey
studio sweeps, not white.

## Campaign - "DRINK UP."

Black (the bottle) + sky blue (the serum's own colour). Every EN headline says "drink"; RU and AR open
with the page headlines ("Напоите кожу.", "اروي بشرتكِ."). No people, no city, no tools.

| # | Visual | EN |
|---|---|---|
| 1 | the real bottle standing in ripples | DRINK UP. |
| 2 | eleven graduated water drops | 11 · DRINK DEEP. (Hyaluronan 11 Multi-Complex) |
| 3 | a falling drop | 2,000 PPM · HYALURONIC ACID. |
| 4 | crown splash | DRINK FAST. (DTS MG test, 21 women) |
| 5 | bowl filled to the brim | HOLD THE DRINK. (PENTAVITIN) |
| 6 | pool of sky-blue serum | DRINK BLUE. (no pigment added) |
| 7 | young coconut | DRINK COCONUT. |
| 8 | drops sinking into cotton | DRINK IT IN. (pat in) |
| 9 | serum + Moisture Replenishing Hyaluron Cream | DRINK, THEN SEAL. |
| 10 | the bottle on black | 30 ML · TWICE A DAY. |
| 11 | carton + bottle, card | DRINK UP. |

- Main: CapCut re-shoot of the real bottle (Vision cut-out of the earlier studio shot) on white, labels
  checked at full size (pick `main_1`), background lifted to pure white. `hsserum_v2/main.jpg`,
  cut-out `18-v3.webp`.
- Workspace `~/Desktop/Insta_Olga/hsserum18/campaign/` (`h18_*`). Exports `public/images/hsserum_v2/`
  (main + s1-s11, `ru/`, `ar/`; 34 files).
- Copy: pH specification rows removed from the page (EN/RU/AR) and from the RU/AR record (with the
  viscosity range); EN detail and benefit rows rewritten (no pH spec, no "coconut water 0.80%, not 78%").
- Commits `36d337cea`, `d9c62371c`; DB via `scripts/update-product-18-campaign-v2.ts --apply`; revalidated.
  Live: EN/RU/AR new main, 11 localized slides, no old slides.
- Cut-out builder: the REVISION table already had `"18": 2` further down, which overrode a new entry and
  rebuilt 18-v2 in place; restored from git and the existing entry bumped to 3 (new file 18-v3).

## Serums 19-22 on white (follow-up, Vadim: "yes, do all four now")

- Bottle-only mains re-shot in CapCut from Vision cut-outs of the grey studio mains, laid on white at
  product 18's scale. Labels clean on every take; picks chosen for scale closest to 18 (bottle height
  ~76% of frame): 19 `s19_1`, 20 `s20_1`, 21 `s21_2`, 22 `s22_4`. Background lifted to pure white.
- New files: `sensitive_serum/main-v2.jpg`, `problems_serum/main-v2.jpg`, `radiance_serum/main-v2.jpg`,
  `multif_serum/main-v2.jpg`; cut-outs `19-v2`, `20-v2`, `21-v3`, `22-v2` (REVISION entries added once
  each, no duplicates).
- Repointed: DB `image`, fallback (22's fallback gallery no longer lists its main), routine images,
  order history, downloads, SEO landing pages EN/RU/AR, the old per-product image scripts.
- Commits `efc3731cb`, `20565777b`; revalidated; the /products grid shows all five serums on white,
  no old mains left.
