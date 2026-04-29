# Profitability Report Tab

Date: 2026-04-29

## Summary

Added an admin-only profitability report to the GENOSYS portal.

The report runs on demand from `genosys.ae/admin` and pulls read-only MoySklad data for the selected period. It compares the selected period against:

- Previous month like-for-like
- Same period last year

## Files

- `components/admin/ProfitabilityReportTab.tsx`
- `app/api/admin/reports/profitability/route.ts`
- `lib/moyskladReports.ts`
- `components/admin/AdminTabNavigation.tsx`
- `app/admin/page.tsx`

## Data Source

MoySklad is the source of truth for profitability because website orders alone do not include:

- Manual B2B / salon / clinic sales
- Actual sell cost / COGS
- MoySklad profit report gross margin
- Payment-out / cash movement
- Inventory purchase payments
- Tax remittance timing

The server module uses these MoySklad endpoints:

- `report/profit/bycounterparty`
- `report/profit/byproduct`
- `report/profit/byemployee`
- `entity/demand`
- `entity/customerorder`
- `entity/invoiceout`
- `entity/salesreturn`
- `entity/paymentin`
- `entity/cashin`
- `entity/paymentout`
- `entity/cashout`
- `entity/supply`
- `entity/invoicein`

## Admin UX

New tab: `Profitability`

Controls:

- `From` date
- `To` date
- `Current month`
- `Previous month`
- `Generate Report`

Report sections:

- Net sales
- COGS / sell cost
- Gross profit
- Gross margin
- Sales count
- Average check
- Operating profit read before tax remittance
- Comparison table
- Profitability view
- Expense breakdown
- Category mix
- Top products
- Top customers
- Top outgoing payments

## Security

- API route is admin-only via `requireAdminAuth`.
- `POST` request requires CSRF via `requireCsrfToken`.
- MoySklad credentials remain server-only via environment variables.
- Report date range is validated and capped at `366` days.
- MoySklad calls are read-only.

## Verification

- Focused ESLint on changed files: passed with no new errors.
- Existing unrelated warning remains in `app/admin/page.tsx` around `showToast` dependency.
- Full TypeScript check still fails on pre-existing test typing issues (`jest-dom` matchers and stale `Product.stock` mocks), unrelated to this feature.
- Live module smoke test against MoySklad succeeded.
- Full Apr 1-29 2026 report reproduced the known figures:
  - Net sales: `122,797.31 AED`
  - Gross profit: `86,319.83 AED`
  - Gross margin: `70.3%`
  - Sales count: `133`
  - Operating profit read: `34,229.56 AED`
  - Cash net: `12,975.41 AED`
  - vs March like-for-like: revenue `-17.8%`, gross profit `-16.5%`
  - vs April 2025 like-for-like: revenue `+5.5%`, gross profit `+5.4%`

## Notes

This first version generates the report synchronously. The full April report completed in about `35` seconds locally. If production Vercel timeouts are tight, the next upgrade should move report generation to an async job with polling and saved report history.
# Profitability Report Tab

Date: 2026-04-29

## Summary

Added an admin-only profitability report to the GENOSYS portal.

The report runs on demand from `genosys.ae/admin` and pulls read-only MoySklad data for the selected period. It compares the selected period against:

- Previous month like-for-like
- Same period last year

## Files

- `components/admin/ProfitabilityReportTab.tsx`
- `app/api/admin/reports/profitability/route.ts`
- `lib/moyskladReports.ts`
- `components/admin/AdminTabNavigation.tsx`
- `app/admin/page.tsx`

## Data Source

MoySklad is the source of truth for profitability because website orders alone do not include:

- Manual B2B / salon / clinic sales
- Actual sell cost / COGS
- MoySklad profit report gross margin
- Payment-out / cash movement
- Inventory purchase payments
- Tax remittance timing

The server module uses these MoySklad endpoints:

- `report/profit/bycounterparty`
- `report/profit/byproduct`
- `report/profit/byemployee`
- `entity/demand`
- `entity/customerorder`
- `entity/invoiceout`
- `entity/salesreturn`
- `entity/paymentin`
- `entity/cashin`
- `entity/paymentout`
- `entity/cashout`
- `entity/supply`
- `entity/invoicein`

## Admin UX

New tab: `Profitability`

Controls:

- `From` date
- `To` date
- `Current month`
- `Previous month`
- `Generate Report`

Report sections:

- Net sales
- COGS / sell cost
- Gross profit
- Gross margin
- Sales count
- Average check
- Operating profit read before tax remittance
- Comparison table
- Profitability view
- Expense breakdown
- Category mix
- Top products
- Top customers
- Top outgoing payments

## Security

- API route is admin-only via `requireAdminAuth`.
- `POST` request requires CSRF via `requireCsrfToken`.
- MoySklad credentials remain server-only via environment variables.
- Report date range is validated and capped at `366` days.
- MoySklad calls are read-only.

## Verification

- Focused ESLint on changed files: passed with no new errors.
- Existing unrelated warning remains in `app/admin/page.tsx` around `showToast` dependency.
- Full TypeScript check still fails on pre-existing test typing issues (`jest-dom` matchers and stale `Product.stock` mocks), unrelated to this feature.
- Live module smoke test against MoySklad succeeded.
- Full Apr 1-29 2026 report reproduced the known figures:
  - Net sales: `122,797.31 AED`
  - Gross profit: `86,319.83 AED`
  - Gross margin: `70.3%`
  - Sales count: `133`
  - Operating profit read: `34,229.56 AED`
  - Cash net: `12,975.41 AED`
  - vs March like-for-like: revenue `-17.8%`, gross profit `-16.5%`
  - vs April 2025 like-for-like: revenue `+5.5%`, gross profit `+5.4%`

## Notes

This first version generates the report synchronously. The full April report completed in about `35` seconds locally. If production Vercel timeouts are tight, the next upgrade should move report generation to an async job with polling and saved report history.
