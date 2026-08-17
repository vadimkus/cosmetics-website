# Address duplication fix — street + addInfo (31 Jul 2026)

## Cause

MoySklad builds the display address from `country + city + street + addInfo`.  
Several customers had the **same text in both `street` and `addInfo`**, so it printed twice.

## Fix script

`scripts/moysklad-fix-address-street-addinfo-duplicates-20260731.js --commit`

- Clears `addInfo` when it duplicates `street`
- Refreshes `actualAddress` / `legalAddress` composed strings
- Also scans customer orders (last 180 days) for the same pattern on `shipmentAddressFull`

## Fixed (2026-07-31)

| Counterparty | Was (duplicated) → now once |
|--------------|-----------------------------|
| NEW YOU STAR BEAUTY HEALTH CLINIC L.L.C | The Mall, Shop 21, Umm Suqeim Third… |
| Miss Valeriya | The Royal Atlantis Residence, app 1201 |
| Rise UP | Office 906, The Metropolis Tower, Business Bay |
| Miss Nina | Socio Tower 2, app 304, Dubai Hills |

| Order | Note |
|-------|------|
| GENCardM260717NYST | shipment address de-duplicated |

Miss Iryna Vitkova was fixed earlier the same day.

## Rule going forward

When writing `*AddressFull`, set **either** `street` **or** `addInfo`, not both with the same value. Prefer `street` + empty `addInfo`.
