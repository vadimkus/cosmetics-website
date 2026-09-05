/**
 * MoySklad (МойСклад) Integration Module
 * 
 * Creates the retail document chain in MoySklad when orders are pushed from genosys.ae admin.
 * This is a one-way sync: genosys.ae → MoySklad (read-only for products).
 * 
 * MoySklad API docs: https://dev.moysklad.ru/doc/api/remap/1.2/
 * GitHub docs: https://github.com/moysklad/api-remap-1.2-doc
 * 
 * IMPORTANT: This module never modifies existing MoySklad products, counterparties,
 * or other entities. It only CREATES new documents and counterparties (if needed).
 */

import { debugLog, errorLog, warnLog } from '@/lib/logger'
import {
  explodeBeautyBoxItem,
  isBeautyBoxProductName,
} from '@/lib/moyskladBeautyBoxExplosion'
import {
  explodePowerSolutionBoxItem,
  isPowerSolutionBoxProductName,
  POWER_SOLUTION_VIALS_PER_BOX,
  resolvePowerSolutionBoxKey,
} from '@/lib/moyskladPowerSolutionExplosion'
import {
  explodePeptideGelMaskItem,
  isPeptideGelMaskPackProductName,
  PEPTIDE_GEL_MASK_SINGLE_PRODUCT_NAME,
} from '@/lib/moyskladPeptideGelMaskExplosion'
import { buildMoySkladAddressFull } from '@/lib/moyskladAddress'

// ============================================================================
// Configuration
// ============================================================================

const MOYSKLAD_API_BASE = 'https://api.moysklad.ru/api/remap/1.2'

// Entity references (from MoySklad account)
const MOYSKLAD_ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738' // Genosys Middle East FZ-LLC
const MOYSKLAD_STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a' // Genosys Warehouse
const MOYSKLAD_CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f' // AED (default)
const MOYSKLAD_DEFAULT_ACCOUNT_ID = 'e1852e1c-33c5-11ea-0a80-043f000b2739' // Default Genosys organization account for paymentin
const MOYSKLAD_STATE_NEW_ID = 'e1a0abf2-33c5-11ea-0a80-043f000b275a' // "Новый" (New)
const MOYSKLAD_STATE_PAID_AWAITING_DELIVERY_ID = '909556cd-8f70-11ea-0a80-016b00219616' // "Оплачен - Ждет доставки"
const MOYSKLAD_DEMAND_STATE_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2' // "Отгружен"
const MOYSKLAD_INVOICE_STATE_ISSUED_ID = 'a9609013-84d0-11ea-0a80-0453000aecd1' // "Выписан"
const MOYSKLAD_COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae' // "UAE" (account's custom country entry)

// ============================================================================
// Auth
// ============================================================================

function getAuthHeader(): string | null {
  const login = process.env.MOYSKLAD_LOGIN?.trim()
  const password = process.env.MOYSKLAD_PASSWORD?.trim()
  if (!login || !password) {
    errorLog('❌ MoySklad: MOYSKLAD_LOGIN or MOYSKLAD_PASSWORD not set. Login present:', !!process.env.MOYSKLAD_LOGIN, 'Password present:', !!process.env.MOYSKLAD_PASSWORD)
    return null
  }
  const encoded = Buffer.from(`${login}:${password}`).toString('base64')
  return `Basic ${encoded}`
}

// ============================================================================
// API helpers
// ============================================================================

interface MoySkladMeta {
  href: string
  type: string
  mediaType: string
}

function entityMeta(type: string, id: string): { meta: MoySkladMeta } {
  return {
    meta: {
      href: `${MOYSKLAD_API_BASE}/entity/${type}/${id}`,
      type,
      mediaType: 'application/json'
    }
  }
}

function stateMeta(entityType: string, id: string): { meta: MoySkladMeta } {
  return {
    meta: {
      href: `${MOYSKLAD_API_BASE}/entity/${entityType}/metadata/states/${id}`,
      type: 'state',
      mediaType: 'application/json'
    }
  }
}

function organizationAccountMeta(id: string): { meta: MoySkladMeta } {
  return {
    meta: {
      href: `${MOYSKLAD_API_BASE}/entity/organization/${MOYSKLAD_ORG_ID}/accounts/${id}`,
      type: 'account',
      mediaType: 'application/json'
    }
  }
}

async function moySkladFetch(
  path: string,
  options: { method?: string; body?: unknown } = {}
): Promise<{ ok: boolean; data?: unknown; error?: string }> {
  const auth = getAuthHeader()
  if (!auth) return { ok: false, error: 'MoySklad credentials not configured' }

  const url = path.startsWith('http') ? path : `${MOYSKLAD_API_BASE}${path}`

  try {
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json',
        'Accept': 'application/json;charset=utf-8',
        'Accept-Encoding': 'gzip',
      },
      ...(options.body ? { body: JSON.stringify(options.body) } : {}),
    })

    if (!response.ok) {
      const text = await response.text()
      errorLog(`❌ MoySklad API ${response.status}: ${text.substring(0, 500)}`)
      return { ok: false, error: `HTTP ${response.status}: ${text.substring(0, 200)}` }
    }

    const data = await response.json()
    return { ok: true, data }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    errorLog('❌ MoySklad API network error:', message)
    return { ok: false, error: message }
  }
}

// ============================================================================
// Shipping / Delivery Service Mapping
// ============================================================================

/**
 * Maps emirates to MoySklad delivery service UUIDs.
 * These are services (not products) in MoySklad - referenced as entity/service.
 */
const DELIVERY_SERVICE_MAP: Record<string, string> = {
  'dubai':    'a97cfeeb-814e-11ea-0a80-004a001516bd', // Excellent Delivery Dubai - 45 AED
  'sharjah':  '52864050-59a7-11eb-0a80-022e00579624', // Delivery Sharjah - 70 AED
  'abu dhabi':'212036af-814f-11ea-0a80-011700157c7d', // Delivery Abu Dhabi - 70 AED
  'al ain':   '41b80390-814f-11ea-0a80-03ae0014ec85', // Delivery Al Ain - 80 AED
  'fujairah': '557d2277-814f-11ea-0a80-03ae0014ed65', // Delivery Fujairah - 80 AED
  'rak':      'a9d199bf-b909-11ea-0a80-03ec0015b2d7', // Delivery RAK - 80 AED
  'ras al khaimah': 'a9d199bf-b909-11ea-0a80-03ec0015b2d7', // alias for RAK
  // Website ships Ajman / UAQ at 70 AED (same as Sharjah). MoySklad has no
  // dedicated Ajman/UAQ services - reuse Delivery Sharjah; line price still
  // comes from the website order.shipping amount.
  'ajman':    '52864050-59a7-11eb-0a80-022e00579624',
  'umm al quwain': '52864050-59a7-11eb-0a80-022e00579624',
  'uaq':      '52864050-59a7-11eb-0a80-022e00579624',
}

/**
 * Resolve MoySklad delivery service ID from emirate name.
 */
export function getMoySkladDeliveryServiceId(emirate: string): string | null {
  const lower = (emirate || '').trim().toLowerCase()
  if (DELIVERY_SERVICE_MAP[lower]) return DELIVERY_SERVICE_MAP[lower]!

  // Fuzzy match
  for (const [key, value] of Object.entries(DELIVERY_SERVICE_MAP)) {
    if (lower.includes(key) || key.includes(lower)) return value
  }
  return null
}

function isPaidOnlinePayment(paymentMethod: string): boolean {
  return ['stripe', 'apple_pay'].includes(paymentMethod.trim().toLowerCase())
}

// ============================================================================
// Product Mapping
// ============================================================================

/**
 * Maps webapp product names → MoySklad product UUIDs.
 * 
 * The webapp uses short names (e.g., "POWER SOLUTION CVS") while MoySklad
 * uses longer names with "Box" suffix for box products (e.g., "POWER SOLUTION CVS Box").
 * 
 * This mapping was built by querying both databases and matching products.
 * Products are matched by name similarity - MoySklad product data is NEVER modified.
 * 
 * Prices in MoySklad are in kopecks (value × 100), but since we use AED,
 * our prices need to be multiplied by 100 when sending to MoySklad.
 */
const PRODUCT_MAP: Record<string, string> = {
  // === Power Solutions - vials (used when box lines explode on push; codes 00018/00020/…) ===
  'POWER SOLUTION AWS 1 VIAL 2ML': '68872ebb-3447-11ea-0a80-03f90001c5cc', // 00018
  'POWER SOLUTION SWS 1 VIAL 2ML': 'e0ff2439-3448-11ea-0a80-044a00018f60', // 00020
  'POWER SOLUTION CVS 1 VIAL 2ML': 'febec033-45d4-11ea-0a80-00ab0015bfa1', // 00067
  'POWER SOLUTION HES 1 VIAL 2ML': '4ba9c825-45d6-11ea-0a80-067800168f95', // 00071
  'POWER SOLUTION PCS 1 VIAL 2ML': '8a43a8e9-45d4-11ea-0a80-048a00166b96', // 00065
  'POWER SOLUTION CTS 1 VIAL 2ML': 'c4784fc1-45d5-11ea-0a80-02fd001636a2', // 00069

  // === Power Solutions - boxes (legacy fallback only; push explodes to vials above) ===
  'POWER SOLUTION AWS': '05507ec8-3447-11ea-0a80-05dc00016a6b',       // 00017 Box
  'POWER SOLUTION SWS': '662f268a-3448-11ea-0a80-00e60001a228',       // 00019 Box
  'POWER SOLUTION CVS': 'cd352a84-45d4-11ea-0a80-01f800166866',       // 00066 Box
  'POWER SOLUTION HES': '22afc79d-45d6-11ea-0a80-01f80016717c',       // 00070 Box
  'POWER SOLUTION PCS': 'e5c696ee-45cb-11ea-0a80-01f80015e85a',       // 00064 Box
  'POWER SOLUTION CTS': '726570c8-45d5-11ea-0a80-01f800166ccf',       // 00068 Box

  // === Skincare Creams ===
  'INTENSIVE HYDRO SOOTHING CREAM': '1ebfde72-42b6-11ea-0a80-05c1000c3129',  // 50g
  'MULTI FUNCTIONAL ANTI-WRINKLE CREAM': '6b2a342c-bf06-11ed-0a80-02f30003ffc8', // 50g
  'MULTI VITA RADIANCE CREAM': 'd0fc1a8f-a96f-11ea-0a80-00d100134b49',       // 50g
  'INTENSIVE PROBLEM CONTROL CREAM': '456e3fbd-42b7-11ea-0a80-0095000be27d',  // 50g
  'SKIN BARRIER PROTECTING CREAM': '3805fbad-42b8-11ea-0a80-03cf000bfaef',    // 100g
  'MOISTURE REPLENISHING HYALURON CREAM': 'be705c7d-9808-11ee-0a80-02460037622e', // 50g
  'ND Cell ANTI-WRINKLE CREAM': '65bdc2ca-42ba-11ea-0a80-0096000bce23',       // 50ml
  'EyeCell EYE CONTOUR CREAM': '96d8a1a4-42bd-11ea-0a80-0693000bd7f8',        // 20ml
  // Discontinued Jul 2026, page retired Aug 2026. Kept deliberately: back-office
  // still needs it for historical demands, returns and consignment reports.
  'EGF REPAIR OXYMASK CREAM': 'e5c9eca4-42b9-11ea-0a80-0475000bb675',         // 50ml
  'INTENSIVE BLEMISH BALM CREAM [SPF 30 PA++]': '1e0d0700-42b9-11ea-0a80-0096000bc0d0', // 50g
  'SOOTHING REPAIR POSTCREAM': 'bc185527-42b8-11ea-0a80-0095000bf07a',         // 20g
  'SKIN RESCUE OVERNIGHT CREAM MASK': 'e24a7dad-bf05-11ed-0a80-00c300038093',  // 100g

  // === Serums ===
  'ALL FOR SENSITIVE SERUM': '54f31ab6-344b-11ea-0a80-00e60001cc8a',           // 30ml
  'MULTI FUNCTIONAL ANTI-WRINKLE SERUM': 'abddb813-bf06-11ed-0a80-02f300040558', // 30ml
  'MULTI VITA RADIANCE SERUM': '99d39c51-82f1-11ee-0a80-13cb0013bf3a',         // 30ml
  'PROBLEM CONTROL SERUM': '2f5d9cdb-344b-11ea-0a80-00e60001ca85',             // 30ml
  'MOISTURE REPLENISHING HYALURON SERUM': 'c8e39f4f-82f1-11ee-0a80-05410014a6ab', // 30ml
  'EyeCell EYE CONTOUR SERUM': '6cb1b241-42bd-11ea-0a80-0693000bd6ca',         // 10ml

  // === Cleansers & Toners ===
  'SNOW O₂ CLEANSER': '429cb35d-3449-11ea-0a80-00e60001afc8',                 // 180ml
  'CERABARRIER BIOME GEL CLEANSER': '4403ccba-6ed1-11f1-0a80-16ec00a25b21',   // 200ml default (54484)
  'SNOW BOOSTER': '70f536c1-3449-11ea-0a80-05dc0001878d',                     // Snow Booster Toner 200ml
  'INTENSIVE PROBLEM CONTROL TONER': '86d64dba-29c8-11ed-0a80-07740006f514',   // 200ml
  'SKIN DEFENDER LIP & EYE MAKEUP REMOVER': 'bcf432e7-ec44-11ee-0a80-077500174711', // 200ml

  // === Peeling & Masks ===
  'SKIN RENEWAL PEELING SYSTEM (SRS)': '62225706-3445-11ea-0a80-05dc000156b3', // Box
  'EPI TURNOVER BOOSTING PEELING GEL': 'cd901a4e-e88b-11ea-0a80-05ae00007806', // 100g
  // Pack on website (5 masks) - push explodes to singles below; keep pack key unused after explode
  'PEPTIDE GEL MASK': '3068531d-3444-11ea-0a80-06a300016deb',                 // 00012 single (legacy fallback)
  [PEPTIDE_GEL_MASK_SINGLE_PRODUCT_NAME]: '3068531d-3444-11ea-0a80-06a300016deb', // 00012 after pack explode
  'EZ CO₂ MASK KIT': 'f34ed25a-343f-11ea-0a80-05dc0001110e',                  // Box (5 treatments)
  'HYDRO COOL MODELING MASK': '806e9e52-3444-11ea-0a80-05dc00014e2d',          // 1kg
  'EyeCell EYE PEPTIDE GEL PATCH': '3e1bd611-42bd-11ea-0a80-01e3000bd9c2',     // Box
  'SOOTHING BOMB SEA ALGAE MASK': '9d634465-2690-11ec-0a80-0767000c229e',      // 25g
  'INTENSIVE REPAIR COLLAGEN MASK': '51e74608-45cb-11ea-0a80-01f80015bea2',     // 23g
  'BIO-FERMENT AGE DEFYING POWDER MASK': 'f03d23d3-3556-11f0-0a80-16530008ddf9', // 300g
  'SKIN REBOOT PDRN MASK PACK': 'b6766232-571e-11f0-0a80-04380007c924',        // 30 sheets

  // === Sun Protection ===
  'MULTI SUN CREAM [SPF 40 PA++]': '60c64e56-42b9-11ea-0a80-01e3000bb41e',     // 40g
  'ULTRA SHIELD SUN CREAM [SPF 50+ PA++++]': '8f9e1d0b-8d10-11ee-0a80-00e10079b204', // 50g

  // === BB/Cushion ===
  'SKIN CARING BLEMISH BALM CUSHION [SPF 50+ PA++++]': '8e55b3ff-d092-11ec-0a80-022900a6db36', // #1 Ivory (default, used when no color variant matches)
  'REVITA GLOW BLEMISH BALM CREAM [SPF 38 PA+++]': '1d0adef0-07c9-11f1-0a80-1981000318de',   // #02 Natural

  // === Hair Care ===
  'HR³ MATRIX HAIR TONIC α': 'b4763e83-42bc-11ea-0a80-01e3000bd569',           // 70ml
  'HR³ MATRIX HAIR SOLUTION α': '145d21d6-42bc-11ea-0a80-0096000bdfcf',        // Box (8pcs)
  'HR³ MATRIX MEDI SCALP SHAMPOO α': 'f4009e02-42bc-11ea-0a80-05c1000c82b5',   // 300ml
  'HR³ MATRIX SCALP PEELING α': '85e2c7e3-42bc-11ea-0a80-0095000c187a',        // 100ml
  'HR³ MATRIX MESOPECIA KIT': '8a3ebdac-42be-11ea-0a80-0693000bec13',          // Roller Box
  'HR³ MATRIX SCALP BRUSH': '75051581-da57-11f0-0a80-048b00080569',            // Scalp Brush

  // === Eye Care ===
  'EyeCell EYE ZONE CARE KIT': '1bc5e51a-42bf-11ea-0a80-05c0000c5af5',         // Box

  // === Devices ===
  'GENO-LED IR II': '6767b66e-62bd-11ea-0a80-02cd0024b8e2',                    // Led Lamp
  'Hair-GENTRON': 'ddfccf89-62bd-11ea-0a80-01a0000df3c7',                      // HAIR GENTRON DEVICE
  'HairGen BOOSTER': 'e83c5eb3-9eb7-11ec-0a80-0316003aaa94',                   // HAIRGEN BOOSTER DEVICE
  'Microneedle Roller': 'e6bfaf3b-33ce-11ea-0a80-020c000b009b',               // Standard Detachable 0.25mm (default)
  'Needle Pen-K': '67616f70-42bf-11ea-0a80-01e3000bf0f5',                      // Dermafix Premium

  // === Mist ===
  'MICROBIOME ENERGY INFUSING MIST': '8a087af0-8ab3-11ed-0a80-06c700c08673',   // 80ml

  // === Professional ===
  'Bio Meso PDRN Ampoule 60000': '89b90c39-da54-11f0-0a80-166700076a14',       // BIO-MESO PDRN Expert Ampoule
  'Bio-Meso PDRN Homecare Ampoule 5000': '3706b193-6ae8-11f1-0a80-16e5003a85d3', // 54475 clinic 150 / retail 300
  'Bio Meso PDRN Homecare Ampoule 5000': '3706b193-6ae8-11f1-0a80-16e5003a85d3', // alias (hyphen variant)
  '54475': '3706b193-6ae8-11f1-0a80-16e5003a85d3',                               // MoySklad code fallback

  // === Kits & Holiday ===
  'Holiday Kit': '2457826d-993a-11f0-0a80-1616000c9d82',                       // OXY VITA Holiday KIT
}

/**
 * Maps product name + color → MoySklad product UUID for products with color variants.
 * Key format: "PRODUCT NAME | color" (color is lowercased for matching).
 * When a color variant exists here, it takes priority over the default in PRODUCT_MAP.
 */
const COLOR_VARIANT_MAP: Record<string, string> = {
  'SKIN CARING BLEMISH BALM CUSHION [SPF 50+ PA++++] | ivory': '8e55b3ff-d092-11ec-0a80-022900a6db36',  // #1 Ivory
  'SKIN CARING BLEMISH BALM CUSHION [SPF 50+ PA++++] | beige': 'aca39b2a-d092-11ec-0a80-013600a5ed6d',  // #2 Beige
  'SKIN CARING BLEMISH BALM CUSHION [SPF 50+ PA++++] | camel': '374ebc0b-a7cd-11ef-0a80-07b3001b04d7',  // #3 Camel
}

/**
 * Maps product name + size → MoySklad product UUID for products with multiple sizes.
 * Key format: "PRODUCT NAME | size" (size is lowercased and whitespace-stripped for matching).
 *
 * CRITICAL: Products listed in PRODUCT_MAP above default to ONE specific size. If a customer
 * orders a different size and we don't map it here, MoySklad will receive the wrong variant.
 *
 * Always include BOTH sizes for multi-size products so the default doesn't silently win.
 *
 * Example of bug this fixes: ordering "Intensive Problem Control Cream 250g" on the site
 * would previously send the 50g MoySklad product (because PRODUCT_MAP only had 50g) -
 * mismatching price, stock, and fulfillment.
 */
const SIZE_VARIANT_MAP: Record<string, string> = {
  // === Snow O₂ Cleanser (product 10) ===
  'SNOW O₂ CLEANSER | 180ml': '429cb35d-3449-11ea-0a80-00e60001afc8',   // code 00021
  'SNOW O₂ CLEANSER | 500ml': '0a27b901-344a-11ea-0a80-021700017918',   // code 00024

  // === Intensive Problem Control Toner (product 15) ===
  'INTENSIVE PROBLEM CONTROL TONER | 200ml': '86d64dba-29c8-11ed-0a80-07740006f514', // code 00145
  'INTENSIVE PROBLEM CONTROL TONER | 500ml': '15867f00-43d2-11ed-0a80-0f42000e9bcc', // code 00183

  // === Snow Booster (product 16) ===
  'SNOW BOOSTER | 200ml':  '70f536c1-3449-11ea-0a80-05dc0001878d',      // code 00022
  'SNOW BOOSTER | 1000ml': '48952d7e-344a-11ea-0a80-00e50001bb46',      // code 00025

  // === Soothing Repair Postcream (product 25) ===
  'SOOTHING REPAIR POSTCREAM | 20g':  'bc185527-42b8-11ea-0a80-0095000bf07a', // code 00038
  'SOOTHING REPAIR POSTCREAM | 100g': 'c7a5e201-d28a-11ef-0a80-11b100116a32', // code 54465

  // === Intensive Hydro Soothing Cream (product 28) ===
  'INTENSIVE HYDRO SOOTHING CREAM | 50g':  '1ebfde72-42b6-11ea-0a80-05c1000c3129', // code 00031
  'INTENSIVE HYDRO SOOTHING CREAM | 250g': '9b6aadc6-42b6-11ea-0a80-01e3000b946c', // code 00032

  // === Moisture Replenishing Hyaluron Cream (product 29) ===
  'MOISTURE REPLENISHING HYALURON CREAM | 50g':  'be705c7d-9808-11ee-0a80-02460037622e', // code 54458
  'MOISTURE REPLENISHING HYALURON CREAM | 250g': '10963a8c-b541-11ee-0a80-15c60014ba73', // code 54460

  // === Intensive Problem Control Cream (product 30) ===
  'INTENSIVE PROBLEM CONTROL CREAM | 50g':  '456e3fbd-42b7-11ea-0a80-0095000be27d', // code 00035
  'INTENSIVE PROBLEM CONTROL CREAM | 250g': '7f4736b3-42b7-11ea-0a80-0693000b9cb9', // code 00036

  // === Multi Vita Radiance Cream (product 31) ===
  'MULTI VITA RADIANCE CREAM | 50g':  'd0fc1a8f-a96f-11ea-0a80-00d100134b49', // code 00122
  'MULTI VITA RADIANCE CREAM | 230g': '727d6fd4-b0be-11ea-0a80-06d7001d9fa0', // code 00123

  // === Multi Functional Anti-Wrinkle Cream (product 32) ===
  'MULTI FUNCTIONAL ANTI-WRINKLE CREAM | 50g':  '6b2a342c-bf06-11ed-0a80-02f30003ffc8', // code 00190
  'MULTI FUNCTIONAL ANTI-WRINKLE CREAM | 250g': '0cf0e298-42b7-11ea-0a80-0475000b95ca', // code 00034

  // === Microneedle Roller (product 1) - needle-length variants ===
  'MICRONEEDLE ROLLER | 0.25mm': 'e6bfaf3b-33ce-11ea-0a80-020c000b009b', // code 00001
  'MICRONEEDLE ROLLER | 0.5mm':  'b4acb301-343a-11ea-0a80-06a300010999', // code 00002
  'MICRONEEDLE ROLLER | 1.0mm':  'fca27ce5-343a-11ea-0a80-01b500011297', // code 00003
  'MICRONEEDLE ROLLER | 1.5mm':  'c83c9cf9-343b-11ea-0a80-05dc0000f00e', // code 00004
  'MICRONEEDLE ROLLER | 2.0mm':  'f4fb8b3a-343b-11ea-0a80-06a400010a65', // code 00005

  // === CERABARRIER Biome Gel Cleanser (product 66) ===
  'CERABARRIER BIOME GEL CLEANSER | 200ml': '4403ccba-6ed1-11f1-0a80-16ec00a25b21', // code 54484
  'CERABARRIER BIOME GEL CLEANSER | 600ml': '44439568-6ed1-11f1-0a80-112d00a360a0', // code 54485
}

/**
 * Normalize a size string for map lookup: strip whitespace, lowercase.
 * Handles variations like "250g " / "250G" / "250 g" → "250g".
 */
function normalizeSize(size: string): string {
  return size.replace(/\s+/g, '').toLowerCase()
}

/**
 * Resolve MoySklad product ID from webapp product name, optional color, and optional size.
 *
 * Lookup precedence:
 *   1. SIZE_VARIANT_MAP    (name + size)   - highest priority for multi-size products
 *   2. COLOR_VARIANT_MAP   (name + color)
 *   3. PRODUCT_MAP         (name only)     - fallback default
 *
 * Returns null if no mapping exists (beauty boxes, bundles, etc.)
 */
function getMoySkladProductId(productName: string, color?: string | null, size?: string | null): string | null {
  // Strip suffixes like "(FREE)", "(GIFT)", "(BONUS)" that the checkout may append
  const normalized = productName.trim().replace(/\s*\((?:FREE|GIFT|BONUS|SAMPLE)\)\s*$/i, '').trim()

  // 1) Size-specific match - highest priority for multi-size products.
  //    Ignore the special "__PROMO__" size sentinel used by promotional/free items.
  if (size && size !== '__PROMO__') {
    const normalizedSize = normalizeSize(size)
    const sizeKey = `${normalized} | ${normalizedSize}`
    if (SIZE_VARIANT_MAP[sizeKey]) {
      return SIZE_VARIANT_MAP[sizeKey]
    }
    // Case-insensitive fallback for size variant keys
    const sizeKeyLower = sizeKey.toLowerCase()
    for (const [key, value] of Object.entries(SIZE_VARIANT_MAP)) {
      if (key.toLowerCase() === sizeKeyLower) {
        return value
      }
    }
  }

  // 2) Color-specific match
  if (color) {
    const colorKey = `${normalized} | ${color.trim().toLowerCase()}`
    if (COLOR_VARIANT_MAP[colorKey]) {
      return COLOR_VARIANT_MAP[colorKey]
    }
    // Case-insensitive fallback for color variant keys
    const colorKeyLower = colorKey.toLowerCase()
    for (const [key, value] of Object.entries(COLOR_VARIANT_MAP)) {
      if (key.toLowerCase() === colorKeyLower) {
        return value
      }
    }
  }

  // 3) Direct match on base product name
  if (PRODUCT_MAP[normalized]) {
    return PRODUCT_MAP[normalized]
  }

  // Case-insensitive search on base product name
  const lower = normalized.toLowerCase()
  for (const [key, value] of Object.entries(PRODUCT_MAP)) {
    if (key.toLowerCase() === lower) {
      return value
    }
  }

  return null
}

// ============================================================================
// Counterparty (Customer) Management
// ============================================================================

interface CounterpartyResult {
  id: string
  meta: MoySkladMeta
}

/**
 * Build a structured actualAddressFull for a counterparty, matching the
 * order-level shipmentAddressFull shape. Emirate → city, free-form address
 * → street (street-only - website canonical "Street, City, UAE" is stripped
 * so MoySklad UI does not print Dubai/UAE twice), country → UAE reference.
 * Never set addInfo to the same text as street.
 */
function buildCounterpartyAddressFull(
  customerAddress: string | undefined,
  customerEmirate: string | undefined
): { actualAddressFull: Record<string, unknown> } | Record<string, never> {
  const city = (customerEmirate || '').trim()
  const full = buildMoySkladAddressFull(
    customerAddress,
    customerEmirate,
    entityMeta('country', MOYSKLAD_COUNTRY_UAE_ID),
  )
  if (!full.street && !city) return {}
  return { actualAddressFull: full }
}

/**
 * Find or create a counterparty (customer) in MoySklad.
 * Searches by normalized phone, then email. Creates if not found.
 * Does not match on name alone.
 *
 * The latest non-empty website checkout address is authoritative for the
 * counterparty's actual address. Returning customers can move or select a new
 * delivery address, so update the MoySklad card whenever an existing customer
 * is matched. Historical orders keep their own shipmentAddressFull snapshots.
 */
function phoneDigits(value: string | undefined): string {
  return String(value || '').replace(/\D/g, '')
}

function uaePhoneTail(value: string | undefined): string {
  const digits = phoneDigits(value)
  if (digits.length < 9) return ''
  return digits.slice(-9)
}

async function updateCounterpartyAddress(
  counterparty: CounterpartyResult,
  customerAddress?: string,
  customerEmirate?: string
): Promise<CounterpartyResult | null> {
  const address = buildCounterpartyAddressFull(customerAddress, customerEmirate)
  if (!('actualAddressFull' in address)) return counterparty

  const result = await moySkladFetch(`/entity/counterparty/${counterparty.id}`, {
    method: 'PUT',
    body: address,
  })
  if (!result.ok || !result.data) {
    errorLog('❌ MoySklad: Failed to update counterparty address:', result.error)
    return null
  }

  const updated = result.data as { id: string; meta: MoySkladMeta }
  debugLog('✅ MoySklad: Updated counterparty address from website order:', updated.id)
  return { id: updated.id, meta: updated.meta }
}

async function findOrCreateCounterparty(
  name: string,
  email: string,
  phone: string,
  customerAddress?: string,
  customerEmirate?: string
): Promise<CounterpartyResult | null> {
  // Phone first. MoySklad stores "+971 58 560 2388" while the website
  // sends "+971585602388" — exact filter misses. Search the last 9 digits
  // and compare normalized tails. Never fall back to name-only: that attached
  // Olga Lysenko (Studio City, 058 560 2388) to a 2020 card in Arjan.
  const tail = uaePhoneTail(phone)
  if (tail) {
    const exact = phone.replace(/\s/g, '')
    const exactHit = await moySkladFetch(
      `/entity/counterparty?filter=phone=${encodeURIComponent(exact)}&limit=5`
    )
    if (exactHit.ok && exactHit.data) {
      const rows = (exactHit.data as { rows: Array<{ id: string; meta: MoySkladMeta; phone?: string }> }).rows || []
      const first = rows[0]
      if (first) {
        debugLog('✅ MoySklad: Found counterparty by exact phone:', first.id)
        return updateCounterpartyAddress(
          { id: first.id, meta: first.meta },
          customerAddress,
          customerEmirate
        )
      }
    }

    const searchHit = await moySkladFetch(
      `/entity/counterparty?search=${encodeURIComponent(tail)}&limit=25`
    )
    if (searchHit.ok && searchHit.data) {
      const rows = (searchHit.data as { rows: Array<{ id: string; meta: MoySkladMeta; phone?: string }> }).rows || []
      const match = rows.find((row) => uaePhoneTail(row.phone) === tail)
      if (match) {
        debugLog('✅ MoySklad: Found counterparty by normalized phone:', match.id)
        return updateCounterpartyAddress(
          { id: match.id, meta: match.meta },
          customerAddress,
          customerEmirate
        )
      }
    }
  }

  if (email) {
    const result = await moySkladFetch(
      `/entity/counterparty?filter=email=${encodeURIComponent(email)}&limit=1`
    )
    if (result.ok && result.data) {
      const rows = (result.data as { rows: Array<{ id: string; meta: MoySkladMeta }> }).rows
      const first = rows?.[0]
      if (first) {
        debugLog('✅ MoySklad: Found counterparty by email:', first.id)
        return updateCounterpartyAddress(
          { id: first.id, meta: first.meta },
          customerAddress,
          customerEmirate
        )
      }
    }
  }

  // Create new counterparty - include structured address so MoySklad UI,
  // delivery slips and invoices don't have a blank address field.
  debugLog('🆕 MoySklad: Creating new counterparty:', name)
  const createResult = await moySkladFetch('/entity/counterparty', {
    method: 'POST',
    body: {
      name,
      ...(email ? { email } : {}),
      ...(phone ? { phone: phone.replace(/\s/g, '') } : {}),
      companyType: 'individual',
      description: `Created from genosys.ae order`,
      ...buildCounterpartyAddressFull(customerAddress, customerEmirate),
    }
  })

  if (createResult.ok && createResult.data) {
    const created = createResult.data as { id: string; meta: MoySkladMeta }
    debugLog('✅ MoySklad: Created counterparty:', created.id)
    return { id: created.id, meta: created.meta }
  }

  errorLog('❌ MoySklad: Failed to create counterparty:', createResult.error)
  return null
}

// ============================================================================
// Customer Order Creation
// ============================================================================

export interface MoySkladOrderItem {
  productName: string
  quantity: number
  price: number // Final charged unit price in AED (e.g., 200 after discount)
  retailPrice?: number // Optional pre-discount unit price for MoySklad printable discount display
  discountPercent?: number // MoySklad line discount percent, e.g. bundle 20 or promo 100
  color?: string | null
  size?: string | null // e.g., "50g", "250g", "180ml", "500ml"
}

export interface MoySkladOrderData {
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  customerEmirate: string
  items: MoySkladOrderItem[]
  total: number
  shipping: number
  /** GENOSYS Rewards redeemed - AED off merchandise (not shipping). */
  loyaltyDiscountAmount?: number
  loyaltyPointsRedeemed?: number
  paymentMethod: string // 'cod', 'stripe', 'apple_pay'
  paymentStatus?: string // 'pending', 'paid', etc.
  description?: string
}

/**
 * Apply loyalty AED as an extra MoySklad line discount on paid product rows
 * (skips 100% promo lines). Shipping is added separately after this.
 */
export function applyLoyaltyDiscountToPositions(
  positions: Array<{ quantity: number; price: number; discount?: number }>,
  loyaltyDiscountAed: number
): void {
  if (!(loyaltyDiscountAed > 0) || positions.length === 0) return

  const lineNets = positions.map((p) => {
    const discount = p.discount ?? 0
    if (discount >= 100 || p.price <= 0) return 0
    return (p.quantity * p.price * (100 - discount)) / 10000
  })
  const merchandiseNet = lineNets.reduce((s, n) => s + n, 0)
  if (merchandiseNet <= 0) return

  const cappedLoyalty = Math.min(loyaltyDiscountAed, merchandiseNet)
  const keepFactor = (merchandiseNet - cappedLoyalty) / merchandiseNet

  for (const [i, p] of positions.entries()) {
    if (!p) continue
    const discount = p.discount ?? 0
    const lineNet = lineNets[i] ?? 0
    if (discount >= 100 || p.price <= 0 || lineNet <= 0) continue
    // Combine existing % discount with loyalty keep-factor
    const newDiscount = 100 - (100 - discount) * keepFactor
    p.discount = Math.round(newDiscount * 10000) / 10000
  }
}

export interface MoySkladPushResult {
  success: boolean
  moySkladOrderId?: string
  moySkladInvoiceId?: string
  moySkladDemandId?: string
  moySkladPaymentInId?: string
  error?: string
}

interface CreatedMoySkladEntity {
  id: string
  name: string
  sum?: number
}

/**
 * Create the retail chain in MoySklad.
 * 
 * This is the main integration function. It:
 * 1. Finds or creates the customer as a counterparty
 * 2. Maps webapp products to MoySklad product IDs
 * 3. Creates the customer order with positions
 * 4. Creates invoice → отгрузка
 * 5. Creates incoming payment (paymentin) for paid online orders
 * 
 * Returns { success, moySkladOrderId?, moySkladInvoiceId?, moySkladDemandId?, moySkladPaymentInId?, error? }
 * 
 * SAFETY: This function is designed to be called fire-and-forget.
 * It never throws - all errors are caught and logged.
 * It never blocks the main checkout flow.
 */
export async function createMoySkladOrder(
  orderData: MoySkladOrderData
): Promise<MoySkladPushResult> {
  try {
    // Check if MoySklad integration is enabled
    const auth = getAuthHeader()
    if (!auth) {
      debugLog('⏭️ MoySklad: Integration disabled (no credentials)')
      return { success: false, error: 'MoySklad credentials not configured' }
    }

    debugLog('🔄 MoySklad: Creating order', orderData.orderNumber)

    // Step 1: Find or create counterparty. A non-empty checkout address updates
    // the matched customer card; historical documents retain their own address.
    const counterparty = await findOrCreateCounterparty(
      orderData.customerName,
      orderData.customerEmail,
      orderData.customerPhone,
      orderData.customerAddress,
      orderData.customerEmirate
    )

    if (!counterparty) {
      return { success: false, error: 'Failed to find/create counterparty' }
    }

    // Step 2: Build positions (order line items)
    const positions: Array<{
      quantity: number
      price: number
      discount?: number
      assortment: { meta: MoySkladMeta }
      vat: number
      vatEnabled: boolean
    }> = []

    const unmappedItems: string[] = []
    const explodedBeautyBoxes: string[] = []
    const explodedPowerSolutionBoxes: string[] = []

    type LineToMap = {
      productName: string
      quantity: number
      price: number
      retailPrice?: number
      discountPercent?: number
      color?: string | null
      size?: string | null
    }

    const linesToMap: LineToMap[] = []

    for (const item of orderData.items) {
      if (isBeautyBoxProductName(item.productName)) {
        const boxKey = item.productName.trim().toUpperCase()
        explodedBeautyBoxes.push(boxKey)
        const discountPercent = item.discountPercent && item.discountPercent > 0
          ? item.discountPercent
          : undefined
        for (const exploded of explodeBeautyBoxItem({
          productName: item.productName,
          quantity: item.quantity,
          ...(item.color != null ? { color: item.color } : {}),
          ...(discountPercent != null ? { discountPercent } : {}),
        })) {
          const mapped: LineToMap = {
            productName: exploded.productName,
            quantity: exploded.quantity,
            price: exploded.retailPrice * (100 - exploded.discountPercent) / 100,
            retailPrice: exploded.retailPrice,
            discountPercent: exploded.discountPercent,
          }
          if (exploded.color != null) mapped.color = exploded.color
          if (exploded.size != null) mapped.size = exploded.size
          linesToMap.push(mapped)
        }
        continue
      }

      if (isPowerSolutionBoxProductName(item.productName)) {
        const boxKey = resolvePowerSolutionBoxKey(item.productName) ?? item.productName.trim().toUpperCase()
        explodedPowerSolutionBoxes.push(boxKey)
        for (const exploded of explodePowerSolutionBoxItem({
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
          ...(item.retailPrice != null ? { retailPrice: item.retailPrice } : {}),
          ...(item.discountPercent != null ? { discountPercent: item.discountPercent } : {}),
        })) {
          linesToMap.push({
            productName: exploded.productName,
            quantity: exploded.quantity,
            price: exploded.retailPrice * (100 - exploded.discountPercent) / 100,
            retailPrice: exploded.retailPrice,
            discountPercent: exploded.discountPercent,
          })
        }
        continue
      }

      if (isPeptideGelMaskPackProductName(item.productName)) {
        for (const exploded of explodePeptideGelMaskItem({
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
          ...(item.retailPrice != null ? { retailPrice: item.retailPrice } : {}),
          ...(item.discountPercent != null ? { discountPercent: item.discountPercent } : {}),
        })) {
          linesToMap.push({
            productName: exploded.productName,
            quantity: exploded.quantity,
            price: exploded.retailPrice * (100 - exploded.discountPercent) / 100,
            retailPrice: exploded.retailPrice,
            discountPercent: exploded.discountPercent,
          })
        }
        continue
      }

      linesToMap.push({
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        ...(item.retailPrice != null ? { retailPrice: item.retailPrice } : {}),
        ...(item.discountPercent != null ? { discountPercent: item.discountPercent } : {}),
        ...(item.color != null ? { color: item.color } : {}),
        ...(item.size != null ? { size: item.size } : {}),
      })
    }

    for (const item of linesToMap) {
      const moySkladProductId = getMoySkladProductId(item.productName, item.color, item.size)

      if (!moySkladProductId) {
        const extras: string[] = []
        if (item.size && item.size !== '__PROMO__') extras.push(item.size)
        if (item.color) extras.push(item.color)
        const label = extras.length > 0
          ? `${item.productName} (${extras.join(', ')})`
          : item.productName
        warnLog(`⚠️ MoySklad: No product mapping for "${label}"`)
        unmappedItems.push(label)
        continue
      }

      positions.push({
        quantity: item.quantity,
        price: Math.round((item.retailPrice ?? item.price) * 100), // Convert AED to kopecks (x100)
        ...(item.discountPercent && item.discountPercent > 0 ? { discount: item.discountPercent } : {}),
        assortment: entityMeta('product', moySkladProductId),
        vat: 5, // UAE 5% VAT
        vatEnabled: true,
      })
    }

    if (unmappedItems.length > 0) {
      return {
        success: false,
        error: `Cannot sync to MoySklad - unmapped line items: ${unmappedItems.join('; ')}`,
      }
    }

    // Step 2b: GENOSYS Rewards - fold loyalty AED into product line discounts
    // before shipping, so mapped total matches website (merchandise − loyalty + shipping).
    const loyaltyDiscountAed = Number(orderData.loyaltyDiscountAmount || 0)
    if (loyaltyDiscountAed > 0) {
      applyLoyaltyDiscountToPositions(positions, loyaltyDiscountAed)
      debugLog(
        `★ MoySklad: Applied GENOSYS Rewards −${loyaltyDiscountAed.toFixed(2)} AED` +
          (orderData.loyaltyPointsRedeemed
            ? ` (${orderData.loyaltyPointsRedeemed} pts)`
            : '')
      )
    }

    // Step 2c: Add shipping as a service line item (if applicable)
    // UAE delivery is taxable at 5% VAT (inclusive in the charge) - matches the
    // website's checkout VAT calc which treats shipping as VAT-inclusive.
    if (orderData.shipping > 0) {
      const deliveryServiceId = getMoySkladDeliveryServiceId(orderData.customerEmirate)
      if (!deliveryServiceId) {
        return {
          success: false,
          error:
            `Cannot sync to MoySklad - no delivery service mapping for emirate ` +
            `"${orderData.customerEmirate}" (shipping AED ${orderData.shipping.toFixed(2)})`,
        }
      }
      positions.push({
        quantity: 1,
        price: Math.round(orderData.shipping * 100),
        assortment: entityMeta('service', deliveryServiceId),
        vat: 5,
        vatEnabled: true,
      })
      debugLog(`📦 MoySklad: Added delivery service for ${orderData.customerEmirate} (${orderData.shipping} AED, 5% VAT)`)
    }

    const mappedTotalAed = positions.reduce((sum, p) => {
      const discount = p.discount ?? 0
      return sum + (p.quantity * p.price * (100 - discount)) / 10000
    }, 0)

    if (Math.abs(mappedTotalAed - orderData.total) > 0.05) {
      return {
        success: false,
        error:
          `Cannot sync to MoySklad - mapped total AED ${mappedTotalAed.toFixed(2)} ` +
          `does not match order total AED ${orderData.total.toFixed(2)}`,
      }
    }

    // Step 3: Build order description
    const paymentLabel = orderData.paymentMethod === 'cod' ? 'Cash on Delivery' 
      : orderData.paymentMethod === 'stripe' ? 'Stripe (Card)'
      : orderData.paymentMethod === 'apple_pay' ? 'Apple Pay'
      : orderData.paymentMethod
    
    const descParts = [
      `genosys.ae order #${orderData.orderNumber}`,
      `Payment: ${paymentLabel}`,
    ]
    if (orderData.shipping > 0) {
      descParts.push(`Shipping: ${orderData.shipping} AED (${orderData.customerEmirate})`)
    }
    if (loyaltyDiscountAed > 0) {
      descParts.push(
        `GENOSYS Rewards: −${loyaltyDiscountAed.toFixed(2)} AED` +
          (orderData.loyaltyPointsRedeemed
            ? ` (${orderData.loyaltyPointsRedeemed} pts)`
            : '')
      )
    }
    if (explodedBeautyBoxes.length > 0) {
      descParts.push(`Beauty boxes exploded: ${[...new Set(explodedBeautyBoxes)].join(', ')}`)
    }
    if (explodedPowerSolutionBoxes.length > 0) {
      descParts.push(
        `Power Solution boxes → vials (×${POWER_SOLUTION_VIALS_PER_BOX}): ${[...new Set(explodedPowerSolutionBoxes)].join(', ')}`
      )
    }
    if (unmappedItems.length > 0) {
      descParts.push(`Unmapped items: ${unmappedItems.join(', ')}`)
    }
    if (orderData.description) {
      descParts.push(orderData.description)
    }

    // Step 4: Create the customer order
    const isPaidOnlineOrder = isPaidOnlinePayment(orderData.paymentMethod)
      && orderData.paymentStatus?.trim().toLowerCase() === 'paid'

    const initialStateId = isPaidOnlineOrder
      ? MOYSKLAD_STATE_PAID_AWAITING_DELIVERY_ID
      : MOYSKLAD_STATE_NEW_ID

    const orderBody = {
      name: orderData.orderNumber,
      description: descParts.join(' | '),
      organization: entityMeta('organization', MOYSKLAD_ORG_ID),
      agent: { meta: counterparty.meta },
      store: entityMeta('store', MOYSKLAD_STORE_ID),
      state: stateMeta('customerorder', initialStateId),
      vatEnabled: true,
      vatIncluded: true,
      rate: {
        currency: entityMeta('currency', MOYSKLAD_CURRENCY_ID)
      },
      // Use shipmentAddressFull (structured) instead of shipmentAddress (plain
      // string). MoySklad's UI reads the delivery-address fields from the
      // structured object; a plain-string shipmentAddress gets silently dumped
      // into addInfo only, which is why the main address was showing blank.
      // The two fields are mutually exclusive - MoySklad rejects both at once.
      // Street must be street-only: website stores "Street, City, UAE" but
      // city/country already live in structured fields - otherwise UI shows
      // "UAE, Dubai, Street, Dubai, UAE".
      shipmentAddressFull: buildMoySkladAddressFull(
        orderData.customerAddress,
        orderData.customerEmirate,
        entityMeta('country', MOYSKLAD_COUNTRY_UAE_ID),
      ),
      ...(positions.length > 0 ? { positions } : {}),
    }

    const result = await moySkladFetch('/entity/customerorder', {
      method: 'POST',
      body: orderBody
    })

    if (!result.ok || !result.data) {
      errorLog('❌ MoySklad: Failed to create order:', result.error)
      return { success: false, error: result.error || 'Unknown error' }
    }

    const createdOrder = result.data as CreatedMoySkladEntity
    debugLog(`✅ MoySklad: Order created! ID: ${createdOrder.id}, Name: ${createdOrder.name}`)

    // Step 5: Create customer invoice linked to customer order.
    // Positions are sent explicitly so the invoice is printable even if
    // MoySklad does not auto-copy order lines for an edge case.
    const invoiceBody = {
      description: `Invoice for ${orderData.orderNumber} | ${descParts.join(' | ')}`,
      organization: entityMeta('organization', MOYSKLAD_ORG_ID),
      agent: { meta: counterparty.meta },
      customerOrder: entityMeta('customerorder', createdOrder.id),
      vatEnabled: true,
      vatIncluded: true,
      rate: {
        currency: entityMeta('currency', MOYSKLAD_CURRENCY_ID)
      },
      shipmentAddressFull: orderBody.shipmentAddressFull,
      ...(positions.length > 0 ? { positions } : {}),
    }

    let invoiceResult = await moySkladFetch('/entity/invoiceout', {
      method: 'POST',
      body: invoiceBody
    })

    if (!invoiceResult.ok && positions.length > 0) {
      // Some MoySklad accounts reject explicit invoice positions when linked to
      // a customer order. Fallback to customerOrder-only; MoySklad normally
      // copies positions from the order.
      invoiceResult = await moySkladFetch('/entity/invoiceout', {
        method: 'POST',
        body: {
          description: invoiceBody.description,
          organization: invoiceBody.organization,
          agent: invoiceBody.agent,
          customerOrder: invoiceBody.customerOrder,
          vatEnabled: invoiceBody.vatEnabled,
          vatIncluded: invoiceBody.vatIncluded,
          rate: invoiceBody.rate,
          shipmentAddressFull: invoiceBody.shipmentAddressFull,
        }
      })
    }

    if (!invoiceResult.ok || !invoiceResult.data) {
      errorLog('❌ MoySklad: Failed to create invoice:', invoiceResult.error)
      return {
        success: false,
        moySkladOrderId: createdOrder.id,
        error: invoiceResult.error || 'Failed to create MoySklad invoice'
      }
    }

    const createdInvoice = invoiceResult.data as CreatedMoySkladEntity
    debugLog(`✅ MoySklad: Invoice created! ID: ${createdInvoice.id}, Name: ${createdInvoice.name}`)

    const invoiceStateResult = await moySkladFetch(`/entity/invoiceout/${createdInvoice.id}`, {
      method: 'PUT',
      body: {
        state: stateMeta('invoiceout', MOYSKLAD_INVOICE_STATE_ISSUED_ID)
      }
    })
    if (!invoiceStateResult.ok) {
      warnLog(`⚠️ MoySklad: Invoice state update failed for ${createdInvoice.name}: ${invoiceStateResult.error}`)
    }

    // Step 6: Create отгрузка from invoice.
    const demandResult = await moySkladFetch('/entity/demand', {
      method: 'POST',
      body: {
        description: `Shipment for ${createdInvoice.name} / ${orderData.orderNumber} | ${descParts.join(' | ')}`,
        organization: entityMeta('organization', MOYSKLAD_ORG_ID),
        agent: { meta: counterparty.meta },
        store: entityMeta('store', MOYSKLAD_STORE_ID),
        invoicesOut: [entityMeta('invoiceout', createdInvoice.id)],
        state: stateMeta('demand', MOYSKLAD_DEMAND_STATE_SHIPPED_ID),
        vatEnabled: true,
        vatIncluded: true,
        shipmentAddressFull: orderBody.shipmentAddressFull,
        ...(positions.length > 0 ? { positions } : {}),
      }
    })

    if (!demandResult.ok || !demandResult.data) {
      errorLog('❌ MoySklad: Failed to create shipment:', demandResult.error)
      return {
        success: false,
        moySkladOrderId: createdOrder.id,
        moySkladInvoiceId: createdInvoice.id,
        error: demandResult.error || 'Failed to create MoySklad shipment'
      }
    }

    const createdDemand = demandResult.data as CreatedMoySkladEntity
    debugLog(`✅ MoySklad: Shipment created! ID: ${createdDemand.id}, Name: ${createdDemand.name}`)

    let paymentInId: string | undefined
    if (isPaidOnlineOrder) {
      const paymentSum = createdDemand.sum || createdInvoice.sum || createdOrder.sum || Math.round(orderData.total * 100)
      const paymentResult = await moySkladFetch('/entity/paymentin', {
        method: 'POST',
        body: {
          description: `Incoming payment for shipment ${createdDemand.name} / ${orderData.orderNumber} | ${descParts.join(' | ')}`,
          organization: entityMeta('organization', MOYSKLAD_ORG_ID),
          agent: { meta: counterparty.meta },
          organizationAccount: organizationAccountMeta(MOYSKLAD_DEFAULT_ACCOUNT_ID),
          sum: paymentSum,
          operations: [
            {
              meta: {
                href: `${MOYSKLAD_API_BASE}/entity/demand/${createdDemand.id}`,
                type: 'demand',
                mediaType: 'application/json'
              },
              linkedSum: paymentSum
            }
          ]
        }
      })

      if (!paymentResult.ok || !paymentResult.data) {
        errorLog('❌ MoySklad: Failed to create incoming payment:', paymentResult.error)
        return {
          success: false,
          moySkladOrderId: createdOrder.id,
          moySkladInvoiceId: createdInvoice.id,
          moySkladDemandId: createdDemand.id,
          error: paymentResult.error || 'Failed to create MoySklad incoming payment'
        }
      }

      const createdPayment = paymentResult.data as CreatedMoySkladEntity
      paymentInId = createdPayment.id
      debugLog(`✅ MoySklad: Incoming payment created! ID: ${createdPayment.id}, Name: ${createdPayment.name}`)
    } else {
      debugLog(`⏭️ MoySklad: Skipping paymentin for unpaid/COD order ${orderData.orderNumber}`)
    }

    return {
      success: true,
      moySkladOrderId: createdOrder.id,
      moySkladInvoiceId: createdInvoice.id,
      moySkladDemandId: createdDemand.id,
      ...(paymentInId ? { moySkladPaymentInId: paymentInId } : {}),
    }

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    errorLog('❌ MoySklad: Unexpected error:', message)
    return { success: false, error: message }
  }
}

export type MoySkladSyncStatus = 'missing' | 'partial' | 'complete'

/** Find an active MoySklad customer order by exact document name (web orderNumber). */
export async function findMoySkladCustomerOrderByName(
  orderNumber: string
): Promise<{ id: string; name: string } | null> {
  const auth = getAuthHeader()
  if (!auth || !orderNumber.trim()) return null

  const result = await moySkladFetch(
    `/entity/customerorder?filter=name=${encodeURIComponent(orderNumber.trim())}&limit=1`
  )
  if (!result.ok || !result.data) return null

  const rows = (result.data as { rows: Array<{ id: string; name: string; deleted?: boolean }> }).rows
  const row = rows?.find(r => !r.deleted)
  return row ? { id: row.id, name: row.name } : null
}

/**
 * Before (re)pushing, remove incomplete MoySklad docs so name uniqueness (HTTP 412) does not block retry.
 * Handles orphans when a prior push created the customer order but failed before invoice/shipment.
 */
export async function prepareMoySkladOrderForPush(
  orderNumber: string,
  existingMoySkladOrderId: string | null | undefined,
  expectedTotalAed: number
): Promise<{ ok: true } | { ok: false; error: string }> {
  const idsToCheck = new Set<string>()

  if (existingMoySkladOrderId) {
    idsToCheck.add(existingMoySkladOrderId)
  }

  const orphan = await findMoySkladCustomerOrderByName(orderNumber)
  if (orphan) {
    idsToCheck.add(orphan.id)
  }

  for (const moySkladOrderId of idsToCheck) {
    const syncStatus = await getMoySkladOrderSyncStatus(moySkladOrderId, expectedTotalAed)
    if (syncStatus === 'complete') {
      return {
        ok: false,
        error: `Order already pushed to MoySklad (ID: ${moySkladOrderId})`,
      }
    }
    if (syncStatus === 'partial' || syncStatus === 'missing') {
      debugLog(`♻️ MoySklad: Trashing incomplete sync ${moySkladOrderId} for ${orderNumber}`)
      const trashed = await trashMoySkladOrderChain(moySkladOrderId)
      if (!trashed) {
        return {
          ok: false,
          error: `Could not remove incomplete MoySklad documents for ${orderNumber}. Delete invoice/shipment manually in MoySklad, then retry.`,
        }
      }
    }
  }

  return { ok: true }
}

/** Check whether an existing MoySklad customer order matches a fully synced paid web order. */
export async function getMoySkladOrderSyncStatus(
  moySkladOrderId: string,
  expectedTotalAed: number
): Promise<MoySkladSyncStatus> {
  const auth = getAuthHeader()
  if (!auth) return 'missing'

  const orderResult = await moySkladFetch(`/entity/customerorder/${moySkladOrderId}`)
  if (!orderResult.ok || !orderResult.data) return 'missing'

  const order = orderResult.data as CreatedMoySkladEntity & { deleted?: boolean; sum?: number }
  if (order.deleted) return 'missing'

  const orderTotalAed = (order.sum || 0) / 100
  if (Math.abs(orderTotalAed - expectedTotalAed) > 0.05) return 'partial'

  const invoiceResult = await moySkladFetch(
    `/entity/invoiceout?filter=customerOrder=${encodeURIComponent(`${MOYSKLAD_API_BASE}/entity/customerorder/${moySkladOrderId}`)}&limit=1`
  )
  const invoiceRows = invoiceResult.ok && invoiceResult.data
    ? (invoiceResult.data as { rows: Array<{ id: string; deleted?: boolean }> }).rows?.filter(r => !r.deleted) ?? []
    : []
  if (invoiceRows.length === 0) return 'partial'

  for (const invoice of invoiceRows) {
    const demands = await listMoySkladDemandsForInvoice(invoice.id)
    if (demands.length > 0) return 'complete'
  }

  return 'partial'
}

async function listMoySkladInvoicesForOrder(moySkladOrderId: string): Promise<Array<{ id: string; name: string }>> {
  const invoiceResult = await moySkladFetch(
    `/entity/invoiceout?filter=customerOrder=${encodeURIComponent(`${MOYSKLAD_API_BASE}/entity/customerorder/${moySkladOrderId}`)}&limit=100`
  )
  if (!invoiceResult.ok || !invoiceResult.data) return []
  return (invoiceResult.data as { rows: Array<{ id: string; name: string; deleted?: boolean }> }).rows
    ?.filter(r => !r.deleted)
    .map(r => ({ id: r.id, name: r.name })) ?? []
}

async function listMoySkladDemandsForInvoice(invoiceId: string): Promise<Array<{ id: string; name: string }>> {
  const demandResult = await moySkladFetch(
    `/entity/demand?filter=invoiceOut=${encodeURIComponent(`${MOYSKLAD_API_BASE}/entity/invoiceout/${invoiceId}`)}&limit=100`
  )
  if (!demandResult.ok || !demandResult.data) return []
  return (demandResult.data as { rows: Array<{ id: string; name: string; deleted?: boolean }> }).rows
    ?.filter(r => !r.deleted)
    .map(r => ({ id: r.id, name: r.name })) ?? []
}

async function listMoySkladPaymentInsForDemand(demandId: string): Promise<Array<{ id: string; name: string }>> {
  const paymentResult = await moySkladFetch(
    `/entity/paymentin?filter=operations=${encodeURIComponent(`${MOYSKLAD_API_BASE}/entity/demand/${demandId}`)}&limit=100`
  )
  if (!paymentResult.ok || !paymentResult.data) return []
  return (paymentResult.data as { rows: Array<{ id: string; name: string; deleted?: boolean }> }).rows
    ?.filter(r => !r.deleted)
    .map(r => ({ id: r.id, name: r.name })) ?? []
}

/** Delete paymentin → demand → invoice → customer order (for incomplete re-push). */
export async function trashMoySkladOrderChain(moySkladOrderId: string): Promise<boolean> {
  const invoices = await listMoySkladInvoicesForOrder(moySkladOrderId)

  for (const invoice of invoices) {
    const demands = await listMoySkladDemandsForInvoice(invoice.id)
    for (const demand of demands) {
      const payments = await listMoySkladPaymentInsForDemand(demand.id)
      for (const payment of payments) {
        const paymentDelete = await moySkladFetch(`/entity/paymentin/${payment.id}`, { method: 'DELETE' })
        if (!paymentDelete.ok) {
          warnLog(`⚠️ MoySklad: Failed to trash paymentin ${payment.name}: ${paymentDelete.error}`)
        }
      }
      const demandDelete = await moySkladFetch(`/entity/demand/${demand.id}`, { method: 'DELETE' })
      if (!demandDelete.ok) {
        warnLog(`⚠️ MoySklad: Failed to trash demand ${demand.name}: ${demandDelete.error}`)
        return false
      }
    }
    const invoiceDelete = await moySkladFetch(`/entity/invoiceout/${invoice.id}`, { method: 'DELETE' })
    if (!invoiceDelete.ok) {
      warnLog(`⚠️ MoySklad: Failed to trash invoice ${invoice.name}: ${invoiceDelete.error}`)
      return false
    }
  }

  const orderDelete = await moySkladFetch(`/entity/customerorder/${moySkladOrderId}`, { method: 'DELETE' })
  return orderDelete.ok
}

export async function trashMoySkladCustomerOrder(moySkladOrderId: string): Promise<boolean> {
  return trashMoySkladOrderChain(moySkladOrderId)
}

// ============================================================================
// Utility: Check if MoySklad integration is enabled
// ============================================================================

export function isMoySkladEnabled(): boolean {
  const enabled = !!(process.env.MOYSKLAD_LOGIN && process.env.MOYSKLAD_PASSWORD)
  debugLog('🔍 MoySklad: isMoySkladEnabled =', enabled, '| LOGIN present:', !!process.env.MOYSKLAD_LOGIN, '| PASSWORD present:', !!process.env.MOYSKLAD_PASSWORD)
  return enabled
}
