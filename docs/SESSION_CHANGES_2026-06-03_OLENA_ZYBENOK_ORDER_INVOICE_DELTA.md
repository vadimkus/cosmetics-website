# Olena Zybenok — order vs invoice delta (investigation)

**Date:** 2026-06-03  
**Counterparty:** `Olena Zybenok` (`4b8fa9f3-c10a-11ea-0a80-04a50009494d`)  
**Phone:** 0554242273

## Documents

| Doc | Number | Sum (AED) | Moment |
|-----|--------|----------:|--------|
| Customer order | **GENCardW2606021798** | **1,049.60** | 2026-06-03 |
| Invoice out | **04605** | **1,312.00** | 2026-06-03 |
| **Delta** | | **+262.40** | |

- [Order UI](https://online.moysklad.ru/app/#customerorder/edit?id=33c36766-5ef3-11f1-0a80-132d0008eb59)
- [Invoice UI](https://online.moysklad.ru/app/#invoiceout/edit?id=869c8c7a-5ef4-11f1-0a80-148200092d9f)

## Root cause

Bundle Builder website order: **6 paid lines @ 20% discount** + **2 free promo masks**.

- **Order** lines carry **20% discount** → total **1,049.60 AED** (correct paid amount).
- **Invoice 04605** was created with **same unit prices but 0% discount** on all paid lines → total **1,312.00 AED** (full retail).

**262.40 AED = 20% × 1,312.00** — exactly the missing bundle discount.

## Line comparison

| Product | Order (price / disc / line) | Invoice (price / disc / line) |
|---------|------------------------------:|------------------------------:|
| Multi Vita Radiance Serum 30ml | 330 / **20%** / 264.00 | 330 / **0%** / 330.00 |
| Collagen Mask 23g | 36 / **20%** / 28.80 | 36 / **0%** / 36.00 |
| Sea Algae Mask 23g | 36 / **20%** / 28.80 | 36 / **0%** / 36.00 |
| Multi Anti-Wrinkle Serum 30ml | 330 / **20%** / 264.00 | 330 / **0%** / 330.00 |
| Multi Anti-Wrinkle Cream 50g | 290 / **20%** / 232.00 | 290 / **0%** / 290.00 |
| EGF Repair Oxymask Cream 50ml | 290 / **20%** / 232.00 | 290 / **0%** / 290.00 |
| Sea Algae Mask (promo) | 0 / 0% / 0.00 | 0 / 0% / 0.00 |
| Collagen Mask (promo) | 0 / 0% / 0.00 | 0 / 0% / 0.00 |

Promo lines are 0 on both docs (order uses net 0 rather than retail + 100% — cosmetic only).

## Not the same customer as May bundle order

| Counterparty | Order | Order = Invoice? |
|--------------|-------|------------------|
| **Miss Olena** (olena.world.ae@gmail.com) | GENCardM2605129487 | ✓ both **1,036.80** (invoice 04499) |
| **Olena Zybenok** | GENCardW2606021798 | ✗ order **1,049.60** vs invoice **1,312.00** |

## Fix (manual in MoySklad)

On invoice **04605**, set **20% line discount** on the six paid product lines (match order **GENCardW2606021798**). Total should become **1,049.60 AED**.

## Fix applied (2026-06-03)

Script: `scripts/moysklad-fix-olena-zybenok-invoice-04605-bundle-discount.js`

```bash
node --import dotenv/config scripts/moysklad-fix-olena-zybenok-invoice-04605-bundle-discount.js --commit
```

- Syncs invoice lines **by position index** from order **GENCardW2606021798** → invoice **04605**
- Six paid lines: retail price + **20%** discount
- Two promo lines: **0.00 AED** (price 0, disc 0%) — same as order

**Result:** invoice **04605** = **1,049.60 AED** (matches order; delta **0.00**)
