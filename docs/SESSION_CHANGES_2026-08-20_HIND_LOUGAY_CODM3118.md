# SESSION CHANGES — 2026-08-20 — Hind Lougay CODM2608193118

**Customer:** Hind Lougay · `hlougay@gmail.com`

## Final corrected order

Hind supplied the original confirmation email. The authoritative order is the
six-line **2,320 AED COD order**, not the temporary collagen-only 18 AED version.

| Item | Website qty | MoySklad representation | Total |
|------|------------:|--------------------------|------:|
| POWER SOLUTION SWS | 1 kit | `00020` ×10 vials @ 58 | 580 |
| POWER SOLUTION HES | 1 kit | `00071` ×10 vials @ 58 | 580 |
| POWER SOLUTION PCS | 1 kit | `00065` ×10 vials @ 58 | 580 |
| POWER SOLUTION CVS | 1 kit | `00067` ×10 vials @ 58 | 580 |
| Intensive Repair Collagen Mask | 1 `_PROMO_` | `00063` ×1 @ 36, 100% discount | FREE |
| Soothing Bomb Sea Algae Mask | 1 `_PROMO_` | `00140` ×1 @ 36, 100% discount | FREE |

Subtotal / total: **2,320 AED**, VAT included **110.48 AED**, delivery free.

## MoySklad final state

| Doc | Number | Sum | Status |
|-----|--------|----:|--------|
| Order | **CODM2608193118** | 2,320 | **Ждет доставки - Наличные** |
| Invoice | **04950** | 2,320 | unpaid |
| Shipment | **06716** | 2,320 | invoice-only link |

The erroneous payment in **06101 / 18 AED** was deleted. No payment remains; cash
is due on delivery.

Re-exported PDF:
`~/Desktop/orders/GENOSYS_Hind_Lougay_04950.pdf`

## Website final state

- Order **CODM2608193118** restored with all six original lines.
- Status **PENDING**, payment **pending**, method **COD**.
- Total **2,320 AED**.
- Erroneous 18-point delivered-order reward removed; balance returned to **0**.
- Lifetime delivered-order statistics returned to **0 orders / 0 AED** until delivery.
- Existing MoySklad order UUID retained, so the website must not push it again.

## Phone correction

- Wrong/transposed: `+971507806962`
- Confirmed by Hind: **`+971507086962`**

Updated the confirmed number on the MoySklad customer, website user card, saved
address, and website order snapshot.

## Correction history / scripts

- `scripts/moysklad-amend-hind-codm3118-collagen-pay-20260820.js --commit` — mistaken 18 AED reduction.
- `scripts/delete-hind-codm3118-web-order-20260820.ts --commit` — temporary website deletion.
- `scripts/restore-hind-codm3118-phone-20260820.ts --commit` — first restoration using the incomplete order interpretation.
- `scripts/restore-hind-codm3118-original-items-20260820.ts --commit` — **final authoritative correction** from Hind's original confirmation email.

## Customer email draft

**Subject:** Update on your GENOSYS order #CODM2608193118

Dear Miss Hind,

Thank you for confirming your correct phone number.

We sincerely apologize for the confusion regarding your order. We have now restored your
original order **#CODM2608193118** in our system and updated your phone number to
**+971 50 708 6962**.

Our team will contact you tomorrow to confirm the order and arrange the delivery details
with you.

Thank you for your patience and understanding.

Warm regards,  
The GENOSYS UAE Team  
sales@genosys.ae  
+971 58 548 76 65

## Margin (20 Aug 2026)

Live MoySklad `buyPrice`. Order **2,320 AED** incl. VAT. Delivery free.

| Code | Qty | Buy | COGS |
|------|----:|----:|-----:|
| 00020 SWS | 10 | 7.82 | 78.20 |
| 00071 HES | 10 | 8.20 | 82.00 |
| 00065 PCS | 10 | 8.22 | 82.20 |
| 00067 CVS | 10 | 8.20 | 82.00 |
| 00063 collagen FOC | 1 | 2.94 | 2.94 |
| 00140 sea algae FOC | 1 | 3.60 | 3.60 |
| **Total** | | | **330.94** |

VAT **110.48**. Contribution after VAT + COGS: **1,878.58** (~85% on net).

## Update — paymentin 21 Aug 2026

COD cash received. Linked to shipment **06716** only.

| Doc | Number | Sum | Status |
|-----|--------|----:|--------|
| Paymentin | **06105** | 2,320 | posted |
| Order | **CODM2608193118** | 2,320 | **Доставлен** |
| Invoice | **04950** | 2,320 | paid |
| Shipment | **06716** | 2,320 | paid |
| Website | **CODM2608193118** | 2,320 | DELIVERED / paid |

Loyalty +2320. Clinic points 0.

https://online.moysklad.ru/app/#paymentin/edit?id=af22ea98-9d6b-11f1-0a80-0bad00325c6a

Script: `scripts/moysklad-create-hind-codm3118-paymentin-20260821.ts --commit`
