# Product 42 — Intensive Blemish Balm Cream — bespoke editorial page

Eighth product onto the editorial system. Source audit is in
`SESSION_CHANGES_2026-08-17_PRODUCT_42_BLEMISH_BALM_SOURCE_AUDIT.md`.

## What the page leads on

The registered carton says something our site never did: this covers redness and
blemishes **after a dermatological treatment**. GENOSYS is a clinic brand, and
that is the specific moment this product exists for — the hour after
microneedling or a peel when the redness is still visible and you still have to
leave the building. The page opens there instead of on "premium natural coverage
cream", and the whole formula reads differently once you know it: the pigment
load, the SPF, the absence of any fragrance, the arbutin sitting underneath.

## The pattern this product completes

| Product | Filters | Filter load | Grade |
|---|---|---|---|
| 39 Ultra Shield | 6 | 17.10% | SPF50+ / PA++++ |
| 40 Multi Sun | 4 | 18.50% | SPF40 / PA++ |
| **42 Blemish Balm** | **3** | **19.70%** | **SPF30 / PA++** |

**Perfectly inverted across three products.** Each step down carries more filter
by weight and earns a lower grade. This page carries the table with its own row
highlighted, and explains the two real reasons: there is no long-UVA filter in
this tube, and the titanium dioxide at 7.70% is doing double duty as the
coverage pigment — pigment dispersed for opacity is not fully available as UV
protection, so you cannot read 7.70% as 7.70% of shielding.

That is the most genuinely educational thing on any of the three pages, and it
only became visible by doing them in sequence.

## The disclosure that was missing

**The carton carries a mandatory Korean precaution that appeared nowhere on
genosys.ae:**

> In human application test data for products containing the same ingredient
> (arbutin at 2% or more), there have been reported cases of papules and mild
> itching.

Korea requires it because the product holds arbutin at 2%. Meanwhile the record
claimed the product suited "especially sensitive and post-treatment skin".

It now has its own block, quoted, positioned immediately after the actives —
because the 2% arbutin is exactly what earns the brightening claim, so the
tradeoff belongs beside the benefit rather than in a footnote. The practical
advice sits with it: patch test on the jaw for two days, especially before
wearing it over freshly treated skin.

## Three more things now said out loud

- **One shade only.** A single iron-oxide shade system, no lighter or deeper
  option, on a UAE customer base. The BB Cushion (41) ships three, and the page
  points there if matching matters more than coverage.
- **It contains beeswax at 2%**, so it is not vegan. Nothing on the site said so.
- **D5 at 3.50% and D6 at 2.50%.** Regulation (EU) 2024/1328 caps both at 0.1%
  in leave-on cosmetics from **6 June 2027**, on environmental persistence
  grounds rather than skin safety. Verified from EUR-Lex, not from memory.

## And one advantage that was being left on the table

The carton's five-no-additions mark — no parabens, artificial fragrance, mineral
oil, ethanol or phenoxyethanol — **all five verify against the quantitative
formula**. Preservation is caprylyl glycol, glyceryl caprylate,
caprylhydroxamic acid, tropolone and hexanediol.

That makes this **the only fragrance-free product of the three SPF items**:
Multi Sun is fragranced at 0.25% with five declared allergens, Ultra Shield at
0.5%. For reactive skin it is the one to reach for on that axis, which sits in
real tension with the arbutin warning. The page presents both and says so rather
than picking the flattering half.

## The quality section

The certificate assays every declared active — titanium dioxide 7.09%,
octinoxate 6.31%, octocrylene 4.50%, arbutin 1.81%, adenosine 0.04% — and adds
three tests worth having:

- **Hydroquinone under 1 ppm.** Arbutin degrades to hydroquinone, which is
  banned in cosmetics. A brand selling arbutin at 2% and publishing the
  degradation test is doing the thing that actually matters.
- **Lead under 20 ppm and arsenic under 10 ppm**, which is the right check for a
  cream coloured with iron oxides.

Note the arbutin measured **1.81% against 2.00% declared** — 90.5% of label,
against a "more than 90%" specification. It passes, only just, and the page
prints the measured figure beside the declared one rather than only the round
number.

The lab section states plainly that **the batch on file was made in June 2019
and expired in June 2022**, so the figures are the specification the product is
released against rather than a claim about current stock.

## Record and registration

- `scripts/update-product-42-blemish-balm-record-20260817.ts` rewrites the three
  descriptions, `keyFeatures`, `benefits`, `productDetails`, and **adds the
  `ingredients` array — the field was empty, the same gap product 40 had.**
- `productsDb` cache key bumped `v41` → `v42`.
- `BlemishBalmProductPage` registered for `'42'`;
  `BESPOKE_COMPANIONS['42'] = ['41', '39', '13', '16']`. `'42'` added to all
  three locale allow-lists.
- `blemishbalm.css` retints to the clay-rose of the cream itself, so the three
  SPF pages now read as a family: 39 violet, 40 burnt amber, 42 clay.

## Verification

- `tsc --noEmit` clean, eslint clean.
- Jest: 68 suites, 490 passed, 3 skipped.
- Production build passed.
- Headless check on EN, AR, RU and mobile: **zero console errors**, and the
  19.70% filter load, the arbutin warning, the hydroquinone test, the one-shade
  statement, the beeswax and the 2027 date all present in every locale.

## Still open

- **Photography, and here it is worse than usual.** This product has **two
  images and no video** where comparable products carry six studio slides. The
  page now has a three-way filter comparison, a batch assay and a one-shade
  claim to illustrate, and almost nothing to illustrate them with. A shade swatch
  on skin and a covered-redness before/after would earn their place here more
  than on most products in the range.
- **Empty ingredient fields elsewhere.** Two products in a row (40 and 42) had
  no INCI at all. Worth a sweep of the catalogue rather than finding them one at
  a time.
- **The D5/D6 date is a commercial matter, not just a page detail.** This
  formula cannot be placed on the EU market after 6 June 2027 without
  reformulation. DTS MG should be asked what their plan is.
