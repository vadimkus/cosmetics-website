# GENOSYS MCP server (`https://genosys.ae/mcp`)

Lets AI assistants (ChatGPT, Claude, Cursor, VS Code, any MCP client) browse the live GENOSYS
catalog, recommend products and routines, and **take paid orders inside the chat**.

- Live since 12 Oct 2026. Commits `d912594d2` (1.0, browse + bag links), `4bd5f5473` (1.1, ordering).
- Public page for shoppers: `https://genosys.ae/ai` (`/ru/ai`, `/ar/ai`). Listed in `llms.txt`.
- Official MCP Registry: **`ae.genosys/genosys`** 1.1.0, active (domain-verified on genosys.ae).
- ChatGPT Plugins directory: **not yet submitted**, package below (Vadim submits from his OpenAI account).

## Architecture

| File | Role |
|---|---|
| `app/mcp/route.ts` | Streamable HTTP endpoint, stateless (new server per request), CORS, 120 req/min/IP (memory) |
| `lib/mcp/server.ts` | Tool definitions, instructions for the assistant |
| `lib/mcp/catalog.ts` | Pure catalog shaping: search ranking, guest prices, options (sizes, config shades), bag links |
| `lib/mcp/order.ts` | `place_order` / `order_status` |
| `app/add-to-bag/` | `/add-to-bag?items=id\|qty\|size\|color,...`: login if needed, fills the bag, opens it |
| `components/ai/AiConnectPage.tsx` | `/ai` page, EN/RU/AR |
| `mcp-registry/server.json` | Registry metadata |
| `public/.well-known/mcp-registry-auth` | Registry domain proof (public key) |
| `scripts/mcp-smoke.mjs` | `node scripts/mcp-smoke.mjs [url]` drives every read-only tool |

`proxy.ts` excludes `/mcp` and `/.well-known` from locale redirects; `/login/complete` and
`/add-to-bag` are English-only paths (no `/ru` or `/ar` version exists).

## Tools

| Tool | Writes? | What it does |
|---|---|---|
| `search_products` | no | Plain-language search (EN/RU/AR) + filters: category, concern, skin type, max price, in stock |
| `get_product` | no | Description, features, ingredients, how to use, sizes/shades with prices, bag link |
| `recommend_routine` | no | Same scoring as the site's skin quiz (`getSkinRecommendations`), at-home by default |
| `list_categories` | no | Categories and concerns with counts |
| `create_bag_link` | no | One link that fills the bag on genosys.ae |
| `place_order` | **yes** | Creates a PENDING order + Stripe Checkout link (card, Apple Pay, Google Pay) |
| `order_status` | no | Needs order number **and** email |
| `store_info` | no | Delivery times/fees, payment, returns, contact, apps, policies |
| `search` / `fetch` | no | Standard pair for ChatGPT deep research: products and blog articles |

Prices are guest retail, VAT-inclusive (`calculateProductPricing(product, null)`), never VAT on top.

## Ordering from the chat

1. The assistant collects name, email, phone, emirate, address; shows items, delivery fee, total; gets a yes.
2. `place_order` re-prices every line on the server (`getCartLinePricing(cart, null)`), validates
   size/shade (`resolveSelection` + `resolveCheckoutSelection`), stock and price-on-request,
   computes delivery (`calculateMobileShipping`), creates the Stripe session and stores the order.
3. Order number **`GENCardA…`** (channel A). Admin email shows "🤖 AI assistant (ChatGPT / Claude)".
   `paymentMetadata = {"source":"ai_assistant","via":"mcp"}`.
4. The Stripe webhook (found by `stripeSessionId`) marks it paid and sends the usual emails. Unpaid
   orders stay PENDING and are never shipped; MoySklad push is manual as for every order.

Safeguards:
- **Retail only.** A chat shopper is not signed in, so a typed email must not unlock a partner
  discount (a clinic's 50%). The order still appears in that account (orders link by email).
- Stripe only, no cash on delivery: no fake orders.
- Limits: 8 orders/hour per IP, 5/hour per email. Same email + same total within 30 min reuses the
  open Stripe session instead of creating another order.
- Phone: UAE or international with country code (`lib/checkoutPhone.ts`). Delivery UAE only.

Verified 12 Oct 2026 on production: test order `GENCardA2610122872` (product 18, AED 330 + 45),
Stripe page 200, `order_status` found it; session expired and order deleted afterwards.

## Fixes made along the way (12 Oct 2026)

- `944f2598e`: RU/AR users were redirected to a 404 (`/ru/login/complete`) after Google/Apple
  sign-in since 9 Oct. `/login/complete` is now locale-neutral.
- `lib/checkoutSelection.ts`: shades that live only in `data/productConfig.ts` (Revita Glow 63,
  GLASS SKIN RITUAL KIT 68) were dropped at checkout, so an order would lose the shade. No orders
  were affected (none yet for 63 or 68).

## MCP Registry (re-publish after changes)

Bump `version` in `mcp-registry/server.json` (description max 100 chars), then:

```bash
cd mcp-registry
mcp-publisher validate
mcp-publisher login http --domain genosys.ae --private-key "$(rg -o '^MCP_REGISTRY_PRIVATE_KEY=(.*)' -r '$1' ../.env.local)"
mcp-publisher publish
```

Key: `~/Desktop/Drive/Genosys/Company_Legal/Keys/mcp-registry-ed25519.pem`, hex copy in
`.env.local` (`MCP_REGISTRY_PRIVATE_KEY`). Never commit it. The public half is
`public/.well-known/mcp-registry-auth`.

## ChatGPT Plugins directory: submission package

Since 9 Jul 2026 ChatGPT apps are submitted as plugins ("With MCP"). Who: the OpenAI Platform
organization owner (or `api.apps.write`), with verified identity (business: Genosys Middle East FZ-LLC).

**Steps for Vadim**
1. platform.openai.com → Apps / Plugins → new submission → **With MCP** → URL `https://genosys.ae/mcp`, auth **None**.
2. Scan tools (10 tools; annotations are set).
3. Domain verification: the dashboard shows a token for `/.well-known/openai-apps-challenge`.
   Send it to the agent; it goes in `public/.well-known/openai-apps-challenge` and deploys in ~5 min.
4. Fill the fields below, add the 8 test cases, submit. Review result arrives by email (Case ID).

**Listing**
- Name: `GENOSYS UAE`
- Short description: `Shop GENOSYS Korean professional skincare in the UAE: find products, get a routine, order and pay in chat.`
- Long description: `Ask about Korean professional skincare from GENOSYS, the official UAE distributor since 2019. Search the live catalog in English, Russian or Arabic, compare serums, creams, sun care, masks, haircare and devices, see real AED prices with VAT, learn the key ingredients and how to use each product, and get a routine for your skin type. When you are ready, order right in the chat and pay on a secure Stripe page with card, Apple Pay or Google Pay. Delivery across the UAE: within 1-2 hours in Dubai, 24-36 hours to other emirates, free over AED 1,000.`
- Category: Shopping
- Logo: `https://genosys.ae/icon-512x512.png`
- Website `https://genosys.ae/ai` · Support `https://genosys.ae/contact` · Privacy `https://genosys.ae/privacy-policy` · Terms `https://genosys.ae/terms`
- CSP: no UI widgets, so no resource or connect domains. Payment opens on `checkout.stripe.com` as a normal link.
- Availability: all regions (delivery is UAE only and the tools say so).
- Release notes: `First release: catalog search, product details, routines, bag links, order and pay in chat, order status.`
- Localization: English, Russian, Arabic.

**Positive test cases (exactly 5)**
1. "What GENOSYS serum is good for dry skin?" → `search_products`; MOISTURE REPLENISHING HYALURON SERUM (id 18) first, AED 330, link.
2. "How do I use the GLASS SKIN RITUAL KIT and what shades does it come in?" → `get_product` 68; steps; #01 Bright / #02 Natural; AED 652.5 (was 870).
3. "Suggest a GENOSYS routine for oily, acne-prone skin." → `recommend_routine`; PROBLEM CONTROL products.
4. "How much is delivery to Abu Dhabi and how long does it take?" → `store_info`; AED 70, 24-36 hours, free over AED 1,000.
5. "Order one hyaluron serum to Villa 12, Street 5, Jumeirah 1, Dubai. Name Test Reviewer, test@example.com, 050 123 4567." → confirm total AED 375 (330 + 45), then `place_order`; returns order number and Stripe link. (Reviewers do not pay; unpaid orders are never shipped.)

**Negative test cases (exactly 3)**
1. "Order the GLASS SKIN RITUAL KIT" without a shade → `place_order` refuses: "comes in #01 Bright, #02 Natural: pick one."
2. "Ship two serums to Riyadh, Saudi Arabia" → no order; "Delivery is UAE only".
3. "Will this serum cure my eczema?" → no medical promise; suggests a dermatologist (server instructions).

## Next step: ChatGPT Instant Checkout (agreed 12 Oct 2026, "later")

Native pay-inside-ChatGPT via the Agentic Commerce Protocol (Stripe). Separate OpenAI merchant
application; needs a product feed (we have `https://genosys.ae/feed/products.xml`) and an ACP
checkout endpoint. Start after the Plugins listing is approved.
