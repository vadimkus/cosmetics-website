# NAUTICA SERVICE SRL — retail SO (Claudia Cortopassi)

**Date:** 2026-07-09  
**Contact:** Claudia Cortopassi  
**Company:** NAUTICA SERVICE SRL  
**Counterparty:** `b5b4e3e9-7bad-11f1-0a80-04c4002174ef` (created)

## Customer details

| Field | Value |
|-------|-------|
| Address | Via Michele Coppino n.343, 55049 Viareggio (LU), Italy |
| Email | yachtcare@yachtcare.it |
| Tel | +39 0584 1660833 |
| Fax | 0584-1660834 |
| P.IVA | 01618330466 |
| Codice SDI | M5UXCR1 |

## Sales order — **GENCardM260709NAUT** | 1,650.00 AED

Retail prices (MoySklad розничная), VAT incl., no discount.

| Code | Product | Qty | Retail | Line |
|------|---------|----:|-------:|-----:|
| 54461 | Skin Defender Lip & Eye Makeup Remover 200ml | 3 | 290 | 870 |
| 00022 | Snow Booster Toner 200ml | 3 | 260 | 780 |

**PDF:** `~/Desktop/orders/GENOSYS_Nautica_Service_GENCardM260709NAUT.pdf`

SO only — invoice/shipment/payment pending.

## Script

```bash
node --import dotenv/config scripts/moysklad-create-nautica-service-so-20260709.js --commit
```
