# Mobile Card Payment Contact-Email Fix

Date: 2026-07-21

## Incident

Irina Kuznetsova could not start native card payment. Three production requests to
`POST /api/mobile/payments/sheet/intent` failed before Stripe Payment Sheet opened.

Production logs showed:

`Foreign key constraint violated on orders_customerEmail_fkey`

No order or payment intent was created, so the customer was not charged.

## Root cause

The authenticated account uses an Apple private-relay login email and a separate
verified `contactEmail`. The endpoint correctly accepted the contact email from
checkout, but incorrectly persisted it to `Order.customerEmail`.

`Order.customerEmail` is a foreign key to `User.email`, so it must always contain
the canonical login email. Notification delivery already resolves `contactEmail`
through `getPreferredEmail`.

## Fix

- Native Payment Sheet intent and legacy hosted Stripe checkout now persist
  `user.email` as `Order.customerEmail`.
- The checkout/contact email remains in Stripe metadata or Stripe receipt routing.
- Added a regression test proving contact-email checkout stores the canonical
  account email and successfully creates the intent response.

## Verification

- Focused API tests pass.
- ESLint and TypeScript pass.
- Production endpoint availability confirmed.
