# Session changes 2026-09-29: product 67 stamp, scalp rework

Owner feedback on the first "PRESS HERE." set (live 28 Sep): the stamp is a scalp tool, not a
face tool; it is used with HR³ MATRIX HAIR SOLUTION α, not a Power Solution ampoule; no face
scenes; the stamp shape was wrong in the scalp and sterile-pack slides; needle rows and the
logo were not sharp enough on the main image and the needle slides.

## Positioning (copy)

- Scalp only, paired with HR³ MATRIX HAIR SOLUTION α (product 45). No face, acne, scar or
  line claims; no hair-loss or regrowth claim (owner decision for the whole HR³ line, 17 Aug).
- Protocol wording comes from the Hair Solution sources already on product 45's page: part
  the hair every 1 to 2 cm (Russian panel), 0.25 to 0.5 mm roller or stamp for 10 to 15
  minutes, half a vial for a small area, a whole vial for a larger one (DTS MG deck).
- The stamp's own claim: it presses straight down between the hairs, where a roller has to
  travel through them. DTS deck: stamp "ideal for scalp treatment", 140 needles.
- Name, sizes, price and MoySklad items unchanged (Microneedle Stamp, 0.25 to 2.0 mm, 230 AED,
  54504 to 54508).

Files: `data/product67LocalizedCopy.ts` (EN/RU/AR description, details, features, benefits,
how-to-use with the solution, scalp contraindications), `lib/productQuickFactsCatalog.ts`
(six scalp facts), `lib/chatbot/config.ts`, `lib/products.ts` (static fallback, Scalp/Hair),
`lib/productsDb.ts` (`'Microneedle Stamp': ['hair']`, so it leaves face analysis and joins
the hair recommendations).

Pairing: the recommendation block now pairs 67 with product 45 instead of the roller
(`ProductPageClientRefactored.tsx`, `ProductRecommendation.tsx`, mobile map `'67': '45'`,
`pc67*` copy in `messages/{en,ru,ar}.json`).

## Images

Campaign workspace: `~/Desktop/Insta_Olga/stamp/campaign/`.

- `_scripts/stamp_master.py` builds `_assets/stamp_master.png`, a 4x rebuild of the only studio
  photo (1200 px): the 175 needles detected, fitted to the real 7 x 25 lattice (a smooth
  polynomial, the pad is curved; 0.7 px rms), the old strokes inpainted and redrawn as tapered
  steel needles on their slots, and the GENOSYS logo aligned onto the printed one by ECC and
  re-set crisp.
- `_scripts/stamp_refs2.py` / `make_prompts2.py`: every reference uses the master in its
  photographed 3/4 view, turned only in plane, so the shape cannot drift.
- CapCut GPT Image 2.5 at **2k Max** (228 credits a run). 2k Medium and 4k Medium drew even
  rows but invented the needles (cones, thorns, loops); Max keeps the seven rows and fine
  strokes of the reference. The driver's no-image abort was raised to 600 s because a Max run
  takes 5 to 6 minutes.
- New slide plan: 1 PRESS HERE. · 2 STRAIGHT DOWN. · 3 140 NEEDLES. · 4 NO TANGLES. ·
  5 PART. PRESS. MOVE. · 6 FIVE LENGTHS. · 7 OPENS THE WAY. (with the HR³ vial) ·
  8 BETWEEN THE HAIRS. · 9 10-15 MINUTES. · 10 STERILE. SEALED. SINGLE USE. ·
  11 ROLLER FOR THE FACE. STAMP FOR THE SCALP. · 12 spec card.
- Exported to a new folder, `public/images/stamp_scalp/` (main + s1-s12, `ru/`, `ar/`),
  because `/images/*` is immutable for a year. Cut-out revision `67-v2.webp`.
- CapCut can drop back to **Medium** on its own (it did after a restart around a version-update
  prompt). A Max run takes roughly 3 to 8 minutes; a set that lands in about 2 minutes is the
  tell. Check the settings row before trusting a batch.
- Re-shoots the first pass forced:
  - slide 2: the upright stamp over a steel square came back with an invented head (square,
    diamond or pentagon face seen from below). Replaced by the stamp in its real 3/4 view on
    pale grey, the handle end resting in the square's right angle; slide type switched to ink.
  - slide 3: the tight head crop made CapCut add a logo on the neck, where the real stamp has
    none. Re-framed wider and tilted so the real logo sits in frame on the handle; a second
    pass (v3c) pulled the whole stamp into frame so the logo clears the right edge. Picked the
    take with seven evenly spaced rows.
  - slide 7: at the old size, in warm light, the needles read as dark chains. Stamp enlarged
    and the needle face lit.
  - slide 8: the head sat on the hair beside the parting. The parting is now drawn into the
    reference directly under the head, so the stamp lands on the scalp line.
  - slide 9: first pass ran at Medium (squiggle needles); re-shot at Max.
- Batches run under `screen` (`_scripts/wait_and_run.sh`, which waits for an unlocked screen
  and holds the display awake): a batch started as a child of a short-lived shell dies with it.

## Deploy

- `scripts/update-product-67-scalp-rework.ts` updates product fields only (variants and cart
  lines untouched) after checking all 37 image URLs return 200.
- `scripts/create-product-67-dts-stamp.ts` brought in line (folder, category, concerns).
- Tests: `__tests__/data/product67LocalizedCopy.test.ts` adds a scalp-positioning test (no
  face or hair-loss wording in any locale, HR³ named in every description, mobile pairing 45).
- `ProductRecommendation.tsx`: pairing intros uppercase product names; Greek letters are now
  left as they are, so "SOLUTION α" no longer renders as "SOLUTION Α" (read as A).

## Live check (29 Sep, 11:45-12:05)

- Commits `58e9c0fb7` (rework) and `2f1c01961` (α fix) on main; Vercel served the new
  images about 5 minutes after the push. Updater dry run, then `--apply`; paths `/products/67`,
  `/ru/products/67`, `/ar/products/67`, `/products`, `/` and tag `products` revalidated.
- Web, in the browser: EN shows main + `stamp_scalp/s1-s12`, tag SCALP/HAIR, pairing card
  HR³ MATRIX HAIR SOLUTION α; RU switches to `stamp_scalp/ru/s1-s12` and Russian copy
  ("Кожа головы и волосы"); AR is RTL with `stamp_scalp/ar/s1-s12`.
- Mobile `/api/mobile/products/67` (EN/RU/AR): image `stamp_scalp/main.jpg`, 13 gallery
  images with the locale's slides, category Scalp/Hair, `recommendedProductId` 45.
- Remaining "Power Solution" and face words in the page HTML come from the site-wide message
  bundle (other products' routine strings), not from product 67.

## Slide 11 re-shot: the real GENOSYS roller (29 Sep, 12:10-12:35)

- Owner: the roller on "ROLLER FOR THE FACE. STAMP FOR THE SCALP." was not the GENOSYS roller.
  CapCut had given it the stamp's rounded handle and an open white fork.
- New reference `v11b` (`stamp_refs2.py`): the real roller cut-out turned 8.7 deg so its axis
  matches the stamp's, both the same length and spaced apart. The prompt describes the roller
  as the roller campaign did (slim leaf-shaped handle with its moulded groove, white block,
  clear fork, red drum with black rims) and says the two handles are different shapes.
- CapCut 2k Medium 1:1 at the owner's request, 8 takes; picked `v11c_4` (real roller, both logos
  sharp, the stamp's seven rows even at 1:1).
- Shipped as `s11b.jpg` (EN/RU/AR) because `/images/*` is immutable; `s11.jpg` stays on disk
  unused. `localizedProductImages.ts` and the updater point at `s11b`; DB applied, live on web
  and mobile in all three locales (commit `bf609e795`).

## Slide 10 re-shot: sterile as art, no stamp (29 Sep, 12:40-13:45)

- Owner: the stamp in the blister did not look like the real pack. A bell-jar version (the bare
  stamp under a laboratory glass dome) was rejected too; owner asked for no stamp at all and
  something art-related.
- Final: a single flawless chalk-white egg resting on a mirror-polished steel disc on a white
  gallery plinth, after Brancusi's egg sculpture. The egg is nature's sealed, sterile container,
  opened once, so it carries all three words of the headline. Reference `v10e`, prompt `v10e`.
- CapCut 2k Medium 1:1 (owner: Medium only, never Max). Picked `v10f_5` (largest egg, clean
  shell and reflection). Type clears everywhere.
- Shipped as `s10b.jpg` (EN/RU/AR); map and updater point at `s10b`; DB applied, live on web and
  mobile (commit `0ae50f7dc`).
- Batch note: a run stalled when CapCut had left full screen (clicks missed, nothing started).
  Check the window is full screen and a generation shows in Generations before walking away.
