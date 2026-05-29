# Session Changes — 2026-05-29: Admin notification device type fix (mobile app)

## Problem

Admin "New User Registration" emails for users registering **via the mobile app**
showed **Device Type: Desktop** instead of Mobile.

## Root cause

The mobile app's HTTP client (`services/httpClient.js`, `services/authService.js`)
uses the default `fetch`, which sends a native `User-Agent`
(`GenosysUAE/… CFNetwork/… Darwin/…` on iOS, `okhttp/…` on Android). None of these
contain `mobile`/`iphone`/`android`, so the server's `parseUserAgent()` fell back to
its default `deviceType = 'desktop'`.

Because `/api/mobile/*` is gated by the mobile `x-api-key`, every request is from the
app — so "desktop" was always wrong there.

## Fix

### Server (`cosmetics-website`)

- `lib/deviceDetection.ts`: added `resolveDeviceInfo(headers, { fallbackDeviceType })`.
  It prefers explicit `x-device-*` headers from the app, falls back to UA parsing, and
  applies `fallbackDeviceType` (`'mobile'`) when the result would otherwise be `desktop`.
  Native app requests now report `browser: 'Mobile App'` instead of `Unknown`.
- `app/api/mobile/auth/register/route.ts`: uses `resolveDeviceInfo(..., { fallbackDeviceType: 'mobile' })`.
- `app/api/mobile/auth/google/route.ts`: same.
- `app/api/mobile/auth/apple/route.ts`: now sends device + IP + geo `additionalInfo`
  (previously sent none), also defaulting to `mobile`.

### Mobile app (`genosys-mobile-app`)

- `utils/deviceInfo.js` (new): builds `x-device-*` headers from `Platform` + `expo-constants`
  (`x-app-platform`, `x-device-type`, `x-device-os`, `x-device-os-version`, `x-device-model`).
- `services/authService.js`: register, Google, and Apple auth requests now include
  `...deviceInfoHeaders()`.

## Notes

- iPad is reported as `tablet`; iOS/Android phones as `mobile`.
- Existing app builds (before this change) will still be corrected server-side by the
  `fallbackDeviceType: 'mobile'` safety net — OS/model just won't be as precise until the
  updated app ships.
- Type check (`tsc --noEmit`) on the web project passes.

## Shipped

- **Website**: commit `1453608a` on `main`, pushed → Vercel auto-deploy. Fixes the
  "Desktop" label for everyone immediately, including older app versions.
- **Mobile app** (`genosys-mobile-app`): commit `725ffef` on `main`; published OTA to the
  `production` channel, runtime `1.10.1`, both platforms. Update group
  `95074c63-7bda-4d7c-ac73-1fa403f4efbe`. Adds precise OS version / device model /
  `Mobile App` browser label. See `docs/SESSION_CHANGES_2026-05-29_device-info-headers-ota.md`
  in that repo for full details.
