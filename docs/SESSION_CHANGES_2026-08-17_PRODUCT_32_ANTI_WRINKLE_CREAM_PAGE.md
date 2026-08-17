# Product 32 — MULTI FUNCTIONAL ANTI-WRINKLE CREAM — bespoke page

Source audit: `SESSION_CHANGES_2026-08-17_PRODUCT_32_ANTI_WRINKLE_CREAM_SOURCE_AUDIT.md`.
Built immediately after the serum (22), which is why the comparison works.

## Why this page leads with the serum comparison

The obvious framing for a matching cream is "the serum, but richer". That framing
is wrong here, and the documents say so clearly enough to build a page on.

- The serum is **25.45% glycerin** with roughly 2.4% oils.
- This cream is **8.00% glycerin** with roughly **13% oils and butters**.
- Same niacinamide at 2.00%, same adenosine at 0.040%, same bakuchiol at 0.100%.
- The serum has six peptides at trace; this has **none at all**.

And then the detail that makes it undeniable: the serum's certificate records a
**specific gravity of 1.0689** — heavier than water, because a quarter of it is
glycerin. This cream's records **0.9860** — lighter than water, because of the
oil load. Two certificates of analysis, two numbers either side of 1.000, and
between them a physical fingerprint of the formulation difference.

So the page states the honest version: **a humectant draws water into skin and an
occlusive stops it leaving.** The serum's own instructions already say to follow
it with a moisturiser. This is that moisturiser. For anyone buying one, the page
says which: cream on dry skin or in winter, serum on oily skin or in humidity.

That is a reason to own both that does not require inventing anything, which is
better than the upsell we would otherwise have written.

## The mango mystery, closed

Yesterday's serum audit flagged that its deck listed "Mango seed butter" with no
mango material anywhere in the serum formula. **Mango seed butter is real and it
is in this product at 0.800%** — a genuine emollient dose, checked in the safety
assessment against a maximum reported use of 5% in leave-on products.

DTS MG copy-pasted this product's ingredient column onto the serum's slide. The
serum correction stands; the cream claim is sound. Logged so DTS MG can fix it at
source rather than us working around it product by product.

## The peptide-free formula is a selling point, not an absence

The serum carries six premium peptides at between 0.05 and 1.1 ppm and its deck
assigns a mechanism to each. This cream does not contain them, so nothing here is
being sold at a millionth of a gram. The page says that outright, and the record
now carries "No Peptides At All" as a key feature.

The trace layer that does remain is named without mechanisms: ceramide,
cholesterol and phytosphingosine at 0.1 ppm each, hydrolyzed collagen at 0.1 ppm,
elastin at 1 ppm, propolis at 10 ppm. Deck slides 8 and 9 build barrier and
dermal-structure stories on those; none of it reached the page.

## What the page says is doing the work

Glycerin 8.00%, niacinamide 2.00%, mango seed butter 0.800%, dimethicone 0.800%,
hydroxyacetophenone 0.500%, allantoin 0.100%, bakuchiol 0.100%, adenosine 0.040%,
plus roughly 13% of emollients and structure. The two actives with regulatory
thresholds behind them were both **measured** on the batch — niacinamide at
101.30% and adenosine at 95.50% — and the page uses the measured figures.

## Bakuchiol, handled exactly as on the serum

0.100%, against **0.5% twice daily** in Dhaliwal et al., *British Journal of
Dermatology* 2019;180(2):289–296. The page gives both numbers and declines to
borrow the retinol equivalence, and notes that the certificate assays the
niacinamide and adenosine but not the bakuchiol.

## Newly disclosed

- **Fragrance.** Lavender oil at 0.0413%, over twice the serum's 0.0186%, with
  **two** declared allergens: linalool 0.0266% and limonene 0.0021%. Anyone who
  cleared the serum on fragrance grounds needed to know. Points fragrance-avoiders
  to product 42.
- **Dual function, not triple.** No UV filter, so unlike 39, 40, 41 and 42 this is
  licensed in Korea for wrinkle improvement and brightening only.
- **The reformulation.** It replaced Intensive Multi Functional Cream: the pumpkin
  ferment and the mung bean / birch bark / sorrel trio came out, bakuchiol,
  propolis, collagen and elastin went in, and texture, fragrance and dual function
  were kept. Useful to anyone returning to a jar they used years ago.
- **Patch test graded Non Irritant** rather than merely passing, same laboratory
  as the serum.

## Removed

The **P&K clinical study** citation, identical to the serum's, with no report on
the drive and no reference to it in the 42-page safety assessment. That the same
citation covers both products raises the value of obtaining it.

## Files

| File | Change |
|---|---|
| `components/product/antiwrinklecream/antiWrinkleCreamCopy.ts` | New. EN/AR/RU. |
| `components/product/antiwrinklecream/antiwrinklecream.css` | New. Deeper olive-gold than the serum, so the pair reads as related. |
| `components/product/antiwrinklecream/AntiWrinkleCreamProductPage.tsx` | New bespoke page. |
| `components/product/bespokePdp.tsx` | Registered 32; companions lead with 22. |
| `app/{,ar/,ru/}products/[id]/page.tsx` | Added 32 to the allow-lists. |
| `scripts/update-product-32-anti-wrinkle-cream-record-20260817.ts` | Record fix, applied. |
| `lib/productsDb.ts` | Cache key v43 → v44. |

## Verification

Typecheck, lint and the full Jest suite (68 suites, 490 tests) all pass. Clean
checkout production build passes. Browser pass on `/products/32`, `/ar/products/32`
and `/ru/products/32` with zero console errors, and the Arabic page keeps the
percentages and specific gravities left-to-right inside right-to-left copy.

## Open items

1. **Chase the P&K report.** One study would substantiate both 22 and 32.
2. **Tell DTS MG about the copied slide**, so the serum deck stops claiming mango.
3. **The 250 g professional size** has a certificate on file but is not on our
   price list. Worth asking whether clinics can order it.
4. Deck slide 6 repeats the serum's "without side effects" and "prevents acne"
   bakuchiol claims. Neither may appear in any GENOSYS UAE material.
