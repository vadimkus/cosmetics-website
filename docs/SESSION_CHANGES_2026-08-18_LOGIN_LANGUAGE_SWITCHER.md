# Language switcher on the login pages did nothing until a manual reload

Reported from mobile web: tapping the `RU ⌄` selector on the login page did not change
the language.

## What was happening

`MessagesProvider` is populated by the **root layout** (`app/layout.tsx`), which reads the
locale from the `x-pathname` header and loads exactly one locale's messages. In the App
Router, a layout is **not re-rendered** when navigating between routes that share it — and
`/login` and `/ru/login` share the root layout.

`useTranslation()` prefers the context value over the pathname:

```ts
const locale: Locale = contextValue?.locale ?? detectedLocale
```

So a client-side `router.push('/ru/login')` swapped the page segment while the provider
kept serving the **previous** locale's messages and locale. On iOS Safari the navigation
was swallowed entirely — in the local repro the URL never even left `/login`.

Only a full page load re-runs the root layout, which is why a manual reload "fixed" it.

**This was already known and already fixed elsewhere.** `MobileWebHeader.tsx` and
`PWAHeader.tsx` both carry this comment:

> items are `<button>` (not `<Link>`) so we can set the NEXT_LOCALE cookie +
> hard-navigate. iOS Safari mobile web was swallowing client-side `<Link>` navigations
> for locale switches, leaving users on the previous locale.

Three pages with their own hand-rolled switcher were missed by that fix.

## Fixed

All three now call `switchLocaleHardNav()` from `lib/i18n.ts`, the same helper the shared
`LanguageSwitcher` and both headers use. It writes `NEXT_LOCALE` and then does a real
`window.location.assign`.

| File | Was |
|---|---|
| `app/login/LoginClient.tsx` | `router.push(getLocalizedPath('/login', newLocale))` |
| `app/pwa-login/page.tsx` | `router.push('/ru/pwa-login')` etc. |
| `app/profile/language/page.tsx` | `router.replace(basePath + '?from=profile')` |

**None of the three set the `NEXT_LOCALE` cookie**, so even after a manual reload the
choice was not remembered — the site reverted on the next visit. That is fixed as a side
effect, and it matters most on `/profile/language`, whose entire purpose is to set a
language preference.

Two small type cleanups came with it: `handleLanguageChange` now takes
`'en' | 'ar' | 'ru'` instead of `string` in `pwa-login`, and the `options` array in
`profile/language` is `as const` so `option.code` is the union rather than `string`.

The `switchingTo` state in `profile/language` is now left set — the page is about to be
replaced by a full navigation, and clearing it immediately allowed a second tap to fire
another one.

## Verified

Reproduced first, on a 390×844 mobile viewport:

- **Before:** tap `EN` → `Русский` — URL stayed `/login`, selector stayed `EN`, all copy
  stayed English.
- **After:** tap `EN` → `Русский` — full navigation to `/ru/login`, page renders
  "Вход в Genosys", "Войти через Google", "Забыли пароль?", selector reads `RU`.
- **Back again:** tap `RU` → `English` — returns to `/login` in English.
- **Cookie persistence:** after switching to Russian, a fresh request to `/login` is
  redirected to `/ru/login` by `proxy.ts`, which is the behaviour the cookie is for and
  which never worked from these pages before.

`tsc --noEmit` and `eslint` clean.

## Note for whoever touches this next

Any new locale switcher must use `switchLocaleHardNav`. A soft navigation cannot work
while `MessagesProvider` lives in the root layout — the alternative would be making the
provider re-derive messages on the client, which means shipping or dynamically importing
the other locale bundles and would undo the C1 payload reduction (~488 KB → ~124–196 KB).
