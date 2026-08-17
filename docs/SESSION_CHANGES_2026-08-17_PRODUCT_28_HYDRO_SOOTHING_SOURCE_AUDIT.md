# Product 28 — INTENSIVE HYDRO SOOTHING CREAM — source audit

Product 28 is on the list of products where a previous audit went wrong by not
reading the safety assessment trade-name tables and the DTS MG decks before
calling a claim unsupported. **That rule earned its place again here.**

## The near miss, first, because it is the lesson

The Intertek safety assessment states plainly, under *Information on the cosmetic
product*:

> - Patch Test: Satisfactory (Non Irritant – QACS Ltd)
> - **Other Tests: None presented.**

Our record claims *"Efficacy test on skin hydration."* On the dossier alone, that
claim is unsupported and I would have deleted it.

**It is supported.** The DTS MG homecare deck
(`~/Desktop/Glass_Skin/01-official-pdfs/GENOSYS FACIAL TREATMENT_Homecare_2025.pdf`)
carries a **CLINICAL TRIAL DATA** page, positioned immediately after this
product's ingredient pages and immediately before the next product, reading:

> The conducted studies have shown that regular and systematic application of the
> tested product "GENOSYS Intensive Hydro Soothing cream" according to the
> guidelines:
> - **improves skin hydration by 12% after 4 weeks of application**
> - **reduces skin temperature by average of 1 °C after 20 minutes after
>   application**

So there are **two** quantified endpoints, and our site was using neither. The
hydration one we claimed without the number; the cooling one we never mentioned at
all, despite it being the more distinctive of the two.

**Caveats to state on the page:** the deck gives no CRO, no subject count, no
method and no instrument. So these are the manufacturer's clinical figures with
those limits disclosed, not a peer-reviewed result.

## The premix trap, which is almost certainly the earlier failure

Three documents give three different numbers for the same ingredients, and only
one of them is finished concentrations.

| Ingredient | Quali-quanti (WINNOVA) | 2014 SA raw material | **Formula_up (current, finished)** |
|---|---|---|---|
| Snail Secretion Filtrate | **0.100%** | 0.100% premix × 1.00% | **0.0010% = 10 ppm** |
| Beta-Glucan | **0.100%** | 0.100% premix × 79.60% | **0.0004% = 4 ppm** |
| Phaseolus Radiatus Extract | **0.100%** | 0.500% premix × 1.50% | **0.0075%** |
| Betula Platyphylla Bark | **0.100%** | 0.500% premix × 0.02% | **0.0001%** |
| Rumex Crispus Root | **0.100%** | 0.500% premix × 0.01% | **0.00005%** |
| Lactobacillus/Pumpkin Ferment | **1.000%** | 1.000% premix × 10.00% | **0.1000%** |

**Anyone reading the quali-quanti sheet alone would report snail secretion filtrate
at 0.1% when it is 10 parts per million — overstated one hundred fold.** The
0.100% figures on that sheet are the *raw material* additions, and the actual
actives only emerge when you multiply by the purity column in the safety
assessment's Table I. That is what the rule means by the premix trap, and this
product is the clearest example of it in the range.

The supplier trade names, which appear in **no other document**:

- **PHYTOLEX SC** (0.500%) = Phaseolus Radiatus Extract + Betula Platyphylla
  Japonica Bark Extract + Rumex Crispus Root Extract, in water and butylene
  glycol. The deck confirms the branded name and describes it as a herbal complex
  that relieves irritation.
- **SNAIL MUCOUS EXTRACT-WP** (0.100%) = 1.00% snail secretion filtrate, the rest
  water, hexanediol, pentylene glycol, caprylyl glycol, butylene glycol.
- **SC-GLUCAN** (0.100%) = 79.60% beta-glucan with glycerin and hexanediol.
- **PUMPKIN EXTRACT-F** (1.000%) = 10.00% Lactobacillus/Pumpkin Ferment Extract.
- **NATURAL EXTRACT BP 20** = betaine. **HYDROLIFE® 6 O** = 1,2-hexanediol.
  **CARBOPOL® 940** = carbomer. **KELTROL® F** = xanthan gum.

## The safety assessment on file assesses a formula we no longer sell

QACS assessment ID **E3 14 06 01808**, signed 25 November 2014, for a formula
recorded as *"used since 2013.05"*.

The current signed formula and the registered carton INCI both contain four
ingredients that appear **nowhere** in that assessment:

- **Nelumbo Nucifera Flower Extract** (0.00057%)
- **Prunus Mume Fruit Extract** (0.00024%)
- **Lactic Acid** (0.000006%)
- **Citric Acid** (0.000006%)

And three concentrations moved materially:

| | 2014 assessment | Current formula | |
|---|---|---|---|
| Aloe Barbadensis Leaf Extract | 1.000% | **0.0500%** | 20× down |
| Beta-Glucan | 0.0796% | **0.0004%** | ~200× down |
| Sodium Hyaluronate | 0.0005% | **0.0500%** | 100× up |

The carton INCI matches the current formula exactly, so the carton is right and
**the assessment is the stale document**. This is a real compliance item: the EU
safety assessment should be refreshed against the formula actually in the tube.

## What is actually doing the work

**21.7% humectants**, and the standout is not mentioned anywhere on our site:

| Ingredient | Dose | |
|---|---|---|
| Butylene glycol | **10.555%** | |
| Glycerin | **6.175%** | |
| **Betaine** | **5.000%** | **A high dose; typical cosmetic use is 0.5–2%** |
| 1,2-Hexanediol | 2.002% | Solvent, and part of the preservation system |
| Carbomer / KOH / xanthan | 0.500 / 0.135 / 0.100% | The gel structure |
| Lactobacillus/Pumpkin Ferment | **0.1000%** | 1,000 ppm |
| Aloe Barbadensis Leaf Extract | **0.0500%** | 500 ppm |
| Sodium Hyaluronate | **0.0500%** | 500 ppm |
| Phytolex trio, combined | 0.00765% | ~76 ppm |
| **Snail Secretion Filtrate** | **0.0010%** | **10 ppm** |
| Nelumbo / Prunus Mume | 0.00057 / 0.00024% | 5.7 and 2.4 ppm |
| **Beta-Glucan** | **0.0004%** | **4 ppm** |

**Betaine at 5% is the story.** It is an osmolyte, and DTS MG's own deck credits
it with *"superior hydration"* and anti-inflammatory action against redness and
irritation — yet it appears in none of our copy. Meanwhile **snail secretion
filtrate at 10 ppm is the second ingredient our description names**, and
beta-glucan at 4 ppm is listed as a key ingredient.

The deck attributes to snail secretion filtrate that it *"accelerates cell
regeneration"* and *"stimulates collagen production"*. At 10 ppm, neither reaches
the page.

## It has no functional licence, and that is consistent

The carton reads **"Function Hydrating, soothing"** with no Korean
`기능성화장품` bracket, unlike products 32, 23 and 42. Correspondingly, neither
certificate of analysis carries an ingredient assay line — there is no functional
active to measure. So the substantiation for this product rests entirely on the
formula and the deck's clinical figures, which is exactly why finding those
figures mattered.

The carton's own registered claim: *"HSC relieves skin and gives moisture after
skin treatment with a skin protecting ingredient — snail secretion filtrate and
soothing, moisturizing ingredients — aloe vera and hyaluronic acid."* So
**post-treatment use is a registered claim**, though the carton itself
over-features the snail.

## COA, lot WML008 (50 g)

| Test | Specification | Result |
|---|---|---|
| Appearance | Transparent gel cream | Pass |
| pH at 25 °C | 6.00–7.00 | **6.39** |
| Stability at 50 °C | Pass | Pass |
| Total bacteria | < 100 cfu/ml | **< 10** |
| Molds and yeast | < 100 cfu/ml | **< 10** |
| Content | > 97% of 50 g | **50.95 g** |

Manufactured 4 December 2023, expiry 3 December 2026 — three years. Bulk
205.2 kg. Made by **WINNOVA Co., Ltd — a third contract manufacturer, distinct
from the other products audited this week, and not to be named.**

Note this COA screens only total counts, where products 23 and 25 screened four
named pathogens. The 2014 assessment records a separate challenge test by the
manufacturer against *E. coli*, *S. aureus*, *P. aeruginosa*, *C. albicans*,
*A. niger* and in-house strains, with satisfactory results.

## Other facts our site never carried

- **Period after opening: 6 months.** The `6M` symbol is on the carton.
- **It is not vegan** — snail secretion filtrate, for 10 ppm.
- **It is a gel-cream, transparent**, per both the COA and the assessment, and the
  deck calls it a "gel type moisturizer". Our description called it a "gel" while
  the product name says cream; "gel-cream" is the accurate word.
- **No traditional preservative.** Protection comes from the glycols —
  1,2-hexanediol at 2.0%, plus pentylene and caprylyl glycol. No paraben, no
  phenoxyethanol. The assessor flagged this twice: *"it is not clear which
  ingredients contribute to the microbiological protection"* and a caution that
  Lactobacillus may affect preservative performance over shelf life.
- **Avoid broken skin** — Korean precaution 2, same as product 25.
- **Do not use near the eyes.**
- Assessment conclusion is clean: *"safe for human health when used under normal or
  reasonably foreseeable conditions of use"*, no restrictions attached.

## The UAE angle is in GENOSYS's own protocol document

`Protocol_Hydration_Treatment.pdf` frames the local problem in the brand's own
words: desert humidity *"often <20%"*, constant air conditioning creating an
*"artificial desert indoors"*, and temperature shock moving between the two. Paired
with the deck's **−1 °C after 20 minutes**, that is a genuinely strong and
locally specific angle for this product, and it is all sourced.

## Errors and gaps for `~/Desktop/genosys-artwork-corrections.html`

1. **★ The EU safety assessment is stale.** Dated 2014 for a 2013 formula; the
   current formula adds four ingredients and moves three concentrations
   materially. Should be reassessed.
2. **★ Fourth volume-on-weight error.** The Russian panel declares
   **"Объем 50 мл"** against **NET WT. 50g**. Now found on the cleanser, product
   32, product 25 and this one. Four separate cartons — this is a template
   problem, not four mistakes.
3. **★ The Russian panel overclaims at 10 ppm.** It states the snail secretion
   filtrate *"борется со старением и регенерирует"* — fights ageing and
   regenerates — and that the cream *"активизирует процессы восстановления кожи"*.
   Fourth product with drifted non-English panels.
4. **Ask whether the current carbomer grade is benzene-free.** The 2014 assessment
   records *"traces (<0.02%) of benzene … derived from Carbopol … considered
   unavoidable"*. Modern carbomer grades avoid benzene entirely. Internal question
   only — this does not belong on a customer page, but it should be asked.
5. **Ask for the clinical study report** behind the +12% hydration and −1 °C
   figures. The deck states them without CRO, n or method. With the report we
   could present them properly rather than hedged.
6. **The ISO 22716 GMP certificate** was listed as outstanding in the 2014
   assessment. Worth confirming it was supplied.
7. **One image only** (`/images/HSC.jpg`), `images: null`. No gallery.
