# Hair-loss protocol PDF — rewritten against the audited formulas

Found while starting the source audit for product 3 (HairGen BOOSTER). Stopped that work
to deal with this first, on the owner's decision.

## What was wrong

`public/documents/PPT/Protocol_Hair_Loss.pdf` is a **customer-facing, GENOSYS-branded
document** served at 200 and reachable from two places:

- the download button on `/products/concern/hair-loss` (all three locales, plus the
  native app via `GET /api/mobile/concerns/hair-loss`)
- the brochure link on **product 64's page** (`HairStampProductPage.tsx`, `BROCHURE_URL`)

It was titled **"GENOSYS Hair Loss Treatment — Home Care Protocol"**, its stated goal was
to *"reduce shedding, stimulate growth, strengthen follicles, prevent further loss"*, and
it closed with a month-by-month table promising *"first signs of new growth"* at month 3
and *"significant results — fuller hair"* at month 6.

**It contradicted five product pages corrected the same week**, and it was ours — not the
manufacturer's — which makes it the most exposed hair-loss claim surface we had.

### Factual errors, each checked against the signed formulas

| The protocol said | Reality |
|---|---|
| Biotin is in the **HAIR SOLUTION** | Not in its formula at all. Biotin is shampoo-only, at 2 ppm |
| Caffeine is in the **HAIR SOLUTION** | Not in its formula at all |
| Niacinamide is in the **TONIC** | Not in the tonic. It is in the solution, at 0.100% |
| "**High-concentration** Copper Peptides" in the solution | 5 ppm |
| Saw palmetto "**blocks DHT** (hormone linked to pattern hair loss)" | 1 ppm in the shampoo, 10 ppm in the solution |
| Salicylic acid "exfoliates scalp, unclogs follicles" in the peeling | 99 ppm — a twenty-fifth of the tonic's dose |
| Scalp peeling: "leave for 5 minutes… **rinse thoroughly**" | It is a **leave-on**, applied on a swab, not rinsed |
| Hair Solution: "1–2 droppers full… **leave overnight**", nightly | It is a sealed **4 ml vial per session**, used immediately after opening |

The last two are usage instructions that would have had customers using two products
incorrectly — one of them nightly, at AED 92.50 a vial.

Prices were the one thing it got right: shampoo 340, tonic 290, solution 740, peeling
290, brush 50, kit 1,100, booster 1,800, Gentron 3,300, and all three set totals (680 /
1,710 / 7,910) verified against the live records.

### The letterhead was three ways stale

Checked against `lib/siteConfig.ts`, which is the canonical source:

| Printed | Should be |
|---|---|
| "Genosys Middle **FZ-LLC**" | Genosys Middle **East** FZ-LLC |
| "Compass Coworking Centre, Al Shohada Road, Ras Al Khaimah" (old MBAM0014 Al Hamra unit) | VUET0209, Compass Building – Al Hulaila, Al Hulaila Industrial Zone-FZ, Ras Al Khaimah |
| +971 55 915 29 85 | +971 58 548 76 65 |

`siteConfig.ts` already records the Al Hamra → Al Hulaila move. **The other seven concern
protocol PDFs almost certainly share this letterhead** and have not been checked.

## What was done

### The root cause: there was no source

The eight protocol PDFs were static binaries with **no source anywhere in the repo**,
which is how this one drifted without anyone being able to review it. That is now fixed
for this one:

| File | |
|---|---|
| `scripts/protocols/protocol-hair-loss.html` | reviewable source, with a MUST-NEVER-BE-ADDED header |
| `scripts/build-protocol-pdf.ts` | Playwright renderer, keyed by slug so the other seven can follow |

Regenerate with `npx tsx scripts/build-protocol-pdf.ts hair-loss`. The logo is inlined as
a data URI so no server is needed.

### The rewritten document

Retitled **"Scalp & Hair Home Protocol"**. It opens by stating what the products are
registered for — scalp cleansing, scalp nourishing and hair conditioning, scalp
refreshing, nutrition supply — and says plainly that none of them is registered to treat
hair loss and that anyone losing hair should see a doctor, because several causes are
treatable with things a cosmetic cannot replace.

What it now leads on instead:

- **Caffeine at 1.000% in the shampoo**, against 10 ppm in the tonic — the one dose in
  the range the literature would recognise, in the cheapest daily product.
- **The three-minute shampoo dwell time** off the Russian panel, without which the
  actives get no contact at all.
- **Panthenol 0.200% and menthol 0.300%** in the tonic, at their exact functional
  concentrations, with the assay results (103.40%, 99.37%, 101.28%).
- **The tonic's salicylate avoid-list** — diabetes, circulatory disorders, renal
  impairment, pregnancy, menstruation, under-3s — which appears on the Korean panel only
  and had never been given to customers. Given diabetes prevalence in the UAE this is the
  single most important addition.
- **The tonic's 3-month period after opening**, the shortest in the range.
- **The peeling as a prep step**, 33.6% alcohol, not rinsed, not a disinfectant.
- **The ampoule as a course product**, one sealed vial per session.
- **A full ingredient table** giving the measured concentration of every named ingredient
  across all four products, including the thousandfold spread in copper tripeptide-1
  (5 ppm → 5 ppb).
- **The needling contraindications** — metal allergy, keloid-prone skin, active
  dermatitis, inflamed or broken skin, diabetes complications — drawn from the Mesopecia
  carton and the HairGen Booster manual.

It also carries an explicit **retraction block** naming the four claims it used to make,
on the precedent set by product 44's page refusing the carton's dandruff claim. The words
"DHT" and "high-concentration" appear once each in the document, inside that retraction.

The month-by-month growth timeline is gone, replaced by a closing statement that a scalp
routine should be judged on how the scalp feels, and hair loss judged with a doctor.

Six A4 pages, 307 KB.

### Concern page metadata

`lib/concernsData.ts` — the download's own blurb promised **"growth-boosting steps"** and
"product sets by hair loss stage" in all three languages. Retitled and rewritten to
describe what the document actually contains. `fileSize` updated 163 KB → 307 KB.

## Verified

- `tsc --noEmit` and `eslint` clean.
- PDF serves 200 as `application/pdf`.
- `/products/concern/hair-loss` in en, ar and ru all 200 with the new title and no trace
  of the old wording.

## ★ Still open — needs a decision

**1. The concern page's SEO metadata makes the same claim**, and I did not change it
because it affects search rankings and that is a commercial call:

| | Current |
|---|---|
| EN title | "**Hair Loss Treatment** UAE \| Scalp Care & **Hair Growth** Dubai \| GENOSYS" |
| EN description | "Professional Korean hair loss **treatment solutions**… for hair **growth stimulation**. **Used by Dubai trichologists.**" |
| AR title | "علاج تساقط الشعر الإمارات" — hair loss treatment |
| RU title | "Лечение выпадения волос ОАЭ" — hair loss treatment |

"Used by Dubai trichologists" is also an endorsement claim with nothing behind it. There
is a defensible middle — the page can be *about* hair loss so that people searching for
it arrive, without stating that the products treat it.

**2. `data/productTranslationsRu.ts`** describes the HairGen BOOSTER as being for
"комплексного лечения" (comprehensive treatment) of hair loss.

**3. The other seven concern protocol PDFs** have not been read. They share the stale
letterhead at minimum, and cover concerns whose products were audited over the past week.

**4. Product 3 (HairGen BOOSTER) itself** — the audit that started this is written up in
`SESSION_CHANGES_2026-08-18_PRODUCT_3_HAIRGEN_BOOSTER_AUDIT.md`.
