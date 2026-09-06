# SRS detailed professional protocol

**Date:** 31 August 2026  
**Product:** GENOSYS Skin Renewal Peeling System (SRS), product 13  
**Output:** `~/Desktop/GENOSYS_SRS_Detailed_Professional_Protocol.pdf`  
**Generator:** `scripts/srs-detailed-professional-protocol-20260831.js`

## Deliverable

Five-page customer-facing GENOSYS professional protocol:

1. SRS place inside the GENOSYS line, benefits, exact acid concentrations, pH
2. Client selection, contraindications, consultation and room setup
3. Detailed one-vial chair sequence
4. GENOSYS products before and after SRS, mask choices and first 72 hours
5. Course framework, quick-reference do/don't table, specification and INCI

## Source basis

- Intertek artwork:
  `Registration DOC/Artwork/[GENOSYS]SKIN RENEWAL PEELIGN SYSTEM(SRS).pdf`
- Quantitative formula and COA facts already reconciled in
  `components/product/srs/srsCopy.ts`
- Product page: `https://genosys.ae/products/13`

Verified facts used:

- Function: soft peeling
- Benefits: smoother, brighter, more even-looking tone; removal of dead surface
  cells; encouragement of surface turnover
- Glycolic acid 15%
- Lactic acid 13.5%
- Mandelic acid 2%
- Glycerin 25%
- pH 3.02 within 3.00–5.00 specification
- 2 ml × 10 vials
- Apply evenly, avoid eyes/lips, leave 15–20 minutes, rinse with cold water
- Patch test and sunscreen after treatment
- Not for broken, scratched, open or irritated skin

## Guardrails

- No neutraliser step
- No microneedling or roller use
- No clinical result percentages
- No blanket all-skin claim
- No unsupported pregnancy prohibition; clinic policy / medical clearance applies
- SRS clearly separated from homecare EPI Peeling Gel

## Verification

- Five A4 pages
- Automated title/header and content/footer collision checks passed on every page
- Pages 1, 3, 4 and 5 rendered to PNG and visually inspected
- Temporary previews removed
- Nothing printed
