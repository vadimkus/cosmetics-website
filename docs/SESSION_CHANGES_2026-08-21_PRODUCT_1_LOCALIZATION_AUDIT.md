# Product 1 localization audit: GENOSYS Microneedle Roller

**Date:** 21 Aug 2026  
**Pages:** `/ru/products/1`, `/ar/products/1`

## Sources checked

- `Intertek/Rollers/CE Certificate.pdf`
- `Intertek/Rollers/Certificate of Free Sales.pdf`
- `Intertek/Rollers/DTSMG-ISO13485.pdf`
- `public/documents/PPT/Overview of Microneedling_S.pdf`

The training deck documents the DTS disk construction, SUS 304(H) steel, 0.2 mm needle
thickness, gamma sterilization, single-use instruction, needle counts by length, contraindications
and rolling guidance.

## Russian and Arabic rewrite

Both locale payloads were rewritten in natural professional language. The update covers the
localized product name, description, details, features, benefits, protocol and precautions
used by web, PWA and mobile API.

## Accuracy corrections

- Removed the unsupported FDA-approved claim. The records held locally support CE and ISO 13485.
- Removed the invented 300% absorption figure.
- Replaced the universal 450-needle statement with the documented counts: 540 at 0.25 mm and
  450 at 0.5 mm.
- Replaced the vague 25%-thinner claim with the documented 0.2 mm thickness and the source
  comparison of 0.25–0.3 mm.
- Removed broad treatment promises for scars, pigmentation, pores and wrinkles from the generic
  product copy because the offered lengths have different purposes.
- Corrected the dangerous reuse instruction. The manufacturer states that the GENOSYS roller is
  single-use; it must be discarded after the procedure, not cleaned for reuse.

## Files

- `data/product1LocalizedCopy.ts`
- `data/productTranslations.ts`
- `data/productTranslationsRu.ts`
- `data/productLocalizedCopyAudit.ts`
- `scripts/update-product-1-localized-copy-20260821.ts`
- `__tests__/data/product1LocalizedCopy.test.ts`
