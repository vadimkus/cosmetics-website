#!/usr/bin/env node

/**
 * MoySklad — DM GME 260616 (2026-06-16 Korea commercial invoice).
 *
 * 1) Create missing tester / sample SKUs (2g, 4g, 30ml boxes + PDRN Homecare).
 * 2) Update buyPrice (AED) = invoice USD × 3.6725 on sample + invoice lines.
 * 3) Post supplier PO matching the invoice (paid + FOC @ 0).
 *
 *   node --import dotenv/config scripts/moysklad-create-po-dts-260616.js
 *   node --import dotenv/config scripts/moysklad-create-po-dts-260616.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD
if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}
const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const FX = 3.6725
const CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f'
const UOM_PCS_ID = 'bee1278a-3447-11ea-0a80-01b500019e31'
const FOLDER_MARKETING_ID = 'eb9e38fd-62bd-11ea-0a80-01a0000df620'
const WHOLESALE_PRICE_TYPE_ID = 'e188f78b-33c5-11ea-0a80-043f000b2740'
const RETAIL_PRICE_TYPE_ID = 'cb04ba0c-33ce-11ea-0a80-05d0000b20e5'

const INVOICE = {
  number: 'DM GME 260616',
  dateIssued: '2026-06-16',
  deliveryExpected: '2026-07-07',
  supplierId: '3a0a3f28-33cf-11ea-0a80-043f000b9859',
  orgId: 'e18525a4-33c5-11ea-0a80-043f000b2738',
  storeId: 'e186d449-33c5-11ea-0a80-043f000b273a',
  usdTotal: 7600,
}

function usdToMinor(usd) {
  return Math.round(usd * FX * 100)
}

function money(minor) {
  return (minor / 100).toFixed(2)
}

function href(entityType, id) {
  return {
    meta: {
      href: `${API}/entity/${entityType}/${id}`,
      type: entityType,
      mediaType: 'application/json',
    },
  }
}

function currencyRef() {
  return { meta: href('currency', CURRENCY_ID).meta }
}

function salePrices(wholesaleAed, retailAed) {
  return [
    {
      value: Math.round(wholesaleAed * 100),
      currency: currencyRef(),
      priceType: href('pricetype', WHOLESALE_PRICE_TYPE_ID),
    },
    {
      value: Math.round(retailAed * 100),
      currency: currencyRef(),
      priceType: href('pricetype', RETAIL_PRICE_TYPE_ID),
    },
  ]
}

/** New MoySklad products — buy from invoice USD; sale 0 for sample boxes. */
const NEW_PRODUCTS = [
  {
    code: '54475',
    name: 'Genosys BIO-MESO PDRN Homecare Ampoule 5000',
    invCode: 'GCAP01',
    usdBuy: 9.3,
    saleWholesale: 150,
    saleRetail: 300,
    folder: null,
  },
  {
    code: '54478',
    name: 'Samples Moisture Replenishing Hyaluron Serum 2ml×100 box',
    invCode: 'GCSE18',
    usdBuy: 36,
    saleWholesale: 0,
    saleRetail: 0,
    folder: FOLDER_MARKETING_ID,
  },
  {
    code: '54479',
    name: 'Samples Moisture Replenishing Hyaluron Cream 2g×100 box',
    invCode: 'GCCR41',
    usdBuy: 35,
    saleWholesale: 0,
    saleRetail: 0,
    folder: FOLDER_MARKETING_ID,
  },
  {
    code: '54476',
    name: 'Samples Skin Rescue Overnight Cream Mask 2g×50 box',
    invCode: 'GCMA12',
    usdBuy: 24,
    saleWholesale: 0,
    saleRetail: 0,
    folder: FOLDER_MARKETING_ID,
  },
]

/** Archived SKU to reactivate and retarget for this invoice. */
const REACTIVATE_PRODUCTS = [
  {
    code: '00121',
    name: 'HR³ Matrix Medi Scalp Shampoo α 30ml (tester)',
    invCode: 'GCHR21',
    usdBuy: 1.6,
    saleWholesale: 0,
    saleRetail: 0,
    folder: FOLDER_MARKETING_ID,
  },
]

/** Existing codes — refresh buyPrice from this invoice USD unit. */
const BUY_PRICE_UPDATES = [
  { code: '00004', usd: 8, invCode: 'GRFS150' },
  { code: '00021', usd: 11, invCode: 'GCCL01' },
  { code: '00024', usd: 16.3, invCode: 'GCCL02' },
  { code: '00022', usd: 7.9, invCode: 'GCTN01' },
  { code: '00011', usd: 15.8, invCode: 'GCMA01' },
  { code: '00189', usd: 13, invCode: 'GCMA11' },
  { code: '54470', usd: 23, invCode: 'GCAP02' },
  { code: '00039', usd: 54.5, invCode: 'GCCR07' },
  { code: '54465', usd: 14.3, invCode: 'GCCR43' },
  { code: '00142', usd: 160, invCode: 'GAHR01' },
  { code: '00141', usd: 28, invCode: 'CCVS03' },
  { code: '00111', usd: 35, invCode: 'GCCL03' },
  { code: '00112', usd: 25, invCode: 'GCCR42' },
  { code: '00114', usd: 34, invCode: 'GCCR20' },
  { code: '00116', usd: 23, invCode: 'GCCR22' },
  { code: '00118', usd: 35, invCode: 'GCSP-CB01' },
  { code: '00135', usd: 20, invCode: 'GCEX02' },
]

/** PO lines: invCode, msCode, qty, usd (0 = FOC) */
const PO_LINES = [
  { invCode: 'GRFS150', msCode: '00004', qty: 5, usd: 8 },
  { invCode: 'GCCL01', msCode: '00021', qty: 100, usd: 11 },
  { invCode: 'GCCL02', msCode: '00024', qty: 20, usd: 16.3 },
  { invCode: 'GCTN01', msCode: '00022', qty: 80, usd: 7.9 },
  { invCode: 'GCMA01', msCode: '00011', qty: 50, usd: 15.8 },
  { invCode: 'GCMA11', msCode: '00189', qty: 20, usd: 13 },
  { invCode: 'GCAP02', msCode: '54470', qty: 70, usd: 23 },
  { invCode: 'GCAP01', msCode: '54475', qty: 50, usd: 9.3 },
  { invCode: 'GCCR07', msCode: '00039', qty: 10, usd: 54.5 },
  { invCode: 'GCCR43', msCode: '54465', qty: 10, usd: 14.3 },
  { invCode: 'GAHR01', msCode: '00142', qty: 5, usd: 160 },
  { invCode: 'CCVS03', msCode: '00141', qty: 10, usd: 28 },
  { invCode: 'GCCL03', msCode: '00111', qty: 5, usd: 35 },
  { invCode: 'GCCR42', msCode: '00112', qty: 2, usd: 25 },
  { invCode: 'GCCR20', msCode: '00114', qty: 2, usd: 34 },
  { invCode: 'GCCR22', msCode: '00116', qty: 3, usd: 23 },
  { invCode: 'GCSP-CB01', msCode: '00118', qty: 3, usd: 35 },
  { invCode: 'GCSE18', msCode: '54478', qty: 2, usd: 36 },
  { invCode: 'GCCR41', msCode: '54479', qty: 2, usd: 35 },
  { invCode: 'GCEX02', msCode: '00135', qty: 2, usd: 0 },
  { invCode: 'GCMA12', msCode: '54476', qty: 2, usd: 0 },
  { invCode: 'GCHR21', msCode: '00121', qty: 40, usd: 0 },
]

async function api(method, pathStr, body) {
  const res = await fetch(pathStr.startsWith('http') ? pathStr : API + pathStr, {
    method,
    headers: {
      Authorization: AUTH,
      Accept: 'application/json;charset=utf-8',
      'Accept-Encoding': 'gzip',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
  return text ? JSON.parse(text) : null
}

async function getProductByCode(code, includeArchived = false) {
  const data = await api('GET', `/entity/product?filter=code=${encodeURIComponent(code)}&limit=1`)
  const active = data?.rows?.[0]
  if (active) return active
  if (!includeArchived) return null
  const archived = await api(
    'GET',
    `/entity/product?filter=code=${encodeURIComponent(code)};archived=true&limit=1`
  )
  return archived?.rows?.[0] || null
}

async function ensureNoDuplicatePo() {
  const existing = await api('GET', `/entity/purchaseorder?search=${encodeURIComponent(INVOICE.number)}&limit=5`)
  const dup = existing.rows.find((r) => r.name === INVOICE.number)
  if (dup) {
    throw new Error(
      `PO "${INVOICE.number}" already exists (${dup.id}) https://online.moysklad.ru/app/#purchaseorder/edit?id=${dup.id}`
    )
  }
}

function buildProductPayload(def) {
  const buyMinor = usdToMinor(def.usdBuy)
  const payload = {
    name: def.name,
    code: def.code,
    description: `${def.invCode} | ${INVOICE.number} Korea invoice | buy USD ${def.usdBuy} → AED ${money(buyMinor)}`,
    buyPrice: { value: buyMinor, currency: currencyRef() },
    salePrices: salePrices(def.saleWholesale, def.saleRetail),
    vat: 5,
    effectiveVat: 5,
    uom: href('uom', UOM_PCS_ID),
  }
  if (def.folder) payload.productFolder = href('productfolder', def.folder)
  return payload
}

async function createOrUpdateProducts() {
  console.log('\n  Products — create / reactivate / update buyPrice (USD × 3.6725):')

  for (const def of REACTIVATE_PRODUCTS) {
    const existing = await getProductByCode(def.code, true)
    if (!existing) throw new Error(`Archived product ${def.code} not found for reactivation`)
    const buyMinor = usdToMinor(def.usdBuy)
    console.log(`    ↻ REACTIVATE ${def.code} ${def.name} buy ${money(buyMinor)} AED`)
    if (COMMIT) {
      await api('PUT', `/entity/product/${existing.id}`, {
        meta: existing.meta,
        archived: false,
        name: def.name,
        buyPrice: { value: buyMinor, currency: currencyRef() },
        salePrices: salePrices(def.saleWholesale, def.saleRetail),
        productFolder: href('productfolder', def.folder),
        description: `${def.invCode} | ${INVOICE.number} Korea invoice FOC tester | buy USD ${def.usdBuy}`,
      })
    }
  }

  for (const def of NEW_PRODUCTS) {
    const existing = await getProductByCode(def.code)
    const buyMinor = usdToMinor(def.usdBuy)
    if (existing) {
      console.log(`    ${def.code} exists — update buy → ${money(buyMinor)} AED`)
      if (COMMIT) {
        await api('PUT', `/entity/product/${existing.id}`, {
          meta: existing.meta,
          buyPrice: { value: buyMinor, currency: currencyRef() },
          salePrices: salePrices(def.saleWholesale, def.saleRetail),
          description: buildProductPayload(def).description,
        })
      }
      continue
    }
    console.log(`    + CREATE ${def.code} ${def.name} buy ${money(buyMinor)} AED`)
    if (COMMIT) {
      const created = await api('POST', '/entity/product', buildProductPayload(def))
      console.log(`      id=${created.id}`)
    }
  }

  for (const row of BUY_PRICE_UPDATES) {
    const p = await getProductByCode(row.code)
    if (!p) throw new Error(`Product not found for buy update: ${row.code}`)
    const buyMinor = usdToMinor(row.usd)
    const oldMinor = p.buyPrice?.value ?? 0
    if (oldMinor === buyMinor) {
      console.log(`    ${row.code} buy unchanged ${money(buyMinor)} AED`)
      continue
    }
    console.log(`    ${row.code} buy ${money(oldMinor)} → ${money(buyMinor)} AED (${row.invCode} $${row.usd})`)
    if (COMMIT) {
      await api('PUT', `/entity/product/${p.id}`, {
        meta: p.meta,
        buyPrice: { value: buyMinor, currency: currencyRef() },
      })
    }
  }
}

async function resolvePoLines(allowMissingNew = false) {
  const resolved = []
  for (const line of PO_LINES) {
    let p = await getProductByCode(
      line.msCode,
      REACTIVATE_PRODUCTS.some((d) => d.code === line.msCode)
    )
    if (!p && allowMissingNew) {
      const def =
        NEW_PRODUCTS.find((d) => d.code === line.msCode) ||
        REACTIVATE_PRODUCTS.find((d) => d.code === line.msCode)
      if (def) {
        const priceMinor = line.usd > 0 ? usdToMinor(line.usd) : 0
        resolved.push({ ...line, productId: null, name: def.name, priceMinor })
        continue
      }
    }
    if (!p) throw new Error(`Missing product ${line.msCode} for ${line.invCode}`)
    const priceMinor = line.usd > 0 ? usdToMinor(line.usd) : 0
    resolved.push({ ...line, productId: p.id, name: p.name, priceMinor })
  }
  return resolved
}

async function main() {
  console.log('════════════════════════════════════════════════════════════════════')
  console.log('  MoySklad — DM GME 260616 Korea PO + tester SKU setup')
  console.log('════════════════════════════════════════════════════════════════════')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  FX: 1 USD = ${FX} AED`)

  await ensureNoDuplicatePo()
  await createOrUpdateProducts()

  const lines = await resolvePoLines(!COMMIT)

  let totalMinor = 0
  let totalQty = 0
  let paidUsd = 0
  console.log('\n  PO lines:')
  for (const l of lines) {
    const lineMinor = l.priceMinor * l.qty
    totalMinor += lineMinor
    totalQty += l.qty
    if (l.usd > 0) paidUsd += l.usd * l.qty
    const tag = l.usd === 0 ? 'FOC' : `$${l.usd}`
    console.log(
      `    ${l.invCode.padEnd(10)} ${l.msCode} ${l.name.slice(0, 44).padEnd(44)} x${String(l.qty).padStart(3)}  ${tag.padStart(8)}  ${money(lineMinor).padStart(10)} AED`
    )
  }
  console.log(`\n  Lines: ${lines.length} | units: ${totalQty} | PO sum: ${money(totalMinor)} AED`)
  console.log(`  Invoice paid USD (commodity): $${paidUsd.toFixed(2)} ≈ ${(paidUsd * FX).toFixed(2)} AED`)
  console.log(`  Invoice total USD: $${INVOICE.usdTotal} ≈ ${(INVOICE.usdTotal * FX).toFixed(2)} AED`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const commitLines = await resolvePoLines(false)
  const commitPositions = commitLines.map((l) => ({
    quantity: l.qty,
    price: l.priceMinor,
    assortment: href('product', l.productId),
    vat: 0,
    vatEnabled: false,
  }))

  const created = await api('POST', '/entity/purchaseorder', {
    name: INVOICE.number,
    moment: `${INVOICE.dateIssued} 00:00:00`,
    deliveryPlannedMoment: `${INVOICE.deliveryExpected} 00:00:00`,
    applicable: true,
    organization: href('organization', INVOICE.orgId),
    agent: href('counterparty', INVOICE.supplierId),
    store: href('store', INVOICE.storeId),
    description: [
      `Commercial invoice ${INVOICE.number} (2026-06-16) — DTS MG → Genosys Middle East FZ-LLC`,
      `FOB Incheon | T/T in advance | CPIP-160626-081300`,
      `Paid commodity USD $${INVOICE.usdTotal}; buyPrice AED = invoice USD × ${FX}.`,
      `New SKUs: 54475 PDRN Homecare, 54478/54479 sample hyaluron boxes, 54476 overnight mask; reactivated 00121 shampoo tester.`,
      `Sample boxes 00111/112/114/116/118 buy prices aligned to invoice.`,
      `FOC: GCEX02 EPI 2g×50 ×2, GCMA12 overnight 2g×50 ×2, GCHR21 shampoo 30ml ×40 @ 0.`,
    ].join('\n'),
    positions: commitPositions,
  })

  console.log(`\n  Created PO: ${created.name} | ${money(created.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#purchaseorder/edit?id=${created.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
