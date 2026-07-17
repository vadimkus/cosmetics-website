# Partners page — remove Face Only, add New You Star — 2026-07-17

## Changes

1. **Removed** `THE FACE ONLY, BLUEWATERS ISLAND` from `lib/partners.ts` (salon closed).
   - Deleted unused logo `public/images/partners/thefaceonly.png`.
   - Removed from chatbot partner directory (`lib/chatbot/config.ts`).

2. **Added** `NEW YOU STAR BEAUTY HEALTH CLINIC L.L.C, THE MALL UMM SUQEIM`
   - Address: The Mall — Umm Suqeim 3 — G Floor — Shop 21-22, Jumeira St, Dubai
   - Phone: +971 54 777 6703
   - Hours: daily 10:00–22:00 (from Google / Zavis)
   - Directions: Google Maps daddr for The Mall shops 21–22
   - No website / Fresha link (removed on request)
   - Logo: `public/images/partners/new.png` (clinic sign photo; replaced generated placeholder)
   - Theme: emerald (clinic)

## Sources

- User-provided address / phone / Maps link
- Zavis / Google: 4.8★, open 10:00–22:00 daily
- Existing MoySklad onboarding: DHA polyclinic at The Mall, Shop 21, Umm Suqeim Third

## Visibility

Web `/partners` + mobile partners API both read `lib/partners.ts`.
