# Product Search Relevance — 2026-07-24

## Problem

Product search matched the correct products but kept the catalog's “Newest
First” order. Bundles and unrelated products that mentioned a term in their
description could therefore appear above the product whose name contained the
term.

Example: searching `hyaluron` placed beauty boxes above product 29,
**MOISTURE REPLENISHING HYALURON CREAM**.

## Fix

- Added relevance scoring in `lib/productSearch.ts`.
- Exact and direct product-name matches outrank category and description
  matches.
- Search relevance is the primary order for both autocomplete suggestions and
  the main result grid.
- The selected catalog sort remains the tie-breaker between equally relevant
  products.

## Verification

- Live-catalog ranking for `hyaluron`:
  1. Product 29 — HYALURON CREAM
  2. Product 18 — HYALURON SERUM
  3. Deep Moisturizing Beauty Box
- Added three unit tests covering direct-name, multi-token, and
  description-only ranking.
- TypeScript check passes.
