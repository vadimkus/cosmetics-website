# Samples / testers out — weekly write-off process

Started **2026-07-28**. Goal: stock matches reality when testers are given free (not on invoices).

## How it works

1. When you hand out samples (not FOC on an invoice), add a row to **`SAMPLES_OUT_LOG.csv`** with `status=pending`.
2. Once a week (or when you say “batch write-off samples”), run:

```bash
node --import dotenv/config scripts/moysklad-samples-weekly-writeoff.js
node --import dotenv/config scripts/moysklad-samples-weekly-writeoff.js --commit
```

3. Script creates one MoySklad write-off @ buyPrice for all `pending` rows, then sets those rows to `status=done` and fills `writeoff_doc`.

## Log columns

| Column | Example |
|--------|---------|
| `date` | 2026-07-28 |
| `code` | 54478 |
| `qty` | 1 |
| `customer` | Miss Anastasiya |
| `note` | hyaluron serum samples sachets |
| `status` | `pending` or `done` |
| `writeoff_doc` | filled by script (e.g. `00008-00485`) |

## FOC on invoice (no log needed)

If samples go out with an order → put SKU on SO/invoice/shipment @ list + **100% discount**. Stock leaves with shipment.

First batch (28 Jul): last 10 orders got FOC tester mix (always `00121` + 2 sample SKUs) — see `docs/SESSION_CHANGES_2026-07-28_FOC_TESTERS_LAST_10_ORDERS.md`.

## Common sample SKUs

| Code | Product |
|------|---------|
| 00111 | Samples Snow O₂ box |
| 00112 | Samples Blemish Balm box |
| 00113 | Samples Multi Sun Cream |
| 00121 | HR³ shampoo tester 30ml |
| 54476 | Samples Overnight Mask 2g×50 |
| 54478 | Samples Hyaluron Serum 2ml×100 |
| 54479 | Samples Hyaluron Cream 2g×100 |
| 54487 | Samples Revita BB Bright 2g×50 |
| 54488 | Samples Revita BB Natural 2g×50 |
| 54489 | Samples Multi Vita Radiance Serum 2ml×100 |

Baseline warehouse snapshot: `STOCK_SNAPSHOT_2026-07-28.md`
