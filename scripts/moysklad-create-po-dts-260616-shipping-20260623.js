#!/usr/bin/env node

/**
 * MoySklad — DM GME 260616 **shipping invoice** (2026-06-23).
 * Source: ~/Desktop/26062026/DM GME 260616_Shipping Invoice.pdf
 * AWB: 607-5410 8224 | Packing list in same folder.
 *
 * Full shipment: USD 15,098.80 / 1,618 invoice units / 38 lines (+ support block).
 * Replaces partial proforma PO (dd395756, 22 lines / USD 7,600) — that PO stays unposted.
 *
 *   node --import dotenv/config scripts/moysklad-create-po-dts-260616-shipping-20260623.js
 *   node --import dotenv/config scripts/moysklad-create-po-dts-260616-shipping-20260623.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD
if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const { uaeToday } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const FX = 3.6725
const CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f'
const UOM_PCS_ID = 'bee1278a-3447-11ea-0a80-01b500019e31'
const FOLDER_MARKETING_ID = 'eb9e38fd-62bd-11ea-0a80-01a0000df620'
const WHOLESALE_PRICE_TYPE_ID = 'e188f78b-33c5-11ea-0a80-043f000b2740'
const RETAIL_PRICE_TYPE_ID = 'cb04ba0c-33ce-11ea-0a80-05d0000b20e5'

const OLD_PO_ID = 'dd395756-6ae8-11f1-0a80-03670038bbd3'

const INVOICE = {
  number: 'DM GME 260616 ship',
  ref: 'DM GME 260616',
  dateIssued: '2026-06-23',
  deliveryExpected: '2026-07-15',
  supplierId: '3a0a3f28-33cf-11ea-0a80-043f000b9859',
  orgId: 'e18525a4-33c5-11ea-0a80-043f000b2738',
  storeId: 'e186d449-33c5-11ea-0a80-043f000b273a',
  usdTotal: 15098.8,
  awb: '607-5410 8224',
  cpip: 'CPIP-160626-081300',
}

const MARKER = `DM-GME-260616-SHIPPING-INVOICE-${uaeToday()}`

function usdToMinor(usd) {
  return Math.round(usd * FX * 100)
}

function money(minor) {
  return (minor / 100).toFixed(2)
}

function href(entityType, id) {
  return { meta: { href: `${API}/entity/${entityType}/${id}`, type: entityType, mediaType: 'application/json' } }
}

function currencyRef() {
  return { meta: href('currency', CURRENCY_ID).meta }
}

function salePrices(wholesaleAed, retailAed) {
  return [
    { value: Math.round(wholesaleAed * 100), currency: currencyRef(), priceType: href('pricetype', WHOLESALE_PRICE_TYPE_ID) },
    { value: Math.round(retailAed * 100), currency: currencyRef(), priceType: href('pricetype', RETAIL_PRICE_TYPE_ID) },
  ]
}

/** New SKUs required for this shipping invoice. */
const NEW_PRODUCTS = [
  {
    code: '54484',
    name: 'Genosys CERABARRIER Biome Gel Cleanser 200ml',
    invCode: 'GCCL05',
    usdBuy: 7,
    saleWholesale: 190,
    saleRetail: 380,
    folder: null,
  },
  {
    code: '54485',
    name: 'Genosys CERABARRIER Biome Gel Cleanser 600ml',
    invCode: 'GCCL06',
    usdBuy: 10,
    saleWholesale: 310,
    saleRetail: 620,
    folder: null,
  },
  {
    code: '54486',
    name: 'Genosys Non Woven Bag (S)',
    invCode: 'GMAC05',
    usdBuy: 0.7,
    saleWholesale: 0,
    saleRetail: 0,
    folder: FOLDER_MARKETING_ID,
  },
  {
    code: '54487',
    name: 'Samples Revita Glow BB Cream #01 Bright 2g×50 box',
    invCode: 'GCCR48',
    usdBuy: 40,
    saleWholesale: 0,
    saleRetail: 0,
    folder: FOLDER_MARKETING_ID,
  },
  {
    code: '54488',
    name: 'Samples Revita Glow BB Cream #02 Natural 2g×50 box',
    invCode: 'GCCR49',
    usdBuy: 40,
    saleWholesale: 0,
    saleRetail: 0,
    folder: FOLDER_MARKETING_ID,
  },
  {
    code: '54489',
    name: 'Samples Multi Vita Radiance Serum 2ml×100 box',
    invCode: 'GCSE16',
    usdBuy: 36,
    saleWholesale: 0,
    saleRetail: 0,
    folder: FOLDER_MARKETING_ID,
  },
]

const REACTIVATE_PRODUCTS = [
  {
    code: '00120',
    productId: '7d36feba-a96e-11ea-0a80-02b3001280dc',
    name: 'Samples Skin Barrier Protecting Cream 2g×100 box',
    invCode: 'GCCR24',
    usdBuy: 3,
    saleWholesale: 0,
    saleRetail: 0,
    folder: FOLDER_MARKETING_ID,
  },
]

/** Shipping invoice lines — qty and USD from PDF (2026-06-23). */
const PO_LINES = [
  { invCode: 'GRFS150', msCode: '00004', qty: 5, usd: 8 },
  { invCode: 'GRME025', msCode: '00084', qty: 20, usd: 7 },
  { invCode: 'GCCL01', msCode: '00021', qty: 100, usd: 11 },
  { invCode: 'GCCL02', msCode: '00024', qty: 40, usd: 16.3 },
  { invCode: 'GCCL05', msCode: '54484', qty: 98, usd: 7 },
  { invCode: 'GCCL06', msCode: '54485', qty: 30, usd: 10 },
  { invCode: 'GCTN01', msCode: '00022', qty: 80, usd: 7.9 },
  { invCode: 'GCTN02', msCode: '00025', qty: 20, usd: 16.3 },
  { invCode: 'GCTN03', msCode: '00145', qty: 30, usd: 9.2 },
  { invCode: 'GCMA05', msCode: '00013', qty: 10, usd: 15.8 },
  /** GCMA09 bulk box 100 sheets ×3 → 300 single masks */
  { invCode: 'GCMA09', msCode: '00140', qty: 300, usd: 0.9, note: '3 bulk boxes ×100 sheets' },
  { invCode: 'GCMA06', msCode: '00063', qty: 300, usd: 0.8 },
  { invCode: 'GCPS05', msCode: '00069', qty: 6, usd: 21.3 },
  { invCode: 'GCMA01', msCode: '00011', qty: 50, usd: 15.8 },
  { invCode: 'GCMA11', msCode: '00189', qty: 20, usd: 13 },
  { invCode: 'GCAP02', msCode: '54470', qty: 110, usd: 23 },
  { invCode: 'GCAP01', msCode: '54475', qty: 80, usd: 9.3 },
  { invCode: 'GCCR07', msCode: '00039', qty: 10, usd: 54.5 },
  { invCode: 'GCCR43', msCode: '54465', qty: 40, usd: 14.3 },
  { invCode: 'GCFO02', msCode: '00144', qty: 100, usd: 14 },
  { invCode: 'GCEC00', msCode: '00059', qty: 10, usd: 36 },
  { invCode: 'GAHR01', msCode: '00142', qty: 5, usd: 160 },
  { invCode: 'CCVS03', msCode: '00141', qty: 15, usd: 28 },
  { invCode: 'GMAC05', msCode: '54486', qty: 300, usd: 0.7 },
  { invCode: 'GCCL03', msCode: '00111', qty: 10, usd: 24 },
  { invCode: 'GCCR42', msCode: '00112', qty: 4, usd: 25 },
  { invCode: 'GCCR48', msCode: '54487', qty: 2, usd: 40 },
  { invCode: 'GCCR49', msCode: '54488', qty: 2, usd: 40 },
  { invCode: 'GCCR20', msCode: '00114', qty: 4, usd: 34 },
  { invCode: 'GCCR22', msCode: '00116', qty: 6, usd: 23 },
  { invCode: 'GCSP-CB01', msCode: '00118', qty: 8, usd: 35 },
  { invCode: 'GCSE18', msCode: '54478', qty: 4, usd: 36 },
  { invCode: 'GCCR41', msCode: '54479', qty: 4, usd: 35 },
  { invCode: 'GCSE16', msCode: '54489', qty: 2, usd: 36 },
  { invCode: 'GCCR24', msCode: '00120', qty: 2, usd: 3, support: true },
  { invCode: 'GCEX02', msCode: '00135', qty: 4, usd: 3, support: true },
  { invCode: 'GCMA12', msCode: '54476', qty: 4, usd: 3, support: true },
  { invCode: 'GCHR21', msCode: '00121', qty: 80, usd: 1, support: true },
]

const BUY_PRICE_UPDATES = PO_LINES.filter((l) => !NEW_PRODUCTS.some((n) => n.code === l.msCode))

async function api(method, pathStr, body) {
  for (let attempt = 0; attempt < 6; attempt++) {
    try {
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
      if (res.status === 429 || res.status >= 500) {
        await new Promise((r) => setTimeout(r, 900 * (attempt + 1)))
        continue
      }
      if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
      return text ? JSON.parse(text) : null
    } catch (e) {
      if (attempt === 5) throw e
      await new Promise((r) => setTimeout(r, 900 * (attempt + 1)))
    }
  }
}

async function getProductByCode(code, includeArchived = false) {
  const data = await api('GET', `/entity/product?filter=code=${encodeURIComponent(code)}&limit=1`)
  if (data?.rows?.[0]) return data.rows[0]
  if (!includeArchived) return null
  const archived = await api(
    'GET',
    `/entity/product?filter=code=${encodeURIComponent(code)};archived=true&limit=1`
  )
  return archived?.rows?.[0] || null
}

async function ensureNoDuplicatePo() {
  const existing = await api('GET', `/entity/purchaseorder?search=${encodeURIComponent(INVOICE.number)}&limit=5`)
  const dup = (existing.rows || []).find((r) => r.name === INVOICE.number)
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
    description: `${def.invCode} | ${INVOICE.ref} shipping invoice | buy USD ${def.usdBuy} → AED ${money(buyMinor)}`,
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
  console.log('\n  Products — create / reactivate / update buyPrice:')

  for (const def of REACTIVATE_PRODUCTS) {
    const existing = await api('GET', `/entity/product/${def.productId}`)
    const buyMinor = usdToMinor(def.usdBuy)
    console.log(`    ↻ REACTIVATE ${def.code} ${def.name} buy ${money(buyMinor)} AED`)
    if (COMMIT) {
      await api('PUT', `/entity/product/${def.productId}`, {
        meta: existing.meta,
        archived: false,
        code: def.code,
        name: def.name,
        buyPrice: { value: buyMinor, currency: currencyRef() },
        salePrices: salePrices(def.saleWholesale, def.saleRetail),
        productFolder: href('productfolder', def.folder),
        description: `${def.invCode} | ${INVOICE.ref} support item | buy USD ${def.usdBuy}`,
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
    if (NEW_PRODUCTS.some((n) => n.code === row.msCode)) continue
    const p = await getProductByCode(row.msCode, row.msCode === '00121' || row.msCode === '00120')
    if (!p) throw new Error(`Product not found for buy update: ${row.msCode} (${row.invCode})`)
    const buyMinor = usdToMinor(row.usd)
    const oldMinor = p.buyPrice?.value ?? 0
    if (oldMinor === buyMinor) {
      console.log(`    ${row.msCode} buy unchanged ${money(buyMinor)} AED`)
      continue
    }
    console.log(`    ${row.msCode} buy ${money(oldMinor)} → ${money(buyMinor)} AED (${row.invCode} $${row.usd})`)
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
      line.msCode === '00121' || line.msCode === '00120'
    )
    if (!p && REACTIVATE_PRODUCTS.some((d) => d.code === line.msCode)) {
      p = { id: REACTIVATE_PRODUCTS.find((d) => d.code === line.msCode).productId, name: line.invCode }
    }
    if (!p && allowMissingNew) {
      const def = NEW_PRODUCTS.find((d) => d.code === line.msCode)
      if (def) {
        resolved.push({ ...line, productId: null, name: def.name, priceMinor: usdToMinor(line.usd) })
        continue
      }
    }
    if (!p) throw new Error(`Missing product ${line.msCode} for ${line.invCode}`)
    resolved.push({ ...line, productId: p.id, name: p.name, priceMinor: usdToMinor(line.usd) })
  }
  return resolved
}

async function main() {
  console.log('════════════════════════════════════════════════════════════════════')
  console.log('  MoySklad — DM GME 260616 shipping invoice PO')
  console.log('════════════════════════════════════════════════════════════════════')
  console.log(`  Mode : ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Source: Desktop/26062026/DM GME 260616_Shipping Invoice.pdf`)
  console.log(`  FX   : 1 USD = ${FX} AED`)
  console.log(`  ETA  : ${INVOICE.deliveryExpected}`)

  const oldPo = await api('GET', `/entity/purchaseorder/${OLD_PO_ID}`)
  console.log(`\n  Old partial PO: ${oldPo.name} | ${money(oldPo.sum)} AED | applicable=${oldPo.applicable}`)

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
    paidUsd += l.usd * l.qty
    const tag = l.support ? 'support' : `$${l.usd}`
    console.log(
      `    ${l.invCode.padEnd(10)} ${l.msCode} x${String(l.qty).padStart(4)}  ${tag.padStart(8)}  ${money(lineMinor).padStart(12)} AED${l.note ? '  ' + l.note : ''}`
    )
  }

  const expectedUsd = INVOICE.usdTotal
  const usdDiff = Math.abs(paidUsd - expectedUsd)
  console.log(`\n  Lines: ${lines.length} | PO qty sum: ${totalQty} | PO sum: ${money(totalMinor)} AED`)
  console.log(`  Invoice USD: $${expectedUsd.toFixed(2)} | calc USD: $${paidUsd.toFixed(2)} | diff: $${usdDiff.toFixed(2)}`)
  if (usdDiff > 0.05) throw new Error(`USD total mismatch: expected ${expectedUsd}, got ${paidUsd}`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const commitLines = await resolvePoLines(false)
  const created = await api('POST', '/entity/purchaseorder', {
    name: INVOICE.number,
    moment: `${INVOICE.dateIssued} 00:00:00`,
    deliveryPlannedMoment: `${INVOICE.deliveryExpected} 00:00:00`,
    applicable: true,
    organization: href('organization', INVOICE.orgId),
    agent: href('counterparty', INVOICE.supplierId),
    store: href('store', INVOICE.storeId),
    description: [
      `Shipping invoice ${INVOICE.ref} dated ${INVOICE.dateIssued} — DTS MG → Genosys Middle East FZ-LLC`,
      `Source: Desktop/26062026/DM GME 260616_Shipping Invoice.pdf + packing list + AWB ${INVOICE.awb}`,
      `FOB Incheon | T/T in advance | ${INVOICE.cpip}`,
      `Invoice total USD $${expectedUsd.toFixed(2)} / ${totalQty} PO units | buyPrice AED = invoice USD × ${FX}`,
      `New SKUs: 54484/54485 Cerabarrier cleansers, 54486 bags, 54487/54488 Revita sample boxes, 54489 MVS sample box; reactivated 00120 SPC sample.`,
      `GCMA09 bulk → 00140 ×300 sheets (3×100-sheet boxes). Support items @ invoice support USD.`,
      `Supersedes partial proforma PO ${oldPo.name} (${OLD_PO_ID}, ${money(oldPo.sum)} AED, unposted).`,
      MARKER,
    ].join('\n'),
    positions: commitLines.map((l) => ({
      quantity: l.qty,
      price: l.priceMinor,
      assortment: href('product', l.productId),
      vat: 0,
      vatEnabled: false,
    })),
  })

  const verify = await api('GET', `/entity/purchaseorder/${created.id}`)
  const pos = await api('GET', `/entity/purchaseorder/${created.id}/positions?limit=100`)
  console.log(`\n  Created PO: ${verify.name} | ${money(verify.sum)} AED | ${pos.meta?.size} lines`)
  console.log(`  https://online.moysklad.ru/app/#purchaseorder/edit?id=${created.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
