# MoySklad latest customer address sync — 2026-09-05

Fixed website-order pushes for returning customers.

- Before: `findOrCreateCounterparty()` populated `actualAddressFull` only when it created a new MoySklad customer. Existing customers retained the old card address.
- Now: when an existing counterparty is matched by exact phone, normalized phone, or email, a non-empty checkout address updates that card's `actualAddressFull`.
- The address remains structured as street-only + emirate city + UAE country, without duplicated `addInfo`.
- Historical orders are unchanged because each SO / invoice / shipment keeps its own `shipmentAddressFull`.
- Blank checkout addresses do not clear an existing MoySklad address.
- If the required address update fails, the push stops instead of silently creating documents against a stale customer card.

Example motivating case: Anastasiia Todosiichuk's website order had a new Laguna Tower address while her MoySklad card still showed the older Lake Terrace address.

Changed: `lib/moysklad.ts`

Verification:

- `npx eslint lib/moysklad.ts`
- `npx tsc --noEmit`
- MoySklad address + delivery tests: **9 passed**
