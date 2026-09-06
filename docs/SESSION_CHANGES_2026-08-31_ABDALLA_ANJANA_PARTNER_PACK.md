# Abdalla / ANJANA SPA partner pack

**Date:** 31 August 2026  
**Customer:** ANJANA SPA - FZE  
**Contact:** Mr. Abdalla  
**Delivery location:** Anjana Spa at Rixos The Palm, Jumeirah, Dubai  
**Output:** `~/Desktop/ABdulla/`

## Request

Prepare customer-facing documents covering:

1. Professional treatment protocols
2. Retail consignment conditions
3. Professional starter sales order
4. Retail consignment starter sales order / stock proposal

## Commercial structure

- Professional treatment stock is a normal paid clinic sale.
- Retail homecare is proposed on consignment with no payment due at placement.
- No MoySklad SO, invoice, shipment, contract, or stock placement was created.
- Existing Collagen and Sea Algae masks purchased by ANJANA SPA are used in
  the protocols and were not duplicated in the professional order.

## Verified proposal

Prices were read from the live MoySklad clinic and retail price lists on
31 August 2026.

| Block | Amount |
|---|---:|
| Professional starter order, VAT included | AED 5,575 |
| Retail consignment clinic value | AED 8,978 |
| Retail recommended selling value | AED 17,956 |
| Retail opening payment | AED 0 |
| Retail shelf | 61 units / 25 lines |

The retail PDRN 30-sheet mask pack was removed during review because product 52
is classified as professional in `lib/partnerCatalog.ts` and therefore cannot
be placed under retail consignment.

## Conditions used

- Signed consignment agreement before stock placement
- Renewed Trade Licence No. 3249 required; copy on file expires 5 September 2026
- TRN certificate required if VAT registered
- Inspect delivery within 48 hours
- Monthly sales and stock report during days 1–5
- Sold units invoiced after report and payable within 14 days
- Title remains with GENOSYS until reported sold and paid
- Professional products excluded from consignment

## Files

- `00_READ_FIRST.txt`
- `01_GENOSYS_Anjana_Professional_Protocols.pdf` — 6 pages
- `02_GENOSYS_Anjana_Consignment_Conditions.pdf` — 2 pages
- `03_GENOSYS_Anjana_Professional_Starter_SO.pdf` — 2 pages
- `04_GENOSYS_Anjana_Retail_Consignment_SO.pdf` — 3 pages
- `05_Protocol_Signature_Cleansing_HydroCool.pdf` — 2 pages
- `06_Protocol_Problem_Skin_PCS.pdf` — 2 pages
- `07_Protocol_Brightening_SWS.pdf` — 2 pages
- `08_Protocol_Hydration_HES.pdf` — 2 pages
- `09_Protocol_AntiWrinkle_AWS_CTS.pdf` — 2 pages
- `10_Protocol_Vitality_CVS.pdf` — 2 pages

Generator:

`scripts/abdalla-anjana-partner-pack-20260831.js`

## Review passes

1. Initial generation exposed a footer overlap on conditions page 2.
2. Layout correction reduced the stamp footprint and cleared all footer/title
   collision checks. Content review removed the professional PDRN mask pack
   from retail consignment.
3. Final generation corrected the retail unit/line wording and passed all
   automated page checks: no header collisions and no footer overlaps.

Key covers and total pages were rendered to PNG and visually inspected. Preview
files were removed after verification. Nothing was printed.

## Additional protocols

Added after the initial pack at the user's request. These are separate chair
cards so Abdalla can share only the relevant treatment with staff:

1. Signature Oxygen Cleanse + Hydro Cool
2. Oil & Blemish Control with PCS
3. Pigmentation & Even Tone with SWS
4. Deep Hydration with HES, including the trained roller option
5. Lines or Texture with AWS / CTS as alternatives, never mixed
6. Vitality facial with CVS

Each is two pages: exact chair sequence on page 1, then setup, homecare bridge,
safety, aftercare, and stock-control notes on page 2. Automated layout checks
passed for all 12 added pages; representative covers and a chair-card back were
visually inspected. Temporary previews were removed.
