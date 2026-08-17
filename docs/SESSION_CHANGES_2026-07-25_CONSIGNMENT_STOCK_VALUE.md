# Consignment stock vs shipments unpaid — 2026-07-25

Screenshot “Отгрузки” unpaid **2,333,013.35 AED** is **all shipment AR**, not pure consignment.

| Bucket | AED |
|---|---:|
| All demands unpaid (matches UI) | 2,333,013 |
| Of which **commission-contract** (consignment still out) | **2,119,080** |
| Of which regular (non-commission) unpaid | 213,934 |

Method: sum `(sum − payedSum)` on applicable demands linked to `contractType=Commission` (67 contracts). Values are **clinic/list sale prices** on placement docs, not buy cost / warehouse stock.
