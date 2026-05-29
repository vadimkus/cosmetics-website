# Android Force-Update Lockout Fix

Date: 2026-05-29

## Symptom

An existing Android customer was stuck on the blocking **"Update Required"** screen.
Tapping **"Update on Google Play"** did nothing — no update, no way back into the app.

## Root Cause

`app/api/mobile/app-version/route.ts` returned a single version gate for **all**
platforms: `minimumVersion: 1.10.0`, `forceUpdate: true`.

- iOS shipped binaries `1.10.0` / `1.10.1` to the App Store, plus many OTA updates.
- **Android never received a `1.10.x` binary.** The newest Android build live on
  Google Play is `1.9.0` (versionCode 81), published Apr 26, 2026. All `1.10.x`
  builds and OTA updates were iOS-only.

So every Android user (on ≤ `1.9.0`) was hard-locked:

1. App calls `/api/mobile/app-version?platform=android` → server demands ≥ `1.10.0`, force update.
2. Installed version is below `1.10.0` → blocking screen (`ForceUpdateScreen`).
3. Button opens the Play listing, but the newest Android version available is `1.9.0`.
   There is nothing newer to install → Play shows "Open", not "Update" → **nothing happens**.

The mobile button itself works fine (`Linking.openURL(updateUrl)` with the correct
Play URL); the bug was a server config forcing a version that does not exist on Android.

## Fix

Made the version gate **platform-aware** in `app/api/mobile/app-version/route.ts`:

| Platform | minimumVersion | latestVersion | forceUpdate |
|----------|----------------|---------------|-------------|
| iOS      | `1.10.0`       | `1.10.0`      | `true`      |
| Android  | `1.9.0`        | `1.9.0`       | `false`     |

- Android minimum now matches the newest build actually live on Google Play (`1.9.0`),
  so no Android user is blocked.
- Android `forceUpdate: false` → `_layout.js` shows no blocking screen. Users on `1.9.0`
  enter the app directly; users below `1.9.0` see a dismissible soft-update banner only.
- iOS behavior is unchanged.
- Server-side checkout/bundle-tier guards already protect `1.9.0` clients, so dropping
  the Android force gate does not reopen the pricing concern that motivated the original gate.

## Behavior After Fix

- Existing Android customers can use the app again immediately (after deploy + ~5 min CDN cache).
- iOS force-update to `1.10.0` continues to work as before.

## Deploy / Rollout

- This is a **server-side change only**. No app build or store review required.
- Takes effect after the `cosmetics-website` deploy. Response is cached
  `s-maxage=300` (5 min), so allow up to 5 minutes for propagation.

## Follow-Up (proper fix, separate task)

To bring Android back onto the `1.10.x` line and re-enable a force gate:

1. Build Android production AAB: `npm run build:android:production` (genosys-mobile-app).
2. Submit to Google Play: `npm run submit:android`, promote to production, wait for review.
3. Once `1.10.x` is **live** on Google Play, bump Android `minimumVersion` to `1.10.0`
   (and `forceUpdate: true`) in this route.

## Guardrail

Never set a platform's `minimumVersion` above the newest build that is actually
live on that platform's store, or users get hard-locked out with no path forward.
