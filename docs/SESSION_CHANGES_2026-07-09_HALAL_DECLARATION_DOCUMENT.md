# Session Changes — 2026-07-09 — Halal Compliance Declaration (EN + AR)

## Request

Customer asked for a halal certificate. Ingested
`~/Desktop/Drive/Genosys/Registration/Dubai_Municipality/` (Montaji
registration PDF, Letter.docx, Product_List.xlsx), researched real halal
certificate formats, produced a corporate bilingual document preserving the
original PDF header.

## Deliverable

**`~/Desktop/Drive/Genosys/Registration/Halal/Genosys_Halal_Declaration_EN_AR.pdf`**
(5 pages, A4):

- Page 1 — English **HALAL COMPLIANCE DECLARATION**
- Page 2 — Arabic **إقرار المطابقة لمتطلبات الحلال** (full RTL)
- Pages 3-5 — Annex A: all **71 Dubai Municipality (Montaji) registered
  products** with registration numbers, barcodes, expiry dates (bilingual
  table headers)

Design: the exact letterhead image extracted from the original Montaji
registration PDF stamped on every page; red-accent circular حلال / COMPLIANT
badge; meta table (document no. GME-HALAL-2026-001, issue 09-07-2026, valid
1 year); legal footer with TRN 104229886700003 + license 5023192 + bank-free
contact line; signature block (Vadim Sagatdinov, company seal space).

## Content decisions (important)

- **This is a supplier self-declaration, not an accredited certificate.**
  Official "Halal certificates" in UAE are issued only by ENAS-accredited
  certification bodies against UAE.S 2055-4:2021 / GSO 2055-4 / OIC-SMIIC-4.
  A distributor cannot self-issue one — but a supplier **Halal Compliance
  Declaration** is a standard, legitimate B2B instrument. Wording follows
  the four standard declarations: no porcine/najis ingredients, no non-halal
  animal derivatives, no khamr-origin alcohol, GMP contamination controls —
  all stated "on the basis of manufacturer documentation".
- Manufacturer names verified from the Korea Cosmetic Association
  Certificate of Free Sales (2025-04241): manufacturer **WINNOVA Co., Ltd**,
  marketer **DTS MG Co., Ltd** (Republic of Korea).
- If a customer requires an accredited halal certificate, the route is an
  ENAS-accredited body (e.g. International Halal Certification), ~6-10
  weeks, needs manufacturer ingredient dossiers.

## Update (same day)

Company e-stamp (`Stamp.png`, "DIGITALLY SIGNED" seal with QR + key) inserted
under the Company Seal area on both the EN and AR declaration pages. The
generator (`_generator_build_halal.py`, kept in the Halal folder) finds the
"Company Seal" label via text search and places the stamp automatically, so
regeneration keeps the stamp. Vadim signs the PDF manually on top.

## Tooling

WeasyPrint 66 (installed on Homebrew python3.12 + pango) renders the HTML;
PyMuPDF stamps the preserved header PNG onto every page. Build script kept
at `/tmp/halal_work/build_halal.py` during the session (regenerate anytime —
products parsed live from the Montaji registration PDF).
