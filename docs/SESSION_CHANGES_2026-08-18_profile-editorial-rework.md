# Account area moved onto the editorial design system

Date: 18 Aug 2026
Commits: `286507a8` (desktop frame), `a2bcb90e` (mobile hub, sub-routes, shared components)

## Why

The account area was the last stretch of the buying journey still on the old grey and
`primary` palette. A customer went through login, cart, checkout and the success page on
the editorial system and then landed on an old-looking page immediately after paying.

Nothing in `app/profile/**`, `components/profile/**` or `components/pwa/PWAProfilePage.tsx`
carried a single `--cera-*` token before this work: about 7,500 lines across 23 files.

## What the surfaces actually are

Worth recording, because it is not obvious from the route names:

- **Desktop** renders `DesktopProfileShell` with tabbed content. The addresses, billing and
  address-editor routes export an `embedded` variant that the shell renders as a card.
- **Mobile web and the installed app** render `PWAProfilePage` instead, and that component
  is the *only* route into `/profile/edit`, `/profile/addresses`, `/profile/billing`,
  `/profile/promo`, `/profile/language` and `/profile/passkeys`. It is the higher-traffic
  surface of the two.

## The two real bugs found

**1. The stylesheets were never loaded.** The palette variables and the `.cera-page` and
`.cera-serif` rules live in `components/product/cerabarrier/cerabarrier.css` and
`components/editorial/editorial.css`. Nothing imports them globally; every editorial route
imports both explicitly. Adding the classes without the imports left every `var()`
unresolved, so the page background stayed transparent, headings rendered in the old grey
instead of ink, and the serif never loaded. All nine entry points now import both.

**2. The customer's name was invisible in the account hero.** `.cera-page` paints `h1`–`h3`
with `--cera-ink` from outside any Tailwind layer, so it beats the inherited white and put
ink on the dark ink card. Fixed with `!text-white`, the same escape the login hero uses.

Both were caught by rendering `DesktopProfileShell` and `ProfileOverview` against mock
props on a throwaway route, screenshotting, and reading the computed styles. The area is
auth-gated, so there is no other way to see it without credentials. The harness was deleted
afterwards.

## Colour decisions

**Red was split, not swapped.** It does two unrelated jobs in this area:

| Job | Examples | Result |
|---|---|---|
| Brand accent | back links, save buttons, focus rings, selected language, icon chips | became `--cera-rose` / `--cera-rose-ink` |
| Meaning | invalid VAT field and hint, failed-save toasts, required-field markers, delete-account and remove-data warnings, passkey error line | stays red |

Green stays throughout: it marks online status and success.

**Dark surfaces were mapped separately.** The account summary hero, the professional partner
membership card and the `MEMBER` tier badge are dark, so their greys became white-alpha.
Mapping them to ink alongside the light surfaces would have made that text invisible.

**Backgrounds.** Roots that forced `bg-white` lost the utility, because the unlayered
`.cera-page` cream wins regardless and leaving it in would have read as though it still
applied. The grouped iOS-settings-style cards inside stay a shade deeper than the page, the
same relationship they had against white. The `embedded` variants deliberately do not take
the page scope, since the shell around them already carries it.

## Test change

`__tests__/components/ProfileTabs.test.tsx` asserted on `border-primary-500`,
`text-primary-600` and `text-gray-500`. Its assertions moved to the editorial tokens; it
still checks the same active and inactive distinction.

## Verification

Typecheck clean, no lint errors, 490 tests passing across 68 suites, clean production
build, all ten profile routes returning 200, and the restyled shell screenshotted at 1440
and 1180 wide with computed styles confirmed (`--cera-ink` `#17140f`, `--cera-rose`
`#c0392f`, Cormorant Garamond on headings, cream page background).

**Still wants an eyeball**: the logged-in view. The mock harness cannot reproduce real
orders, membership tiers, partner state or the mobile hub, so those want a look on a real
account.

## Not done

Untouched by this work, and still on the old palette:

- `/forgot-password` and `/reset-password/[token]`
- `/checkout/cancelled`, `/pay/success`, `/pay/cancel`, `/track/[orderNumber]`
- `/locations`, `/locations/[city]`, `/partners`, `/favorites`, `/blog/[slug]` (breadcrumbs
  only so far)
- `/terms`, `/privacy-policy`, `/guides`, `/certificates`, `/certificate/[code]`
- `/partner-portal` and sub-pages, `/prof`
- `/products/concern/[slug]`, `/products/category/[slug]`
- the generic `/products/[id]` template, which now only serves 5 products (ids 1, 3, 47,
  48, 54)
