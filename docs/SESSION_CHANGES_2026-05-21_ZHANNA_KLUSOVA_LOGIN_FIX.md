# Zhanna Klusova — login fix (2026-05-21)

## Issue

Could not log in with `zhannaklusova@icloud.com`.

## DB check

| Field | Value |
|--------|--------|
| **Name** | Zhanna Klusova |
| **Email** | `zhannaklusova@icloud.com` (already correct — no typo in DB) |
| **contactEmail** | same |
| **Phone** | +971585951249 |
| **User ID** | `cmlv16px000k1fjgwmnh6wls9` |
| **Registered** | 2026-02-20 |
| **Last login** | 2026-02-20 (registration day only) |
| **Auth** | Email/password (bcrypt) |

Only **one** account matches name/phone/email — no duplicate with wrong mail.

## Root cause

Email was fine. Stored bcrypt hash did **not** match the password she tried (`Alice07031960`) — likely a different password was set at registration in February.

## Fix applied

Password reset to the value she provided via WhatsApp (2026-05-21). Verified with `bcrypt.compare` after update.

## Tell her

- Login email: **zhannaklusova@icloud.com**
- Use the password she sent you today
- If still stuck: hard refresh / try incognito; she is not a Google-only account
