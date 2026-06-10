# DTS MG commercial invoice → MoySklad purchase order **DM GME 260430**

Source PDF: `DM GME 260430_Commercial Invoice.pdf` (invoice date 2026-05-07).

## Created document

| Field | Value |
|--------|--------|
| **PO name** | `DM GME 260430` |
| **ID** | `ff18627c-49e7-11f1-0a80-06360010760a` |
| **Sum (MoySklad)** | **48,229.18 AED** (paid lines at catalog **buyPrice**; FOC lines at **0**) |
| **Supplier** | DTSMG Genosys (`3a0a3f28-33cf-11ea-0a80-043f000b9859`) |
| **Planned delivery** | 2026-05-28 |
| **UI** | https://online.moysklad.ru/app/#purchaseorder/edit?id=ff18627c-49e7-11f1-0a80-06360010760a |

## Line logic

- **31 paid positions** matching the invoice (including GCMA02 → **500** pcs `00012`; GCMA01 → `00011` ×30).
- **GCCR48 + GCCR49** (Revita BB sample boxes): merged to **`00112` Samples Blemish Balm box ×2** — **closest catalog match**; verify on receipt.
- **7 FOC positions** (support + page-2 free goods) at **0 AED** for inbound tracking.
- **Not posted** (no matching SKU in catalog — add manually if needed):
  - **GCHR21** — HR³ Matrix shampoo **30ml** ×40
  - **GCCR41** — Hyaluron cream **2g×100** ×2 boxes  
  - **GCMA12 FOC** — Overnight mask **2g×50** ×2 boxes

Supplier invoice total in USD: **$12,318.00** — reconcile against your FX and buy-price policy vs MoySklad sum.

## Script

`scripts/moysklad-create-po-dts-260430.js`
