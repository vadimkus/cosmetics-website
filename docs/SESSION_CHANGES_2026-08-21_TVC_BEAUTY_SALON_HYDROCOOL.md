# TVC Beauty Salon — Hydro Cool Modeling Mask (2026-08-21)

New customer from Google listing. Clinic list. Delivery free. Unpaid.

| Field | Value |
|-------|--------|
| Customer | **TVC Beauty Salon** `f50e0d33-9d68-11f1-0a80-05a90031c4db` |
| Phone | +971 56 501 0090 |
| Ship | Bahar 4, The Walk, Jumeirah Beach Residence, Dubai (`addInfo` empty) |
| License / TRN | none on file |

| Doc | Number | Sum | Status |
|-----|--------|----:|--------|
| Order | **GENCardM260821TVC** | 300.00 | Доставлен - Ждем оплату |
| Invoice | **04961** | 300.00 | unpaid |
| Shipment | **06723** | 300.00 | unpaid |

| Code | Product | Qty | Price | Net |
|------|---------|----:|------:|----:|
| 00013 | Hydro Cool Modeling Mask 1kg | 1 | 300 | 300.00 |
| — | Excellent Delivery Dubai | 1 | 45 | 0.00 |

Demand invoice-only. Legal_TAX PDF. Not printed.

PDF: `~/Desktop/orders/GENOSYS_TVC_Beauty_Salon_04961.pdf`

Script: `scripts/moysklad-create-tvc-beauty-salon-hydrocool-20260821.js --commit`

## Update — DET license + reissue 04961

Face Room layout from commercial license (print 01/07/2026).

| Field | Value |
|-------|--------|
| Legal name | **T V C BEAUTY SALON L.L.C** |
| License | **1177343** (email + fax) |
| DCCI | 456376 |
| Register | 1961372 |
| Owner / manager | Tatiana Vasileva (100%) |
| Legal address | Office No. P30a, Real Estate Investment Free Zone LLC, Dubai Marina |
| Salon / ship | Bahar 4, The Walk, Jumeirah Beach Residence |
| Contact email | tvc.beauty.salon@gmail.com (description only) |
| License mobile | +971 50 494 5613 |
| Salon phone | +971 56 501 0090 (kept) |
| VAT TRN | none on license |

Invoice **04961** re-exported Legal_TAX. Not printed.

Script: `scripts/moysklad-update-tvc-license-reissue-04961-20260821.js --commit`

## Update — paymentin 21 Aug 2026

| Doc | Number | Sum | Status |
|-----|--------|----:|--------|
| Paymentin | **06107** | 300 | posted |
| Order | **GENCardM260821TVC** | 300 | **Доставлен** |
| Invoice | **04961** | 300 | paid |
| Shipment | **06723** | 300 | paid |

https://online.moysklad.ru/app/#paymentin/edit?id=dd9800d3-9d74-11f1-0a80-16060034f23a

Script: `scripts/moysklad-create-tvc-paymentin-04961-20260821.js --commit`
