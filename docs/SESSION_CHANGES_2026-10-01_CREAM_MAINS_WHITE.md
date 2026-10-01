# Cream mains on white canvas (24, 27, 28, 29, 63) — 1 Oct 2026

Request: "reshoot main creams like this, white canvas, identify them first" (reference: the 31 / 32 white mains).

## Identification

Edge whiteness measured against 30 / 31 / 32 (share of edge pixels below 245 ≈ 0 on the standard).

| # | Product | Old main | Problem |
|---|---|---|---|
| 24 | EyeCell Eye Contour Cream | `eye_cream/main.jpeg` | grey sweep (82% of edge non-white) |
| 27 | Skin Barrier Protecting Cream | `skin_barr/main.jpeg` | grey gradient (38%) |
| 28 | Intensive Hydro Soothing Cream | `hydro_soothing_o/Main.jpeg` | light grey, off-centre |
| 29 | Moisture Replenishing Hyaluron Cream | `mhcream_campaign/main.jpg` | added water drops |
| 63 | Revita Glow BB Cream | `revita_o/main.jpg` | window shadows (62%) |

Already on white, left alone: 23 ND Cell, 25 Soothing Repair Postcream, 42 Intensive BB Cream, 39 Ultra Shield, 40 Multi Sun.
Note: 23 and 42 are white but framed tighter than the rest of the cream row.

## Method

- Reference per product: real site cutout on 2560 white, tallest pack 0.74 of frame, bottom at 0.90, soft shadow
  (`~/Desktop/Insta_Olga/mains_white/campaign/_gen/ref/c*.jpg`).
- CapCut re-shoot, 4 takes each (`mw_batch.sh c24 c27 c28 c29 c63`), labels checked at full size.
- Picks by scale closest to the 31 main (0.752): 27 take 4, 28 take 3, 29 take 1, 63 take 3. All labels clean.
- **24 is a composite, not a CapCut take.** Every take garbled the EyeCell wordmark (EyeOSYS, emblem inside the word,
  an added GENOSYS line, an invented "Human Stem Cell" tag). The real tube cutout on white keeps the print exact.
- Whitening LUT 232–249 → 255; 1600 px progressive JPEG (64–153 KB); corners 255.

## New files (new filenames, immutable cache rule)

| # | Main | Cutout |
|---|---|---|
| 24 | `/images/eye_cream/main-v2.jpg` | `/images/cutout/24-v2.webp` |
| 27 | `/images/skin_barr/main-v2.jpg` | `/images/cutout/27-v2.webp` |
| 28 | `/images/hydro_soothing_o/main-v2.jpg` | `/images/cutout/28-v3.webp` |
| 29 | `/images/mhcream_campaign/main-v2.jpg` | `/images/cutout/29-v3.webp` |
| 63 | `/images/revita_o/main-v2.jpg` | `/images/cutout/63-v2.webp` |

## Code and data

- References repointed: desktop experience (SkinBarrierChamber, DesktopSkinLabHero, DesktopGenosysUniverseHub),
  `lib/productExperience.ts`, SEO landing pages EN/RU/AR, `lib/products.ts`, `lib/routineStepImages.ts`,
  `components/profile/DownloadsSection.tsx`, update scripts for 24 / 27 / 29 / 63.
- `scripts/cutout/build-cutouts.py` REVISION: 24 → 2, 27 → 2, 63 → 2 (new), 28 → 3, 29 → 3.
- `lib/productCutouts.ts`: new main → new cutout mappings.
- DB `image` updated for productNumber 24, 27, 28, 29, 63. Galleries untouched.
- Commits: `ea67c5d80` (mains + refs), `c644fafd2` (cutouts + mapping).

## Verification

- All five mains and cutouts return 200 on genosys.ae.
- Revalidated `/products/{24,27,28,29,63}`, `/products`, `/ru/products`, `/ar/products`, `/`.
- Product pages reference the new mains; mobile API `/api/mobile/products/<id>` returns the new `image` (no OTA needed).
- tsc clean; jest 150 suites / 1615 tests pass.

## Follow-up: patch 33 and Intensive BB 42 (same day)

Request: "patches and blemish balm, pls reshoot main".

| # | Product | Old main | Problem | New main | Cutout |
|---|---|---|---|---|---|
| 33 | EyeCell Eye Peptide Gel Patch | `patch/main.jpeg` | grey gradient | `/images/patch/main-v2.jpg` | `/images/cutout/33-v2.webp` |
| 42 | Intensive Blemish Balm Cream | `blemish_o/Main.jpeg` | white, but tube filled 88% of frame | `/images/blemish_o/main-v2.jpg` | `/images/cutout/42-v3.webp` |

- 41 Cushion (already white; box shown because it is a set) and 63 Revita Glow (done this morning) left alone.
- References: 42 at 0.74 height; the jar is wide, so 33 sized by width (0.78) with bottom at 0.86.
- CapCut takes: all four clean for both, including the EyeCell wordmark and lid text this time.
  Picks by scale: 42 take 4, 33 take 2. Whitening LUT 232–249 → 255; 1600 px JPEG; edges pure white.
- References repointed: `lib/products.ts`, `lib/routineStepImages.ts`, SEO landing pages EN/RU/AR,
  training catalogue (web + mobile API), `DownloadsSection.tsx`, `scripts/update-product-33-images.ts`.
- Not changed: product 50 (Eye Zone Care Kit) gallery still uses the old `patch/main.jpeg` (file kept).
- REVISION: 33 → 2 (new), 42 → 3. DB `image` updated for 33 and 42.
- Commits: `a1af318cc` (mains + refs), `608c4c35e` (cutouts + mapping).
- Verified: files 200, pages and mobile API return the new mains, grid shows them after revalidation.

## Follow-up: HairGen Booster 3 and Hair-GENTRON 48 (same day)

Request: "reshoot main hairgentron and hairgen booster, should be white canvas".

| # | Product | Old main | New main | Cutout |
|---|---|---|---|---|
| 3 | HairGen BOOSTER | `hairgen_campaign/main2.jpg` (carton + device on black, glowing LEDs) | `/images/hairgen_campaign/main-v3.jpg` | `/images/cutout/3-v3.webp` |
| 48 | Hair-GENTRON | `gentron_campaign/main.jpg` (helmet + controller on black, LED glow) | `/images/gentron_campaign/main-v2.jpg` | `/images/cutout/48-v3.webp` |

- Booster shown **without the carton** (single-item rule, decided 1 Oct on product 18); the carton stays in the
  gallery (s11 / s12 "All in the box").
- Gentron keeps helmet + stand + controller: that is the device the buyer receives.
- LEDs off on both mains so the white stays pure; the light is shown in the galleries.
- References from the supplied originals: `~/Desktop/Insta_Olga/hair_gen/HAIRGEN BOOSTER.png` (official cut-out) and
  `~/Desktop/Insta_Olga/hair_gentron/Hair-GENTRON with controller.jpg` (Vision cut-out at 3888 px).
- New `device()` prompt and `DEVICES` (d3, d48) in `mw_prompts.py`. All takes clean; picks d3 take 3, d48 take 4
  (emblem closest to the real one).
- `build-cutouts.py`: removed FLOOR and REPAIR rules for 3 (written for the old black-floor carton photo);
  REVISION 3 → 3, 48 → 3 (single keys, no duplicates).
- References repointed: `lib/products.ts`, `scripts/update-product-3-campaign-gallery.ts`,
  `scripts/update-product-48-campaign-gallery.ts`, `lib/productCutouts.ts`. DB `image` updated for 3 and 48.
- Commits: `79123e87c` (mains + refs), `2dfee7533` (cutouts + mapping).
- Verified: files 200, pages and mobile API return the new mains, grid shows them after revalidation.

## Follow-up: Eye serum 17, Scalp Peeling 46, Peptide Gel Mask 37 (same day)

Request: "eye serum need white canvas; scalp peeling main need bottle, no cubes; peptide mask main, no ice cubes".

| # | Product | Old main | New main | Cutout |
|---|---|---|---|---|
| 17 | EyeCell Eye Contour Serum | `eye_serum/main.jpeg` (grey gradient) | `/images/eye_serum/main-v2.jpg` | `/images/cutout/17-v2.webp` |
| 46 | HR³ Matrix Scalp Peeling α | `scalp_campaign/main.jpg` (bottle on ice) | `/images/scalp_campaign/main-v2.jpg` | `/images/cutout/46-v3.webp` |
| 37 | Peptide Gel Mask | `peptide_campaign/main.jpg` (sachet + box with ice) | `/images/peptide_campaign/main-v2.jpg` | `/images/cutout/37-v3.webp` |

- References from the supplied originals: `Eye_kit/EyeCell EYE CONTOUR SERUM_container(new).png`,
  `scalp/HR3 MATRIX SCALP PEELING ALPHA_container.png` (371 × 992, small), `peptide/PEPTIDE GEL MASK_new pouch with outer box.png`.
- New `packshot()` prompt and `MAINS3` (e17, b46, k37) in `mw_prompts.py`.
- **17 is a composite, not a CapCut take**: every take garbled the small print ("10Years Bask", "SRUM",
  "DERMATOLOICGCLALY TSTED"), same failure as 24. The official 5350 px container on white keeps it exact.
- 46 take 3 and 37 take 4 (closest to reference scale); all labels clean, 46 sharper than the small source.
- 37 keeps the box: multi-sheet pack, per the carton rule.
- `build-cutouts.py`: removed the CLONE repair for 37 (ice cube over the seal); REVISION 17 → 2, 37 → 3, 46 → 3.
- References repointed: `lib/products.ts`, `lib/routineStepImages.ts`, `scripts/update-product-17-images.ts`,
  `scripts/update-product-37-campaign-gallery.ts`, `scripts/update-product-46-campaign-gallery.ts`, `lib/productCutouts.ts`.
- Not changed: product 50 kit gallery still uses `eye_serum/main.jpeg` (file kept).
- CapCut had no window at first (only after Vadim reopened the AI image panel did the batch run). Driver picks the
  window titled "CapCut"; a small AXDialog toast can be window 1.
- Commits: `2274270c8` (mains + refs), `1d9b60bd8` (cutouts + mapping).
- Verified: files 200, pages and mobile API return the new mains, grid shows them after revalidation.

## Follow-up: Problem Control Toner 15 and Snow Booster 16 (same day)

Request: "reshoot main problem toner and snow booster, should be white clean".

| # | Product | Old main | New main | Cutout |
|---|---|---|---|---|
| 15 | Intensive Problem Control Toner | `pct_campaign/main.jpg` (ice cubes, frost) | `/images/pct_campaign/main-v2.jpg` | `/images/cutout/15-v4.webp` |
| 16 | Snow Booster | `booster_campaign/main.jpg` (powder snow, haze) | `/images/booster_campaign/main-v2.jpg` | `/images/cutout/16-v3.webp` |

- References: the existing cutouts 15-v3 / 16-v2 (the supplied container PNGs placed at the main's layout), one
  contact shadow per bottle.
- 16: take 1. Small print checked word for word; take 4 added "sora cleansing".
- 15: first round rewrote the claim line ("betterly-tone skin", "better-looking skin") or restyled the 200 ml label.
  Second round with the exact pack sentence in the prompt ("PCT helps remove excess oil and sebum for blemish-prone
  skin while adding quick hydration to skin.") and the 200 ml label style spelled out: all four correct; take 1 used.
  **Lesson: for packs with a claim sentence, put the exact sentence in the prompt.**
- CapCut rendered both ~8% larger than the reference; new `_scripts/fit_export.py` scales the take onto white at the
  standard framing (tallest pack 0.75, bottoms 0.90) before export.
- `build-cutouts.py`: removed a stale duplicate `"15": 2`; REVISION 15 → 4, 16 → 3 (traced from the white mains;
  white-on-white edges checked on a tinted background).
- References repointed: `lib/products.ts`, `lib/routineStepImages.ts`, `DownloadsSection.tsx`, training catalogue
  (web + mobile API), gallery scripts for 15 / 16, `lib/productCutouts.ts`. DB `image` updated.
- Commits: `93befa265` (mains + refs), `fca7a4554` (cutouts + mapping).
- Verified: files 200, pages and mobile API return the new mains, grid shows them after revalidation.

## Follow-up: Snow Booster 16 gallery slides 1 and 6, bottle without the cap (same day)

Request: "reshoot in capcut these 2 slides, the bottle must be without cap" ("LET IT SNOW." and "EVEN ON MAKEUP.").
Both showed the 200 ml spraying with its clear overcap still on.

- Capless reference: the clear overcap traced out of `SNOW BOOSTER 200ml-container.png` (alpha is opaque, so the
  actuator and pump closure were kept by geometry), placed at the original `ref_200_white.png` layout →
  `~/Desktop/Insta_Olga/booster/campaign/ref_200_nocap_white.png`.
- Prompts `_paste/01c.txt` and `_paste/06c.txt` (= 01 / 06b with the cap removed and "no clear cap" in the negative).
- Picks: slide 1 take 2 (nozzle visible, mist leaves the nozzle); slide 6 take 1 (finger on the actuator, label exact).
  Slide 6 takes 2 and 3 garbled the small print.
- Plates saved as `~/Desktop/Insta_Olga/booster/s1b.png` and `s6b.png`; `booster_slides.py` now reads them and its
  PEP path was fixed to `~/Desktop/Insta_Olga/booster` (folder had moved). Old finals kept in `final/_v1/`.
- Site: `/images/booster_campaign/{,ru/,ar/}s1b.jpg` and `s6b.jpg` (new filenames). DB gallery swapped by
  `scripts/update-product-16-capless-slides-20261001.ts`; `lib/localizedProductImages.ts` and
  `scripts/update-product-16-campaign-gallery.ts` updated.
- Commit: `fb6e51ec1`. Verified on /products/16, /ru/products/16, /ar/products/16 and the RU mobile API.

## Product 10 SNOW O2 Cleanser: slides 2 and 8 without the city

Vadim: "no need for dubai or shots with city, we are super luxury brand". Two slides replaced, rest of the "It fizzes." set untouched.

| Slide | Before | After |
|---|---|---|
| 2 | "A DUBAI DAY, ON YOUR SKIN." woman on a terrace, skyline | "THE DAY, ON YOUR SKIN." texture still on apricot travertine: a sweep of foundation, bronze powder, a pearl of white SPF, golden dust. Support: "SPF, make-up, dust and sweat. Twelve hours of heat and AC, all on your face." |
| 8 | "RINSE. SOFT, NOT TIGHT." woman splashing at a sink | Same copy over peach satin silk on a stone ledge under a glassy pour of water. No person, basin or tap. |

- Files: `public/images/snowo2_campaign/{s2b,s8b}.jpg` + `ru/` + `ar/` (new filenames, old s2/s8 kept on disk).
- RU slide 2: "ВЕСЬ ДЕНЬ НА ВАШЕЙ КОЖЕ."; AR: "اليوم كله على بشرتكِ."
- `lib/localizedProductImages.ts` (snowo2_campaign ru/ar s2b, s8b), `scripts/update-product-10-campaign-gallery.ts`, DB swap via `scripts/update-product-10-luxury-slides-20261001.ts`.
- Workspace: `~/Desktop/Insta_Olga/cleanser10/campaign/` (prompts s2b/s8b in `c10_prompts.py`, picks s2b_3 / s8b_3, old finals in `final/_v1/`).
- Commit 36f8faedc. Verified: 6 URLs 200, EN/RU/AR pages reference localized s2b/s8b, mobile API (ar) serves them.
