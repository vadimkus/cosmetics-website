export type EmirateShippingRate = {
  name: string;
  shippingCost: number;
};

/**
 * Single source of truth for MOBILE checkout configuration.
 *
 * IMPORTANT:
 * - Mobile UI uses `/api/mobile/shipping-rates` for these values.
 * - Mobile checkout endpoints MUST use the same config, otherwise users see one total and pay another.
 */
export const MOBILE_CHECKOUT_CONFIG = {
  currency: 'AED',
  vatRate: 0.05,
  freeShippingThreshold: 1000,
  emirates: [
    { name: 'Dubai', shippingCost: 45 },
    { name: 'Abu Dhabi', shippingCost: 70 },
    { name: 'Sharjah', shippingCost: 70 },
    { name: 'Ajman', shippingCost: 70 },
    { name: 'Ras Al Khaimah', shippingCost: 70 },
    { name: 'Fujairah', shippingCost: 70 },
    { name: 'Umm Al Quwain', shippingCost: 70 },
  ] satisfies EmirateShippingRate[],
  lastUpdated: '2025-12-13T00:00:00.000Z',
} as const;

export function normalizeEmirateName(emirate: string): string {
  return String(emirate || '').trim().toLowerCase();
}

/** Highest configured shipping rate — used as the fail-closed default. */
const MAX_SHIPPING_COST = Math.max(
  ...MOBILE_CHECKOUT_CONFIG.emirates.map((e) => e.shippingCost)
);

/** True only for a recognised UAE emirate in the config (case-insensitive). */
export function isValidEmirate(emirate: string): boolean {
  const key = normalizeEmirateName(emirate);
  return MOBILE_CHECKOUT_CONFIG.emirates.some(
    (e) => normalizeEmirateName(e.name) === key
  );
}

export function getShippingCostForEmirate(emirate: string): number {
  const key = normalizeEmirateName(emirate);
  const found = MOBILE_CHECKOUT_CONFIG.emirates.find(
    (e) => normalizeEmirateName(e.name) === key
  );
  // Fail CLOSED: an unrecognised emirate (typo, tampering, wrong script) must
  // never yield free shipping. Charge the highest configured rate instead of 0.
  // The checkout UI constrains selection to the config list, so this only
  // triggers on malformed/tampered requests.
  if (!found) return MAX_SHIPPING_COST;
  return found.shippingCost;
}

export function calculateMobileShipping(subtotal: number, emirate: string): number {
  const sub = Number(subtotal) || 0;
  if (sub >= MOBILE_CHECKOUT_CONFIG.freeShippingThreshold) return 0;
  return getShippingCostForEmirate(emirate);
}

/**
 * VAT is treated as INCLUDED in the displayed subtotal/shipping/total in the mobile UI.
 * We store VAT as the included portion for transparency.
 *
 * Returns the VAT portion rounded to 2 decimal places (AED fils precision).
 * FTA requires exact AED amounts on invoices — no fractional fils.
 */
export function calculateVatIncluded(total: number): number {
  const t = Number(total) || 0;
  const r = Number(MOBILE_CHECKOUT_CONFIG.vatRate) || 0;
  if (t <= 0 || r <= 0) return 0;
  return Math.round(((t * r) / (1 + r)) * 100) / 100;
}




