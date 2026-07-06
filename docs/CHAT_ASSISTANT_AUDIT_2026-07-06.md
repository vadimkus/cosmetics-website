# AI Chat Assistant ("Genie") — Audit + Fixes — Web & App — 2026-07-06

Examined: `/api/chat` route, `lib/chatbot/config.ts` (1,851-line system prompt +
product catalog), web `ChatWidget.tsx`, mobile `app/chat.js` + `services/chatService.js`.
Every product in the prompt catalog was verified against the live API (53 items,
price + stock + existence), and the live catalog was diffed the other way.

## What's solid

- Streaming chat via AI SDK (gpt-4o-mini, 700 tokens, 10 msg/min rate limit); mobile
  parses both v6 SSE and legacy stream formats with plain-text fallback.
- Product cards: bot tags `{{id:N}}`; web fetches `/api/products/{id}`, mobile
  prefetches **user-aware** (`fetchProductById(id, user)`) — VIP prices show on
  app chat cards. Add-to-bag, price-on-request → WhatsApp quote on both.
- Conversation analytics tracked fire-and-forget (`chatConversation` upsert).
- Localization: strict AR/RU language modes; UAE weekend/time-of-day greeting
  context on both platforms.
- Prompt prices: 52 of 53 catalog entries matched live prices exactly.

## Bugs found → fixed

1. **Wrong product ID in prompt (eye care)**: "EYE CONTOUR SERUM {{id:61}}" — id 61
   is the **HR³ MATRIX SCALP BRUSH (AED 50)**. Anyone asking about eye care got a
   scalp-brush card labelled as an eye serum. → `{{id:17}}` (the real serum).
2. **Needle Pen-K (id 2) is a dead product** — `/api/products/2` returns 404, but
   the prompt still recommended it. Web card shows an error state; the mobile card
   spun **forever**. → removed from the catalog.
3. **Mobile infinite spinner** on any failed product fetch: `productCache` was only
   set on success, and the renderer showed a loading spinner whenever the entry was
   missing. → failures now cache `null` and the card renders nothing.
4. **Catalog was missing 12 sellable products** — Genie literally could not
   recommend or card them: CERABARRIER BIOME GEL CLEANSER (66), Bio-Meso PDRN
   Homecare 5000 (65), Bio Meso PDRN 60000 (60) — the flagship PDRN line! — plus
   REVITA GLOW BB SPF38 (63), INTENSIVE REPAIR COLLAGEN MASK (53), Hair Stamp (64),
   and all six Beauty Boxes (55–59, 62, which the prompt mentioned in prose but
   could never link/card). All added with live prices; PROFESSIONAL section now
   points home users to the retail PDRN options instead of "clinic only".

## Known accepted behavior

- Web chat cards fetch public product data → VIP users see retail on the card,
  correct price in the bag (same accepted gap as skin-analysis/rec surfaces; mobile
  chat is already user-aware).
- Rate limiting is an in-memory map per serverless instance — soft at scale, fine today.
- Prompt prices are hardcoded — this audit is the sync mechanism until the catalog
  is generated from the DB (worth doing if product churn increases).

## Ship

- Web: prompt fixes deployed via main.
- Mobile: OTA runtime 1.10.4 (chat spinner fix).
