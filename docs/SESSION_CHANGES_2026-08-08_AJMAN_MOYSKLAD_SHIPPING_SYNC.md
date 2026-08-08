# Fix: Ajman MoySklad push total mismatch (2026-08-08)

## Incident
Admin push for **CODW2608085950** (meryem malak lezzar, Ajman) failed:

`mapped total AED 580.00 does not match order total AED 650.00`

Order: POWER SOLUTION AWS 580 + shipping 70 + free mask = **650**.

## Root cause
`lib/moysklad.ts` `DELIVERY_SERVICE_MAP` had no **Ajman** (or UAQ) entry. Shipping line was skipped when unmapped, so mapped total stayed at merchandise only.

## Fix
1. Map **Ajman / Umm Al Quwain / UAQ** → MoySklad **Delivery Sharjah** service (`52864050-…`) — same 70 AED website rate; line price still from `order.shipping`.
2. If `shipping > 0` and emirate still unmapped → hard fail with a clear error (no silent skip).

## This order
Pushed successfully after fix:
- SO id `b84e2e32-9334-11f1-0a80-09e200446e80`
- Invoice `b892fff9-9334-11f1-0a80-1b910044ab79`
- Demand `b91263c7-9334-11f1-0a80-0b6e0043bf13`

Script: `scripts/moysklad-push-codw2608085950-ajman-20260808.ts`

**Deploy** `lib/moysklad.ts` so future admin “Push to MoySklad” works for Ajman/UAQ without a one-off script.
