# Zheteyeva Ella — full sales return vs invoice 01476 (2022)

Date: 2026-06-11  
Context: Customer balance audit flagged **8,225 AED** open on invoice **01476** (Bagus boards, Sep 2022). Vadim confirmed Ella returned all goods and is no longer a customer — close books, do not collect.

## Posted in MoySklad

| Doc | Name | Date | Sum | Link |
|-----|------|------|-----|------|
| Возврат покупателя | **00298** | **2022-12-19 12:00** | **8,225 AED** | Отгрузка **01738** → счёт **01476** |

- Counterparty: **Zheteyeva Ella** (`fd32339a-3c1d-11ed-0a80-0160001c8a3d`)
- Return ID: `a4a5c60c-656d-11f1-0a80-0099001831d1`
- UI: https://online.moysklad.ru/app/#salesreturn/edit?id=a4a5c60c-656d-11f1-0a80-0099001831d1
- Lines: 7 pcs Bagus Board SKUs (same as invoice 01476), `vatEnabled: false`
- Prior partial return **00064** (2022-12-18, 3,525 AED, other SKUs) unchanged

## API notes

- MoySklad **does not accept `invoiceOut`** on `salesreturn` POST — link is via **demand** only.
- After return, invoice **01476** may still show `payedSum: 0` in API; the return nets the receivable in settlement math (`invoice unpaid − return credit = 0` for this pair).

## Script

```bash
node --import dotenv/config scripts/moysklad-create-zheteyeva-ella-salesreturn-invoice-01476-2022.js --commit
```

Idempotent: duplicate guard on 2022-12-19 + marker `invoice 01476`.

## Audit impact

`moysklad-audit-customer-balances-20260611.js` updated to include **salesreturn** credits `(sum − payedSum)`.  
Invoice **01476** no longer drives “customer owes us” once return **00298** is included; Ella may still show **+3,525 AED** from older return **00064** (separate SKUs).
