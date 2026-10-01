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

## Slide 4 redo + no test panel (follow-up, same day)

Vadim: "avoid dossier with testing and DTSMG, no one cares about DTSMG; reshoot the slide and come with a
better option."

- **Slide 4** "DRINK FAST." (crown splash, "In a DTS MG test on 21 women...") is now **"DRINK FROM DROP ONE."**
  Support: "Skin drinks it straight in. Deep hydration rises after the very first use."
  RU "ПЬЁТ С ПЕРВОЙ КАПЛИ." / AR "تشرب من أول قطرة." Visual: one sky-blue drop soaking into a bone-dry, cracked
  clay tile on black (prompt `h4b` in `h18_prompts.py`; pick `h4b_2`, saved as `picks/d4.png`, old plate
  `picks/d4_v1.png`, old art `art/_v1/`). The splash could belong to any water product; the tile shows thirst
  being drunk.
- Exports `hsserum_v2/{,ru/,ar/}s4b.jpg` (new names; `h18_art_export.py` NAMES = {4: 's4b'}). Gallery swapped
  by `scripts/update-product-18-drink-from-drop-one-20261001.ts`; registry and the page's proof image now s4b.
- **Copy without the panel** (EN/RU/AR): proof section ("From the first drop / Deep hydration, immediately.",
  no 21 women, no 50.81 → 52.238, note removed), FAQ "How fast does it work?", details row "Made in: Korea",
  quick facts, hydration concern FAQ (RU/AR), RU/AR record benefit line, DB description and benefits,
  DB keyFeatures (were audit notes: "The carton stops here.", "Not +52%"; now selling copy, also fixed in the
  0816 script). Audit test now bans 50,81 / 52,238 / DTS MG / 21 жен / 21 امرأة for product 18.
- Rule: `.cursor/rules/selling-tone.mdc` rule 5 now says do not cite DTS MG or its tests (panel sizes,
  instrument readings); "Made in Korea" is enough.
- Left as is: JSON-LD manufacturer (search markup) and the site-wide "official distributor of DTS MG"
  footer/FAQ line. Open: 27 other products still name DTS MG in DB copy (mostly `origin: "Made in Korea by
  DTS MG"`), offered as a sweep.
- Commits `4744e2f8f`, plus the keyFeatures commit. Verified on /products/18 (EN/RU/AR) and the mobile API.

## Slide 4 again: the orchid (replaces the clay tile)

Vadim on s4b (cracked clay tile with a blue drop): "this is ugly, come up with better idea".

- Two concepts shot in CapCut on the set's black: `h4c` white phalaenopsis orchid drinking a sky-blue drop (blue veins spreading through the petal) and `h4d` crystal coupe with the first sky-blue drop falling in. Picked **h4c take 4**: whole flower inside the frame, petal = skin, the drink is visible. White + sky blue on black, matches the palette.
- Copy unchanged: "DRINK FROM DROP ONE." / "Skin drinks it straight in. Deep hydration rises after the very first use." (RU/AR as before).
- New files `public/images/hsserum_v2/{,ru/,ar/}s4c.jpg`. `PROOF_IMAGE` in `HsserumProductPage.tsx`, the registry in `lib/localizedProductImages.ts` and `scripts/update-product-18-campaign-v2.ts` point to s4c. DB swap script `scripts/update-product-18-orchid-slide-20261001.ts` (idempotent; the DB already held s4c when it ran).
- Workspace: prompts in `_scripts/h18_prompts.py` (h4c, h4d), `picks/d4.png` = h4c_4 (clay kept as `picks/d4_v2.png`, its art in `art/_v2/`), export `NAMES = {4: 's4c'}`.
- Commit 94da5c104. Verified: 3 URLs 200, EN/RU/AR pages and the mobile API (ru) reference s4c, no s4b left.
