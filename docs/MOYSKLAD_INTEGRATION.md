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

### Unmapped Products

Some webapp products like **beauty boxes** (ANTI-AGING BEAUTY BOX, CHARMING LOOK BEAUTY BOX, etc.) are custom bundles that don't have a 1:1 MoySklad product. These are noted in the order description in MoySklad but won't have line items.

### Adding New Products

When a new product is added to the webapp:

1. Find the product's MoySklad UUID via MoySklad API or web UI
2. Add the mapping to `PRODUCT_MAP` in `lib/moysklad.ts`
3. Deploy the change

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
| `lib/moysklad.ts` | Main integration module — API client, product mapping, order creation |
| `app/api/admin/orders/[id]/push-moysklad/route.ts` | Admin API endpoint to push an order to MoySklad |
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
- **VAT**: 5% (included in prices)
- **Description**: Payment method, shipping cost, any unmapped items
- **Shipping Address**: Customer address + emirate + UAE
- **Positions**: Line items with quantities and prices

## Troubleshooting

### Orders not appearing in MoySklad

1. Check that `MOYSKLAD_LOGIN` and `MOYSKLAD_PASSWORD` are set in Vercel env vars
2. Open the order in admin panel and click "Push to MoySklad"
3. Check toast notification for error message
4. Check Vercel server logs for "MoySklad" entries
5. Verify the product name in the webapp matches the `PRODUCT_MAP` keys

### "Unmapped items" in order description

This means the webapp product name wasn't found in `PRODUCT_MAP`. The order is still created, but without those line items. Add the mapping as described above.

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

## History

- **Feb 14, 2026**: Integration created with automatic sync from checkout routes
- **Feb 15, 2026**: Refactored to manual admin push (automatic sync was unreliable on Vercel serverless)

---

*Integration created: February 14, 2026*
*Refactored to manual push: February 15, 2026*
