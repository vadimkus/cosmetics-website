# Svitlana — customer phone fix (2026-06-12)

## Customer

| | |
|---|---|
| **Name** | Svitlana |
| **Email** | svetlana.hubr@gmail.com |
| **Address** | Luma 22, east block, 428, Dubai |
| **Website user ID** | `cmq9tun3e0082dxl09ikxafit` |
| **MoySklad counterparty ID** | `0c2f3142-6692-11f1-0a80-10fa004df201` |
| **MoySklad link** | https://online.moysklad.ru/app/#company/edit?id=0c2f3142-6692-11f1-0a80-10fa004df201 |

## Phone change

| | Value |
|---|---|
| **Before (wrong)** | `05477494727` *(stored; user reported `0547749472` — last digits transposed)* |
| **After (correct)** | `+971547749727` *(display: +971 54 774 9727)* |

Name, email, and address were left unchanged.

## Records updated

| System | Record | Field |
|---|---|---|
| **Website DB** | User `cmq9tun3e0082dxl09ikxafit` | `phone` |
| **Website DB** | Order `GENCardW2606124107` | `customerPhone` |
| **MoySklad** | Counterparty `Svitlana` | `phone` |

MoySklad order `GENCardW2606124107` has no separate shipment phone field — only the counterparty card.

## Search notes

- DB search by email `svetlana.hubr@gmail.com` returned **one** matching user (plus unrelated `Svetlana` / `Svetlana Elina` accounts with different emails).
- MoySklad search by `filter=email=svetlana.hubr@gmail.com` returned **one** counterparty; name filter `Svitlana` resolved to the same record.

## Script

```bash
node --import dotenv/config scripts/moysklad-update-svitlana-phone-20260612.js          # dry run
node --import dotenv/config scripts/moysklad-update-svitlana-phone-20260612.js --commit
```
