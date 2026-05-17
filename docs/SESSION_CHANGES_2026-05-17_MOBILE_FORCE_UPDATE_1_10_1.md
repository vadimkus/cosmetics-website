# Mobile App Force Update to 1.10.0

Date: 2026-05-17

## Context

A customer reported that the native mobile app only offered Cash on Delivery, while current testing showed both Card and COD available. The current app code renders both payment methods and defaults first-time users to Card, so the likely cause is an older installed app version or stale bundle.

## Change

Updated `app/api/mobile/app-version/route.ts` so the server-controlled version gate now requires native app version `1.10.0`, which is the latest public App Store version verified on 2026-05-17:

- `minimumVersion`: `1.10.0`
- `latestVersion`: `1.10.0`
- `forceUpdate`: `true`
- Message updated to mention checkout and payment improvements.

## Behavior

Any installed app version below `1.10.0` that calls `/api/mobile/app-version` on cold start will see the blocking update screen and cannot continue until updating from the App Store or Google Play. Users already on `1.10.0` or newer are allowed through.

## OTA Note

No OTA update is required for this force gate. The gate is controlled by the website API response and takes effect after the website deployment. OTA is only useful for shipping JavaScript changes to compatible installed builds; it is not required to make old builds show the force-update screen.
