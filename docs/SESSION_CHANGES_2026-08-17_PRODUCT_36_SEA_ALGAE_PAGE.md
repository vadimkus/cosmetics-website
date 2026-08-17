# Product 36 — Sea Algae Mask — bespoke editorial page

Fifth product onto the editorial system, after 41 and 49. Source audit is in
`SESSION_CHANGES_2026-08-17_PRODUCT_36_SEA_ALGAE_SOURCE_AUDIT.md`.

## The problem this page had to solve

The product is called SOOTHING BOMB **SEA ALGAE** MASK. The sea algae is dosed
at **10 ppm**, and the centella in the same sentence is at **1 ppm**.

Everything we shipped led on those two ingredients: the site description, the
DB `keyFeatures`, the DB `benefits`, our studio slides, the manufacturer's deck
and the training manual. Meanwhile the ingredients actually doing the work —
methylpropanediol 10%, glycerin 5.04%, betaine 0.5%, allantoin 0.1% and
panthenol 0.1% — appeared nowhere in the record at all.

There were three options: keep leading on the algae, quietly drop the algae, or
say the dose out loud. The page says the dose out loud, in a section of its own
titled "It is in there. It is not what is working." That is defensible because
**GENOSYS already print "(10ppm)" on the back of the pouch**. The information is
public; the only choice available to us was whether to repeat it or paper over
it.

The rest of the page then leads on what does hold up: a percentage table of the
functional formula, and the Eucalace® sheet.

## Structure

Hero with the gallery and buy block, then:

1. **Stats** — 15–20 minutes, 5% glycerin, 25 g of essence, pH 5.7.
2. **The sheet** — four cards on the eucalyptus spunlace: finer fibre so it
   carries more essence, air permeability above a standard nonwoven, water-jet
   bonding so there is no chemical residue, and transparency plus adhesion. For
   a AED 36 single sheet the fabric genuinely is the differentiator, and deck
   slide 2 is real material engineering rather than marketing.
3. **The functional formula** — a table with six rows and a percentage on each,
   straight off the quantitative formula. Percentages, not an INCI order.
4. **The ppm section** — set in its own bordered block, with the aside about
   GENOSYS printing the figures themselves.
5. **The colour** — green from gardenia fruit extract at 0.02%, which is the
   formula's colorant and the reason the pouch can claim no artificial pigment.
6. **How to use** — the video plus four steps, including the one that matters:
   take it off at twenty minutes, because a drying sheet takes moisture back.
7. **When to reach for it** — after sun, off a flight, post-peel, mid-summer
   air conditioning, before an event. Framed as a comfort mask, not a treatment.
8. **Ingredients** then the full INCI in an accordion.
9. **Batch specification** — pH 5.69 in a 5.00–6.00 spec, 25.10 g against a
   25 g minimum, under 10 cfu/g against a permitted 100, thirty months.
10. **Safety, companions, specification, FAQ, reviews, closing band.**

## Claims removed

- **"Dermatologically tested."** It was in the legacy `lib/products.ts`
  description and is printed on our own studio slides S1 and S5. It is on
  neither pouch face and there is no report in the dossier folder.
- **"Efficacy test on skin hydration."** Same: no study anywhere in the pack, so
  no hydration percentage appears on the page. The lab section says this
  explicitly rather than leaving the absence unexplained.
- **The deck's ingredient claims** — wound healing, collagen synthesis,
  tyrosinase inhibition, sebum control, pore tightening, detoxifying — all
  attached to ingredients at 1–10 ppm.
- The contract manufacturer's name and the lot code, per the standing rules.

## Record changes

`scripts/update-product-36-sea-algae-record-20260817.ts`:

- Descriptions in all three languages rebuilt around the humectants, the sheet
  and the pH, with the ppm figures stated.
- `keyFeatures` replaced: the sheet, the glycerin/methylpropanediol pair, the
  allantoin/panthenol pair, and no artificial pigment. Previously it led with
  "Sea Algae Complex — Powerful sea algae extracts provide intensive relief".
- `benefits` rewritten off the formula. "Ocean Therapy" and "Skin Healing" are
  gone.
- `ingredients` reordered so the working doses come first and the trace
  extracts appear with their ppm figures and no effects attached. The Full INCI
  entry is preserved untouched; the script refuses to run if it is missing.
- `productDetails` gained pH, colour and wear time.
- `productsDb` cache key bumped `v38` → `v39`.

## Slide errors logged

Four entries added to `~/Desktop/genosys-artwork-corrections.html` under 36:

1. **S5 prints "23g".** The pack is 25 g and the COA measured 25.10 g. This is
   the one number on the slide a customer can check against the pouch in their
   hand.
2. **S1 and S5 print "Dermatologically Tested"**, which nothing supports.
3. **S3 attaches effects to the 1–10 ppm extracts.**
4. **S1 and S3 pouch renders carry garbled type** — "PROVIOF3 ANEVGVE REUEF",
   "GENOSYS it a vompound word of". Same generated-render problem as the
   Charming Look box.

A fifth entry records a DTS MG error, not ours: deck slide 3 opens "GENOSYS
**EPI TURNOVER BOOSTING GEL** provides intensive relief…" and slide 6 is
footered with the same wrong product. Worth telling them.

Per the gallery rule the slides stay on the page until corrected versions are
exported under new filenames.

## Registration

- `SeaAlgaeProductPage` added to `BESPOKE_PDP_LAYOUTS` for `'36'`.
- `BESPOKE_COMPANIONS['36'] = ['16', '53', '13', '37']` — Snow Booster is the
  prep step named on the pouch, the rest are the masks and peels it sits beside.
- `'36'` added to the allow-list in all three locale routes.

## Palette

`sealgae.css` retints the shared tokens to sea green (`--cera-rose: #2f7d52`)
on a near-white ground, since both the pouch and the essence are green. Two
additions beyond the retint: `.sea-table` bands the formula rows so they read
across, and `.sea-note` gives the ppm block a border and gradient so it does not
read as just another card.

## Verification

- `tsc --noEmit` clean, eslint clean.
- Jest: 68 suites, 490 passed, 3 skipped.
- Clean-checkout `next build` in a detached worktree: passed.
- Browser check on all three locales. The Arabic formula table keeps the Latin
  ingredient names and the percentage figures left-to-right inside the RTL
  layout, breadcrumb chevrons mirror, and the sticky bar behaves.

## Still open

- **The photography.** `Main.jpeg` and the six slides are generated renders,
  and two of them have garbled pack type. Real photographs of the pouch and the
  unfolded sheet would serve this page better than anything else on this list —
  the whole argument rests on the fabric, and there is no photograph of it.
- **The "dermatologically tested" question.** If a report exists somewhere
  outside the Intertek folder, the claim goes back on the slides and the page.
  Worth asking DTS MG.
