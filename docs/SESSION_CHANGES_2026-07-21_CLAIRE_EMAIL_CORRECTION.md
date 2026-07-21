# Claire Cabarles Account Email Correction

Date: 2026-07-21

## Outcome

- Corrected Claire Cabarles's login email from `clairecabarles@gmail.con` to `clairecabarles@gmail.com`.
- Preserved the existing bcrypt password hash, account ID, profile, rewards, and registration data.
- Verified that the corrected address was not assigned to another user and that the account remains password-enabled.
- Updated matching analytics email references.
- Sent the standard English welcome email to the corrected address.
- Mail provider accepted the message with ID `<ea7df580-626d-6240-8797-af250ff1816d@gmail.com>`.

## Audit script

`scripts/fix-claire-email-and-send-welcome-20260721.ts`
