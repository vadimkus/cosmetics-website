# Address tidy — remove Dubai/UAE duplicates (2026-08-07)

Triggered by Kateryna Sierova buyer line:
`Oasis Villas 13, JVC, Dubai, Dubai, Dubai, United Arab Emirates`

## Applied

Script: `scripts/tidy-addresses-dubai-uae-20260807.js`  
Report: `tmp/address-tidy-applied-20260807.json`

| System | Updated |
|--------|--------:|
| Website `user.address` | 209 |
| Website Address book rows | 16 |
| MoySklad counterparties | 251 |

Rules: drop UAE / United Arab Emirates / ОАЭ tokens; collapse duplicate emirate parts; dedupe repeated street segments; normalize spacing/commas; strip `00000`.

## Kateryna Sierova

- Web: `Oasis Villas 13, JVC, Dubai`
- MoySklad: `UAE, Dubai, Oasis Villas 13, JVC` (country+city prefix is MoySklad formatting)

## Follow-up — Kateryna MoySklad = web format

MoySklad was showing `UAE, Dubai, Oasis Villas 13, JVC` (country/city prefix).  
Set `actualAddress` string so MS matches web exactly:

`Oasis Villas 13, JVC, Dubai`

## Follow-up — canonical format `Street, City, UAE`

Target example: **Oasis Villas 13, JVC, Dubai, UAE**

Applied to:
- Kateryna web + MoySklad
- MoySklad counterparties with addresses: **949** updated
- Website `user.address`: bulk append/normalize to same format

Report: `tmp/address-format-city-uae-20260807.json`
