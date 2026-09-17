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
