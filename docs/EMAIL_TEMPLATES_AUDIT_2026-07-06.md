# Email Templates — Admin Order Source + Customer Polish — 2026-07-06

## 1. Admin new-order email: "Order Source" line (app vs website) — DONE

Requested: admin should see whether a new paid order came from the app or the website.

The order **channel is already encoded in the order number** (`lib/orderNumber.ts`):
`CODM…`/`GENCardM…` = mobile app, `CODW…`/`GENCardW…` = website. New helper
`lib/orderChannel.ts` (`resolveOrderChannel`) reads that letter, with the order's
`paymentMetadata.source` (`mobile_app`) as a backstop and legacy `GEN…` web orders
defaulting to website. Verified against the 20 most recent production orders —
every one resolved correctly (app vs website).

`sendAdminNewOrderNotification` now derives the source for **every** caller (web
Stripe webhook, web COD, mobile order create, manual/resend admin tools) without
editing each route, and the admin template renders an **admin-only** purple
"Order Source: 📱 Mobile App / 🌐 Website" block under Payment Status. Customer
emails are untouched (this block only exists in `adminNewOrder`).

## 2. Customer order-confirmation email — corporate/professional polish — DONE

The confirmation email (the one every buyer receives) was clean but its footer was
bare: company name + "official distributor" + copyright, with **no support contact
and no links**. Added, matching the existing Apple-clean aesthetic (muted grays,
`#0071e3` links, hairline divider — no loud colors):

- **"Need help with your order?"** support row → WhatsApp + `sales@genosys.ae`
  (the same contact already used in the welcome email).
- **Brand links row**: Shop · Instagram · Track Order.
- **Corporate identity**: bolded legal name `Genosys Middle East FZ-LLC`, official
  distributor line, and `Dubai, United Arab Emirates`.
- New i18n keys `needHelp` + `shopOnline` in EN/AR/RU (existing `trackOrder` reused).

## Further suggestions (not yet done — for review)

- **Unify contact details**: `lib/siteConfig.ts` SOCIAL_LINKS uses phone
  `+971 50 731 9498` / `info@genosys.ae`, while email templates + chatbot use
  WhatsApp `+971 58 548 76 65` / `sales@genosys.ae`. Pick one canonical set and
  reference it everywhere (I used the template/chatbot set for consistency with what
  customers already see).
- **Apply the same footer** to the shipped/delivered/welcome/password-reset emails
  for a consistent corporate signature (each currently has its own minimal footer).
- **VAT/TRN line**: if GENOSYS has a Tax Registration Number, adding "TRN: …" to the
  confirmation footer makes it a more official tax-compliant receipt.
- Optional: a small product-category banner or "authorized distributor" seal image
  for extra brand authority — deferred (needs an asset + careful email-client testing).

## Verification

`tsc --noEmit` clean, full web build clean, resolver validated on live order numbers.
Server-only change — deployed via main; no app build needed.
