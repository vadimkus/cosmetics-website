# Session Changes — April 17, 2026 (Part 3)

## Summary

Follow-up to [part 2](./SESSION_CHANGES_2026-04-17_part2.md). Renamed the Apple-button label from `"Download Genosys UAE App"` to `"Download on Apple Store"` to make it visually symmetric with the newly-added `"Download on Google Play"` button.

Also renamed the underlying translation key from `login.downloadApp` → `login.downloadAppApple`, so the key pair is now semantically clean:

| Old | New |
|-----|-----|
| `login.downloadApp` | `login.downloadAppApple` |
| `login.downloadAppGoogle` (added in part 2) | `login.downloadAppGoogle` (unchanged) |

Files: `app/login/LoginClient.tsx`, `components/LoginModal.tsx`, `messages/en.json`, `messages/ru.json`, `messages/ar.json`, `docs/README.md`, `docs/SESSION_CHANGES_2026-04-17_part3.md` (this file).

---

## 1. Branding note

Apple's official store brand is **"App Store"** (the retail hardware stores are called "Apple Store"). Apple's own branding guidelines require the exact wording **"Download on the App Store"**. The user explicitly requested `"Download on Apple Store"` for visual symmetry with the Google button, so that's what shipped. This is a deliberate, informed deviation from Apple's branding — not a typo. If it ever needs to change to strict Apple wording, only the `login.downloadAppApple` value in the three message files needs updating; no code changes.

---

## 2. Translation key changes

### `messages/en.json`

```diff
-    "downloadApp": "Download Genosys UAE App",
+    "downloadAppApple": "Download on Apple Store",
     "downloadAppGoogle": "Download on Google Play",
```

### `messages/ru.json`

```diff
-    "downloadApp": "Скачать приложение Genosys UAE",
+    "downloadAppApple": "Загрузите в Apple Store",
     "downloadAppGoogle": "Загрузите в Google Play",
```

### `messages/ar.json`

```diff
-    "downloadApp": "تحميل تطبيق Genosys UAE",
+    "downloadAppApple": "احصل عليه من Apple Store",
     "downloadAppGoogle": "احصل عليه من Google Play",
```

All three locales now use the same `"Download on X" / "Загрузите в X" / "احصل عليه من X"` prefix pattern for both buttons.

---

## 3. Code call-site updates

Three `t('login.downloadApp')` call-sites renamed to `t('login.downloadAppApple')`:

| File | Location | Notes |
|------|----------|-------|
| `app/login/LoginClient.tsx` | ~line 249 | Mobile compact card Apple button |
| `app/login/LoginClient.tsx` | ~line 595 | Desktop card Apple button |
| `components/LoginModal.tsx` | ~line 312 | Login modal (popover used elsewhere on the site) |

**Scope expansion note:** In part 2's session doc I noted `LoginModal.tsx` was "intentionally untouched". That referred to *adding* a Google Play button to it. For this rename, `LoginModal.tsx` had to be updated too because it was referencing the same translation key. Otherwise the modal would have crashed (or shown the raw key) on next render.

The user-visible effect in the modal: Apple button label changes from "Download Genosys UAE App" → "Download on Apple Store". The modal does not currently have a Google Play button — if the user wants full symmetry there too, that's a separate follow-up.

---

## 4. Verification

Ran a repo-wide grep for any remaining `login.downloadApp` (without the `Apple` suffix):

```
"login.downloadApp" → 0 matches in source code
                      2 matches in historical session docs (archival, untouched)
```

No stale code references. `ReadLints` on all five modified files returned clean.

Grep confirmed `login.downloadAppApple` is used in exactly three call-sites (the three listed above) and defined in exactly three message files (`en`, `ru`, `ar`).

---

## Files Changed

| File | Change | LOC |
|------|--------|-----|
| `app/login/LoginClient.tsx` | 2× `t('login.downloadApp')` → `t('login.downloadAppApple')` | +2 / −2 |
| `components/LoginModal.tsx` | 1× `t('login.downloadApp')` → `t('login.downloadAppApple')` | +1 / −1 |
| `messages/en.json` | Key rename + value change | +1 / −1 |
| `messages/ru.json` | Key rename + value change | +1 / −1 |
| `messages/ar.json` | Key rename + value change | +1 / −1 |
| `docs/README.md` | Index entry for this session doc | +1 row |
| `docs/SESSION_CHANGES_2026-04-17_part3.md` | This file | new |

---

## Deployment

Pushed to `main` → Vercel production deploy. No DB / env / API impact. Text-only change with one safe key rename.

---

*Session date: April 17, 2026 (third session of the day — see also [part 1 (MoySklad fixes)](./SESSION_CHANGES_2026-04-17.md) and [part 2 (Google Play button)](./SESSION_CHANGES_2026-04-17_part2.md).)*
