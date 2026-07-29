# Session Changes — Intertek Product Content Audit (Full Catalog)

**Date:** 2026-07-29
**Scope:** Product-by-product audit of live DB copy vs local Intertek source documents (`/Users/vadimkus/Desktop/Drive/Genosys/Registration/Intertek`), per the `genosys-intertek-source-of-truth` rule. Fixes applied to DB, static fallbacks, chatbot config, and AR/RU translations.

## Method

1. Dumped live product data from Prisma DB (`scripts/audit-products-dump.json`).
2. Audited products in 6 batches against Intertek PDFs/PPTX/DOCX (formulas, artwork, COAs, training manuals).
3. Applied DB fixes via `npx tsx --env-file=.env.local` scripts per batch.
4. Mirrored fixes into `lib/products.ts`, `lib/productQuickFactsCatalog.ts`, `lib/chatbot/config.ts`, `messages/en.json`, `messages/ar.json`, `data/productTranslations.ts` (AR), `data/productTranslationsRu.ts` (RU).

## Fix scripts (DB)

- `scripts/fix-intertek-audit-batch1-serums.ts` — serums + Bio-Meso ampoules
- `scripts/fix-intertek-audit-batch2-creams.ts` — creams
- `scripts/fix-intertek-audit-batch4-cleansers.ts` — cleansers, toners, peelings (+ `fix-snow-o2.ts`)
- `scripts/fix-intertek-audit-batch5-masks.ts` — masks
- `scripts/fix-intertek-audit-batch6-hair-eye-pro.ts` — hair, eye, devices, PRO ampoules

## HIGH-severity findings (all fixed)

### Batch 1 — Serums + Bio-Meso
- **MOISTURE REPLENISHING HYALURON SERUM (18):** removed fabricated "78% coconut water complex"; HA count 11 → 8 forms (formula + EN artwork); "4-step" → multi-level hydration.
- **ALL FOR SENSITIVE SERUM (19):** replaced unverifiable "MultiEx BSASM® Plus" + "Phytolex SC" with real Centella Asiatica complex + Chamomile flower extract actives.
- **MULTI VITA RADIANCE SERUM (21), MULTI FUNCTIONAL ANTI-WRINKLE SERUM (22):** usage instructions corrected.
- **BIO MESO PDRN AMPOULE 60000 (60) / PDRN HOMECARE AMPOULE 5000 (65):** fixed PDRN concentration misattribution and wording.

### Batch 2 — Creams (full report below)
- **SOOTHING REPAIR POSTCREAM (25):** **final resolution (user-confirmed with product photo + variant selector):** the product is sold in BOTH sizes via DB variants — **20g = 204 AED (default)** and **100g = 440 AED** (exactly 2× the UAE clinic price list of 102/220 AED = standard retail markup). The original "20g" base size was CORRECT all along; the audit's 20g→100g change was reverted. Base `size` field = "20g" (default variant), descriptions note both sizes. The "20g" COA filename was NOT a clerical error.
- **MOISTURE REPLENISHING HYALURON CREAM (29):** removed invented "72-hour hydration persistence / clinically proven" (no study cert in file; artwork says only "DERMATOLOGICALLY TESTED"); "Hyaluronan 11 Multi-Complex" → multi-molecular HA complex (8 forms — "11" appears only in Korean marketing text, never in English docs); "4-step" → multi-level.
- **EGF REPAIR OXYMASK CREAM (26, hidden):** sh-Oligopeptide-1 at 0.00001% (0.1 ppb) and Madecassoside at 0.0001% (1 ppm) — both non-functional trace; reframed story around the real hero: oxygen bubbling technology (Methyl Perfluoroisobutyl Ether 5%).
- **SKIN BARRIER PROTECTING CREAM (27):** removed "Enriched Ceramide / high concentration" (Ceramide NP is trace); replaced unverified "MultiEx BSASM® Plus" branding with NMF amino acid complex; removed "clinically proven" directions.

### Batch 3 — Sun/BB
- Applied to DB + fallback + translations (see batch-3 script/log in prior session docs).

### Batch 4 — Cleansers/Toners/Peelings
- **INTENSIVE PROBLEM CONTROL TONER (15):** removed fabricated ingredients; real actives = Zinc PCA, Tea Tree, Salicylic Acid.
- **EPI TURNOVER BOOSTING PEELING GEL (16):** removed fabricated vitamins; real actives = Papaya, Moringa, Desert Complex.
- **MICROBIOME ENERGY INFUSING MIST (14):** HA count 10 → 7 forms; added shake step.
- **SKIN RENEWAL PEELING SYSTEM / SRS (13):** clarified Phytic Acid as chelator; added AHA percentages (pH 3.02 confirmed by COAs L0907U and L1037B).
- **SKIN DEFENDER LIP & EYE MAKEUP REMOVER (17):** softened vitamin "nourishment" claim.
- **SNOW O₂ CLEANSER (12):** corrected Methyl Perfluoroisobutyl Ether oxygen-delivery wording.

### Batch 5 — Masks
- **INTENSIVE REPAIR COLLAGEN MASK (35):** removed fabricated ingredients.
- **BIO-FERMENT AGE DEFYING POWDER MASK (36):** removed "Fermented Green Tea"; rephrased "Fermented Rice".
- **SKIN REBOOT PDRN MASK PACK (52):** removed Hyaluronic Acid claim (not in formula).
- **HYDRO COOL MODELING MASK (37):** added critical mixing instructions.
- **EZ CO₂ MASK KIT (38):** application time 15–20 min → 10 min.
- **PEPTIDE GEL MASK (39):** application time 15–20 min → 20–40 min.
- **SKIN RESCUE OVERNIGHT CREAM MASK (34):** downplayed Growth Factor Complex claim.

### Batch 6 — Hair/Eye/Devices/PRO Ampoules
- **All 6 POWER SOLUTION ampoules (HES, CVS, SWS, CTS, PCS, AWS):** sh-Polypeptide-7 description corrected — "human growth hormone-like peptide" → "IGF-1-analog peptide" (EN + AR + RU).
- **POWER SOLUTION CVS:** Lactobacillus ingredient corrected; **AWS:** Arbutin 2% and Ceramide 3 naming fixed.
- **HR³ MATRIX HAIR TONIC α / HAIR SOLUTION α:** ingredient lists rebuilt — removed fabricated actives, added real ones.
- **HR³ MATRIX SCALP PEELING α:** removed old ingredients, added Copper Tripeptide-1.
- **EyeCell EYE PEPTIDE GEL PATCH:** ingredient list rebuilt from real formula.
- **Microneedle Roller:** "FDA-approved" → "CE-certified / ISO 13485".
- **HR³ MATRIX MEDI SCALP SHAMPOO α:** name corrected in description.
- **EyeCell EYE CONTOUR CREAM:** added Arbutin 2%.

## Batch 2 full report (creams) — for the record

| Product (id) | HIGH | MED | LOW | Notable |
|---|---|---|---|---|
| MULTI VITA RADIANCE CREAM (31) | 0 | 0 | 0 | Clean — no MELAZERO ✓ |
| MULTI FUNCTIONAL ANTI-WRINKLE (32) | 0 | 1 | 1 | Collagen/Elastin trace overpromised → reframed as "Hydrolyzed … ECM support" |
| MOISTURE REPLENISHING HYALURON (29) | 2 | 1 | 0 | Fixed (above) |
| INTENSIVE HYDRO SOOTHING (28) | 0 | 1 | 1 | Snail trace toned down; usage evening → morning-evening |
| SOOTHING REPAIR POSTCREAM (25) | 1 | 0 | 0 | REVERTED — both sizes real, sold as variants (20g=204 AED default / 100g=440 AED) |
| SKIN BARRIER PROTECTING (27) | 1 | 2 | 0 | Fixed (above) |
| INTENSIVE PROBLEM CONTROL (30) | 0 | 1 | 1 | Added "lightweight gel-cream texture" (gel formulation, no emollients) |
| ND Cell ANTI-WRINKLE (23) | 0 | 1 | 1 | "Botox-like" removed (Acetyl Hexapeptide-8 at 0.000025%, ~100× below functional threshold) |
| EGF REPAIR OXYMASK (26) | 2 | 1 | 0 | Fixed (above) |

Verified-OK highlights:
- MVRC (31): "6,000 times stronger than Vitamin C" (Astaxanthin) confirmed verbatim in training manual; VITA 12 complex all 12 vitamins confirmed in formula; no MELAZERO anywhere ✓.
- MFAWC (32): Bakuchiol 0.1% + "natural alternative to Retinol" confirmed in PPTX.
- MRHC (29): 6 mushroom species and 8 HA variants confirmed in formula + artwork.

## Translation sync (this session)

- **RU (`data/productTranslationsRu.ts`):** coconut 78% removed; HA 11 → 8 forms (serum + cream); HA 10 → 7 forms (mist); AFS BSASM/Phytolex → Centella/Chamomile; Skin Barrier rebuilt (NMF amino acid complex, Ceramide NP, no "enriched"/"clinically proven"); Hyaluron Cream 72h claims removed (description, keyBenefits, keyFeatures, benefits, directions).
- **AR (`data/productTranslations.ts`):** 72-hour clinical claims removed from Hyaluron Serum/Cream description blocks and bundle benefits; earlier batches already synced (toner, collagen mask, oxymask, barrier, hyaluron cream).

## Improvement ideas parked (not yet applied)

- MRHC (29): feature Saccharide Isomerate (0.615%) and name the 6 mushroom species.
- IHSC (28): feature Betaine (5.0%) and Lactobacillus/Pumpkin Ferment (0.1%).
- SRPC (25): communicate both sizes — 20g homecare (102 AED list) for retail, 100g professional (220 AED list) for clinics; feature Beta-Glucan 2.5%, Sodium Hyaluronate 5.0%, Squalane 1.5%.
- SBPC (27): position Glycerin 17.5% + Hydrogenated Polydecene 7% as moisturizing backbone; market amino acids as "NMF blend".
- IPCC (30): feature Polyglutamic Acid, Rumex Crispus, Radish Root Ferment, Beta-Glucan, Birch Bark (all 0.1%).
- ND Cell (23): lead with Copper Tripeptide-1 (0.005%); specify "stable vitamin C" (Ascorbyl Glucoside).
- Oxymask (26): mention Zinc Gluconate for post-procedural positioning.
- MVRC (31): feature Niacinamide 2% + Gluconolactone + Licorice for brightening.
- MFAWC (32): add Niacinamide 2% + Propolis + Mango Seed Butter to keyFeatures.

## Open follow-ups

- Verify with WINNOVA whether amino acid blends in SBPC/AFS are officially registered as MultiEx BSASM® variants; if confirmed, branding can be restored.
- Mesopecia Kit vial count and HES formula documentation — flagged during batch 6, needs source-doc confirmation.
