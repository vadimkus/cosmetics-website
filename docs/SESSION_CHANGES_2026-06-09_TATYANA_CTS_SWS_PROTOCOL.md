# Tatyana CTS/SWS Microneedling Protocol

**Date:** 2026-06-09

## Context

Tatyana, the doctor preparing GENOSYS Instagram posts, asked for a professional-use protocol for the mesotherapy / microneedling ampoules sent to her, specifically **POWER SOLUTION CTS** and **POWER SOLUTION SWS**. She noted that she had found only the SRS peel and SWS depigmentation protocol on the site and had expected an overview of Problem Control Cream / Serum.

## Output

Created Russian protocol without prices:

- `/Users/vadimkus/Desktop/GENOSYS_CTS_SWS_microneedling_protocol_RU.md`

Final cleanup requested by Vadim:

- Doctor's name corrected to Olga.
- Doctor-facing protocol rewritten as a direct GENOSYS protocol, not a third-person/internal note.
- Local source / PDF / COA paths removed from the doctor-facing file.
- Internal source details remain only in this session note and Cursor rule.
- Full INCI compositions for POWER SOLUTION SWS and POWER SOLUTION CTS added to the doctor-facing protocol, without exposing percentages or local source paths.

## Local Sources Used

- `public/documents/PPT/GENOSYS_Microneedling_Protocols.pdf` PDF protocol for Power Solution microneedling.
- `Desktop/Drive/Genosys/Registration/Intertek/Ingredient lists_old/GENOSYS POWER SOLUTION SWS.pdf` formula PDF.
- `Desktop/Drive/Genosys/Registration/Intertek/Ingredient lists_old/GENOSYS POWER SOLUTION CTS.pdf` formula PDF.
- `Desktop/Drive/Genosys/Registration/Intertek/Intertek_folder/Certififcate of Analysis/28 SKIN RENEWAL PEELING SYSTEM (SRS) - COA-GENOSYS (L0907U).pdf` SRS COA.
- `Desktop/Drive/Genosys/Registration/Intertek/Registration DOC/COA/COA-GENOSYS SKIN RENEWAL PEELING SYSTEM(L1037B).pdf` newer SRS COA.
- `lib/products.ts` product cards for POWER SOLUTION SWS, POWER SOLUTION CTS, SRS, Snow O2 Cleanser, and Snow Booster.
- `docs/protocols/CLINIC_971_MICRONEEDLING_PROTOCOLS.md` professional microneedling protocols.
- `docs/protocols/UNDERARM_BRIGHTENING.md` SWS + CO2 brightening logic and recovery notes.
- `docs/protocols/PIGMENTATION_BRIGHTENING_HOME_CARE_EN.md` pigmentation home-care context.
- Desktop Intertek formula/artwork PDFs for SRS, Problem Control Serum, Problem Control Cream, All For Sensitive Serum, Multi Functional Anti-Wrinkle Serum, Moisture Replenishing Hyaluron Serum, Multi Vita Radiance Serum, and EyeCell Kit.

## Clinical Framing Used

- SWS positioned as the primary anti-pigment ampoule for melasma, PIH, sun spots, and uneven tone.
- CTS positioned as the remodeling / collagen / firmness ampoule.
- Recommended course favors alternating SWS and CTS by session.
- If both ampoules are used in one visit, the protocol recommends zone-based use and conservative depths to avoid worsening PIH.
- SRS is included only as an optional later module, not for a first GENOSYS professional-line session.

## PDF Cross-Check Corrections

- Removed the in-message Problem Control reply from the standalone protocol; the final file is only for SWS / CTS.
- Removed SRS + CTS as a standard combination because the local microneedling PDF lists SRS combinations with AWS / SWS / PCS / CVS, not CTS.
- Clarified that SRS packaging artwork gives 15–20 minutes as standalone peel exposure, while the internal SRS + microneedling protocol uses shorter exposure for combined treatment.
- Corrected Problem Control-related assumptions from older home-care text: artwork PDF for Problem Control Serum lists Zinc PCA, Salix Nigra (Willow) Bark Extract, Panthenol, Beta-Glucan, Allantoin, etc.; it does not list Salicylic Acid / Tea Tree / Centella for the serum.
- Checked `Intertek_folder/Certififcate of Analysis/` after user flagged it. The folder name is misspelled exactly as `Certififcate of Analysis`. SRS COA for lot L0907U and newer `Registration DOC/COA` lot L1037B both show pH 3.02; specification is 4.00 ± 1.00 at 25°C.
- Rechecked SWS / CTS against `Ingredient lists_old` formula PDFs and updated the final protocol ingredient bullets:
  - SWS: Arbutin 2%, Kojic Acid, Sodium Hyaluronate, Allantoin, Adenosine, Lactic Acid, Licorice extract, Licorice ferment filtrate, sh-Polypeptide-7, Palmitoyl Tripeptide-1, grape/rose callus extracts.
  - CTS: Lactobacillus/Soymilk Ferment Filtrate, Beta-Glucan, Collagen, Sodium Hyaluronate, Copper Tripeptide-1, Palmitoyl Oligopeptide, Palmitoyl Hexapeptide-12, Palmitoyl Tripeptide-1, sh-Polypeptide-7, grape/rose callus extracts.
- Unified product spelling to SNOW O₂ and EZ CO₂ in the final protocol.
- Updated the Desktop protocol's SRS section to include pH 3.02 and both COA source paths.
- Cleaned the final Desktop protocol for external sharing: removed all local source paths and source labels, changed the direct greeting to Olga, and kept pH as a protocol fact without exposing COA/source filenames.
- Added full INCI composition lines for SWS and CTS into the final protocol, based on the local Intertek formula PDFs.

## Persistent Rule Added

Created Cursor rule:

- `.cursor/rules/genosys-intertek-source-of-truth.mdc`

Purpose: for all future GENOSYS composition, formula, INCI, protocol, registration, or doctor/clinic explanation tasks, search `/Users/vadimkus/Desktop/Drive/Genosys/Registration/Intertek` first. Priority is `Ingredient lists_old/`, then product-specific Intertek folders, then COA folders for pH / batch analysis, then formula/quali-quanti folders, then artwork/label PDFs. Website code and markdown docs are secondary if Intertek PDFs disagree.

Updated rule after the COA check: always include `Intertek_folder/Certififcate of Analysis/`, `Registration DOC/COA/`, and root `COA.zip` for pH, physical analysis, microbial results, and batch specifications.

## SRS Doctor Reply

Prepared a full Russian reply for Tatyana about SRS:

- pH is **3.02** by SRS COA (`L0907U` and `L1037B` checked); COA specification is **4.00 ± 1.00 at 25°C**.
- Formula is aqueous/glycerin based, not alcohol based: INCI starts with Aqua, Glycerin, Glycolic Acid, Lactic Acid, Sodium Hydroxide, Mandelic Acid, Phytic Acid.
- Artwork/packaging says exposure 15-20 minutes, then rinse with cold water.
- Separate neutralizer is not listed in the artwork; however, for first use, sensitive skin, PIH-prone patients, and any combined treatment with microneedling, recommend controlled shorter exposure and active removal/rinsing rather than relying on self-neutralization.
- Suggested safe first-use range: patch test, 3-5 minutes first session, up to 7 minutes only with good tolerance; no first-session SRS + microneedling on sensitive skin.

