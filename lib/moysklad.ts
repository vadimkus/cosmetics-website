/**
 * MoySklad (МойСклад) Integration Module
 * 
 * Creates customer orders in MoySklad when orders are placed on genosys.ae.
 * This is a one-way sync: genosys.ae → MoySklad (read-only for products).
 * 
 * MoySklad API docs: https://dev.moysklad.ru/doc/api/remap/1.2/
 * GitHub docs: https://github.com/moysklad/api-remap-1.2-doc
 * 
 * IMPORTANT: This module never modifies existing MoySklad products, counterparties,
 * or other entities. It only CREATES new customer orders and counterparties (if needed).
 */

import { debugLog, errorLog, warnLog } from '@/lib/logger'

// ============================================================================
// Configuration
// ============================================================================

const MOYSKLAD_API_BASE = 'https://api.moysklad.ru/api/remap/1.2'

// Entity references (from MoySklad account)
const MOYSKLAD_ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738' // Genosys Middle East FZ-LLC
const MOYSKLAD_STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a' // Genosys Warehouse
const MOYSKLAD_CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f' // AED (default)
const MOYSKLAD_STATE_NEW_ID = 'e1a0abf2-33c5-11ea-0a80-043f000b275a' // "Новый" (New)

// ============================================================================
// Auth
// ============================================================================

function getAuthHeader(): string | null {
  const login = process.env.MOYSKLAD_LOGIN
  const password = process.env.MOYSKLAD_PASSWORD
  if (!login || !password) {
    errorLog('❌ MoySklad: MOYSKLAD_LOGIN or MOYSKLAD_PASSWORD not set')
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
// Product Mapping
// ============================================================================

/**
 * Maps webapp product names → MoySklad product UUIDs.
 * 
 * The webapp uses short names (e.g., "POWER SOLUTION CVS") while MoySklad
 * uses longer names with "Box" suffix for box products (e.g., "POWER SOLUTION CVS Box").
 * 
 * This mapping was built by querying both databases and matching products.
 * Products are matched by name similarity — MoySklad product data is NEVER modified.
 * 
 * Prices in MoySklad are in kopecks (value × 100), but since we use AED,
 * our prices need to be multiplied by 100 when sending to MoySklad.
 */
const PRODUCT_MAP: Record<string, string> = {
  // === Power Solutions (boxes, 10 vials each) ===
  'POWER SOLUTION AWS': '05507ec8-3447-11ea-0a80-05dc00016a6b',       // POWER SOLUTION AWS Box
  'POWER SOLUTION SWS': '662f268a-3448-11ea-0a80-00e60001a228',       // POWER SOLUTION SWS Box
  'POWER SOLUTION CVS': 'cd352a84-45d4-11ea-0a80-01f800166866',       // POWER SOLUTION CVS Box
  'POWER SOLUTION HES': '22afc79d-45d6-11ea-0a80-01f80016717c',       // POWER SOLUTION HES Box
  'POWER SOLUTION PCS': 'e5c696ee-45cb-11ea-0a80-01f80015e85a',       // POWER SOLUTION PCS Box
  'POWER SOLUTION CTS': '726570c8-45d5-11ea-0a80-01f800166ccf',       // POWER SOLUTION CTS Box

  // === Skincare Creams ===
  'INTENSIVE HYDRO SOOTHING CREAM': '1ebfde72-42b6-11ea-0a80-05c1000c3129',  // 50g
  'MULTI FUNCTIONAL ANTI-WRINKLE CREAM': '6b2a342c-bf06-11ed-0a80-02f30003ffc8', // 50g
  'MULTI VITA RADIANCE CREAM': 'd0fc1a8f-a96f-11ea-0a80-00d100134b49',       // 50g
  'INTENSIVE PROBLEM CONTROL CREAM': '456e3fbd-42b7-11ea-0a80-0095000be27d',  // 50g
  'SKIN BARRIER PROTECTING CREAM': '3805fbad-42b8-11ea-0a80-03cf000bfaef',    // 100g
  'MOISTURE REPLENISHING HYALURON CREAM': 'be705c7d-9808-11ee-0a80-02460037622e', // 50g
  'ND Cell ANTI-WRINKLE CREAM': '65bdc2ca-42ba-11ea-0a80-0096000bce23',       // 50ml
  'EyeCell EYE CONTOUR CREAM': '96d8a1a4-42bd-11ea-0a80-0693000bd7f8',        // 20ml
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
  'SNOW BOOSTER': '70f536c1-3449-11ea-0a80-05dc0001878d',                     // Snow Booster Toner 200ml
  'INTENSIVE PROBLEM CONTROL TONER': '86d64dba-29c8-11ed-0a80-07740006f514',   // 200ml
  'SKIN DEFENDER LIP & EYE MAKEUP REMOVER': 'bcf432e7-ec44-11ee-0a80-077500174711', // 200ml

  // === Peeling & Masks ===
  'SKIN RENEWAL PEELING SYSTEM (SRS)': '62225706-3445-11ea-0a80-05dc000156b3', // Box
  'EPI TURNOVER BOOSTING PEELING GEL': 'cd901a4e-e88b-11ea-0a80-05ae00007806', // 100g
  'PEPTIDE GEL MASK': 'a7b0f2a5-3446-11ea-0a80-05dc000165ba',                 // Box (5pcs)
  'EZ CO₂ MASK KIT': 'f34ed25a-343f-11ea-0a80-05dc0001110e',                  // Box (5 treatments)
  'HYDRO COOL MODELING MASK': '806e9e52-3444-11ea-0a80-05dc00014e2d',          // 1kg
  'EyeCell EYE PEPTIDE GEL PATCH': '3e1bd611-42bd-11ea-0a80-01e3000bd9c2',     // Box
  'SOOTHING BOMB SEA ALGAE MASK': '9d634465-2690-11ec-0a80-0767000c229e',      // 23g
  'INTENSIVE REPAIR COLLAGEN MASK': '51e74608-45cb-11ea-0a80-01f80015bea2',     // 23g
  'BIO-FERMENT AGE DEFYING POWDER MASK': 'f03d23d3-3556-11f0-0a80-16530008ddf9', // 300g
  'SKIN REBOOT PDRN MASK PACK': 'b6766232-571e-11f0-0a80-04380007c924',        // 30 sheets

  // === Sun Protection ===
  'MULTI SUN CREAM [SPF 40 PA++]': '60c64e56-42b9-11ea-0a80-01e3000bb41e',     // 40g
  'ULTRA SHIELD SUN CREAM [SPF 50+ PA++++]': '8f9e1d0b-8d10-11ee-0a80-00e10079b204', // 50g

  // === BB/Cushion ===
  'SKIN CARING BLEMISH BALM CUSHION [SPF 50+ PA++++]': '8e55b3ff-d092-11ec-0a80-022900a6db36', // #1 Ivory (default)
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

  // === Kits & Holiday ===
  'Holiday Kit': '2457826d-993a-11f0-0a80-1616000c9d82',                       // OXY VITA Holiday KIT
}

/**
 * Resolve MoySklad product ID from webapp product name.
 * Falls back to null if no mapping exists (beauty boxes, bundles, etc.)
 */
function getMoySkladProductId(productName: string): string | null {
  // Direct match
  if (PRODUCT_MAP[productName]) {
    return PRODUCT_MAP[productName]
  }
  
  // Normalize and try again (trim, uppercase)
  const normalized = productName.trim()
  if (PRODUCT_MAP[normalized]) {
    return PRODUCT_MAP[normalized]
  }

  // Case-insensitive search
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
 * Find or create a counterparty (customer) in MoySklad.
 * Searches by phone first, then by email. Creates if not found.
 * NEVER modifies existing counterparties.
 */
async function findOrCreateCounterparty(
  name: string,
  email: string,
  phone: string
): Promise<CounterpartyResult | null> {
  // Search by phone (most reliable for UAE customers)
  if (phone) {
    const cleanPhone = phone.replace(/\s/g, '')
    const result = await moySkladFetch(
      `/entity/counterparty?filter=phone=${encodeURIComponent(cleanPhone)}&limit=1`
    )
    if (result.ok && result.data) {
      const rows = (result.data as { rows: Array<{ id: string; meta: MoySkladMeta }> }).rows
      const first = rows?.[0]
      if (first) {
        debugLog('✅ MoySklad: Found counterparty by phone:', first.id)
        return { id: first.id, meta: first.meta }
      }
    }
  }

  // Search by email
  if (email) {
    const result = await moySkladFetch(
      `/entity/counterparty?filter=email=${encodeURIComponent(email)}&limit=1`
    )
    if (result.ok && result.data) {
      const rows = (result.data as { rows: Array<{ id: string; meta: MoySkladMeta }> }).rows
      const first = rows?.[0]
      if (first) {
        debugLog('✅ MoySklad: Found counterparty by email:', first.id)
        return { id: first.id, meta: first.meta }
      }
    }
  }

  // Search by name (last resort)
  const nameResult = await moySkladFetch(
    `/entity/counterparty?filter=name=${encodeURIComponent(name)}&limit=1`
  )
  if (nameResult.ok && nameResult.data) {
    const rows = (nameResult.data as { rows: Array<{ id: string; meta: MoySkladMeta }> }).rows
    const first = rows?.[0]
    if (first) {
      debugLog('✅ MoySklad: Found counterparty by name:', first.id)
      return { id: first.id, meta: first.meta }
    }
  }

  // Create new counterparty
  debugLog('🆕 MoySklad: Creating new counterparty:', name)
  const createResult = await moySkladFetch('/entity/counterparty', {
    method: 'POST',
    body: {
      name,
      ...(email ? { email } : {}),
      ...(phone ? { phone: phone.replace(/\s/g, '') } : {}),
      companyType: 'individual',
      description: `Created from genosys.ae order`
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
  price: number // Price in AED (e.g., 580)
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
  paymentMethod: string // 'cod', 'stripe', 'apple_pay'
  description?: string
}

/**
 * Create a customer order in MoySklad.
 * 
 * This is the main integration function. It:
 * 1. Finds or creates the customer as a counterparty
 * 2. Maps webapp products to MoySklad product IDs
 * 3. Creates the customer order with positions
 * 
 * Returns { success, orderId?, error? }
 * 
 * SAFETY: This function is designed to be called fire-and-forget.
 * It never throws — all errors are caught and logged.
 * It never blocks the main checkout flow.
 */
export async function createMoySkladOrder(
  orderData: MoySkladOrderData
): Promise<{ success: boolean; moySkladOrderId?: string; error?: string }> {
  try {
    // Check if MoySklad integration is enabled
    const auth = getAuthHeader()
    if (!auth) {
      debugLog('⏭️ MoySklad: Integration disabled (no credentials)')
      return { success: false, error: 'MoySklad credentials not configured' }
    }

    debugLog('🔄 MoySklad: Creating order', orderData.orderNumber)

    // Step 1: Find or create counterparty
    const counterparty = await findOrCreateCounterparty(
      orderData.customerName,
      orderData.customerEmail,
      orderData.customerPhone
    )

    if (!counterparty) {
      return { success: false, error: 'Failed to find/create counterparty' }
    }

    // Step 2: Build positions (order line items)
    const positions: Array<{
      quantity: number
      price: number
      assortment: { meta: MoySkladMeta }
      vat: number
      vatEnabled: boolean
    }> = []

    let unmappedItems: string[] = []

    for (const item of orderData.items) {
      const moySkladProductId = getMoySkladProductId(item.productName)
      
      if (!moySkladProductId) {
        warnLog(`⚠️ MoySklad: No product mapping for "${item.productName}"`)
        unmappedItems.push(item.productName)
        continue
      }

      positions.push({
        quantity: item.quantity,
        price: Math.round(item.price * 100), // Convert AED to kopecks (x100)
        assortment: entityMeta('product', moySkladProductId),
        vat: 5, // UAE 5% VAT
        vatEnabled: true,
      })
    }

    // Step 3: Build order description
    const paymentLabel = orderData.paymentMethod === 'cod' ? 'Cash on Delivery' 
      : orderData.paymentMethod === 'stripe' ? 'Stripe (Card)'
      : orderData.paymentMethod === 'apple_pay' ? 'Apple Pay'
      : orderData.paymentMethod
    
    const descParts = [
      `genosys.ae order #${orderData.orderNumber}`,
      `Payment: ${paymentLabel}`,
      `Shipping: ${orderData.shipping} AED`,
    ]
    if (unmappedItems.length > 0) {
      descParts.push(`Unmapped items: ${unmappedItems.join(', ')}`)
    }
    if (orderData.description) {
      descParts.push(orderData.description)
    }

    // Step 4: Create the order
    const orderBody = {
      name: orderData.orderNumber,
      description: descParts.join(' | '),
      organization: entityMeta('organization', MOYSKLAD_ORG_ID),
      agent: { meta: counterparty.meta },
      store: entityMeta('store', MOYSKLAD_STORE_ID),
      state: entityMeta('customerorder/metadata/states', MOYSKLAD_STATE_NEW_ID),
      vatEnabled: true,
      vatIncluded: true,
      rate: {
        currency: entityMeta('currency', MOYSKLAD_CURRENCY_ID)
      },
      shipmentAddress: [
        orderData.customerAddress,
        orderData.customerEmirate,
        'UAE'
      ].filter(Boolean).join(', '),
      ...(positions.length > 0 ? { positions } : {}),
    }

    const result = await moySkladFetch('/entity/customerorder', {
      method: 'POST',
      body: orderBody
    })

    if (result.ok && result.data) {
      const created = result.data as { id: string; name: string }
      debugLog(`✅ MoySklad: Order created! ID: ${created.id}, Name: ${created.name}`)
      return { success: true, moySkladOrderId: created.id }
    }

    errorLog('❌ MoySklad: Failed to create order:', result.error)
    return { success: false, error: result.error || 'Unknown error' }

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    errorLog('❌ MoySklad: Unexpected error:', message)
    return { success: false, error: message }
  }
}

// ============================================================================
// Utility: Check if MoySklad integration is enabled
// ============================================================================

export function isMoySkladEnabled(): boolean {
  return !!(process.env.MOYSKLAD_LOGIN && process.env.MOYSKLAD_PASSWORD)
}
