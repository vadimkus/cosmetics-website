# Rise UP — Consignment agreement address/phone fix + PDF regenerate

**Date:** 2026-06-03 (UAE)

## Change

Corrected Rise UP **Consignee** contact details in Agreement No. **34** to match `Genosys_Consignment_Stock_Note_RISEUP.pdf` (shipment **06255**).

| Field | Was (wrong) | Now (from stock note) |
|--------|-------------|------------------------|
| Office | 1808, 18th Floor | **906** |
| Address | 57 Marasi Drive, Business Bay | **Office 906, The Metropolis Tower, Business Bay** |
| Phone | +971 55 443 6530 | **+971 58 530 93 20** |

## Files updated

| File | Action |
|------|--------|
| `docs/Rise_UP_Consignment_Agreement_34_Genosys_Middle_East_FZ-LLC.md` | Address + phone corrected |
| `~/Desktop/RiseUP/Genosys_Consignment_Agreement_Rise_UP.pdf` | **Regenerated** (Chrome headless via pandoc HTML) |
| `scripts/moysklad-create-rise-up-customer-20260601.js` | Reference customer constants updated |
| `docs/SESSION_CHANGES_2026-06-01_RISE_UP_CUSTOMER.md` | Address + phone updated |

## PDF regeneration command

```bash
pandoc docs/Rise_UP_Consignment_Agreement_34_Genosys_Middle_East_FZ-LLC.md \
  -f markdown -t html5 -s \
  -c file://$(pwd)/docs/reference/consignment-agreement-pdf.css \
  -o ~/Desktop/RiseUP/Genosys_Consignment_Agreement_Rise_UP.html

"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --no-pdf-header-footer \
  --print-to-pdf=~/Desktop/RiseUP/Genosys_Consignment_Agreement_Rise_UP.pdf \
  file://$HOME/Desktop/RiseUP/Genosys_Consignment_Agreement_Rise_UP.html
```

## Note

MoySklad counterparty `b83e0d80-…` updated 2026-06-03 — address, email, and contact (script `moysklad-update-rise-up-contact-20260603.js`).

## Compact agreement (2026-06-03)

- **Schedule A removed** — opening stock lives in `Genosys_Consignment_Stock_Note_RISEUP.pdf` (shipment **06255**).
- Agreement rewritten as **1-page** short form (8 clauses + dual signatures).
- PDF regenerated: `~/Desktop/RiseUP/Genosys_Consignment_Agreement_Rise_UP.pdf` (**1 page**).

| Field | Value |
|--------|--------|
| Name | **Irina Kovalenko** |
| Email | **Irina_01-01@mail.ru** |
| Mobile | **+971 50 102 5360** |
| Signatory | Irina Kovalenko, Authorised Signatory |
