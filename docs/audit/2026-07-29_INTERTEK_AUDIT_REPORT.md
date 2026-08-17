# Intertek vs Website — Master Audit Report (WORKING DRAFT) — 2026-07-29

Audit method: 6 parallel batch agents compared live DB copy (`scripts/audit-products-dump.json`)
against Intertek registration docs (`/Users/vadimkus/Desktop/Drive/Genosys/Registration/Intertek/`).

Status legend: ✅ verified OK · 🔴 HIGH (wrong fact/invented claim) · 🟡 MED (missing active/misleading) · ⚪ LOW (polish)

---

# BATCH 3 — SUN + BB ✅ COMPLETE — ✅ FIXED 2026-07-29

**Fixes applied (all verified against Intertek formula/artwork docs):**
- DB: `scripts/fix-intertek-audit-batch3-sun-bb.ts` (all 5 products — description/keyFeatures/ingredients/howToUse/directions/size)
- Fallback: `lib/products.ts` (39/40/42/63 descriptions)
- Quick facts: `lib/productQuickFactsCatalog.ts` (39: Sunburn Care Complex/MicroHA™/reef → barrier trio/hydrolyzed HA/oxybenzone-free)
- Routine copy: `messages/{en,ru,ar}.json` routineRevitaGlowBBDesc (puff → blend)
- Translations: `data/productTranslations.ts` (AR 39/40/41/42), `data/productTranslationsRu.ts` (RU 39/41/42)
- Cushion 41: size → "15g + 15g Refill"; shades Ivory/Beige/Camel added; SPF 50+; 40% peptide claim removed
- Deferred (LOW): Multi Sun SPF 40 PA++ source doc (CFS/artwork) not in Intertek folder — keep rating, obtain doc
- Kept: Phytolex SC in Snow O2/Snow Booster/All For Sensitive/Hydro Soothing etc. (line-wide complex — only absent from IBB 42 formula)

## ULTRA SHIELD SUN CREAM [SPF 50+ PA++++] (id 39)

**Docs:** `UAE - GENOSYS ULTRA SHIELD SUN CREAM (RENEWED)/Artwork|Formula|CFS.pdf`

✅ SPF 50+ PA++++ (artwork, all languages) · ✅ 50g · ✅ Hydrolyzed Sodium Hyaluronate in formula

- 🟡 1. "MicroHA™" — trademark not in docs; formula lists plain Hydrolyzed Sodium Hyaluronate 0.0001%. Fix: drop ™ branding.
- 🟡 2. "ProbioMETA™" — fabricated trade name; formula = Lactobacillus Ferment Lysate 0.000098%. Fix: use INCI name.
- 🟡 3. "Sunburn Care Complex" + "Tropical Antioxidant Complex" — fabricated complex names. Formula has 4 fruit extracts @0.0000025% each; "Sunburn Care Complex" has NO corresponding ingredient. Fix: name actual extracts; remove Sunburn Care Complex.
- ⚪ 4. "Reef-Safe Formula" — unsubstantiated in docs. Formula has no oxybenzone/octinoxate (basis exists). Fix: qualify as "free from oxybenzone and octinoxate" or remove.

**Improve:** 7 UV filters (Homosalate 4%, Ethylhexyl Salicylate 3.5%, Terephthalylidene Dicamphor Sulfonic Acid 3.07%, BEMT 3%, Ethylhexyl Triazone 2%, TiO2 1.53%) — strong callout. Ceramide NP present. **Niacinamide 2%** deserves named callout.

## MULTI SUN CREAM [SPF 40 PA++] (id 40)

**Docs:** `Ingredient lists_old/GENOSYS MULTI SUN CREAM.pdf`

✅ Palmitoyl Pentapeptide-4 0.010% · ✅ Rosa Damascena + Vitis Vinifera callus 0.010% · ✅ Centella, Scutellaria, Soymilk ferment 0.010%

- 🔴 1. **Sodium Hyaluronate listed as key ingredient — ABSENT from formula** (39 ingredients, no hyaluronate of any kind). Fix: remove immediately.
- ⚪ 2. SPF 40 PA++ unverifiable from available docs (no CFS/artwork in folder). Fix: locate CFS/artwork to formally confirm.

**Improve:** Mannan 1% film-former/humectant for moisture-lock angle. Replace HA claim with real mechanism (Glycerin 1% + Mannan 1% + Dimethicone).

## SKIN CARING BLEMISH BALM CUSHION [SPF 50+ PA++++] (id 41)

**Docs:** `SKIN CARING BLEMISH BALM CUSHION/…/Artwork-[GENOSYS]…#03.pdf`, `…/Formula-…#03.pdf`, `Beige/Ingridients-…Biege.pdf`

✅ PA++++ all languages · ✅ 9 peptides (Pep9) all confirmed · ✅ Glutathione 0.010% + Volufiline source (Anemarrhena)

- 🔴 1. **"SPF 50" instead of registered "SPF 50+"** in live description. Artwork: "(SPF50+ PA++++)" ×4 languages. Fix: SPF 50 → SPF 50+ everywhere.
- 🔴 2. **"Various peptide complex 40%" — fabricated %**. All 9 peptides at 0.000001–0.000064%; total <0.001%. False-advertising risk. Fix: remove 40%; say "9-Peptide Complex (Pep9)".

**Improve:** artwork confirms **15g + 15g refill included** ("15 g * 2") — value differentiator not mentioned. Shade names Ivory #01 / Beige #02 / Camel #03. Niacinamide 2% callout.

## REVITA GLOW BLEMISH BALM CREAM [SPF 38 PA+++] (id 63)

**Docs:** `GENOSYS REVITA GLOW BB CREAM/Bright_01|Natural_02/Artwork…`, `…/Formula-…#01.pdf`

✅ SPF 38 PA+++ both artworks · ✅ 10-vitamin complex all confirmed (A, B1, B2, B3, B4, B5, B7, B9, C, E) · ✅ 7+ herbs + glass-skin claim · ✅ shades #01 Bright / #02 Natural

- 🔴 1. **"Dedicated puff" format error** — live directions describe puff application + fabricated "Micro Air-Cell / Quadruple Adhesion Coating" puff tech. This is a TUBE BB cream — artwork: "Apply to the face after skincare. Blend well…", no puff anywhere. Cross-contamination from Cushion 41. Fix: rewrite directions/howToUse as standard BB blending.
- 🟡 2. "Film Gel Network" tech claim — no basis in docs. Fix: remove; general long-wear language only.
- ⚪ 3. "7 Herb Complex" lists 8 herbs (all 8 confirmed in formula). Fix: rename "8 Herb Complex" or split Glycyrrhiza out.

**Improve:** Niacinamide 2% = highest-concentration active — named callout. Artwork says "DERMATOLOGICALLY TESTED" — add. Korean concept "유리알 광채" (glass-bead radiance) is a nice descriptor.

## INTENSIVE BLEMISH BALM CREAM [SPF 30 PA++] (id 42)

**Docs:** `Ingredient lists_old/GENOSYS INTENSIVE BLEMISH BALM CREAM.pdf`

✅ Adenosine 0.040% · ✅ Allantoin 0.100% · ✅ Origanum Vulgare 0.005% · ✅ 50g

- 🔴 1. **"Phytolex SC" listed as key ingredient — ABSENT from formula** (39 ingredients; real botanicals = Eucalyptus Globulus Leaf Oil, Perilla Ocymoides Seed Oil, Phaseolus Radiatus, Betula Platyphylla, Rumex Crispus). Fix: remove Phytolex SC; name real botanicals.
- 🟡 2. **Arbutin 2% in formula — missing from live copy entirely** (top active!). Fix: add as key brightening active.
- 🟡 3. Octocrylene 5% (3rd UV filter after TiO2 7.7% + EHMC 7%) never mentioned; relevant for sensitive-skin positioning. Fix: identify filter system.

**Improve:** Iron oxides + mica = tinted coverage — "mineral pigments for natural coverage". Arbutin 2% supports post-procedure angle. Eucalyptus/Perilla botanical story.

---

# BATCH 1 — SERUMS + BIO-MESO (pending)
# BATCH 2 — CREAMS (pending)
# BATCH 4 — CLEANSERS/TONERS/PEELINGS (pending)
# BATCH 5 — MASKS (pending)
# BATCH 6 — HAIR/EYE/DEVICES/PRO (pending)
