# Miss Alena (Shoreline) — retail 04997 — 2026-08-31

New retail customer. Paid Stripe 31 Aug. SO → INV → SHIP. Alena WhatsApp / Stripe. Not Dudareva DIFC.

| Field | Value |
|---|---|
| **Customer** | Miss Alena (Shoreline) `16f2895a-a51b-11f1-0a80-0cd600c7a2b9` |
| **Phone** | **+971 58 521 2710** |
| **Ship** | Shoreline 16, PH07, Dubai |
| **SO** | **GENCardM260831SH16** |
| **Invoice** | **04997** |
| **Shipment** | **06765** |
| **Sum** | **576.00 AED** |
| **State** | **Доставлен** (paid 31 Aug) |
| **PDF** | `~/Desktop/orders/GENOSYS_Miss_Alena_Shoreline_04997.pdf` |

| Code | Product | List | −10% |
|---|---|---:|---:|
| 00144 | Cushion #2 Beige | 300 | 270 |
| 54458 | Hyaluron Cream 50g | 290 | 261 |
| — | Delivery Dubai | 45 | 45 |
| | **Total** | | **576** |

**31 Aug evening:** paymentin **06152** / **576 AED** on SHIP **06765**. SO → **Доставлен**.

Phone added 2026-08-31 on the counterparty. Invoice PDF re-exported. Name left **Miss Alena (Shoreline)** until Vadim gives the real first name.

## Alena commission (card / Stripe)

Clinic: beige 150 + hyaluron 145 = 295. Delivery 45 ours. Do not show clinic to Alena.

Check: full margin 590 − 295 = 295; discount 590 × 10% = 59; share 295 − 59 = 236 = 576 − 340.

| Product | Retail | −10% | Alena |
|---|---:|---:|---:|
| Cushion #2 Beige | 300 | 270 | 120 |
| Hyaluron Cream 50g | 290 | 261 | 116 |
| Delivery Dubai | 45 | 45 | 0 |
| **Total** | **635** | **576** | **236** |

| | AED |
|---|---:|
| Margin before discount | 295 |
| Discount 10% | −59 |
| Her share | 236 |
| Tax 5% | −11.80 |
| Stripe 3% | −7.08 |
| **Pay Alena** | **217.12** |

WhatsApp to Alena:

```
Алена, привет. Расчёт по Shoreline (заказ 04997, Stripe):

| | List | −10% |
|---|---:|---:|
| Cushion Beige #2 | 300 | 270 |
| Hyaluron Cream 50g | 290 | 261 |
| **Товар** | **590** | **531** |
| Delivery | 45 | 45 |
| **Клиент оплатил** | | **576** |

| | AED |
|---|---:|
| Маржа до скидки | 295 |
| Скидка 10% | −59 |
| Доля | 236 |
| Налог 5% | −11.80 |
| Stripe 3% | −7.08 |
| **Итого тебе** | **217.12** |
```

Script: `scripts/moysklad-create-alena-shoreline-retail-20260831.js --commit`
