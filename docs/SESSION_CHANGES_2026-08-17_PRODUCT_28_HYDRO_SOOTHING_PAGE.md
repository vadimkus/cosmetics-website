# Product 28 — INTENSIVE HYDRO SOOTHING CREAM — bespoke page

Source audit: `SESSION_CHANGES_2026-08-17_PRODUCT_28_HYDRO_SOOTHING_SOURCE_AUDIT.md`.

## The rule earned its place

Product 28 is on the list of products where a previous audit went wrong by not
reading the safety assessment trade-name tables and the DTS MG decks. Following
that rule changed the outcome twice on this product.

**It saved a claim.** The Intertek assessment records *"Other Tests: None
presented."* On the dossier alone, our *"Efficacy test on skin hydration"* is
unsupported and I would have deleted it. The DTS MG homecare deck carries a
**CLINICAL TRIAL DATA** page for this exact product — positioned between its
ingredient pages and the next product — with two endpoints:

- **skin hydration +12% after four weeks**
- **skin temperature down about 1 °C, twenty minutes after application**

**And it found one we had never used.** The cooling figure appears nowhere on the
site, in any language, and it is the more distinctive of the two — no other GENOSYS
product measures a temperature change. It is now the page headline.

Both are presented with their limits stated in the same breath: the deck names no
laboratory, no subject count, no method and no instrument. The page calls them the
manufacturer's measurements, honestly reported, and not a published trial, and says
we have asked for the report.

## The premix trap, explained rather than hidden

Our description named **snail secretion filtrate second**, ahead of everything but
aloe. It is at **10 parts per million**.

The reason is instructive enough to put on the page. The supplier sheet lists what
goes into the mixing tank: `SNAIL MUCOUS EXTRACT-WP` at 0.100%. That raw material
is only **1.00% filtrate**, the rest water and glycols, so the finished cream holds
0.0010%. **Overstated one hundred fold.** Beta-glucan works the same way and lands
at 4 ppm; the Phytolex trio at 75, 1 and 0.5 ppm against 0.100% each on the sheet.

Only the safety assessment's Table I carries the purity column that lets you
compute any of it — which is exactly what the rule is about.

The page shows the sheet figure against the real figure for seven ingredients and
explains the mechanism, marking the two where the sheet figure **is** the real
figure (the pumpkin ferment, and betaine, which is added neat). Explaining it is
better than quietly reordering, because it generalises: this is how most trace
ingredients get oversold across the industry.

## Betaine at 5% is the actual engine, and we never mentioned it

With butylene glycol at 10.555% and glycerin at 6.175% that is **21.7%
humectants**. Betaine is an osmolyte, and 5% is a high dose where typical cosmetic
use is 0.5–2%. DTS MG's own deck credits it with hydration and with calming redness
— so the manufacturer knew, and our copy still managed to omit it entirely while
leading on a 10 ppm ingredient.

It also explains the texture: a transparent gel-cream with almost no oil phase,
which is why it absorbs without a film and why the measured cooling is plausible.

## The Gulf framing is sourced, not invented

GENOSYS's own `Protocol_Hydration_Treatment.pdf` describes the local problem in the
brand's words: desert humidity *"often <20%"*, air conditioning creating an
*"artificial desert indoors"*, and temperature shock moving between the two. Paired
with the measured −1 °C, that gives the product a specific and honest reason to
exist in this market rather than a generic hydration pitch.

## Newly disclosed

- **Not vegan.** Snail secretion filtrate, for 10 ppm. Nothing said so before.
- **No conventional preservative.** No paraben, no phenoxyethanol — protection is
  from glycols, mainly 1,2-hexanediol at 2%. Also **no perfume at all and no
  declared allergens**, which is unusual in this range and worth selling.
- **Period after opening: six months**, from the carton's 6M symbol.
- **Do not use on broken skin**, Korean precaution 2, same as product 25.
- **Transparent gel-cream**, per both the COA and the assessment. Our record called
  it a "gel" while the name says cream; gel-cream is the accurate word.
- **No functional licence** — the carton reads "Function Hydrating, soothing" with
  no `기능성화장품` bracket, which is why neither certificate carries an assay.

## Files

| File | Change |
|---|---|
| `components/product/hydrosoothing/hydroSoothingCopy.ts` | New. EN/AR/RU. |
| `components/product/hydrosoothing/hydrosoothing.css` | New. Cool aqua, plus a finding-card style for the two measured numbers. |
| `components/product/hydrosoothing/HydroSoothingProductPage.tsx` | New bespoke page. |
| `components/product/bespokePdp.tsx` | Registered 28; companions 32, 25, 29, 14. |
| `app/{,ar/,ru/}products/[id]/page.tsx` | Added 28 to the allow-lists. |
| `scripts/update-product-28-hydro-soothing-record-20260817.ts` | Record fix, applied. |
| `lib/productsDb.ts` | Cache key v47 → v48. |

## Verification

Typecheck, lint and the full Jest suite (68 suites, 490 tests) pass. Clean checkout
production build passes. Browser pass on all three locales with zero console errors.

## Open items

1. **The EU safety assessment is stale.** Dated 2014 for a 2013 formula, while the
   current formula adds four ingredients (Nelumbo, Prunus mume, lactic acid, citric
   acid) and moves three concentrations materially — aloe 20× down, beta-glucan
   ~200× down, sodium hyaluronate 100× up. Needs reassessment.
2. **Request the clinical report** behind +12% and −1 °C so both can be presented
   without hedging.
3. **Fourth volume-on-weight error** on a Russian panel. Stop fixing these
   individually and ask for a full Russian panel audit.
4. **The Russian panel claims the snail filtrate "fights ageing and regenerates"**
   at 10 ppm, on a product with no functional licence.
5. **Ask whether the current carbomer grade is benzene-free.** The 2014 assessment
   records an unavoidable benzene trace from Carbopol. Internal question only.
6. **Confirm the ISO 22716 GMP certificate** was supplied; the 2014 assessment
   listed it as outstanding.
7. **Photography.** One image, `images: null`. The transparent texture is the
   product and none of it is shown.
