# MoySklad customer balance audit (2026-06-11)

**As of:** 2026-06-26 · **Runtime:** 60.5s

## Method

- **Cash settlement balance** = Σ (`payedSum` − `sum`) on `invoiceout` + `commissionreportin` + Σ (`sum` − `payedSum`) on **retail** `salesreturn` (no contract)
- **Positive** → Genosys overpaid / owes customer (real cash liability)
- **Negative** → customer owes Genosys
- **Consignment отгрузки** (demand with contract) are **excluded** — UI shows **Не оплачено** but payment is via commission report
- **Consignment salesreturns** (return with contract) are **excluded** from the cash balance — physical stock came back; it nets against the отгрузка, it is **not** a cash refund. Tracked separately below.

## Summary

| Metric | Count |
|--------|------:|
| Counterparties with receivable activity | 944 |
| **We owe customer** (overpaid, balance > 1 AED) | **0** |
| Customer owes us (balance < −1 AED) | 21 |
| Consignment customers with unpaid отгрузки (UI only) | 67 |
| Consignment customers with return credit (stock, not cash) | 42 |
| Consignment return credit total (excluded from cash) | 217538.00 AED |
| Documents with payedSum > sum | 0 |
| Open retail AR (invoice+shipment both unpaid — clears on payment) | 23 |

## Interpretation

If MoySklad shows **"we owe the customer"** on a **consignment salon**, it is usually the **отгрузка** marked unpaid — that is **normal**; settlement is on the **commission report**, not each shipment.

**True mistakes to fix:**
1. `payedSum > sum` on invoice / report (real overpayment)
2. Unpaid **commission report** with no matching payment (customer owes you — collect)

**NOT an error:** invoice + shipment both unpaid for the same retail sale. In this account a
payment clears **both** documents together (verified 2026-06-26: 12/12 recent paid sales had
invoice PAID = shipment PAID). These are just **open receivables awaiting payment** and will
self-clear. Do not void them.

## We owe customer — real cash liability (retail overpay / retail return)

_None > 1 AED._

## Consignment return credit (stock came back — NOT cash owed)

These show «мы должны» in MoySklad only because a `salesreturn` was posted on a consignment contract (goods physically returned). They net against the отгрузка and are **not** a cash refund. Clear via Взаимозачёт if you want the UI balance to zero; never refund cash, never void the return.

- **X BEAUTY CONSULTING - F.Z.C** — 18095.00 AED return credit (cash balance -2000.00 AED)
- **HIDE MEDICAL CENTER L.L.C** — 12836.00 AED return credit (cash balance 0.00 AED)
- **LOES BEAUTY SALON L.L.C** — 12511.00 AED return credit (cash balance 0.00 AED)
- **Allure** — 10924.00 AED return credit (cash balance -275.00 AED)
- **Brow And Beauty Dubai** — 10815.00 AED return credit (cash balance -180.00 AED)
- **Platinum Black** — 9393.00 AED return credit (cash balance -513.00 AED)
- **Bloom Aesthetic and Laser Clinic** — 9183.00 AED return credit (cash balance 0.00 AED)
- **Ilmira Hairulina** — 8907.00 AED return credit (cash balance -7772.00 AED)
- **She Beauty Salon** — 7859.00 AED return credit (cash balance 0.00 AED)
- **ANYACOSM Medical Clinic LLC** — 7630.00 AED return credit (cash balance 0.00 AED)
- **GOCOSMO BEAUTY SALON** — 7206.00 AED return credit (cash balance 0.00 AED)
- **The Beauty House By Takhmina Usmani** — 6738.00 AED return credit (cash balance 0.00 AED)
- **Modern Medicine Medical Center** — 6655.00 AED return credit (cash balance 0.00 AED)
- **The Cure FZ-LLC** — 6173.00 AED return credit (cash balance 0.00 AED)
- **Face Retreat Ladies Salon LLC** — 5991.00 AED return credit (cash balance 0.00 AED)
- **ICEQUEEN GRAND CRYO WELLNESS** — 5533.00 AED return credit (cash balance 0.00 AED)
- **First Person Ladies Salon (Marina)** — 5368.00 AED return credit (cash balance 0.00 AED)
- **Dr Yevhenia Zykova Clinic L.L.C** — 5116.00 AED return credit (cash balance 0.00 AED)
- **MARAPO Beauty Salon (old)** — 4995.00 AED return credit (cash balance 0.00 AED)
- **Lafamilia Medical Center LLC** — 4824.00 AED return credit (cash balance 0.00 AED)
- **My Skin Story Perfumes and Cosmetics Trading LLC** — 4542.00 AED return credit (cash balance -3020.00 AED)
- **Tatiana Aniskina Nail Master** — 4110.00 AED return credit (cash balance -90.00 AED)
- **Eco Lounge DMCC** — 3975.00 AED return credit (cash balance 0.00 AED)
- **Anishyna Nataliia** — 3916.00 AED return credit (cash balance -490.00 AED)
- **Shakirovna Ladies Beauty Saloon** — 3705.00 AED return credit (cash balance 0.00 AED)
- **Bianco Spa FZCO (Cedre Center)** — 3565.00 AED return credit (cash balance -4459.00 AED)
- **Zheteyeva Ella** — 3525.00 AED return credit (cash balance 0.00 AED)
- **Hortman Pharmacy L.L.C.** — 3462.00 AED return credit (cash balance 0.00 AED)
- **Natalia Nesteruk Cosmetologist** — 2708.00 AED return credit (cash balance 0.00 AED)
- **Dr. Janna** — 2656.00 AED return credit (cash balance 0.00 AED)
- **Ulbossyn Saparbayeva** — 2480.00 AED return credit (cash balance 0.00 AED)
- **Ksenia Torch** — 1975.00 AED return credit (cash balance 0.00 AED)
- **First Person Ladies Salon LLC (Palm Jumeirah)** — 1600.00 AED return credit (cash balance 0.00 AED)
- **Yula Beauty Salon LLC** — 1555.00 AED return credit (cash balance 0.00 AED)
- **Haleta Inna Persona Lab** — 1450.00 AED return credit (cash balance 0.00 AED)
- **Serene Skin Beauty Salon LLC** — 1405.00 AED return credit (cash balance 0.00 AED)
- **Bianco Beauty Salon SPA (Dubai Hills)** — 1255.00 AED return credit (cash balance -1532.00 AED)
- **Yelizaveta Nabieva Cosmetologist** — 1205.00 AED return credit (cash balance 0.00 AED)
- **KIND CARE MEDICAL CENTER L.L.C** — 590.00 AED return credit (cash balance 0.00 AED)
- **Reyza** — 537.00 AED return credit (cash balance 0.00 AED)
- **Miss Yulia Ryabchenko** — 360.00 AED return credit (cash balance 0.00 AED)
- **FACE ROOM BEAUTY SALON CO** — 210.00 AED return credit (cash balance 0.00 AED)

## Top 25 — customer owes us

| Customer | Balance AED | Unpaid reports/invoices |
|----------|------------:|------------------------|
| Brau Ladies Salon LLC | -12630.00 | see JSON |
| Ilmira Hairulina | -7772.00 | see JSON |
| HORTMAN CLINICS 2 L.L.C | -6300.00 | see JSON |
| Mediclinic Clinics Investment LLC | -4560.00 | see JSON |
| Bianco Spa FZCO (Cedre Center) | -4459.00 | see JSON |
| Fayy Health FZCO | -3800.00 | see JSON |
| My Skin Story Perfumes and Cosmetics Trading LLC | -3020.00 | see JSON |
| BIANCO JGE Ladies Salon L.L.C | -2464.00 | see JSON |
| X BEAUTY CONSULTING - F.Z.C | -2000.00 | see JSON |
| Bianco Beauty Salon SPA (Dubai Hills) | -1532.00 | see JSON |
| Milena AESTHETIC CLINIC LLC | -540.00 | see JSON |
| Platinum Black | -513.00 | see JSON |
| Anishyna Nataliia | -490.00 | see JSON |
| Allure | -275.00 | see JSON |
| BIANCO JGE GENTS SALON L.L.C | -215.00 | see JSON |
| Brow And Beauty Dubai | -180.00 | see JSON |
| ABEER MEKKI BEAUTY LADIES CENTER - L.L.C - S.P.C | -165.50 | see JSON |
| Tatiana Aniskina Nail Master | -90.00 | see JSON |
| Roksolana Tychkivska | -72.00 | see JSON |
| Miss Alina Melnik | -72.00 | see JSON |
| First Person Ladies Salon (Downtown) | -18.00 | see JSON |

## Open retail AR — invoice + shipment both unpaid (NOT an error)

A payment in this account clears **both** the invoice and the shipment together, so these are simply **open receivables awaiting payment** — they self-clear when the customer pays. Do **not** void them.

- **Mediclinic Clinics Investment LLC** — invoice 04614 + shipment 06289 @ 1900.00 AED
- **Brau Ladies Salon LLC** — invoice 04578 + shipment 06232 @ 1520.00 AED
- **Brau Ladies Salon LLC** — invoice 04453 + shipment 06069 @ 760.00 AED
- **Brau Ladies Salon LLC** — invoice 04597 + shipment 06262 @ 760.00 AED
- **Milena AESTHETIC CLINIC LLC** — invoice 04523 + shipment 06169 @ 540.00 AED
- **Mediclinic Clinics Investment LLC** — invoice 04330 + shipment 05916 @ 1900.00 AED
- **Brau Ladies Salon LLC** — invoice 04476 + shipment 06104 @ 1200.00 AED
- **Fayy Health FZCO** — invoice 04511 + shipment 06153 @ 3800.00 AED
- **Brau Ladies Salon LLC** — invoice 04714 + shipment 06403 @ 760.00 AED
- **Bianco Beauty Salon SPA (Dubai Hills)** — invoice 03779 + shipment 05112 @ 510.00 AED
- **Brau Ladies Salon LLC** — invoice 04542 + shipment 06192 @ 760.00 AED
- **Brau Ladies Salon LLC** — invoice 04482 + shipment 06113 @ 760.00 AED
- **Brau Ladies Salon LLC** — invoice 04683 + shipment 06369 @ 1060.00 AED
- **Mediclinic Clinics Investment LLC** — invoice 04211 + shipment 05753 @ 760.00 AED
- **Brau Ladies Salon LLC** — invoice 04483 + shipment 06114 @ 380.00 AED
- **Brau Ladies Salon LLC** — invoice 04452 + shipment 06068 @ 380.00 AED
- **Brau Ladies Salon LLC** — invoice 04639 + shipment 06317 @ 950.00 AED
- **Brau Ladies Salon LLC** — invoice 04640 + shipment 06318 @ 950.00 AED
- **Brau Ladies Salon LLC** — invoice 04641 + shipment 06319 @ 380.00 AED
- **HORTMAN CLINICS 2 L.L.C** — invoice 04682 + shipment 06368 @ 6300.00 AED
- **Brau Ladies Salon LLC** — invoice 04543 + shipment 06193 @ 570.00 AED
- **Brau Ladies Salon LLC** — invoice 04426 + shipment 06038 @ 380.00 AED
- **Brau Ladies Salon LLC** — invoice 04502 + shipment 06145 @ 1060.00 AED

## Overpaid documents (payedSum > sum)

_None found._

Full JSON: `docs/MOYSKLAD_CUSTOMER_BALANCE_AUDIT_2026-06-11.json`

## Script

`scripts/moysklad-audit-customer-balances-20260611.js`
