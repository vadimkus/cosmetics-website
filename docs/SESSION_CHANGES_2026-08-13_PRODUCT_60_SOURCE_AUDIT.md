# Product 60 (BIO-MESO PDRN Expert Ampoule 60000) - source audit

Date: 2026-08-13
Status: research complete, bespoke page not yet built.

Groundwork for the bespoke PDP, gathered before writing any copy so the page can
be built from documents rather than from the existing database text.

## Documents used

All under `/Users/vadimkus/Desktop/Drive/Genosys/Registration/Intertek/Bio-Meso PDRN &amp_gt_&amp_gt_documents for registration Dubai/`:

| File | Gives |
|---|---|
| `Formula-GENOSYS BIO-MESO PDRN EXPERT AMPOULE 60000.pdf` | Full INCI with percentages |
| `COA-GENOSYS BIO-MESO PDRN EXPERT AMPOULE 60000.pdf` | Lot 001EH, pH, viscosity, micro |
| `Artwork-GENOSYS BIO-MESO PDRN EXPERT AMPOULE 60000.pdf` | On-pack claims, usage, barcode |
| `Meso/Origin-BIO-MESO™ PDRN.pdf` | Raw material origin per INCI |

Plus `BIO-MESO PDRN HOMECARE AMPOULE/Formula-…5000.pdf` for the sibling
comparison, since product 65 is the same formula at a different spicule load.

## What the "60000" actually means

This was the main thing worth establishing, because it is the product's name and
the page will have to explain it.

It is the BIO-MESO™ PDRN complex loading in ppm, roughly 6% w/w. Per the origin
certificate the complex is Hydrolyzed Sponge + Calcium Silicate + Sodium
Silicate + Sodium DNA + Hydrogenated Lecithin + Glycerin + 1,2-Hexanediol +
Ethylhexylglycerin. Summing the Expert formula's share of those lands at
approximately 60,000 ppm, and the artwork states `BIO-MESO PDRN 60,000ppm`
directly.

It is **not** the PDRN content. Sodium DNA is 0.112% = 1,120 ppm, and the
artwork prints `Sodium DNA (1120ppm)` in the ingredient list to say so.

## Expert 60000 vs Homecare 5000, from the two formulas

The two products are close to the same formula. Almost the entire difference is
spicule load:

| Ingredient | Homecare 5000 (#65) | Expert 60000 (#60) | Ratio |
|---|---|---|---|
| Hydrolyzed Sponge (spicules) | 0.476685% | 5.72022% | **12.0x** |
| Hydrogenated Lecithin | 0.005018% | 0.060018% | 12.0x |
| Calcium Silicate | 0.0033705% | 0.040446% | 12.0x |
| Sodium Silicate | 0.0014445% | 0.017334% | 12.0x |
| Sodium DNA (PDRN) | 0.101% | 0.112% | 1.11x |
| Niacinamide | 2.0% | 2.0% | same |
| Panthenol | 1.0% | 1.0% | same |
| Adenosine | 0.04% | 0.04% | same |

So the honest framing is: same actives, twelve times the spicule delivery. The
PDRN is essentially identical between the two. Do not let the page imply the
Expert has twelve times the PDRN.

The Expert also swaps Cetyl Ethylhexanoate (0.9%) for Caprylic/Capric
Triglyceride (1.0%) and halves the carbomer and polyisobutene, which is
consistent with carrying a much heavier spicule load in a thinner base.

## Verified on-pack claims

| Claim | Verified against |
|---|---|
| BIO-MESO PDRN 60,000 ppm | Artwork, corroborated by formula sum |
| Panthenol 10,000 ppm | Artwork; formula says Panthenol 1.0% = 10,000 ppm |
| Peptide, 17 types | Counted in the INCI: 9 sh-peptides + 8 signal peptides = 17 |
| Sodium DNA 1,120 ppm | Artwork ingredient list; formula 0.112% |
| Dual-functional cosmetic (Korea) | Artwork `미백·주름개선 2중 기능성 화장품` |
| Functional actives | Artwork `효능성분 나이아신아마이드, 아데노신` |
| 3ml x 4ea | Artwork `용량 3ml x 4ea` |
| Barcode 8809849808189 | Artwork EAN, matches `data/productBarcodes.ts` |
| Made in Korea | Artwork |

The 17-peptide count is exactly checkable, which is unusual and worth using.
Counted: sh-Polypeptide-22, sh-Oligopeptide-1, sh-Polypeptide-1,
sh-Polypeptide-9, sh-Oligopeptide-2, sh-Polypeptide-11, sh-Polypeptide-3,
sh-Polypeptide-16, sh-Polypeptide-62, Acetyl Hexapeptide-8, Copper
Tripeptide-1, Hexapeptide-9, Nonapeptide-1, Palmitoyl Pentapeptide-4, Palmitoyl
Tripeptide-1, Palmitoyl Tetrapeptide-7, Tripeptide-1.

Note this is a **dual**-functional registration (brightening + wrinkle), unlike
Revita Glow which is triple-functional because it adds sun protection.

## Raw material origin

From the certificate of origin, issued by H&B Labs, 27 May 2025:

| INCI | Origin | Source |
|---|---|---|
| Hydrolyzed Sponge | Russia | Freshwater sponge |
| Calcium Silicate | Russia | Freshwater sponge |
| Sodium Silicate | Russia | Freshwater sponge |
| Sodium DNA | Japan | Salmon milt |
| Hydrogenated Lecithin | Korea | Soybean |
| Glycerin | Malaysia | Palm |
| 1,2-Hexanediol, Ethylhexylglycerin | Korea | Synthesis |

The spicules are freshwater sponge, not marine sponge, and the two silicates are
the mineral fraction of the same sponge rather than separate additives. The PDRN
is salmon-milt derived, which confirms the wording already in the database.

## COA, lot 001EH

Appearance white lotion, odour typical. Viscosity 5,210 against a 4,700 +/- 1,400
spec. pH 7.27 against 6.70 +/- 1.00. Specific gravity 1.029. All five microbial
tests not detected. Net volume 4.24ml against a 3ml declaration.

pH 7.27 is near neutral, which is the right window for niacinamide stability.

## Usage, from the artwork

Not a leave-on serum. The pack instructs: avoid eyes and lips, apply evenly,
press gently for absorption, then roll. After applying INTENSIVE HYDRO SOOTHING
CREAM, roll again for full absorption. So it is used with a roller and layered
under product 28.

Worth flagging: the existing routine for 60 in `lib/productRoutines.ts` is
10, 60, 52, 25, which ends on Soothing Repair Postcream (#25) rather than the
Intensive Hydro Soothing Cream (#28) the pack names. Decide before build whether
to follow the pack or leave the routine as it stands.

Contraindications on pack, which the page should carry: not for pustular acne,
rosacea, open wounds, or skin that has had facial procedures. PAO 12 months.

## Clinical study - this one is real

Unlike product 65, product 60 has an actual clinical test on file. It is in
`public/documents/ppt/GENOSYS_BIO_MESO_PDRN_EXPERT_AMPOULE_60000.pdf`, not in
the Intertek folder, which is why the first pass missed it. The companion
`…incl Test Results_S.pdf` has the same slides with the images stripped out, so
use the 5 MB file.

Run by KC Skin Research Center, Seoul, 11 August to 9 September 2025.
20 female subjects, age 48 +/- 8. Single-arm with an untreated control site.

| Measure | 1 week | 2 weeks | 4 weeks |
|---|---|---|---|
| Periorbital wrinkles (decrease) | 4.795% | 5.752% | **7.446%** |
| Skin elasticity | 5.675% | 14.956% | **19.858%** |
| Skin moisture content | 18.958% | 32.824% | **52.247%** |
| Skin density | 1.037% | 2.564% | 4.423% |
| Cheek lifting angle | 1.777% | 3.149% | 3.634% |
| Skin tone | 1.059% | 1.687% | - |

Also measured: dermal absorption extent, depth and rate against a control
product, and skin exfoliation rate by Janus 1 Mark II UV imaging.

Adverse reactions: erythema, swelling, itching and stinging all recorded as none
at every timepoint.

This validates the three percentages already in the product's `benefits` field.
They are real. Round them to one decimal on the page, because quoting 7.446%
from a 20-person panel reads like false precision, and state n and duration
alongside.

## Other verified claims from the brochure

- **1.0 mm needle equivalent**, recommended once a month. Product 65 Homecare is
  the 0.25 mm equivalent used weekly. This is the cleanest way to explain the
  difference between the two to a shopper.
- **300,000 to 360,000 spicules per 1 ml**, which confirms the figure already in
  the database.
- **3rd generation cog spicule**, phytosome-coated, which confirms the
  `technology` field.
- Spicule concentration context: mild homecare 0.01-0.3%, professional care
  0.3-5%, above 1% for trained professionals only. GENOSYS Homecare is 0.5% and
  the Expert is 6%, so the Expert sits above the normal professional band.
- Phytosome versus liposome: a liposome physically traps actives in the aqueous
  core and needs membrane disruption to release them, a phytosome chemically
  binds actives to the phospholipid head group and delivers them still bound.
- Downtime: mild irritation up to 3 days, exfoliation around day 2 to 3.
- Retinoid protocol: stop 7-10 days before, 14 days for 0.05-0.1% tretinoin, do
  not resume for 14 days after, defer 6 months after oral isotretinoin.
- Eight contraindications, listed in full in the deck.
- Clinic protocol ends on Soothing Repair Postcream, so the site's existing
  routine for product 60 is supported by the manufacturer's own sequence. The
  earlier concern about #25 versus #28 was unfounded; the deck uses both, with
  Hydro Soothing Cream mid-protocol and Postcream at the end.

Two copy-paste errors exist in the manufacturer's deck: the Phytosphingosine
block repeats the PDRN text, and the CeraShield-5 block repeats the Panthenol
text. Palmitoyl Tripeptide-1 is also listed twice. Do not reproduce these.

## Not to be used on the page

- Peptide concentrations. Most of the 17 sit at 1e-10 %, so the count is a fair
  claim but the dose is not. Same discipline applied to Adenosine on product 63.
- Collagen and Elastin are present at 5e-9 %. Listing them is accurate, implying
  they do anything at that level is not.
- Peptide-by-peptide efficacy language. The clinical study measured the finished
  product, not individual actives, so results belong to the ampoule as a whole.

## Assets in place

- `public/images/6000/`: `main.jpg` plus `S1`-`S6.jpeg`, six gallery images
- Database record has `productNumber` "60", trilingual names, benefits,
  ingredients, productDetails and howToUse already populated
- Routine already defined, barcode already mapped
- Design system reusable from product 65: `biomeso.css` and the Cera primitives

## What was built

`BioMesoProductPage.tsx` was parametrised rather than copied. It now takes a
`BioMesoPageConfig` (product number, copy getter, two inline images, brochure
URL, log label), so products 60 and 65 share one component. The alternative was
a second 900-line file that would drift from the first within a month.

- `components/product/biomeso/biomesoExpertCopy.ts` - trilingual copy for 60
- `components/product/biomeso/BioMesoExpertProductPage.tsx` - the config wrapper
- Registered in `components/product/bespokePdp.tsx` and the three route files

The `clinical` block on `BioMesoCopy` is optional. Product 65 has no study, so
it passes nothing and the section does not render. Product 60 fills it.

## Database correction applied

The live `ingredients` Full INCI for product 60 did not match the carton. It was
missing `1,2-Hexanediol` and carried `Sodium DNA` without the `(1120ppm)`
annotation the carton prints. Fixed by `scripts/fix-product-60-inci-20260813.ts`
after a dry run, with a backup of the prior value. This matters beyond the page:
the same string feeds the mobile API and the Arabic and Russian ingredient
fallbacks.

## Decisions worth remembering

- Clinical percentages are carried at two decimals (`-7.45%`, `+19.86%`,
  `+52.25%`) because gallery slide `S5.jpeg` prints them that way. Rounding to
  one decimal on the page while the image beside it shows two reads as an error.
- `S4.jpeg` is the mechanism figure and `S3.jpeg` is the ritual figure. The first
  pass had these swapped; both were checked against the rendered page.
- "60000" is the BIO-MESO complex at 6% w/w, not a PDRN figure. PDRN sits at
  1120ppm. The copy says so plainly rather than letting the number imply dose.

## Image aspect ratio - the one real layout bug

Product 60's slides are 1200x896 (4:3). Every other bespoke product ships square
1024x1024 exports, and the layout had that assumption baked in as `aspect-square`
plus `object-cover` in two places. On product 60 that cropped roughly a quarter
of the width off each slide, taking the headline printed inside the artwork with
it.

Two different fixes, because the two cases have different constraints:

- **Inline figures** (mechanism and protocol) can simply follow the artwork, so
  the aspect class moved into `BioMesoPageConfig` as `figureAspect`. Product 65
  passes `aspect-square`, product 60 passes `aspect-[4/3]`. No crop, no bars.
- **Gallery stage** cannot resize per slide or the page would jump every time a
  thumbnail is clicked. It stays square and switched from `object-cover` to
  `object-contain`, letterboxing the wide slides onto the `#f1efee` stage tint.
  The `cera-stage` CSS comment had already anticipated exactly this case.

Switching the stage is a no-op for products 63, 64, 65 and 66: a square image in
a square stage renders identically under cover and contain. Verified by measuring
the rendered image box on all four, which came back 544x544 inside a 544px stage,
meaning the image still fills it edge to edge.

Thumbnails moved to `object-contain` too, so the preview matches the framing the
shopper gets after clicking.

If a future product ships non-square art, `figureAspect` is the knob. The gallery
needs no further change.

## 21 August 2026 RU/AR high-rigor localization pass

The Russian and Arabic customer copy was re-audited against the primary-source
set rather than inheriting every mechanism statement in the training deck.
Where the deck makes a stronger training or analogy claim than the registered
artwork and quantitative formula can support as cosmetic page copy, the RU/AR
site now uses the narrower statement.

### Final source conclusions

- The registered pack is **4 × 3 ml**. The old Russian `2 ml × 5` value is not
  retained.
- **60000 means 60,000 ppm of the complete BIO-MESO™ PDRN complex.** It is not
  the Sodium DNA concentration and not a spicule count.
- The quantitative formula gives **Hydrolyzed Sponge 5.72022%**. The raw-material
  origin file identifies freshwater sponge from Russia. The formula itself does
  not publish a separate spicule count, so RU/AR customer copy does not use the
  deck's 300,000–360,000-per-ml estimate as a formula fact.
- **Sodium DNA is 0.112% / 1,120 ppm**, and the origin file identifies salmon
  milt from Japan.
- **Niacinamide 2%, Panthenol 1% / 10,000 ppm and Adenosine 0.04%** are
  quantitatively supported.
- Seventeen peptides and five ceramides are present, but most peptide and
  ceramide levels are trace. RU/AR lists their presence without assigning a
  working dose, growth-factor effect, collagen effect or barrier-repair result.
- The exact-product clinical material is usable with qualification: KC Skin
  Research Center, 20 women aged 48 ± 8, one application, readings at weeks 1,
  2 and 4. At week four the report records changes from baseline of **-7.446%
  periorbital wrinkles, +19.858% elasticity and +52.247% moisture**. The RU/AR
  copy no longer implies that all three longitudinal endpoints were treatment
  versus untreated-control comparisons.
- The official material supports **professional / trained-practitioner use**.
  It does not establish that UAE law reserves the product specifically to
  licensed aestheticians or dermatologists, so those professional titles are
  not asserted.

### Claims deliberately removed from live RU/AR

The page, quick facts, recommendation card, routine text, SEO/category copy,
chatbot prompt and skin-analysis fallback no longer positively claim:

- temporary microchannels or epidermal penetration
- deep delivery of PDRN or other actives
- equivalence to a 1.0 mm needle or needle-free microneedling
- collagen or elastin stimulation
- cell regeneration, cytokine control, healing or barrier repair
- turnover, bio-peeling or exfoliation as a product benefit
- an obligatory monthly cadence or a two-way 60000/5000 system

The training material's possible mild irritation up to three days and possible
flaking around days two to three are described only as possible responses.
Severe pain, swelling or worsening irritation is never normalised.

### Directions and safety boundary

The live RU/AR directions follow the artwork sequence: avoid eyes and lips,
spread evenly, press gently, perform rolling, apply Intensive Hydro Soothing
Cream, and roll again until the ampoule is absorbed. The artwork does not state
a numeric facial dose, contact time, rinse step, treatment interval or course,
so none was invented.

The carton and extended official material support excluding pustular acne,
rosacea, open wounds, active infection, pronounced hypersensitivity,
autoimmune skin disease, recent dermatological procedures, skin cancer or
precancerous lesions, and recent sunburn/tanning. The old fixed retinoid and
isotretinoin timelines are not retained as customer instructions because the
registered artwork does not set them; the treating clinician or practitioner
must make that decision for the specific medicine and skin condition.

### Implementation

- Canonical RU/AR payload: `data/product60LocalizedCopy.ts`
- Canonical map wiring: `data/productTranslations.ts`,
  `data/productTranslationsRu.ts`, `data/productLocalizedCopyAudit.ts`
- Bespoke runtime: audited RU/AR overlays in
  `components/product/biomeso/biomesoExpertCopy.ts`
- Idempotent production updater:
  `scripts/update-product-60-localized-copy-20260821.ts`
- Focused regression tests:
  `__tests__/data/product60LocalizedCopy.test.ts`

The updater enforces `productNumber = 60`, `size = 3 ml × 4 ampoules`, exact
RU/AR parity and `null` for unsupported `skinType`, `targetConcerns`, `usage`
and `ageGroup`.
