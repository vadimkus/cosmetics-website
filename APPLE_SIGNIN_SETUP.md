## Sign in with Apple (Website) — Setup (Option B)

This project supports Sign in with Apple on the **website** with full account linking via `users.appleSub`.

### 1) Apple Developer Console setup

You need:

- **App ID**: `com.genosys.mobile` (already used for iOS app)
- **Service ID** (for the website): create a new Service ID, e.g. `ae.genosys.web`
- Enable **“Sign in with Apple”** for the Service ID

Configure:

- **Domain**: `genosys.ae`
- **Return URL / Redirect URI**:
  - `https://genosys.ae/api/auth/apple/callback`

### 2) Required Vercel environment variables

Set these in the **cosmetics-website** project on Vercel:

- `APPLE_WEB_SERVICE_ID` = your Service ID (e.g. `ae.genosys.web`)
- `APPLE_TEAM_ID` = your Apple Developer Team ID
- `APPLE_KEY_ID` = Key ID for the Sign in with Apple key
- `APPLE_PRIVATE_KEY` = the `.p8` private key contents
  - Paste the full key, including `-----BEGIN PRIVATE KEY-----` lines, or paste the raw key content.
  - Newlines may be stored as `\n` — code handles this.

Optional:

- `APPLE_WEB_REDIRECT_URI` = exact callback URL (defaults to `https://<origin>/api/auth/apple/callback`)

### 3) What happens in the backend

- `/api/auth/apple` redirects to Apple authorize URL (response_mode=form_post).
- `/api/auth/apple/callback` exchanges the `code` for tokens, verifies the `id_token`, and:
  - Finds user by `appleSub`, else links by email if present, else creates user.
  - Sets `genosys_session` cookie.

### 4) Database

Prisma field:

- `User.appleSub String? @unique`

On Vercel, the build already runs `prisma db push` via `scripts/deploy-setup.js`.


