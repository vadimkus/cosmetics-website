# Routine audit and repair — 30 Aug 2026

Triggered by a screenshot of the product 35 routine card where step 3 looked cut
off mid-sentence.

## What the screenshot turned out to be

Not a data problem. The live mobile API returns that Hydro Cool line complete
("peel, then wipe with toner"), the string has not changed since 15 Aug, and
`RecommendedRoutineCard` applies no line clamp or fixed height. The one
structural difference on that row is that step 3 is the current product, so it
renders without a trailing chevron. `flexShrink: 1` added to `stepBody` in the
app as hardening.

## What the audit actually found

New script `scripts/audit-routines.ts` covers all 54 routines / 235 steps:
key resolution in three locales, dead images, broken deep links, duplicate
steps, truncation, figure divergence between locales, and selling-tone
violations. First run: **593 findings**.

Structurally everything was sound. No missing keys, no dead images, no broken
links, no truncation. The problem was entirely copy.

### Root cause

Commit `2418b475` (22 Aug, "Localize products 1-66 to Russian and Arabic")
rewrote RU/AR against the Intertek dossier and explicitly froze English as "the
protected baseline". The routine steps were caught in that split: the
corrections landed on two languages out of three. A Russian reader and an
English reader were given **different instructions for the same product**.

### Verified against the registered artwork

English was carrying claims the packaging does not support:

| Claim | Verdict |
|---|---|
| "2-3 times per week" on collagen, PDRN and soothing bomb masks | No frequency printed on any of the three cartons |
| Hair stamp "micro-channels that dramatically improve absorption" | Appears in no document |
| Hair solution "targets the causes of hair thinning" | Registered function is nutrition supply and hair conditioning |
| Shampoo "massage for 1-2 minutes" | No massage time printed; it is 3-5 ml, 3 minutes, rinse |
| Scalp peeling "1-2 a week, 5 ml, 5 minutes, dissolve keratin" | Leave-on, 7-10 minute massage, no rinse |
| Anti-wrinkle serum "improve skin age index" | Has a P&K clinical study, but not useful in a two-line step |

Russian was wrong too: it had the scalp peeling as a five-minute rinse-off with
a microneedling warning that is not printed, and "15 minutes before" on the sun
creams, which is also not printed. And it had drifted into reciting the formula
in steps that are two lines long.

Two English claims survived intact and were kept: the **twelve-vitamin complex**
is exactly twelve vitamin INCIs in the registered formula, and the **72-hour
hydration** figure comes from a DTS MG clinical trial.

Two of my own removals were over-cautious and were reverted: **"seven plants"**
(the sensitive box copy names all seven, and a branded complex counting
differently from the INCI list is normal), and **"micro-channels"** on the
microneedle roller, where it is the literal mechanism of the device.

## Changes

- `messages/{en,ru,ar}.json` — 43 unique step descriptions rewritten so all
  three languages carry one meaning, in selling voice, without percentages,
  INCI names or ppm. 137 strings in total.
- `scripts/fix-routine-copy-20260830.ts` — the rewrite, one entry per key with
  the reasoning inline.
- `scripts/audit-routines.ts`, `scripts/audit-routine-copy.ts` — the checks.
- `__tests__/lib/productRoutines.test.ts` — six new guards: same figures in
  every language, no dossier vocabulary, no reinstated frequencies, no
  unsupported claims, micro-channels reserved for the roller, every step ends
  as a finished sentence.

Beauty boxes 47, 50, 55-59 and 62 correctly have no self step: their routine is
the contents of the box.

## Caught by an existing guard

The first draft reintroduced "morning and evening" on the Cerabarrier cleanser.
Product 66's carton sets no usage frequency and its page is careful not to
invent one, so `product66LocalizedCopy.test.ts` failed. Removed from all three.

## Result

593 findings to 0. Full suite 120 suites / 1393 tests green.

## Still open

`lib/products.ts` and the beauty box modules describe some of the same products
in longer form and were not part of this pass. They are worth the same
treatment, particularly around the mask frequencies.
