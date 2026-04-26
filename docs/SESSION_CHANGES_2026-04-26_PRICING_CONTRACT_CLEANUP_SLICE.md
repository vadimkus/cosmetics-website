# Pricing Contract Cleanup Slice — 2026-04-26

## Context

This is the first cleanup pass after the pricing contract migration was deployed and manually verified on desktop and iOS. Android was not manually checked because no Android device was available, so this pass stays conservative.

Goal: continue reducing duplicated read-only pricing display logic while keeping checkout/payment math and stale-client fallback paths intact.

## Changes

- Migrated remaining `app/skin-recommendation/SkinRecommendationClient.tsx` read-only price displays to `getPricingDisplay()`.
- Added `pricing: buildPricingContract(...)` to `GET /api/mobile/concerns/[slug]` product payloads so native concern screens can consume the same server contract as product APIs.
- Left checkout math, cart-store math, and payment/order pricing untouched.
- Left `lib/discountUtils.ts` and `lib/pricingEngine.ts` in place because the server pricing contract still uses them as the canonical adapter source.

## Guardrails

- The server pricing contract is now the source of truth for display payloads.
- Legacy `price`, `displayPrice`, and `originalPrice` fields remain in API responses for old app builds and stale cached carts.
- Checkout/order totals are not migrated in this slice; they remain on the existing tested path until Android is manually verified or covered by a simulator pass.
- Bundle builder remains special: bundle pricing must use retail price only and must not stack VIP/user discounts.

## Verification

- `npm run smoke:pricing-contract`
- `npm run build`

Build note: `npm run build` regenerated `lib/swVersion.ts`; the file was restored to the committed value because it is generated metadata and not part of this code change.

## Rollback

Revert this cleanup commit only. Earlier pricing contract slices are independent and do not need to be reverted unless the issue traces back to the original contract adapter.
