# Miss Valeriia Reuta — retail order (2026-07-05)

**Customer:** Miss Valeriia Reuta (`348a50f6-424a-11f1-0a80-04e30039df61`) — card renamed from **Miss Valeriya** (matched by phone **+380667188965**)  
**Phone:** +380 66 718 8965  
**Ship:** Damac Park Towers, Residential Tower A, apartment 2505, Dubai  
**Scripts:**
- `scripts/moysklad-create-valeriia-reuta-retail-order-invoice-demand-20260705.js --commit`
- `scripts/moysklad-update-valeriia-reuta-paymentin-04770-20260705.js --commit` — rename + address + paymentin

## Documents

| Doc | Number | Amount |
|-----|--------|-------:|
| Sales order | GENCardM2607058965 | 1,377.00 |
| Invoice | **04770** | 1,377.00 |
| Shipment | **06481** | 1,377.00 |
| Paymentin | **05891** | 1,377.00 |

- [Order](https://online.moysklad.ru/app/#customerorder/edit?id=504f8e2e-7887-11f1-0a80-0d9f005f3e12)
- [Invoice 04770](https://online.moysklad.ru/app/#invoiceout/edit?id=508f25ac-7887-11f1-0a80-103200615692)
- [Shipment 06481](https://online.moysklad.ru/app/#demand/edit?id=512dbe15-7887-11f1-0a80-1032006156a7)
- [Paymentin 05891](https://online.moysklad.ru/app/#paymentin/edit?id=cb13f1f7-7887-11f1-0a80-0c64005f98d4)

**Order status:** Доставлен (paid in full)

## Lines (retail, VAT incl.)

| Code | Product | Qty | List | Disc | Line |
|------|---------|----:|-----:|-----:|-----:|
| `00021` | Snow O₂ Cleanser 180ml | 1 | 330 | 10% | 297.00 |
| `00022` | Snow Booster Toner 200ml | 1 | 260 | 10% | 234.00 |
| `54458` | Moisture Replenishing Hyaluron Cream 50g | 1 | 290 | 10% | 261.00 |
| `54470` | BIO-MESO PDRN Expert Ampoule 60000 | 1 | 600 | 10% | 540.00 |
| *(service)* | Excellent Delivery Dubai | 1 | 45 | — | 45.00 |
| | | | **1,480** | **−148** | **1,377.00** |

Subtotal after 10%: **1,332 AED** + delivery **45 AED** = **1,377 AED**.

## PDF

Retail template → `~/Desktop/orders/GENOSYS_Valeriia_Reuta_04770.pdf`

Printed **2026-07-05** — `lp -o orientation-requested=4` (landscape) → EPSON_L3260_Series

## Counterparty update (2026-07-05)

| Field | Was | Now |
|-------|-----|-----|
| Name | Miss Valeriya | **Miss Valeriia Reuta** |
| Address | Damac Part Towers, Residential Tower A, app 2505 | **Damac Park Towers, Residential Tower A, apartment 2505, Dubai** |
