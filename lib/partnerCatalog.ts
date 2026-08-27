/**
 * Partner-portal product classification: retail vs professional vs equipment.
 *
 * Business rules (Vadim, 2026-07-16):
 * - Consignment stock may contain RETAIL products only.
 * - PROFESSIONAL products (salon sizes, PRO Solution ampoules, salon masks,
 *   professional kits) are ordered on credit terms (30/45/60/90 days) or paid.
 * - EQUIPMENT (devices) is never given on consignment.
 *
 * One product card can carry both tiers: the small size is retail, the big
 * size is professional (e.g. Snow O₂ Cleanser 180ml retail / 500ml pro).
 *
 * TO ADJUST THE MAPPING simply edit the three constants below - they are the
 * single source of truth used by the portal UI and both partner order APIs.
 */

export type PartnerLineClass = 'retail' | 'professional' | 'equipment'

/** Products that are professional in every size. */
const PROFESSIONAL_PRODUCT_IDS = new Set<string>([
  '4', // POWER SOLUTION HES
  '5', // POWER SOLUTION CVS
  '6', // POWER SOLUTION CTS
  '7', // POWER SOLUTION PCS
  '8', // POWER SOLUTION SWS
  '9', // POWER SOLUTION AWS
  '13', // SKIN RENEWAL PEELING SYSTEM (SRS)
  '35', // HYDRO COOL MODELING MASK 1kg
  '47', // HR³ MATRIX MESOPECIA KIT
  '51', // BIO-FERMENT AGE DEFYING POWDER MASK 300g
  '52', // SKIN REBOOT PDRN MASK PACK 30 sheets
  'cmk449na90077e9k5anpfqz4o', // Bio Meso PDRN Ampoule 60000
  'cmqep332d00gef4ej9y2ajz41', // Hair Stamp for HAIRGEN BOOSTER (device accessory)
])

/** Dual-size products: the listed sizes are the professional (big) ones. */
const PROFESSIONAL_SIZES: Record<string, string[]> = {
  '10': ['500ml'], // SNOW O₂ CLEANSER
  '15': ['500ml'], // INTENSIVE PROBLEM CONTROL TONER
  '16': ['1000ml'], // SNOW BOOSTER
  '25': ['100g'], // SOOTHING REPAIR POSTCREAM
  '28': ['250g'], // INTENSIVE HYDRO SOOTHING CREAM
  '29': ['250g'], // MOISTURE REPLENISHING HYALURON CREAM
  '30': ['250g'], // INTENSIVE PROBLEM CONTROL CREAM
  '31': ['230g'], // MULTI VITA RADIANCE CREAM
  '32': ['250g'], // MULTI FUNCTIONAL ANTI-WRINKLE CREAM
  'cmr6dajor031ygfnm6rsjkicf': ['600ml'], // CERABARRIER BIOME GEL CLEANSER
}

/** Category fragments that mark a product as equipment/devices. */
const EQUIPMENT_CATEGORY_FRAGMENT = 'device'

export function isEquipmentCategory(category?: string | null): boolean {
  return String(category || '').toLowerCase().includes(EQUIPMENT_CATEGORY_FRAGMENT)
}

/**
 * Classify one order line (product + optional selected size).
 * Works with any object exposing id/category - server product or client type.
 */
export function classifyPartnerLine(
  product: { id: string; category?: string | null },
  size?: string | null
): PartnerLineClass {
  if (isEquipmentCategory(product.category)) return 'equipment'
  if (PROFESSIONAL_PRODUCT_IDS.has(product.id)) return 'professional'
  const proSizes = PROFESSIONAL_SIZES[product.id]
  if (proSizes && size && proSizes.includes(size)) return 'professional'
  return 'retail'
}

/** Null when the line may go to consignment stock, otherwise the reason. */
export function consignmentBlockReason(
  product: { id: string; name?: string; category?: string | null },
  size?: string | null
): string | null {
  const cls = classifyPartnerLine(product, size)
  if (cls === 'retail') return null
  const label = size ? `${product.name || product.id} (${size})` : product.name || product.id
  return cls === 'equipment'
    ? `${label} is equipment - not available for consignment stock.`
    : `${label} is a professional product - not available for consignment stock.`
}

/**
 * Category groups for the partner order screen (web + mirrored in the
 * mobile app's partner-portal screen - keep both in sync when editing).
 * Display order = array order. First matching keyword rule wins.
 */
export interface PartnerCategoryGroup {
  key: string
  en: string
  ru: string
  ar: string
}

export const PARTNER_CATEGORY_GROUPS: PartnerCategoryGroup[] = [
  { key: 'cleansers', en: 'Cleansers', ru: 'Очищение', ar: 'منظفات' },
  { key: 'toners', en: 'Toners & Mists', ru: 'Тонеры и мисты', ar: 'تونر وبخاخ' },
  { key: 'serums', en: 'Serums', ru: 'Сыворотки', ar: 'سيرومات' },
  { key: 'creams', en: 'Creams', ru: 'Кремы', ar: 'كريمات' },
  { key: 'eye_care', en: 'Eye Care', ru: 'Уход за глазами', ar: 'العناية بالعين' },
  { key: 'masks', en: 'Masks', ru: 'Маски', ar: 'أقنعة' },
  { key: 'sun_bb', en: 'Sun & BB', ru: 'Солнцезащита и BB', ar: 'واقي شمس و BB' },
  { key: 'peeling', en: 'Peeling', ru: 'Пилинги', ar: 'تقشير' },
  { key: 'microneedling', en: 'Microneedling', ru: 'Микронидлинг', ar: 'الإبر الدقيقة' },
  { key: 'bio_meso', en: 'Bio Meso', ru: 'Био-мезо', ar: 'بيو ميزو' },
  { key: 'pro_solutions', en: 'PRO Solutions', ru: 'PRO растворы', ar: 'محاليل PRO' },
  { key: 'scalp_hair', en: 'Scalp & Hair', ru: 'Кожа головы и волосы', ar: 'فروة الرأس والشعر' },
  { key: 'beauty_boxes', en: 'Beauty Boxes', ru: 'Бьюти-боксы', ar: 'صناديق الجمال' },
  { key: 'kits', en: 'Kits', ru: 'Наборы', ar: 'أطقم' },
  { key: 'devices', en: 'Devices & Equipment', ru: 'Оборудование', ar: 'أجهزة' },
  { key: 'other', en: 'Other', ru: 'Другое', ar: 'أخرى' },
]

/** Match priority (checked in this order - multi-category strings resolve here). */
const GROUP_MATCH_RULES: Array<[string, string[]]> = [
  ['devices', ['device']],
  ['pro_solutions', ['pro solution']],
  ['bio_meso', ['bio meso']],
  ['beauty_boxes', ['beauty box']],
  ['kits', ['kit']],
  ['scalp_hair', ['scalp', 'hair']],
  ['sun_bb', ['cushion', 'sun']],
  ['eye_care', ['eye']],
  ['masks', ['mask']],
  ['creams', ['cream']],
  ['serums', ['serum']],
  ['toners', ['toner', 'mist']],
  ['cleansers', ['cleanser']],
  ['peeling', ['peeling']],
  ['microneedling', ['microneedling']],
]

export function partnerGroupKey(category?: string | null): string {
  const cat = String(category || '').toLowerCase()
  for (const [key, words] of GROUP_MATCH_RULES) {
    if (words.some(w => cat.includes(w))) return key
  }
  return 'other'
}

export const CREDIT_DAY_OPTIONS = [30, 45, 60, 90] as const
export type CreditDays = (typeof CREDIT_DAY_OPTIONS)[number]

export function isValidCreditDays(days: unknown): days is CreditDays {
  return typeof days === 'number' && (CREDIT_DAY_OPTIONS as readonly number[]).includes(days)
}
