# Face Room Marina — Zero Balance Certificate (branch closure)

**Date:** 2026-07-09  
**Customer:** FACE ROOM BEAUTY SALON CO (Dubai Marina — Marina Gate 2, shop R202)  
**MoySklad ID:** `12b051b0-4e21-11ee-0a80-063e000814cc`  
**WhatsApp contact:** Faceroom Madina (+971 58 595 1249)

## Request

Branch closing. Customer asked (RU) for a document confirming no outstanding debt, unpaid invoices, or other financial obligations. User confirmed all paid.

## MoySklad verification

| Check | Result |
|-------|--------|
| Invoices (all time) | 87 — **0 unpaid** |
| Unpaid customer orders | **0** |
| Latest activity | Apr–May 2026 — all invoiced & paid |

## Deliverable

| Field | Value |
|-------|-------|
| **Document** | `GME-NOD-2026-FR-001` |
| **Title** | Certificate of Zero Balance (EN + RU block) |
| **Balance stated** | AED 0.00 |
| **PDF** | `~/Desktop/orders/GENOSYS_FaceRoom_Marina_Zero_Balance_20260709.pdf` |
| **Stamp** | `~/Desktop/orders/Stamp.png` |

## Script (reusable)

```bash
node --import dotenv/config scripts/generate-customer-no-debt-certificate.js \
  --agent 12b051b0-4e21-11ee-0a80-063e000814cc \
  --header "/Users/vadimkus/Desktop/Drive/Genosys/Print_forms/2026/ART/header.png" \
  --stamp "$HOME/Desktop/orders/Stamp.png" \
  --out "$HOME/Desktop/orders/GENOSYS_FaceRoom_Marina_Zero_Balance_20260709.pdf" \
  --doc-no GME-NOD-2026-FR-001
```

Script aborts if any unpaid invoices exist on the counterparty.

---

## Business Bay branch (second location)

**Date:** 2026-07-09  
Same legal entity in MoySklad (`12b051b0-4e21-11ee-0a80-063e000814cc`); certificate issued for **Business Bay branch** address.

| Field | Value |
|-------|-------|
| **Document** | `GME-NOD-2026-FR-002` |
| **Branch** | Business Bay Branch |
| **Address on cert** | Executive Towers, Business Bay, Dubai, UAE |
| **PDF** | `~/Desktop/orders/GENOSYS_FaceRoom_BusinessBay_Zero_Balance_20260709.pdf` |

```bash
node --import dotenv/config scripts/generate-customer-no-debt-certificate.js \
  --agent 12b051b0-4e21-11ee-0a80-063e000814cc \
  --header "/Users/vadimkus/Desktop/Drive/Genosys/Print_forms/2026/ART/header.png" \
  --stamp "$HOME/Desktop/orders/Stamp.png" \
  --branch "Business Bay Branch" \
  --address "Executive Towers, Business Bay, Dubai, UAE" \
  --out "$HOME/Desktop/orders/GENOSYS_FaceRoom_BusinessBay_Zero_Balance_20260709.pdf" \
  --doc-no GME-NOD-2026-FR-002
```

Script supports `--branch` and `--address` for multi-location customers on one MoySklad counterparty.
