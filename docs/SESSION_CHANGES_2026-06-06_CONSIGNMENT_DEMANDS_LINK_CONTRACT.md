# Fix — link commission agreement on 7 consignment отгрузки

**Date:** 2026-06-06  
**Script:** `scripts/moysklad-fix-consignment-demands-link-contract-20260606.js --commit`

## Context

After payment re-classification (`docs/MOYSKLAD_DEMANDS_MISSING_AGREEMENT_BY_PAYMENT.tsv`), only **7** demands were true consignment replenishment (no payment, no invoice) with missing agreement.

## Applied

| Отгрузка | Date | AED | Counterparty | Contract linked |
|----------|------|-----|--------------|-----------------|
| 04553 | 2025-05-01 | 2,828 | First Person Palm Jumeirah | **00078** |
| 04858 | 2025-08-11 | 1,805 | Serene Skin | **00060** |
| 06152 | 2026-05-14 | 1,140 | ARFI Nails | **25** |
| 03247 | 2024-04-13 | 770 | X Consulting | **00036** |
| 05320 | 2025-12-02 | 600 | First Person Marina | **00024** |
| 03159 | 2024-03-15 | 426 | Tatiana Aniskina | **00025** |
| 06287 | 2026-06-03 | 285 | Eclatant&Co | **18** |

**Total:** 7,854 AED now on consignment books.

## Notes

- No commission report repost needed (unlike Ulbossyn 06044 + 01372 same-day ordering).
- Marker appended to description: `CONSIGNMENT-LINK-CONTRACT-2026-06-06`.
- Re-run audit with payment filter if needed — consignment_like list should now be **0**.

## Re-run

```bash
node --import dotenv/config scripts/moysklad-fix-consignment-demands-link-contract-20260606.js
```

Already committed — script will SKIP documents that already have contract.
