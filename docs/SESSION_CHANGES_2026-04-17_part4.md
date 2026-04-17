# Session Changes — April 17, 2026 (Part 4)

## Summary

Two follow-ups to [part 3](./SESSION_CHANGES_2026-04-17_part3.md):

1. **Apple button label corrected to Apple's official brand wording.**
   `"Download on Apple Store"` → `"Download on the App Store"` (and equivalents in RU/AR).
   Part 3 had shipped my literal request text ("Apple Store") which is technically Apple's retail hardware stores, not the App Store. Now follows Apple's localized badge guidelines exactly.

2. **Google Play button added to `LoginModal.tsx`** for full symmetry with the `/login` page. The login modal (used elsewhere on the site when a user has to auth inline) now has the same App Store + Google Play stack as the dedicated login page.

Files: `components/LoginModal.tsx`, `messages/en.json`, `messages/ru.json`, `messages/ar.json`, `docs/README.md`, `docs/SESSION_CHANGES_2026-04-17_part4.md` (this file).

---

## 1. Apple official brand wording

### Translation value changes

| Locale | Before (part 3) | After (part 4, official Apple badge) |
|--------|----------------|--------------------------------------|
| EN | `"Download on Apple Store"` | `"Download on the App Store"` |
| RU | `"Загрузите в Apple Store"` | `"Загрузите в App Store"` |
| AR | `"احصل عليه من Apple Store"` | `"حمّل من App Store"` |

### Why "the" in English

Apple's brand guidelines specify `"Download on the App Store"` — with a definite article. Because "App Store" is a common-noun brand, English grammar requires "the". Contrast with Google Play, which is a proper-noun brand ("Google Play") that takes no article, hence `"Download on Google Play"`.

Final stacked buttons:

```
┌─────────────────────────────────┐
│  Download on the App Store  🍎  │
├─────────────────────────────────┤
│  Download on Google Play     ▶  │
└─────────────────────────────────┘
```

### AR prefix note (left unchanged per user scope)

After this change:
- Apple AR uses `"حمّل من App Store"` (Apple's official short AR badge text)
- Google AR still uses `"احصل عليه من Google Play"` (Google Play's common Arabic phrasing)

Both are valid Arabic; the prefixes are just different verbs ("حمّل من" = "download from", "احصل عليه من" = "get it from"). User explicitly scoped this change to Apple, so Google AR was not touched. One-line fix available if parallel AR prefixes are desired later.

### No key rename needed

The translation key stays `login.downloadAppApple` — only the value changed. No code changes required beyond the three message files for this part.

---

## 2. Google Play button in LoginModal

### Where the modal is used

`components/LoginModal.tsx` is the inline login popover that opens when an unauthenticated user performs an action requiring auth (e.g., adding to cart, viewing prices, etc.) — as opposed to the full `/login` page which is a standalone route. Prior to this change, the modal showed only the App Store button.

### The addition

A Google Play `<a>` was inserted immediately after the App Store `<a>` in the modal, using the exact same style tokens the modal uses for its App Store button:

- `w-full flex items-center justify-center gap-2 md:gap-3`
- `bg-black text-white py-2 rounded-system font-semibold`
- `hover:bg-black/90 transition-all duration-200 elevation-2 hover:elevation-3`
- `min-h-[44px]` (touch-target minimum)
- RTL flip for AR

Differences from the App Store button:
- `href` → `https://play.google.com/store/apps/details?id=ae.genosys.app`
- Icon → Google Play triangle SVG (same path data as `Hero.tsx`, `LoginClient.tsx`)
- Label → `t('login.downloadAppGoogle')`

### Why no margin explicit on the new button

The modal wraps its buttons in `<div className="space-y-3 md:space-y-4">` (or `space-y-2 md:space-y-3` in register mode). The new `<a>` inherits that vertical rhythm automatically.

### Modal coverage

The modal is locale-agnostic — it uses `useTranslation()` and picks up the locale from context. So the new button will show:

| Locale | App Store label | Google Play label |
|--------|-----------------|-------------------|
| EN | Download on the App Store | Download on Google Play |
| RU | Загрузите в App Store | Загрузите в Google Play |
| AR | حمّل من App Store | احصل عليه من Google Play |

Same translation keys as `/login` → any future text updates apply in both places automatically.

---

## 3. Verification

### Key coverage grep

Source code (`*.ts`, `*.tsx`, `*.js`, `*.jsx`, `*.json`) references:

| Key | Call sites |
|-----|-----------|
| `login.downloadAppApple` | LoginClient.tsx line 249, line 595; LoginModal.tsx line 312 |
| `login.downloadAppGoogle` | LoginClient.tsx line 262, line 608; LoginModal.tsx line 325 |

Both keys defined in `messages/{en,ru,ar}.json`. No orphans.

### Stale key check

Grep for the old `login.downloadApp` (without Apple/Google suffix) returned zero matches in source code. Only historical session docs mention the old key, which is archival and untouched.

### Lint

`ReadLints` on all four modified files — clean. No errors, no warnings.

---

## Files Changed

| File | Change | LOC |
|------|--------|-----|
| `messages/en.json` | Apple value: `"Download on Apple Store"` → `"Download on the App Store"` | ±1 |
| `messages/ru.json` | Apple value: `"Загрузите в Apple Store"` → `"Загрузите в App Store"` | ±1 |
| `messages/ar.json` | Apple value: `"احصل عليه من Apple Store"` → `"حمّل من App Store"` | ±1 |
| `components/LoginModal.tsx` | Added Google Play `<a>` after App Store `<a>` | +13 |
| `docs/README.md` | Index entry for this session doc | +1 row |
| `docs/SESSION_CHANGES_2026-04-17_part4.md` | This file | new |

---

## Deployment

Pushed to `main` → Vercel production deploy. Text change + one button addition. No DB / API / env impact, no package changes, no migrations.

### Visible effect per surface

| Surface | App Store button | Google Play button |
|---------|------------------|--------------------|
| `/login` desktop card | Text updated to Apple official | (unchanged, already existed from part 2) |
| `/login` mobile card | Text updated to Apple official | (unchanged, already existed from part 2) |
| Login modal popover | Text updated to Apple official | **NEW** |

---

*Session date: April 17, 2026 (fourth session of the day — see also [part 1](./SESSION_CHANGES_2026-04-17.md) MoySklad, [part 2](./SESSION_CHANGES_2026-04-17_part2.md) Google Play button on `/login`, [part 3](./SESSION_CHANGES_2026-04-17_part3.md) Apple key rename).*
