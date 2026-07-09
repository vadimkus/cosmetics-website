# Korea PO DM GME 260616 ship — stock receive (2026-07-03)

**PO:** `DM GME 260616 ship` (`5f77462f-6ed1-11f1-0a80-076300a0934e`)  
**Supplier:** DTSMG GME Co., Ltd  
**Shipment:** Korea air | AWB **607-54108224** | CPIP-160626-081300

Cargo arrived — full receive posted against shipping invoice PO.

## Posted

| Doc | Number | Sum (AED) | Units | Lines |
|-----|--------|----------:|------:|------:|
| Supply (Приёмка) | **00187** | **55,453.23** | 1,915 | 38 |

- [Supply 00187](https://online.moysklad.ru/app/#supply/edit?id=098def25-76ca-11f1-0a80-04b6001751a4)
- [PO DM GME 260616 ship](https://online.moysklad.ru/app/#purchaseorder/edit?id=5f77462f-6ed1-11f1-0a80-076300a0934e)

**PO status:** received **55,453.23 / 55,453.23 AED** ✓

**Script:** `scripts/moysklad-receive-po-dm-gme-260616-shipping-20260703.js --commit`

## Supplier invoice + payment (2026-07-03)

T/T paid — invoicein and paymentout posted against supply **00187**.

| Doc | Number | Sum (AED) |
|-----|--------|----------:|
| Invoicein (Счёт поставщика) | **00173** | **55,453.23** |
| Paymentout (Расход) | **00643** | **55,453.23** |

- [Invoicein 00173](https://online.moysklad.ru/app/#invoicein/edit?id=d3de7467-76ca-11f1-0a80-11480017da9f)
- [Paymentout 00643](https://online.moysklad.ru/app/#paymentout/edit?id=d4553787-76ca-11f1-0a80-10320017ef6f)

**PO status:** invoiced **55,453.23** | paid **55,453.23** | received **55,453.23** ✓

**Script:** `scripts/moysklad-create-po-dm-gme-260616-ship-invoice-payment-20260703.js --commit`

## Next steps

1. Reconcile physical count vs packing list (23 cartons) if needed.

See also: [SESSION_CHANGES_2026-06-23_KOREA_PO_DM_GME_260616_SHIPPING.md](./SESSION_CHANGES_2026-06-23_KOREA_PO_DM_GME_260616_SHIPPING.md)
