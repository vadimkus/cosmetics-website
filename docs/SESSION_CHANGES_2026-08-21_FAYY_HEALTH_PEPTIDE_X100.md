# Fayy Health — peptide gel mask ×100 (2026-08-21)

**Customer:** Fayy Health FZCO (`ee20d7e3-d46d-11ed-0a80-0df400228557`)  
**Script:** `scripts/moysklad-create-fayy-health-peptide-x100-20260821.js --commit`

Clinic list. Unpaid. Chain: SO → INV → SHIP (invoice-only). SO **Доставлен - Ждем оплату**.

| Line | Qty | Unit | Sum |
|------|----:|-----:|----:|
| 00012 Peptide Gel Mask 39g | 100 | 38 | 3,800 |
| **Total** | | | **3,800 AED** |

| Doc | Number | Sum |
|-----|--------|----:|
| SO | **GENCardM260821FAYY100** | 3,800 |
| Invoice | **04960** | 3,800 unpaid |
| Shipment | **06722** | 3,800 |

## Address

Legal_TAX concatenates city + street + addInfo. The 17 Aug order had street copied into `addInfo`, so the line printed twice.

Correct ship line now:

`UAE, Dubai, One Central, The Offices 2, 6th Floor, Unit 6.02`

Cleaned on:

- Customer card
- SO **GENCardM260817FAYY** / INV **04938** / SHIP **06693**
- This new chain

PDF: `~/Desktop/orders/GENOSYS_Fayy_Health_04960.pdf`  
Not printed.
