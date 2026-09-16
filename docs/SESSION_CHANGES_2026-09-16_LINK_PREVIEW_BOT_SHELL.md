# Link previews: meta-only shell for chat crawlers — 16 Sep 2026

## Symptom

WhatsApp showed a full card for `/products/12` but a bare `genosys.ae` card
(no title, no description, no image) for `/products/34`, sent one after the
other.

## Cause

Every product page renders dynamically in production (`cache-control:
private, no-store`, `x-vercel-cache: MISS` on every hit) despite
`export const revalidate = 300`. The root layout calls `headers()` to read
`x-pathname` for locale detection, which opts the whole tree out of ISR.
Product HTML is 460 to 500 KB and takes 1.2 to 4 s to come back. WhatsApp's
preview fetcher has a short timeout and a body cap, so whichever link hit a
slow render got the fallback card. The OG image endpoint itself was fine
(already CDN-cached, 0.26 s).

## Fix

- `lib/linkPreviewBot.ts`: dependency-free User-Agent test for WhatsApp,
  facebookexternalhit/Facebot (Messenger, Instagram, Threads, iMessage),
  Twitterbot, TelegramBot, Slackbot, LinkedInBot, Discordbot, Applebot,
  Pinterest, Snapchat, Skype, Viber. Googlebot and Bingbot are not matched
  and keep receiving the real page.
- `proxy.ts`: on `/products/:id`, `/ar/products/:id`, `/ru/products/:id`,
  preview bots are rewritten (URL unchanged for the bot) to
  `/link-preview/products/:id?locale=xx`.
- `app/link-preview/products/[id]/route.ts`: ~2 KB HTML with title,
  description, canonical, full OG and Twitter card tags pointing at the
  existing branded `/products/:id/opengraph-image` card, and product price
  tags. `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`,
  `X-Robots-Tag: noindex`.
- `lib/linkPreview.ts`: renderer with EN/AR/RU title suffix and trailer,
  HTML-escaped.
- Tests: `__tests__/lib/linkPreview.test.ts`.

## Not changed

The underlying `headers()` in the root layout still disables ISR for the
whole site. That is a larger refactor (locale would have to come from the
route segment instead of a request header) and is worth doing for page speed
generally, but it was out of scope for a link-preview fix.
