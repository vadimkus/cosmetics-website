# SESSION CHANGES — 2026-08-12 — NOVA MEDICAL CENTER customer + SO

## Request
Create new customer from Abu Dhabi Economic Licence + clinic SO for listed products.

## Customer
| Field | Value |
|-------|--------|
| Name | **NOVA MEDICAL CENTER** |
| ID | `02800064-9640-11f1-0a80-081e0029744b` |
| Licence | CN-1212562 (email + fax) |
| Phone | +971506914962 |
| Contact email | aljaziraenterprise@yahoo.com (in description) |
| Unified Reg | 101-2021-100040598 (legalAddressFull.comment) |
| Address | Scope Investment Building, 2nd Floor, Al Muwaiji, Al Ain |

## Sales order
| Field | Value |
|-------|--------|
| SO | **GENCardM260812NOVA** |
| Sum | **2,450 AED** |
| Status | New (SO only) |

## Lines (clinic)
| Code | Product | Qty | Unit | Sum |
|------|---------|----:|-----:|----:|
| 00024 | Snow O₂ Cleanser 500ml | 1 | 255 | 255 |
| 00025 | Snow Booster Toner 1000ml | 1 | 245 | 245 |
| 00183 | Problem Control Toner 500ml | 1 | 245 | 245 |
| 00032 | Hydro Soothing Cream 250g | 1 | 210 | 210 |
| 00036 | Problem Control Cream 250g | 1 | 210 | 210 |
| 54465 | Post Cream 100g | 1 | 220 | 220 |
| 54457 | Ultra Shield SPF50 | 1 | 125 | 125 |
| 00188 | Microbiome Mist | 1 | 80 | 80 |
| 00063 | Collagen Mask | 10 | 18 | 180 |
| 00140 | Sea Algae Mask | 10 | 18 | 180 |
| 54467 | Skin Reboot PDRN Pack | 1 | 200 | 200 |
| 00013 | Hydro Cool Modeling Mask 1kg | 1 | 300 | 300 |

## Note
First commit briefly attached SO to Skinova (false substring match). Fixed: new CP created, SO reassigned to NOVA MEDICAL CENTER. Script search hardened.

## Script
`scripts/moysklad-create-nova-medical-center-customer-order-20260812.js`

## SO PDF
`~/Desktop/orders/GENOSYS_Nova_Medical_Center_GENCardM260812NOVA.pdf`

## Update 2026-08-15 — address + VAT TRN

Face Room layout applied: `legalAddressFull.comment` is now **TRN 100255565200003** (was Unified Reg). Address → **Al Noor Complex, Al Muwaiji, Saed Bin Tahnon Al Awal St, Al Ain**. SO shipment address updated.

See `docs/SESSION_CHANGES_2026-08-15_NOVA_MEDICAL_CENTER_ADDRESS_TRN.md`.
