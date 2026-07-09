# GOCOSMO BEAUTY SALON — partial consignment settlement (2026-06-20)

Existing consignment customer (~14k context; live stock ~22.6k AED). Customer pays **5,000 AED today**; balance next week (second report TBD).

Contract **13** · expanded existing report **01253** from **2,509 → 5,000 AED** + paymentin **5,000 AED**.

## Posted

| | |
|---|---|
| **Report** | **01253** (updated qty) |
| **Total** | **5,000.00 AED** VAT incl. |
| **Payment in** | **05801** / **5,000.00 AED** |
| **Report link** | https://online.moysklad.ru/app/#commissionreport/edit?id=7efa01fb-03f9-11f1-0a80-078e0016eec2 |
| **Payment link** | https://online.moysklad.ru/app/#paymentin/edit?id=e547450f-6c8e-11f1-0a80-1beb003bc9f0 |

## Lines (sold qty on report 01253)

| Code | Product | Old qty | New qty | Unit | Line |
|------|---------|--------:|--------:|-----:|-----:|
| `00189` | Skin Rescue Overnight Cream Mask 100g | 1 | **4** | 170.00 | 680.00 |
| `00059` | EyeCell Eye Zone Care Kit (box) | 2 | 2 | 490.00 | 980.00 |
| `00063` | Intensive Repair Collagen Mask 23g | 6 | 6 | 18.00 | 108.00 |
| `00035` | Intensive Problem Control Cream 50g | 1 | **3** | 145.00 | 435.00 |
| `00144` | Blemish Balm Cushion #2 Beige | 3 | 3 | 150.00 | 450.00 |
| `00129` | EPI Turnover Boosting Peeling Gel 100g | 1 | **5** | 125.00 | 625.00 |
| `00021` | Snow O₂ Cleanser 180ml | 3 | **10** | 165.00 | 1,650.00 |
| `00140` | Soothing Bomb Sea Algae Mask 23g | 2 | **4** | 18.00 | 72.00 |
| **TOTAL** | | **19** | **37 pcs** | | **5,000.00** |

## Escalation (2026-06-20 evening)

Owner promised **5,000 AED transfer** — **not received**. Reception confirmed via WhatsApp **cash payment not possible**. Consignment **suspended**.

**Books corrected (2026-06-20):** Report **01253** reverted **5,000 → 2,509 AED**. Draft payment **05801** **deleted**.

**Outstanding (contract 13):** report **01253** **2,509** + consignment stock **13,201** = **15,710 AED** total.

**Deadline:** Monday **22 June 2026, 15:00** UAE — full payment or legal recovery + stock collection.

**Demand letter:** [SESSION_CHANGES_2026-06-20_GOCOSMO_DEMAND_LETTER.md](./SESSION_CHANGES_2026-06-20_GOCOSMO_DEMAND_LETTER.md)

## Scripts

- Expand report (superseded): `scripts/moysklad-gocosmo-report-01253-5000-payment-20260620.js`
- **Revert to 2,509:** `scripts/moysklad-gocosmo-revert-report-01253-20260620.js`
- Book stock pick list: `scripts/moysklad-export-gocosmo-consignment-stock-20260620.js`
