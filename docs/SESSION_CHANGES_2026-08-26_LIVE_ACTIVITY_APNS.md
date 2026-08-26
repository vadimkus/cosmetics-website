# Driving the Lock Screen order card from the server

Date: 26 Aug 2026

The card ships in app build 1.12.0 (105). Until now it was raised by the app, so it only
appeared once someone had opened their orders. This is the half that lets it appear and
keep moving while the app is force-quit.

## Why none of the existing push code could be reused

A Live Activity update is not a notification. It is addressed to an **ActivityKit** token,
on a topic of its own — `ae.genosys.app.push-type.liveactivity` — with
`apns-push-type: liveactivity`. There is no field in the Expo push API that produces that
request, so `lib/apnsLiveActivity.ts` speaks HTTP/2 to Apple directly, with an ES256
provider token signed from a `.p8` key.

Three tokens are easy to confuse and only one is right in any given call:

| Token | What it does | Where it lives |
| --- | --- | --- |
| Expo push token | ordinary notifications | `users.expoPushToken` |
| **push-to-start** | raises a card while the app is not running | `users.liveActivityStartToken` |
| **per-activity** | updates or ends one existing card | `orders.liveActivityToken` |

Using one where another belongs returns `DeviceTokenNotForTopic`, which explains nothing.
`lib/orderLiveActivity.ts` decides which is which once, so no caller has to.

## The payload is a contract with a Swift struct we do not own

`expo-widgets` renders every Live Activity through one generic type:

```swift
struct LiveActivityAttributes: ActivityAttributes {
  var url: String?
  struct ContentState { var name: String; var props: String }
}
```

Two consequences, both of which are the difference between a working card and a push that
Apple accepts with a 200 while nothing appears on screen:

1. **`content-state.props` is a JSON *string*, not an object.** The props are serialised
   and nested inside a string field. Sending them inline fails to decode, silently.
2. **`attributes-type` is `LiveActivityAttributes`**, the generic type — *not*
   `OrderActivity`. `OrderActivity` is the value of `content-state.name`.

A `start` event also needs an `alert`; without one iOS will not surface a pushed activity.

`__tests__/lib/liveActivityPayload.test.ts` pins all of that — 20 checks on the wire format
and on the progress rules — because the failure mode gives no diagnostic.

## Agreeing with the app

`buildOrderActivityProps` mirrors `buildOrderActivityState` in the app, including the rule
that matters: step one means *accepted*, not paid, so cash on delivery reads **Confirmed**
where a card order reads **Paid**. The strings are duplicated rather than shared, because
the two live in different repositories; the tests on both sides assert the same values, so
a drift fails a build rather than reaching a customer.

## Where it fires

`app/api/admin/orders/[id]/route.ts`, alongside the Expo push that already went out on
every status change. It is wrapped: a card that fails to move must never fail the status
change. The three events are chosen from the order itself — start when there is no card
and the order is still moving, update while it moves, end on delivered or cancelled with a
fifteen-minute dismissal so the final state stays readable.

Dead tokens are cleared when Apple says `410`, `BadDeviceToken` or `Unregistered`.

## Configuration

Four environment variables, none of which exist yet:

```
APNS_KEY_ID       the .p8 key's ten-character id
APNS_TEAM_ID      2842PLB7CS
APNS_KEY_P8       the .p8 contents, newlines escaped or real
APNS_PRODUCTION   "true" for App Store builds, otherwise sandbox
```

Everything no-ops safely until they are set: `isApnsConfigured()` gates every call, so the
site behaves exactly as it does today with them absent.

The key is made once at
[developer.apple.com → Keys](https://developer.apple.com/account/resources/authkeys/list),
enabling **Apple Push Notifications service (APNs)**. It downloads once and cannot be
downloaded again.

## Database

```sql
ALTER TABLE "users"  ADD COLUMN IF NOT EXISTS "liveActivityStartToken" TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "liveActivityToken" TEXT;
```

Applied by `prisma migrate deploy` during the Vercel build, as the other migrations are.

## The app side

Ships over the air; no further binary.

- `services/pushNotificationsService.js` → `saveLiveActivityToken`
- `contexts/AuthContext.js` registers the push-to-start token after login, beside the
  existing device-token registration
- `utils/orderLiveActivity.js` reports the per-activity token once a card is raised

Both paths are wrapped and iOS-gated, so Android and any build without the widget
extension are unaffected.

## Verification

- 20 payload tests, full website suite 1352 passing, typecheck clean
- App bundles clean, `verify:release` clean
- End to end cannot be tested until the `.p8` key exists and build 105 is on a device
