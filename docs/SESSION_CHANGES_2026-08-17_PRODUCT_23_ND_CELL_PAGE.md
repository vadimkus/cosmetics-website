# Product 23 — ND Cell ANTI-WRINKLE CREAM — bespoke page

Source audit: `SESSION_CHANGES_2026-08-17_PRODUCT_23_ND_CELL_SOURCE_AUDIT.md`.
The neck and décolleté cream, and the largest correction set of the range so far.

## The peanut disclosure goes above everything else

This page opens, before the working formula and before any selling, with an amber
block stating that the cream contains **peanut oil at 0.0087%**.

Three reasons it belongs at the top rather than in a precautions list:

- It is a **large application area.** Neck and chest, twice a day.
- The oil is **not a deliberate addition.** The safety assessment traces it to the
  vitamin A palmitate raw material, so it is simply the carrier the retinyl
  palmitate arrives in. Nobody chose it, which is exactly why nobody thought to
  mention it.
- **Our own sibling product already declares it.** Product 24, EyeCell, prints
  "Contains peanut oil" on our site. This product printed nothing. That
  inconsistency was ours and the page says so.

The refined oil is held below 0.5 parts per million of peanut protein under Annex
III/306 of EC 1223/2009, citing SCCS/1526/14, which is the basis on which it may
be used at all. So this is a disclosure obligation, not a reason to stop selling
it. But a peanut-allergic customer has to be able to find it.

## The carton does not declare linalool, and we say so on the page

The current valid safety assessment names it as a required declaration:

> An allergen is declared on the label when its concentration in the final
> preparation is >0.001% — Lavandula Angustifolia (Lavender) Oil — **Linalool:
> 0.0235%**

That is **23 times the threshold**, and the printed carton's ingredient list does
not contain the word. Every other GENOSYS product audited this week declares it
correctly, so this is a single-carton miss.

The fragrance section states plainly that the assessment names it, the box does
not, and we are disclosing it here because anyone screening the box would not find
it. That felt like the only defensible option: the alternative is knowing about an
undeclared allergen and staying quiet because the supplier's artwork is wrong.

It is also why `fullInciNote` on this page does **not** use the usual "as printed
on the carton" line. The carton INCI is out of date — it carries five ingredients
no longer in the formula, including a **sixth peptide the product no longer
contains**, and omits tocopherol and linalool. The note explains the discrepancy
rather than pretending it away.

## Two claims removed

**"An excellent effect of depigmentation."** The Korean carton licenses this as a
**single-function** wrinkle-improvement cosmetic with adenosine as the main
ingredient. There is no whitening function on the licence and nothing in the
formula could earn one: no arbutin, no niacinamide, and ascorbyl glucoside at
0.025%, roughly an eightieth of the concentration used in efficacy work. We were
claiming a second function the product is not licensed for.

**"Efficacy test on improving wrinkles."** No report exists, and the assessor
raised the point unprompted: *"The phrases 'Anti-Wrinkle' need further
documentation in order to be proven"*, citing Regulation (EU) 655/2013. The
carton nonetheless prints "Excellent Anti-Wrinkle Effect".

What replaces both is the defensible version: **Korea licenses wrinkle
improvement on the basis of adenosine at 0.04%**, which is on the carton and
assayed at 92.60% on the batch.

## Two proportion corrections

**Five peptides, of which one carries 97% of the load.** Copper tripeptide-1 at 50
ppm is genuinely present and has literature behind it. The others: palmitoyl
hexapeptide-12 at 1 ppm, acetyl hexapeptide-8 at 0.25 ppm (studied at 5–10% in the
literature), palmitoyl tripeptide-1 at 0.2 ppm, and sh-polypeptide-7 at **0.01
ppm, ten parts per billion**. Total roughly 51.5 ppm. The page gives all five with
their real numbers in one table.

**A four-vitamin complex that is two real and two token.** Vitamin E at 1.000% and
B5 at 0.300% are working doses and are marked with a filled dot. Vitamin C at
0.025% and vitamin A at 0.0111% get a hollow one.

Meanwhile **squalane at 5.000%** — the largest ingredient after water and the one
actually carrying the cream — was buried at the end of the old ingredient list. It
now leads the page.

## The glycerin number completes a three-way gradient

| | Glycerin | Oils and silicones |
|---|---|---|
| 22 Anti-Wrinkle Serum | 25.45% | ~2.4% |
| 32 Multi Functional Cream | 8.00% | ~13% |
| **23 ND Cell** | **0.70%** | **~9.6% plus 5% squalane** |

All three carry adenosine at the same 0.04%, so the actives are not what separates
them. This one is **almost purely occlusive** — it seals rather than hydrates — and
the page says so rather than letting a customer expect the serum's plumping. The
three products now form a coherent set the customer can choose within.

## Also newly stated

- **Retinyl palmitate has a compliance story worth telling.** An earlier formula
  carried 0.02%; the assessor capped body-area products at 0.025% and asked for a
  reduction; the current formula is 0.0111%. Recorded on the page as a case of the
  process working, and as the reason nobody should expect retinoid results.
- **Do not use near the eyes**, which the carton states explicitly, with a pointer
  to EyeCell.
- **Four pathogens screened** on the batch rather than the usual three, all absent.
- **Free of synthetic fragrance is not fragrance-free.** The carton's
  "5 No-additions" covers artificial fragrance; the lavender oil is still there.

## Files

| File | Change |
|---|---|
| `components/product/ndcell/ndCellCopy.ts` | New. EN/AR/RU. |
| `components/product/ndcell/ndcell.css` | New. Cool slate-teal, deliberately unlike the face pair, plus an amber alert style for the peanut block. |
| `components/product/ndcell/NdCellProductPage.tsx` | New bespoke page. |
| `components/product/bespokePdp.tsx` | Registered 23; companions lead with 24. |
| `app/{,ar/,ru/}products/[id]/page.tsx` | Added 23 to the allow-lists. |
| `scripts/update-product-23-nd-cell-record-20260817.ts` | Record fix, applied. |
| `lib/productsDb.ts` | Cache key v44 → v45. |

## Verification

Typecheck, lint and the full Jest suite (68 suites, 490 tests) pass. Clean
checkout production build passes. Browser pass on all three locales with zero
console errors.

## Open items, in priority order

1. **Get linalool onto the carton INCI.** This is a label compliance gap on a
   product in the market, not a marketing nicety.
2. **Ask for peanut oil in the carton precautions.** It is in the INCI, so the
   legal minimum is met, but a precaution line would match how we now treat it.
3. **Reissue the carton INCI from the current formula** and confirm the CPNP
   notification, dated 13 May 2015, was updated when the formula changed.
4. **Substantiate or drop "Excellent Anti-Wrinkle Effect"**, per the assessor.
5. **One question on copper tripeptide-1.** The earlier assessment suggested
   reducing it by a factor of over ten; the current valid assessment does not
   repeat it. Probably resolved, worth confirming.
6. **Product photography.** Two images for an AED 370 product, and neither shows
   the application area the product exists for.
