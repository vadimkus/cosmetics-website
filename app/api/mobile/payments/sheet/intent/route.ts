/**
 * MOBILE PAYMENT SHEET INTENT ENDPOINT (canonical name)
 * POST /api/mobile/payments/sheet/intent
 *
 * Alias for /api/mobile/payments/applepay/intent. That handler was always a
 * generic Stripe Payment Sheet intent (card / Apple Pay / Google Pay / Link,
 * automatic_payment_methods enabled) - only its path name was Apple-specific.
 * New app builds call this route; the old path remains for shipped versions.
 */
export { POST, GET } from '../../applepay/intent/route'
