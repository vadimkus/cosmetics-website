# Partner added: Escape 8 Spa, Meydan (24 Nov 2026)

## Added

**ESCAPE 8 SPA, MEYDAN** (public brand name, from the spa's own website `escape8spa.com`)

| Field | Value |
|-------|-------|
| Location | Azizi Riviera 15, Shop 3 & 4, Meydan, Nad Al Sheba 1, Dubai |
| Phone | +971 4 565 2620 (WhatsApp +971 52 560 7388 noted in chatbot directory) |
| Website | https://www.escape8spa.com/ |
| Directions | Google Maps Place ID `ChIJ7xln_8RpXz4RZA-uknZfLCE` (Escape 8 Spa, Azizi Riviera 15, Meydan) |
| Logo | `/images/partners/escape8.png` |
| Theme | emerald |

The card shows the logo in a 44 px square, so the logo file is the square `E8` infinity emblem extracted from the spa's official high-resolution logo (`logo-new.png`, dark charcoal and warm gold on transparent, 600 x 600).

Also added to the chatbot directory (`lib/chatbot/config.ts`, under "DUBAI - NAD AL SHEBA / MEYDAN") and `docs/CHATBOT_KNOWLEDGE.md`. The mobile app list (`/api/mobile/partners`), localized partner pages (EN/RU/AR), and `PartnersSchema` JSON-LD all read `lib/partners.ts`, so every surface updates together.

## Notes

- Description reflects services publicly listed on `escape8spa.com` (including their own GENOSYS Korean facials page `escape8spa.com/services/korean-facial-dubai`: massage, Japanese head spa, private contrast suite, nails, daily 12:00-02:00 hours, free parking, 4.9/5 rating across 300+ Google/Fresha reviews).
- Internal record: ESCAPE 8 SPA 1 L.L.C-FZ, Meydan FZ licence 2536542.01, Agreement 43 (MoySklad card `00c4c78c-d8ec-11f1-0a80-1bb0009f4955`).
- Verified typecheck, ESLint, `noDashes` test, committed and pushed to `main` (Vercel auto-deploy). Vercel MCP (`plugin-vercel-vercel`) returned 403 for team `team_ltAdx0XQxuxfz9jLnjctnCr6` (`vadimkus-projects`), so a single-use `authorize_team_access` consent link was generated for Vadim to unlock direct Vercel MCP deployment management.

## Files

- `lib/partners.ts`
- `public/images/partners/escape8.png`
- `lib/chatbot/config.ts`
- `docs/CHATBOT_KNOWLEDGE.md`
