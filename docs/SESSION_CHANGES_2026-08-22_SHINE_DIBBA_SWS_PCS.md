# Shine Dibba — SWS ×20 + PCS + Snow 500 + toner + EPI (2026-08-22)

**Customer:** SHINE MEDICAL CENTER LLC OPC `51c7851a-37da-11f1-0a80-148900411927`  
**Script:** `scripts/moysklad-create-shine-dibba-sws-pcs-snow-20260822.js --commit`

Clinic list. Unpaid 30 days net. Chain: SO → INV → SHIP (invoice-only). SO **Доставлен - Ждем оплату**.

SWS = **20 vials** (2 boxes). No delivery fee.

| Line | Qty | Unit | Sum |
|------|----:|-----:|----:|
| 00020 Power Solution SWS 2ml | 20 | 29 | 580 |
| 00065 Power Solution PCS 2ml | 10 | 29 | 290 |
| 00024 Snow O₂ Cleanser 500ml | 1 | 255 | 255 |
| 00183 Problem Control Toner 500ml | 1 | 245 | 245 |
| 00129 EPI Peeling Gel 100g | 1 | 125 | 125 |
| **Total** | | | **1,495 AED** |

| Doc | Number | Sum | ID |
|-----|--------|----:|----|
| SO | **GENCardM260822SHND** | 1,495 | `f97c88a7-9e1c-11f1-0a80-0bad005d2e81` |
| Invoice | **04964** | 1,495 unpaid | `f9f5a876-9e1c-11f1-0a80-08560060d098` |
| Shipment | **06726** | 1,495 | `fae3b158-9e1c-11f1-0a80-0e38005f7dc0` |

Ship: Al Rifaa, Aspin Commercial Tower, office 3801, near Dibba Hospital, Dibba Al Fujairah.

## PDFs (`~/Desktop/orders/`)

- Invoice Legal_TAX: `GENOSYS_Shine_Medical_Center_04964.pdf`
- Delivery agreement: `Delivery-Signoff-04964-SHINE-MEDICAL.pdf`  
  Reissued: delivered **22 Aug 2026** · Dibba Al Fujairah · due **22 Sep 2026**

```bash
node --import dotenv/config scripts/generate-delivery-signoff.js \
  --invoice 04964 \
  --header "$HOME/Desktop/orders/Header.png" \
  --stamp "$HOME/Desktop/orders/Stamp.png" \
  --delivered-on 2026-08-22 \
  --delivered-to "Dibba Al Fujairah" \
  --payment-days 31 \
  --out "$HOME/Desktop/orders/Delivery-Signoff-04964-SHINE-MEDICAL.pdf"
```
