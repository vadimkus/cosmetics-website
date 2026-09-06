# Delivery VAT on website — check only — 2026-09-05

Vadim asked whether website adds 5% VAT on top of delivery (vs MoySklad Legal_TAX **04762**: Dubai 45 = 42.86 + VAT 2.14).

**Result: inclusive, not on top. No code change.**

Source: `lib/mobileCheckoutConfig.ts` `calculateVatIncluded` = `total × 0.05 / 1.05`.

Dubai 45 → VAT 2.14. Checkout/Stripe/COD/MoySklad sync all charge **45**, not 47.25. Stripe `automatic_tax: false`.
