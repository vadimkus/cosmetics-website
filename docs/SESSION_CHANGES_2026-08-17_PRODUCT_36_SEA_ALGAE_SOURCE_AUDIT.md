# Product 36 — SOOTHING BOMB SEA ALGAE MASK — source audit

Groundwork for the bespoke page. Every figure is read from a source document.

## Documents read

`~/Desktop/Drive/Genosys/Registration/Intertek/Soothing Bomb Sea Mask/`

- `Ingredient_Report_GENOSYS SOOTHING BOMB SEA ALGAE MASK.pdf` — the full
  quali-quanti formula, signed by the DTS MG R&D manager. This is the document
  that decides what the page can say.
- `COA-GENOSYS SOOTHING BOMB SEA ALGAE MASK.pdf` — lot LE001.
- `Front.jpg` and `Back.jpg` — photographs of the actual pouch, both faces.
- `GENOSYS SOOTHING BOMB SEA ALGAE MASK.pptx` — the 10-slide DTS MG deck.
- `GENOSYS training manual-SOOTHING BOMB SEA ALGAE MASK.docx`.
- `Certificafe of Free Sales-...pdf` (folder spells it that way).

## The formula, and the thing the current copy gets wrong

| Ingredient | % w/w | What it is |
|---|---|---|
| Aqua | to 100 | |
| **Methylpropanediol** | **10.00** | humectant / solvent |
| **Glycerin** | **5.035** | humectant |
| Dipropylene Glycol | 1.00 | solvent |
| 1,2-Hexanediol | 0.504 | solvent |
| **Betaine** | **0.50** | osmolyte humectant |
| Carbomer | 0.23 | thickener |
| Chlorphenesin | 0.15 | preservative |
| **Allantoin** | **0.10** | soothing, at a real dose |
| Tromethamine | 0.10 | pH adjuster |
| **Panthenol** | **0.10** | provitamin B5, at a real dose |
| Ethylhexylglycerin | 0.050 | |
| Dextrin | 0.045 | |
| Polyglyceryl-10 Laurate | 0.040 | |
| Polyglyceryl-10 Myristate | 0.035 | |
| Butylene Glycol | 0.024 | |
| Disodium EDTA | 0.020 | |
| **Gardenia Florida Fruit Extract** | **0.0196** | **colorant — this is what makes it green** |
| Xanthan Gum | 0.015 | |
| Mentha Piperita (Peppermint) Oil | 0.005 | the cool note, 50 ppm |
| **Jania Rubens Extract** | **0.001** | **10 ppm** |
| **Undaria Pinnatifida Extract** | **0.001** | **10 ppm** |
| Phenoxyethanol | 0.00016 | |
| Hamamelis Virginiana Leaf Extract | 0.0001 | **1 ppm** |
| Centella Asiatica Extract | 0.0001 | **1 ppm** |
| Castanea Crenata Shell Extract | 0.0001 | **1 ppm** |
| Bambusa Vulgaris Extract | 0.0001 | **1 ppm** |
| Tocopherol | 0.00005 | |

**The sea algae and the centella are at 10 ppm and 1 ppm.** Every piece of copy
we currently run — the site description, the DB `keyFeatures`, the DB
`benefits`, the deck, the training manual — leads on "sea algae complex and
centella asiatica extract" as though they were the actives. At these doses they
are label ingredients. Same call as Volufiline on product 41.

**What actually hydrates this mask is boring and real:** methylpropanediol 10%,
glycerin 5.04% and betaine 0.5%. **What actually soothes it** is allantoin 0.1%
and panthenol 0.1%, both of which are functional at that level and both of
which the deck already describes correctly on slide 9.

Write the page on the humectants and the sheet. Name the algae; do not build on
them.

**GENOSYS already print the doses.** The back of the pouch reads "Jania Rubens
Extract(10ppm)" and "Undaria Pinnatifida Extract(10ppm)" in the ingredient
list. The brand is not hiding this, so neither should the page.

## The sheet is the real story

Deck slide 2, and it is checkable material engineering rather than marketing:

- **Eucalace® spunlace nonwoven, made from eucalyptus.**
- Finer fibres and a higher fibre count than other nonwovens of the same area,
  so it carries and delivers more essence.
- High adhesion and transparent, so it sits on any face shape.
- Excellent air permeability compared with other nonwovens — breathable, which
  the deck links to preventing hypersensitivity.
- No chemical residue; the fabric surface is clean and soft, so it is not
  irritating.

For a AED 36 single sheet, the fabric is the differentiator. Lead with it.

## COA, lot LE001

| Test | Specification | Result |
|---|---|---|
| Net weight | > 25.0 g | 25.10 g |
| pH at 25 °C | 5.00–6.00 | **5.69** |
| Specific gravity | 0.990–1.030 | 1.0144 |
| Viscosity | 2,500–3,500 | 2,707 |
| Total aerobic bacteria | < 100 cfu/g | **< 10** |
| Fungi | < 100 cfu/g | pass |
| Appearance | transparent viscous liquid | pass |
| Colour | green | pass |

Made 11 May 2021, expiry 10 Nov 2023 — a **30-month** shelf life. Manufactured
by GENIC Co., Ltd — contract manufacturer, **do not name on the page**. DTS MG
is the brand owner and appears on the pouch.

## What the pouch actually says

Front: the product name, "PROVIDES INTENSIVE RELIEF TO THE SKIN AND MOISTURIZES
SKIN WITH SEA ALGAE AND CENTELLA ASIATICA EXTRACT.", the SAM PROFESSIONAL mark,
and "GENOSYS is a compound word of Gene Re-birth System".

Back: the same line, the full INCI with the ppm figures, application, NET WT.
25g / 0.88 oz, DTS MG Seoul, Made in Korea, EAN 8809579273974.

**"* The product does not contain any artificial pigment"** is printed on both
the pouch and deck slide 3, and the formula backs it: the green is gardenia
fruit extract. That is a claim worth using because it is verifiable.

Precautions as printed: external use only; avoid eyes and mucous membranes and
rinse with cool water on contact; do not use near the eyes; keep cool and dry;
out of reach of children; stop and see a doctor on redness, swelling or
irritation; **use with caution if you react to bandages or compresses**; use
immediately after opening.

## Claims that must not go on the page

- **"Dermatologically tested."** It is on our studio slides S1 and S5 and in
  the legacy `lib/products.ts` description. It is **not** printed on either
  pouch face and there is no dermatological test report in the dossier folder.
  Unless someone produces one, it comes off.
- **"Efficacy test on skin hydration."** Same: in the legacy description, no
  report anywhere in the pack. No hydration percentage may be printed.
- **The ingredient-dictionary claims on deck slides 6 to 9** — wound healing,
  collagen synthesis, tyrosinase inhibition, sebum control, pore tightening,
  detoxifying, anti-inflammatory. All are attached to ingredients dosed at 1 to
  10 ppm. State what the ingredients are; do not attach effects to them.
- **The contract manufacturer's name**, and the **lot code**.

## Errors found in our own material

To be logged in `~/Desktop/genosys-artwork-corrections.html`:

1. **Studio slide S5 prints "23g".** The pack is **25 g**. Wrong net weight.
2. **Slides S1 and S5 print "Dermatologically Tested"**, which nothing in the
   pack supports.
3. **The pouch renders on S1 and S3 carry garbled type** — "PROVIOF3 ANEVGVE
   REUEF TO THE SKIN", "GENOSYS it a vompound word of". Same generated-render
   problem as the Charming Look box.
4. **Deck slide 3 names the wrong product**: "GENOSYS EPI TURNOVER BOOSTING GEL
   provides intensive relief…", and slide 6 is footered "EPI TURNOVER BOOSTING
   PEELING GEL". A DTS MG copy-paste error, theirs not ours, but worth telling
   them.

## Pack and commercial

- AED 36, one 25 g sheet, category Mask, in stock.
- Gallery already wired in the DB: `Main.jpeg` plus `S1`–`S6`, and a video at
  `/videos/sea_mask.mp4`.
- Sold in boxes of 10 in the professional line (`25g x 10ea` in the legacy
  description); the site sells the single sheet.
- Application per the pouch: after cleansing, prep with GENOSYS SNOW BOOSTER,
  apply closely, 15–20 minutes, pat the rest in.
- It is one of the two masks given free at the AED 500 and AED 700 cart
  thresholds, so a lot of customers meet this product without choosing it.
