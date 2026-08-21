# Profile documents navigation

**Date:** 21 August 2026

## Problem

The desktop profile sidebar labelled its training-library link as Documents,
but routed to the standalone `/training` page. This removed the account sidebar
and made the user feel that they had left their profile.

## Fix

- Added Documents as a URL-backed profile tab: `/profile?tab=documents`.
- The sidebar remains visible and marks Documents as the current page.
- The Overview Documents card now opens the same internal profile tab.
- Reused the single EN/RU/AR training library in an embedded mode.
- Embedded mode removes the standalone breadcrumb, Home return link and
  duplicate page hero while preserving all guides, product sheets and videos.
- Standalone `/training`, `/ru/training` and `/ar/training` remain unchanged.
- Browser Back/Forward works naturally because the selected tab is represented
  in the URL.

## Verification

- Focused profile/navigation tests: 9 passed.
- Focused ESLint: passed.
- TypeScript: passed.
- Production build compiled successfully, then stopped on an unrelated
  concurrently edited product-copy file (`blemishBalmCopy.ts`, unused `AR`).
