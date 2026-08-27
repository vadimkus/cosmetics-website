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

/** Minimal product shape needed for discount rule checks */
interface DiscountCheckProduct {
  productNumber?: string | null
  category?: string | null
  name?: string | null
  noDiscount?: boolean
}

const BEAUTY_BOX_PRODUCT_NUMBERS = new Set(['55', '56', '57', '58', '59', '62'])

export const normalizeText = (v: unknown) =>
  String(v ?? '')
    .trim()
    .toLowerCase();

export const isBeautyBoxProduct = (product: DiscountCheckProduct): boolean => {
  const productNumber = normalizeText(product?.productNumber);
  const catRaw = normalizeText(product?.category);
  const name = normalizeText(product?.name);
  const catCompact = catRaw.replace(/[^a-z0-9]/g, '');

  if (BEAUTY_BOX_PRODUCT_NUMBERS.has(productNumber)) return true;
  if (catRaw === 'beauty boxes' || catRaw === 'beauty box') return true;
  if (catCompact.includes('beautybox')) return true;
  if (name.includes('beauty box') || name.includes('beautybox')) return true;
  return false;
};

export const isDeviceProduct = (product: DiscountCheckProduct): boolean => {
  const cat = normalizeText(product?.category);
  if (cat === 'device' || cat.includes('device')) return true;

  // Fallback by name (covers datasets where category is missing).
  // Compact to alphanumerics so hyphenated names match too:
  // "GENO-LED IR II" -> "genoledirii", "Hair-GENTRON" -> "hairgentron".
  const nameCompact = normalizeText(product?.name).replace(/[^a-z0-9]/g, '');
  // The Hair Stamp is a consumable cartridge for the HairGen Booster, not a
  // device - user discounts DO apply despite "hairgen" in its name.
  if (nameCompact.includes('hairstamp')) return false;
  return (
    nameCompact.includes('genoled') ||
    nameCompact.includes('gentron') ||
    nameCompact.includes('hairgen')
  );
};

export const isHydroCoolMask = (product: DiscountCheckProduct): boolean => {
  const name = normalizeText(product?.name);
  return name.includes('hydro') && name.includes('cool') && name.includes('mask');
};

export const isUserDiscountExcludedProduct = (product: DiscountCheckProduct): boolean => {
  if (!product) return false;
  if (product?.noDiscount === true) return true;
  return isBeautyBoxProduct(product) || isDeviceProduct(product) || isHydroCoolMask(product);
};




