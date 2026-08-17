# SRS peeling orders this year (MoySklad check)

**Date:** 2026-07-16  
**Context:** User believes warehouse SRS vials expire Nov 2026; asked when SRS was ordered in 2026.

## MoySklad product

| Code | Name |
|------|------|
| `00015` | SRS 1 Vial 2ml |
| `00014` | SRS Box (empty / kit packaging) |

## 2026 purchase / receipt

| Date | Doc | Type | Qty | Unit buy | Supplier |
|------|-----|------|-----|----------|----------|
| **2026-01-06** | PO **157** | Purchase order | **500** × `00015` | 13.40 AED | DTSMG Genosys |
| **2026-01-06** | Supply **00174** | Приёмка | **500** × `00015` | 13.40 AED | (same receipt) |

No other 2026 purchase order or supply contains `00015` or `00014`. Later Korea POs (DM GME / reorder drafts) do not include SRS; orderform notes from Jul 2026 explicitly removed SRS from the Korea sheet.

## Current stock (2026-07-16)

- `00015`: **422** on hand (reserve 0, in transit 0)

## 2025 supplies (context only)

| Date | Supply | Qty |
|------|--------|-----|
| 2025-04-21 | 00143 | 20 |
| 2025-05-19 | 00149 | 40 |
| 2025-08-07 | 00154 | 100 |
| 2025-09-03 | 00156 | 200 |
| 2025-10-11 | 00160 | 30 |
| 2025-11-13 | 00166 | 100 |
| 2025-12-05 | 00171 | 50 |

## Expiry

Nov 2026 expiry was **not** verified in MoySklad (series endpoint unavailable for this org). Some older SRS stock was already written off as expired in Jun 2026 (`00008-00451`, `00008-00445`). Physical lot labels / COA needed to confirm Nov 2026 for the Jan receipt.
