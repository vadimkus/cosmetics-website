# EyeCell PDF production path fix — 2026-08-06

## Problem

The EyeCell Eye Zone Care PDF viewer opened the site 404 page:

`/pdf-viewer?file=https%3A%2F%2Fgenosys.ae%2Fdocuments%2FPPT%2FGENOSYS%2520EyeCell%2520EYE%2520ZONE%2520CARE%2520SYSTEM.pdf`

The same uppercase direct URL returned HTML instead of
`application/pdf`.

## Root cause

The PDF existed with the correct filename, and EN/RU/AR training,
profile downloads, product 50 configuration, the mobile training API,
legacy training data, and chatbot references all consistently used
`/documents/PPT/`.

The macOS working tree displayed the folder as `PPT`, but Git still
tracked it as lowercase `public/documents/ppt/`. Vercel's Linux
filesystem therefore deployed the static files under lowercase `ppt`.
Uppercase requests fell through to the dynamic legacy viewer route and
rendered its 404 state. The query-string double encoding was valid and
decoded correctly.

## Fix

- Recorded the existing PDF directory in Git with the intended uppercase
  path: `public/documents/PPT/`.
- Kept the existing authoritative
  `GENOSYS EyeCell EYE ZONE CARE SYSTEM.pdf`; no binary was copied or
  duplicated.
- Added regression coverage for the exact reported viewer query and the
  case-sensitive production asset path.

## Scope

No link copy changes were required. The existing shared link now resolves
consistently for EN/RU/AR training, profile downloads, product 50, mobile
API clients, documents listings, and chatbot links. Product 33 continues
to use its separate `GENOSYS EyeCell EYE PEPTIDE GEL PATCH.pdf`.
