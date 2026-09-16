# Customer-facing INCI evidence audit — 2026-09-16

## Rule

The customer-facing Full INCI is copied in printed order from:

1. a photographed current carton, bottle, jar, or pouch; or
2. approved outer-carton artwork when a readable current physical pack is unavailable.

Formula, quali-quanti, safety-assessment, COA, and registration ingredient sheets may
support concentration or safety work, but they no longer determine the published INCI
order. A list is hidden when current packaging evidence is absent or conflicting.

Reconciliation script:

```bash
npx tsx --env-file=.env.local scripts/sync-carton-inci-audit-20260916.ts
```

## Result

- 50 cosmetic products audited.
- 3 physical-package mismatches corrected: 14, 36, 51.
- 19 approved-artwork mismatches corrected: 10, 11, 12, 15, 16, 17, 18,
  19, 22, 23, 24, 31, 32, 33, 37, 41, 45, 47, 52.
- 23 existing lists already matched approved artwork and were retained.
- 4 uncertain lists were removed instead of guessed: 27, 28, 44, 46.
- Product 66 uses the approved 600 ml artwork after owner confirmation that
  the 200 ml and 600 ml bottles contain the same product and formula.
- Current customer-facing state: 46 evidence-matched lists visible, 4 withheld.

## Source matrix

Paths below are relative to
`/Users/vadimkus/Desktop/Drive/Genosys/Registration/Intertek/`.

| Product | Evidence used | Final state |
|---|---|---|
| 4 POWER SOLUTION HES | `Registration DOC/Artwork/[GENOSYS]POWER SOLUTION HES.pdf` | Artwork match |
| 5 POWER SOLUTION CVS | `Registration DOC/Artwork/[GENOSYS]POWER SOLUTION CVS.pdf` | Artwork match |
| 6 POWER SOLUTION CTS | `Registration DOC/Artwork/[GENOSYS]POWER SOLUTION CTS.pdf` | Artwork match |
| 7 POWER SOLUTION PCS | `Registration DOC/Artwork/[GENOSYS]POWER SOLUTION PCS.pdf` | Artwork match |
| 8 POWER SOLUTION SWS | `Registration DOC/Artwork/[GENOSYS]POWER SOLUTION SWS.pdf` | Artwork match |
| 9 POWER SOLUTION AWS | `Registration DOC/Artwork/[GENOSYS]POWER SOLUTION AWS.pdf` | Artwork match |
| 10 SNOW O₂ CLEANSER | `Registration DOC/Artwork/[GENOSYS]SNOW O2(180ml).pdf` | Corrected to artwork |
| 11 SKIN DEFENDER REMOVER | `GENOSYS SKIN DEFENDER.../Artwork-GENOSYS SKIN DEFENDER....pdf` | Corrected to artwork |
| 12 EPI PEELING GEL | `Registration DOC/Artwork/[GENOSYS]EPI TURNOVER BOOSTING PEELING GEL.pdf` | Corrected to artwork |
| 13 SRS | `Registration DOC/Artwork/[GENOSYS]SKIN RENEWAL PEELIGN SYSTEM(SRS).pdf` | Artwork match |
| 14 MICROBIOME MIST | `Genosys Microbiome.../Pics/image3.jpeg` | Corrected to physical carton |
| 15 PROBLEM CONTROL TONER | `Genosys Intensive.../Artwork-GENOSYS...TONER(200ml).pdf` | Corrected to artwork |
| 16 SNOW BOOSTER | `Registration DOC/Artwork/[GENOSYS]SNOW BOOSTER(200ml).pdf` | Corrected to artwork |
| 17 EYE CONTOUR SERUM | `Registration DOC/Artwork/[GENOSYS]EYECELL EYE SERUM.pdf` | Corrected to artwork |
| 18 HYALURON SERUM | `...HYALURON SERUM/Artwork_updated22062024.pdf` | Corrected to artwork |
| 19 ALL FOR SENSITIVE SERUM | `Registration DOC/Artwork/[GENOSYS]ALL FOR SENSITIVE SERUM.pdf` | Corrected to artwork |
| 20 PROBLEM CONTROL SERUM | `Registration DOC/Artwork/[GENOSYS]PROBLEM CONTROL SERUM.pdf` | Artwork match |
| 21 MULTI VITA RADIANCE SERUM | product-folder approved artwork | Artwork match |
| 22 ANTI-WRINKLE SERUM | `Registration DOC/Artwork/artwork-[GENOSYS]MULTI FUNCTIONAL ANTI-WIRINKLE SERUM.pdf` | Corrected to artwork |
| 23 ND CELL CREAM | `Registration DOC/Artwork/[GENOSYS]NDCELL ANTI-WRINKLE CREAM.pdf` | Corrected to artwork |
| 24 EYE CONTOUR CREAM | `Registration DOC/Artwork/[GENOSYS]EYECELL EYE CREAM.pdf` | Corrected to artwork |
| 25 SOOTHING REPAIR POSTCREAM | `Registration DOC/Artwork/[GENOSYS]SOOTHING REPAIR POSTCREAM(20g).pdf` | Artwork match |
| 27 SKIN BARRIER CREAM | two approved artworks disagree; no current pack photo | Full INCI withheld |
| 28 HYDRO SOOTHING CREAM | no current physical pack or approved artwork | Full INCI withheld |
| 29 HYALURON CREAM | `...HYALURON CREAM/Artwork_updated_22062024.pdf` | Artwork match |
| 30 PROBLEM CONTROL CREAM | `Registration DOC/Artwork/[GENOSYS]PROBLEM CONTROL CREAM.pdf` | Artwork match |
| 31 MULTI VITA RADIANCE CREAM | `Registration DOC/Artwork/[GENOSYS]MULTI VITA RADIANCE CREAM(50g).pdf` | Corrected to artwork |
| 32 ANTI-WRINKLE CREAM | `Registration DOC/Artwork/Artwork-GENOSYS MULTI FUNCTIONAL ANTI WRINCLE CREAM(50g).pdf` | Corrected to artwork |
| 33 EYE PEPTIDE GEL PATCH | `Registration DOC/Artwork/[GENOSYS]EYECELL EYE PEPTIDE GEL PATCH.pdf` | Corrected to artwork |
| 34 OVERNIGHT CREAM MASK | approved outer-carton artwork | Artwork match |
| 35 HYDRO COOL MODELING MASK | `Registration DOC/Artwork/[GENOSYS]HYDRO COOL MODELING MASK.pdf` | Artwork match |
| 36 SEA ALGAE MASK | `Soothing Bomb Sea Mask/Back.jpg` | Corrected to physical pouch |
| 37 PEPTIDE GEL MASK | `Registration DOC/Artwork/[GENOSYS]PEPTIDE GEL MASK.pdf` | Corrected to artwork |
| 38 EZ CO₂ MASK KIT | approved gel and mask artwork | Artwork match, two lists |
| 39 ULTRA SHIELD SUN CREAM | product-folder approved artwork | Artwork match |
| 40 MULTI SUN CREAM | `Registration DOC/Artwork/[GENOSYS]MULTI SUN CREAM.pdf` | Artwork match |
| 41 BB CUSHION | Camel carton artwork; shade formulas checked separately | Corrected to artwork |
| 42 BLEMISH BALM CREAM | `Registration DOC/Artwork/[GENOSYS]INTENSIVE BLEMISH BALM CREAM.pdf` | Artwork match |
| 43 HAIR TONIC | `Registration DOC/Artwork/[GENOSYS]HR3 MATRIX HAIR TONIC α.pdf` | Artwork match |
| 44 MEDI SCALP SHAMPOO | no readable current pack or approved artwork list | Full INCI withheld |
| 45 HAIR SOLUTION | `Registration DOC/Artwork/[GENOSYS]HR3 MATRIX HAIR SOLUTION α_Professional.pdf` | Corrected to artwork |
| 46 SCALP PEELING | approved artwork text unreadable; no physical back panel | Full INCI withheld |
| 47 MESOPECIA KIT | `Registration DOC/Artwork/[GENOSYS]HAIR MATRIX MESOPECIA KIT.pdf` | Corrected, two lists |
| 51 BIO-FERMENT POWDER MASK | `BIOFERMENT_MASK/Back.jpeg` | Corrected to current physical jar |
| 52 SKIN REBOOT PDRN MASK | `SKIN REBOOT.../Artwork-GENOSYS SKIN REBOOT PDRN MASK PACK.pdf` | Corrected to artwork |
| 53 COLLAGEN MASK | approved outer-carton artwork | Artwork match |
| 60 BIO-MESO PDRN 60000 | product-folder approved carton artwork | Artwork match |
| 63 REVITA GLOW BB CREAM | Bright and Natural approved artworks | Artwork match; shade claim corrected |
| 65 BIO-MESO PDRN 5000 | approved outer-carton artwork | Artwork match |
| 66 CERABARRIER CLEANSER | `Cerrabar/600ml/Artwork-GENOSYS CERABARRIER BIOME GEL CLEANSER_600ml.pdf`; owner confirmed 200 ml is the same formula | Artwork match; published for both sizes |

## Important corrections

- Product 14 now includes the three printed ppm declarations and the current carton
  order, including Trametes Versicolor Extract.
- Product 36 now includes printed `1,2-Hexanediol` and follows the physical pouch order.
- Product 51 now follows the photographed current jar: Hydrolyzed Corn Starch and
  `sh-Polypeptide-11`; Hydrolyzed Collagen, Allantoin, and `sh-Polypeptide-3` were
  removed from customer-facing claims.
- Product 63 no longer says both shades have an identical formula. The verified shade
  artworks differ in pigment, mica, titanium dioxide, and aluminum hydroxide levels.
- Product 66 now publishes the 600 ml artwork INCI for both bottle sizes after owner
  confirmation that only the bottle volume differs.

## Evidence still required

Obtain readable current back panels for products 27, 28, 44, and 46. Their Full
INCI sections remain hidden until then.
