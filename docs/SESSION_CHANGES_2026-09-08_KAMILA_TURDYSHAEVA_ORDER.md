# Session — Kamila Turdyshaeva paid order #GENCardM2609083491

- Date: 2026-09-08
- Gmail thread: `1a0801c7052af2a4`
- Subject: New Paid Order #GENCardM2609083491 - Kamila Turdyshaeva - AED 500.00
- Received: 08/09/2026, 12:22:17 PM GST
- Source: Mobile App · Stripe paid
- Link: https://mail.google.com/mail/u/0/#inbox/1a0801c7052af2a4

## Customer
- Name: Kamila Turdyshaeva
- Email: kamilya.t@gmail.com
- Phone: +971501262772
- Address: Casa Dora villa 233, Dubai, UAE

## Items
1. SKIN CARING BLEMISH BALM CUSHION [SPF 50+ PA++++] Beige — AED 300.00
2. MULTI SUN CREAM [SPF 40 PA++] — AED 210.00
3. INTENSIVE REPAIR COLLAGEN MASK (FREE) — FREE

Subtotal 510 + Dubai 45 − Rewards 1,100 pts / 55 = **500.00 AED**

## Action
WhatsApp drafted in Russian. Invoice not exported.

## MoySklad address duplication fixed

Invoice **05038** initially printed the address twice. Live data showed the
current street in `actualAddressFull.street`, while an older complete address
remained in `actualAddressFull.addInfo`. MoySklad merges nested address fields
on `PUT`, so omitting `addInfo` did not clear it.

- Root fix: `buildMoySkladAddressFull()` now always sends `addInfo: ''`.
- Regression coverage: `__tests__/lib/moyskladAddress.test.ts`.
- Kamila's card repaired to `UAE, Dubai, Casa Dora villa 233`.
- Corrected PDF: `~/Desktop/orders/GENOSYS_Kamila_Turdyshaeva_05038.pdf`.
- Repair script: `scripts/moysklad-fix-kamila-05038-address-dup-20260908.js --commit`.
- Not printed.

Verification: address tests **6 passed**, ESLint passed, TypeScript passed,
and the re-exported PDF contains one address only.
