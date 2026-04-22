# Session Changes — PWA Profile Page UI Overhaul

**Date:** 2026-04-22
**Scope:** `/profile` (PWA) — UI, information architecture, i18n, and platform polish

## Context

A UI audit of the PWA profile page surfaced ~12 actionable issues ranging from
"must fix" (wrong version number, misleading branding) to "nice-to-have"
(pluralisation grammar, Safari autolinking emails, section ordering).

Three "must fix" items shipped in commit `737fe53b` the day before. This session
ships **all remaining nine items** in one coherent pass, plus a small framework
addition (`lib/plurals.ts`) that the whole app can now use.

## What changed

### 1. Information architecture — iOS-Settings-style ordering

Sections were re-grouped and re-ordered so the page reads top-down in order of
importance to the user:

| Before | After |
| --- | --- |
| Account | Account |
| Privacy & Security | **Beauty Tools** *(new — promoted)* |
| General *(mixed bag of 7 rows)* | **Preferences** *(new)* |
| | Privacy & Security |
| | **Support** *(new)* |

- **Beauty Tools** (new section) — AI Skin Analysis + Live AR Analysis. These
  are the app's hero features and were previously buried between "Language"
  and "Help & Support" inside "General".
- **Preferences** (new section) — Language + Appearance. Everything that
  customises the *look/feel* of the app in one place.
- **Support** (new section) — Help, Contact, About. Everything *support-y* in
  one place.

### 2. User card (top) polish

- **"View & Edit" → chip button.** Was a plain blue text link; now a pill with
  a pencil icon, red-tinted background, and proper press state. Matches the
  iOS/Material design language used elsewhere on the page.
- **Megaphone promo button is conditional.** Previously rendered always (with
  a zero-count badge); now only renders when `unreadNotifications > 0`.
  Removes visual clutter for 95% of users.
- **Email no longer gets auto-linkified by iOS Safari.** Added `email: false`
  and `address: false` to the site-wide `formatDetection` meta in
  `app/layout.tsx`. Wrapped the email line in `<p dir="ltr">` so the domain
  stays LTR even inside the Arabic RTL layout.
- **Long names / emails now truncate** instead of wrapping.

### 3. Appearance row

- Dropped the redundant "Light" subtitle. The three-button selector
  (sun / moon / auto) already communicates the current state; showing it twice
  was noise.

### 4. Push notification row — graceful fallback

- When the browser **does** support push (iOS 16.4+ PWA, modern Chrome on
  Android), the regular toggle is shown.
- When the browser **does not** support push (most desktop browsers, iOS
  Safari outside PWA), the row is replaced with a tappable "Notifications work
  best in the app → tap to download the iOS or Android app" ProfileItem. Taps
  open the App Store on iOS and Play Store elsewhere.

### 5. AI Skin Analysis copy

- **Before (EN):** `Last: sensitive skin` → grammatically awkward.
- **After (EN):** `Last result: sensitive skin`.
- **AR:** `آخر نتيجة: بشرة {skinType}`.
- **RU:** `Последний результат: {skinType}`.

Uses `t('pwaProfile.lastSkinType', { skinType })` with parameter interpolation
instead of ad-hoc string concatenation per locale.

### 6. Proper CLDR pluralisation for EN / RU / AR

Added `lib/plurals.ts` — a tiny wrapper around `Intl.PluralRules` that picks
the correct CLDR plural category (`one`, `two`, `few`, `many`, `other`, `zero`)
for a given count + locale, and resolves the matching message key lazily so
unused categories don't trigger missing-key warnings.

| Locale | Count | Before | After |
| --- | --- | --- | --- |
| RU | 1 | `1 товары` | `1 товар` |
| RU | 3 | `3 товары` | `3 товара` |
| RU | 7 | `7 товары` | `7 товаров` |
| AR | 2 | `2 عناصر` | `2 عنصران` (dual form) |
| AR | 5 | `5 عناصر` | `5 عناصر` |
| AR | 11 | `11 عناصر` | `11 عنصرًا` (many form) |

The helper is generic and is now available for any future plural strings
anywhere in the app.

## Files touched

| File | Reason |
| --- | --- |
| `app/layout.tsx` | Add `email: false`, `address: false` to `formatDetection` |
| `components/pwa/PWAProfilePage.tsx` | Section reorder, chip button, conditional megaphone, push fallback, new copy, plurals wiring |
| `components/ThemeToggle.tsx` | Drop redundant "Light" subtitle on `ThemeToggleItem` |
| `lib/plurals.ts` *(new)* | Locale-aware pluralisation helper |
| `messages/en.json` | Add plural forms + new section/feature keys |
| `messages/ar.json` | Add all 6 CLDR plural categories + new keys |
| `messages/ru.json` | Add 4 CLDR plural categories + new keys |

## Verification

- `npx tsc --noEmit` — only pre-existing errors in `__tests__/*` (unrelated to
  this change). Zero new production errors.
- `npx eslint` on all touched files — zero new errors, only pre-existing
  `no-console` warnings in the push-subscription handler.
- Manual visual check of EN / AR (RTL) / RU — all three render correctly.

## Not done (future work)

- Sort out the `__tests__/*` Jest type definitions — unrelated pre-existing
  errors. Worth a separate follow-up PR.
- Consider promoting the chip button pattern into a shared component if we
  end up reusing it elsewhere.
- `emailNotifications` toggle is still local state — not persisted to the
  server. Flagged for a separate task.
