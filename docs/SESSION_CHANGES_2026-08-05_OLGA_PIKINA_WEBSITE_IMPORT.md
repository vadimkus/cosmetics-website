# Olga Pikina paid order website import (2026-08-05)

## Outcome

The existing paid MoySklad order was mirrored into Olga Pikina's production
website account. No MoySklad records were created or changed.

- Account: `olgaku4eryava@gmail.com` (one exact production match)
- Website order: `GENCardM260805PIKI`
- Website order ID: `cmsgefpac00004a8onam50fv1`
- State: `DELIVERED` / `paid`
- MoySklad SO UUID: `064af87a-90db-11f1-0a80-115e00205054`
- Existing chain: invoice `04893`, shipment `06639`, payment `06037`
- Product: Beige cushion ×1, AED 270
- Dubai delivery: AED 45
- Total: AED 315
- Canonical website image: `/images/cushion/main.jpeg`

## Contact update

The evidence-supported address was added to the website user and order:

`The Greens and Views, Fairways East tower, Apt 1804, Dubai`

The authoritative MoySklad counterparty and its contact persons contained no
phone number. No phone was guessed or written. The website user was linked to
MoySklad counterparty `0555788f-90db-11f1-0a80-040c001fd737`.

## GENOSYS Rewards

Normal server-authoritative rules awarded **270 points**:

- Rewards basis: AED 315 total minus AED 45 delivery = AED 270 products
- Tier at award: `MEMBER` (1×)
- Birthday multiplier: none (no birthday stored)
- Ledger row: one `ORDER_EARN` linked to the website order
- Resulting ledger and materialized balance: **270 points**

## Customer email

Exactly one customer email was sent. No admin email was sent.

- Recipient: `olgaku4eryava@gmail.com`
- Subject: `Your paid GENOSYS order is now in your account`
- Provider: Gmail SMTP
- Accepted message ID: `<7346c113-b8cc-7ddb-fb47-65e34694830a@gmail.com>`

The email says this was an account update only, not a new charge or shipment,
and lists the product, delivery, total, awarded points, and updated balance.
Provider acceptance is stored in the order's `paymentMetadata` under
`olgaPaidOrderAccountEmail`; reruns skip sending.

## Script and verification

Script:

`scripts/import-olga-pikina-paid-order-20260805.ts`

Commands:

```bash
# Read-only preview
npx tsx --env-file=.env --env-file=.env.local scripts/import-olga-pikina-paid-order-20260805.ts

# Production import and points award
npx tsx --env-file=.env --env-file=.env.local scripts/import-olga-pikina-paid-order-20260805.ts --commit

# Customer-only email; idempotent after provider acceptance is recorded
npx tsx --env-file=.env --env-file=.env.local scripts/import-olga-pikina-paid-order-20260805.ts --send-email
```

Final production checks:

- Website order count by `orderNumber`: 1
- Website order count by MoySklad SO UUID: 1
- Order item count: 1
- `ORDER_EARN` rows for order: 1
- Ledger balance = materialized user balance = 270
- Email acceptance marker: present
- No printing was performed
