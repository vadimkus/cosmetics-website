# Password Reset — Full Feature Audit + Fixes — 2026-07-06

Traced end-to-end: web forgot/reset pages, mobile screens, both API pairs
(`/api/auth/*` with CSRF, `/api/mobile/auth/*` with x-api-key), token lifecycle
(`lib/passwordReset.ts`), email template, deep-link behavior.

## What's solid (no changes needed)

- **Token security**: 32-byte crypto-random token, bcrypt-hashed at rest (plain token
  only ever in the email), 30-minute expiry, single-use, and all other outstanding
  tokens invalidated after a successful reset.
- **Enumeration protection**: both forgot-password endpoints always return the same
  success message whether or not the account exists; email-send failures are also
  hidden. Apple Private Relay addresses are silently skipped (those users sign in
  with Apple anyway).
- **Endpoint hardening**: CSRF (web), x-api-key (mobile), body-size limits,
  fail-closed rate limiting (20/h forgot, 10/15min reset), method whitelisting.
- **Web UX**: reset page verifies the token on load (clear expired-link state),
  strength meter, confirm field, auto-redirect to login on success.
- **New password**: bcrypt cost 12; `updateUser` stores the pre-hashed value (no
  double-hash). Min length 8 enforced server-side on both platforms.
- **Deep links**: `/reset-password/*` is intentionally NOT in AASA/App Links, so email
  links open the browser where the web flow works for everyone.

## Bug fixed: mobile "reset code" dead end

The email contains only a **button** — no visible code — but the app's reset screen
demanded a pasted "reset code" (the raw 64-hex token buried in the button URL).
An app user had no realistic way to get that code.

1. **Email template**: added a plain, copyable link under the button ("Button not
   working? Copy and paste this link") — standard fallback that also serves
   button-less email clients.
2. **App reset screen**: now accepts a pasted **full link or raw token**
   (`extractResetToken` pulls the 64-hex token out of whatever is pasted) and
   prefills from `?token=` when opened via deep link. Labels updated (EN/AR/RU):
   "Reset link or code".
3. **`+native-intent.js`**: `genosys.ae/reset-password/<token>` links that open inside
   the app now route to the native screen with the token prefilled (previously fell
   back to the WebView); `/forgot-password` maps to the native screen too.

## Hygiene fixed

4. **Token table purge**: `cleanupExpiredTokens()` existed but was never called
   anywhere. Now runs fire-and-forget on every `createPasswordResetToken()` — matters
   because `verifyPasswordResetToken()` bcrypt-compares the submitted token against
   EVERY live token row (~100ms each), so an unbounded table would make verification
   slow and abusable.

## Flagged, not changed (recommendations)

- **Sessions survive password reset**: the web JWT session cookie and mobile refresh
  tokens remain valid after a reset. If the reason for resetting is a compromised
  account, the attacker's session isn't kicked. Proper fix = token-version field on
  the user checked during session validation. Medium effort; worth doing eventually.
- **Registration allows 6-char passwords** while reset demands 8 — inconsistent
  policy, align to 8 whenever registration is next touched.
- **Rate limiting** is hybrid in-memory/DB per instance — fine at current scale.

## Verification

- `tsc --noEmit` + full build clean (web); `expo export` clean (mobile).
- Token extractor unit-checked: raw token, full link, locale-prefixed link with
  query string, and short-garbage passthrough all behave correctly.
- Mobile shipped via OTA runtime 1.10.4; web deployed via main.
