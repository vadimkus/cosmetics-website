# Instagram API and Media Download Options

Date: 2026-05-24

Context: Asked whether GENOSYS can post directly to Instagram from Cursor / the website using an API, and whether videos posted by head office accounts can be downloaded when not shared directly.

## Summary

- Direct posting to the GENOSYS Instagram account is possible through the official Instagram Graph API if the account is Business or Creator, linked to a Facebook Page, and authorized with `instagram_basic`, `instagram_content_publish`, and related Page permissions.
- The official Instagram APIs are not a general-purpose downloader for arbitrary Instagram accounts. They are designed for accounts the app/user manages or has authorized access to.
- Downloading videos from another Instagram account via scraping or third-party downloader tools is technically common but fragile, often against Instagram terms, and can create copyright/brand-asset usage risk unless GENOSYS has permission from head office.

## Recommended Path

1. Ask head office for one of:
   - shared asset folder access,
   - Meta Business Suite / Business Manager access,
   - permission to reuse and locally archive their Instagram videos,
   - collaborator or shared content workflow.
2. Build a compliant GENOSYS workflow:
   - monitor head-office post URLs manually or with approved APIs where available,
   - keep a content planning sheet,
   - repost only assets GENOSYS is allowed to reuse,
   - publish GENOSYS posts through the official Instagram Graph API.
3. Avoid password-based bots and Instagram scraping automation for production business use.

## Technical Note

If permission is granted and head office provides source files or direct media URLs, we can automate storage and reposting from the GENOSYS site/admin tooling. Without permission, the safe implementation should stop at tracking post links, captions, dates, and reminders to request the original creative.
