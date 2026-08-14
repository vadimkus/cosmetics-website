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

## Clinical figures used on the page

All from the DTS MG professional and homecare decks, four-week measurements:

| Product | Sebum | Blemishes |
|---|---|---|
| Intensive Problem Control Toner | −50% | — |
| Problem Control Serum | −17% | −8% |
| Intensive Problem Control Cream | −14% | −9% |

Three of the five products in the box were measured. The `evidence.intro` says
exactly that — an earlier draft said "three of the four", which was wrong.

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

Five rows added to `~/Desktop/genosys-artwork-corrections.html` under #55:

1. Serum carton copy is misleading about what the product does.
2. No net content printed on the serum carton.
3. Deck errors on the cream slide.
4. Mask sachet detail mismatches.
5. Missing volume markings.

These need the designer and a re-export under new filenames — `/images/*` is
served immutable for a year, so a replacement must not reuse a filename.

## Open

- P&K skin age index study report still to be requested from DTS MG (carried over
  from #58).
- Re-export of the flagged slides for #10, #29, #55, #56, #57, #58, #60, #61,
  #63, #64, #65, #66.
