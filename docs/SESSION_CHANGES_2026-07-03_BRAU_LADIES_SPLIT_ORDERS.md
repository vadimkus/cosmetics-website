# Brau Ladies Salon LLC — split orders Abu Dhabi + Jumeirah (2026-07-03)

**Customer:** Brau Ladies Salon LLC (`ce7c406d-dadf-11ee-0a80-130f00597aa2`)  
**Script:** `scripts/moysklad-create-brau-ladies-split-orders-20260703.js --commit`

Two separate SO → invoice → shipment chains (same customer, different location comments).

## Order 1 — Brau office: Abu Dhabi

| Doc | Number | AED |
|---|---|---:|
| Sales order | **GENCardM260703BRAUADU** | 300.00 |
| Invoice | **04757** | 300.00 |
| Shipment | **06464** | 300.00 |

**Line:** Hydro Cool Modeling Mask 1kg `00013` ×1 @ **300.00**

**Comment:** Brau office: Abu Dhabi

- [Order](https://online.moysklad.ru/app/#customerorder/edit?id=3961cc87-76a9-11f1-0a80-0556000f63c6)
- [Invoice 04757](https://online.moysklad.ru/app/#invoiceout/edit?id=39d07655-76a9-11f1-0a80-04b6000eecd8)
- [Shipment 06464](https://online.moysklad.ru/app/#demand/edit?id=3ab612f3-76a9-11f1-0a80-08c2000e7ae4)

**PDF:** `~/Desktop/orders/GENOSYS_Brau_Ladies_ADU_04757.pdf` (template **Genosys_Invoice_Legal_TAX** — re-export `scripts/moysklad-export-brau-ladies-invoice-pdf-legal-tax-20260703.js`)

## Order 2 — Brau Jumeirah branch

| Doc | Number | AED |
|---|---|---:|
| Sales order | **GENCardM260703BRAUJBR** | 760.00 |
| Invoice | **04758** | 760.00 |
| Shipment | **06465** | 760.00 |

**Line:** Peptide Gel Mask 39g `00012` ×20 @ **38.00**

**Comment:** Brau Jumeirah branch

- [Order](https://online.moysklad.ru/app/#customerorder/edit?id=3d04f597-76a9-11f1-0a80-1c6d000f36c7)
- [Invoice 04758](https://online.moysklad.ru/app/#invoiceout/edit?id=3d3fb4e7-76a9-11f1-0a80-0d9f000ee817)
- [Shipment 06465](https://online.moysklad.ru/app/#demand/edit?id=3decdde6-76a9-11f1-0a80-1f21000e4e8b)

**PDF:** `~/Desktop/orders/GENOSYS_Brau_Ladies_JBR_04758.pdf` (template **Genosys_Invoice_Legal_TAX** — re-export `scripts/moysklad-export-brau-ladies-invoice-pdf-legal-tax-20260703.js`)

## Totals

| Location | AED |
|---|---:|
| Abu Dhabi (Hydro Cool) | 300.00 |
| Jumeirah (Peptide ×20) | 760.00 |
| **Combined** | **1,060.00** |

No payment in posted.
