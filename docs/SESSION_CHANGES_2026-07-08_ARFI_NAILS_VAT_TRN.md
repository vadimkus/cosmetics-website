# ARFI Nails — VAT TRN on both locations (Face Room pattern)

**Date:** 2026-07-08  
**Source:** FTA VAT registration certificate — effective **01/05/2025**

| Field | Value |
|-------|-------|
| Legal name | ARFI NAILS BEAUTY SALON |
| **TRN** | **104933797300003** |
| License | **946792** |
| Address | Dawoud Abdulrahman Building, Al Barsha 1, Dubai |

## MoySklad updates (Face Room pattern)

| Field | Value | Purpose |
|-------|-------|---------|
| `email` | `946792` | Trade license |
| `fax` | `946792` | License # on consignment stock note |
| `legalAddressFull.comment` | `104933797300003` | VAT TRN on invoices |

Reference: **FACE ROOM BEAUTY SALON CO** — license in email/fax, TRN in comment.

## Counterparties

| Location | Name | ID |
|----------|------|-----|
| Barsha | ARFI NAILS BEAUTY SALON | `39a1aa83-a5a6-11f0-0a80-1cbc00050fea` |
| Jumeirah | ARFI NAILS BEAUTY SALON 2 | `dc883e47-f051-11f0-0a80-0f7100059e21` |

**Before:** TRN `104063223200003` (both)  
**After:** TRN `104933797300003` (both)

License fields unchanged (already `946792`).

## Script

`scripts/moysklad-update-arfi-nails-trn-20260708.js --commit`
