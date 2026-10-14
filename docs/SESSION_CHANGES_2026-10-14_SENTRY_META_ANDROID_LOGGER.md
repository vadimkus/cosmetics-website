# Sentry: Meta Android navigation logger noise (14 Oct 2026)

## Trigger

Sentry email alerts, new issues in `javascript-nextjs`:

- **JAVASCRIPT-NEXTJS-2K** `Error invoking enableDidUserTypeOnKeyboardLogging: Java object is gone`. Facebook 561 / SM-M127F / Android 13, `/products`.
- **JAVASCRIPT-NEXTJS-2J** `Error invoking postMessage: Java object is gone`. Facebook 582 / SM-A725F / Android 14, `/`.
- **JAVASCRIPT-NEXTJS-2H** same `postMessage` message, `/products`.
- Mechanism `auto.browser.browserapierrors.addEventListener`, handled `no`, release `b0ac5e7d`.

## Root cause (not our code)

Facebook and Instagram on Android inject `app://navigation_performance_logger_android`
into pages opened in their in-app browser. Its listeners (`sendBeforeUnloadMessage`,
`sendLoafMessage`, `sendDataToNative`) call the native bridge after the app has
released the WebView's Java object, so the injected script throws. Sentry wraps
`addEventListener`, so one frame from our chunk (`n` in `16q3s1vtoypse.js`) sits
outermost in the stack. No user-visible effect.

The old filter (`isInstagramAndroidNavigationLoggerError`) only matched Instagram,
only the `enableDidUserTypeOnKeyboardLogging` message, only `window.onerror`, and
only stacks with no chunk frame, so these slipped through.

## Change

`instrumentation-client.ts`: renamed to `isMetaAndroidNavigationLoggerError` and widened:

- message `/Error invoking \w+: Java object is gone/`
- mechanism `global_handlers.onerror` or any `browserapierrors.*`
- Android, and browser/UA matches Instagram, Facebook, FBAN, FBAV or FB_IAB
- the throwing (innermost) frame is the injected logger, and every frame is the
  logger or a `_next/static/chunks` wrapper. A throw inside our own code still reports.

## Verification

- `npx eslint instrumentation-client.ts` clean, `tsc --noEmit` clean for the file
- Scratch check against the 2K/2J shapes, the old Instagram `onerror` shape, a throw
  inside our chunk, a different message, and plain Chrome on Android: all as expected

## Follow-up

- After deploy, resolve 2H/2J/2K in Sentry.
