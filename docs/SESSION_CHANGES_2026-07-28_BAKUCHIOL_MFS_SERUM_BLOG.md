# Blog Post — Bakuchiol MULTI FUNCTIONAL ANTI-WRINKLE SERUM (Product 22) — 2026-07-28

## What
New long-form blog post about the MULTI FUNCTIONAL ANTI-WRINKLE SERUM (MFS PROFESSIONAL), built around the bakuchiol story: the Ayurvedic babchi seed that matched retinol in a double-blind dermatology trial.

- **Slug:** `bakuchiol-multi-functional-anti-wrinkle-serum`
- **Script:** `scripts/create-bakuchiol-mfs-serum-blog.ts`
- **Run:** `npx tsx --env-file=.env.local scripts/create-bakuchiol-mfs-serum-blog.ts` (created post id `cms50upn708rlgfnm5om3vhv1`)
- **Languages:** EN / RU / AR (full native translations in DB)
- **Featured image:** `/images/multif_serum/main.jpeg`
- **Inline images:** `s1`–`s5` from the same product gallery (uploaded 2026-07-28)

## URLs
- EN: https://genosys.ae/blog/bakuchiol-multi-functional-anti-wrinkle-serum
- RU: https://genosys.ae/ru/blog/bakuchiol-multi-functional-anti-wrinkle-serum
- AR: https://genosys.ae/ar/blog/bakuchiol-multi-functional-anti-wrinkle-serum

## Story arc
1. Hook — retinol's golden rule ("works — if your skin can survive it") vs the babchi seed
2. The seed — *Psoralea corylifolia*, Ayurveda/TCM, retinol-like gene-expression pattern (not a retinoid)
3. Landmark study — Dhaliwal et al., **British Journal of Dermatology 2019;180:289** (DOI 10.1111/bjd.16918): 44 patients, 12 weeks, 0.5% bakuchiol BID vs 0.5% retinol QD → comparable wrinkle + pigmentation improvement, significantly less scaling/stinging
4. Photostability — retinol degrades in UV, bakuchiol doesn't → AM & PM use; Draelos 2020 sensitive-skin study (60 women, eczema/rosacea-prone, significant improvement)
5. MFS formula — 4 pillars (Firming / Antioxidant-Soothing / Barrier / Brightening)
6. Exact complex — Bakuchiol 0.1%, Peptide 6 (all six named), Lipid Barrier Liposome (Ceramide NP/cholesterol/phytosphingosine), ECM, propolis/adenosine/niacinamide 2%
7. Product clinical — P&K Skin Research Center, Feb 22–May 13 2024, n=24 women (30–59), skin age index, wrinkles + tone balance
8. Comparison table — bakuchiol vs classic retinol
9. Ritual — 2–3 drops AM & PM, SPF by day, seal with cream 32
10. CTA — 330 AED, links to `/products/22` (and `/products/32` in ritual)

## Claim discipline (per SESSION_CHANGES_2026-07-28_ANTI_WRINKLE_SERUM_6_SLIDES.md)
- BJD/Draelos studies clearly labeled **ingredient-level** research (0.5%/1% bakuchiol), not product claims
- P&K product study cited **without invented %** (no published figure in brand deck)
- **No** pregnancy-safe claim
- AM & PM positioning (photostable) — consistent with 2026-07-28 copy fixes
- Formula % from Intertek formula PDF (bakuchiol 0.1%, niacinamide 2%)

## Files touched
- `scripts/create-bakuchiol-mfs-serum-blog.ts` (new)
- DB `BlogPost` row created via script (idempotent by slug)
