# Product 5 — POWER SOLUTION CVS: claims audit and bespoke page

**Date:** 14 August 2026
**Product:** POWER SOLUTION CVS (product number 5), AED 580, 2 ml × 10 sealed glass vials
**Live:** https://genosys.ae/products/5 · `/ru/products/5` · `/ar/products/5`

---

## What this was

The next product in the rolling audit-and-rebuild pass. Same shape as products 52
and 53: verify every claim against the manufacturer documents, fix whatever is
wrong in the database and the two translation files, then build a bespoke page
that sells the product on the verified facts.

CVS turned out to be the worst-documented product audited so far, and the fixes
spilled into the five sibling ampoules.

---

## Source documents

All under `/Users/vadimkus/Desktop/Drive/Genosys/Registration/Intertek`:

| Document | Used for |
|---|---|
| `Registration DOC/SA/SA-GENOSYS POWER SOLUTION CVS.pdf` (Jan 2021) | The current quantitative formula. This is the authority for every percentage on the page. |
| `Registration DOC/COA/COA-GENOSYS POWER SOLUTION CVS(L1036B).pdf` | pH 5.94, specific gravity 1.032, microbial results, expiry Nov 2027. |
| `Registration DOC/Artwork/[GENOSYS]POWER SOLUTION CVS.pdf` | Carton text, the 5-Free panel, the four application pictograms, the pregnancy warning. |
| `Intertek_folder/Quali-quanti Ingredients/` (2011) | **Superseded — do not use.** Holds an older formula that does not match the current INCI. |

The 2011 quali-quanti was the first thing found and it disagreed with the
current INCI. The January 2021 safety assessment is the one that matches. Anyone
returning to this product should start there.

---

## Errors found and fixed

### 1. sh-Polypeptide-7 was described as an IGF-1 analogue — wrong, and on six products

The database called it an *"IGF-1-analog peptide that supports skin regeneration
and healing processes"*.

sh-Polypeptide-7 is a single-chain recombinant human peptide carrying the
217-amino-acid **somatotropin** sequence, produced by microbial fermentation.
The IGF-1 peptide in cosmetic use is a different INCI entirely — sh-Oligopeptide-2
— and is in none of these vials. COSING classifies sh-Polypeptide-7 as a skin
protectant.

Fixed on product 5, then on all five siblings, in all three languages:

- English DB rows for 4, 6, 7, 8, 9 — `scripts/fix-power-solution-siblings-igf1-20260814.ts`
- Product 4 also carried it in a key feature ("Growth Factor Technology"), rewritten
- Product 6 said "human growth hormone-like peptide", which is drug-register and also wrong
- Arabic and Russian for the whole range — `scripts/tmp/cvs-locales.py`

The legitimate IGF-1 mentions on the Snow O2 / Pink Ceramide growth-factor
complex were preserved; that product genuinely lists it as one of five factors.

### 2. Peptide doses were quoting the raw material, not the finished product

The cards implied premix concentrations. The finished doses from the safety
assessment are **sh-Polypeptide-7 at 1 ppm** and **palmitoyl tripeptide-1 at
0.5 ppm**. Fixed in `scripts/fix-power-solution-cvs-5-peptide-doses-20260814.ts`
and mirrored by `scripts/tmp/cvs-peptide-locales.py`.

Context added rather than left bare: peptides are dosed in parts per million by
design, and the CIR expert panel puts typical cosmetic use of the palmitoyl
tripeptide family under 10 ppm.

### 3. The entire product was sold as a microneedling ampoule. Nothing supports that.

The old copy referenced microneedling in the description, the key features, the
benefits, the how-to-use and the product details — "Apply during microneedling
treatments", "Licensed practitioners only", "microneedling post-care".

**Neither the carton nor the safety assessment mentions microneedling anywhere.**
The safety assessment assesses it as a leave-on face product for adults. The
carton prints four pictograms: cleanse, open, apply, absorb.

Rewritten to the documented use in
`scripts/fix-power-solution-cvs-5-use-context-20260814.ts`, mirrored by
`scripts/tmp/cvs-use-context-locales.py`. Roller use is answered honestly in an
FAQ entry rather than being asserted as the product's purpose.

### 4. Product 9 (AWS) had an ingredient card for arbutin, which it does not contain

"Arbutin 2%" was copied from product 8 (SWS), where arbutin is real and is the
fourth ingredient listed. There is no arbutin anywhere in the AWS INCI. The card
was removed rather than rewritten — inventing a replacement needs the AWS
dossier read in full, which is a separate audit.

### 5. Missing and wrong ingredient data on product 5

- `1,2-Hexanediol` was absent from the INCI despite being present at significant
  concentration and printed on the carton. Restored.
- "Hyaluronic Acid" corrected to the actual INCI name, **Sodium Hyaluronate**.

### 6. Drug-register claims

"Healing", "regeneration", "cell turnover", "cell renewal" all removed and
replaced with nourishment, comfort, recovery and conditioning.

### 7. Missing safety warning

The carton carries a pregnancy and breastfeeding precaution — on account of the
two artemisia extracts — that appeared nowhere on the site. Added, with the
reason stated. The marine collagen / fish allergy note was added alongside it.

### 8. Missing selling points that were sitting on the box

- **CVS = Concentrated Vitality Solution.** The site never said what the three
  letters meant.
- **5-Free**, printed twice on the packaging, named nowhere on the site.

Both are now load-bearing sections on the new page.

---

## The bespoke page

New files:

```
components/product/powersolution/PowerSolutionProductPage.tsx
components/product/powersolution/powerSolutionCopy.ts
components/product/powersolution/powersolution.css
```

Registered in `components/product/bespokePdp.tsx` and added to the allow-list in
all three route files (`app/products/[id]`, `app/ru/...`, `app/ar/...`).

### Palette

Sampled off the product photography. The packaging is white, glass and clinical,
with exactly one colour on it: the label red at `#be0a14`, taken from the DNA
mark and the CVS wordmark. The lifestyle shot sits on a lilac-grey studio
backdrop at `#cecbd2`.

So the page runs cool and near-neutral and spends its one colour on the accent.
It stays clear of the two bespoke pages either side of it — product 53 is crimson
on warm ground, product 52 is dusty clay on warm ground. This one is a colder,
harder red on a cold ground, so a professional ampoule does not read as a retail
mask.

### Section order

`solution → formula → 5-Free → range → how to use → actives + INCI → suited → specification → FAQ`

### Where it deliberately differs from product 52

**No proof section.** There is no clinical study on this product. Product 52 has
one and charts it. Inventing an equivalent here is exactly what would make 52's
chart worthless.

**The cross-sell is the range, not a routine.** The Power Solutions are a
professional line and are deliberately absent from `PRODUCT_ROUTINES` — a routine
telling a shopper to layer a clinic ampoule at home is the wrong advice. A new
`BESPOKE_COMPANIONS` map in `bespokePdp.tsx` feeds the five sibling ampoules to
`getRoutineProducts` instead, and they render as a six-row range table with live
price, stock and add-to-bag. Choosing between the six **is** the decision a buyer
is making, so the cross-sell is the comparison.

**The formula is charted in two independently scaled groups.** The humectant base
(12.485% and 11.48%) and the actives (2.5% down to 0.02%) are two orders of
magnitude apart; one shared scale renders every active as an invisible sliver.
Each group states its scale in the heading and every row prints its own figure,
so the chart never has to be read on its own.

### Images

- `CVS.jpg` — lifestyle shot on a lilac-grey backdrop. Gallery and closing band.
  **Never** placed on a `.cera-stage`; multiplying it would show the backdrop as
  a grey block.
- `Second/cvs_big2.jpg` — single vial, pure white, inline figure, multiplied.
- `Second/cvs_big1.jpg` — open box, pure white, inline figure, multiplied.

All three checked at full resolution — authentic photography, no AI artefacts.
The duplicate main image was removed from the DB `images` array.

---

## Selling tone

Per the `selling-tone` rule, the copy was swept for anything that argues against
buying, and for dossier vocabulary. Removed in all three locales:

- "declared function" → "the job printed on the carton" / "the function
  registered in Korea"
- "The manufacturer files a quantitative formula…" → said in our own voice
- The actives note led with chart mechanics; reordered to lead with the dose,
  which is the reason to buy
- "there is no preservative system built for a second day" — an assertion the
  dossier does not make (1,2-hexanediol and ethylhexylglycerin are both in the
  INCI) → "the solution is meant to be used fresh rather than kept. That is the
  point of ten of them."
- The how-to heading said "Four steps" above six rendered steps → "One vial,
  start to finish."

Kept deliberately, because it protects the buyer and makes the rest credible:
the pregnancy warning, the fish allergy note, and the "Look elsewhere if" list —
every entry of which redirects to a named sibling vial, so it is a cross-sell
rather than a dead end.

---

## Verification

- `tsc --noEmit` clean, `eslint` clean on all new and touched files
- All three locales render HTTP 200 with the bespoke layout
- Full-page screenshots reviewed at readable resolution in EN, RU, AR and mobile
- Arabic RTL confirmed correct: names right-aligned, bars filling from the right,
  the 5-Free strikethrough sitting at the right optical height, the INCI held
  `dir="ltr"` so the commas do not reverse
- Russian decimal separator confirmed — `12,485%` not `12.485%`
- Zero occurrences of "microneedl" or "IGF-1" in the product 5 payload
- Products 4, 6, 7, 8, 9 re-checked: HTTP 200, zero IGF-1, zero phantom arbutin

---

## Queued for the per-product audits (4, 6, 7, 8, 9)

Left alone on purpose — each needs its own carton and safety assessment read the
way product 5 was. Flagged here so it is not lost:

- Drug-register wording throughout: "healing", "regeneration", "reduces
  inflammation", "stimulates"
- Microneedling-only usage copy, same problem as product 5 had
- "Licensed practitioners only", which the cartons do not appear to restrict to
- Product 9 needs a replacement for the removed arbutin card
- Russian artwork for this range carries therapeutic claims (regeneration,
  collagen production, vessel strengthening) that the ingredient concentrations
  do not support. Not used in any copy. Raise with DTS MG rather than translating.

---

## Scripts

Permanent, in `scripts/`:

- `fix-power-solution-cvs-5-claims-20260814.ts`
- `fix-power-solution-cvs-5-peptide-doses-20260814.ts`
- `fix-power-solution-cvs-5-use-context-20260814.ts`
- `fix-power-solution-siblings-igf1-20260814.ts`

Throwaway, in `scripts/tmp/`: `cvs-locales.py`, `cvs-peptide-locales.py`,
`cvs-use-context-locales.py`, `check-locales.ts`, `ps-siblings.ts`, `shoot-p5.js`.

All DB scripts are dry-run by default and need `--apply` to write.

---

## Follow-up: two more sources of the IGF-1 claim (found during production verification)

Verifying the range on production turned up the same falsehood in two places the
first sweep missed, because it only searched the database and the translation
files:

- **`lib/chatbot/config.ts`** — the chat widget's knowledge base told customers
  sh-Polypeptide-7 was an *"IGF-1-analog peptide that stimulates cell
  regeneration"*. This is live customer-facing text and the most likely place the
  claim would have been repeated verbatim. Rewritten, and given an explicit
  instruction never to call it an IGF-1 analogue, naming sh-Oligopeptide-2 as the
  peptide that actually is one.
- **`lib/products.ts`** — the static catalogue served by
  `staticCatalogFallback()` in `lib/productsDb.ts` whenever a database read
  fails. Eight occurrences: six across the Power Solution descriptions and two in
  the HR³ hair solution peptide lists.

The Snow O2 / Skin Rescue Overnight growth-factor complex genuinely lists IGF-1
as one of five factors, so those mentions in the translation files were left
alone.
