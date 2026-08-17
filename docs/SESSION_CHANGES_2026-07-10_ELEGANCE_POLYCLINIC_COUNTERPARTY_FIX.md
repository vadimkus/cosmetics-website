# Elegance Polyclinic — counterparty fix (website mis-route)

**Date:** 2026-07-10  
**Script:** `scripts/moysklad-fix-elegance-polyclinic-counterparty-04798-20260710.js --commit`

## Problem

Website push created full paid chain under **Modern Medicine Medical Center** instead of **ELEGANCE POLY CLINIC L.L.C.**

## Fix

Reassigned `agent` on all linked documents:

| Document | Number | ID |
|----------|--------|-----|
| Customer order | GENCardM2607107457 | `64efe9fb-7c6d-11f1-0a80-0ee100214d2e` |
| Invoice | 04798 | `6531d937-7c6d-11f1-0a80-14c7002172ab` |
| Shipment | 06517 | `65d2f667-7c6d-11f1-0a80-0ee100214d77` |
| Paymentin | 05914 | `6645d5cf-7c6d-11f1-0a80-115700216a6c` |

**From:** Modern Medicine Medical Center (`828e65df-4b4a-11ef-0a80-159e002bdea0`)  
**To:** ELEGANCE POLY CLINIC L.L.C. (`0aa74b9b-7788-11f0-0a80-19f100131e18`, license 1165795)

**Total:** 1,151.00 AED (10 lines incl. CERABARRIER 54484)

## PDF + print

- Template: **Genosys_Invoice_Legal_TAX**
- Saved: `~/Desktop/orders/GENOSYS_Elegance_Polyclinic_04798.pdf`
- Sent to default printer (EPSON L3260) in **landscape** via `lp -o orientation-requested=4`

## Prior Elegance order

See `docs/SESSION_CHANGES_2026-06-08_ELEGANCE_POLYCLINIC_ORDER.md` (invoice 04637).
