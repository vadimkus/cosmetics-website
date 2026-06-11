# MoySklad customer balance audit (2026-06-11)

**As of:** 2026-06-11 · **Runtime:** 67.0s

## Method

- **Settlement balance** = Σ (`payedSum` − `sum`) on `invoiceout` + `commissionreportin`
- **Positive** → Genosys overpaid / owes customer
- **Negative** → customer owes Genosys
- **Consignment отгрузки** (demand with contract) are **excluded** from settlement — they often show **Не оплачено** in UI; payment is via commission report

## Summary

| Metric | Count |
|--------|------:|
| Counterparties with receivable activity | 924 |
| **We owe customer** (overpaid, balance > 1 AED) | **39** |
| Customer owes us (balance < −1 AED) | 14 |
| Consignment customers with unpaid отгрузки (UI only) | 67 |
| Documents with payedSum > sum | 5 |
| Invoice + shipment both unpaid (duplicate risk) | 20 |

## Interpretation

If MoySklad shows **"we owe the customer"** on a **consignment salon**, it is usually the **отгрузка** marked unpaid — that is **normal**; settlement is on the **commission report**, not each shipment.

**True mistakes to fix:**
1. `payedSum > sum` on invoice / report (real overpayment)
2. Same retail sale unpaid on **both** invoice **and** shipment (double debt)
3. Unpaid **commission report** with no matching payment (customer owes you — collect)

## We owe customer (overpaid)

- **X BEAUTY CONSULTING - F.Z.C** — 16095.00 AED
- **HIDE MEDICAL CENTER L.L.C** — 12836.00 AED
- **LOES BEAUTY SALON L.L.C** — 12511.00 AED
- **Allure** — 10649.00 AED
- **Brow And Beauty Dubai** — 10635.00 AED
- **Bloom Aesthetic and Laser Clinic** — 9183.00 AED
- **Platinum Black** — 8880.00 AED
- **She Beauty Salon** — 7859.00 AED
- **ANYACOSM Medical Clinic LLC** — 7630.00 AED
- **The Beauty House By Takhmina Usmani** — 6738.00 AED
- **Modern Medicine Medical Center** — 6655.00 AED
- **The Cure FZ-LLC** — 6173.00 AED
- **Face Retreat Ladies Salon LLC** — 5991.00 AED
- **ICEQUEEN GRAND CRYO WELLNESS** — 5533.00 AED
- **Dr Yevhenia Zykova Clinic L.L.C** — 5116.00 AED
- **MARAPO Beauty Salon (old)** — 4995.00 AED
- **Lafamilia Medical Center LLC** — 4824.00 AED
- **Tatiana Aniskina Nail Master** — 4020.00 AED
- **Eco Lounge DMCC** — 3975.00 AED
- **Zheteyeva Ella** — 3525.00 AED
- **Hortman Pharmacy L.L.C.** — 3462.00 AED
- **Anishyna Nataliia** — 3426.00 AED
- **Natalia Nesteruk Cosmetologist** — 2708.00 AED
- **Dr. Janna** — 2656.00 AED
- **Ulbossyn Saparbayeva** — 2480.00 AED
- **My Skin Story Perfumes and Cosmetics Trading LLC** — 2362.00 AED
- **Ksenia Torch** — 1975.00 AED
- **First Person Ladies Salon LLC (Palm Jumeirah)** — 1600.00 AED
- **Yula Beauty Salon LLC** — 1555.00 AED
- **Haleta Inna Persona Lab** — 1450.00 AED
- **Serene Skin Beauty Salon LLC** — 1405.00 AED
- **Yelizaveta Nabieva Cosmetologist** — 1205.00 AED
- **Ilmira Hairulina** — 1135.00 AED
- **KIND CARE MEDICAL CENTER L.L.C** — 590.00 AED
- **Reyza** — 537.00 AED
- **Miss Yulia Ryabchenko** — 360.00 AED
- **FACE ROOM BEAUTY SALON CO** — 210.00 AED
- **Miss Angelina Tarasova** — 54.00 AED
- **Marapo Beauty Salon, The Face Only BlueWaters** — 30.00 AED

## Top 25 — customer owes us

| Customer | Balance AED | Unpaid reports/invoices |
|----------|------------:|------------------------|
| First Person Ladies Salon (Marina) | -18401.00 | see JSON |
| Brau Ladies Salon LLC | -10810.00 | see JSON |
| Mediclinic Clinics Investment LLC | -4560.00 | see JSON |
| Fayy Health FZCO | -3800.00 | see JSON |
| GOCOSMO BEAUTY SALON | -2509.00 | see JSON |
| BIANCO JGE Ladies Salon L.L.C | -2464.00 | see JSON |
| Bianco Spa FZCO (Cedre Center) | -894.00 | see JSON |
| Milena AESTHETIC CLINIC LLC | -540.00 | see JSON |
| Bianco Beauty Salon SPA (Dubai Hills) | -277.00 | see JSON |
| BIANCO JGE GENTS SALON L.L.C | -215.00 | see JSON |
| Shakirovna Ladies Beauty Saloon | -168.00 | see JSON |
| Roksolana Tychkivska | -72.00 | see JSON |
| Miss Alina Melnik | -72.00 | see JSON |
| First Person Ladies Salon (Downtown) | -18.00 | see JSON |

## Duplicate invoice + shipment (both unpaid)

- **Mediclinic Clinics Investment LLC** — invoice 04614 + shipment 06289 @ 1900.00 AED
- **Brau Ladies Salon LLC** — invoice 04578 + shipment 06232 @ 1520.00 AED
- **Brau Ladies Salon LLC** — invoice 04453 + shipment 06069 @ 760.00 AED
- **Brau Ladies Salon LLC** — invoice 04597 + shipment 06262 @ 760.00 AED
- **Milena AESTHETIC CLINIC LLC** — invoice 04523 + shipment 06169 @ 540.00 AED
- **Mediclinic Clinics Investment LLC** — invoice 04330 + shipment 05916 @ 1900.00 AED
- **Brau Ladies Salon LLC** — invoice 04476 + shipment 06104 @ 1200.00 AED
- **Fayy Health FZCO** — invoice 04511 + shipment 06153 @ 3800.00 AED
- **Bianco Beauty Salon SPA (Dubai Hills)** — invoice 03779 + shipment 05112 @ 510.00 AED
- **Brau Ladies Salon LLC** — invoice 04542 + shipment 06192 @ 760.00 AED
- **Brau Ladies Salon LLC** — invoice 04482 + shipment 06113 @ 760.00 AED
- **Mediclinic Clinics Investment LLC** — invoice 04211 + shipment 05753 @ 760.00 AED
- **Brau Ladies Salon LLC** — invoice 04483 + shipment 06114 @ 380.00 AED
- **Brau Ladies Salon LLC** — invoice 04452 + shipment 06068 @ 380.00 AED
- **Brau Ladies Salon LLC** — invoice 04639 + shipment 06317 @ 950.00 AED
- **Brau Ladies Salon LLC** — invoice 04640 + shipment 06318 @ 950.00 AED
- **Brau Ladies Salon LLC** — invoice 04641 + shipment 06319 @ 380.00 AED
- **Brau Ladies Salon LLC** — invoice 04543 + shipment 06193 @ 570.00 AED
- **Brau Ladies Salon LLC** — invoice 04426 + shipment 06038 @ 380.00 AED
- **Brau Ladies Salon LLC** — invoice 04502 + shipment 06145 @ 1060.00 AED

## Overpaid documents (payedSum > sum)

- invoiceout **04044** (undefined) — overpaid 30.00 AED
- invoiceout **03533** (undefined) — overpaid 54.00 AED
- invoiceout **02184** (undefined) — overpaid 165.00 AED
- demand **02790** (undefined) — overpaid 165.00 AED
- commissionreportin **01231** (undefined) — overpaid 840.00 AED

Full JSON: `docs/MOYSKLAD_CUSTOMER_BALANCE_AUDIT_2026-06-11.json`

## Script

`scripts/moysklad-audit-customer-balances-20260611.js`
