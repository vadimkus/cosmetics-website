# Miss Dariya Fedotova — sea algae ×5 paid (2026-08-10)

**Customer (new):** Miss Dariya Fedotova  
`e3472149-94cd-11f1-0a80-1029008dd68b`  
Email `dariyafedotova888@gmail.com` · Phone `+971 54 747 4655`  
Ship: Al Barari, Ashjar E2, apartment 213, Dubai

**Script:** `scripts/moysklad-create-dariya-fedotova-sea-algae-paid-20260810.js --commit`

| Doc | Number | Amount |
|-----|--------|-------:|
| SO | GENCardM2608104655 | 225.00 |
| Invoice | **04911** | 225.00 |
| Shipment | 06660 | 225.00 |
| Payment in | 06058 | 225.00 |

Lines: Sea Algae `00140` ×5 @ **36** retail + delivery Dubai **45**. Paid / delivered.

PDF: `~/Desktop/orders/GENOSYS_Miss_Dariya_Fedotova_04911.pdf`  
Printed landscape (`lp -o orientation-requested=4`).

## Website import + points + email (2026-08-11)

**Script:** `scripts/import-dariya-fedotova-paid-order-20260810.ts`  
User: `dariyafedotova888@gmail.com` (`cmsnd66ba000004jxq5gnt0ch`)

| | |
|--|--|
| Website order | `cmso4aolo00009n8oqxxtifv6` / **GENCardM2608104655** |
| Status | DELIVERED / paid |
| Rewards | **+180** points (product AED 180; delivery excluded) |
| Balance | **180** |
| Email | one-off to customer only — SMTP `<7c7a44d0-6843-71c9-427b-b86ca070b56c@gmail.com>` |
| Subject | Welcome to GENOSYS — your order is in your account |

Marker `dariyaPaidOrderAccountEmail` stored on order paymentMetadata (exactly-once).

## Fix note

First commit matched **Miss Iryna Fedotova** (`c164de7d-…`) via surname search and overwrote her card. Restored Iryna (Aykon City Tower C 2420, `+971501351497`), created Dariya as a separate counterparty, re-linked SO/inv/ship/payin, re-exported PDF.
