# Product 3 HairGen BOOSTER — "IN. NOT ON." campaign (27 Sep 2026)

Brief (Vadim): new campaign for https://genosys.ae/products/3, folder `~/Desktop/hair_gen`
(device, blue light, red light, outer box PNGs), CapCut, main + 12 slides, EN / RU / AR,
"we are selling", full control, push to main.

## Sources and claims

A device, so no Intertek dossier. Sources: `Training Materials/HairGen_Booster/` leaflet
(17 Jun 2021) and user manual; audit `SESSION_CHANGES_2026-08-18_PRODUCT_3_HAIRGEN_BOOSTER_AUDIT.md`.

Carried (stated in cosmetic terms by the leaflet / manual): 52 microneedles per stamp; 14 LEDs,
blue and red, through 48 light bumps; 280 / 330 / 400 per minute; ten minutes, then it stops;
"no pain during treatment - massaging sensation instead of needling sensation"; "hair solution
is absorbed within 10 mins"; the stamp creates pathways that let the ampoule's actives in;
"the right environment for healthy scalp and hair"; fresh vial + stamp each session; box =
device, USB-C cable, stand; 5 V / 2 A, charge after use; 24-month warranty. Depth 0.3 mm (the
stamp's, same as product 64's page).

Kept out, every language: alopecia and the clinical photos, vessel formation / circulation,
wound healing / collagen, hair-cycle mechanics, 5α-reductase / DHT / VEGF, any effect for the
light on its own, regrowth. The page copy guard list in `hairGenBoosterCopy.ts` and the audit
test (`productLocalizedCopyAudit.test.ts`) enforce it.

## Copy rewritten in the selling voice (EN / RU / AR)

The old page argued against the product: "what we are not going to tell you it does", a block
quoting and refusing the leaflet, "no efficacy study is held" in the spec, "Will it regrow my
hair? We are not going to tell you it will", and in AR/RU "0.3 mm not confirmed" and "no
documented comfort claim" (the leaflet documents it). All replaced:

- `components/product/hr3/hairGenBoosterCopy.ts` (EN; interface unchanged because product 48's
  copy imports it; unused `LEGACY_*` objects removed) and `hairGenBoosterLocalizedCopy.ts` (RU/AR,
  feminine address in AR as on the product 46 campaign).
- `data/productLocalizedCopyAudit.ts` product3Ru / product3Ar (description, details, features,
  benefits; directions keep the doctor line).
- `lib/products.ts` fallback (it still said anti-hair-loss, scalp regeneration, collagen, wound
  healing).
- DB via `scripts/update-product-3-campaign-gallery.ts --apply`: image, gallery, EN description /
  details / features / benefits / howToUse / directions, and `descriptionRu` / `descriptionAr`.

Honest guidance stays: contraindications, the running cost (behind the price gate: 92.50 vial +
57.50 stamp = 150 per session), "see a doctor first if hair falls out suddenly or in patches".

## System

- Plates: graphite (the renders' own near-black; pulling them to a set hex banded the noise on
  slide 6, so they are left as rendered) and silver `#D8DADC` (the ring). Type warm white `#F4F2EF`
  on graphite, graphite `#2A292A` on silver, numerals in the box copper `#E0957D` / `#A0553F`,
  BLUE. / RED. in the LED colours. Manrope Regular; Noto Sans Arabic Medium.

| # | Plate | Visual | Headline |
|---|---|---|---|
| Main | graphite | box + device, blue glow | (no type) |
| 01 | graphite | device, blue head glowing | IN. NOT ON. |
| 02 | silver | centre parting, comb | HAIR STARTS AT THE SCALP. |
| 03 | graphite | macro of the lit head | 52 MICRONEEDLES. |
| 04 | silver | HR³ vial with stamp + droplet, device | IT FEEDS AS IT STAMPS. |
| 05 | silver | woman, eyes closed, device on the crown | FEELS LIKE A MASSAGE. |
| 06 | graphite | two devices, blue and red | BLUE. RED. |
| 07 | silver | device, ripples in a water film | THREE SPEEDS. 280 · 330 · 400 |
| 08 | graphite | copper hourglass + device | TEN MINUTES. THEN IT STOPS. |
| 09 | silver | comb + device on a parting | PART. GLIDE. REPEAT. |
| 10 | graphite | three HR³ vials with stamps | FRESH EVERY TIME. |
| 11 | silver | box, device, USB-C cable | ALL IN THE BOX. |
| 12 | graphite | box + device, card | SCALP CARE, BOOSTED. |

RU concept line ВНУТРЬ. НЕ СВЕРХУ.; AR إلى الداخل. لا فوق الشعر.

## Render (CapCut, GPT Image 2.5 · 2k · Medium · 1:1)

13 jobs, one pass, no re-renders (208 credits; ~1,750 left). References built on white from the
desktop PNGs plus `~/Desktop/Insta_Olga/hair_sol/HAIR SOLUTION ALPHA 4ml_container with
applicator.png`: `ref_front`, `ref_blue`, `ref_bluered`, `ref_boxdevice`, `ref_vialdevice`,
`ref_vial`. Runner `_scripts/run_all.py` groups jobs by reference (one attach per group).
Picks: main 4, 01 1, 02 1, 03 1, 04 2, 05 3, 06 1, 07 2, 08 4, 09 1, 10 2, 11 1, 12 1.

## Typeset

`~/Desktop/hair_gen/campaign/_scripts/hairgen_slides.py [en|ru|ar|main] [n...]`, copy in
`hairgen_copy.py`. Every EN / RU / AR line 0 busy px within 28 px. RU shrinks only 01 (0.74) and
12 (0.74 / 0.83). Masters `final/NN.png`, `final/{ru,ar}/NN.png`, `final/_contact_{en,ru,ar}.jpg`.

## Site

- `public/images/hairgen_campaign/main.jpg`, `s1–s12.jpg`, `{ru,ar}/s1–s12.jpg` (1600 px, q88,
  4:4:4, progressive, 219–386 KB), registered in `lib/localizedProductImages.ts`.
- `HairGenBoosterProductPage.tsx`: gallery localized; the amber "what the leaflet claims" block is
  now "The idea" beside s4; s3 beside the specification cards; s9 replaces the packshot in How to
  use; s5 beside the stamp section; s11 beside the specification table.
- Cut-out: `cutout/3.webp` kept, report source moved to the new main,
  `lib/productCutouts.ts` regenerated.
- Old `/images/Booster.jpg` and `/images/Second/hair_*.jpg` stay on disk.

## Live check (27 Sep 2026)

- Code `68a60909f` live after ~4.5 min; DB `--apply` done (before: `/images/Booster.jpg` +
  `Second/hair_light|hair_box|hair_sol.jpg`); revalidated `/products/3` EN/RU/AR, `/`, `/products`
  EN/RU/AR.
- `/products/3`, `/ru/products/3`, `/ar/products/3`: new main + all 12 slides from the locale's own
  folder (no EN slide on RU/AR), old images gone, section figures s3/s4/s5/s9/s11 localized, new
  copy in all three; price FAQs hidden signed out.
- Mobile API `/api/mobile/products/3`: main + 12 slides, `ru/` and `ar/` per `x-locale`;
  `localizedDescription` carries the new RU/AR text.
- Still in the page payload (not rendered here): companion records 45 ("No efficacy study exists
  for this product") and 64 (`evidence`: "No efficacy study is held for the stamp or the device it
  fits"). Worth the same selling-voice pass on those two products.

## Dossier sweep (27 Sep 2026, same night)

Vadim: "read product page and remove dossier - we are selling". Read the live EN / RU / AR HTML,
rendered text and page payload.

- Rendered, now gone in all three languages: warranty "in line with the manual" -> "Two years from
  the date of purchase"; safety "other than those the manufacturer recommends" -> "Use it only with
  the HR³ products made for it"; the stamp-section note and the depth FAQ no longer explain away the
  Mesopecia Kit's 0.5 mm (the note now says a fresh stamp means sharp needles and the same feel).
  Same warranty line in the central RU/AR record and the DB keyFeatures.
- Payload: the page shipped the full records of its companions 45 / 64 / 47 / 46, with
  "per the product artwork ... neither the leaflet nor the manual", "No efficacy study ...", "the
  assessor notes ...", "registered as ...". Product 3 only links them, so `getRoutineProducts` now
  strips their long-form fields for link-only layouts (`LINK_ONLY_COMPANIONS = {'3'}`); layouts
  that add companions to the bag keep full records.
- Product 64 record (`scripts/fix-product-64-stamp-details-20260927.ts --apply`): `needleDepth`
  "0.3 mm, a cosmetic depth"; `evidence` removed. The mobile app shows productDetails.
- Kept: the Mesopecia Kit cross-sell ("the manual version", 0.5 mm roller, AED 1,100, behind the
  price gate), contraindications, and the see-a-doctor line.
