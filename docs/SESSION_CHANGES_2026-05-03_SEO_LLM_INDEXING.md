# SEO & LLM Indexing Improvements

Date: 2026-05-03

## Summary

Implemented a broad SEO and AI-crawler indexing pass for the GENOSYS website.

## Changes

- Fixed locale proxy exclusions for machine-readable endpoints so `/llms.txt`, `/llms-full.txt`, `/ai-products.txt`, `/sitemap-index.xml`, `/feed/*`, `/opensearch.xml`, and localized manifests are not redirected by language preference.
- Added generated AI indexes:
  - `/llms-full.txt` — full brand, category, concern, guide, product, and blog index.
  - `/ai-products.txt` — product-level AI index with multilingual names, categories, price, stock, concerns, and usage snippets.
- Expanded `public/llms.txt` with product feed, blog feeds, AI indexes, and high-intent commercial guide links.
- Added blog discovery feeds:
  - `/feed/blog.xml` RSS.
  - `/feed/blog.atom` Atom.
- Added `/opensearch.xml` and global `<link rel="search">` discovery, pointing site search to `/products?search={searchTerms}`.
- Hardened product image URL handling via shared SEO helpers so absolute image URLs are not prefixed again.
- Localized EN/AR/RU product metadata using product translation fields where available.
- Moved product JSON-LD rendering out of the client PDP component and into server product pages for EN/AR/RU.
- Enriched Product JSON-LD with audience, usage info, target concerns, available languages, localized name/description, and verified-only rating behavior preserved.
- Added eight real commercial guide pages under `/guides/*`:
  - Korean skincare Dubai
  - Microneedling devices UAE
  - Professional skincare training Dubai
  - GENOSYS distributor UAE
  - Dermacosmetics for clinics UAE
  - Korean sunscreen UAE
  - Acne treatment products UAE
  - Pigmentation serum Dubai
- Added `/guides` index page and sitemap entries for the guide pages.

## Notes

- No fake review or aggregate rating data was added.
- Commercial guide pages are English-only for now because the target keywords are primarily English UAE search terms.
- Vercel will deploy automatically when pushed to `main`.
