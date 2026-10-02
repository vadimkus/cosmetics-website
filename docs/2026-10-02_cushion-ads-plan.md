# Cushion 41 paid ads: findings and options (2 Oct 2026)

Vadim asked for the best ad to run for the Skin Caring Blemish Balm Cushion and how to set up targeting.

## What the data says

Web orders 2026 (genosys.ae DB; WhatsApp/MoySklad-only sales not included):

- 126 orders, 149 units, 106 customers, 17 repeat (16%). Monthly 7–21 orders, peak Jun (21), Sep 18.
- Dubai 119 / Abu Dhabi 6 / Sharjah 1. Locale en 116, ru 10, ar 0.
- Paid by card (Stripe) 105, COD 15, bank 4.
- Shades by units: Beige 100, Ivory 24, Camel 21.
- Order value median AED 505, mean 612. 56 orders were cushion-only; top add-ons are the free collagen mask
  (gift at AED 500 paid), sea algae mask (gift at 700), mist 14, Ultra Shield 39.
- Known ages (47 of 126): mostly 25–44, some 55+. Customers are clinics (15 orders) and VIP (11) as well as retail (100).
- 28 units sold at AED 150 (half price), list price AED 300.

Instagram:

- Cushion reel (30 Sep): 693 views, 529 viewers, 46.8% non-followers, 6 shares, 1 save, 9 likes — best of the
  new campaign reels (PCT 323, GENO-LED 178). Web insights show no watch-time.
- No ads in the last 60 days. Facebook Page 257 followers, Instagram 3.1K.

Tracking:

- **No Meta Pixel, no Conversions API, no dataset in Events Manager.** Site has GA4 only (`lib/analytics.ts`,
  purchase events). Meta cannot optimise for or report website sales today.

## Options

1. **Click-to-WhatsApp ads (recommended first).** No pixel needed; matches how UAE buyers order; team closes on
   WhatsApp with a payment link or COD. Needs the WhatsApp Business number linked to the Page.
2. **Website sales campaign (Advantage+ sales)** after Pixel + CAPI are installed (browser pixel + server
   Purchase from the Stripe webhook, deduplicated by event id, consent-aware). Cushion alone (~4 orders a week)
   is too few purchases for Meta's learning phase; optimise for the whole store or Add to cart at first.
3. **Boost the Cushion reel** from Instagram: quickest test, weakest optimisation.
4. **Retargeting + refill**: video viewers / engagers (no pixel needed), later site visitors; 106 cushion buyers
   as a customer list for exclusion and a refill reminder (email/app push are free).
5. **Creator / partnership ads**: real face and hand swatch from a Dubai cosmetologist or UGC creator;
   a cosmetologist account already liked the reel.

## Targeting (prospecting)

- Location: Dubai, Abu Dhabi, Sharjah, "people living in". Age 25–50 suggestion, women suggestion,
  Advantage+ audience on. Interests only as suggestions: cushion foundation, BB cream, K-beauty, sunscreen.
- English ads for everyone; separate Russian ad (RU slides exist) to Russian speakers; Arabic small test.
- Exclude past buyers from prospecting (customer list upload).
- Placements: Instagram Reels, Stories, Feed (9:16 creative); Facebook optional.

## Creative

- Cut the 20 s reel to 10–12 s with the hook in the first second (SPF50+ PA++++ on the compact, shade swatch).
- Offer already in place: spend AED 500 → free collagen mask (median basket is AED 505). Refill in the box.
- Add one real-hand shade swatch video (three shades), no lifestyle/towel shots, no Dubai skyline.
