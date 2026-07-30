# AFS Perfect Combination pc19 — Intertek Align — 2026-07-30

## Problem
`pc19Benefit1Text` claimed **MultiEx BSASM® Plus** in both serum **19** and cream **27**.  
Intertek formula for ALL FOR SENSITIVE SERUM has **no** MultiEx BSASM® / Phytolex SC (audit 2026-07-29).

## Fix
Updated Perfect Combination copy (EN / AR / RU):

| Key | New claim basis |
|---|---|
| Benefit1 | Serum: Centella Asiatica + Allantoin · Cream: NMF amino-acid barrier support |
| Benefit2 | Soft soothing + seal / everyday irritant shield (no BSASM) |
| Benefit3 | Cream NMF amino acids lock serum HA — dropped enriched-ceramide wording |
| Benefit4 | Immediate soothe + long-term barrier comfort |

## Files
- `cosmetics-website/messages/{en,ar,ru}.json`
- `genosys-mobile-app/i18n/messages/{en,ar,ru}.json`
- `cosmetics-website/data/productTranslationsRu.ts`
  - product **19** ingredients — removed leftover “Centella (MultiEx BSASM®)” branding
  - product **27** ingredients — MultiEx BSASM® Plus → NMF amino acids + Ceramide NP (soft)

## Not changed
- Hair tonic `pc44` MultiEx BSASM™ lines (different product; out of scope)
- Chatbot generic MultiEx glossary entry (not AFS-specific)

## Deploy
- Website: Vercel deploy of messages
- Mobile: needs OTA for i18n to reach installed apps
