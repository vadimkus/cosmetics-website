# Brau Ladies Salon LLC — split peptide orders Abu Dhabi + Jumeirah (2026-07-13)

**Customer:** Brau Ladies Salon LLC (`ce7c406d-dadf-11ee-0a80-130f00597aa2`)  
**Script:** `scripts/moysklad-create-brau-ladies-split-peptide-orders-20260713.js --commit`

Two separate SO → invoice → shipment chains — **identical lines** (peptide ×20 + free delivery), different location comments.

## Order 1 — Brau office: Abu Dhabi

| Doc | Number | AED |
|---|---|---:|
| Sales order | **GENCardM260713BRAUADUP20** | 760.00 |
| Invoice | **04811** | 760.00 |
| Shipment | **06531** | 760.00 |

**Lines:**
- Peptide Gel Mask 39g `00012` ×20 @ **38.00**
- Excellent Delivery Dubai ×1 @ 45.00 — **100% discount (free)**

**Comment:** Brau office: Abu Dhabi

- [Order](https://online.moysklad.ru/app/#customerorder/edit?id=8300faab-7ebd-11f1-0a80-11570080f58b)
- [Invoice 04811](https://online.moysklad.ru/app/#invoiceout/edit?id=834812d0-7ebd-11f1-0a80-1b46008161b6)
- [Shipment 06531](https://online.moysklad.ru/app/#demand/edit?id=83e6dcee-7ebd-11f1-0a80-154b0083dd05)

**PDF:** `~/Desktop/orders/GENOSYS_Brau_Ladies_ADU_04811.pdf`

## Order 2 — Brau Jumeirah branch

| Doc | Number | AED |
|---|---|---:|
| Sales order | **GENCardM260713BRAUJBRP20** | 760.00 |
| Invoice | **04812** | 760.00 |
| Shipment | **06532** | 760.00 |

**Lines:**
- Peptide Gel Mask 39g `00012` ×20 @ **38.00**
- Excellent Delivery Dubai ×1 @ 45.00 — **100% discount (free)**

**Comment:** Brau Jumeirah branch

- [Order](https://online.moysklad.ru/app/#customerorder/edit?id=abfa3390-7ebd-11f1-0a80-0ee10080b193)
- [Invoice 04812](https://online.moysklad.ru/app/#invoiceout/edit?id=ac320b8a-7ebd-11f1-0a80-08020080aa5a)
- [Shipment 06532](https://online.moysklad.ru/app/#demand/edit?id=acd92dd1-7ebd-11f1-0a80-154b0083e448)

**PDF:** `~/Desktop/orders/GENOSYS_Brau_Ladies_JBR_04812.pdf`

## Totals

| Location | AED |
|---|---:|
| Abu Dhabi (Peptide ×20) | 760.00 |
| Jumeirah (Peptide ×20) | 760.00 |
| **Combined** | **1,520.00** |

No payment in posted.
