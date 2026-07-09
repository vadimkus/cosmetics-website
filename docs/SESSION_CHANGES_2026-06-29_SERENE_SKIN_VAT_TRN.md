# Serene Skin Beauty — VAT TRN on MoySklad counterparty

**Date:** 2026-06-29 (UAE)  
**Script:** `scripts/moysklad-update-serene-skin-trn-20260629.js --commit`

## Source

FTA **Certificate of Registration for Value Added Tax** — effective **01/07/2026**, quarterly returns.

| Field | Value |
|-------|-------|
| Legal name | SERENE SKIN BEAUTY SALON LLC |
| **TRN** | **105207755700003** |
| Registered address | Shop-1, The Derby Residence 3, Nad Al Shiba First, Dubai |
| Contact | +971564715477 |

## MoySklad counterparty

| Field | Value |
|-------|-------|
| Name | Serene Skin Beauty Salon LLC |
| ID | `993395aa-8da2-11ec-0a80-006b0038cd99` |
| Agreement | **00060** (consignment) |
| [Open in MoySklad](https://online.moysklad.ru/app/#company/edit?id=993395aa-8da2-11ec-0a80-006b0038cd99) |

## Field layout (Face Room pattern)

| Field | Value | Purpose |
|-------|-------|---------|
| `email` | `1566518` | Trade license number |
| `fax` | `1566518` | License # on consignment stock note template |
| `legalAddressFull.comment` | `105207755700003` | VAT TRN on invoices |

Reference: **FACE ROOM BEAUTY SALON CO** (`12b051b0-4e21-11ee-0a80-063e000814cc`).

## Change

- **Before:** `legalAddressFull.comment` = `105207755700001` (old/incorrect)
- **After:** `105207755700003` (from VAT certificate)

License fields were already correct — only TRN updated.

## Also fixed

`scripts/moysklad-create-demand-serene-01330.js` — `CUSTOMER.trn` corrected to `105207755700003`.
