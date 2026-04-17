# Session Changes — April 17, 2026

## Summary

Two production bug fixes in the MoySklad push integration (`lib/moysklad.ts`). Both were silent data-quality bugs — orders were pushing successfully, but with incorrect VAT on delivery and a blank delivery address in the MoySklad UI. Admin had been copy-pasting addresses manually.

**Fixes:**
1. **Delivery VAT** — was booking shipping income as 0% VAT, should be 5% (UAE FTA compliance)
2. **Delivery address** — was ending up in `addInfo` field instead of the structured address fields, so MoySklad UI showed blank

Files: `lib/moysklad.ts`, `docs/MOYSKLAD_INTEGRATION.md`, `docs/README.md`, `docs/SESSION_CHANGES_2026-04-17.md` (this file).

---

## 1. Delivery VAT Fix (FTA compliance)

### Problem

When pushing an order from genosys.ae to MoySklad, the delivery service line item (Excellent Delivery Dubai, Delivery Sharjah, etc.) was created with:
```ts
vat: 0,
vatEnabled: false,
```

Meanwhile, product line items correctly used:
```ts
vat: 5,
vatEnabled: true,
```

This meant every order pushed since Feb 14, 2026 had the delivery revenue booked as **VAT-exempt** in MoySklad, even though:
- UAE law taxes delivery services at 5% (not zero-rated, not exempt)
- The website's own checkout already charges VAT on shipping (`app/api/checkout/route.ts` line 169: `vat = calculateVatIncluded(subtotal + shipping)`)
- The customer paid 5% VAT on their 45 AED Dubai delivery

Result: **output VAT was under-declared** on the delivery portion of every order. FTA filing risk.

### Fix

`lib/moysklad.ts` — delivery service line item now uses:
```ts
vat: 5,
vatEnabled: true,
```

Since the order has `vatIncluded: true` at the top level, the 45 AED Dubai delivery stays at 45 AED gross, and MoySklad splits it as ~42.86 AED net + ~2.14 AED output VAT. Matches product line items and customer-facing total.

### Backfill

User manually corrected all historical orders in MoySklad (Feb 14 → Apr 17 range). No script needed.

---

## 2. Delivery Address Fix (UI usability)

### Problem

Admin reported that the "Адрес доставки" (Delivery Address) field was **blank** in the MoySklad UI for every order pushed from genosys.ae. Admin had to manually copy the address from the order description field into the address field.

### Root cause

The integration was sending the delivery address as a plain-string `shipmentAddress`:
```ts
shipmentAddress: "Damac hills 1, Golf Promenade 2A, Ap 1104, Dubai, Dubai, UAE"
```

MoySklad accepts this string, but silently auto-parses it into `shipmentAddressFull.addInfo` only — leaving the structured fields (`country`, `city`, `street`) **empty**. The MoySklad UI reads the main delivery-address field from the structured object, not from the plain string. So the UI showed blank even though the data was technically accepted.

Confirmed via direct API query of 5 recently pushed orders:
```json
{
  "shipmentAddress": "Damac hills 1\nGolf Promenade 2A\nAp 1104, Dubai, Dubai, Dubai, UAE",
  "shipmentAddressFull": {
    "addInfo": "Damac hills 1\nGolf Promenade 2A\nAp 1104, Dubai, Dubai, Dubai, UAE"
  }
}
```

All structured fields (`street`, `city`, `country`) were null/empty.

### Fix

Replaced plain-string `shipmentAddress` with structured `shipmentAddressFull`:

```ts
shipmentAddressFull: {
  country: entityMeta('country', MOYSKLAD_COUNTRY_UAE_ID),
  city: orderData.customerEmirate || '',
  street: (orderData.customerAddress || '').replace(/\s+/g, ' ').trim(),
},
```

Mapping:
- `country` → UUID `8afef359-33c6-11ea-0a80-0043000aceae` (account's custom "UAE" country entry)
- `city` → customer's selected emirate (Dubai, Sharjah, etc.)
- `street` → customer's free-form address, whitespace normalized

Added `MOYSKLAD_COUNTRY_UAE_ID` constant at the top of the file alongside the other entity-reference constants.

### Why the custom "UAE" country, not the ISO entry

MoySklad returned two UAE country entities for this account:
1. `8afef359-33c6-11ea-0a80-0043000aceae` — "UAE" (custom entry, no ISO code)
2. `3f61f555-cec9-4cdd-8567-4048cad055c7` — "Объединенные Арабские Эмираты" (ISO 784)

Used the custom "UAE" entry to match the English-named convention used throughout the MoySklad account.

### Critical: fields are mutually exclusive

From the MoySklad API docs: *"При одновременной передаче атрибутов shipmentAddress и shipmentAddressFull возвращается ошибка"* — you cannot send both. We now send only `shipmentAddressFull`.

### Verification

Created a throwaway test order via the API with the new structure, confirmed all structured fields populated, then deleted the test artifacts. MoySklad auto-generated a clean `shipmentAddress` string as a side-effect: `"UAE, Dubai, Damac hills 1, Golf Promenade 2A, Ap 1104"`.

---

## 3. Documentation Updates

- **`docs/MOYSKLAD_INTEGRATION.md`**:
  - New note under "Delivery Service Mapping" — delivery is 5% VAT, do not revert to 0
  - New "Delivery Address — Important" section explaining structured vs plain-string behaviour
  - UAE country UUID documented with rationale
  - History entry for Apr 17 fixes
- **`docs/README.md`** — today's session added to the Session Logs section

---

## Files Changed

| File | Change |
|------|--------|
| `lib/moysklad.ts` | Delivery line: `vat 0 → 5`. Address: string → structured object. Added `MOYSKLAD_COUNTRY_UAE_ID` constant |
| `docs/MOYSKLAD_INTEGRATION.md` | Added VAT-on-delivery note, delivery-address structured-field note, UAE country reference, Apr 17 history entry |
| `docs/README.md` | Added Apr 17 session log entry |
| `docs/SESSION_CHANGES_2026-04-17.md` | This file |

---

## Deployment

Both fixes take effect only for orders pushed **after** the next Vercel deployment. No backfill script — user manually corrected historical orders. No database migration, no env var changes.

---

*Session date: April 17, 2026*
