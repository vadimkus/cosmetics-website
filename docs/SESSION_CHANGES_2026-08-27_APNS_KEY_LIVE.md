# APNs key live — Lock Screen card can be tested

Date: 27 Aug 2026

## What landed

- New APNs key `6G72QT5T37` (Sandbox & Production, team-scoped) verified against
  Apple: both hosts returned `400 BadDeviceToken` for a dummy token. JWT is good.
- Four Vercel Production vars set and a production redeploy completed so the
  running site actually has them.
- Sign-in key `WW2RR2AU6S` was left alone. It is not an APNs key.

## How to test

Need TestFlight build 105 on the phone, Live Activity toggle on, logged in.

**Path A — website order, app force-quit (the gap we just closed)**

1. Open the app once so it reports the push-to-start token.
2. Force-quit the app.
3. Place a COD or card order on genosys.ae with the same account.
4. Lock the phone. The card should appear without opening the app.

**Path B — status change on an existing card**

1. Place an order in the app so the card is already on the Lock Screen.
2. Force-quit.
3. In admin, move that order to the next status.
4. The card should advance. The ordinary push notification is separate and
   should still arrive.

If A fails and B works, the start token never reached the server. If both fail,
check Vercel logs for `[APNS]`.
