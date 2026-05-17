# Mobile Web Partners Menu

Date: 2026-05-17

## Request

Add `Partners` to the mobile web hamburger dropdown and confirm the partners page opens with the proper mobile web page header.

## Change

- Added `Partners` to the `MobileWebHeader` hamburger dropdown Explore section.
- Added `/partners` to `SIMPLE_HEADER_PATH_SEGMENTS` so the global mobile web header hides on the partners page, allowing `PartnersPageClient` to use its own simple mobile page header like the other app-like pages.

## Files

- `components/header/MobileWebHeader.tsx`
- `lib/simpleHeaderPages.ts`
