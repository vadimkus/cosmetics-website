# Three retail orders marked delivered (2026-08-08)

Validated each order as fully paid and fully shipped in MoySklad before updating.

| Customer | Order | Total | MoySklad | Website | Rewards |
|----------|-------|------:|----------|---------|--------:|
| Nur U | GENCardM2608086652 | 635 AED | Delivered | DELIVERED / paid | 590 |
| Alesya Sokolenko | GENCardM2608083639 | 515 AED | Delivered | DELIVERED / paid | 587 |
| Meryem Malak Lezzar | CODW2608085950 | 650 AED | Delivered | DELIVERED / paid | 580 |

Website `deliveredAt` was stamped and GENOSYS Rewards were awarded through the
idempotent loyalty function. Meryem's website payment status was also corrected
from pending to paid to match MoySklad.

Script: `scripts/moysklad-mark-three-orders-delivered-20260808.ts`
