# Session Changes — April 17, 2026 (Part 2)

## Summary

Added a **"Download on Google Play"** button to the `/login` page, directly below the existing "Download Genosys UAE App" (App Store) button. Applies to all three locales (EN / AR / RU) and both rendered layouts (mobile compact card + desktop card).

Before this change, the login page only surfaced the iOS app. Android users coming through `/login` had no visible pointer to the Play Store listing — they had to either find the app from the marketing homepage (`Hero.tsx`) or search the Play Store themselves.

Files: `app/login/LoginClient.tsx`, `messages/en.json`, `messages/ru.json`, `messages/ar.json`, `docs/README.md`, `docs/SESSION_CHANGES_2026-04-17_part2.md` (this file).

---

## 1. The change

### `app/login/LoginClient.tsx`

`LoginClient.tsx` renders two different layouts depending on the `useIsMobile()` hook:

| Block | Lines (approx) | When shown |
|-------|---------------|------------|
| Mobile compact card | 145 – ~478 | `isMobileClient && isMobile && !user` |
| Desktop card | 505 – end | Default |

Each layout had its own App Store button (`<a href="https://apps.apple.com/ae/app/genosys-uae/id6756648064">`). A matching Google Play anchor was inserted **immediately below** each.

#### Google Play URL

```
https://play.google.com/store/apps/details?id=ae.genosys.app
```

Matches the Android package in `genosys-mobile-app/app.json` (`"package": "ae.genosys.app"`) and the URL already used across `Hero.tsx`, `FAQClient.tsx`, `PrivacyPolicyClient.tsx`, `api/mobile/privacy-policy`, `api/mobile/app-version`, etc.

#### Visual design

Kept deliberately symmetric with the App Store button:
- Same full-width black pill (`bg-black text-white`)
- Same radius (`rounded-xl` on mobile, `rounded-lg` on desktop)
- Same vertical rhythm, same hover state, same RTL flip

Differences:
- **Icon** — the classic Google Play play-triangle SVG (same path data as `Hero.tsx` line 306). `viewBox="0 0 24 24"` to match the App Store icon size.
- **Label** — distinct translation key `t('login.downloadAppGoogle')` so copy can diverge from the Apple button if ever needed.

#### Mobile block — spacing adjustment

The old Apple button had `mb-4` (margin-bottom 1rem), which created breathing room before the `OR` divider. With two stacked black buttons now in that slot, keeping `mb-4` on both would look loose. So:

- Apple button margin: `mb-4` → `mb-3` (tighter gap between the two install buttons)
- Google Play button margin: `mb-4` (preserves the original gap to the divider)

Net visible gap between the pair and the divider is unchanged. Only the gap between Apple and Google is tightened.

#### Desktop block — no margin change needed

The desktop container already uses `space-y-3 md:space-y-4`, so the new `<a>` inherits consistent vertical spacing automatically.

### Translation keys

Added `login.downloadAppGoogle` in all three message files:

| Locale | Key | Value |
|--------|-----|-------|
| EN (`messages/en.json` line 1387) | `login.downloadAppGoogle` | `"Download on Google Play"` |
| RU (`messages/ru.json` line 1433) | `login.downloadAppGoogle` | `"Загрузите в Google Play"` |
| AR (`messages/ar.json` line 1433) | `login.downloadAppGoogle` | `"احصل عليه من Google Play"` |

Placed immediately after the existing `login.downloadApp` key for discoverability.

---

## 2. Routing & locale coverage

Only `LoginClient.tsx` was edited, but all three locale routes pick up the change because they share the same client component:

- `/login` → `app/login/page.tsx` → `<LoginClient />`
- `/ar/login` → `app/ar/login/page.tsx` → `import LoginClient from '../../login/LoginClient'`
- `/ru/login` → `app/ru/login/page.tsx` → `import LoginClient from '../../login/LoginClient'`

---

## 3. Scope — what was NOT changed

- **`/pwa-login`** (the dedicated PWA login route users get redirected to when `isPWA === true`) — does not currently show an App Store button, so a Google Play button there would be inconsistent with that screen's design intent. Left untouched.
- **`components/LoginModal.tsx`** — uses a different call-to-action pattern and is surfaced in a separate flow. Left untouched.
- **`components/Hero.tsx`** — already has both App Store + Google Play badges side-by-side. No change.

If the user reports that Android traffic still can't find the app, the next logical touchpoints to surface the Play Store badge are `pwa-login` and `LoginModal`.

---

## 4. Verification

- `ReadLints` on all four modified files: **no linter errors**.
- Translation keys present and valid JSON in all three locale files.
- No new dependencies added. No `package.json` change.
- Pure client-side rendering change — no API / DB / env var impact.

---

## Files Changed

| File | Change | LOC |
|------|--------|-----|
| `app/login/LoginClient.tsx` | Added Google Play `<a>` after each App Store `<a>` (×2 layouts). Apple button `mb-4` → `mb-3` in mobile block. | +28 / −1 |
| `messages/en.json` | `downloadAppGoogle`: `"Download on Google Play"` | +1 |
| `messages/ru.json` | `downloadAppGoogle`: `"Загрузите в Google Play"` | +1 |
| `messages/ar.json` | `downloadAppGoogle`: `"احصل عليه من Google Play"` | +1 |
| `docs/README.md` | Index entry for this session doc | +1 row |
| `docs/SESSION_CHANGES_2026-04-17_part2.md` | This file | new |

---

## Deployment

Pushed to `main` → Vercel production deploy triggered automatically. ~2–3 min to propagate. No rollback script needed; if anything regresses, Vercel "Promote to Production" on the previous deploy reverts in one click.

---

*Session date: April 17, 2026 (second session of the day — first session was the MoySklad push integration fixes, see [SESSION_CHANGES_2026-04-17.md](./SESSION_CHANGES_2026-04-17.md).)*
