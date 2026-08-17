# Miss Alena Zhakhovlska — paid retail order — 2026-08-11

**Counterparty:** `debfa6ef-1595-11ed-0a80-010b001b4dc3`  
**Name updated:** Miss Alena Zhahlovska → **Miss Alena Zhakhovlska**  
**Phone:** +971582830294  
**Address updated:** Marina Terrace, app 166 → **Platinum Residence 1, DSO, apartment 411, Dubai**  
**Fix 2026-08-11 evening:** old address was stuck in counterparty `actualAddressFull.addInfo` (dual address on invoice). Cleared `addInfo`; invoice **04918** PDF reissued with single address only.

## Pricing

Retail VAT-incl. **15%** on products; delivery **no discount**.

| Code | Product | Qty | Retail | Disc | Net |
|------|---------|-----|--------|------|-----|
| `00022` | Snow Booster Toner 200ml | 1 | 260 | 15% | 221.00 |
| `00040` | Intensive Blemish Balm Cream 50g | 1 | 250 | 15% | 212.50 |
| — | Excellent Delivery Dubai | 1 | 45 | 0% | 45.00 |

**Total: 478.50 AED** (paid)

## Documents

| Doc | Number |
|-----|--------|
| SO | `GENCardM2608110294` |
| Invoice | **04918** |
| Shipment | **06667** |
| Payment in | **06067** |

**PDF:** `~/Desktop/orders/GENOSYS_Miss_Alena_Zhakhovlska_04918.pdf`

## Script

```bash
node --import dotenv/config scripts/moysklad-create-miss-alena-zhakhovlska-order-invoice-demand-paymentin-20260811.js --commit
```
