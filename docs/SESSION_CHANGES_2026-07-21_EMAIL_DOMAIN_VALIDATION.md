# Registration Email Domain Validation

Date: 2026-07-21

## Outcome

Web, website PWA, and native registration now prevent mistyped email domains from silently creating unreachable accounts.

## Validation layers

1. Native email controls and a practical syntax check catch malformed addresses.
2. Common-provider typo detection catches errors such as `gmail.con`, `gmial.com`, `hotmial.com`, and `yaho.com`.
3. The UI shows “Did you mean?” with explicit **Use this email** and **Keep what I entered** actions; addresses are never silently rewritten.
4. Both web and mobile registration APIs repeat validation server-side.
5. The server checks MX records, RFC 7505 null MX, and RFC 5321 address-record fallback before creating the account.
6. DNS timeouts and transient resolver failures fail open; confirmed non-existent/non-mail domains fail closed.

This protects current clients, old native app versions, and direct API callers.

## Key files

- `lib/emailAddressValidation.ts`
- `lib/emailDomainValidation.server.ts`
- `components/auth/EmailDomainSuggestion.tsx`
- `app/api/auth/register/route.ts`
- `app/api/mobile/auth/register/route.ts`
- `app/login/LoginClient.tsx`
- `app/pwa-login/page.tsx`
- `components/LoginModal.tsx`

Native implementation is documented in the mobile repository.

## Research basis

- [MDN — `<input type="email">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/email): browser validation checks format, not existence or deliverability; server validation is still required.
- Production email-validation guidance consistently recommends layered syntax, typo suggestion, server-side domain checks, and no silent correction.

## Verification

- Focused Jest: 18 tests passed.
- Website TypeScript and targeted ESLint passed.
- Server smoke:
  - unconfirmed `gmail.con` → `EMAIL_DOMAIN_SUGGESTION`
  - explicitly retained `gmail.con` → `EMAIL_DOMAIN_INVALID`
  - `gmail.com` → valid
- Mobile registration endpoint returned the same two protective 400 responses.
- Browser verified the inline suggestion and one-tap correction on `/signup`.
