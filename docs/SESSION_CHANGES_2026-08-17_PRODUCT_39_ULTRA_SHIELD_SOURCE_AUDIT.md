# Product 39 — ULTRA SHIELD SUN CREAM [SPF50+ / PA++++] — source audit

The best-documented product in the range so far, and the one whose website
record was furthest from its own paperwork.

## Documents read

`~/Desktop/Drive/Genosys/Registration/Intertek/`

- `UAE - GENOSYS ULTRA SHIELD SUN CREAM (RENEWED)/Formula-...pdf` — signed DTS
  MG quali-quanti formula. **This is the current formula.**
- `UAE - .../SA-GENOSYS ULTRA SHEILD SUN CREAM.pdf` — a 59-page **EU safety
  assessment under EC 1223/2009**, QACS Lab, study period February 2025, ID
  24 06 01975. Contains the SPF and UVA test results and the raw-material
  trade-name table. Folder misspells "SHEILD".
- `UAE - .../Artwork-GENOSYS ULTRA SHIELD SUN CREAM.pdf` — the registered
  carton in eight languages, including the Korean functional declaration.
- `Ultra Shield Sun Cream/COA-...50g.pdf` — lot 370CK.
- `Ultra Shield Sun Cream/GENOSYS ULTRA SHIELD SUN CREAM.pptx` — DTS MG deck.
- `Ultra Shield Sun Cream/GMP-DTS MG_2023.pdf`, `CFS`, `Trade_License`.

## The headline: it is SIX filters, not seven

The site says "7-filter UV system" in the description, in `keyFeatures`, and as
an ingredient heading. Three independent sources say six.

**The registered Korean functional-ingredient declaration (효능성분)** names
exactly eight actives, six of which are filters:

> 티타늄디옥사이드, 호모살레이트, 에칠헥실살리실레이트,
> 비스-에칠헥실옥시페놀메톡시페닐트리아진, 에칠헥실트리아존,
> 테레프탈릴리덴디캠퍼설포닉애씨드, 나이아신아마이드, 아데노신

**Deck slide 3** lists "Chemical: TDSA, Homosalate, Ethylhexyl Salicylate,
Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine, Ethylhexyl Triazone. Mineral:
Titanium Dioxide" — five plus one.

**The safety assessment's raw-material table** gives the trade names and, more
usefully, the assigned function of each:

| Trade name | INCI | % | Function per dossier |
|---|---|---|---|
| PARSOL® HMS | Homosalate | 4.000 | **UV Filter** |
| Parsol EHS | Ethylhexyl Salicylate | 3.500 | **Sunscreen Agent** |
| Solfilter TDSA | Terephthalylidene Dicamphor Sulfonic Acid | 3.069 | **Sunscreen Agent** |
| Tinosorb® S | Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine | 3.000 | (listed "Hair-Conditioning Agent" — clerical error) |
| Uvinul® T150 | Ethylhexyl Triazone | 2.000 | **Sunscreen Agent** |
| Trans Titan HT60 | Titanium Dioxide | 1.533 | (listed "Opacifying Agent") |
| **HALLBRITE® BHB** | **Butyloctyl Salicylate** | **5.000** | **Skin-Conditioning Agent** |

**Total filter load: 17.10%.**

The seventh thing being counted is almost certainly **Hallbrite BHB**, at 5% the
single largest of the group. It is not an approved UV filter — it is a solvent
and photostabiliser that keeps the others dissolved and raises SPF indirectly.
The dossier classes it as a skin-conditioning agent and so does the deck, which
leaves it out of its filter list entirely.

So: **six**, and say so. The number is not the selling point anyway.

## What makes this page: the protection is independently measured

From the safety assessment, tests by Dr Koziej Sp. z o.o. Sp.k.:

- **SPF measured in vivo: 65.9 ± 4.74.** Labelled 50+ because 50+ is the ceiling
  a European label is allowed to state.
- **UVA protection factor: 23.13** (report B-0151/3) and **24.3** (report
  B-0159/23).
- Commission Recommendation 2006/647/EC requires UVA-PF of at least one third of
  the SPF. One third of 65.9 is 22.0. Measured 23.13 to 24.3. **It clears the
  requirement**, and the assessment states the product complies.

That is a genuinely strong, checkable claim and almost nothing on the current
page reflects it. Lead the page here.

## Homosalate: worth addressing head on

The safety assessment devotes several pages to it, so a reader who looks it up
should find us ahead of them:

- SCCS opinion SCCS/1622/20 (June 2021) concluded homosalate was **not** safe at
  up to 10%, and put the safe level at 0.5%.
- Industry submitted further data. The SCCS revised its position: **safe as a UV
  filter up to 7.34% in face cream**.
- **Commission Regulation (EU) 2022/2195** wrote 7.34% into EC 1223/2009, with
  compliance deadlines of 1 January and 1 July 2025.
- **This formula uses 4.0%**, a little over half the permitted maximum, and the
  dossier's margin-of-safety column reads >100.

The assessment's overall conclusion: "The product is considered safe with
restrictions for human health when used under normal or reasonably foreseeable
conditions of use."

## "Dermatologically tested" — supported here, unlike product 36

The safety assessment records an in-vivo cutaneous irritancy patch test by Dr
Koziej with satisfactory results, and states the claim "can be referred on the
label". It is printed on the registered carton. The claim stands.

The assessor adds one caveat worth keeping in mind internally: "even though the
number of volunteers is not statistically significant." So do not build the page
on it; state it once and move on.

## The trace-dose problem, again, and worse than product 36

The whole "recovery / sunburn care" narrative — which is what the deck uses to
separate this from Multi Sun Cream — rests on this:

| Marketed as | INCI | % w/w | Actual |
|---|---|---|---|
| "Sunburn Care Complex" | Lithospermum Erythrorhizon Root Extract | 0.000001 | **10 ppb** |
| "Sunburn Care Complex" | Scutellaria Baicalensis Root Extract | 0.000001 | **10 ppb** |
| "Sunburn Care Complex" | **Ceramide NP** | **0.00000001** | **0.1 ppb** |
| "MicroHA™" | Hydrolyzed Sodium Hyaluronate | 0.0001 | 1 ppm |
| "ProbioMETA™" | Lactobacillus Ferment Lysate | 0.000098 | ~1 ppm |
| "Tropical Antioxidant Complex" | Pineapple / Papaya / Litchi / Guava | 0.0000025 each | 25 ppb each |

**Ceramide NP is at one part in ten billion.** The site description says
"Ceramide NP ... strengthen the barrier" and deck slide 6 credits it with
strengthening the barrier and inhibiting melanin biosynthesis. At 0.1 ppb a 50 g
tube contains roughly five nanograms of it.

Deck slide 7 goes further and says the Lactobacillus ferment "helps improve
rosacea and acne" — a medical claim, on a ~1 ppm ingredient, which must not
appear anywhere near this site in any dose.

**What is actually at a working dose:** the six filters at 17.10% combined,
**niacinamide at 2.00%**, and **adenosine at 0.04%** — the standard Korean
functional dose for wrinkle improvement. Those three are exactly what the Korean
registration certifies the product for.

## Korea licenses it for three things

The carton carries `[자외선 차단, 미백, 주름개선 3중 기능성 화장품]` — a
triple-functional cosmetic for **UV protection, brightening, and wrinkle
improvement**. Each function has an active behind it: the filters, niacinamide
2%, adenosine 0.04%. Same structure as the BB Cushion on product 41, and here
the filters make it more impressive rather than less.

## Two claims to drop

1. **"Reef-safe."** Deck slide 3 and our studio slides S1 and S5 all say it.
   The verifiable part is true — there is **no oxybenzone and no octinoxate** in
   the formula, confirmed against the full INCI. But "reef-safe" is an
   unregulated term, and the formula does contain homosalate and octisalate,
   which several jurisdictions have since questioned. Say the specific thing,
   not the marketing word.
2. **Anything implying water resistance.** The deck says "suitable for swimming
   and marine sports" and studio slide S5 photographs a woman with wet hair.
   **There is no water-resistance test anywhere in the pack.** Without one, no
   swimming claim, and the page should tell people to reapply after water.

## COA, lot 370CK

| Test | Specification | Result |
|---|---|---|
| pH | 7.20 ± 1.00 | **7.23** |
| Hardness | 60 ± 20 | 64 |
| Specific gravity | 1.030 ± 0.010 | 1.03 |
| Net weight | 50 g | **50.9 g** |
| Total aerobic count | ≤ 100 CFU/g | **Not detected** |
| E. coli / P. aeruginosa / S. aureus / C. albicans | Not detected | **All not detected** |

Manufactured 18 September 2023. Made by cnf Co., Ltd — **contract manufacturer,
do not name**. Carton states 12M after opening.

pH 7.23 is higher than typical skincare, which is normal here: TDSA is a
sulfonic acid and the tromethamine at 1.5% neutralises it.

## Errors in our own record

1. **"7-filter UV system"** in `description`, `keyFeatures` and the `ingredients`
   heading. It is six. Note the `keyFeatures` entry says "seven" and then lists
   six.
2. **The Full INCI is from a superseded formula.** Our record lists
   **Cyclopentasiloxane** and **Cyclohexasiloxane**. Neither appears in the
   registered formula or on the carton; the current formula uses Diisopropyl
   Sebacate and Dimethicone instead. Listing D5 and D6 when they are not present
   is wrong in a way that matters, because both are regulated substances people
   actively screen for.
3. **"Reef-Safe"** in `benefits`, and `keyBenefits` says "reef-safe protection".
4. **Ceramide NP, MicroHA™ and ProbioMETA™** credited with barrier repair,
   hydration and healing at 0.1 ppb to 1 ppm.
5. **`productDetails.technology` is "MicroHA™ and ProbioMETA™ technology"** —
   naming the two trace ingredients as the technology of a sunscreen whose
   actual technology is a 17.1% filter system.
6. **Barcode discrepancy.** `data/productBarcodes.ts` has EAN `8809849803436`;
   the renewed artwork prints `8809849808165`. Both are DTS MG ranges. Needs a
   physical check of current stock before either is changed — flagged, not
   touched.

## Errors in our studio slides

For `~/Desktop/genosys-artwork-corrections.html`:

1. **S1 and S5 print "Reef-safe."**
2. **S1 and S3 tube renders are badly garbled** — "PROCTZHONAL",
   "DERMATOLO6ICALLY TESTEB", "SEKMIOOLOGICALLY TETTEO", "PROFESSIONPOLL",
   "[3F₹20≠ / PA wees]", "GENDETS is a compound word of". Worse than the Sea
   Algae renders because the tube is large in frame and clearly legible.
3. **S3 is built entirely on the trace complexes.**
4. **S5 implies water activity** with no water-resistance test to support it.
