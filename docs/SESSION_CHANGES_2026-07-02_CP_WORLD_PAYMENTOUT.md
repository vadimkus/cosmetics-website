# CP World — freight invoice V11180 paymentout (2026-07-02)

## Payment

| Doc | Number | Sum | Date posted | Link |
|-----|--------|----:|-------------|------|
| paymentout | **00641** | **12,074.05 AED** | 2026-07-02 | [edit](https://online.moysklad.ru/app/#paymentout/edit?id=fb2c52f3-75ca-11f1-0a80-0ffa0033ccf7) |

- **Agent:** CP World LLC (`65bd4e87-4b2c-11ef-0a80-03900021d381`)
- **Expense item:** Shipment Cost
- **Invoice:** **V11180** dated **29-Jun-2026**
- **Job:** AIGN-V00239
- **Shipment:** DM GME 260616 Korea air | AWB **607-54108224**

## Invoice breakdown

| Line | Amount AED |
|------|----------:|
| Air freight (1,814.17 USD @ 3.685) | 6,685.22 |
| Ex works (245.00 USD @ 3.685) | 902.83 |
| Dubai local charges | 1,435.00 |
| Customs duty | 3,051.00 |
| **Total** | **12,074.05** |

## Script

`scripts/moysklad-create-cp-world-paymentout-20260702.js --commit`

## Related

- Korea goods PO: `DM GME 260616 ship` — `docs/SESSION_CHANGES_2026-06-23_KOREA_PO_DM_GME_260616_SHIPPING.md`
- Desktop ingest: `docs/SESSION_CHANGES_2026-06-26_DESKTOP_26062026_FOLDER_INGEST.md`
