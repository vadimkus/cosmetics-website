# Write-offs totals + samples process (2026-07-28)

## Totals (MoySklad `loss` / списание @ buyPrice)

| Period | Docs | Sum AED |
|--------|-----:|--------:|
| July MTD (1–28 Jul) | 32 | **7,957** |
| YTD (1 Jan – 28 Jul) | 78 | **30,588** |

July is mostly presents/promo (~Fatima 623, training 614, mixed promo, Sara/Abeer, etc.) plus expired (~830) and Serene shrinkage (~264).

## Samples / testers — how to handle

Korea PO receives sample boxes into stock (correct). Giving them free without a document leaves **phantom stock**.

### Recommended

1. **FOC with an order** — add sample SKU on SO/invoice/shipment @ list price, **100% discount** (same pattern as free collagen). Stock exits with demand; customer sees free line; COGS hits that order.
2. **Handout without invoice** — write-off @ buyPrice, description `Samples/testers for [name]`. Same as presents.
3. **Busy week** — tally handouts; **weekly batch write-off** so warehouse qty stays honest.

Do **not** leave testers in stock after giving them away — inventory is overstated and write-offs look artificially low until stocktake.

## Live process (started 2026-07-28)

| Piece | Path |
|-------|------|
| How-to | [`docs/samples/README.md`](./samples/README.md) |
| Log (append handouts) | [`docs/samples/SAMPLES_OUT_LOG.csv`](./samples/SAMPLES_OUT_LOG.csv) |
| Baseline stock | [`docs/samples/STOCK_SNAPSHOT_2026-07-28.md`](./samples/STOCK_SNAPSHOT_2026-07-28.md) |
| Weekly script | `scripts/moysklad-samples-weekly-writeoff.js` |

```bash
# after adding pending rows to the CSV:
node --import dotenv/config scripts/moysklad-samples-weekly-writeoff.js
node --import dotenv/config scripts/moysklad-samples-weekly-writeoff.js --commit
```

Baseline: **16 sample SKUs / 240 units** in warehouse (28 Jul).
