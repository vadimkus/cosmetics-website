# Product 5, POWER SOLUTION CVS: "Vitality, concentrated." campaign

Date: 2026-09-27. Main + 12 slides in EN, RU and AR; selling copy on every surface; dossier voice removed.

## Images

`public/images/cvs_campaign/`: `main.jpg` + `s1.jpg`-`s12.jpg` (1600 px, q88), with `ru/` and `ar/` sets
registered in `lib/localizedProductImages.ts`. Sources and scripts: `~/Desktop/Insta_Olga/cvs/campaign/`
(`_scripts/cvs_main_build.py`, `cvs_refs.py`, `cvs_slides.py`, `cvs_copy.py`, `cvs_batch.sh`; prompts in
`_prompts/`; CapCut driver shared from `~/Desktop/AWS/campaign/_scripts/capcut_ui.py`).

- **Look**: its own world, not AWS wine or CTS teal. Terracotta and peach under hard sun through palm
  leaves, travertine, warm skin, soy milk, grape and rose. Type in maroon `#4A1309` and cocoa, cream on
  the deep plates. Page palette `.ps-cvs` (cream `#faf3ef`, rose `#d1716d`, rose ink `#9c3d33`).
- **Main**: the Power Solution family angle, same template render as AWS and CTS: the real CVS carton
  artwork warped onto the face, the real vial, grey "x10", pure white. Cut-out `cutout/5-v2.webp`.
- **Scene slides** (s2-s7, s10, s11) are CapCut plates as generated (AI image, 2k, 1:1, four takes each).
- **Product slides** (s1 vial on a travertine plinth, s8 vial lying beside a drop, s9 sleeve + open tray of
  ten, s12 carton + vial) were never pasted: the real asset went in only as the reference on an empty
  CapCut set, and CapCut re-shot each one as a single photograph (`_prompts/s1r s8r s9r s12r`). Palm
  shadows fall across the glass and carton. Print checked on every take: all read GENOSYS / CVS /
  PROFESSIONAL / Concentrated Vitality Solution. On s9 the inner-lid and tray microtext was put back from
  the reference with `print_restore.py` (lid and tray only; the sleeve front was already clean, and a
  restore there flattened the palm shadows).

| # | EN headline | Claim |
|---|---|---|
| 1 | VITALITY, CONCENTRATED. | Ten vials of moisture and nourishment for tired skin |
| 2 | TIRED SKIN? FEED IT. | Moisture and nourishment for glow and vitality |
| 3 | 24% MOISTURE. | Butylene glycol + glycerin 23.97% |
| 4 | 2.5% SOY FERMENT. | Fermented soy milk, largest active by weight |
| 5 | CALM AFTER THE TREATMENT. | Panthenol 0.5%, allantoin 0.1% |
| 6 | GRAPE & ROSE. | Grape and rose callus cultures |
| 7 | DEWY, NOT DRAWN. | Hyaluronic acid and marine collagen |
| 8 | NOTHING HARSH. | No parabens, ethanol, artificial colour or artificial fragrance |
| 9 | TEN TREATMENTS. | Ten sealed 2 ml vials |
| 10 | OPEN. APPLY. ABSORB. | Cleanse, open, apply, pat until absorbed (serum shown clear) |
| 11 | MADE FOR THE TREATMENT ROOM. | Professional ampoule, dermatologically tested, made in Korea |
| 12 | TEN VIALS. ONE GLOW. | Spec card + shop lines |

Type clears the subject in all three languages. Arabic mirrors left-set columns to the right edge of
the same column; right-set and centred groups stay put. s12 flags only the sunlit floor streaks behind
the shop lines.

## Copy

- `components/product/powersolution/powerSolutionCopy.ts`: EN rewritten in selling voice ("Vitality,
  concentrated."). Out: "5-Free" (the fifth exclusion is artificial surfactant, which the list does not
  bear out), specific gravity, fill volume, microbiology, lot codes. Four exclusions only. Kept: every
  formula percentage, pH 5.94 inside 5.00 to 7.00, hinoki (not fragrance-free). Old unused RU/AR bases
  deleted.
- `cvsLocalizedCopy.ts`: full RU ("Энергия в концентрате.") and AR ("الحيوية، مركّزة.") copy mirroring EN.
- `data/productLocalizedCopyAudit.ts` product 5 RU/AR: selling description; specific gravity, measured
  fill and microbiology rows removed; pH reads as a figure inside its specification.
- `messages/en.json` `pc5*` rewritten from carton voice.
- `__tests__/data/productLocalizedCopyAudit.test.ts`: forbids 1,032 / 1.032 and 2,05 мл / 2.05 مل.

## Page

`CVS_VARIANT`: `figureSlides` (s2 in the solution section, s8 in the free-from section),
`sectionSlides` (formula s3 s4 s6 s7, how-to s9 s10, suited s5, details s1 s11 s12), `heroOnWhite: true`,
no blended slides.

## Elsewhere

- `lib/products.ts` fallback for id 5 (main + 12 slides, selling description).
- Cut-out `public/images/cutout/5-v2.webp` (REVISION 2, PARTS and REPAIR as products 6 and 9);
  `lib/productCutouts.ts` regenerated.
- DB: `scripts/update-product-5-campaign-gallery.ts` (image, 12-slide gallery, EN fields, descriptionRu/Ar
  from the central copy). Refuses `--apply` until all images and the cut-out return 200.
- Old CVS images stay on disk for order history.

## CapCut tooling

`capcut_ui.py`: `generate` now returns on a partial result (CapCut failed two of four tiles on one
slide and the batch waited forever); the new file list goes to `/private/tmp/_capcut_new.json` and
`fetch` decodes exactly those. `activate` uses `open -a CapCut` and waits until CapCut is frontmost.
`capcut_unmask.py`: a mask key switch that falls inside a chunk's CRC bytes is now decoded from the
periodic span pattern and verified by CRC; earlier outputs decode byte-identical.
