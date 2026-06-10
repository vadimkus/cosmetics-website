# Shakirovna Ladies Salon — Consignment Stock Reconciliation (Full Record)

**Date:** 2026-05-29 (UAE)  
**Status:** Posted in MoySklad and verified  
**Playbook (repeatable process):** [CONSIGNMENT_STOCK_RECONCILIATION.md](./CONSIGNMENT_STOCK_RECONCILIATION.md)

---

## 1. Request and decisions

| Step | Detail |
|------|--------|
| **Trigger** | Shakirovna Ladies Beauty Saloon completed a **physical consignment stock count** and sent variances vs what they believe they hold. |
| **Customer** | **Shakirovna Ladies Beauty Saloon** only — not Elite clinic, not Esthetic clinic (separate legal entities / contracts). |
| **Contract** | Commission agreement **00030** |
| **Shortages** | User confirmed: **lost** (damage, theft, unrecorded use) — **not** sold to clients → **no commission invoice** to salon. |
| **Surpluses** | Books lower than shelf → post **отгрузка** under 00030 to align MoySklad to physical. |

### Salon message (verbatim variances)

| Product (salon wording) | Variance |
|-------------------------|----------|
| Collagen mask | **plus 2** |
| Sea algae | **minus 2** |
| Hyaluron serum | **minus 1** |
| Hyaluron cream 50g | **plus 1** |
| PDRN mask | **minus 1** |

**How to read:** *plus* = more on shelf than MoySklad; *minus* = fewer on shelf than MoySklad.

---

## 2. Customer / contract (MoySklad)

| Field | Value |
|--------|--------|
| Customer name | Shakirovna Ladies Beauty Saloon |
| Counterparty ID | `93775ae5-d18d-11ea-0a80-02e00008417d` |
| Contract | **00030** |
| Contract ID | `f5a1958d-c3ca-11eb-0a80-048e0027cbcb` |
| Organization | `e18525a4-33c5-11ea-0a80-043f000b2738` |
| Warehouse | Genosys Warehouse `e186d449-33c5-11ea-0a80-043f000b273a` |

### Do not confuse with

| Entity | Contract | Notes |
|--------|----------|--------|
| ELITE SHAKIROVNA LADIES SALON L.L.C | 21 | See [SESSION_CHANGES_2026-05-12_SHAKIROVNA_ELITE_CLINIC_SHIPMENTS_INVOICE_LINES.md](./SESSION_CHANGES_2026-05-12_SHAKIROVNA_ELITE_CLINIC_SHIPMENTS_INVOICE_LINES.md) |
| SHAKIROVNA ESTHETIC CLINIC L.L.C | 26 | Same file |
| Shakirovna Ladies Beauty Saloon | **00030** | **This reconciliation** |

---

## 3. SKU mapping (salon wording → MoySklad)

| Salon term | Code | MoySklad product name | List (AED) | Notes |
|------------|------|------------------------|------------|--------|
| Collagen mask | `00063` | Intensive Repair Collagen Mask 23g | 18.00 | Single sheet mask |
| Sea algae | `00140` | Soothing Bomb Sea Algae Mask 23g | 18.00 | Not CO₂ green mask |
| Hyaluron serum | `00195` | Moisture Replenishing Hyaluron Serum 30ml | 165.00 | Used on May-12 report |
| Hyaluron cream 50g | `54458` | Moisture Replenishing Hyaluron Cream 50g | 145.00 | **Not** Radiance `00122` |
| PDRN mask | `54467` | Skin Reboot PDRN mask Pack (30 sheets) | 200.00 | **Pack**, not ampoule |

---

## 4. Consignment balance formula

For contract **00030** (live API ledger, all history):

```text
Book qty at salon = Σ Отгрузки (demand on 00030)
                  − Σ Полученные отчёты комиссионера (commissionreportin on 00030)
                  − Σ Возвраты покупателей (salesreturn for this agent)
```

Reference: same method as [SESSION_CHANGES_2026-05-02_VOLNA_CONSIGNMENT_STOCK.md](./SESSION_CHANGES_2026-05-02_VOLNA_CONSIGNMENT_STOCK.md).

### Before reconciliation (2026-05-29)

| Code | Shipped | Sold (reports) | Returned | **Book** | Salon Δ | **Target physical** |
|------|--------:|---------------:|---------:|---------:|--------:|--------------------:|
| `00063` | 539 | 512 | 10 | **17** | +2 | **19** |
| `00140` | 485 | 420 | 11 | **54** | −2 | **52** |
| `00195` | 14 | 12 | 0 | **2** | −1 | **1** |
| `54458` | 18 | 14 | 0 | **4** | +1 | **5** |
| `54467` | 41 | 27 | 0 | **14** | −1 | **13** |

*(Totals across full contract history; only these five SKUs shown.)*

### After reconciliation (verified)

| Code | Book | Target | Status |
|------|-----:|-------:|--------|
| `00063` | 19 | 19 | OK |
| `00140` | 52 | 52 | OK |
| `00195` | 1 | 1 | OK |
| `54458` | 5 | 5 | OK |
| `54467` | 13 | 13 | OK |

---

## 5. MoySklad documents created

| # | Type | Number | ID | Moment (UAE) | Sum (AED) |
|---|------|--------|-----|--------------|-----------|
| 1 | Возврат покупателя | **00296** | `cd0e0498-5b62-11f1-0a80-147b001d27e0` | 2026-05-29 (auto) | 401.00 list |
| 2 | Списание | **00008-00437** | `cd9ecdf0-5b62-11f1-0a80-041e001d579d` | +2 min | **90.30 buy** |
| 3 | Отгрузка | **06247** | `ce499480-5b62-11f1-0a80-159b001d27e0` | +5 min | 181.00 list |

**Links**

- [Sales return 00296](https://online.moysklad.ru/app/#salesreturn/edit?id=cd0e0498-5b62-11f1-0a80-147b001d27e0)
- [Loss 00008-00437](https://online.moysklad.ru/app/#loss/edit?id=cd9ecdf0-5b62-11f1-0a80-041e001d579d)
- [Demand 06247](https://online.moysklad.ru/app/#demand/edit?id=ce499480-5b62-11f1-0a80-159b001d27e0)

**Description marker (all three):** `SHAKIROVNA-LADIES-STOCK-RECON-2026-05-29`

### 5.1 Lost — virtual return (00296)

| Code | Product | Qty | Unit (list) | Line (list) |
|------|---------|-----|-------------|-------------|
| `00140` | Soothing Bomb Sea Algae Mask 23g | 2 | 18.00 | 36.00 |
| `00195` | Moisture Replenishing Hyaluron Serum 30ml | 1 | 165.00 | 165.00 |
| `54467` | Skin Reboot PDRN mask Pack | 1 | 200.00 | 200.00 |
| | | **4** | | **401.00** |

- State: **Возврат** `f793c585-01bb-11f1-0a80-1ac1000b5df5`
- Contract **00030** on document
- **No payment** from salon — accounting removal from consignment only

### 5.2 Lost — warehouse write-off (00008-00437)

| Code | Qty | Unit (buyPrice) | Line (buy) |
|------|-----|-----------------|------------|
| `00140` | 2 | 3.90 | 7.80 |
| `00195` | 1 | 40.00 | 40.00 |
| `54467` | 1 | 42.50 | 42.50 |
| | **4** | | **90.30** |

- VAT off on loss lines (same pattern as [gift write-off](./SESSION_CHANGES_2026-05-06_GIFT_INVENTORY_LOSS_MOYSKLAD.md))
- **P&L impact:** 90.30 AED COGS (not 401 AED retail)

### 5.3 Surplus — отгрузка (06247)

| Code | Product | Qty | Unit (list) | Line (list) |
|------|---------|-----|-------------|-------------|
| `00063` | Intensive Repair Collagen Mask 23g | 2 | 18.00 | 36.00 |
| `54458` | Moisture Replenishing Hyaluron Cream 50g | 1 | 145.00 | 145.00 |
| | | **3** | | **181.00** |

- State: **Отгружен** `50d70717-4582-11ea-0a80-05e3001273a2`
- Warehouse stock checked before post (sufficient)

---

## 6. Why this document flow (not a commission report)

| Scenario | MoySklad approach | Bill salon? |
|----------|-------------------|-------------|
| **Sold** but not reported | Полученный отчёт комиссионера | Yes (list + invoice path) |
| **Lost** at salon | Возврат покупателя + Списание @ buyPrice | **No** |
| **Surplus** on shelf | Отгрузка on commission contract | N/A (replenish books) |

**Why not only Списание?** Goods already left Genosys Warehouse on prior **отгрузки**; they sit on **consignment balance** at the agent. A warehouse loss alone would not reduce consignment stock correctly.

**Why not commission report at 0 AED?** Would mark items as “sold” in commission workflow and can complicate reporting/invoicing. Return + loss matches [Serene return pattern](./SESSION_CHANGES_2026-04-30_SERENE_SKIN_RETURN.md) + [gift loss pattern](./SESSION_CHANGES_2026-05-06_GIFT_INVENTORY_LOSS_MOYSKLAD.md).

---

## 7. Script and execution

**File:** `scripts/moysklad-create-shakirovna-ladies-salon-stock-recon-20260529.js`

```bash
cd /Users/vadimkus/cosmetics-website

# Dry-run (no API writes)
node --import dotenv/config scripts/moysklad-create-shakirovna-ladies-salon-stock-recon-20260529.js

# Post documents
node --import dotenv/config scripts/moysklad-create-shakirovna-ladies-salon-stock-recon-20260529.js --commit
```

**Requires:** `MOYSKLAD_LOGIN`, `MOYSKLAD_PASSWORD` in `.env` / `.env.local`  
**Dates:** `scripts/lib/moysklad-uae-date.js` — `uaeMomentNow()` for UAE `moment`  
**Idempotency:** Duplicate check on marker + same-day agent docs (loss by description search)

---

## 8. Related Shakirovna Ladies history (contract 00030)

| Date | Event | Doc | Session file |
|------|-------|-----|----------------|
| 2026-04-29 | Commission report + matching shipment | 01332 / 06051 | [SESSION_CHANGES_2026-04-29_SHAKIROVNA_COMMISSION_REPORT.md](./SESSION_CHANGES_2026-04-29_SHAKIROVNA_COMMISSION_REPORT.md) |
| 2026-05-12 | May sales report + replenishment (same 13 lines) | 01354 / 06133 | [SESSION_CHANGES_2026-05-12_SHAKIROVNA_LADIES_SALON_COMMISSION_REPORT.md](./SESSION_CHANGES_2026-05-12_SHAKIROVNA_LADIES_SALON_COMMISSION_REPORT.md) |
| 2026-05-29 | **Stock reconciliation** | 00296 / 00008-00437 / 06247 | **This file** |

---

## 9. Financial summary

| Item | AED |
|------|-----|
| Consignment return (list, not invoiced) | 401.00 |
| **Inventory loss (buy cost)** | **90.30** |
| New consignment shipment (list) | 181.00 |
| Salon amount due from this recon | **0** |

---

## 10. Verification checklist (completed)

- [x] Dry-run printed expected lines and sums
- [x] `--commit` created three documents without duplicate marker
- [x] Post-recon API ledger: all five SKUs **BOOK = target physical**
- [x] Hyaluron cream mapped to **54458** (not 00122)
- [x] PDRN mapped to **54467** pack

---

## 11. Future stock counts

1. Pull book balance per SKU (formula §4) or MoySklad commission stock report.
2. Compare to salon physical count → list only **variances**.
3. Ask: shortages **sold** or **lost**?
4. Use [CONSIGNMENT_STOCK_RECONCILIATION.md](./CONSIGNMENT_STOCK_RECONCILIATION.md) or clone script with new marker/date.
