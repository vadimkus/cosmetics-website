# Registration "invalid mail" reports (12 Sep 2026)

## What was checked
- Syntax validator (`lib/emailAddressValidation.ts`): fine for 60+ real provider domains incl. UAE/RU/EU.
- Server DNS/MX check (`lib/emailDomainValidation.server.ts`): probed live `/api/auth/register` with double-submit CSRF; mail.ru, gmail, icloud, small clinic domains all pass; only truly non-existent domains get `EMAIL_DOMAIN_INVALID`. Fails open on DNS timeouts.
- Registrations are landing daily (DB: several new users per day, 12 Sep included).

## Root cause (friction, not a bug)
The lexical "Did you mean …?" check flagged *real* providers within 2 edits of a known one: mac.com -> me.com, msn.com -> me.com, gmx.com -> me.com, aim.com -> mail.com, hey.com, mail.kz/mail.ee -> mail.ru, yandex.kz -> yandex.ru, yahoo.co.in -> yahoo.co.uk, inbox.lv -> inbox.ru. On web the form then hard-blocked submit with "Please choose the suggested email or confirm that you want to keep the address entered." Customers read that as "invalid mail, cannot register", especially on small screens where the two buttons under the field are easy to miss.

## Fix
1. `COMMON_EMAIL_DOMAINS` extended with ~35 real providers customers use, so they are never "corrected".
2. Web forms (`LoginModal`, `/login`, `/pwa-login`) no longer block submit. The amber hint with "Use this email" / "Keep what I entered" still shows; pressing Create account with it on screen counts as keeping the address (`emailSuggestionConfirmed: true`). Server-side syntax + DNS checks unchanged.

## Not changed
- Mobile app (`genosys-mobile-app/utils/emailAddressValidation.js`, `app/auth/login.js`) has its own copy of the list and still hard-blocks on an unconfirmed suggestion. Needs the same two changes in the next app release.
- "User with this email already exists" (400) is the other likely "cannot register" case: customers who signed in with Google/Apple before. Message could point them to Log in / Forgot password.
