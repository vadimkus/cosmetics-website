# Session Changes — February 26, 2026

## App Store Download Button on Login Page

### Summary

Added a **"Download Genosys UAE App"** button on the login page (website and mobile web) to promote the native iOS app. The button appears below the "Sign in with Apple" button and above the "OR" divider on all login views.

### What Changed

| File | Change |
|------|--------|
| `app/login/LoginClient.tsx` | Added App Store download button in **mobile web** view (full-width, below Google/Apple row) and **desktop** view (below Sign in with Apple) |
| `components/LoginModal.tsx` | Added App Store download button in **login modal** (below Sign in with Apple) |
| `messages/en.json` | Added `login.downloadApp`: "Download Genosys UAE App" |
| `messages/ru.json` | Added `login.downloadApp`: "Скачать приложение Genosys UAE" |
| `messages/ar.json` | Added `login.downloadApp`: "تحميل تطبيق Genosys UAE" |

### Button Specification

| Property | Value |
|----------|-------|
| Text | "Download Genosys UAE App" (translated EN/RU/AR) |
| Translation key | `login.downloadApp` |
| Link | https://apps.apple.com/ae/app/genosys-uae/id6756648064 |
| Target | `_blank` (new tab) with `rel="noopener noreferrer"` |
| Style | Black background, white text, Apple logo icon |
| Element | `<a>` tag (not `<button>`) since it's a navigation link |
| RTL support | Yes — `flex-row-reverse` when `dir === 'rtl'` |

### Where It Appears

| View | Location | Styling Notes |
|------|----------|---------------|
| **Desktop** (`LoginClient.tsx`) | Below "Sign in with Apple", above "OR" divider | `rounded-lg`, matches auth button width, slightly smaller padding (`py-2`) |
| **Mobile Web** (`LoginClient.tsx`) | Full-width below the Google/Apple button row, above "OR" divider | `rounded-xl`, `py-3`, consistent with mobile design |
| **Login Modal** (`LoginModal.tsx`) | Below "Sign in with Apple", above "OR" divider | `rounded-system`, uses elevation classes, `min-h-[44px]` touch target |

### Not Affected

- **Native iOS app** (`genosys-mobile-app`) — has its own separate codebase, no changes made
- **PWA login** — shares the same `LoginClient.tsx`, so the button appears there too (acceptable since PWA users may want to switch to native)

### Visual Layout (Desktop/Modal)

```
┌─────────────────────────────┐
│   G  Sign in with Google    │  ← white, border
├─────────────────────────────┤
│     Sign in with Apple      │  ← black, auth action
├─────────────────────────────┤
│   Download Genosys UAE App  │  ← black, external link (NEW)
├─────────────────────────────┤
│            OR                │
├─────────────────────────────┤
│   Email / Password form     │
└─────────────────────────────┘
```

### Commit

```
feat: add "Download Genosys UAE App" button on login page
```
