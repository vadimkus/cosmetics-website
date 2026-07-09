# Session Changes — 2026-07-09 — Tax Invoice Email: Legal Letterhead

## Request

The invoice email customers generate from order history said "TAX INVOICE"
but carried none of the seller identity UAE law expects (TRN, legal name,
address). Reference: the official MoySklad invoice template. Make the email
invoice compliant and graceful.

## Changes

### `lib/siteConfig.ts` — LEGAL_INFO expanded (single source of truth)

Aligned with the official MoySklad tax-invoice template:

- `license`: kept **5023192** — Vadim confirmed (2026-07-09) this is the
  current trade license; I14330AT on the MoySklad template is the OLD number
  (the MoySklad template itself should be updated)
- `registeredAddress`: Compass Coworking Centre, Genosys ME, Ras Al
  Khaimah, UAE (new)
- `bankName` WIO Bank P.J.S.C., `iban` AE110860000009833011607,
  `accountNo` 9833011607 (new)

### `app/api/invoice/generate/route.ts` — invoice email

- **Letterhead** (like the official template): GENOSYS logo left; right
  block with legal name, TRN, trade license, registered address, email,
  phone, website. Localized labels (EN/AR/RU), RTL-aware.
- **Footer**: legal name + official-distributor line, TRN + trade license,
  registered address, and the bank line (Bank · IBAN · Acc No).
- Body unchanged (customer info card, items, VAT-inclusive summary with the
  explicit VAT amount — the FTA simplified-tax-invoice presentation).
- `generateInvoiceHTML` exported for preview scripts.

### `lib/email/utils.ts` — shared footer of ALL transactional emails

Now shows the registered address and TRN + Trade License (previously just
"Dubai, UAE" + TRN).

## Compliance Notes (UAE FTA — simplified tax invoice, B2C < AED 10k)

Required elements now present: "Tax Invoice" title ✓, supplier name,
address and TRN ✓, issue date ✓, description of goods ✓, total
consideration with VAT amount stated ✓ ("All prices include 5% VAT" +
explicit VAT line). Recipient details and invoice number also included
(full-invoice elements, harmless extra).

## Verification

- Rendered a sample invoice (isolated preview harness, no email sent) and
  reviewed in browser — letterhead, footer, totals all correct.
- tsc + ESLint clean.

## Note

License number resolved: 5023192 is current (Vadim, 2026-07-09); I14330AT
is the old license still shown on the MoySklad B2B invoice template —
worth updating there too.
