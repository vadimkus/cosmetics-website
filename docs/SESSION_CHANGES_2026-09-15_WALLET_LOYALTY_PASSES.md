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

Apple signing material is configured in production and live issuance has been
verified on a physical iPhone.

- Chunk 3: Google LoyaltyClass/LoyaltyObject builders, dedicated service
  account authentication, idempotent REST creation/PATCH, localized pass
  fields, opaque-object signed save JWT, and install redirect.

Google implementation is configured and verified in demo mode. Public
activation remains off until the issuer's verified payments profile is linked
and Google grants publishing access.

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
- The obsolete Apple-only `membership/wallet-pass` placeholder now returns
  `410 ENDPOINT_RETIRED`; the explicit-provider route is the canonical
  contract.

## Operations

- Admin health: authenticated `GET /api/admin/wallet/health` reports readiness,
  pass counts, pending/failed synchronization, oldest pending timestamp, and
  Apple certificate expiry without exposing credentials.
- Apple certificate renewal: create a replacement certificate for the same
  Pass Type ID, replace the three base64 secrets, verify a test pass and push,
  then redeploy. Existing serial numbers and authentication tokens stay stable.
- Google rotation: authorize the replacement service account in the same
  Wallet Issuer, replace its base64 JSON secret, verify GET/PATCH, then revoke
  the old key.
- Recovery: correct the provider configuration or outage, clear/advance
  `nextSyncAt` for affected rows if necessary, and run the protected wallet
  sync cron. Retries use bounded exponential backoff and retain a sanitized
  last error.
- Rollback: turn off the individual provider flag or the master flag. Existing
  wallet cards remain installed; no new links or provider calls are produced.
- Account deletion: passes are queued inactive before PII anonymization.
  Apple receives a voided pass and Google receives `INACTIVE`.
- No Wallet URL, QR value, provider log, admin health response, or Sentry event
  contains customer email or database user ID.

## Verification

- Prisma schema validated and both additive production migrations deployed.
- Wallet unit/component/security tests pass, including token tampering/expiry,
  partner rejection, opaque URLs/QRs, Apple web-service auth, dirty-state
  failure isolation, fingerprint changes and provider badge visibility.
- Full website suite: 135 suites passed, 1,494 tests passed, 3 skipped.
- Production Next.js build passed.
- Native wallet smoke, full ESLint and no-dash guard passed.
- Expo production export passed for iOS and Android on runtime 1.12.0.
- Wallet-specific production dependency audit is clear after overriding
  `passkit-generator`'s vulnerable Joi pin to 17.13.6. The repository still
  reports unrelated pre-existing framework/development advisories.
- Live deployment verified: admin health rejects unauthenticated access (401),
  the retired placeholder returns 410, an unsigned install request returns
  401, and all Apple/Google badge assets return 200.

Apple physical testing passed. Google REST authentication, class lookup,
object creation, signed Save URL, and card saving passed in demo mode.
Google remains hidden from customers while publishing access is incomplete.

## Apple provider setup (15 September 2026)

- Registered Pass Type ID `pass.ae.genosys.rewards` for Genosys Middle East
  FZ-LLC.
- Generated a local RSA private key and CSR under the mode-700
  `~/.genosys-wallet/` directory; private material is outside Git.
- Issued certificate `GENOSYS Rewards Wallet`, valid from 15 September 2026
  through 15 October 2027.
- Downloaded the official Apple WWDR G4 intermediate, verified the leaf chain,
  and confirmed the certificate public key matches the generated private key.
- Generated `~/Desktop/GENOSYS-Rewards-Test.pkpass`; ZIP contents and detached
  PKCS7 signature verified successfully.
- Added Apple production secrets to Vercel with the master
  `WALLET_PASSES_ENABLED` switch still false. A redeploy/activation waits for
  visual acceptance on a physical Apple device.
- Design validation: the original four supporting fields overlapped the
  native QR; a large primary Points field also forced Tier/Value into the
  barcode band. Final Apple-native layout keeps Points in the top-right
  header, Tier and Rewards Value as the only two front supporting fields,
  moves Member Number/Earn Rate to the back, and adds `GENOSYS MIDDLE EAST`
  beneath the wordmark. Apple fixes native barcodes to the bottom of Store
  Cards, so no artificial QR image or non-native positioning is used.
- Enabled the master production switch with Apple enabled and Google still
  disabled, then redeployed the Git-backed production deployment (not the
  dirty local worktree).
- Live end-to-end issuance passed for retail member `GNS-00001-AE`: authenticated
  mobile issuance 200, signed install download 200,
  `application/vnd.apple.pkpass`, 96 KB valid archive, and no email/database
  user ID in the install URL. Saved the result as
  `~/Desktop/GENOSYS-Rewards-Live.pkpass`.

## Google provider setup (15 September 2026)

- Google Wallet Issuer ID: `3388000000023204165`.
- Created and approved the demo LoyaltyClass. The console automatically
  prefixed the entered value, so its canonical API ID is
  `3388000000023204165.3388000000023204165.genosys_rewards`.
- Created dedicated Google Cloud project `genosys-wallet`, enabled
  `walletobjects.googleapis.com`, and created service account
  `genosys-wallet-issuer@genosys-wallet.iam.gserviceaccount.com`.
- Added that service account to the Pay & Wallet Console with Developer access.
  Its JSON key is stored outside Git under
  `~/Desktop/Drive/Genosys/Google/` with mode 600 and as a sensitive Vercel
  production secret.
- Added `GOOGLE_WALLET_ISSUER_ID`, `GOOGLE_WALLET_CLASS_ID`, and
  `GOOGLE_WALLET_SERVICE_ACCOUNT_JSON_B64` to production.
- Added production-compliant 1024 px square and 1280 x 400 wide logo assets.
  Google REST GET for the class returned 200; a test LoyaltyObject was created,
  its signed Save URL opened, and the pass was saved to Vadim's Google Wallet.
  The rendered card shows 100 points, member ID, QR, membership details, reward
  instructions, and the account link.
- Completed the public business-information section with GENOSYS website,
  support contacts, phone, and MCC 7298. Existing Google payments profile
  `6368-1116-8429` is an Organization profile whose GENOSYS name and address
  were already verified in February 2026.
- Remaining external gate: Pay & Wallet Console currently returns
  “Couldn't pull up your info” while loading that verified payments profile.
  Link the profile manually, then submit publishing access. Keep
  `GOOGLE_WALLET_ENABLED=false` until Google removes the TEST ONLY restriction.

## Migration note

Production contains a rolled-back, zero-step historical migration named
`20260709030000_add_order_review_request_sent`. The successful replacement
`20260709030000_add_order_review_request_fields` is present both in production
and the repository. The rolled-back record explains the `migrate status`
history warning and must not be recreated or marked applied.
