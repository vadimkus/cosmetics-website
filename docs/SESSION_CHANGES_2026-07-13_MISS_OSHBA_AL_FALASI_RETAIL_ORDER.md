# Miss Oshba Al Falasi — retail order (2026-07-13)

**Customer:** Miss Oshba Al Falasi (`74b19bf8-7ec1-11f1-0a80-04c800815a08`) — **new counterparty**  
**Phone:** +971 56 717 0007  
**Ship to:** Umm Suqeim 2, Brayw street, villa 143, Dubai  

**Script:** `scripts/moysklad-create-miss-oshba-al-falasi-retail-order-invoice-demand-20260713.js --commit`

| Doc | Number | AED |
|---|---|---:|
| Sales order | **GENCardM2607130007** | 705.00 |
| Invoice | **04813** | 705.00 |
| Shipment | **06533** | 705.00 |

**Lines (retail, VAT incl.):**

| Code | Product | Qty | Price |
|---|---|---:|---:|
| 00194 | Multi Vita Radiance Serum 30ml | 1 | 330.00 |
| 00195 | Moisture Replenishing Hyaluron Serum 30ml | 1 | 330.00 |
| (service) | Excellent Delivery Dubai | 1 | 45.00 |

- [Order](https://online.moysklad.ru/app/#customerorder/edit?id=759b1316-7ec1-11f1-0a80-1b46008274c2)
- [Invoice 04813](https://online.moysklad.ru/app/#invoiceout/edit?id=75d885ea-7ec1-11f1-0a80-04c800815a4b)
- [Shipment 06533](https://online.moysklad.ru/app/#demand/edit?id=7685d8b8-7ec1-11f1-0a80-0c7900843edc)

**PDF:** `~/Desktop/orders/GENOSYS_Miss_Oshba_Al_Falasi_04813.pdf`

## Payment (2026-07-13)

| Doc | Number | AED |
|---|---|---:|
| Payment in | **05930** | 705.00 |

Linked to shipment **06533** / invoice **04813**. Order **GENCardM2607130007** → **Доставлен**.

- [Paymentin 05930](https://online.moysklad.ru/app/#paymentin/edit?id=9a1fd9b7-7ec1-11f1-0a80-137400810a08)

**Script:** `scripts/moysklad-create-miss-oshba-al-falasi-paymentin-04813-20260713.js --commit`
