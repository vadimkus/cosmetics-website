# Bianco Layan — SO + invoice + shipment + landscape print

**Date:** 2026-07-07  
**Customer:** BIANCO LAYAN BEAUTY SALON L.L.C  
**Ship to:** Layan Community, Wadi Al Safa 7, Dubai Land

## Request

Professional order (spreadsheet 7/5/2026):
- EyeCell Eye Peptide Gel Patch (box) ×1
- Bio-Ferment Age Defying Powder Mask 300g ×1
- EZ CO₂ mask box ×2
- Power Solution CTS ×10 vials
- Snow O₂ Cleanser 500ml ×1

SO → invoice → shipment; print invoice **landscape**.

## MoySklad documents

| Doc | Ref | Amount (AED) |
|-----|-----|--------------|
| Sales order | **GENCardM2607077589** | 1,320.00 |
| Invoice | **04782** | 1,320.00 |
| Shipment | **06494** | 1,320.00 |

**Lines (clinic prices, VAT incl.):**

| Code | Product | Qty | Unit | Line |
|------|---------|-----|------|------|
| 00053 | EyeCell Eye Peptide Gel Patch (box) | 1 | 190.00 | 190.00 |
| 54466 | Bio-Ferment Age Defying Powder Mask 300g | 1 | 125.00 | 125.00 |
| 00011 | EZ CO₂ MASK Professional Box | 2 | 230.00 | 460.00 |
| 00069 | Power Solution CTS 1 Vial | 10 | 29.00 | 290.00 |
| 00024 | Snow O₂ Cleanser 500ml | 1 | 255.00 | 255.00 |

No commission contract on this counterparty (same as prior Layan pro orders).

## IDs

- Agent: `303f576b-bc51-11ef-0a80-18d900088ff1`
- Order: `31b6d874-7a0b-11f1-0a80-1b310024b9cc`
- Invoice: `31f84609-7a0b-11f1-0a80-10370022f2c2`
- Shipment: `32d96c16-7a0b-11f1-0a80-0ed400241d8c`

## PDF & print

- Saved: `~/Desktop/orders/GENOSYS_Bianco_Layan_04782.pdf`
- Printed: `lp -o orientation-requested=4` → EPSON_L3260_Series

## Script

`scripts/moysklad-create-bianco-layan-order-invoice-demand-20260707.js`

Paymentin **06130** / **1,320 AED** posted 27 Aug 2026 (RAK `E2E00402608269556961`). SO → **Доставлен**. See `docs/SESSION_CHANGES_2026-08-27_BIANCO_LAYAN_04782_PAY.md`.
