# GENOSYS Rewards Wallet Passes

**Date:** 15 September 2026  
**Scope:** Apple Wallet and Google Wallet loyalty cards for retail Rewards
members across desktop web, mobile web/PWA, and the native Expo app.

## Locked launch scope

- Retail `REWARDS` accounts only. Professional Partner accounts remain on
  their existing contractual-pricing card and are rejected by wallet APIs.
- Native apps use short-lived signed HTTPS installation URLs. No PassKit or
  Google Wallet native SDK is required for the first release.
- The server loyalty ledger remains authoritative for points, tier, and AED
  value.
- QR values are opaque identifiers. They contain no email, database user ID,
  points balance, or redemption authority.

## Provider setup required before activation

### Apple

1. Create Pass Type ID `pass.ae.genosys.rewards`.
2. Create and export its signing certificate and private key.
3. Download the Apple WWDR G4 intermediate certificate.
4. Store all PEM material as base64 Vercel environment secrets.
5. Record the Apple Team ID. Apple Sign-In keys are not Wallet signing keys.

### Google

1. Create a Google Wallet Issuer account and complete the business profile.
2. Enable Google Wallet API in a dedicated Google Cloud project.
3. Create a dedicated service account and authorize it in the issuer account.
4. Create the GENOSYS Rewards LoyaltyClass in demo mode.
5. Add test accounts, complete physical Android testing, and request publishing
   access.

## Safety

`WALLET_PASSES_ENABLED`, `APPLE_WALLET_ENABLED`, and
`GOOGLE_WALLET_ENABLED` default to false. A provider reports ready only when
its individual switch and every required secret are present. No certificate,
private key, service-account JSON, or generated pass is committed.

## Delivery log

- Chunk 0: dormant capability configuration, environment documentation, and
  fail-closed tests.
- Chunk 1: additive `wallet_passes` and `apple_wallet_registrations` schema,
  opaque provider IDs, five-minute HMAC install tokens, signed QR identifiers,
  canonical ledger-backed pass data, and separate session/CSRF and mobile
  bearer issuance endpoints.
- Chunk 2: Apple `storeCard` renderer with required icon/logo scales,
  EN/RU/AR localization, server-secret certificate decoding, stable update
  authentication, QR membership identifier, short-lived public `.pkpass`
  delivery, no-store headers, and renderer/model tests.

Apple remains dormant because no Pass Type certificate, private key, or WWDR
certificate is configured locally or in the inspected environment. Physical
iPhone installation is a release gate, not bypassed by test certificates.

- Chunk 3: Google LoyaltyClass/LoyaltyObject builders, dedicated service
  account authentication, idempotent REST creation/PATCH, localized pass
  fields, opaque-object signed save JWT, and install redirect.

Google remains dormant because no Wallet Issuer ID, class, or dedicated
service-account credential is configured. Demo-account physical testing,
review screenshots, and publishing-access submission require those external
Google Wallet Console prerequisites.

- Chunk 4: provider capabilities added to both membership APIs; official
  Apple/Google badge artwork; retail-only desktop/mobile web/PWA controls with
  CSRF-protected issuance, platform selection, loading/error states and
  EN/RU/AR copy; native app uses the same contract through `expo-web-browser`.
  All controls remain absent while providers are dormant.

Google pass details were consolidated to two text modules to follow the
current Wallet layout guidance.

- Chunk 5: Apple registration/unregistration, changed-serial and fresh-pass
  web-service endpoints; certificate-authenticated APNs pass pushes; Google
  PATCH/deactivation; coalesced revision queue with retry backoff; provider
  sync and nightly fingerprint reconciliation crons; order earn, review,
  redemption, reversal, tier/name change and anonymization hooks.
- The obsolete Apple-only `membership/wallet-pass` placeholder route was
  removed after the new authenticated provider route became the canonical
  contract.

## Migration note

Production contains a rolled-back, zero-step historical migration named
`20260709030000_add_order_review_request_sent`. The successful replacement
`20260709030000_add_order_review_request_fields` is present both in production
and the repository. The rolled-back record explains the `migrate status`
history warning and must not be recreated or marked applied.
