# MoySklad Integration

## Overview

Orders placed on **genosys.ae** are automatically synced to MoySklad (МойСклад) accounting system.

This is a **one-way sync**: genosys.ae → MoySklad. The integration only **creates** new customer orders and counterparties — it never modifies or deletes existing MoySklad data.

## How It Works

```
Customer places order on genosys.ae
         ↓
Order saved to PostgreSQL database
         ↓
Email confirmations sent (customer + admin)
         ↓
MoySklad order created (fire-and-forget, non-blocking)
         ↓
Customer/counterparty found or created in MoySklad
         ↓
Order with line items appears in MoySklad
```

### Integration Points (3 checkout flows)

| Flow | Route | Payment | When MoySklad order is created |
|------|-------|---------|-------------------------------|
| **Web COD** | `app/api/checkout/route.ts` | Cash on Delivery | Immediately after order is saved |
| **Stripe (Web + Mobile)** | `app/api/webhooks/stripe/route.ts` | Card / Apple Pay | After Stripe confirms payment (`checkout.session.completed`, `payment_status === 'paid'`) |
| **Mobile COD** | `app/api/mobile/orders/route.ts` | Cash on Delivery | Immediately after order is saved |

### Safety Guarantees

- **Non-blocking**: MoySklad call is `fire-and-forget` — if MoySklad is down or returns an error, the customer's checkout is NOT affected
- **No overwrites**: Existing MoySklad products, counterparties, and orders are never modified
- **Idempotent counterparties**: Customers are searched by phone → email → name before creating a new one
- **Graceful degradation**: If `MOYSKLAD_LOGIN` / `MOYSKLAD_PASSWORD` env vars are not set, the integration is silently disabled

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

**IMPORTANT**: You must add `MOYSKLAD_LOGIN` and `MOYSKLAD_PASSWORD` to Vercel environment variables for the integration to work in production.

## Files

| File | Purpose |
|------|---------|
| `lib/moysklad.ts` | Main integration module — API client, product mapping, order creation |
| `app/api/checkout/route.ts` | Web COD checkout — calls `createMoySkladOrder()` |
| `app/api/webhooks/stripe/route.ts` | Stripe webhook — calls `createMoySkladOrder()` on payment confirmation |
| `app/api/mobile/orders/route.ts` | Mobile COD — calls `createMoySkladOrder()` |
| `.env.example` | Template showing `MOYSKLAD_LOGIN` and `MOYSKLAD_PASSWORD` |

## MoySklad Order Format

Each order created in MoySklad includes:

- **Name**: Order number (e.g., `W-COD-20260214-001`)
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
2. Check server logs for "MoySklad" entries
3. Verify the product name in the webapp matches the `PRODUCT_MAP` keys

### "Unmapped items" in order description

This means the webapp product name wasn't found in `PRODUCT_MAP`. The order is still created, but without those line items. Add the mapping as described above.

### Duplicate orders

This shouldn't happen because:
- Web Stripe: Only creates on `checkout.session.completed` with `payment_status === 'paid'` and only if `!wasAlreadyPaid`
- COD: Only creates once per checkout request
- Mobile COD: Only creates once per order

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

---

*Integration created: February 14, 2026*
