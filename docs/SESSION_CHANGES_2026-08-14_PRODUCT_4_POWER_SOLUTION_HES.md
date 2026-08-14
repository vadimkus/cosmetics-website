# Product 4 — POWER SOLUTION HES: claims audit and bespoke page

**Date:** 14 August 2026
**Product:** POWER SOLUTION HES (product number 4), 2 ml × 10 sealed glass vials
**Live:** https://genosys.ae/products/4 · `/ru/products/4` · `/ar/products/4`

---

## What this was

The next product in the rolling audit-and-rebuild pass, straight after product 5
(CVS). Same shape: verify every claim against the manufacturer documents, fix
whatever is wrong in the database and the two translation files, then build a
bespoke page that sells the product on the verified facts.

HES is the sibling of CVS — same carton, same format, same price — and it is the
better product to sell, because it has one genuinely distinctive fact behind it
and that fact was missing from the site entirely.

---

## Source documents

All under `/Users/vadimkus/Desktop/Drive/Genosys/Registration/Intertek`:

| Document | Used for |
|---|---|
| `Registration DOC/Formula/Formula-GENOSYS POWER SOLUTION HES.pdf` | The quantitative formula. Identical to both Quali-quanti copies, so unlike CVS there is no superseded version to fall for. |
| `Registration DOC/SA/SA-GENOSYS POWER SOLUTION HES.pdf` | Supplier trade names against INCI and percentage — the only place BIOPHYTEX® LS 9832 and MATRIXYL 3000 are recorded. Also the pH spec, "no declarable allergen in the perfume", and the somatotropin description of sh-Polypeptide-7. |
| `Registration DOC/COA/COA-GENOSYS POWER SOLUTION HES(WNL053).pdf` | Lot WNL053, Dec 2024: pH 5.75 (spec 4.50–6.50), specific gravity 1.0272 (0.9950–1.0350), <10 cfu/ml, expiry 11 Dec 2027. |
| `Registration DOC/Artwork/[GENOSYS]POWER SOLUTION HES.pdf` | Carton text, the full INCI, the four application pictograms, the roller diagram, the precaution text. |
| `Artwork/Art_Work/Catalogue/GENOSYS CATALOG.pdf` p22–24 | The molecular-weight ladder with the Dalton figures, the roller mechanism, BIOPHYTEX's six-botanical composition. |

`Intertek_folder/Certififcate of Analysis/8 POWER SOLUTION HES - COA-GENOSYS
(WID090).pdf` is the **2019** lot and its pH spec (5.00–6.00) has since been
widened. WNL053 is the current one.

The manufacturer named on both COAs is a contract manufacturer. Per the
selling-tone rule it is never named on the site; "Made by DTS MG Co., Ltd., South
Korea" is what the page says, and DTS MG owns GENOSYS, so that reads as heritage.

---

## Errors found and fixed in the database

1. **1,2-Hexanediol was missing from the INCI.** It is 2.00% and fourth on the
   carton. The same omission CVS had.
2. **"Hyaluronic Acid" used as an ingredient name.** The INCI is Sodium
   Hyaluronate.
3. **Healing and regeneration throughout** — "promoting optimal healing",
   "stimulates cellular renewal and healing processes", Copper Tripeptide-1 as a
   "healing peptide" that "reduces inflammation", phytosphingosine with
   "anti-inflammatory benefits". None of that belongs on a cosmetic.
4. **"Free from … sulfates"** appears in no source. The badge on the box reads
   formaldehyde, artificial fragrance, artificial colourant, ethanol, artificial
   pigment. The catalogue prints a different five; the badge wins, because it is
   what the buyer is holding. The discrepancy is logged in
   `genosys-artwork-corrections.html`.
5. **"Clinical-grade results"** and **"long-lasting"** with nothing behind them.
6. **`howToUse` invented a protocol** — "1–2 ampoules" per treatment and "3–5
   days post-treatment". The vial is a single 2 ml dose and the four steps are
   cleanse, open, apply, absorb.

`scripts/fix-power-solution-hes-4-claims-20260814.ts`

### What was missing, which matters more

The one fully documented fact that makes this product worth buying was absent:
**HES runs hyaluronic acid at 1.65 ± 0.35 million Dalton**, deliberately placed
between dermal-filler grade (above 2 million) and the sub-1-million HA ordinary
cosmetics use. Heavier HA binds more water but cannot get through skin unaided,
which is the entire reason it is paired with a roller. Also absent: HA at 1%,
niacinamide at 2%, adenosine at 0.04%, MATRIXYL 3000, and what BIOPHYTEX
actually is.

That fact is now the spine of the page.

### On microneedling

Unlike CVS, the roller **is** documented for this product — the carton diagrams
it across three panels and the catalogue explains the mechanism — so it stays.
It is framed as what the sources support: a way to carry heavy HA past the
surface. The four printed steps are leave-on, so the page also says it works on
its own, which the Russian carton text states outright.

---

## Slide 6 carried an invented protocol

`s6.jpeg` read: *"HES is the primary Power Solution in the GENOSYS **Hydration
Rescue Protocol**."* There is no such protocol in any GENOSYS document. It was
replaced with *"HES is the hydrating and firming GENOSYS Power Solution"*, which
is the registered function.

Written to a **new filename**, `s6new.jpeg`. `/images/*` is served with a
one-year immutable cache, so overwriting `s6.jpeg` would leave every repeat
visitor on the invented claim. `s6.jpeg` stays on disk untouched.

`scripts/tmp/fix_s6.py` erases the old caption and re-renders; the font was
matched against the original by rendering candidates side by side first
(`scripts/tmp/s6_font_test.py`).

---

## The page

`PowerSolutionProductPage` was built for CVS. Rather than fork it, it now takes a
**variant**:

```
PowerSolutionVariant = {
  paletteClass, getCopy, formulaBase, formulaActives, fullInci,
  vialImage, boxImage, blendGallerySlides, heroOnWhite
}
```

- `components/product/powersolution/CvsProductPage.tsx` → `CVS_VARIANT`
- `components/product/powersolution/HesProductPage.tsx` → `HES_VARIANT`

Both wrappers are `'use client'`. A variant carries `getCopy`, a function, and
functions cannot be serialised across the server/client boundary — as a server
component the wrapper would have to pass the variant as a prop into the client
page and React refuses it, with a `use server` error that names `getCopy`.
Declaring the wrapper as a client component keeps the handoff inside the client
bundle, where the variant is an import rather than a payload.

### The section the product needed: the molecular weight ladder

An optional `ladder` block on `PowerSolutionCopy`, rendered only when a variant
supplies it (CVS has none). Three columns, heaviest first, with a dot above each
sized to stand in for the molecule:

| | In a dermal filler | **In GENOSYS HES** | In an ordinary serum |
|---|---|---|---|
| Weight | Above 2 million Dalton | **1.65 million Dalton** | Under 1 million Dalton |
| Delivery | Injected | **Rolled in** | Absorbed |

The dots are sized by `nth-child` and sit in a fixed-height rail with
`align-items: flex-end`, so all three land on one baseline and the copy beneath
stays aligned across the row. Sizing them without the rail pushed each column's
text down by a different amount. DOM order is unchanged in RTL — only the visual
direction flips — so the dots stay matched to their figures in Arabic.

### Palette: green, and why

CVS runs a hard red on cold grey. HES is the nearest neighbour in the range with
an identical carton, an identical format and an identical price, so the two must
not be confusable at a glance. The accent is the green off the vial label
(`#54a240`, deepened to `#4a9a38` for fills and `#337524` for text) and the
neutrals lean green rather than blue.

The CVS palette was moved from `.cera-page.powersolution-page` to
`.ps-cvs`, and `.ps-hes` added alongside it. Contrast for every pair the page
actually renders was checked against WCAG AA; the closest is 4.63:1.
`scripts/tmp/hes_contrast.py` — the first `muted` candidate failed at 4.31 and
was darkened from `#6b776c` to `#667267` (5.04).

### Gallery stage: near-white, nothing blended

Two variables are now per-palette rather than hard-coded:

| | CVS | HES |
|---|---|---|
| `--ps-stage` | `#e6e5e8` | `#fbfcfa` |
| `--ps-figure-stage` | `#e6e5e8` | `#eef1ea` |
| `blendGallerySlides` | the two white packshots | none |

CVS mixes a studio sweep with two pure-white packshots, so it multiplies the
whites down to the stage tint. All eight HES slides are square and fill the
stage — four on white, four full-bleed infographics — so multiplying half of them
would change the card colour as the shopper clicks through. A near-white stage
lets the white slides meet it invisibly instead. Verified by sampling the stage on
all eight: the page corner reads `(244,246,241)` on every slide.

The two inline figures still multiply, because they never fill their stage.

### The inline figures

Only one photograph of this product exists outside the infographic slides, and it
holds both subjects on white. `scripts/tmp/hes_figures.py` lifts each subject to
its own bounds and re-centres it on a fresh white frame, rather than widening the
crop in place — widening drags in the box shoulder beside the vial, and past the
canvas edge it comes back black.

The vial search window stops at `y=1010` on purpose: a row profile of the right
third shows vial plus reflection at 385–1007 and a large decorative "×10" at
1019–1108. True of the pack, meaningless beside copy about molecular weight, and
it reads as a botched crop. Both figures were untracked when recropped, so
overwriting them in place was safe; the immutable-cache rule only binds assets
that have already served.

---

## Selling tone: the carton is not a source

The claims audit fixed accuracy and, in doing so, sourced a dozen claims to the
packaging — "the two functions printed on the carton", "the carton diagrams it
across three panels", "the carton's own four steps", "which is why the box can
say no artificial fragrance". Every one is accurate. None belongs in body copy.
The selling-tone rule reserves "as printed on the carton" for the full INCI note,
where it tells a buyer the on-screen list matches the pack in their hand.
Everywhere else it reads as us reading the box back to someone already holding
it.

Fixed on all three surfaces, all three languages:

- `hesCopy.ts` — 8 English strings, 8 Arabic, 8 Russian
- the English database row — `scripts/fix-power-solution-hes-4-tone-20260814.ts`
- `data/productTranslations.ts` and `data/productTranslationsRu.ts`

Also dropped "batch" where it was doing no work — "3% of the batch" is 3% of the
vial — and fixed one real inaccuracy while there: it is Korea that registers the
function, not the carton. The spec table now uses the same lot phrasing CVS
already ships (`5.75 on lot WNL053, against a 4.50 to 6.50 specification`).

Both translation files hold 60+ products and share the sh-Polypeptide-7
description verbatim with the five sibling ampoules, so every edit was applied
inside product 4's block and spliced back. An unscoped replace matched twice.

---

## Files

| File | Change |
|---|---|
| `components/product/powersolution/hesCopy.ts` | New. All HES copy in three locales, plus `HES_VARIANT`. |
| `components/product/powersolution/HesProductPage.tsx` | New. Client wrapper. |
| `components/product/powersolution/CvsProductPage.tsx` | New. Client wrapper, extracted from the old default export. |
| `components/product/powersolution/PowerSolutionProductPage.tsx` | Takes a variant; optional ladder section. |
| `components/product/powersolution/powerSolutionCopy.ts` | `PowerSolutionVariant`, optional `ladder`, `CVS_VARIANT`. |
| `components/product/powersolution/powersolution.css` | Palettes split per product; ladder styles. |
| `components/product/bespokePdp.tsx` | 4 → `HesProductPage`, 5 → `CvsProductPage`, companions for 4. |
| `app/products/[id]/page.tsx` + `ar` + `ru` | Product 4 opted in. |
| `public/images/hes_power/s6new.jpeg` | Corrected slide 6. |
| `public/images/hes_power/vial-square.jpg`, `box-front.jpg` | Inline figures. |
| `data/productTranslations{,Ru}.ts` | Product 4 tone fixes. |
| `scripts/fix-power-solution-hes-4-claims-20260814.ts` | The audit fixes. |
| `scripts/fix-power-solution-hes-4-tone-20260814.ts` | The tone fixes. |

---

## Still to do after the deploy

The database gallery still points at **`s6.jpeg`**, the slide with the invented
protocol. It has to stay that way until `s6new.jpeg` is live on Vercel.

The CVS session got this backwards and put a 404 on a live product page for about
three minutes: the database is shared with production, so pointing it at an asset
that has not deployed yet breaks the live page immediately. Push the image, wait
for the deploy, confirm `s6new.jpeg` returns 200, **then** update the gallery.

### Deploy status at the end of this session

Commit `484e7890` is on `main`. Forty minutes later production was still serving
the previous build: `vial-square.jpg`, `box-front.jpg` and `s6new.jpeg` all 404,
and `/products/4` had no `ps-ladder` markup. `npm run build` passes locally and
`npx tsc --noEmit` is clean, so this is a Vercel queue or build-side matter, not
the code. The gallery was left on `s6.jpeg` as the rule requires.

Once the build lands, the remaining step is one command:

```bash
npx tsx --env-file=.env.local scripts/update-power-solution-hes-4-gallery-20260814.ts --apply
```

That script HEADs `https://genosys.ae/images/hes_power/s6new.jpeg` first and
refuses to write while it 404s, so the CVS mistake cannot repeat even if it is
run early. Dry run without `--apply`. Afterwards, confirm `/products/4` shows
the corrected slide 6 and that no gallery entry resolves to a 404.
