# Admin Shakirovna — Snow O₂ + PC Cream (2026-09-01)

**Customer:** Admin Shakirovna Salon `8619c8a7-eb46-11ed-0a80-00cb00846a48`  
**Script:** `scripts/moysklad-create-admin-shakirovna-snow-pc-cream-20260901.js --commit`

Clinic list. SO → INV → SHIP (invoice-only). Paid 2 Sep: paymentin **06169**. SO **Доставлен**. Delivery free.

WhatsApp: Snow O₂ box (no size on pack → **180ml**) + Intensive Problem Control Cream **50ml**.

| Line | Qty | Unit | Sum |
|------|----:|-----:|----:|
| 00021 Snow O₂ Cleanser 180ml | 1 | 165 | 165 |
| 00035 Intensive Problem Control Cream 50g | 1 | 145 | 145 |
| Delivery Dubai | 1 | 45 @ 100% | 0 |
| **Total** | | | **310 AED** |

| Doc | Number | Sum | ID |
|-----|--------|----:|----|
| SO | **GENCardM260901SHKSPC** | 310 | `d754a5fb-a61b-11f1-0a80-137500459a1f` |
| Invoice | **05008** | 310 paid | `d7aecfad-a61b-11f1-0a80-137500459a5f` |
| Shipment | **06781** | 310 paid | `d935de9f-a61b-11f1-0a80-08990047f9e1` |
| Paymentin | **06169** | 310 @ SHIP | `5f36d554-a67b-11f1-0a80-0fbe001358df` |

Ship: Marina Wharf 1, Basement 1, Salon Shakirovna, Dubai (`addInfo` empty).

PDF: `~/Desktop/orders/GENOSYS_Admin_Shakirovna_05008.pdf`  
Not printed.

## Paymentin (2026-09-02)

Vadim: screenshot of SO **GENCardM260901SHKSPC** + **payment in**.

Script: `scripts/moysklad-create-admin-shakirovna-paymentin-05008-20260902.js --commit`

Paymentin **06169** linked to SHIP **06781**. Invoice and shipment `payedSum` 310/310. SO → **Доставлен**.
