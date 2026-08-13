# Product 58 — ANTI-AGING BEAUTY BOX: kit copy aligned with the cartons

Date: 13 Aug 2026
Scope: product 58 only (English database record + Russian and Arabic bundles) plus the
desktop artwork worklist. No other product's copy was touched.

## What was checked

Prices and sizes first, because a bundle page lives or dies on the arithmetic:

| Item | Kit copy said | Database / carton | Verdict |
|---|---|---|---|
| Snow O₂ | 180ml · 330 AED | 180ml · 330 AED | ok |
| Snow Booster | 200ml · 260 AED | 200ml · 260 AED | ok |
| MF Anti-Wrinkle Serum | 30ml · 330 AED | 30ml · 330 AED | ok |
| MF Anti-Wrinkle Cream | **50ml** · 290 AED | **NET WT. 50g** · 290 AED | size wrong |
| Collagen mask ×5 | 36 AED each = 180 | 36 AED each = 180 | ok |
| Bundle total | 1,390 → 1,181.50 (−15%) | 1,390 × 0.85 = 1,181.50 | ok |

## What was wrong, and the document that settles it

1. **Cream size.** `Artwork-GENOSYS MULTI FUNCTIONAL ANTI WRINCLE CREAM(50g).pdf` prints
   `NET WT. 50g/1.76 oz.` The kit said 50ml.

2. **"Anti-aging Peptide 6" on the cream line.** The cream's quali-quanti list
   (`Ingridients-GENOSYS MULTI FUNCTIONAL ANTI-WRINKLE CREAM.pdf`) contains **no peptide of
   any kind**, and `GENOSYS MULTI FUNCTIONAL ANTI-WRINKLE CREAM.pptx` never mentions one. The
   real tube credits "skin firming ingredients - propolis and collagen".
   The name is genuine but belongs to the **serum**: its formula carries exactly six peptides
   (Palmitoyl Tripeptide-5, Dipeptide-2, Palmitoyl Tetrapeptide-7, Palmitoyl Tripeptide-1,
   Palmitoyl Hexapeptide-12, Acetyl Hexapeptide-8), the serum deck names all six under
   "Anti-aging Peptide 6", and the Korean carton text reads 펩타이드 6종. The kit had pasted the
   serum's ingredient line onto the cream.
   The cream line now carries the cream's own actives, matching its product page:
   Bakuchiol, Propolis Extract, Hydrolyzed Collagen & Elastin, Adenosine, Niacinamide,
   Mango Seed Butter, Lipid Barrier Liposome (Ceramide NP, Cholesterol, Phytosphingosine) -
   all four liposome components verified present in the formula.

3. **"Peptides" on the mask line**, and "delivers collagen and anti-aging peptides directly
   to the skin". `GENOSYS INTENSIVE REPAIR COLLAGEN MASK.pdf` (quali-quanti) contains no
   peptide. The sachet itself says: "IMPROVES SKIN FIRMNESS AND PROTECTS SKIN BARRIER BY
   SOOTHING AND HYDRATING SKIN WITH COLLAGEN AND VARIOUS BOTANICAL EXTRACTS." The line now
   names the real ones: Hydrolyzed Collagen, Sodium Hyaluronate, Witch Hazel, Grapefruit,
   Centella Asiatica, Pomegranate and Soybean Extracts.

4. **Mask named only "Collagen mask".** Renamed to **Intensive Repair Collagen Mask** so the
   customer can find the standalone product (#53).

5. **Arabic Snow Booster line** omitted Phytolex SC and listed beta-glucan instead, while
   English and Russian named Phytolex SC. Both are true (all four are in the formula) but the
   locales disagreed. Arabic now matches: Phytolex SC, lotus flower, pumpkin ferment, betaine.
   This string is shared by 8 box entries in the Arabic bundle, so all 8 were aligned.

## Files

- `scripts/fix-anti-aging-box-58-claims-20260813.ts` — English record, run with `--commit`
- `scripts/tmp/locales58.mjs` — Russian and Arabic bundles, exact-string with match counts
- `data/productTranslationsRu.ts`, `data/productTranslations.ts`
- `~/Desktop/genosys-artwork-corrections.html` — 5 new rows under product 58

## Verified

All three locales on `localhost:3100`: `50ml` gone, `50g` present, `Intensive Repair Collagen
Mask` present, `Peptides, Botanical Extracts` gone, `Mango Seed Butter` present, and
`Anti-aging Peptide 6` left standing exactly once, on the serum line.

Note: `.env` and `.env.local` point at the same database, so the English fix took effect on
live and local at the same moment. Russian and Arabic are code, so they needed the deploy.

## Two things left open

1. **The P&K clinical citation.** "Clinical study on improvement of skin age index, P&K Skin
   Research Center, Feb. 22 to May 13, 2024, 24 adult women aged 30~59 years" appears on the
   serum and cream lines here and on both product pages. Every PDF, PPTX and DOCX under
   `Desktop/Drive/Genosys` and `Desktop/Glass_Skin` was searched for "P&K", "skin age index"
   and the Korean equivalents: **zero hits**. `docs/SESSION_CHANGES_2026-07-28_ANTI_WRINKLE_SERUM_6_SLIDES.md`
   already recorded it as site copy from `lib/products.ts`, not from a manufacturer document.
   It is a specific, checkable citation, so it probably came from DTS MG by mail or a slide
   that is not in the archive. Left in place, flagged for a decision.

2. **The Arabic bundle carries product 58 twice**, keyed both by CUID
   `cmhozfrep00008oxxizeqk8a0` and by `'58'`, with slightly different transliterations. Both
   copies were fixed. Worth de-duplicating at some point.

## Artwork

`/images/bbox_age/main.jpg` is the only image for this product and all five rendered bottles
carry invented label text. No false ingredient claim, so this is a credibility problem rather
than a compliance one. Five rows added to the worklist, priority order: mask sachet (product
name fully invented), serum (wrong product code MFE for MFS), cream (loses "with BAKUCHIOL"),
toner badge, cleanser baseline.
