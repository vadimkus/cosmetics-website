# The welcome email was sending people their password

**Date:** 2 September 2026
**Repos:** `cosmetics-website`, `genosys-mobile-app`

Two follow-ups from the registration rate-limit work. The first turned out to be
more serious than it was first reported.

## 1. The plaintext password in the welcome email

### What was wrong

I had earlier described this as the password merely travelling further than it
needed to, on the understanding that the template accepted the argument and never
rendered it. That was wrong. The template rendered it:

```
${password ? `
  ... Account Details card ...
  Email:    someone@example.com
  Password: TheirActualPassword
` : ''}
```

Both registration routes, website and mobile, passed the plaintext password in,
so the card was drawn every time. **Every account ever created was emailed its own
password in clear text.** That mail then sits in the user's inbox indefinitely,
goes wherever it is forwarded, and lives in whatever backup their provider keeps.
It cannot be recalled, so the only available fix is to stop sending new ones.

### The fix

The `password` parameter is gone from `emailTemplates.welcomeUser` and from
`sendWelcomeEmail`, rather than left optional and unused. An optional parameter
invites a future caller to fill it; removing it means the compiler refuses.

The Account Details card stays, and is no longer conditional. It now confirms
only the address the account was opened with, which is the useful half.

Callers updated: both register routes, `app/api/test-email/route.ts`,
`scripts/send-welcome-email.js` (which also stopped taking and logging a password
argument) and `scripts/test-email-templates.ts`.

The `password` key in the welcome translations is now unused. It was left in the
locale files; removing translation keys is a wider change than this needed.

### Verification

Rendered in all three locales: no occurrence of "password", the address still
shown, `<tr>` and `<table>` tags balanced, so removing the conditional did not
leave the table short a closing tag.

New guard at `__tests__/lib/welcomeEmailNoPassword.test.ts`, six tests: the
rendered mail contains neither a password nor the word, in each locale; the
address survives; no template fragment is left behind; and no call site, including
the untyped scripts, passes anything matching `password`.

## 2. The app dropped the server's email suggestion

### What was wrong

When the server spots a misspelt domain it replies with the address it thinks was
meant:

```json
{ "success": false,
  "error": "Please check your email address. Did you mean ...@gmail.com?",
  "code": "EMAIL_DOMAIN_SUGGESTION",
  "suggestedEmail": "...@gmail.com" }
```

`AuthContext.register` forwarded only `success` and `error`, so the app showed the
sentence but could not offer the correction as a tap. The screen already has that
affordance, built for its own local check.

This was harmless in practice because the app runs byte-identical suggestion logic
before submitting, so it normally catches the typo first. It would bite if the two
copies drifted: the app would be happy with an address the server kept refusing,
and the user would have no way out except to guess what the server wanted.

### The fix

`AuthContext.register` now passes `code` and `suggestedEmail` through on failure.

`app/auth/login.js` keeps the server's answer in `serverSuggestion` as
`{ forEmail, suggested }`, keyed by the address it was given for so that editing
the field drops a stale suggestion. The existing suggestion strip reads from the
local check first and falls back to the server's. The refusal is written under the
email field rather than into the form-wide error, since that is where the address
is, and focus returns to the field.

Both buttons then work as they already did:

- **Use suggested** replaces the address, and the retry passes.
- **Keep entered** records the confirmation, which sends
  `emailSuggestionConfirmed: true`, and the server accepts the original.

Cleared on mode toggle alongside the other form state.

### Verification

Live against production:

- misspelt domain returns `EMAIL_DOMAIN_SUGGESTION` with `suggestedEmail`, the
  shape the app now consumes;
- the same address with `emailSuggestionConfirmed: true` clears the email gate and
  fails on the next rule instead, so **Keep entered** genuinely breaks the loop.
  Probed with a short password so no account was created.

## Registration verified on all three surfaces (11:15)

Asked whether new users can register everywhere. Ran a real registration through
each surface against production, then deleted the accounts.

| Surface | How | Result | Recorded as |
|---|---|---|---|
| Mobile app | `POST /api/mobile/auth/register` with the app key | 200, token issued | `mobile_app`, member `GNS-00876-AE` |
| Website | Real browser, 1440 px, `/login` → Create account form | Redirected to `/products`, logged in | `desktop_web`, member **null** |
| Mobile web | Real browser, 390 px, iPhone UA, same form | Redirected to `/products`, logged in | `mobile_web`, member **null** |

All three rows existed in the DB with bcrypt hashes and the correct
`lastLoginSource`. Nothing overlapped or was unreachable at phone width. A bare
`curl` to the website route returns 403 "CSRF token cookie missing", which is the
guard working; the form itself is fine.

### Found on the way: web sign-ups never get a member number

Only the three mobile routes (`register`, `google`, `apple`) call
`generateMemberNumber`. The website's email registration and its social sign-ins
do not, and nothing assigns one later. Today: **131 of 1004 users have no member
number**, 122 of them web sign-ups (29 desktop, 93 mobile web), 8 from the app
(presumably pre-dating the app-side assignment).

Where it shows: the app's `MembershipCard` prints the number when present and
leaves the line blank otherwise, so a customer who signed up on the site and then
installs the app sees a card with no number. The partner portal shows it as
"Partner ID". Not a registration blocker, but the two halves of the same product
disagree about whether a customer has an ID. Not fixed; the fix is to assign in the
web routes and backfill the 131.

## Also

Typecheck clean. Jest: 1442 pass, 1 pre-existing failure in `noDashes` from an
uncommitted change to `lib/moysklad.ts` belonging to another session, left alone.

Cleared two live `mobile-register` rate-limit counters left by the probes, one of
which had reached 6 of 10 and would have eaten into the allowance of anyone
sharing that address.
