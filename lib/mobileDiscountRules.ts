/**
 * Mobile discount rules (backend, server-authoritative).
 *
 * Business rules:
 * - User percentage discounts must NOT apply to:
 *   - Beauty Boxes (bundles already discounted by 15%)
 *   - Devices (GenoLED, Hair Gentron, HairGen Booster, etc.)
 *   - Hydro Cool Modelling Mask
 *   - Any product marked noDiscount=true
 */

export const normalizeText = (v: unknown) =>
  String(v ?? '')
    .trim()
    .toLowerCase();

export const isBeautyBoxProduct = (product: any): boolean => {
  const catRaw = normalizeText(product?.category);
  const name = normalizeText(product?.name);
  const catCompact = catRaw.replace(/[^a-z0-9]/g, '');

  if (catRaw === 'beauty boxes' || catRaw === 'beauty box') return true;
  if (catCompact.includes('beautybox')) return true;
  if (name.includes('beauty box') || name.includes('beautybox')) return true;
  return false;
};

export const isDeviceProduct = (product: any): boolean => {
  const cat = normalizeText(product?.category);
  if (cat === 'device' || cat.includes('device')) return true;

  // Fallback by name (covers datasets where category is missing)
  const name = normalizeText(product?.name);
  return (
    name.includes('genoled') ||
    name.includes('gentron') ||
    name.includes('hairgen')
  );
};

export const isHydroCoolMask = (product: any): boolean => {
  const name = normalizeText(product?.name);
  return name.includes('hydro') && name.includes('cool') && name.includes('mask');
};

export const isUserDiscountExcludedProduct = (product: any): boolean => {
  if (!product) return false;
  if (product?.noDiscount === true) return true;
  return isBeautyBoxProduct(product) || isDeviceProduct(product) || isHydroCoolMask(product);
};



