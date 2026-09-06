# Olga Lysenko / GENCardM2609016564 — shipped to wrong MoySklad card (2026-09-01)

**Website order is correct.** MoySklad customer card used for the print was a different Olga.

## Website (right)

`GENCardM2609016564` / `#tealpeys` · stripe paid · 315 AED · beige cushion  
Olga Lysenko · olgalita888@gmail.com · +971 58 560 2388  
**Dubai Studio City, Laya Heights, apartment 331**

Only website order for this email.

## What MoySklad had

Push matched **by name** `Olga Lysenko` → 2020 card `6315990c-228d-11eb-0a80-044e002c6351`

| | Wrong card (printed) | Real customer |
|---|---|---|
| Name | Olga Lysenko | **Miss Olga** `cadebb81-69e1-11ef-0a80-0d27000f91c7` |
| Phone | +971 55 312 2896 | **+971 58 560 2388** |
| Email | olgalitta88@gmail.com | *(none, now set to olgalita888@gmail.com)* |
| Address | **Arjan, Miraclz by Danube, apt 1011** | **Studio City, Laya Heights, apt 331** |
| Last order | 2023 | 2024–2026 same building |

SO **GENCardM2609016564** and SHIP **06777** already had Studio City on `shipmentAddressFull`.  
INV **05005** had **no** delivery address, so the print fell back to the customer card → Arjan.

Phone filter failed because website sends `+971585602388` and Miss Olga is stored as `+971 58 560 2388`. Then name fallback hit the 2020 card.

## Fixed

- SO / INV **05005** / SHIP **06777** / paymentin **06153** → Miss Olga
- Miss Olga email set to olgalita888@gmail.com
- Invoice PDF: `~/Desktop/orders/GENOSYS_Olga_Lysenko_05005.pdf`
- Push matcher: normalized last-9 phone digits; **no name-only match** (`lib/moysklad.ts`)

2020 Arjan card left untouched.

## Courier

Redirect to **Dubai Studio City, Laya Heights, apartment 331**, +971 58 560 2388. Not Arjan.
