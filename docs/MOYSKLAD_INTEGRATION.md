# MoySklad Integration

## Overview

Orders placed on **genosys.ae** can be manually pushed to MoySklad (МойСклад) accounting system via the admin panel.

This is a **one-way sync**: genosys.ae → MoySklad. The integration only **creates** new customer orders and counterparties — it never modifies or deletes existing MoySklad data.

## How It Works

```
Customer places order on genosys.ae
         ↓
Order saved to PostgreSQL database
         ↓
Email confirmations sent (customer + admin)
         ↓
Admin opens order in /admin panel
         ↓
Admin clicks "Push to MoySklad" button
         ↓
Customer/counterparty found or created in MoySklad
         ↓
Order with line items appears in MoySklad
         ↓
moySkladOrderId saved to order in database
(button changes to green "Synced to MoySklad" badge)
```

### Manual Push via Admin Panel

Orders are pushed to MoySklad **manually** by clicking the "Push to MoySklad" button on the order detail view in the admin panel (`/admin` → Orders tab → click order → "Push to MoySklad").

**Why manual instead of automatic?**
- Automatic sync via checkout routes was unreliable on Vercel's serverless runtime (fire-and-forget promises and `after()` were getting terminated before completion)
- Manual push keeps the live checkout flow clean and fast
- Admins can verify orders before pushing to accounting
- No risk of interfering with customer checkout experience

### API Endpoint

| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/admin/orders/[id]/push-moysklad` | Push a single order to MoySklad |

**Security**: Requires admin authentication + CSRF token.

**Idempotent**: Returns 409 if order was already pushed (prevents duplicates).

### Database Fields

| Column | Type | Purpose |
|--------|------|---------|
| `moySkladOrderId` | String (nullable) | MoySklad order UUID after push |
| `moySkladSyncedAt` | DateTime (nullable) | Timestamp of when order was pushed |

### Safety Guarantees

- **Non-blocking checkout**: MoySklad is completely decoupled from the checkout flow
- **No overwrites**: Existing MoySklad products, counterparties, and orders are never modified
- **Idempotent counterparties**: Customers are searched by phone → email → name before creating a new one
- **Duplicate protection**: Once pushed, the button changes to a "Synced" badge and the API rejects re-pushes
- **Graceful degradation**: If `MOYSKLAD_LOGIN` / `MOYSKLAD_PASSWORD` env vars are not set, the push endpoint returns a clear error

## MoySklad Account Configuration

### Entity IDs (hardcoded in `lib/moysklad.ts`)

| Entity | Name | MoySklad UUID |
|--------|------|---------------|
| Organization | Genosys Middle East FZ-LLC | `e18525a4-33c5-11ea-0a80-043f000b2738` |
| Store/Warehouse | Genosys Warehouse | `e186d449-33c5-11ea-0a80-043f000b273a` |
| Currency (AED) | AED (default) | `e1870630-33c5-11ea-0a80-043f000b273f` |
| Order State | Новый (New) | `e1a0abf2-33c5-11ea-0a80-043f000b275a` |

### Order States Available

| State (Russian) | Translation | ID |
|-----------------|-------------|-----|
| Новый | New | `e1a0abf2-...275a` |
| Подтвержден - Ждет сборки | Confirmed - Awaiting assembly | `e1a0ad05-...275b` |
| Собран - Ждет доставки | Assembled - Awaiting delivery | `e1a0ae0c-...275d` |
| Доставлен | Delivered | `e1a0ae5f-...275e` |
| Оплачен - Ждет доставки | Paid - Awaiting delivery | `909556cd-...9616` |

New orders from genosys.ae are created with state **"Новый"** (New).

## Product Mapping

Products are mapped by name from the webapp to MoySklad product UUIDs. The full mapping is in `lib/moysklad.ts` in the `PRODUCT_MAP` constant.

### Key Mappings

| Webapp Product Name | MoySklad Product Name | MoySklad ID |
|--------------------|-----------------------|-------------|
| POWER SOLUTION AWS | POWER SOLUTION AWS Box | `05507ec8-...` |
| POWER SOLUTION CVS | POWER SOLUTION CVS Box | `cd352a84-...` |
| POWER SOLUTION HES | POWER SOLUTION HES Box | `22afc79d-...` |
| POWER SOLUTION SWS | POWER SOLUTION SWS Box | `662f268a-...` |
| POWER SOLUTION PCS | POWER SOLUTION PCS Box | `e5c696ee-...` |
| POWER SOLUTION CTS | POWER SOLUTION CTS Box | `726570c8-...` |
| INTENSIVE HYDRO SOOTHING CREAM | Genosys Intensive Hydro Soothing Cream 50g | `1ebfde72-...` |
| HR³ MATRIX HAIR SOLUTION α | Genosys HR³ Matrix Hair Solution Box (8pcs) | `145d21d6-...` |
| ... (55+ products mapped) | | |

### Color Variant Mapping (Products with Multiple Colors)

Some products (e.g. BB cushions) have multiple color variants in MoySklad as separate products. The webapp stores `color` on each `OrderItem` (e.g. `"ivory"`, `"beige"`, `"camel"`). When pushing to MoySklad, the integration checks `COLOR_VARIANT_MAP` first before falling back to `PRODUCT_MAP`.

**Key format:** `"PRODUCT NAME | color"` (color is lowercased for matching)

**SKIN CARING BLEMISH BALM CUSHION [SPF 50+ PA++++] color variants:**

| Webapp Color | MoySklad Product | MoySklad UUID |
|--------------|------------------|---------------|
| ivory | #1 Ivory | `8e55b3ff-d092-11ec-0a80-022900a6db36` |
| beige | #2 Beige | `aca39b2a-d092-11ec-0a80-013600a5ed6d` |
| camel | #3 Camel | `374ebc0b-a7cd-11ef-0a80-07b3001b04d7` |

**Lookup order:**
1. If `OrderItem.color` is present → try `COLOR_VARIANT_MAP["PRODUCT NAME | color"]`
2. If no color match → fall back to `PRODUCT_MAP["PRODUCT NAME"]` (Ivory/default for cushion)

**Adding a new color variant:**
1. Create the product in MoySklad
2. Copy the product UUID from the URL when editing: `https://online.moysklad.ru/app/#good/edit?id=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`
3. Add to `COLOR_VARIANT_MAP` in `lib/moysklad.ts`:
   ```ts
   'SKIN CARING BLEMISH BALM CUSHION [SPF 50+ PA++++] | newcolor': 'uuid-here',
   ```

### Delivery Service Mapping

Shipping is added as a **service line item** (not product) in MoySklad orders. Emirates map to delivery service UUIDs:

| Emirate | Shipping (AED) | MoySklad Service UUID |
|---------|---------------|----------------------|
| Dubai | 45 | `a97cfeeb-814e-11ea-0a80-004a001516bd` |
| Sharjah | 70 | `52864050-59a7-11eb-0a80-022e00579624` |
| Abu Dhabi | 70 | `212036af-814f-11ea-0a80-011700157c7d` |
| Al Ain | 80 | `41b80390-814f-11ea-0a80-03ae0014ec85` |
| Fujairah | 80 | `557d2277-814f-11ea-0a80-03ae0014ed65` |
| RAK / Ras Al Khaimah | 80 | `a9d199bf-b909-11ea-0a80-03ec0015b2d7` |

Uses fuzzy matching (`.includes()`) for emirate name variations. If no mapping is found, shipping is noted in the order description only.

**VAT on delivery (important):** Delivery in the UAE is a taxable service at 5% VAT. The shipping line item is pushed to MoySklad with `vat: 5, vatEnabled: true` and the price is treated as VAT-inclusive (matches the order's `vatIncluded: true` flag and the website's checkout VAT calc at `app/api/checkout/route.ts` which computes VAT on `subtotal + shipping`). Do **not** change this to `vat: 0` — it would under-declare output VAT for FTA reporting.

### Unmapped Products

Some webapp products like **beauty boxes** (ANTI-AGING BEAUTY BOX, CHARMING LOOK BEAUTY BOX, etc.) are custom bundles that don't have a 1:1 MoySklad product. These are noted in the order description in MoySklad but won't have line items.

### Adding New Products

**Single-variant products:**
1. Find the product's MoySklad UUID via MoySklad API or web UI (URL: `.../good/edit?id=UUID`)
2. Add the mapping to `PRODUCT_MAP` in `lib/moysklad.ts`
3. Deploy the change

**Color-variant products:** Add to `COLOR_VARIANT_MAP` instead (see Color Variant Mapping above).

## Environment Variables

### Required

```env
MOYSKLAD_LOGIN=vadimkus@ikosmetologist
MOYSKLAD_PASSWORD=your-password-here
```

### Where to set

| Environment | Location |
|-------------|----------|
| Local dev | `.env` file |
| Production (Vercel) | Vercel Dashboard → Project Settings → Environment Variables |

**STATUS**: Vercel environment variables were added on Feb 14, 2026. Integration is **LIVE** in production.

## Files

| File | Purpose |
|------|---------|
| `lib/moysklad.ts` | Main integration module — API client, `PRODUCT_MAP`, `COLOR_VARIANT_MAP`, `DELIVERY_SERVICE_MAP`, order creation |
| `app/api/admin/orders/[id]/push-moysklad/route.ts` | Admin API endpoint — maps `OrderItem` (productName, quantity, price, color) to MoySklad |
| `components/admin/OrderDetails.tsx` | Admin order detail view with "Push to MoySklad" button |
| `prisma/schema.prisma` | `moySkladOrderId` and `moySkladSyncedAt` fields on Order model |
| `.env.example` | Template showing `MOYSKLAD_LOGIN` and `MOYSKLAD_PASSWORD` |

## Customer / Counterparty Handling

When an order is pushed, the integration handles the customer (counterparty) as follows:

### Lookup Flow (never modifies existing counterparties)

```
1. Search by PHONE (cleaned, no spaces) → found? use it
         ↓ not found
2. Search by EMAIL                      → found? use it
         ↓ not found
3. Search by NAME                       → found? use it
         ↓ not found
4. CREATE new counterparty
```

### New Counterparty Fields

| Field | Value | Source |
|-------|-------|--------|
| `name` | Customer full name | Checkout form |
| `email` | Customer email | Checkout form |
| `phone` | Phone (spaces stripped) | Checkout form |
| `companyType` | `individual` | Hardcoded |
| `description` | `"Created from genosys.ae order"` | Hardcoded |

### Returning Customers

If a customer has ordered before (same phone or email), they are matched to their existing MoySklad counterparty. No duplicate counterparties are created, and existing counterparty data is never overwritten.

### Where Counterparties Appear in MoySklad

New counterparties appear under: **Контрагенты** (Counterparties) → type **Физлицо** (Individual).

## MoySklad Order Format

Each order created in MoySklad includes:

- **Name**: Order number (e.g., `CODW2602155957`)
- **Organization**: Genosys Middle East FZ-LLC
- **Counterparty**: Customer (found by phone/email or created)
- **Store**: Genosys Warehouse
- **State**: Новый (New)
- **Currency**: AED
- **VAT**: 5% (included in prices, applied to both products and delivery)
- **Description**: Payment method, shipping cost, any unmapped items
- **Shipping Address**: Structured `shipmentAddressFull` with `country` (UAE), `city` (emirate), `street` (customer's free-form address)
- **Positions**: Line items with quantities and prices

### Delivery Address — Important

The integration sends the delivery address as a **structured object** (`shipmentAddressFull`) rather than a plain string (`shipmentAddress`). This is mandatory for the MoySklad UI's "Адрес доставки" field to populate.

If you send `shipmentAddress` as a plain string, MoySklad dumps the whole thing into `shipmentAddressFull.addInfo` (additional info / comment field) and leaves `street`, `city`, `country` blank — which means the UI shows a blank delivery address even though the data was technically accepted.

The two fields are mutually exclusive; sending both at once causes the API to reject the request.

**UAE country reference**: `8afef359-33c6-11ea-0a80-0043000aceae` (the account's custom "UAE" country entry). Do not use the generic "Объединенные Арабские Эмираты" ISO entry — the account uses the English-named one.

## Troubleshooting

### Orders not appearing in MoySklad

1. Check that `MOYSKLAD_LOGIN` and `MOYSKLAD_PASSWORD` are set in Vercel env vars
2. Open the order in admin panel and click "Push to MoySklad"
3. Check toast notification for error message
4. Check Vercel server logs for "MoySklad" entries
5. Verify the product name in the webapp matches the `PRODUCT_MAP` keys

### "Unmapped items" in order description

This means the webapp product name (and color, if applicable) wasn't found in `PRODUCT_MAP` or `COLOR_VARIANT_MAP`. The order is still created, but without those line items. Add the mapping as described above.

### Wrong product variant (e.g. Ivory showing instead of Beige)

For products with color variants, ensure `OrderItem.color` is set in the database and that the color is in `COLOR_VARIANT_MAP` in `lib/moysklad.ts`. The push route passes `item.color` to the mapper.

### Button shows "Synced to MoySklad" but order not in MoySklad

The `moySkladOrderId` was saved to the database. Check MoySklad directly using the UUID stored in the database.

### Duplicate orders

This shouldn't happen because:
- The API returns 409 if `moySkladOrderId` is already set
- The UI shows "Synced" badge instead of push button after successful push

## API Reference

MoySklad JSON API 1.2: https://dev.moysklad.ru/doc/api/remap/1.2/

### Endpoints Used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/entity/counterparty?filter=phone=...` | Find customer by phone |
| GET | `/entity/counterparty?filter=email=...` | Find customer by email |
| GET | `/entity/counterparty?filter=name=...` | Find customer by name |
| POST | `/entity/counterparty` | Create new customer |
| POST | `/entity/customerorder` | Create customer order |

## Full API Access (Read-Only)

Beyond the order-push integration, the same credentials provide full read access to all MoySklad data. This is used for financial reporting and stock analysis.

### Reporting Scripts

| Script | Purpose |
|:---|:---|
| `scripts/moysklad-q1-report.js` | Full Q1 2026 financial report (all document types) |
| `scripts/moysklad-invoices-export.js` | Customer invoices export to CSV + Markdown |
| `scripts/moysklad-2025-financials.js` | 2025 revenue, COGS, payments, losses |
| `scripts/moysklad-2025-expenses.js` | 2025 expense categorization by counterparty |

**Usage:**
```bash
MOYSKLAD_LOGIN="email" MOYSKLAD_PASSWORD="pass" node scripts/moysklad-invoices-export.js
```

### Available Read Endpoints

| Endpoint | Description | Date Filter |
|:---|:---|:---|
| `GET /entity/invoiceout` | Customer invoices | `filter=moment>=...;moment<=...` |
| `GET /entity/invoicein` | Supplier invoices | Same |
| `GET /entity/customerorder` | Customer orders | Same |
| `GET /entity/demand` | Shipments | Same |
| `GET /entity/paymentin` | Incoming payments | Same |
| `GET /entity/paymentout` | Outgoing payments | Same |
| `GET /entity/cashin` | Cash receipts | Same |
| `GET /entity/cashout` | Cash disbursements | Same |
| `GET /entity/supply` | Goods receipts | Same |
| `GET /entity/loss` | Inventory write-offs | Same |
| `GET /report/profit/byproduct` | Profit by product | `momentFrom=...&momentTo=...` |
| `GET /report/stock/all` | Current stock snapshot | None |
| `GET /report/money/byaccount` | Account balances | None |

**Date filter syntax for entities:**
```
GET /entity/invoiceout?filter=moment>=2026-01-01 00:00:00;moment<=2026-03-31 23:59:59
```

**Date filter syntax for reports:**
```
GET /report/profit/byproduct?momentFrom=2026-01-01 00:00:00&momentTo=2026-03-31 23:59:59
```

For full details, see [SESSION_CHANGES_2026-04-06.md](./SESSION_CHANGES_2026-04-06.md).

## History

- **Feb 14, 2026**: Integration created with automatic sync from checkout routes
- **Feb 15, 2026**: Refactored to manual admin push (automatic sync was unreliable on Vercel serverless)
- **Feb 20, 2026**: Added color variant mapping for BB cushion (Ivory/Beige/Camel) — items with different colors now sync to correct MoySklad products
- **Apr 6, 2026**: Discovered full API read access. Created reporting scripts for financial statements, invoice exports, stock analysis, and expense categorization
- **Apr 17, 2026**: Two push-integration bug fixes (FTA compliance + UI usability):
  - Delivery service line now sent with `vat: 5, vatEnabled: true` (was `vat: 0`) — fixes under-declaration of output VAT on shipping revenue
  - Delivery address now sent as structured `shipmentAddressFull` (country + city + street) instead of plain-string `shipmentAddress` — fixes the blank "Адрес доставки" field in MoySklad UI. Added `MOYSKLAD_COUNTRY_UAE_ID` constant

---

*Integration created: February 14, 2026*
*Refactored to manual push: February 15, 2026*
*Color variant mapping: February 20, 2026*
*Full API reporting: April 6, 2026*
*VAT + address fixes: April 17, 2026*
