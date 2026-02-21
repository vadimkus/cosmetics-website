# Protocol PDF Download — Technical Documentation

## Overview

Each of the 8 skin concern pages offers a downloadable protocol PDF. This document describes how the download works on web vs native app, and the fix applied for the web bug (Feb 2026).

## Concern Pages with Protocol PDFs

| Slug | PDF File | Location |
|------|----------|----------|
| sun-protection | Protocol_sun.pdf | `/documents/ppt/Protocol_sun.pdf` |
| acne-treatment | Protocol_acne.pdf | `/documents/ppt/Protocol_acne.pdf` |
| pigmentation | Protocol_Pigmentation.pdf | `/documents/ppt/Protocol_Pigmentation.pdf` |
| scars-treatment | Protocol_scar.pdf | `/documents/ppt/Protocol_scar.pdf` |
| hair-loss | Protocol_Hair_Loss.pdf | `/documents/ppt/Protocol_Hair_Loss.pdf` |
| anti-aging | Protocol_Anti-Aging.pdf | `/documents/ppt/Protocol_Anti-Aging.pdf` |
| hydration | Protocol_Hydration_Treatment.pdf | `/documents/ppt/Protocol_Hydration_Treatment.pdf` |
| sensitivity | Protocol_Sensitive.pdf | `/documents/ppt/Protocol_Sensitive.pdf` |

All PDFs are static files in `public/documents/ppt/`. Data is defined in `lib/concernsData.ts` under each concern's `protocolPdf` field.

---

## Web Implementation

### Current (Fixed — Feb 2026)

**Files:** `app/products/concern/[slug]/page.tsx`, `app/ar/...`, `app/ru/...`

```tsx
<a
  href={concern.protocolPdf.url}
  target="_blank"
  rel="noopener noreferrer"
  className="..."
>
```

- `target="_blank"` — Opens in a new tab, bypassing Next.js client-side router
- `rel="noopener noreferrer"` — Security best practice for external links
- The browser performs a direct HTTP GET to the PDF URL and displays/downloads the file

### Previous (Buggy)

```tsx
<a href={concern.protocolPdf.url} download ...>
```

- The `download` attribute caused Next.js to intercept the navigation
- Instead of fetching the PDF, the browser received the SPA HTML shell
- User saw "Save Protocol_Hair_Loss.html" instead of the PDF

### Why `target="_blank"` Fixes It

With `target="_blank"`, the link is treated as a full page navigation to an external resource. The browser opens a new tab and fetches the URL directly from the origin. Next.js router does not intercept this; the static file is served by Vercel as a normal asset.

---

## Native App Implementation

**File:** `genosys-mobile-app/app/concern-detail.js`

```javascript
const handleProtocolDownload = () => {
  if (!data?.protocolPdf?.url) return;
  haptics.lightTap();
  const baseUrl = AUTH_CONFIG.ASSET_ORIGIN || 'https://genosys.ae';
  Linking.openURL(`${baseUrl}${data.protocolPdf.url}`);
};
```

- Uses React Native `Linking.openURL()` to open the full URL in the device's external browser (Safari/Chrome)
- No Next.js involved — direct HTTP request to the static PDF
- **No bug** — the native app never had the HTML-vs-PDF issue

---

## API

The mobile API (`GET /api/mobile/concerns/[slug]`) returns `protocolPdf` with:

- `url` — Path, e.g. `/documents/ppt/Protocol_Hair_Loss.pdf`
- `title` — Localized title
- `description` — Localized description
- `fileSize` — e.g. `"163 KB"`

---

## Related Documentation

- `lib/concernsData.ts` — Source of truth for protocol PDF URLs and metadata
- `docs/protocols/` — Protocol content (home care routines, etc.)
- `SESSION_CHANGES_2026-02-20.md` — Session log for the web fix
