# Maryna Solomatina — GENCardW2606176876 full MoySklad chain (2026-06-17)

**Customer:** Maryna Solomatina · 0521448006 · Dubai  
**Address:** Umm Al Sheif, Emirates Oasis Villas Villa 67  
**Website:** **GENCardW2606176876** · **2,801.80 AED** Stripe paid · free shipping

**Script:** `scripts/moysklad-create-maryna-solomatina-order-invoice-demand-paymentin-20260617.js --commit`

## Context

Auto web sync created a **partial** MoySklad order (500 AED — peeling + free masks only; beauty boxes unmapped). That order + invoice **04686** were moved to **MoySklad trash**. API cannot restore from trash — script posted a **fresh** chain with the same order name and exploded beauty-box lines.

## Documents

| Doc | Number | AED | MoySklad id |
|---|---|---:|---|
| Sales order | **GENCardW2606176876** | 2,801.80 | `efd9e4c6-6a2e-11f1-0a80-193b00149b28` |
| Invoice | **04686** | 2,801.80 | `f02632ee-6a2e-11f1-0a80-112a00148ce5` |
| Shipment | **06372** | 2,801.80 | `f11a14bb-6a2e-11f1-0a80-10040014183c` |
| Payment in | **05781** | 2,801.80 | `f1759c73-6a2e-11f1-0a80-112a00148d0d` |

Shipment **fully paid** (payedSum = 2,801.80).

## Pick list (11 lines, singles)

| Code | Qty |
|------|----:|
| 00021 Snow O₂ 180ml | 2 |
| 00022 Snow Booster 200ml | 2 |
| 00195 Hyaluron Serum 30ml | 1 |
| 54458 Hyaluron Cream 50g | 1 |
| 00191 Anti-Wrinkle Serum 30ml | 1 |
| 00190 Anti-Wrinkle Cream 50g | 1 |
| 00129 EPI Peeling Gel 100g | 2 |
| 00140 Sea Algae Mask 23g | 4 |
| 00063 Collagen Mask 23g | 6 |

Beauty-box components at retail −15%; peeling @ 250; promo masks @ 0.

## PDF

`~/Desktop/orders/GENOSYS_Maryna_Solomatina_04686.pdf`

## Website DB

`moySkladOrderId` updated to `efd9e4c6-6a2e-11f1-0a80-193b00149b28`.
