# MoySklad address format — strip City/UAE from street (2026-08-12)

## Symptom

Order **GENCardW2608129706** (Daria Korneva) showed:

`UAE, Dubai, Binghatti Jasmine 218, Dubai, UAE`

## Cause

Website stores canonical address: `Binghatti Jasmine 218, Dubai, UAE` + emirate `Dubai`.  
Push put the **full** string into `shipmentAddressFull.street` while also setting `city=Dubai` and `country=UAE`. MoySklad UI concatenates all three → duplicate.

## Agreed format (unchanged on website)

`Street, City, UAE` → e.g. `Binghatti Jasmine 218, Dubai, UAE`

## Fix

1. New helper `lib/moyskladAddress.ts` — `streetForMoySklad` / `buildMoySkladAddressFull`
2. `lib/moysklad.ts` push uses street-only for order + new counterparty
3. Unit tests: `__tests__/lib/moyskladAddress.test.ts` (5 passed)

## Corrected live docs

| Doc | Address now |
|-----|-------------|
| SO GENCardW2608129706 | `UAE, Dubai, Binghatti Jasmine 218` |
| Demand 06671 | same |
| Counterparty Daria Korneva | street-only + cleared `addInfo` dump |
