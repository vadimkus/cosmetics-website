# Orders & Order Tracking — Audit + Fixes — Web + App — 2026-07-06

Scope: order list + detail + tracking + success across web (`/orders`, `/track`,
`/api/orders/*`), mobile (`app/profile/orders*`, `/api/mobile/orders/*`), the admin
status update path, and the shared status vocabulary.

## What's solid

- **Access control is correct.** Web `/api/orders` requires a session and enforces
  that a non-admin can only query their own email/contactEmail (403 otherwise).
  Mobile order read/delete use `canAccessCustomerEmail` ownership checks and only
  allow deleting pending/unpaid orders. Order-owned data is not leakable cross-user.
- **Server-side totals** are authoritative; success/detail responses expose the full
  pricing breakdown (subtotal, shipping, VAT, user + bundle discounts).
- Cancelled/deleted orders are filtered out of the customer list server-side.

## Status vocabulary — the real inconsistency (fixed)

The admin can assign `PENDING, CONFIRMED, PAID, SHIPPED, DELIVERED, CANCELLED`
(`/api/admin/orders/[id]` validStatuses; dropdown offers a subset). Production today
has DELIVERED, DELETED, CANCELLED, CONFIRMED, PENDING live.

- **Web `/orders` customer page** only styled `pending, processing, shipped,
  delivered, cancelled` — so **CONFIRMED and PAID orders rendered as raw uppercase
  text** ("CONFIRMED") with a generic gray clock. CONFIRMED is live in production.
  → Added `confirmed`, `paid`, and `out_for_delivery` to both `statusLabels`
  (EN/AR/RU) and `statusConfig` (icon + colors).
- **Mobile `app/profile/orders.js`** handled everything except `out_for_delivery`.
  → Added `out_for_delivery` to the label map, a matching orange in
  `theme.statusStyle`, and the `ordersDetail.statusOutForDelivery` i18n key (EN/AR/RU).
- Web `/track` page already handled the full set (incl. OUT_FOR_DELIVERY) — unchanged.

Note (not changed): the tracking timeline lists PROCESSING and OUT_FOR_DELIVERY steps
that the admin UI can't currently assign, so those steps always render as "upcoming".
Harmless, but if you want them usable, add them to the admin dropdown + validStatuses.

## Security: public tracking endpoint rate-limited (fixed)

`/api/orders/track/[orderNumber]` is intentionally public (guest tracking from email
links) and returns first name, items, emirate, status, item count and total — no
auth. Order numbers are **sequential and predictable** (`GEN` + YYMMDD + a global
counter, e.g. GEN2607060042), so the endpoint was trivially enumerable to harvest
that customer data in bulk. Added IP rate limiting (30 requests / 10 min, fail-closed)
— generous for a real customer, hostile to scraping. The payload was already
privacy-conscious (no email/address/prices), so no data shape changed.

## Verification

- `tsc --noEmit` + full web build clean; `expo export` clean.
- Web: deployed via main. Mobile: OTA + in the next binary.
