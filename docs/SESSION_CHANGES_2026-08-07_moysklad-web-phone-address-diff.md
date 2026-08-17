# MoySklad ↔ website phone/address diff (2026-08-07)

Scope: **32** website users with `moyskladCounterpartyId` (no writes yet).

| Status | Count |
|--------|------:|
| Full match | 22 |
| Address mismatch | 5 |
| Address missing on web (MS has it) | 5 |
| Phone mismatches | 0 |
| Missing on MoySklad | 0 |

JSON: `tmp/moysklad-web-phone-address-diff-20260807.json`

## Follow-up — web as SoT for Daria + Zhanna

User: website address is source of truth for these two → update MoySklad.

| User | MoySklad counterparty | New MS address |
|------|----------------------|----------------|
| Daria Likhobabina | My Skin Story… (`c3576ba8-…`) | Damac Hills 2, Amargo Cluster, Villa 320 |
| Zhanna Klusova | FACE ROOM… (`12b051b0-…`) | Arabian Ranches 2 Camelia 1 villa 145 |

Cleared old clinic `addInfo` (Tecom / Marina Gate) so MS no longer appends it.
Website rows left unchanged.

## Follow-up — Viktoriia Klymenko (MS as SoT)

Website updated from MoySklad:
- Was: Ras al khaimsh, Ras Al Khaimah
- Now: Tamani Arts offices building, office 2013, Dubai
- Phone unchanged: +971525451403
- Created default Address book row (work/Clinic)

## Follow-up — safe fill `user.address` from MoySklad

Filled Contact Information address (was empty) for:

1. Marina Biryukova — DSO, Cedre Villas, K-46, Dubai
2. Sarayounesskin Sara — Elyazia Beauty Center, Street 15 Villa 57B - Mirdif - Dubai
3. Sema Tare — Stand Point Tower B 1701 Downtown, Dubai
4. Stuart Anson — Villa 18 Al Safeena Street, Jumeirah 3, Dubai

Phones already present; Address book rows left as-is.
