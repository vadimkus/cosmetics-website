# Session Changes — April 6, 2026

## Summary

Major MoySklad API deep-dive session. Discovered full API access beyond the existing order-push integration. Generated financial reports, stock analysis, and regulatory document updates.

**Key outcomes:**
- Full MoySklad financial data extraction (revenue, COGS, expenses, payments, stock)
- Q1 2026 Customer Invoices report (326 invoices, 278,416 AED)
- 2025 Financial Statements (P&L + Balance Sheet) from MoySklad data
- 2026 YTD performance: 502K revenue, 68.9% margin, on pace for ~1.9M annualized
- Stock alert: 5 out-of-stock items, 4 critical (<30 days), BB Cushion Beige (#1 product) at 43 days
- Montaji registration PDF updated + deployed to Vercel
- EPI Turnover Peeling Gel Montaji registration EXPIRED (Mar 22, 2026)

---

## 1. MoySklad API — Full Data Access

### Discovery

The existing integration (`lib/moysklad.ts`) only pushes orders one-way (genosys.ae → MoySklad). We discovered the same credentials (`MOYSKLAD_LOGIN` / `MOYSKLAD_PASSWORD`) provide full read access to the entire MoySklad Remap 1.2 API.

### Available Endpoints (Verified Working)

| Endpoint | Description | Date Filter |
|:---|:---|:---|
| `GET /entity/invoiceout` | Customer invoices (Счета покупателям) | `filter=moment>=...;moment<=...` |
| `GET /entity/invoicein` | Supplier invoices (Счета поставщикам) | Same |
| `GET /entity/customerorder` | Customer orders (Заказы покупателей) | Same |
| `GET /entity/demand` | Shipments (Отгрузки) | Same |
| `GET /entity/salesreturn` | Sales returns | Same |
| `GET /entity/purchasereturn` | Purchase returns | Same |
| `GET /entity/paymentin` | Incoming payments (bank + card) | Same |
| `GET /entity/paymentout` | Outgoing payments | Same |
| `GET /entity/cashin` | Cash receipts | Same |
| `GET /entity/cashout` | Cash disbursements | Same |
| `GET /entity/purchaseorder` | Purchase orders | Same |
| `GET /entity/supply` | Goods receipts (Приёмка) | Same |
| `GET /entity/loss` | Inventory write-offs/losses | Same |
| `GET /entity/move` | Stock transfers | Same |
| `GET /report/profit/byproduct` | Profit report by product | `momentFrom=...&momentTo=...` |
| `GET /report/stock/all` | Current stock with cost prices | No date filter (current snapshot) |
| `GET /report/money/byaccount` | Account balances | No date filter |
| `GET /entity/counterparty` | Customer/supplier directory | `filter=...` |

### Date Filter Syntax

**Entity endpoints** use `filter` parameter:
```
GET /entity/invoiceout?filter=moment>=2026-01-01 00:00:00;moment<=2026-03-31 23:59:59&order=moment,asc&limit=1000
```

**Report endpoints** use query parameters:
```
GET /report/profit/byproduct?momentFrom=2026-01-01 00:00:00&momentTo=2026-03-31 23:59:59
```

### Counterparty/State Resolution

Entity list responses return `agent` and `state` as meta references (href only). To get names, either:
1. Use `?expand=agent,state` (works for small result sets)
2. Resolve individually by fetching `agent.meta.href` with caching (used in our scripts — handles any result size)

### Authentication

Basic Auth with base64-encoded `login:password`. Credentials stored in Vercel env vars:
```
MOYSKLAD_LOGIN=vadimkus@ikosmetologist
MOYSKLAD_PASSWORD=<in Vercel>
```

### API Documentation

- Official: https://dev.moysklad.ru/doc/api/remap/1.2/
- GitHub: https://github.com/moysklad/api-remap-1.2-doc

---

## 2. Q1 2026 Customer Invoices Report

### Script

**File:** `scripts/moysklad-invoices-export.js`

**Usage:**
```bash
MOYSKLAD_LOGIN="email" MOYSKLAD_PASSWORD="pass" node scripts/moysklad-invoices-export.js
```

**Output:**
- `~/Desktop/Genosys_Customer_Invoices_Q1_2026.csv` — Excel-compatible (UTF-8 BOM)
- `~/Desktop/Genosys_Customer_Invoices_Q1_2026.md` — Markdown report

### Q1 2026 Results

| Month | Invoices | Amount (AED) |
|:---|---:|---:|
| January 2026 | 82 | 79,901 |
| February 2026 | 124 | 105,219 |
| March 2026 | 120 | 93,296 |
| **TOTAL** | **326** | **278,416** |

Each row includes: date, invoice number, counterparty name (resolved), status, amount.

### Full Report Script

**File:** `scripts/moysklad-q1-report.js`

Pulls ALL document types for Q1 2026 (invoices in/out, customer orders, demands, payments).

**Output saved to:** `docs/MOYSKLAD_Q1_2026_REPORT.txt`

---

## 3. 2025 Financial Statements

Generated P&L and Balance Sheet matching the exact format of the 2024 audited statements (prepared by Saldo Accounting).

### Scripts

| Script | Purpose |
|:---|:---|
| `scripts/moysklad-2025-financials.js` | Pulls revenue, COGS, payments, returns, losses for full year 2025 |
| `scripts/moysklad-2025-expenses.js` | Categorizes outgoing payments by counterparty and expense type |

### Data Sources Used

| P&L Line Item | MoySklad Source |
|:---|:---|
| Revenue (1,365,229) | `/report/profit/byproduct` — actual product sales |
| Cost of Revenue (415,366) | `/report/profit/byproduct` — weighted avg cost of goods sold |
| Accounting Charges (11,025) | Payments Out → Saldo Accounting (4 payments) |
| Rent (167,908) | Payments Out → Cordoba Residence (13 payments, ~12,916/mo) |
| Trade License (4,038) | Payments Out → RAKEZ |
| Gov & Legal (1,070) | Payments Out → Dubai Municipality (DM Import Fee + Certification) |
| Bank Charges (1,188) | Payments Out → WIO Bank |
| IT Expenses (3,005) | Payments Out → Moy Sklad (1,617) + Google ULTRA (480) + others |
| Bad Debt (25,194) | `/entity/loss` — 91 inventory write-off documents |
| Salaries (283,150) | Payments Out → Salary category (12 monthly) |
| Bonus (372,048) | Payments Out → Sales Bonus category (31 payments) |
| Utilities (6,935) | Payments Out → DEWA (5 payments) |
| Telephone (3,799) | Payments Out → DU (4 payments) |
| Shipping (58,611) | Payments Out → EMS (29,684) + CP World (28,877) |

### P&L Summary — 2025

| | 2024 | 2025 | Change |
|:---|---:|---:|---:|
| Revenue | 1,082,890 | 1,365,229 | +26% |
| COGS | (404,768) | (415,366) | +3% |
| Gross Profit | 678,122 | 949,863 | +40% |
| Gross Margin | 62.6% | 69.6% | +7pp |
| Operating Expenses | (661,625) | (938,106) | +42% |
| **Net Income** | **16,497** | **11,757** | −29% |

Revenue grew 26% with margin expansion (+7pp). But OpEx surged due to:
- **Rent**: 9,300 → 167,908 (new Cordoba Residence office/warehouse)
- **Shipping**: 2,351 → 58,611 (EMS + CP World delivery costs)
- **Bonus**: 300,719 → 372,048 (sales commission scaled with revenue)

### Balance Sheet — Key Changes

| | 2024 | 2025 | Notes |
|:---|---:|---:|:---|
| Cash | 1,549 | 166,953 | Inventory converted to cash |
| Inventory | 224,000 | 92,743 | Drew down stock aggressively |
| Total Assets | 225,549 | 269,982 | +20% |
| Total Equity | 214,607 | 249,982 | +16% |

### Cash Surge Explained

Profit was only 11,757 but cash grew by 165,404 because:
- COGS (goods sold at cost): 415,366
- Purchases (goods bought): 309,303
- Gap of 106,063 = sold from existing inventory without replacing
- Plus write-offs: 25,194
- Total inventory drawdown: 131,257 converted to cash

### Output Files

| File | Location |
|:---|:---|
| Profit & Loss 2025 | `~/Desktop/Profit_Loss_2025.md` |
| Balance Sheet 2025 | `~/Desktop/Balance_Sheet_2025.md` |

### Items Requiring Accountant Verification

1. Cash — reconcile with WIO Bank statement as at 31.12.2025
2. Inventory — physical stock count vs calculated 92,743
3. Accounts receivable — estimated at 10,286
4. Accounts payable — estimated at 20,000 (includes VAT liability)
5. Partners' Current Account — calculated as balancing figure (121,725)

---

## 4. 2026 YTD Performance & Stock Analysis

### 2026 Performance (Jan 1 — Apr 6, 96 days)

| Metric | Value |
|:---|---:|
| Revenue | 502,337 AED |
| COGS | 156,447 AED |
| Gross Profit | 345,890 AED |
| Margin | 68.9% |
| Products sold | 75 SKUs |
| Annualized run-rate | ~1.9M AED |

### Current Stock Valuation

- Total SKUs in stock: 94
- Total units: 8,254
- Total value at cost: **179,100 AED**

### Out of Stock (Lost Sales)

| Product | Units sold before stockout | Revenue impact |
|:---|---:|:---|
| **Microbiome Energy Infusing Mist 80ml** | 122 | 11,064 AED (~115/day lost) |
| OXY VITA Holiday KIT | 5 | 1,625 AED (seasonal) |
| HR3 Matrix Shampoo 30ml | 9 | 225 AED |

### Critical Stock (<30 days remaining)

| Product | Stock | Monthly Rate | Days Left | 2026 Revenue |
|:---|---:|---:|---:|---:|
| Skin Barrier Protecting Cream 100g | 6 | 13 | 14d | 9,790 |
| Moisture Replenishing Hyaluron Cream 50g | 11 | 18 | 18d | 9,411 |
| Snow O₂ Cleanser 500ml | 8 | 13 | 19d | 10,748 |
| Multi Vita Radiance Serum 30ml | 11 | 14 | 23d | 8,094 |

### Top Revenue Products (2026 YTD)

| # | Product | Stock | Monthly Rate | Days Left | Revenue |
|---:|:---|---:|---:|---:|---:|
| 1 | BB Cushion #2 Beige | 114 | 80 | 43d | 44,238 |
| 2 | PDRN Mask Pack 30 sheets | 164 | 49 | 100d | 32,475 |
| 3 | Snow O₂ Cleanser 180ml | 156 | 48 | 97d | 28,186 |
| 4 | Peptide Gel Mask 39g | 1,224 | 195 | 189d | 23,522 |
| 5 | Hydro Cool Modeling Mask 1kg | 110 | 19 | 170d | 19,200 |

### Priority Reorder List (by revenue impact)

1. **BB Cushion #2 Beige** — 80/mo, 43d left, #1 product (44K revenue)
2. **Microbiome Energy Infusing Mist** — 38/mo, OUT OF STOCK (11K revenue lost)
3. **EyeCell Peptide Gel Patch** — 28/mo, 48d left
4. **Skin Rescue Overnight Cream Mask** — 25/mo, 49d left
5. **Snow O₂ Cleanser 500ml** — 13/mo, 19d left (CRITICAL)
6. **Moisture Replenishing Hyaluron Cream** — 18/mo, 18d left (CRITICAL)
7. **Skin Barrier Protecting Cream** — 13/mo, 14d left (CRITICAL)
8. **Multi Vita Radiance Serum** — 14/mo, 23d left
9. **Multi Vita Radiance Cream** — 18/mo, 49d left
10. **EyeCell Eye Contour Cream** — 17/mo, 41d left

---

## 5. Montaji Registration — Review & PDF Update

### Document Review

Reviewed `Genosys_Product_Registration_Montaji.pdf` — master product registration for Dubai Municipality's Montaji system. Contains **68 registered products**, all status: Approved.

### Expiring/Expired Registrations

| Product | Reg # | Barcode | Expires | Status |
|:---|:---|:---|:---|:---|
| **EPI Turnover Boosting Peeling Gel** | CPCA-2021-015909 | 8809567929142 | **22 Mar 2026** | **EXPIRED — RENEW NOW** |
| **Soothing Bomb Sea Algae Mask** | CPRE-2021-046137 | 8809579273974 | 10 Oct 2026 | Renew before October |

The EPI Peeling Gel registration expired 2 weeks ago. It's an active product (52 units sold in Q1 2026, 31 in stock, 7,038 AED revenue).

### PDF Update & Deployment

**What changed:** Replaced `Genosys_UAE_Montaji_Registration.pdf` (old, 266KB, Jan 28) with `Genosys_Product_Registration_Montaji.pdf` (new, 150KB, Apr 6).

**Both filenames serve the same updated document:**
- `genosys.ae/documents/Genosys_UAE_Montaji_Registration.pdf` — existing URL (referenced by About pages + chatbot)
- `genosys.ae/documents/Genosys_Product_Registration_Montaji.pdf` — new filename

**Code references (unchanged — URLs still work):**
- `app/about/AboutPageClient.tsx` — EN About page Montaji link
- `app/ar/about/ArabicAboutPageClient.tsx` — AR About page Montaji link
- `lib/chatbot/config.ts` — Genie chatbot knowledge base (2 references)

**Commit:** `730af996` — pushed to `origin/main`, auto-deployed to Vercel.

---

## 6. MoySklad Expense Breakdown (2025)

Full breakdown of 2025 outgoing payments by counterparty and category:

### By Counterparty

| Counterparty | Payments | Total (AED) | Nature |
|:---|---:|---:|:---|
| Sagatdinov V. | 25 | 582,593 | Salary + Sales Bonus |
| DTSMG Genosys | 37 | 309,303 | Supplier (COGS) |
| Cordoba Residence | 13 | 167,908 | Office/warehouse rent |
| Kobzarenko I. | 19 | 72,740 | Sales commission |
| Federal TAX | 4 | 53,507 | VAT payments to FTA |
| EMS UAE | 24 | 29,684 | Shipping/delivery |
| CP World LLC | 6 | 28,877 | Shipping/delivery |
| Saldo Accounting | 4 | 11,025 | Accounting services |
| DEWA | 5 | 6,935 | Utilities |
| RAKEZ | 1 | 4,038 | Trade license |
| DU | 4 | 3,799 | Telephone/mobile |
| Moy Sklad | 2 | 1,617 | Software |
| WIO Bank | 1 | 1,188 | Bank fees |
| Dubai Municipality | 14 | 1,070 | Import fees |
| Tasjeel.ae | 2 | 908 | Registration |
| Google ULTRA | 1 | 480 | Software |
| Salik | 1 | 50 | Road toll |

### By Expense Category

| Category | Payments | Total (AED) |
|:---|---:|---:|
| Sales Bonus | 31 | 372,048 |
| Закупка товаров (COGS) | 37 | 309,303 |
| Salary | 12 | 283,150 |
| Office monthly rent | 13 | 167,908 |
| Shipment Cost | 30 | 58,561 |
| Налоги и сборы (VAT) | 4 | 53,507 |
| Accounting Expense | 4 | 11,025 |
| DEWA and Electricity | 5 | 6,935 |
| Company/Trade License Cost | 1 | 4,038 |
| Mobile plan | 4 | 3,799 |
| Software Rental Fee | 5 | 3,005 |
| Bank Account Maintenance fee | 1 | 1,188 |
| DM Import Fee | 12 | 1,050 |
| Ads and Instagram | 1 | 135 |
| Car Fuel/Salik | 1 | 50 |
| Product Certification | 2 | 20 |

---

## Files Created/Modified

### New Scripts

| File | Purpose |
|:---|:---|
| `scripts/moysklad-q1-report.js` | Full Q1 2026 financial report (all document types) |
| `scripts/moysklad-invoices-export.js` | Customer invoices export to CSV + Markdown |
| `scripts/moysklad-2025-financials.js` | 2025 revenue, COGS, payments summary |
| `scripts/moysklad-2025-expenses.js` | 2025 expense categorization by counterparty/type |

### Documents Generated (Desktop)

| File | Content |
|:---|:---|
| `~/Desktop/Genosys_Customer_Invoices_Q1_2026.csv` | 326 customer invoices, Excel-compatible |
| `~/Desktop/Genosys_Customer_Invoices_Q1_2026.md` | Same data in Markdown format |
| `~/Desktop/Profit_Loss_2025.md` | P&L statement matching 2024 audited format |
| `~/Desktop/Balance_Sheet_2025.md` | Balance Sheet matching 2024 audited format |

### Modified Files (Committed)

| File | Change |
|:---|:---|
| `public/documents/Genosys_UAE_Montaji_Registration.pdf` | Replaced with updated Montaji registration |
| `public/documents/Genosys_Product_Registration_Montaji.pdf` | New file (same content, new name) |

### Reports Saved in Docs

| File | Content |
|:---|:---|
| `docs/MOYSKLAD_Q1_2026_REPORT.txt` | Full Q1 2026 report with all document types |
| `docs/SESSION_CHANGES_2026-04-06.md` | This session log |

---

*Session date: April 6, 2026*
