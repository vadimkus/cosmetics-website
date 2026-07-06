# Login/Auth Hardening — Web + App — 2026-07-06

Implements everything from the login-model inspection. Companion app changes in
`genosys-mobile-app` (same-day TestFlight build 94 / Android versionCode 89).

## 1. Session/token revocation (tokenVersion)

The gap: JWTs were valid until expiry no matter what — logout was client-side only,
and password change/reset did not kick existing sessions (web 30d, mobile up to 90d
with refresh grace).

- `users.tokenVersion INTEGER NOT NULL DEFAULT 0` added (applied to prod via direct
  SQL — the Accelerate role can't run DDL; `scripts/add-token-version-column.ts`
  kept for the record). 803 users at version 0.
- Every token creator now embeds `tv` (web session cookie + mobile JWT): login,
  Google/Apple callbacks (web + mobile), mobile register, mobile-session bridge,
  passkey login-verify, mobile refresh.
- Enforcement points (`tv ?? 0` vs `users.tokenVersion`):
  - `GET /api/auth/session` — every web page load/heartbeat → revoked cookies die
    within ~5 minutes.
  - `POST /api/mobile/auth/refresh` — revoked tokens can't be renewed.
  - `POST /api/mobile/auth/validate` — app startup validation.
- `bumpTokenVersion(userId)` helper (atomic increment) in `userStorageDb`, called by
  **both password-reset routes** after a successful reset → resetting a password now
  logs out every device. Legacy tokens without `tv` count as version 0, so no user
  was logged out by this deploy.

## 2. Plaintext password migration — COMPLETE

`scripts/migrate-plaintext-passwords.ts` bcrypt-hashed the remaining **48** legacy
plaintext passwords (0 remain). The lazy "upgrade on login" comparison paths were
removed from both login routes — passwords are now bcrypt-only end to end.

## 3. Smaller fixes

- **Social-login oracle**: "created with social login… sign in with Google" replaced
  with a method-agnostic hint on web + mobile login (doesn't reveal the provider;
  message also applied to mobile which previously said plain invalid-credentials).
- **Timing-safe compare** added to `verifyMobileToken` / `verifyMobileTokenIgnoreExpiration`
  (session tokens already had it).
- **Register password minimum 6 → 8** (aligned with reset policy): web + mobile API
  routes, web LoginModal/LoginClient client checks, app register screen (register
  mode only — login is not length-gated so legacy short passwords can still sign
  in), i18n strings updated in EN/AR/RU on both platforms.

## 4. Passkey/AutoFill groundwork (new binary required)

- AASA now serves a `webcredentials` section (`2842PLB7CS.ae.genosys.app`).
- App `associatedDomains` gains `webcredentials:genosys.ae`.
- Login screen inputs got `textContentType` (`username`/`password`, `newPassword`
  for register) → with the entitlement, iOS offers iCloud Keychain AutoFill and
  saves credentials on login. Groundwork for native app passkeys later (server
  WebAuthn endpoints already exist for web).

## 5. App biometric hygiene

Legacy v1 Face ID payloads stored the user's plaintext password in SecureStore.
After a successful v1 biometric login, the payload is now silently upgraded to
v2 `{email, token}` (no second Face ID prompt) and the stored password is purged.

## Build prep

App version 1.10.4, iOS buildNumber → **94**, Android versionCode → **89**,
runtimeVersion stays 1.10.4 (existing OTAs compatible). JS-side changes also
published via OTA for existing installs; the entitlement requires the new binary.

## Deferred (documented, not done)

- Native in-app passkey login (react-native-passkeys + mobile WebAuthn endpoints)
  — next release cycle.
- `jose` migration / standard claims / key rotation — low priority.
- Email-OTP step-up for admin accounts — consider later.
