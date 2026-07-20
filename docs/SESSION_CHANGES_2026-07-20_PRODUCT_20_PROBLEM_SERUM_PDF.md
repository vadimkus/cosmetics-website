# Session Changes — 2026-07-20 — PROBLEM CONTROL SERUM product PDF

## What

Attached `GENOSYS INTENSIVE PROBLEM CONTROL SERUM.pdf` to
**PROBLEM CONTROL SERUM (product 20)** — same pattern as the toner / other
product guides.

Note: the request referenced `/products/18`, but product 18 is
**MOISTURE REPLENISHING HYALURON SERUM** (already has its own guide). The
serum PDF belongs on product **20**.

## How

- File: `public/documents/PPT/GENOSYS INTENSIVE PROBLEM CONTROL SERUM.pdf`
  (~2.2 MB). Folder stays capital `PPT` (existing convention); public URLs
  use lowercase `/documents/ppt/...` like all other guides.
- `data/productConfig.ts` product `20` → documentation entry (PDP download).
- Viewer allow-list: `app/documents/ppt/[filename]/page.tsx`.
- Training / downloads listings: EN, AR, RU, mobile training API, profile
  Downloads section.

## Verify

- `https://genosys.ae/documents/ppt/GENOSYS%20INTENSIVE%20PROBLEM%20CONTROL%20SERUM.pdf` → PDF 200
- PDP `https://genosys.ae/products/20` shows the guide download
- Training / profile downloads list includes PROBLEM CONTROL SERUM
