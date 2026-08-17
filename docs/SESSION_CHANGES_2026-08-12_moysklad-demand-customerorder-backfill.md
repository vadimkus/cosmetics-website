# SESSION CHANGES — 2026-08-12 — MoySklad demand SO-link backfill (REVERSED)

## Backfill (later reversed)
Temporarily linked `customerOrder` on 48 Aug demands. Vadim asked to reverse.

## Reverse
API cannot null `demand.customerOrder` once set. Reversed by delete+recreate without SO link (same doc numbers, payments relinked).

Result: CLEARED 47 + ALREADY_CLEAR 1 (06633) + FAIL 0.

## Also reverted
- `lib/moysklad.ts` — no longer auto-sets demand.customerOrder
- Rule note: do not mass-backfill demand.customerOrder unless asked
