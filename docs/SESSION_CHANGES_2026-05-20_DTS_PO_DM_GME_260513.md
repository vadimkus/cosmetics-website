# DTS MG commercial invoice → MoySklad purchase order **DM GME 260513**

Source folder: `~/Desktop/14052026/`  
PDF: `DM GME 260513_Commercial Invoice.pdf` (invoice date **2026-05-14**).

## Created document

| Field | Value |
|--------|--------|
| **PO name** | `DM GME 260513` |
| **Lines** | **47** paid positions (GRST025 → GMHR02 Scalp Brush) |
| **Units** | 2,420 |
| **ID** | `5521fcbb-5466-11f1-0a80-0b2a0023de1d` |
| **Sum (MoySklad buyPrice)** | **51,755.90 AED** |
| **Supplier** | DTSMG Genosys |
| **Planned delivery** | 2026-06-04 |
| **UI** | https://online.moysklad.ru/app/#purchaseorder/edit?id=5521fcbb-5466-11f1-0a80-0b2a0023de1d |
| **Script** | `scripts/moysklad-create-po-dts-260513.js` |

## Scope

**Included:** all paid commodity lines on the invoice through **GENOSYS HR³ MATRIX SCALP BRUSH** (GMHR02).

**Excluded** (add manually later if needed):

- GMBR15 — Catalogue ×100  
- GMAC05 — Non Woven Bag (S) ×800  
- GCHR21 — HR³ shampoo **30ml** ×40  
- Sample boxes: GCCL03, GCCR48/49, GCCR22, GCSP-CB01  
- FOC / support block (page 2): duplicate GCCR01, GCHR20, GCSE10/16/18, GCCR41, GCCR24, GCEX02, GCMA12  

## Mapping notes

| Invoice | MoySklad | Qty logic |
|---------|----------|-----------|
| GCMA02 Peptide Gel Mask Kit ×200 | `00012` mask 39g | **1000** pcs (200 kits × 5) |
| GCCR07 Postcream 20g×12 ×7 box | `00039` Postcream box | **7** |
| GCPS01/03/05 “Box” | `00018` / `00065` / `00069` vials | invoice qty (10 / 10 / 15) |
| GRST025 / GRST050 | `00074` / `00130` stamps | 18 / 10 |
| GCMR02 remover | `54461` | 5 |

Supplier invoice USD for this block ≈ **$14,472** (full invoice $15,202 includes marketing/samples/FOC). Reconcile FX vs MoySklad buy prices on goods receipt.

## Usage

```bash
node --import dotenv/config scripts/moysklad-create-po-dts-260513.js
node --import dotenv/config scripts/moysklad-create-po-dts-260513.js --commit
```
