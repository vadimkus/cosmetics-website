# NOVA MEDICAL CENTER — official cheque receipt (2026-08-19)

FAB A/C Payee cheque **248360** dated **17 August 2026** for **2,700.00 AED**, drawer **NOVA MEDICAL CENTER**, payee **GENOSYS MIDDLE EAST FZ-LLC**. Matches unpaid invoice **04931**.

## Receipt

| Field | Value |
|-------|--------|
| Receipt No. | **GME-RCP-20260819-04931** |
| Receipt date | 19 August 2026 |
| Amount | **2,700.00 AED** (TWO THOUSAND SEVEN HUNDRED ONLY) |
| Cheque | **248360** · FAB Al Ain New · IBAN AE910351561323454912014 |
| Against | INV **04931** / SO **GENCardM260812NOVA** / SHIP **06687** |
| PDF | `~/Desktop/orders/GENOSYS_Nova_Medical_Center_Receipt_04931.pdf` |

GENOSYS `Header.png` full-bleed letterhead (same as other official PDFs) + company print `Stamp.png`. One A4 page. Signatory title **Manager** (not Director). Not printed.

## Paymentin (same day)

| Field | Value |
|-------|--------|
| Paymentin | **06094** |
| Amount | **2,700.00 AED** |
| Linked to | SHIP **06687** (invoice-only; no demand.customerOrder) |
| Cheque | FAB **248360** dated 17/08/2026 |
| SO after | **GENCardM260812NOVA** → **Доставлен** |
| Invoice / ship paid | 2,700 / 2,700 |

https://online.moysklad.ru/app/#paymentin/edit?id=275f2bed-9bc0-11f1-0a80-16ba00276448

Scripts:
- `scripts/generate-nova-medical-center-cheque-receipt-20260819.js`
- `scripts/moysklad-create-nova-medical-center-paymentin-04931-20260819.js --commit`
