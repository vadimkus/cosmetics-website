# Android App Links Asset Links

Date: 2026-06-01

## Context

Google Play Console showed failed domain checks for Android deep links on the GENOSYS UAE app. The selected console build was `versionCode 81`, but the failure was website-side: both `https://genosys.ae/.well-known/assetlinks.json` and `https://www.genosys.ae/.well-known/assetlinks.json` returned `404`.

The native app declares verified Android App Links for both `genosys.ae` and `www.genosys.ae` in `genosys-mobile-app/app.json` under package `ae.genosys.app`.

## Change

Added:

- `public/.well-known/assetlinks.json`

The file grants `delegate_permission/common.handle_all_urls` to Android package `ae.genosys.app` using the current EAS Android keystore SHA-256 fingerprint:

```text
06:3F:90:51:55:25:6D:36:D7:DB:41:62:1D:D8:E3:82:59:4B:AF:62:9D:C7:3B:8C:8F:37:F2:F2:61:B8:5D:FC
```

## Validation

- Confirmed the live `.well-known/assetlinks.json` endpoints were returning `404` before the fix.
- Confirmed no existing assetlinks file or route was present in the website repo.
- Validated the new JSON with `python3 -m json.tool`.

## Deployment Notes

This fix only takes effect after the website is deployed to Vercel. After deploy, verify:

```bash
curl -i https://genosys.ae/.well-known/assetlinks.json
curl -sL "https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://genosys.ae&relation=delegate_permission/common.handle_all_urls"
```

The apex domain should return HTTP `200` and Google Digital Asset Links should return a valid statement for package `ae.genosys.app`.

## Follow-up

After deploy, Google Digital Asset Links validated `https://genosys.ae` successfully.

`www.genosys.ae` redirects to `genosys.ae`, and Google Digital Asset Links rejects redirects for `/.well-known/assetlinks.json`. Because of that, the Android app was updated in `genosys-mobile-app` commit `38df703` to remove all `www.genosys.ae` verified App Links and ship a fresh `versionCode 85` AAB.

Vadim confirmed the v85 AAB was pushed/uploaded to Google Play on 2026-06-01. The canonical mobile release record is:

- `genosys-mobile-app/docs/SESSION_CHANGES_2026-06-01_android-play-v85-release.md`
