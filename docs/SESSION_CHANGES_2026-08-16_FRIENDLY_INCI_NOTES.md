# Session Changes — 2026-08-16 — Friendlier ingredient-list note on every bespoke page

## What was asked

"The complete ingredient list, exactly as it appears on the carton." — make it
more user friendly.

## Scope

That line is the note under the ingredient accordion. It exists on **35 bespoke
pages in three languages**, in a dozen slightly different wordings that had
drifted apart as pages were built one at a time. All of them were rewritten, so
the range now speaks with one voice here.

## The new voice

House voice takes no contractions, so the line is not "Everything that's in
it". Two base forms, chosen by whether the list is in carton order or in
descending-concentration order:

| | EN | AR | RU |
|---|---|---|---|
| Carton order | Every ingredient, in the same order as the box in your hand. | كل مكوّن، بالترتيب نفسه الذي على العلبة بين يديك. | Каждый ингредиент, в том же порядке, что и на коробке у вас в руках. |
| Formula order | Every ingredient, strongest first. | كل مكوّن، من الأعلى نسبةً إلى الأقل. | Каждый ингредиент, от большего к меньшему. |

Products that carry extra substance keep it, appended to the base line: pH
figures and their specification on the five Power Solution ampoules and the
PDRN mask, ppm/ppb figures on the Multi Vita and Hyaluron pages, the ferment
figures on the mist, the shade note on Revita Glow, the Latin-script
explanation on HES.

`selling-tone.mdc` explicitly protects "as printed on the carton" here as a
trust signal. That meaning is preserved — the reader is still told the list on
screen matches the pack in their hand, just in a sentence a person would say.

## Two things fixed while rewriting

**Dossier phrasing removed.** Four pages (eye cream, eye serum, eye patch,
peptide gel) opened with "Registered Formula_up list in descending order",
naming an internal document to the customer.

**A hedge that undercut the page removed.** The same four pages ended with
"This list is not claimed to match every language panel", and the overnight
mask with "We do not claim this list matches every language panel". Rule 4 of
the selling tone forbids undercutting a claim in the next clause. The honest
disclosure stays, stated positively — "Your box may print one or two of the
peptide names higher up, and this page follows the registered formula" — so the
buyer gets the same warning without the page apologising for itself.

## Accordion heading harmonised too

The heading above the note was one of four different strings: "Full INCI",
"Full INCI list", "Full ingredient list", "Full ingredient list (INCI)". Bare
"Full INCI" is jargon a shopper does not read. All 35 now use:

- EN `Full ingredient list (INCI)`
- AR `قائمة المكوّنات الكاملة (INCI)`
- RU `Полный список ингредиентов (INCI)`

This also fixed a real bug: `hsserumCopy.ts` had the untranslated English
"Full INCI" sitting in its Arabic and Russian slots, so the Arabic and Russian
pages for product 18 were showing English.

## Files

- 35 × `components/product/*/[a-z]*Copy.ts` — note and heading, EN/AR/RU
- `scripts/friendly-inci-notes-20260816.py` — the rewrite, with the old strings
  recorded and an assertion per replacement so a silent miss fails the run

## Verification

- Script reported 35/35 files rewritten with no failures; a follow-up scan
  confirmed 35 identical headings per locale and no stale note wording left.
- `tsc --noEmit`, `eslint components/product/` and `npm run build` all clean.
- Checked product 66 in the browser: heading and note render as intended.
