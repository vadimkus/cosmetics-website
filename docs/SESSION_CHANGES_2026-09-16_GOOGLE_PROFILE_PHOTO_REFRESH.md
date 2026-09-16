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
