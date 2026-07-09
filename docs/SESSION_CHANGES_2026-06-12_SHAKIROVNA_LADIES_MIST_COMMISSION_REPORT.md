# Shakirovna Ladies Marina — mist consignment report + payment (2026-06-12)

## Customer

**Shakirovna Ladies Beauty Saloon** — JBR Marina Wharf 1 · consignment contract **00030**

## Created

| Doc | Number | Sum | Link |
|-----|--------|----:|------|
| Commissioner report | **01379** | 160.00 | [report](https://online.moysklad.ru/app/#commissionreport/edit?id=2619e228-6666-11f1-0a80-16d90045ad45) |
| Incoming payment | **05758** | 160.00 | [paymentin](https://online.moysklad.ru/app/#paymentin/edit?id=26815cdc-6666-11f1-0a80-1bab0046b7a6) |

## Lines

| Code | Product | Qty | Unit | Line |
|------|---------|----:|-----:|-----:|
| `00188` | Microbiome Energy Infusing Mist 80ml | 2 | 80.00 | **160.00** |

VAT incl. · `rewardPercent: 0` · report **160/160 paid** via bank paymentin **05758**.

## Note — duplicate retail chain same day

Earlier today a **retail** chain was also posted for the same customer/qty/amount (order **GENCardM2606129407** → invoice **04661** → shipment **06345** → cash **00168**). Consignment settlement should use **this report path**, not retail warehouse shipment. Consider voiding/deleting the retail chain if it was entered in error — otherwise revenue may double-count.

## Script

`scripts/moysklad-create-shakirovna-ladies-mist-commission-report-payment-20260612.js`
