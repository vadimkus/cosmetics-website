# Russian and Arabic product localization audit

**Started:** 21 Aug 2026
**Scope:** one product at a time, Russian and Arabic together

The audit rewrites every customer-facing localized field in natural premium language while
checking the underlying claims against the local registration archive and official DTS MG
material. A translation is not preserved merely because it is present in English.

## Product 1 — Microneedle Roller

### Sources checked

- `Intertek/Rollers/CE Certificate.pdf`
- `Intertek/Rollers/Certificate of Free Sales.pdf`
- `Intertek/Rollers/DTSMG-ISO13485.pdf`
- `public/documents/PPT/Overview of Microneedling_S.pdf`

### Corrections

- Removed the unsupported FDA-approved statement and replaced it with the documented CE
  certification and ISO 13485 quality-system certification.
- Removed the invented 300% absorption figure. The page now describes improved delivery
  without assigning an unsupported percentage.
- Corrected the blanket `450 needles` statement. The DTS MG guide lists 540 needles for
  0.25 mm and 450 for 0.50 mm.
- Replaced the vague `25% thinner` comparison with the documented 0.20 mm needle thickness.
- Corrected a safety-critical reuse error. GENOSYS Roller is single-use; the old RU/AR
  instructions told customers to disinfect and reuse it.
- Replaced the single 4–6 week interval with the documented depth-specific schedule:
  0.25 mm weekly and 0.50 mm every two weeks.
- Added documented gamma sterilisation, sealed blister, SUS 304(H), glue-free disk
  construction, aftercare and contraindications.

### Language

Russian now reads as professional cosmetology guidance rather than a translated device
catalogue. Arabic uses polished Modern Standard Arabic suitable for Gulf beauty retail,
with clear clinical phrasing and no mixed English words.

### Implementation

- Canonical audited copy: `data/productLocalizedCopyAudit.ts`
- RU/AR translation maps override the old generated product 1 blocks
- Database `nameRu`, `nameAr`, `descriptionRu`, `descriptionAr` updated
- Database `productNumber` repaired from null to `1`
- Regression tests verify structured JSON, runtime map ownership and banned claims
