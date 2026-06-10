# Gift inventory write-off — MoySklad Списание (2026-05-06)

Internal gift / donation stock movement: **Loss** document posted at **product buy price** (`buyPrice` in each product card, AED — same basis as purchase-order scripts).

## MoySklad identifiers

| Field | Value |
|--------|--------|
| **Document type** | Списание (`loss`) |
| **Number** | `00008-00433` |
| **ID** | `069656ec-495f-11f1-0a80-144d004a5d95` |
| **Moment (on doc)** | `2026-05-06 14:00:00` |
| **Written value (sum)** | **716.80 AED** (cost basis, not retail) |
| **Idempotency marker** | `GIFT-WRITE-OFF-2026-05-06` (in `description`; script refuses duplicate if marker present) |

- [Open in MoySklad UI](https://online.moysklad.ru/app/#loss/edit?id=069656ec-495f-11f1-0a80-144d004a5d95)

## Organization & warehouse (constants)

| Role | Name | UUID |
|------|------|------|
| Organization | Genosys Middle East FZ-LLC | `e18525a4-33c5-11ea-0a80-043f000b2738` |
| Store | Genosys Warehouse | `e186d449-33c5-11ea-0a80-043f000b273a` |

## Original request (user list)

> спиши эти продукты со склада по оптовой цене — мы их подарили  

- Shampoo 2  
- biege cushion 1  
- hair tonic *(no qty given)*  
- snow booster toner 200ml — 1  
- eye contour cream 1  
- Pdrn 1  
- eye contour serum 1  
- all for sensitive serum 1  
- peptide masks 10 pcs  
- collagen masks 10 pcs  
- sea algae masks 20 pcs  
- Bio ferment — 2 pcs  
- hydrosoothing cream 50g — 1 pc  

## Mapping → MoySklad SKUs

| User line | Code | Qty | MoySklad product (short) |
|-----------|------|-----|---------------------------|
| Shampoo 2 | 00052 | 2 | HR³ Matrix Scalp & Hair Shampoo 300ml |
| Beige cushion 1 | 00144 | 1 | Skin Caring Blemish Balm Cushion #2 Biege |
| Hair tonic | 00051 | **1** | HR³ Matrix Hair Tonic 70ml — **qty assumed 1** |
| Snow Booster Toner 200ml | 00022 | 1 | Snow Booster Toner 200ml |
| Eye contour cream | 00055 | 1 | EyeCell Eye Contour Cream 20ml |
| Pdrn | **54467** | 1 | Skin Reboot PDRN mask Pack (30 sheets) — **not** Bio Meso PDRN Ampoule |
| Eye contour serum | 00054 | 1 | EyeCell Eye Contour Serum 10ml |
| All for sensitive serum | 00030 | 1 | All For Sensitive Serum 30ml |
| Peptide masks | 00012 | 10 | Peptide Gel Mask 39g **(single pcs)** |
| Collagen masks | 00063 | 10 | Intensive Repair Collagen Mask **23g** |
| Sea algae masks | 00140 | 20 | Soothing Bomb Sea Algae Mask **23g** |
| Bio Ferment | 54466 | 2 | Bio-Ferment Age Defying Powder Mask **300g** |
| Hydro soothing cream 50g | 00031 | 1 | Intensive Hydro Soothing Cream 50g |

## Cost lines (buyPrice at posting time)

VAT on loss lines: **off** (`vatEnabled: false`), same pattern as `moysklad-create-po-dts-260408.js`.

| Code | Qty | Buy AED / unit | Line AED |
|------|-----|----------------|----------|
| 00052 | 2 | 44.00 | 88.00 |
| 00144 | 1 | 52.00 | 52.00 |
| 00051 | 1 | 40.00 | 40.00 |
| 00022 | 1 | 36.70 | 36.70 |
| 00055 | 1 | 53.90 | 53.90 |
| 54467 | 1 | 42.50 | 42.50 |
| 00054 | 1 | 49.90 | 49.90 |
| 00030 | 1 | 42.20 | 42.20 |
| 00012 | 10 | 10.06 | 100.60 |
| 00063 | 10 | 2.90 | 29.00 |
| 00140 | 20 | 3.90 | 78.00 |
| 54466 | 2 | 34.00 | 68.00 |
| 00031 | 1 | 36.00 | 36.00 |
| **TOTAL** | **51 pcs** | — | **716.80** |

If any `buyPrice` in MoySklad is later corrected, historical loss totals stay as posted unless the document is recreated.

## Automation script

- **Path:** `scripts/moysklad-create-gift-writeoff-20260506.js`
- **Dry run:**  
  `set -a && source .env && set +a && node scripts/moysklad-create-gift-writeoff-20260506.js`
- **Post:** append `--commit` (already run once for this marker).

Behaviour:

1. Resolves SKU by **code** via `GET /report/stock/all`, checks **available − reserve ≥ qty**.
2. Loads **`buyPrice.value`** per line from `GET /entity/product/{id}`.
3. `POST /entity/loss` with `organization`, `store`, `positions[]` (`quantity`, `price`, `assortment`, `vatEnabled: false`).

## Assumptions to confirm later

1. **PDRN:** Interpreted as **Skin Reboot PDRN mask Pack** (`54467`). If the gift was **Bio Meso PDRN Ampoule** (`89b90c39-da54-11f0-0a80-166700076a14`), reverse/adjust manually in MoySklad or prepare a corrective loss.
2. **Hair tonic:** Quantity **not specified** → **1** (`00051`).

## Operational note (API sanity check)

A one-line test `POST /entity/loss` was executed during integration verification, then **deleted** via `DELETE /entity/loss/{id}` so it does not appear in warehouse history.

## Related repo docs

Other MoySklad session logs use the same `SESSION_CHANGES_*` naming under `docs/` and are indexed in [README.md](./README.md).

**Consignment loss at salon (not warehouse):** do not use this script alone — goods are on agent balance after **отгрузка**. Use **Возврат покупателя** + **Списание** per [CONSIGNMENT_STOCK_RECONCILIATION.md](./CONSIGNMENT_STOCK_RECONCILIATION.md) (example: [SESSION_CHANGES_2026-05-29_SHAKIROVNA_LADIES_STOCK_RECON.md](./SESSION_CHANGES_2026-05-29_SHAKIROVNA_LADIES_STOCK_RECON.md)).
