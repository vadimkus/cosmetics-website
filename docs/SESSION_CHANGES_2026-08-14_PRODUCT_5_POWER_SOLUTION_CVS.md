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

## Follow-up: making the hero blend into the page

The hero shot sat inside the gallery card as a hard-cornered grey rectangle. Two
separate causes, both fixed.

### 1. The shot was the wrong shape for the stage

`CVS.jpg` is **956x662** on a lilac-grey studio sweep. The gallery stage is
square and uses `object-contain`, so the shot landed in the middle of the stage
tint with 147px of a *different* grey above and below it — a rectangle with sharp
corners inside a rounded card.

No CSS fixes this. The sweep is a 2D gradient (darker top-left, lighter
bottom-right), so no flat stage colour and no single `linear-gradient` can meet
it without a seam. And it cannot be cropped square: a centre crop of 956x662
cuts the box off on the left and the vials off on the right.

`scripts/square-cvs-hero-image-20260814.py` extends the shot to **956x956** by continuing
its own sweep. The top and bottom edge rows carry no product detail, only smooth
sweep, so they can be run outward. The extension continues the photo's measured
vertical brightness slope with the step damped geometrically, so a 147px pad
cannot drift into a visible band, and the first extended row *is* the photo's own
edge row, which makes the join seamless by construction. Measured seam delta:
**0.26/255 top, 0.02/255 bottom.**

There is no higher-resolution version of this composition on the Drive. The
3744x3300 transparent PNG in `Artwork/Art_Work/Product_images/` is the open-box
shot, which is already on file as `cvs_big1.jpg`.

### 2. The sweep was darker than the page

Filling the stage removed the inner rectangle but the card still read as a grey
slab: the sweep ran to `#c8c5cd` while the page behind it is `#f5f4f8`.

The first attempt was a plain levels move, 150 -> 196. It worked on the tone and
wrecked the pack: everything above the black point is rescaled, and the box and
the vial labels live in the 200-255 range, so they lost **44% of their contrast**
and went chalky.

The fix separates the two. A 10px blur holds the sweep, which is pure low
frequency; the difference holds every edge, letter and label. Only the blur is
lifted, then the detail is added back at full amplitude. The curve is a flat
+22 offset up to 200, easing to nothing by 252 — flat so the sweep and the
shadow under the box move together and the pack stays grounded rather than
floating, rolling off so the pack's own whites barely move and nothing clips.
Long enough to stay monotonic, so the sweep cannot band or invert.

| | before | after |
|---|---|---|
| gap to page tint at the corners | 44/255 | 24/255 |
| box face + logo contrast kept | 56% | **85%** |
| vial label contrast kept | — | **92%** |
| pixels blown to white | 0.00% | 0.19% |

### 3. A bug this surfaced: the multiply rule was catching the gallery

`powersolution.css` had `.powersolution-page .cera-stage img { mix-blend-mode:
multiply }` for the two inline figures, which are on pure white. But the gallery
stage is *also* a `.cera-stage`, so the hero was being multiplied against the
stage tint — darkening the very sweep this work is about. Rescoped to a new
`.ps-figure` class carried only by the two inline figures.

Rescoping then exposed the opposite problem in the gallery: `cvs_big1.jpg` and
`cvs_big2.jpg` are 2000px on **pure white**, and a white square in a square stage
fills the card completely, turning it into a stark white block against the lilac
page. So `CeraGalleryImage` gained an optional `blend` flag. This gallery mixes
backgrounds — one studio sweep, two whites — and now each slide is treated
correctly. Thumbnails sit on white and are left alone.

With `--cera-stage` set to `#e6e5e8`, sampled from the outer ring of the squared
hero, the card is the **same tone on all three slides** (measured `(223..238)`
for the hero, `(230,229,232)` exactly for both whites), so clicking through the
rail no longer changes the colour of the card. `--cera-shot` was moved to the
same value so the closing band's 300px image column stops reading as a panel.

### Filenames and caching

Written as a **new file**, `/images/cvs-hero.jpg`. `/images/*` is served with a
one-year immutable cache, so overwriting `CVS.jpg` would have left every repeat
visitor on the old copy. `CVS.jpg` stays on disk: historical order emails
reference it. `scripts/repair-dead-order-item-images.ts` reports **0 dead and 0
unresolved** rows across 1,931 order items.

`lib/products.ts` was updated to match, and the main image dropped from its
`images` array — web and mobile both prepend it, per the product-gallery-images
rule.

Worth knowing for the next one of these: Next 16 caches optimised images in
`.next/dev/cache/images`, not `.next/cache/images`, and it caches AVIF and WebP
under separate keys. A `curl` sending `Accept: image/webp` can return fresh bytes
while the browser keeps getting stale AVIF, which looks exactly like the edit not
having worked.

### Scripts

- `scripts/square-cvs-hero-image-20260814.py` — squares and lifts the hero. Takes an
  optional output path so the look can be iterated into `/tmp` before the real
  file is written once.
- `scripts/set-cvs-5-square-hero-20260814.ts` — points product 5 at the new hero
  and keeps the main image out of the gallery array. Dry run by default.

### Mistake worth not repeating: order of operations

The database was pointed at `/images/cvs-hero.jpg` *before* the file was pushed.
The database is shared with production, so production started asking for the new
hero on its next render while the asset still returned **404** — about three
minutes of a broken hero image on a live product page. Polling caught it: the
page referenced `cvs-hero` from the second attempt, the asset only answered 200 on
the eleventh.

The product-gallery-images rule already says to commit and push the image files
first, because they only serve after the Vercel deploy, and *then* update the
database. Local-only verification is not a reason to skip that order — there is
no local-only database.

---

## Selling-tone pass, Aug 15

Commit `fa1b91d7`, applied to CVS and HES together because HES inherited the
phrasing. An audit of the page found one pattern repeated a dozen times: the
copy sized the actives down at the moment it should have been selling them.

| Was | Now |
|---|---|
| the base "carries a small dose across a whole face" | carries the actives |
| "The Korean botanical tail", "all present in small amounts" | "The Korean botanicals", each named in full |
| chart caption noting base and actives are "two orders of magnitude apart" | each group charted on its own scale so the actives stay readable |
| peptide FAQ ending on tissue repair being a drug claim | boundary kept, but the answer ends on the sequence being identical every time |
| "A quiet, old-fashioned comfort ingredient" | "decades of use behind it" |
| "Five things the box says are not in it" | "Five things that are not in it" |
| "the registration file" (×4) and a closing line about checking before you buy | dropped |

Two of the edits were corrections, not tone. The Arabic still carried a
"last tested batch" phrase that the English and Russian lost in the lot-code
cleanup, and the Russian subheadline promised the function in one word and
then gave two.

Rejected from the audit: it claimed Arabic and Russian say "declared function"
where English says "registered", four times each. Both already say مسجّل and
зарегистрированное. It also proposed restoring "our most recent lot was made in
December 2024", which is the lot vocabulary the same session had just removed.
Verify a reported string exists before rewriting it.

Also rejected: the suggested heading "Nothing in it to sting" promises a
reaction no formula can guarantee. Shipped as "Nothing harsh in it", which the
no-fragrance, no-ethanol, no-pigment formula supports.

### Deploy state at the end of the session

`fa1b91d7` was on `main` and unshipped after an hour, with production still on
`dpl_2kmzoBiMsQPkcQEyNPktUd1oGWoD`. Builds ran 25 to 60+ minutes all evening.
`npm run build` compiles and all 463 pages generate, so this is queue time, not
the code. To confirm it landed:

```bash
curl -s https://genosys.ae/products/5 | grep -c 'botanical tail'   # expect 0
```
