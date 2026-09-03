# Store update prompt, and the state of Sentry in the app

**Date:** 3 September 2026

## 1. Website Sentry: `JAVASCRIPT-NEXTJS-21`, `Can't find variable: EmptyRanges`

Not our code. It is Safari's own modern-media-controls script: the
`MediaController.NullMedia` getters reference an unqualified `EmptyRanges`
and throw once a video element's weak reference is collected (WebKit bug
318284, fixed upstream July 2026, still shipping on iOS 18.x). Product pages
carry a `<video>`, so it surfaces via `window.onerror` with no filename.
Filtered in `instrumentation-client.ts` (`isWebKitEmptyRangesBug`, requires
every frame to be anonymous), and the issue set to ignored in Sentry.

## 2. Sentry in the mobile app has never sent an event

`@sentry/react-native` is installed and `initSentry()` is called on start,
but it returns early without `EXPO_PUBLIC_SENTRY_DSN`, and that variable is
set nowhere: not in `.env`, not in EAS. The config plugin pointed at org
`genosys` / project `mobile-app`, neither of which exists. Every
`captureException` in checkout has been dropped. This is how the brand
screen crashed for a week unseen.

Prepared here: plugin repointed at `genosys-middle-east-fz-llc`, project slug
`genosys-mobile-app`, region `https://de.sentry.io/`. Still needed, and only
Vadim can do it (the website's token cannot create projects):

1. Sentry -> Projects -> Create project -> platform **React Native**, name it
   `genosys-mobile-app` (the slug must match the plugin).
2. Copy the DSN. Then:
   `npx eas-cli env:create production --name EXPO_PUBLIC_SENTRY_DSN --value <dsn> --visibility plaintext`
   and the same line in the app's `.env`. Because `EXPO_PUBLIC_*` is inlined
   at bundle time, the next OTA turns crash reporting on for every installed
   1.12.0 without a store release.
3. Create an org auth token with `project:releases`, `project:read`,
   `event:read` and put it in EAS as `SENTRY_AUTH_TOKEN`. Then remove
   `SENTRY_DISABLE_AUTO_UPLOAD` from `eas.json` production profiles so native
   builds upload source maps, and run
   `npx sentry-expo-upload-sourcemaps dist` after each `eas update` so OTA
   bundles resolve too.

Worth it: yes. The app is the surface paying customers use and it is the only
one with no error signal at all.

## 3. Store update prompt for old builds

A banner already existed and never showed: the server's `latestVersion` was
a constant that said 1.10.0 for a week after 1.12.0 was live; one dismiss
silenced it for good for that version; the copy was English only; and it
compared `Constants.expoConfig.version`, which an OTA can push above the
binary's real version.

Server: `/api/mobile/app-version` now reads `latestVersion` live, iOS from
Apple's lookup API and Android from the Play listing, memoised an hour, with
the known-live version as fallback and `latestSource: store|fallback` in the
response so a fallback is visible. The hard gate (`minimumVersion`,
`forceUpdate`) stays hand-set with its existing warning.

App (`contexts/AppUpdateContext.js`): the installed version is
`Updates.runtimeVersion`, which tracks the binary here. When it is older than
the store's:

- a dot on the avatar in the shop header (accent, top corner, clear of the
  online dot);
- a `1` on the app icon, through a new single owner `utils/appBadge.js` so the
  notification code's clear-to-zero no longer wipes it;
- a row in Profile -> General with installed and latest versions, opening the
  store;
- a prompt on open, at most once every 24 hours per version, "Update now"
  or "Later".

Strings in EN, RU, AR under `appUpdate.*`. `utils/version.js` holds the
comparison for both gates; `smoke:app-update` covers it.

Verified: endpoint returns `1.12.0` / `store` for both platforms. Everyone is
on 1.12.0 today so nothing shows; the next store release will light it up
without any further change.
