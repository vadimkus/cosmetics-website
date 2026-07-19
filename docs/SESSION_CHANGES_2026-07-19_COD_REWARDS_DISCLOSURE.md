# COD Rewards disclosure

Date: 2026-07-19

## Change

- COD order-confirmation emails now show the estimated GENOSYS Rewards points for the order.
- Mobile-app COD confirmations use the same estimate and timing disclosure as website COD confirmations.
- The website success page shows the same estimate for authenticated COD customers.
- Both surfaces state that points are credited only after COD payment is collected and the order is marked delivered.
- Shipping is explicitly excluded from points.
- Estimates use the authoritative loyalty rules: net product spend, current member tier, birthday multiplier, and no rewards for Professional Partner accounts.
- EN, RU, and AR wording is included.

## Example verified

Order `CODW2607196058` has AED 300 eligible product spend and AED 45 shipping. The customer is SILVER (1.25×), so the displayed estimate is 375 points. The order currently has no points because it is not delivered yet.

Mobile order `CODM2607197947` has AED 1,200 eligible product spend and free shipping. The customer is SILVER (1.25×), so the mobile confirmation displays an estimate of 1,500 points.

## Verification

- TypeScript: pass.
- ESLint on changed application files: pass.
- Loyalty estimate and COD email tests: 11 passed.
