# Le Bleu Ciel / Le Ciel — cushion order (2026-07-05)

**Customer:** LE CIEL BEAUTY SPOT Perfumes & Cosmetics Trading CO. L.L.C S.O.C (`d28b9ecf-44c0-11ef-0a80-0379001bda44`)  
**Former name:** Le Bleu Ciel Ladies Beauty Salon  
**License:** **1612620** (exp 12/03/2027) · DCCI **678077** · Register **2833003**  
**Phone:** 567507775  
**Address:** Al Wasl Rd, Block A, 1107, Dubai  

**Script:** `scripts/moysklad-create-le-bleu-ciel-cushion-order-invoice-demand-20260705.js --commit`

## Documents

| Step | Type | Name | Sum (AED) |
|------|------|------|----------:|
| 1 | Customer order | **GENCardM2607057775** | 750.00 |
| 2 | Invoice | **04765** | 750.00 |
| 3 | Shipment | **06476** | 750.00 |

- [Order](https://online.moysklad.ru/app/#customerorder/edit?id=ae7afe0c-7841-11f1-0a80-08c200512981)
- [Invoice 04765](https://online.moysklad.ru/app/#invoiceout/edit?id=aeced665-7841-11f1-0a80-1a69005310da)
- [Shipment 06476](https://online.moysklad.ru/app/#demand/edit?id=afa56742-7841-11f1-0a80-04b60051e6a7)

## Lines @ clinic list (VAT incl.)

| Code | Product | Qty | Unit AED | Line AED |
|------|---------|----:|---------:|---------:|
| `00144` | Skin Caring Blemish Balm Cushion #2 Beige | 3 | 150.00 | 450.00 |
| `00143` | Skin Caring Blemish Balm Cushion #1 Ivory | 2 | 150.00 | 300.00 |
| | **TOTAL** | **5** | | **750.00** |

## PDF

`~/Desktop/orders/GENOSYS_Le_Ciel_04765.pdf` (Genosys_Invoice_Legal_TAX, landscape) — **reissued 2026-07-05** after counterparty rename + license **1612620** update.

## Counterparty update (2026-07-05)

Per commercial license screenshot — script `scripts/moysklad-update-le-ciel-counterparty-reprint-04765-20260705.js --commit`:

| Field | Before | After |
|-------|--------|-------|
| Name | Le Bleu Ciel Ladies Beauty Salon | **LE CIEL BEAUTY SPOT Perfumes & Cosmetics Trading CO. L.L.C S.O.C** |
| License (email/fax/legalAddress) | 784011 | **1612620** |
| DCCI / Register | — | **678077** / **2833003** |

See also: `docs/SESSION_CHANGES_2026-07-05_LE_CIEL_COUNTERPARTY_UPDATE.md`
