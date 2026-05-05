# Session: Product JSON-LD `audience` (Merchant listings)

**Date:** 2026-05-05  
**Site:** https://genosys.ae/  
**Source:** Google Search Console → Merchant listings structured data → non-critical issue **“Invalid object type for field `audience`”**.

## Root cause

PDP JSON-LD is emitted by `components/schema/ProductSchema.tsx`. The `audience` property used:

1. An **array** of two objects.
2. First object: **`@type": "Audience"`** with **`audienceType`** as free text.
3. Second object: **`@type": "PeopleAudience"`** with only **`audienceType`** text.

For **Merchant Center–compatible** `Product` markup, Google documents `audience` as a **[PeopleAudience](https://schema.org/PeopleAudience)** object that carries **gender** (`suggestedGender`: `male` | `female` | `unisex`) and/or **age** (`suggestedMinAge`, `suggestedMaxAge`, or `suggestedAge` min/max). See [Supported structured data attributes and values](https://support.google.com/merchants/answer/6386198).

Generic **`Audience`** and prose-only **`audienceType`** do not match that contract, so Search Console reports an invalid type for merchant validation.

## Fix (shipped)

- **Single** `audience` object (not an array), `@type": "PeopleAudience"`.
- `suggestedGender`: `"unisex"` (cosmetics applicable across genders).
- `suggestedMinAge`: `13` (maps to Google’s documented **adult** age band minimum; adjust to `18` if you want a stricter adult-only signal).

B2B vs consumer wording (“professionals”, “clinics”, etc.) stays in **`description`** and **`additionalProperty`** (“Professional Grade”, concerns, usage) — appropriate for humans and AI overviews, not for the merchant `audience` field.

## Files changed

| File | Change |
|------|--------|
| `components/schema/ProductSchema.tsx` | Replaced invalid `audience` array with one `PeopleAudience`; comment links Merchant Center doc. |
| `docs/README.md` | Quick Links row for this session note. |
| `docs/SESSION_CHANGES_2026-05-05_PRODUCT_SCHEMA_AUDIENCE.md` | This document. |

## Verification (after deploy)

1. [Rich Results Test](https://search.google.com/test/rich-results) — live PDP with a real price (schema is skipped for `price <= 0` / on-request).
2. Search Console → **Validate fix** on the Merchant listings issue after recrawl.
3. Optional: view page source and confirm one `"audience": { "@type": "PeopleAudience", ... }` block in the `application/ld+json` script.

## References

- https://support.google.com/merchants/answer/6386198  
- https://schema.org/audience  
- https://schema.org/PeopleAudience  
