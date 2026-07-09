# GOCOSMO — supplemental return 1,699 AED (2026-06-21)

Goodwill alignment: user accepted **1,699 AED** difference vs email wording (14,011 − 3,000 − 5,507 = 5,504 vs books **7,203**). No further dispute.

## Posted

| | |
|---|---|
| **Salesreturn** | **00300** |
| **Total** | **1,699.00 AED** |
| **Units** | **14 pcs** · **5 SKUs** |
| **Link** | https://online.moysklad.ru/app/#salesreturn/edit?id=ea234642-6d4b-11f1-0a80-0763005871ea |
| **PDF** | `~/Desktop/GENOSYS_GOCOSMO_Consignment_Return_Note_00300_1699AED_20260621.pdf` |

## Lines

| Code | Product | Qty | Line AED |
|------|---------|----:|---------:|
| `00143` | Cushion #1 Ivory | 4 | 600.00 |
| `00189` | Skin Rescue Overnight Cream Mask 100g | 3 | 510.00 |
| `00145` | Problem Control Toner 200ml | 3 | 390.00 |
| `00063` | Collagen mask 23g | 3 | 54.00 |
| `54458` | Hyaluron Cream 50g | 1 | 145.00 |
| | **TOTAL** | **14** | **1,699.00** |

## Settlement stack (Contract 13)

| Event | AED |
|-------|----:|
| Report **01253** paid | −3,000 |
| Return **00299** (stock collected) | −5,507 |
| Return **00300** (this supplement) | −1,699 |
| **Consignment book remaining** | run export script |

## Script

`scripts/moysklad-create-gocosmo-consignment-return-1699-20260621.js`
