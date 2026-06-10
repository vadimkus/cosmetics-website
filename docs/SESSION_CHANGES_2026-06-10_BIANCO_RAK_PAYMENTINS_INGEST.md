# Bianco RAK bank transfers — WhatsApp receipt ingest (2026-06-10)

**Source images:** `/Users/vadimkus/Desktop/orders/`
- `WhatsApp Image 2026-06-10 at 07.26.46.jpeg`
- `WhatsApp Image 2026-06-10 at 07.26.58.jpeg`
- `WhatsApp Image 2026-06-10 at 07.27.14.jpeg`
- `WhatsApp Image 2026-06-10 at 07.27.28.jpeg`

All: **RAK Bank instant transfer**, status **Completed**, 9 June 2026.

## Payments posted (paymentin → invoiceout)

| Payment | Amount | Sender | Invoices | Bank ref |
|---------|-------:|--------|----------|----------|
| **05739** | 1,165.00 | BIANCO LAYAN BEAUTY SALON LLC | **04513** | E2E00402606092061430 |
| **05740** | 2,099.00 | BIANCO JGE LADIES SALON LLC | **04486** | E2E00402606092060236 |
| **05741** | 2,045.00 | BIANCO BEAUTY SALON SPA LLC (Dubai Hills) | **04447** | E2E00402606092053616 |
| **05742** | 9,490.00 | BIANCO SPA FZCO (DSO/Cedre) | **04246** + **04340** + **04527** | E2E00402606092051198 |

**Total collected:** **14,799.00 AED**

Note on receipt: `INV 044866 JGE` → MoySklad invoice **04486** (2099 AED match).

DSO single transfer split across three Cedre invoices: 3000 + 2860 + 3630 = 9490.

## Links

| Payment | MoySklad |
|---------|----------|
| 05739 | https://online.moysklad.ru/app/#paymentin/edit?id=978cb685-648a-11f1-0a80-0bc5000e29b8 |
| 05740 | https://online.moysklad.ru/app/#paymentin/edit?id=98b88376-648a-11f1-0a80-0bc5000e29c9 |
| 05741 | https://online.moysklad.ru/app/#paymentin/edit?id=99f5ea7f-648a-11f1-0a80-1ba8000ecd21 |
| 05742 | https://online.moysklad.ru/app/#paymentin/edit?id=9be83efe-648a-11f1-0a80-15f3000ef6a9 |

Script: `scripts/moysklad-create-bianco-rak-paymentins-20260610.js`

## Order status update (2026-06-10)

After paymentin posted, customer orders moved **Доставлен - Ждем оплату** → **Доставлен**:

| Order | Customer | Sum |
|-------|----------|----:|
| GENCardM2605162401 | Bianco Spa FZCO (Cedre) | 3,630 |
| GENCardW2605145461 | BIANCO LAYAN | 1,165 |
| GENCardM2605096278 | BIANCO JGE | 2,099 |
| GENCardM2605018786 | Bianco Dubai Hills | 2,045 |
| CODW2604036572 | Bianco Cedre | 2,860 |
| GENCardW2603081468 | Bianco Cedre | 3,000 |
