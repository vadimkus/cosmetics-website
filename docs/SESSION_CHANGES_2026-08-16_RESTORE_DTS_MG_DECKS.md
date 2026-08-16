# Restore DTS MG decks on bespoke PDPs

Date: 2026-08-16

Nobody asked to remove the DTS MG product guides. The generic PDP rendered `getProductDocumentation` via `ProductContentDisplay`. Bespoke layouts replaced that page and dropped the download. The PDFs stayed on disk and in `data/productConfig.ts`.

## Product 11

https://genosys.ae/products/11

Deck is back: `GENOSYS SKIN DEFENDER LIP & EYE MAKEUP REMOVER.pdf`

## Other bespoke pages that had lost the download

Same shared `CeraBrochureLinks` now reads config and shows the guide when one exists:

- 4-9 Power Solutions (microneedling protocols)
- 12 EPI
- 14 Mist
- 15 Problem Control Toner
- 18 Hyaluron Serum
- 33 Eye Peptide Gel Patch
- 34 Skin Rescue Overnight (config entry was also missing; PDF was already in `documents/PPT/`)
- 38 EZ CO₂
- 50 Eye Zone Care Kit
- 51 Bio-Ferment
- 52 PDRN Mask
- 61 Scalp Brush

Already had their own brochure link (left as-is): 60, 63, 64, 65, 66.

Bespoke pages with no deck in config (link stays hidden): 10, 13, 16, 17, 19, 24, 35, 37, 53.

## Not this

Do not delete or unlink a DTS MG PPT because leftover copy must follow the registered formula. The download stays. Copy and the deck can disagree; the page still offers the deck.
