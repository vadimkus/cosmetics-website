# Mobile Google profile photo refresh

Date: 16 September 2026

The Account screen received its photo from the Google `picture` claim. The
mobile Google-login endpoint only saved that URL when `profilePicture` was
empty, so an old Google default-avatar URL remained forever even after Google
changed the account photo.

On each successful mobile Google login, the backend now refreshes a changed
`googleusercontent.com` picture URL. It deliberately preserves `data:` images
and other non-Google values uploaded through GENOSYS.

Production diagnosis confirmed that the stored URL was reachable but returned
Google's generic blue silhouette rather than a broken image.

## 17 Sep 2026: root cause was Google, not the app

Vadim's avatar stayed generic on App Store 1.13 after the refresh fix. The
stored URL (`lh3.googleusercontent.com/a-/ALV-Uj...=s96-c`) is valid and
returns HTTP 200, but the payload is Google's 567-byte blue silhouette. Every
other Google user in the DB gets a real portrait (1.5 to 18 KB) at a
`/a/ACg8oc...` URL. Google serves the placeholder to third-party sign-in when
the account has no photo or its profile-photo visibility is not "Anyone"
(Google Account > Personal info > Profile picture). Nothing in the app or an
OTA can change what Google returns; the account setting or a manual upload
via View & edit is the remedy.

Server-side guard added so the refresh never downgrades a real stored photo
to a placeholder: `isGoogleDefaultAvatar` fetches the picture (2.5 s cap) and
treats anything under 900 bytes as the default silhouette. Fetch failures do
not block a refresh. Only runs when the URL actually changed.

## 25 Sep 2026: placeholder detection by pixels, all three sign-in routes

The 17 Sep size threshold (< 900 bytes) was wrong. Of 310 stored Google
avatars, 89 were under 1.3 KB; looked at by eye, 84 of those are Google's
coloured letter avatars (fine to keep, they already read as initials) and
only 5 are real placeholders: the blue silhouette (x2), the grey "no photo"
icon, a grey tile and a white tile. Sizes overlap, so no byte threshold
separates them.

Detection now decodes only images under 1.5 KB (sharp) and measures the share
of pure-white pixels: placeholders are 0% or 100%, letter avatars 1.4% to
6.7%. `googlePictureForNewUser` / `googlePictureUpdate` in
`lib/googleProfilePicture.ts` are used by the mobile route and both web routes
(`auth/google/callback`, `auth/google/verify`). The web callback previously
replaced the photo with Google's on every sign-in, including photos uploaded
through GENOSYS; it no longer does. Uploaded photos are never touched,
placeholders are never stored, and a stored placeholder is cleared so the app
and site show initials.

`scripts/clear-google-placeholder-avatars-20260925.ts --apply` cleared the 5
stored placeholders.
