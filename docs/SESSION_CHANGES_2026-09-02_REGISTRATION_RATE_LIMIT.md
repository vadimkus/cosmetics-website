# Registration failures from the app: one shared rate limit counter

Date: 2026-09-02

Users reported being unable to create an account from the mobile app. The cause
was a rate limiter, not the registration code.

## What was wrong

`rateLimitSimple` keys its counters by the identifier the route passes in, and
`getClientIdentifierFromNextRequest` returns the caller's IP plus the first ten
base64 characters of their user agent. For the app that prefix is always
`R2Vub3N5c1`, which decodes to "Genosy", so in practice the identifier is the IP
alone.

Nothing in that key said which route was counting. Twelve of the twenty-six
limiters prefixed the identifier by hand at the call site, `chat:`, `skin:` and
so on. Fourteen did not, and those were nearly the whole auth family: register,
login, Google, Apple, admin-login and both password-reset routes on web and
mobile. All fourteen incremented **one row per caller**.

Three things followed from that.

1. Signing in spent the sign-up allowance. Mobile login allows 10 attempts,
   mobile registration allowed 5, against the same number.
2. Each route compared the shared count against its own `max`, so a caller could
   be under one route's limit and over another's without having touched it.
3. The window belonged to whichever route created the row. One registration
   attempt set a one-hour window, and every login for that hour inherited it
   instead of its own fifteen minutes.

The live table showed it happening. `176.204.80.136-R2Vub3N5c1` sat at a count
of 7 on a one-hour window from the app's user agent. Registration's cap was 5,
so that person was refused with "Too many registration attempts" on an attempt
they had not yet made. A second row was at 4 of 5 the morning this was found.

Worth noting for anyone reading the counts: the limiter also runs **ahead of**
validation, so a mistyped email or a short password spends the allowance exactly
as a real attempt does.

## The fix

The namespace moved from the identifier to the limiter, as a required option:

```ts
const mobileRegisterLimiter = rateLimitSimple({
  name: 'mobile-register',
  windowMs: 60 * 60 * 1000,
  max: 10,
})
```

Required rather than optional so the compiler asks, and a new limiter cannot
quietly land back in the shared bucket. `rateLimitSimple` now builds the key as
`${name}:${identifier}` internally, and the twelve call sites that were
prefixing by hand had their prefixes removed and reused as the name, so their
keys are byte-identical and their counters carried on uninterrupted.

Applied across all 26 limiters by `scripts/name-rate-limiters.py`.

Mobile registration also went from 5 an hour to 10, matching the website. With
the counter no longer shared, 5 is the real budget, and it is shared between
unrelated people by carrier NAT.

## Guard

`__tests__/lib/rateLimitNamespacing.test.ts` fails if two routes claim the same
name, if a limiter is declared without one, or if a call site starts prefixing
the identifier again. Confirmed to fail when the bug is reintroduced: pointing
mobile login at `mobile-register` makes it name both offending routes.

## Verified in production

Six failed logins followed by a registration attempt from the same client. The
registration reached validation and returned a 400 for the email domain rather
than a 429. The table then held two separate rows where there would have been
one:

```
3  mobile-login:83.111.89.148-...
7  mobile-register:83.111.89.148-...
```

Probe rows were deleted afterwards so they did not count against a real address.

## Not fixed, noted

- Enforcement is looser than the configured maximum under load. The in-memory
  cache is per serverless instance and the database sync is fire and forget, so
  twelve rapid attempts did not trip a cap of ten. This predates the change and
  is defence in depth rather than a security boundary, but the configured number
  is a ceiling, not a guarantee.
- `AuthContext.register` drops the `code` and `suggestedEmail` the API returns,
  so the server's "did you mean" cannot drive a one-tap correction. Harmless
  today because the app runs the identical suggestion logic locally before it
  submits, byte for byte the same domain list and threshold. It would matter if
  the two ever drift.
- `sendWelcomeEmail` is handed the plaintext password. The template accepts the
  parameter and never renders it, so nothing leaks, but the raw password travels
  further than it needs to.
- Emirate names are hard-coded in English in the app and matched against an
  English list on the server, so they agree. Russian and Arabic users see
  English emirate names in the picker.
