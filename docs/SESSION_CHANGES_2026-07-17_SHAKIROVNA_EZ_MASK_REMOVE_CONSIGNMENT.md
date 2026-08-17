# Shakirovna Ladies — remove EZ mask from consignment (2026-07-17)

**Issue:** Clinic order GENCardM2607078417 / invoice **04779** / shipment **06491** (`00011` ×2 @ 230) was wrongly linked to commission agreement **00030**, so EZ CO₂ Mask appeared on Marina consignment stock.

## Fix

Cleared `contract` on all three documents:

| Doc | № | Contract after |
|-----|---|----------------|
| Sales order | GENCardM2607078417 | none |
| Invoice | 04779 | none |
| Shipment | 06491 | none |
| Paymentin | 05923 | none (cleared in audit follow-up) |

No commission report contained `00011` — no report cleanup needed.

## Result

`00011` no longer on agreement **00030** consignment balance.
