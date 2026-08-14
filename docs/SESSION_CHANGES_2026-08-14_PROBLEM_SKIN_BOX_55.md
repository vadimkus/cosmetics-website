# Problem Skin Care Beauty Box (#55) — bespoke page, claim fixes, artwork log

Date: 2026-08-14

Sixth bespoke page, and the fourth beauty box on the shared `BeautyBoxProductPage`
layout. Same pattern as #56, #57, #58 and #59: verify every claim against Intertek
and the DTS MG decks, fix whatever the database and the locale files got wrong,
then write the page in selling tone.

## What the box actually contains

Five products, resolved from `lib/routineStepLinks.ts`, not guessed:

| Step | # | Product | Size |
|---|---|---|---|
| 1 | 10 | Snow O₂ Cleanser | 120ml |
| 2 | 15 | Intensive Problem Control Toner | 200ml |
| 3 | 20 | Problem Control Serum | 30ml |
| 4 | 30 | Intensive Problem Control Cream | 50g |
| 5 | 36 | Soothing Bomb Sea Algae Mask | 3 × 25g |

## Claims fixed in the database

Script: `scripts/fix-problem-skin-box-55-claims-20260814.ts`

1. **Cream size, 50ml → 50g.** The box description said 50ml. The cream's own
   record, its carton and its COA all say 50g. Fixed in English, Russian and
   Arabic.
2. **Toner name.** The box said "Problem Control Toner". The carton, the product
   record and the professional deck all say **Intensive** Problem Control Toner.
   Fixed in the box description and in `routineProblemControlTonerTitle` across
   `messages/{en,ru,ar}.json`.
3. **Anti-microbial claim on the cream.** Product #30's description carried
   "anti-microbial" and "kills acne-causing bacteria" language, which reads as a
   drug claim on a cosmetic. Rewritten to the concept line the product is actually
   sold on: rebalancing oil and preventing breakouts while keeping skin hydrated.
   The `benefits` array was rewritten to match ("Clearer Skin", "Calming").
4. **Witch Hazel Extract → Witch Hazel Leaf Extract** on the mask (#36). The INCI
   and the deck both say leaf. Also corrected on box #56, which shares the card.
5. **Snow O₂ subscript.** "Snow O2" normalised to "Snow O₂" everywhere, including
   seven stray `howToUse` fields across the Russian and Arabic translation files
   that the earlier passes missed.

Locale script: `scripts/tmp/locales55.mjs`. Note that `data/productTranslations.ts`
carries **two** entries for box 55 (one keyed by CUID, one by productNumber), so
expected replacement counts for Arabic are 2 where you would expect 1. Same trap
as box 56.

## Names that are real and must not be "corrected" away

Learned the hard way on Phytolex. Both of these are DTS MG trade names with real
INCI behind them:

- **Anti Sebum P** — patented complex of David elm root, kudzu root, evening
  primrose flower and longleaf pine leaf.
- **SNOW ICE** — cooling complex on menthyl lactate plus two other cooling agents,
  works through TRPM8.

Also real: **Eucalace®** (the eucalyptus sheet on the mask), **Phytolex SC**,
**U-active®P10**.

### Where the toner claims are documented — read this before doubting them again

A verification pass searched the toner formula, its COA, its artwork and the DTS
MG **Homecare** deck and concluded that "Anti Sebum P" and "SNOW ICE" appear
nowhere, and that the non-comedogenic claim was unsupported. That conclusion is
wrong, and the reason is worth recording: the Homecare deck does not cover the
toner. Page 12 says so in as many words — *"Detailed information can be refereed
at the presentation of Professional treatment."*

Everything is in `~/Desktop/Training/Intensive training/GENOSYS FACIAL
TREATMENT_Professional_2025.pptx`:

| Claim on the page | Slide | What the slide says |
|---|---|---|
| Non-comedogenic, tested by QACS Ltd. | 27 | "certified as a non-comedogenic product... * Tested by QACS Ltd." |
| Sebum down about 50% in four weeks | 27 | "After using... for 4 weeks, the amount of sebum decreased by about 50%" |
| Anti Sebum P, patented | 29 | "A patented complex of botanical extracts to contract pores and control excessive sebum secretion", naming Ulmus Davidiana root, Pueraria Lobata root, Oenothera Biennis flower and Pinus Palustris leaf |
| SNOW ICE, cools through TRPM8 | 32 | "Complex of Menthyl Lactate, Ethyl Menthane Carboxamide, Methyl Diisopropyl Propionamide, Caprylic/Capric Triglyceride... activating TRPM8" |

All four botanicals in Anti Sebum P are in the toner formula at 0.00125% each,
and all three SNOW ICE cooling agents are there too. Composition and trade name
both check out.

The toner carries **no** Korean 기능성 (functional cosmetic) registration, and the
page does not claim one. The whitening licences belong to box #56.

## Clinical figures used on the page

All from the DTS MG professional and homecare decks, four-week measurements:

| Product | Sebum | Blemishes |
|---|---|---|
| Intensive Problem Control Toner | −50% | — |
| Problem Control Serum | −17% | −8% |
| Intensive Problem Control Cream | −14% | −9% |

Three of the five products in the box were measured. The `evidence.intro` says
exactly that — an earlier draft said "three of the four", which was wrong.

## Follow-up: the member products themselves

Script: `scripts/fix-problem-line-claims-20260814.ts`

Verifying the box turned up three problems that live on #15, #20 and #30 rather
than on the box.

**1. The Russian toner page listed ingredients the toner does not contain.**
Its five cards were witch hazel, aloe vera, niacinamide, salicylic acid and tea
tree. The first three are in none of the 31 ingredients in the formula. This was
a legacy translation that had never been checked against the product. Replaced
with the real five, matching the English and Arabic sets.

A structural check across the whole catalogue — comparing ingredient card sets
per product across the three locales, ignoring the Full INCI card that locales
correctly do not duplicate — now reports no mismatches anywhere. #15 was the only
one.

**2. Antimicrobial as a headline claim, in places the first pass missed.**
The cream's description and benefits were cleaned earlier the same day; its
`productDetails` and two ingredient cards were not, and the toner carried the
same phrasing on its tea tree card. The manufacturer's deck does say
"antimicrobial and anti-inflammatory" (Professional 2025, slide 26), so the claim
has a source — but it is drug register on a consumer page in this market, and it
now reads consistently across the line in all three locales. "Anti-inflammatory"
went the same way on the panthenol and beta-glucan cards.

**3. Willow bark sold as an exfoliant.** The serum card called Salix Nigra a
"natural salicylic acid source that gently exfoliates". The serum declares it at
**0.001%**, which is 10 ppm. It stays named — accurately, as
`Salix Nigra (Willow) Bark Extract` — as a clarifying botanical alongside zinc
PCA. It is not the exfoliating step. The serum contains no salicylic acid of its
own; that is the toner, also at 0.001%.

Also dropped: `"testing":"Dermatologically tested and clinically proven"` on the
serum. The patch test supports "dermatologically tested". "Clinically proven" is
a step beyond what is on file.

### Deliberately not changed

The site's Full INCI strings mirror the printed cartons, **including** the Zinc
PCA ordering error. The pack is what the customer holds, so the two should agree.
The reorder is logged as an artwork correction instead.

The toner keeps its "gently exfoliates and removes impurities" benefit. Slide 32
credits salicylic acid with promoting exfoliation and removing sebum remnants in
this product specifically.

## Page

- Copy module: `components/product/beautybox/copy/problemSkin.ts`
- Registered in `components/product/beautybox/beautyBoxes.ts`
- Palette: **`bb-pine`**, new, in `components/product/beautybox/beautybox.css`.
  Deep cool green. The three sea algae sachets are the only saturated colour in
  the box photograph, and green is the one hue no other box page uses. The blue on
  the toner and cream bands sits close to `bb-water` (#59), so taking the green
  keeps 55 and 59 from reading as the same page.
- Wired into `components/product/bespokePdp.tsx` and the allow-list in all three
  `app/[locale]/products/[id]/page.tsx` route files.

### Selling tone

Hero leads with the outcome, not the dossier:

> Less oil in four weeks. Fewer breakouts after it.

A tone sweep (`scripts/tmp/tone55.mjs`, 11 replacements across all three locales)
removed the last of the audit-register phrasing: "the manufacturer's own second
method", "the manufacturer calls SNOW ICE", "allergens declared". Per
`.cursor/rules/selling-tone.mdc`, if a claim is good enough to print we make it in
our own voice.

## Bidi fixes (Arabic)

1. **Fact chip direction.** "Anti Sebum P، براءة اختراع" put a Latin run first,
   which flipped the chip's base direction and stranded the comma. Reordered so
   the Arabic leads, and standardised on "زنك PCA" throughout.
2. **Item size.** "1 sheet (25g)" rendered as "sheet (25g) 1". Fixed by adding
   `dir="auto"` to the size `span` in
   `components/product/beautybox/BeautyBoxProductPage.tsx` — this benefits every
   beauty box page, not just 55.

Verified: `Eucalace®` inside its LRI/PDI isolate renders with the ® at the right
edge of the Latin run, which is correct in RTL flow. Not a bug.

## Artwork

Thirteen rows under #55 in `~/Desktop/genosys-artwork-corrections.html`. The box
photograph itself is genuine product photography with all five reorder codes
correct, so unlike #56, #57 and #58 it does **not** need regenerating. Everything
below is carton text.

The one worth doing first:

- **Zinc PCA is printed fifth in the INCI list on both the cream and the serum**,
  and it is declared at 0.050%. On the cream it sits above three ingredients
  present at 0.5–0.7%. That is a descending-order compliance problem, not a
  wording preference, and it should be corrected before the next EU or GCC
  submission. Cream: move to roughly position 14–15. Serum: roughly position 12.

The rest, for the next print run:

- Cream inner panel says 1.7 oz where the outer carton says 1.76 oz. 50 g is
  1.76 oz, so the inner panel is the wrong one.
- Cream French panel heads the safety warnings "Fonction" instead of "Précaution".
- Toner Spanish panel: "hichazón" should be "hinchazón", in the adverse-reaction
  warning.
- Toner Russian panel sends the customer to the bottom of the "туба" for the batch
  code. It is a spray bottle; there is no tube.
- Toner Turkish panel drops "Intensive" from the product name.
- Toner front panel reads "NET WT. 200ml", mixing a weight abbreviation with a
  volume unit. The Russian panel on the same pack already gets this right.
- Serum front panel: "improve skin breakouts" and "contributing to excessive sebum
  control" both say the opposite of what is meant.
- Serum carton has no net content printed.
- Mask sachet detail mismatches.

If any image is replaced, it needs a new filename — `/images/*` is served
immutable for a year.

## Open

- The four-week sebum and blemish figures come from the DTS MG decks with no named
  testing house and no volunteer count attached. Same footing as the P&K citation
  on #58: real-looking, no invented percentages, low risk while the source is
  chased. Ask DTS MG for the study reports behind the toner's 50% and the serum
  and cream's 17/8 and 14/9.
- P&K skin age index study report still to be requested from DTS MG (carried over
  from #58).
- Re-export of the flagged slides for #10, #29, #55, #56, #57, #58, #60, #61,
  #63, #64, #65, #66.
