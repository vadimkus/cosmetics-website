# Consignment stock totals — live MoySklad (2026-06-08)

## Question

How much product on consignment now? Total AED at clinic price and at cost?

## Method

Read-only ledger across **65 commission contracts** (since 2020):

```text
Qty at agent = Σ Отгрузки (demand, commission contract)
             − Σ Полученные отчёты комиссионера
             − Σ Возвраты покупателей (when contract set)
```

Valuation:
- **Clinic / list:** line price from shipment/report positions, else MoySklad `salePrice` (VAT incl)
- **Cost:** MoySklad product `buyPrice`

## Totals (08 Jun 2026 ~09:37 UAE)

| Metric | Value |
|--------|------:|
| Partners with stock > 0 | **43** |
| Total units on consignment | **4,247** |
| SKU lines (sum across partners) | **1,094** |
| **Clinic list total** | **480,763.79 AED** |
| **Cost (buyPrice) total** | **130,067.77 AED** |
| Implied markup at list | 350,696.02 AED (72.9%) |

## Top partners by clinic value (list AED)

| Partner | Contract | Units | List AED | Cost AED |
|---------|----------|------:|---------:|---------:|
| First Person Palm Jumeirah | 00078 | 474 | 61,168 | 16,951 |
| Abeer Mekki | 31 | 366 | 40,154 | 11,810 |
| Shakirovna Ladies Salon | 00030 | 234 | 24,241 | 6,403 |
| Love My Body | 27 | 261 | 22,386 | 5,972 |
| Shakirovna Esthetic Clinic | 26 | 168 | 20,444 | 5,413 |
| Eclatant | 18 | 137 | 19,414 | 4,888 |
| Elite Shakirovna Salon | 21 | 127 | 16,958 | 4,537 |
| Rise Up (My Skin Story) | 00034 | 150 | 16,363 | 4,423 |
| Melanta | 14 | 115 | 16,352 | 4,466 |
| ARFI Barsha | 25 | 134 | 15,664 | 4,438 |
| Refresh Clinic | 24 | 116 | 15,228 | 4,238 |
| Iulia Beauty | 28 | 145 | 14,909 | 3,941 |

## Caveats

- **Book balance**, not physical count — unreported sales or missing agreements can skew (see consignment audit Jun 2026).
- **Warehouse stock excluded** — only goods on commission partners.
- Returns without contract link may be under-counted on returns side.
