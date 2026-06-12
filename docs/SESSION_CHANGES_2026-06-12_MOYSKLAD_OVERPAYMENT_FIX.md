# MoySklad overpayment fix — Shakirovna + My Skin Story (2026-06-12)

## Fixed

| Customer | Docs | Issue | Fix |
|----------|------|-------|-----|
| **Shakirovna Ladies Beauty Saloon** | Invoice **02184**, shipment **02790**, payment **02515** | Payment **692** vs doc **527** (+165 AED) | Payment **02515** reduced to **527** linked to demand **02790** |
| **My Skin Story** | Commission report **01231** | Duplicate payments **05020** + **05021** (840 each) | Deleted duplicate **05021**; kept **05020** |

## Verification (API after `--commit`)

| Doc | sum | payedSum |
|-----|----:|---------:|
| Invoice **02184** | 527.00 | 527.00 |
| Shipment **02790** | 527.00 | 527.00 |
| Report **01231** | 840.00 | 840.00 |

## Settlement balance (invoices + commission reports + returns)

| Customer | Before | After | Note |
|----------|-------:|------:|------|
| Shakirovna Ladies | -168 | -333 | Removing false +165 credit → customer owes more on net AR (correct) |
| My Skin Story | +2,362 | +1,522 | -840 duplicate removed; other open credits remain |

## Script

`scripts/moysklad-fix-overpayment-20260612.js`

```bash
node --import dotenv/config scripts/moysklad-fix-overpayment-20260612.js --commit
```

Related: [SESSION_CHANGES_2026-06-07_MOYSKLAD_OVERPAYMENT_FIX.md](./SESSION_CHANGES_2026-06-07_MOYSKLAD_OVERPAYMENT_FIX.md) (Tarasova + Marapo).
