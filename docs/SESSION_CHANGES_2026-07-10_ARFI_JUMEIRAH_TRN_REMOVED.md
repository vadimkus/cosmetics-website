# ARFI Jumeirah — TRN removed + consignment sales reissued (2026-07-10)

**Customer:** ARFI NAILS BEAUTY SALON 2 (Jumeirah) (`dc883e47-f051-11f0-0a80-0f7100059e21`)  
**Reason:** Jumeirah location not VAT registered — TRN should be blank on consignment invoice.

## Counterparty change

| Field | Before | After |
|-------|--------|-------|
| `legalAddressFull.comment` | `104933797300003` | *(empty — TRN blank)* |
| `email` / `fax` | `946792` | unchanged (license #) |

**Barsha** (`39a1aa83-a5a6-11f0-0a80-1cbc00050fea`) — **unchanged** (TRN kept if still valid there).

## Reissued PDF

| Doc | File |
|-----|------|
| Consignment sales **01398** | `~/Desktop/orders/GENOSYS_ARFI_Nails_Jumeirah_Consignment_Sales_01398.pdf` |

- Report: [01398](https://online.moysklad.ru/app/#commissionreport/edit?id=511f797b-76a7-11f1-0a80-1c6d000ed67c) — **1,476 AED** (unchanged)
- Demand **06463** — not reprinted (stock note; TRN on sales template only)

## Script

`scripts/moysklad-clear-arfi-jumeirah-trn-reissue-01398-20260710.js --commit`

Related: [June consignment sold](./SESSION_CHANGES_2026-07-03_ARFI_JUMEIRAH_JUNE_CONSIGNMENT_SOLD.md), [ARFI TRN update](./SESSION_CHANGES_2026-07-08_ARFI_NAILS_VAT_TRN.md)
