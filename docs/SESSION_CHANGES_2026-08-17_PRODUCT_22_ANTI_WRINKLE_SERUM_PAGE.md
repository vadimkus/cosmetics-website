# Product 22 — Multi Functional Anti-Wrinkle Serum — bespoke editorial page

Ninth product onto the editorial system, and the most nuanced case so far.
Source audit is in
`SESSION_CHANGES_2026-08-17_PRODUCT_22_ANTI_WRINKLE_SERUM_SOURCE_AUDIT.md`.

## Nothing was fabricated. Everything was out of proportion.

The previous pages in this series involved claims that could not be delivered at
the dose. This one is different and more interesting: the product is genuinely
good, and it was being sold on its weakest attribute while its strongest went
unmentioned.

**Glycerin sits second on the ingredient list at 25.45%.** A quarter of the
bottle. Sourced as a branded pharmaceutical grade, and the certificate's specific
gravity of 1.0689 is exactly what a bottle that heavy with glycerin weighs. Add
betaine at 0.5%, panthenol and allantoin at 0.1% each, and this is a serious
humectant serum that will visibly plump skin in Gulf air.

**The site mentioned glycerin nowhere.** The description led on a six-peptide
complex present at roughly **1.4 parts per million**.

So the page now opens on the biggest number in the formula, under the heading
"The ingredient nobody mentioned".

## Bakuchiol, handled precisely

This was the hardest call on the page, because bakuchiol at 0.100% is not a
trace — it reads like a dose, and it is a legitimate ingredient.

The deck states that "bakuchiol and retinol both significantly decreased wrinkle
surface area with no statistical difference between the compounds." That is a
faithful summary of a real, good study: **Dhaliwal et al., British Journal of
Dermatology 2019;180(2):289–296**, randomised, double-blind, 12 weeks, 44
patients. Verified from the journal rather than from memory.

**That study used bakuchiol at 0.5%, applied twice daily. This serum has
0.100%** — one fifth of it.

The page gives both figures in three columns side by side: what is in the serum,
what was in the study, and what the study found. Then it says plainly that we are
not borrowing the conclusion, and that bakuchiol is a welcome photostable extra
rather than a reason to expect retinoid results. Worth noting the certificate
assays niacinamide and adenosine but **not** bakuchiol, so there is no measured
figure for the headline ingredient.

## The peptides: credit where it is due, numbers where they matter

The safety assessment's trade-name table shows that "Anti-aging Peptide 6" is
four separate premium raw materials, each bought in at 0.1% of the formula:

| Material | Supplier | Peptide | In the bottle |
|---|---|---|---|
| Syn-Coll | DSM | Palmitoyl Tripeptide-5 | 1.1 ppm |
| Matrixyl 3000 | Sederma | Palmitoyl Tripeptide-1 | 0.1 ppm |
| Matrixyl 3000 | Sederma | Palmitoyl Tetrapeptide-7 | 0.08 ppm |
| Elastyl | Corum | Palmitoyl Hexapeptide-12 | 0.1 ppm |
| AH PEP 50 | Danjoungbio | Acetyl Hexapeptide-8 | 0.05 ppm |
| — | — | Dipeptide-2 | 0.1 ppm |

**Somebody chose well and then used very little.** These are respected, expensive
materials, not commodity substitutes, and the page says so — then prints the real
concentrations and attaches no mechanisms. That felt like the fair treatment:
the sourcing deserves credit even though the dosing does not support the deck's
six separate mechanism claims.

## The claim I removed

The description cited: *"Clinical study on improvement of skin age index, P&K
Skin Research Center, Feb. 22 to May 13, 2024, 24 adult women aged 30~59 years."*

**We do not hold that report.** A search of the entire `~/Desktop/Drive/Genosys`
tree returns no P&K report, no skin-age-index study and no 2024 efficacy report
for this product, and the 46-page safety assessment does not reference it.

So no result from it appears anywhere on the page, and the citation is off the
record rather than left as an unsupported half-claim. The verification script
checks for its absence in all three locales.

**This is the highest-value thing to chase on this product.** The citation is
unusually specific — named CRO, exact dates, an n and an age band — which
suggests it is real and DTS MG has it. A genuine 24-subject clinical study on
skin age index would be the strongest asset this product has, and right now it
is doing nothing because nobody can see it.

## Two more things now said

**It is scented.** Lavender oil at 0.0186%, with linalool declared separately at
0.0114% because European law requires that allergen to be named. Nothing on the
site had ever mentioned it. The page points fragrance-avoiders to product 42,
which is genuinely fragrance-free.

**The patch test was graded Non Irritant**, not merely passed. That is a stronger
result than the usual "dermatologically tested" and it is worth the distinction,
with the assessor's caveat about volunteer numbers stated alongside.

## Record and registration

- `scripts/update-product-22-anti-wrinkle-serum-record-20260817.ts` rewrites the
  three descriptions, `keyFeatures`, `benefits`, `productDetails` and
  `ingredients`, including a full INCI transcribed from the quantitative formula.
- `productsDb` cache key bumped `v42` → `v43`.
- `AntiWrinkleSerumProductPage` registered for `'22'`;
  `BESPOKE_COMPANIONS['22'] = ['32', '16', '42', '13']` — 32 is the cream
  sibling, 42 is the fragrance-free option the page names. `'22'` added to all
  three locale allow-lists.
- `antiwrinkle.css` retints to a muted olive-gold, matching the serum's own
  light-yellow fluid and keeping it distinct from the sun range's ambers and the
  BB range's clay.

## Verification

- `tsc --noEmit` clean, eslint clean.
- Jest: 68 suites, 490 passed, 3 skipped.
- Production build passed.
- Headless check on EN, AR, RU and mobile: **zero console errors**, with the
  25.45% glycerin, the 0.100% bakuchiol, the study's 0.5%, the Matrixyl 3000
  attribution, the ppm figures and the linalool disclosure all present in every
  locale — and **no trace of the P&K citation anywhere**.

## Still open

- **Get the P&K study report.** See above. It is the single biggest upside
  available on this product.
- **Tell DTS MG about three deck errors.** Slide 3 lists "Mango seed butter",
  which is not in the formula in any form. Slide 5 calls bakuchiol a "safe plant
  derived ingredient without side effects" — an absolute safety claim no
  ingredient can carry — and says "it prevents acne", which is a drug claim.
- **Product 32 is the cream sibling** and is still on the generic template. Doing
  it next would let the two pages compare properly, the way 39/40/42 now do.
