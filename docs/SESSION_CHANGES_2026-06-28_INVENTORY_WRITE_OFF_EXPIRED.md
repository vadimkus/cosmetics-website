# Warehouse write-off @ buyPrice — expired stock (2026-06-28)

**Script:** `scripts/moysklad-create-inventory-writeoff-20260628.js`  
**Marker:** `INVENTORY-WRITE-OFF-EXPIRED-2026-06-29`

## Posted

| Field | Value |
|-------|-------|
| **Loss №** | **00008-00451** |
| **ID** | `c624c352-736e-11f1-0a80-0c52006b47a3` |
| **Sum (buy cost)** | **867.65 AED** |
| **Units** | 72 pcs / 10 lines |

- [Open in MoySklad](https://online.moysklad.ru/app/#loss/edit?id=c624c352-736e-11f1-0a80-0c52006b47a3)

## Lines @ buyPrice

| Code | Qty | Buy/unit AED | Line AED | Product |
|------|----:|-------------:|---------:|---------|
| `00041` | 2 | 27.90 | 55.80 | Multi Sun Cream SPF40 40g |
| `54466` | 2 | 34.00 | 68.00 | Bio-Ferment Age Defying Powder Mask 300g |
| `00063` | 10 | 2.94 | 29.40 | Intensive Repair Collagen Mask 23g |
| `00140` | 10 | 3.31 | 33.10 | Soothing Bomb Sea Algae Mask 23g |
| `00188` | 3 | 18.35 | 55.05 | Microbiome Energy Infusing Mist 80ml |
| `00020` | 20 | 8.22 | 164.40 | Power Solution SWS 1 Vial 2ml (expired) |
| `00015` | 20 | 13.40 | 268.00 | SRS 1 Vial 2ml (expired) |
| `54458` | 2 | 36.00 | 72.00 | **Hyaluron cream 50g** — Moisture Replenishing Hyaluron Cream |
| `00190` | 2 | 36.00 | 72.00 | **Multifunctional cream 50g** — Multi Functional Anti-Wrinkle Cream |
| `00053` | 1 | 49.90 | 49.90 | EyeCell Eye Peptide Gel Patch (box) |
| **TOTAL** | **72** | | **867.65** | |

VAT on loss lines: off (`vatEnabled: false`).

## Clarification (2026-06-29)

User intent for the two cream lines:

| User request | Code | MoySklad product |
|---|---|---|
| Hyaluron cream 50g ×2 | `54458` | Moisture Replenishing Hyaluron Cream 50g |
| Multifunctional cream 50g ×2 | `00190` | Multi Functional Anti-Wrinkle Cream 50g |

**SKUs on loss 00008-00451 were already correct** — only the document **description** used abbreviated labels (“hyal cream”, “multifun cream”). Updated in MoySklad to full names + codes.

**Process note:** ask before posting when product names are abbreviated or ambiguous (e.g. hyal vs hydro, 50g vs 250g pro tub).

## Post command

```bash
node --import dotenv/config scripts/moysklad-create-inventory-writeoff-20260628.js --commit
```
