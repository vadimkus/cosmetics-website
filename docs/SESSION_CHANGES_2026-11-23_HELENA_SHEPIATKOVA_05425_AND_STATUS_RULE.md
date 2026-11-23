# Helena Shepiatkova 05425 (amended) + new standing rule: push status sync

23 Nov 2026. Vadim pasted the "New Paid Order" email for **#GENCardW2611223311 — Helena Shepiatkova**,
asked to add a Snow O₂ Cleanser 180ml to it, push to MoySklad, print, and lock in a standing rule for
every future push.

## 1. Order amended on the website

Original order (Stripe paid 295 AED, `pi_3UeizSCtEeBBw5M60nPYvs8L`): Ultra Shield Sun Cream SPF50 50g ×1
@ 250 + delivery 45.

Added **Snow O₂ Cleanser 180ml** @ 330 (product id `10`) as a second `OrderItem` on the same order
(`OrderItem.id` `cmwsoa3wf0000jcbofs1nvwuh`). Recomputed on the `Order` row itself:

| | Before | After |
|---|---:|---:|
| subtotal | 250 | **580** |
| vat | 14.05 | **29.76** |
| total | 295 | **625** |

The original Stripe charge (`paymentMetadata`, `stripePaymentIntentId`) was left untouched — it is the
real audit trail of what was actually captured (295). The extra 330 for the cleanser is not a new
Stripe charge; Vadim is handling that collection himself.

## 2. Pushed to MoySklad

New card **Helena Shepiatkova** `5f3a75ab-c83e-11f1-0a80-14df01767375`. Phone +971566088999. Address:
Grove by Iman, apartment 610, 6th Floor, Dubai Hills.

| Doc | Number | Id |
|---|---|---|
| SO | GENCardW2611223311 | `4dce2dbf-e6e9-11f1-0a80-1be6007188b4` |
| INV | 05425 | `4e15fb1d-e6e9-11f1-0a80-06ec00705d7a` |
| SHIP | 07304 | `4edd055c-e6e9-11f1-0a80-18080070a519` (no customerOrder) |
| PAY | 06600 | `4f4ff260-e6e9-11f1-0a80-18080070a539` |

SO state **Оплачен - Ждет доставки**. Sum 625 (both lines pushed at full retail, no discount).

PDF: `~/Desktop/orders/GENOSYS_Helena Shepiatkova_05425.pdf`. Printed landscape, job
**EPSON_L3260_Series-4418**.

Script: `scripts/moysklad-push-helena-shepiatkova-20261123.ts`.

## 3. New standing rule — website status syncs on push

Added `lib/moysklad.ts` logic inside `createMoySkladOrder`, right before its success return: once a
push actually creates the SO/invoice/shipment, the website `Order.status` is set automatically —
**`SHIPPED`** if paid online (anything but `cod`), **`CONFIRMED`** if COD. Wrapped in its own
try/catch, never throws, matches the function's existing fire-and-forget contract. Uses a **lazy**
`await import('@/lib/prisma')` (not a static import) so pure-function unit tests that import
`lib/moysklad.ts` don't pull in a live Prisma client.

This covers **both** paths that call `createMoySkladOrder`: the admin "Push to MoySklad" button
(`app/api/admin/orders/[id]/push-moysklad/route.ts`) and every one-off `scripts/moysklad-push-*.ts`
script — no per-script edits needed going forward.

Confirmed live on this very order: after the push above, `Order.status` for `GENCardW2611223311`
read back as **SHIPPED** without any manual update.

Rule doc: `.cursor/rules/moysklad-push-status-sync.mdc`. Canonical status casing is uppercase
(`PENDING` / `CONFIRMED` / `PAID` / `SHIPPED` / `DELIVERED` / `CANCELLED`) — also corrected
**Sana Noor**'s order (`GENCardM2611191570`, 19 Nov), which an earlier manual update had set to
lowercase `"shipped"`.

## Side fixes made while touching `lib/moysklad.ts`

- Removed a duplicate object-literal key (`'PEPTIDE GEL MASK 39G SINGLE'` and the computed key
  `[PEPTIDE_GEL_MASK_SINGLE_PRODUCT_NAME]` were the identical string, added uncommitted back on
  26 Oct for Garri Stepanyan's order) — this was failing `tsc --noEmit` silently (never caught before
  because nothing had run a full typecheck on this file since). Kept the computed-key version only,
  same UUID.
- Fixed an em dash the new comment introduced, caught by `__tests__/lib/noDashes.test.ts`.

Verified: `npx tsc --noEmit` clean on `lib/moysklad.ts`; `__tests__/lib` full suite — **76/76 suites,
646/646 tests pass**.

## Committed and pushed

`lib/moysklad.ts`, `.cursor/rules/moysklad-push-status-sync.mdc`, and this note committed and pushed
to `main`.
