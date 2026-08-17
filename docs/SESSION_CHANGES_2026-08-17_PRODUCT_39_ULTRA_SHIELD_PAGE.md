# Product 39 — Ultra Shield Sun Cream — bespoke editorial page

Sixth product onto the editorial system. Source audit is in
`SESSION_CHANGES_2026-08-17_PRODUCT_39_ULTRA_SHIELD_SOURCE_AUDIT.md`.

## This one is the opposite problem

On products 36 and 41 the headline claim was thinner than it looked. Here it is
much stronger, and none of it was on the page.

Buried in a 59-page EU safety assessment is the fact that this sunscreen was
**tested in vivo at SPF 65.9 ± 4.74**, with a **UVA protection factor of 23.13
and 24.3** against the 22.0 European law requires at that strength. The label
says 50+ only because 50+ is the highest number a sunscreen is permitted to
print. The old page said none of this. It led instead on a "7-filter UV system"
that does not exist and a recovery complex dosed in parts per billion.

So the page leads on the measured numbers, then the six filters with their
individual percentages, then the two actives that are genuinely at working
doses.

## Structure

Hero, then:

1. **Stats** — 65.9 measured SPF, 24.3 UVA factor, 17.1% filter load, 2%
   niacinamide.
2. **"Somebody actually measured this"** — the SPF result, the two UVA results,
   and the arithmetic of the European requirement, in a panel of their own.
3. **The six filters** — a table with a percentage and a coverage note per
   filter, the 17.10% total, and a sidebar explaining why the seventh does not
   count.
4. **Three dose cards** — niacinamide 2.00%, adenosine 0.04%, filters 17.10%.
5. **The recovery complex** — the ppb and ppm figures, stated.
6. **Homosalate** and **water resistance**, side by side.
7. How to use, the Gulf case, batch specification, full INCI, safety,
   companions, specification, FAQ, reviews, closing band.

## Corrections made

**It is six filters, not seven.** Three sources agree: the Korean functional
declaration on the carton names six, the manufacturer's own deck lists five
chemical plus one mineral, and the safety assessment's raw-material table
classes butyloctyl salicylate — the presumed seventh, and at 5% the largest of
the group — as a skin-conditioning agent. It is a photostabiliser that raises
SPF without absorbing UV. The page explains this rather than quietly dropping
the number, because "seven" is in enough old material that a customer may ask.

**The Full INCI was from a superseded formula.** The record listed
**Cyclopentasiloxane** and **Cyclohexasiloxane**; the registered formula
contains neither and uses diisopropyl sebacate and dimethicone instead. This was
the most serious error found: D5 and D6 are regulated substances people
specifically screen for, so listing them when they are absent could lose a sale
on a false premise. Retranscribed from the registered artwork.

**"Reef-safe" is gone**, replaced by the checkable version: no oxybenzone, no
octinoxate, verified against the full INCI. "Reef-safe" is unregulated and the
formula does contain homosalate and octisalate.

**Ceramide NP, MicroHA™ and ProbioMETA™ no longer carry claims.** Ceramide NP is
at 0.00000001% — one part in ten billion, roughly five nanograms in a 50 g tube
— and the record credited it with strengthening the barrier.

## Two things the page volunteers

Both unusual for a sunscreen page, both better coming from us:

- **Homosalate.** Anyone who looks up the filters will find that the EU's
  scientific committee ruled against it at 10% in 2021 and proposed 0.5% before
  settling on 7.34%, now written into law. This formula uses 4.00%, and the page
  says so with the margin of safety.
- **There is no water-resistance test.** The manufacturer's deck calls the
  product "suitable for swimming and marine sports" and one of our own slides
  photographs a woman with wet hair. Nothing in the file supports it, so the
  page has a block headed "This is not a water-resistant sunscreen" telling
  people to reapply after water. In the UAE that is the difference between a
  working sunscreen and a burnt customer.

The page also names the fragrance at 0.5% in the how-to note and the FAQ, since
the product is partly sold on soothing and someone choosing for reactive skin
deserves to see it before buying.

## Record and registration

- `scripts/update-product-39-ultra-shield-record-20260817.ts` rewrites the three
  descriptions, `keyFeatures`, `benefits`, `ingredients` and `productDetails`.
- `productsDb` cache key bumped `v39` → `v40`.
- Quick facts for 39 now lead with the measured SPF and the six-filter load
  instead of "highest-tier grade" and "hybrid filters".
- `UltraShieldProductPage` registered for `'39'`;
  `BESPOKE_COMPANIONS['39'] = ['40', '36', '16', '13']` — Multi Sun Cream is the
  lighter sibling, the rest is the post-sun shelf. `'39'` added to all three
  locale allow-lists.
- `ultrashield.css` retints the shared tokens violet, taken from the PANTONE
  2603 C keyline on the carton.

## Logged to the corrections file

Seven entries under 39, including the superseded INCI (recorded there so an old
export cannot reintroduce it), the reef-safe claim on S1 and S5, the swim
implication on S5, badly garbled tube renders on S1 and S3 ("PROCTZHONAL",
"DERMATOLO6ICALLY TESTEB", "SEKMIOOLOGICALLY TETTEO"), the whole of S3 being
built on trace complexes, and a **DTS MG deck claim that the Lactobacillus
ferment "helps improve rosacea and acne"** — a medical claim on a 1 ppm
ingredient that must never reach any GENOSYS UAE material.

Also flagged, not touched: **the barcode.** Our file has EAN `8809849803436`,
the renewed artwork prints `8809849808165`. Likely an old-pack versus
renewed-pack difference, but it needs a tube scanned from current stock before
either is changed.

## Verification

- `tsc --noEmit` clean, eslint clean.
- Jest: 68 suites, 490 passed, 3 skipped.
- Production build passed.
- Browser check on all three locales. The filter table wraps the long chemical
  names inside their cells, and in Arabic the Latin names and percentages keep
  left-to-right direction inside the RTL layout.

## Still open

- **Photography**, as with every product so far. The tube renders are generated
  and two carry garbled type.
- **"Dermatologically tested"** is properly supported here, unlike on product
  36 — the assessor cleared it. Worth noting the caveat in the dossier though:
  "the number of volunteers is not statistically significant". The page states
  the claim once and does not build on it.
