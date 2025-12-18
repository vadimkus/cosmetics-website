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

export function getShippingCostForEmirate(emirate: string): number {
  const key = normalizeEmirateName(emirate);
  const found = MOBILE_CHECKOUT_CONFIG.emirates.find(
    (e) => normalizeEmirateName(e.name) === key
  );
  return Number(found?.shippingCost) || 0;
}

export function calculateMobileShipping(subtotal: number, emirate: string): number {
  const sub = Number(subtotal) || 0;
  if (sub >= MOBILE_CHECKOUT_CONFIG.freeShippingThreshold) return 0;
  return getShippingCostForEmirate(emirate);
}

/**
 * VAT is treated as INCLUDED in the displayed subtotal/shipping/total in the mobile UI.
 * We store VAT as the included portion for transparency.
 */
export function calculateVatIncluded(total: number): number {
  const t = Number(total) || 0;
  const r = Number(MOBILE_CHECKOUT_CONFIG.vatRate) || 0;
  if (t <= 0 || r <= 0) return 0;
  return (t * r) / (1 + r);
}


