# Product 26 — EGF REPAIR OXYMASK CREAM — bespoke page

Source audit: `SESSION_CHANGES_2026-08-17_PRODUCT_26_OXYMASK_SOURCE_AUDIT.md`.
The last cream in the range, and the only product where the manufacturer had
already done the honest thing for us.

## The usage rules come first, above the formula and above any selling

Four instructions, all on the carton, none of them previously on our site:

1. **Apply to dry skin.** Water dilutes the reaction before it starts.
2. **Do not rub.** Rubbing kills the bubbles.
3. **Three to five pumps** (Korean panel).
4. **Do not rinse off**, despite the name.

On a product whose entire mechanism is a foaming reaction, these are **functional
information, not nice-to-have**. Get either of the first two wrong and the
customer has paid AED 290 for a cream that visibly does nothing. That is the
largest practical gap found on any product this week, so it gets numbered cards at
the top rather than a note near the bottom, and it replaces the usual how-to
section entirely.

## Neither ingredient that makes the product work was on our record

| | Dose | |
|---|---|---|
| **Methyl perfluoroisobutyl ether** | **5.000%** | Second ingredient after water. A perfluorocarbon — carries and releases far more oxygen than water can. |
| **Decyl glucoside** | **2.750%** | Mild sugar surfactant. Without it, nothing foams. |

Those two **are** the oxymask. Our description instead named six key ingredients
of which the leading one, the EGF, is at 0.1 ppm.

Also genuinely at dose: ~10% humectants (glycerin, diglycerin, dipropylene
glycol), shea butter and jojoba at 1.000% each, vitamin E 0.100%, sodium
hyaluronate 0.050%, allantoin 0.050%, and **adenosine 0.040%** — the licensed
Korean wrinkle dose, assayed at **0.043%** with a separate identity check against
a reference chromatogram.

## The carton declares the trace dose itself, so the page credits it

The Korean ingredient panel prints:

> 에스에이치-올리고펩타이드-1 **(0.1ppm)**

**No other GENOSYS carton audited this week states a concentration inside the
ingredient list.** That inverts the usual dynamic: on every other product we were
the first to say a headline ingredient was at trace. Here we are agreeing with the
box.

So the page frames it as credit rather than correction, and then gives the full set
at real concentrations: madecassoside 1 ppm, copper tripeptide-1 0.05 ppm,
Sepitonic M3 minerals ~10 ppm combined, salmon oil 100 ppm, adenosine 0.040%.

For scale, and worth saying because both products are now on bespoke pages: the
madecassoside here is **200 times lower** than the centella triterpenes in the
Soothing Repair Postcream, and the copper tripeptide-1 is **1,000 times lower**
than in ND Cell.

## A satisfying detail from reading the mineral complex properly

The phenoxyethanol on the ingredient list is at **1 ppm** and arrives *inside*
Sepitonic M3 as a carryover — SEPPIC's complex is magnesium aspartate 4.75%, zinc
gluconate 4.75%, copper gluconate 0.5% and phenoxyethanol 1.0%, used at 0.0100%.
It is not there as a preservative. What actually preserves the cream is
1,2-hexanediol at 2.020% with ethylhexylglycerin. Only the safety assessment's
trade-name table makes that visible.

## The clinical study: real, and unquantified

Checking the deck as well as the dossier changed the answer again, in a third
distinct way.

The Intertek assessment records **"Other Tests: None presented"**, so on the
dossier alone our claimed *"Efficacy test on skin soothing effect against external
stimulus"* looks fabricated. The deck has a page titled exactly
**"Clinical study on skin soothing effect against external stimulus (physical
stimulus)"**, placed with this product.

But unlike the deck's other products — Problem Control Serum gives "reduces sebum
by 17%", product 28 gives "+12% hydration, −1 °C" — **this page renders its result
as a chart with no extractable value.**

So the page says the study was conducted and that we hold no figure for it, and
that we have asked for the report. That is neither "proven" nor "unsupported", and
saying so precisely is the only honest option.

## The postcream comparison is the manufacturer's own

Rather than invent a distinction between two products I have now both built:

- **Soothing Repair Postcream** — *"Intensive repair for a week right after the
  professional treatment"*
- **This one** — *"Daily regenerating cream for the skin damaged by various causes
  (S.O.S cream)"*

The page adds the practical read: this cream foams, is scented with eucalyptus and
carries an active licence, none of which you want on skin that has just been
needled. Postcream first, this one afterwards.

## Newly disclosed

- **Salmon oil at 100 ppm** — animal- and fish-derived, so **not vegan**. Same
  class of omission as the peanut oil on product 23.
- **Avoid pregnancy and lactation**, printed on the **English** panel, so there was
  no translation excuse for missing it.
- **Eucalyptus oil 0.0184% with limonene 0.0016%** declared. No perfume compound,
  but it smells distinctly of eucalyptus — and it is another reason the carton says
  to keep it away from the eyes.
- **Do not use near the eyes**, and **avoid broken skin**.

## Files

| File | Change |
|---|---|
| `components/product/oxymask/oxymaskCopy.ts` | New. EN/AR/RU. |
| `components/product/oxymask/oxymask.css` | New. Oxygen blue, plus numbered rule cards and a two-up comparison. |
| `components/product/oxymask/OxymaskProductPage.tsx` | New bespoke page. |
| `components/product/bespokePdp.tsx` | Registered 26; companions lead with 25. |
| `app/{,ar/,ru/}products/[id]/page.tsx` | Added 26 to the allow-lists. |
| `scripts/update-product-26-oxymask-record-20260817.ts` | Record fix, applied. |
| `lib/productsDb.ts` | Cache key v50 → v51. |

## Verification

Typecheck, lint and the full Jest suite (68 suites, 490 tests) pass. Clean checkout
production build passes. Browser pass on all three locales with zero console errors.

## Open items

1. **Request the soothing study report.** The deck names it and shows no number.
2. **Tell DTS MG their deck and their carton contradict each other.** The deck
   credits the EGF with wound healing and keratinocyte proliferation; the carton
   prints 0.1 ppm next to it. The carton is the honest document.
3. **No period-after-opening symbol** on this artwork, where products 25 and 28
   both carry 6M — on a pump pack that stays open for months. Worth asking.
4. **The Russian panel says "Объем: 50 г"**, volume with a mass unit. Milder than
   the four already logged but the same family; add it to the one Russian panel
   audit rather than chasing it separately.
