# Bianco DSO Silicon — SO + invoice + shipment + print

**Date:** 2026-07-07  
**Customer:** Bianco Spa FZCO (Cedre Center) — DSO / Silicon Oasis  
**Contract:** 00073

## Request

Professional order:
- EZ CO₂ mask (00011) ×2
- Power Solution CTS (00069) ×10 vials
- Power Solution AWS (00018) ×10 vials

SO → invoice → shipment; print invoice on default printer.

## MoySklad documents

| Doc | Ref | Amount (AED) |
|-----|-----|--------------|
| Sales order | **GENCardM2607077373** | 1,040.00 |
| Invoice | **04780** | 1,040.00 |
| Shipment | **06492** | 1,040.00 |

**Lines (clinic prices, VAT incl.):**

| Code | Product | Qty | Unit | Line |
|------|---------|-----|------|------|
| 00011 | EZ CO₂ MASK Professional Box | 2 | 230.00 | 460.00 |
| 00069 | Power Solution CTS 1 Vial | 10 | 29.00 | 290.00 |
| 00018 | Power Solution AWS 1 Vial | 10 | 29.00 | 290.00 |

## IDs

- Agent: `4c134860-9a4e-11ee-0a80-09ea0005ef84`
- Contract: `34d5fa5e-9ce3-11ee-0a80-10c7001247d8`
- Order: `fd8a91b9-7a09-11f1-0a80-1d880023eade`
- Invoice: `fdd4cd92-7a09-11f1-0a80-1c6f0023b621`
- Shipment: `fe7eafd7-7a09-11f1-0a80-19930023f578`

## PDF & print

- Saved: `~/Desktop/orders/GENOSYS_Bianco_DSO_Silicon_04780.pdf`
- Printed via `lp -o orientation-requested=4` → EPSON_L3260_Series (landscape; first print was portrait — reprinted)

## Script

`scripts/moysklad-create-bianco-dso-silicon-order-invoice-demand-20260707.js`

No paymentin created (await transfer).
