# Post-payment pages on the editorial system

Date: 18 Aug 2026
Commit: `e44ecaae`

## Scope

| Route | File | Old-palette utilities before |
|---|---|---|
| `/pay/success` | `app/pay/success/PaymentSuccessClient.tsx` | 30 |
| `/pay/success` (wrapper) | `app/pay/success/page.tsx` | 3 |
| `/pay/cancel` | `app/pay/cancel/page.tsx` | 23 |
| `/checkout/cancelled` | `app/checkout/cancelled/CheckoutCancelledClient.tsx` | 28 |
| `/checkout/cancelled` (wrapper) | `app/checkout/cancelled/page.tsx` | 1 |
| `/track/[orderNumber]` | `app/track/[orderNumber]/OrderTrackingClient.tsx` | 71 |

All six are at zero now. The Arabic and Russian `track` routes re-export the same client, so
they are covered too.

The two `/pay/*` pages are the return targets for the mobile app's Stripe flow — they carry
`genosysapp://` deep links, which are untouched.

## The status colour decision

Order tracking had seven hues in `getStatusDisplay`: yellow (pending), blue (confirmed),
indigo (processing), purple (shipped), orange (out for delivery), green (delivered), red
(cancelled). That is a rainbow doing work the timeline already does positionally.

Kept as meaning are the two outcomes a customer scans for:

- **green** — delivered
- **red** — cancelled

Everything in between became one in-progress treatment (blush ground, rose text), so "not
finished yet" reads as a single state rather than five arbitrary colours.

The timeline carries the detail instead, and more legibly than hue did:

| Step state | Treatment |
|---|---|
| Completed | ink dot, ink connector |
| Current | rose dot, pulsing |
| Still to come | outline dot, muted label |

Payment status keeps green for paid and amber for pending, on the same reasoning.

## CTA hierarchy on /checkout/cancelled

The page had two solid buttons in two different colours — "Review Cart" in `primary-600` and
"Try Again" in `green-600` — so neither read as the primary route. Retrying the payment is
the one thing we want from that page, so it takes the solid button and reviewing the cart
steps back to the outline.

## Two bugs fixed

Both were on pages a customer only reaches when something has already gone wrong.

**Wrong support number.** `/pay/cancel` linked WhatsApp to `971528860018`. That number
appears nowhere else in the codebase; the other 31 support links all use `971585487665`.
Changed to the site-wide number. **Worth confirming** in case `971528860018` was deliberate,
but the 31-to-1 split says stale.

**Broken image fallback.** The tracking page used `/images/placeholder.png` for an order item
with no image. That file is not in the repo, so the fallback rendered broken. Now uses
`/images/genosys-logo-transparent.png`, which is what
`.cursor/rules/product-gallery-images.mdc` specifies.

## Follow-up worth doing

`/images/placeholder.png` is referenced in **8 more places** and none of them resolve:

- `components/home/HomeDesktopSections.tsx:193`
- `components/product/ProductImageGallery.tsx:181, 298, 368`
- `components/EnhancedProductImage.tsx:224`
- `lib/imageOptimization.ts:22, 309`
- `components/ChatWidget.tsx:205` (references `/images/placeholder.jpg`, also missing)

Only the tracking one was in scope here. The rest are one small sweep, and the same rule
already names the correct fallback.

## Verification

Typecheck clean, no lint errors, 490 tests across 68 suites, clean production build. All
four pages screenshotted, including the full tracking view at 1280 and 390 wide by stubbing
`/api/orders/track/*` — that endpoint returns `{ success, data }`, not a flat object.

Console showed two messages, both pre-existing and unrelated: `[ORDER_TRACK_PAGE] DB check
failed, falling back to client` (the test order is not in the local database, and the page
correctly falls back to client fetching) and a preload warning for a global video poster.
