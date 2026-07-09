# Lips for Kiss Clinic — SO + invoice + shipment (2026-07-03)

**Customer:** Lips for Kiss Clinic (`9038b70d-c52f-11f0-0a80-0bc5000a2226`)  
**Script:** `scripts/moysklad-create-lips-for-kiss-order-invoice-demand-20260703.js --commit`

## Documents

| Step | Type | Name | Sum (AED) | ID |
|------|------|------|----------:|-----|
| 1 | Customer order | **GENCardM260703LFK** | 2,990.00 | `9b01baab-76c0-11f1-0a80-0c640014a1a7` |
| 2 | Invoice | **04759** | 2,990.00 | `9ca017c5-76c0-11f1-0a80-10320015362e` |
| 3 | Shipment | **06467** | 2,990.00 | `9d907a74-76c0-11f1-0a80-1148001517bf` |

- [Order](https://online.moysklad.ru/app/#customerorder/edit?id=9b01baab-76c0-11f1-0a80-0c640014a1a7)
- [Invoice 04759](https://online.moysklad.ru/app/#invoiceout/edit?id=9ca017c5-76c0-11f1-0a80-10320015362e)
- [Shipment 06467](https://online.moysklad.ru/app/#demand/edit?id=9d907a74-76c0-11f1-0a80-1148001517bf)

## Lines @ clinic list (VAT incl.)

| Code | Product | Qty | Unit AED | Line AED |
|------|---------|----:|---------:|---------:|
| `54458` | Moisture Replenishing Hyaluron Cream 50g | 5 | 145.00 | 725.00 |
| `00041` | Multi Sun Cream SPF40/PA++ 40g | 5 | 105.00 | 525.00 |
| `00122` | Multi-Vita Radiance Cream 50g | 2 | 145.00 | 290.00 |
| `00021` | Snow O₂ Cleanser 180ml | 5 | 165.00 | 825.00 |
| `54457` | Ultra Shield Sun Cream SPF50 50g | 5 | 125.00 | 625.00 |
| | **TOTAL** | **22** | | **2,990.00** |

## PDF

`~/Desktop/orders/GENOSYS_Lips_for_Kiss_04759.pdf` (Genosys_Invoice_Legal_TAX)

## Payment (2026-07-03)

| Doc | Number | Sum | Status |
|-----|--------|----:|--------|
| Payment in | **05873** | 2,990.00 | posted |
| Invoice **04759** | | | paid ✓ |
| Shipment **06467** | | | paid ✓ |
| Order **GENCardM260703LFK** | | | **Доставлен** ✓ |

- [Paymentin 05873](https://online.moysklad.ru/app/#paymentin/edit?id=a48e960e-76c1-11f1-0a80-0d9f0014a303)

**Script:** `scripts/moysklad-create-lips-for-kiss-paymentin-04759-20260703.js --commit`
