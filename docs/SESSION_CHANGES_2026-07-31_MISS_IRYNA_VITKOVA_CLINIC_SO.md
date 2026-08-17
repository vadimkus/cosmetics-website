# Miss Iryna Vitkova — clinic SO (31 Jul 2026)

**Corrected:** SO was briefly created under Admin Shakirovna by mistake, then reassigned.

## Customer (new)

| Field | Value |
|-------|--------|
| Name | Miss Iryna Vitkova |
| MoySklad ID | `5a1304aa-8d07-11f1-0a80-1b8100249b98` |
| Phone | 0527447420 |
| Address | Dubai Marina, Sparkle Towers 2, apt 608 |
| Type | individual |

## Order

| Doc | Number | Sum |
|-----|--------|----:|
| Customer order | **GENCardM2607317420** | **1,725.00 AED** |

- SO only (no invoice/shipment)
- Clinic list prices
- UI: https://online.moysklad.ru/app/#customerorder/edit?id=4fb9ca08-8d05-11f1-0a80-15ef0024e490
- PDF: `~/Desktop/orders/GENOSYS_Miss_Iryna_Vitkova_GENCardM2607317420.pdf`

## Lines

| Code | Product | Qty | Unit | Line |
|------|---------|----:|-----:|-----:|
| 00145 | Problem Control Toner 200ml | 1 | 130 | 130 |
| 00029 | Problem Control Serum 30ml | 1 | 165 | 165 |
| 00044 | ND Cell Anti-Wrinkle Cream 50ml | 3 | 185 | 555 |
| 00040 | Intensive Blemish Balm Cream 50g | 4 | 125 | 500 |
| 00041 | Multi Sun Cream SPF40 40g | 2 | 105 | 210 |
| 00195 | Hyaluron Serum 30ml | 1 | 165 | 165 |
| | **TOTAL** | **12** | | **1,725** |

## Scripts

- Create (wrong agent, superseded): `scripts/moysklad-create-admin-shakirovna-clinic-so-20260731.js`
- Fix: `scripts/moysklad-reassign-so-to-miss-iryna-vitkova-20260731.js --commit`
