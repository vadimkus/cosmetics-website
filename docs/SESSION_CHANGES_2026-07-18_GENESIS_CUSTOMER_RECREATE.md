# Genesis Healthcare Center — recreate MoySklad customer (2026-07-18)

**Context:** Order **PARTW2607160539** (2,970 AED) was on **NEW YOU STAR** after the 2026-07-16 merge. User asked to put it back on **Genesis** as its own customer.

## Source (website)

[genesis-dubai.com/contact-us](https://www.genesis-dubai.com/contact-us/)

| Field | Value |
|-------|-------|
| Name | Genesis Healthcare Center |
| Phone | +971 4 577 6500 |
| Alt (portal) | +971 50 550 7029 |
| Email | info@genesis-dubai.com |
| Portal login | support@genesis-dubai.com |
| Address | Dubai Science Park Towers, North Tower 3rd & 4th Floor, Dubai Science Park, Dubai |
| Web | https://www.genesis-dubai.com |
| Instagram | @genesis_dubai |

## MoySklad

| Action | Detail |
|--------|--------|
| Created / updated | **Genesis Healthcare Centre FZ-LLC** — `efa467b8-825b-11f1-0a80-082e002d861f` |
| Reassigned | Order **PARTW2607160539**, invoice **04830**, shipment **06555** |
| Cleared from | NEW YOU STAR BEAUTY HEALTH CLINIC L.L.C (`69e1db3e-…`) |

Script: `scripts/moysklad-create-genesis-reassign-partw2607160539-20260718.js --commit`

## VAT certificate (FTA, 2026-07-18)

| Field | Value |
|-------|-------|
| Legal name | Genesis Healthcare Centre FZ LLC |
| TRN | **100290408200003** (effective 01/01/2018) |
| License | **96172** (Dubai Development Authority) |
| Address | North Tower Floor 4, Dubai Science Park, Dubai 191333 |
| Contact on cert | +971 50 248 9125 |

## Commercial license (DDA, 2026-07-18)

| Field | Value |
|-------|-------|
| Licensee | Genesis Healthcare Centre FZ-LLC |
| License No. | **96172** |
| Legal status | Free Zone Limited Liability Company |
| First issue | 23 Jun 2019 |
| Current issue | 23 Jun 2026 |
| Expiry | **30 Nov 2026** |
| General Manager | Foteini Efstathopoulou |
| Premises | R05, 4th Floor, DSP Towers - North, Dubai Science Park |
| Activities | Coffee Shop; Poly Clinic; Psychological & Behavioral Therapy |

MoySklad Face Room pattern: `inn` + `legalAddressFull.comment` = TRN; `email`/`fax` = license **96172**.

## Portal

`support@genesis-dubai.com` → name/TRN/phone/address updated; `moyskladCounterpartyId` = `efa467b8-…`

## Note

Jul 16 merge was wrong — Genesis TRN **100290408200003** ≠ New You Star **100619066200003**. Separate legal entities. New You Star consignment (contract 37) unchanged.
