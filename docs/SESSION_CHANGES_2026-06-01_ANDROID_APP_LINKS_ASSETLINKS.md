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
curl -i https://www.genosys.ae/.well-known/assetlinks.json
```

Both should return HTTP `200` and JSON content. Then re-run the Play Console deep-link domain check or create a deep-link patch.
