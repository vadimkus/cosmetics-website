# App text, consistency and design sweep

**Date:** 2 September 2026 (afternoon)

Three passes: the message catalogues (terminology, placeholders, typography,
untranslated values), English hardcoded in screens and services that bypasses
translation, and design values in screens measured against the theme.

## Texts

Catalogue health was good going in: 1,619 keys in each of EN, RU, AR, no
placeholder mismatches, no em or en dashes.

Fixed:

- **"Sign in" vs "Login".** The button said Sign in; the gates said "Login to
  buy", "Login to see price", "Login required", "Login with Face ID". "Login" is
  a noun, so the verb uses were wrong as well as inconsistent. Twelve EN keys
  moved to the Sign in family ("Sign in to buy", "Sign in required", "Sign in
  with {biometricType}", "Sign-in failed", "Sign out & enable"). RU and AR were
  already consistent (Войти / تسجيل الدخول); one RU outlier, "Требуется
  авторизация", became "Требуется вход" like its siblings. The FAQ answer that
  quotes the website's own button label was left as it is.
- **Ellipsis.** 74 strings across the three locales used three full stops;
  all now use the ellipsis character. Same change made to the website's 117
  strings so the two surfaces match. The label-case guards (app script,
  website script, website test) treated `.`/`!`/`?` as "this is a sentence"
  and skipped it, but not `…`; all three updated so the ellipsis counts.
- **Arabic `Cushion BB`** was left in English where Russian had translated it.
  Now كوشن BB.

Hardcoded English reaching RU and AR users:

- **Checkout failure alert.** `orderService` throws English fallbacks ("Could
  not place order…", "Connection timed out…") and the screen appended that
  text under the translated headline, so a Russian user saw two languages in
  one alert. The service now attaches a code (`timeout`, `card`, `resume`,
  `generic`), the return shapes carry `errorCode`, and the checkout screen
  translates from `checkout.orderErrors.*`. The English message remains as the
  log text only.
- **Force-update screen** was fully hardcoded, and the locale it used to pick
  the server's message was a build-time constant, so every user got English.
  It renders above `LocalizationProvider`, so it cannot use the hook; a new
  `tFor(locale, key)` and `readStoredLocale()` let `_layout` read the saved
  language and pass it down. Four new `forceUpdate.*` keys in three locales.

## Design

Colours are largely on-theme: 58 literals in screens, almost all rgba scrims
and overlays, which is normal. Fixed the exceptions:

- **Partner portal** still carried the pre-cera Tailwind amber and blue
  (`rgba(245,158,11,…)`, `rgba(37,99,235,…)`) on its consignment and credit
  pills and cards. Moved to `colors.orangeBg/orangeLine` and
  `colors.blueBg/blueLine`, which existed for exactly this.
- **Rating star** used a raw `#FBBF24` in two files. Tokenised as
  `colors.star`; hue unchanged, a star that is not gold reads as a favourite
  rather than a score.
- **`borderRadius: 980`** in four places against `999` in forty-one. Now 999.

Not changed, recorded for a decision:

- **There is no radius or spacing scale in the theme.** Screens use 34
  distinct `borderRadius` values (8, 10, 12, 14, 16 dominate, then a tail of
  7, 9, 11, 13, 15, 18, 22, 26, 29, 34, 38, 52, 60, 110) and 25 distinct
  `fontSize` values from 8 to 64, with odd sizes (9, 11, 13, 15) in heavy use
  despite `utils/typography.js` defining a type ramp. About 130 padding and
  margin values sit off the 4pt grid. Font weights 800 and 900 appear 102
  times, which sits oddly against a brand that has otherwise moved to a
  quieter palette. None of this is a defect a user would name, and normalising
  it is several hundred edits with visual consequences on every screen; it
  wants doing as its own pass with screenshots, not folded into a sweep.

## Verification

Lint clean, all 24 app smoke/verify scripts pass (including the label-case
guard, after the ellipsis change), catalogue parity holds at 1,627 keys per
locale. Website: typecheck clean, 1,463 tests passing (the pre-existing dash
in the uncommitted `lib/moysklad.ts` remains the one failure); the member
number guard now excludes `lib/generated`, which another test writes mid-run.
