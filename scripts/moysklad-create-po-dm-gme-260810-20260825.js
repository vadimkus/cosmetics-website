#!/usr/bin/env node

/**
 * MoySklad — DM GME 260810 purchase order only (no receive).
 *
 * Source of truth: Desktop/18082029/DM GME 260810_Shipping Invoice (value).pdf
 *   Invoice 2026-08-18 | USD 4,709.00 | 2,644 invoice units
 *   AWB 176-2056-4025 | BOE 101-01485535-26 | CPIP-240826-087435
 *
 * Do NOT create supply. Cargo is in transit this week.
 *
 *   node --import dotenv/config scripts/moysklad-create-po-dm-gme-260810-20260825.js
 *   node --import dotenv/config scripts/moysklad-create-po-dm-gme-260810-20260825.js --commit
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

const INVOICE = {
  number: 'DM GME 260810',
  ref: 'DM GME 260810',
  dateIssued: '2026-08-18',
  deliveryExpected: '2026-08-29',
  supplierId: '3a0a3f28-33cf-11ea-0a80-043f000b9859',
  orgId: 'e18525a4-33c5-11ea-0a80-043f000b2738',
  storeId: 'e186d449-33c5-11ea-0a80-043f000b273a',
  usdTotal: 4709.0,
  invoiceUnits: 2644,
  awb: '176-2056-4025',
  boe: '101-01485535-26',
  cpip: 'CPIP-240826-087435',
}

const MARKER = `DM-GME-260810-PO-${uaeToday()}`

/**
 * Core sellable SKUs — update product buyPrice from this invoice.
 * Do NOT update 00144: value PDF prices beige at $8.30 for customs;
 * commercial invoice still $14.00 (current buy 51.42 AED). Testers/FOC left alone.
 */
const CORE_BUY_CODES = new Set([
  '00002',
  '00013',
  '00140',
  '00063',
  '54475',
  '00041',
  '54457',
  '00048',
])

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

const NEW_PRODUCTS = [
  {
    code: '54490',
    name: 'Genosys Facial Treatment Leaflet (Folded)',
    invCode: 'GMBR09',
    usdBuy: 0.2,
    folder: FOLDER_MARKETING_ID,
  },
  {
    code: '54491',
    name: 'Genosys Eyecell Kit Leaflet (Folded)',
    invCode: 'GMBR10',
    usdBuy: 0.2,
    folder: FOLDER_MARKETING_ID,
  },
  {
    code: '54492',
    name: 'Genosys HR3 Matrix Leaflet (Folded)',
    invCode: 'GMBR11',
    usdBuy: 0.2,
    folder: FOLDER_MARKETING_ID,
  },
  {
    code: '54493',
    name: 'Genosys Roller Leaflet (Folded)',
    invCode: 'GMBR07',
    usdBuy: 0.1,
    folder: FOLDER_MARKETING_ID,
  },
  {
    code: '54494',
    name: 'Genosys Needle Pen-K Leaflet (Folded)',
    invCode: 'GMBR32',
    usdBuy: 0.1,
    folder: FOLDER_MARKETING_ID,
  },
  {
    code: '54495',
    name: 'Genosys HairGen Booster Leaflet',
    invCode: 'GMBR29',
    usdBuy: 0.1,
    folder: FOLDER_MARKETING_ID,
  },
  {
    code: '54496',
    name: 'Genosys Hair Gentron Leaflet',
    invCode: 'HGBR01',
    usdBuy: 0.1,
    folder: FOLDER_MARKETING_ID,
  },
  {
    code: '54497',
    name: 'Genosys Trial Kit',
    invCode: 'GCST00',
    usdBuy: 1,
    folder: FOLDER_MARKETING_ID,
  },
  {
    code: '54498',
    name: 'Samples Intensive Blemish Balm Cream 2g×100 box',
    invCode: 'GCCR10',
    usdBuy: 2,
    folder: FOLDER_MARKETING_ID,
  },
  {
    code: '54499',
    name: 'Samples Soothing Repair Post Cream 2g×100 box',
    invCode: 'GCCR36',
    usdBuy: 2,
    folder: FOLDER_MARKETING_ID,
  },
  {
    code: '54500',
    name: 'Samples Ultra Shield Sun Cream 4g×50 box',
    invCode: 'GCCR38',
    usdBuy: 3,
    folder: FOLDER_MARKETING_ID,
  },
]

/**
 * One row per value-PDF line. qty = MoySklad stock units.
 * GCMA10 is the only conversion: 30 Box → 00140 ×300 sheets @ $0.98.
 */
const PO_LINES = [
  { invCode: 'GRFS050', msCode: '00002', qty: 30, usd: 8.0, invoiceQty: 30 },
  { invCode: 'GCMA05', msCode: '00013', qty: 30, usd: 15.8, invoiceQty: 30 },
  {
    invCode: 'GCMA10',
    msCode: '00140',
    qty: 300,
    usd: 0.98,
    invoiceQty: 30,
    invoiceUsd: 9.8,
    note: '30 Box → 300 sheets @ $9.80/10',
  },
  { invCode: 'GCMA06', msCode: '00063', qty: 300, usd: 0.8, invoiceQty: 300 },
  { invCode: 'GCAP01', msCode: '54475', qty: 30, usd: 9.3, invoiceQty: 30 },
  { invCode: 'GCCR09', msCode: '00041', qty: 20, usd: 6.5, invoiceQty: 20 },
  { invCode: 'GCCR37', msCode: '54457', qty: 30, usd: 9.3, invoiceQty: 30 },
  { invCode: 'GCFO02', msCode: '00144', qty: 100, usd: 8.3, invoiceQty: 100 },
  { invCode: 'GCHR18', msCode: '00048', qty: 10, usd: 26.9, invoiceQty: 10 },
  { invCode: 'GMBR09', msCode: '54490', qty: 500, usd: 0.2, invoiceQty: 500 },
  { invCode: 'GMBR10', msCode: '54491', qty: 100, usd: 0.2, invoiceQty: 100 },
  { invCode: 'GMBR11', msCode: '54492', qty: 100, usd: 0.2, invoiceQty: 100 },
  { invCode: 'GMAC05', msCode: '54486', qty: 300, usd: 0.7, invoiceQty: 300 },
  { invCode: 'GCCL03', msCode: '00111', qty: 5, usd: 35.0, invoiceQty: 5 },
  { invCode: 'GCCR42', msCode: '00112', qty: 4, usd: 25.0, invoiceQty: 4 },
  { invCode: 'GCCR20', msCode: '00114', qty: 2, usd: 34.0, invoiceQty: 2 },
  { invCode: 'GCCR22', msCode: '00116', qty: 4, usd: 23.0, invoiceQty: 4 },
  { invCode: 'GCSP-CB01', msCode: '00118', qty: 5, usd: 35.0, invoiceQty: 5 },
  { invCode: 'GCSE18', msCode: '54478', qty: 2, usd: 36.0, invoiceQty: 2 },
  { invCode: 'GCSE16', msCode: '54489', qty: 2, usd: 36.0, invoiceQty: 2 },
  { invCode: 'GCCR41', msCode: '54479', qty: 2, usd: 2.0, invoiceQty: 2, support: true },
  { invCode: 'GCCR24', msCode: '00120', qty: 2, usd: 3.0, invoiceQty: 2, support: true },
  { invCode: 'GCEX02', msCode: '00135', qty: 4, usd: 2.0, invoiceQty: 4, support: true },
  { invCode: 'GCMA12', msCode: '54476', qty: 4, usd: 2.0, invoiceQty: 4, support: true },
  { invCode: 'GCHR21', msCode: '00121', qty: 100, usd: 3.0, invoiceQty: 100, support: true },
  { invCode: 'GMHR02', msCode: '54471', qty: 20, usd: 1.0, invoiceQty: 20, support: true },
  { invCode: 'GMBR15', msCode: '54469', qty: 50, usd: 1.0, invoiceQty: 50, derma: true },
  { invCode: 'GMBR07', msCode: '54493', qty: 100, usd: 0.1, invoiceQty: 100, derma: true },
  { invCode: 'GMBR09', msCode: '54490', qty: 100, usd: 0.1, invoiceQty: 100, derma: true },
  { invCode: 'GMBR10', msCode: '54491', qty: 100, usd: 0.1, invoiceQty: 100, derma: true },
  { invCode: 'GMBR11', msCode: '54492', qty: 100, usd: 0.1, invoiceQty: 100, derma: true },
  { invCode: 'GMBR32', msCode: '54494', qty: 100, usd: 0.1, invoiceQty: 100, derma: true },
  { invCode: 'GMBR29', msCode: '54495', qty: 200, usd: 0.1, invoiceQty: 200, derma: true },
  { invCode: 'HGBR01', msCode: '54496', qty: 100, usd: 0.1, invoiceQty: 100, derma: true },
  { invCode: 'GMBR13', msCode: '54486', qty: 20, usd: 0.1, invoiceQty: 20, derma: true },
  { invCode: 'GCST00', msCode: '54497', qty: 1, usd: 1.0, invoiceQty: 1, derma: true },
  { invCode: 'GCCL03', msCode: '00111', qty: 7, usd: 3.0, invoiceQty: 7, derma: true },
  { invCode: 'GCCR10', msCode: '54498', qty: 2, usd: 2.0, invoiceQty: 2, derma: true },
  { invCode: 'GCCR32', msCode: '00134', qty: 2, usd: 3.0, invoiceQty: 2, derma: true },
  { invCode: 'GCCR36', msCode: '54499', qty: 2, usd: 2.0, invoiceQty: 2, derma: true },
  { invCode: 'GCMA12', msCode: '54476', qty: 4, usd: 3.0, invoiceQty: 4, derma: true },
  { invCode: 'GCCR41', msCode: '54479', qty: 2, usd: 2.0, invoiceQty: 2, derma: true },
  { invCode: 'GCSE18', msCode: '54478', qty: 2, usd: 2.0, invoiceQty: 2, derma: true },
  { invCode: 'GCEX02', msCode: '00135', qty: 4, usd: 2.0, invoiceQty: 4, derma: true },
  { invCode: 'GCCR38', msCode: '54500', qty: 4, usd: 3.0, invoiceQty: 4, derma: true },
  { invCode: 'GCCR48', msCode: '54487', qty: 4, usd: 2.0, invoiceQty: 4, derma: true },
  { invCode: 'GCCR49', msCode: '54488', qty: 4, usd: 2.0, invoiceQty: 4, derma: true },
]

function assertInvoiceMath() {
  const invoiceQty = PO_LINES.reduce((s, l) => s + l.invoiceQty, 0)
  const paidUsd = PO_LINES.reduce((s, l) => s + l.usd * l.qty, 0)
  if (invoiceQty !== INVOICE.invoiceUnits) {
    throw new Error(`Invoice unit sum ${invoiceQty} != ${INVOICE.invoiceUnits}`)
  }
  if (Math.abs(paidUsd - INVOICE.usdTotal) > 0.001) {
    throw new Error(`USD sum ${paidUsd} != ${INVOICE.usdTotal}`)
  }
  if (PO_LINES.length !== 47) {
    throw new Error(`Expected 47 value-PDF lines, got ${PO_LINES.length}`)
  }
}

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

async function getProductByCode(code) {
  const data = await api('GET', `/entity/product?filter=code=${encodeURIComponent(code)}&limit=1`)
  if (data?.rows?.[0]) return data.rows[0]
  const archived = await api(
    'GET',
    `/entity/product?filter=code=${encodeURIComponent(code)};archived=true&limit=1`
  )
  return archived?.rows?.[0] || null
}

async function ensureNoDuplicatePo() {
  const existing = await api('GET', `/entity/purchaseorder?search=${encodeURIComponent(INVOICE.number)}&limit=20`)
  const dup = (existing.rows || []).find((r) => r.name === INVOICE.number)
  if (dup) {
    throw new Error(
      `PO "${INVOICE.number}" already exists (${dup.id}) https://online.moysklad.ru/app/#purchaseorder/edit?id=${dup.id}`
    )
  }
}

function buildProductPayload(def) {
  const buyMinor = usdToMinor(def.usdBuy)
  return {
    name: def.name,
    code: def.code,
    description: `${def.invCode} | ${INVOICE.ref} value invoice | buy USD ${def.usdBuy} → AED ${money(buyMinor)}`,
    buyPrice: { value: buyMinor, currency: currencyRef() },
    salePrices: salePrices(0, 0),
    vat: 5,
    effectiveVat: 5,
    uom: href('uom', UOM_PCS_ID),
    productFolder: href('productfolder', def.folder),
  }
}

async function createOrUpdateProducts() {
  console.log('\n  Products — create missing / update core buyPrice:')

  for (const def of NEW_PRODUCTS) {
    const existing = await getProductByCode(def.code)
    const buyMinor = usdToMinor(def.usdBuy)
    if (existing) {
      console.log(`    ${def.code} exists — leave as-is (${existing.name})`)
      continue
    }
    console.log(`    + CREATE ${def.code} ${def.name} buy ${money(buyMinor)} AED`)
    if (COMMIT) {
      const created = await api('POST', '/entity/product', buildProductPayload(def))
      console.log(`      id=${created.id}`)
    }
  }

  const seenCore = new Set()
  for (const row of PO_LINES) {
    if (!CORE_BUY_CODES.has(row.msCode) || seenCore.has(row.msCode)) continue
    seenCore.add(row.msCode)
    const p = await getProductByCode(row.msCode)
    if (!p) throw new Error(`Core product missing: ${row.msCode} (${row.invCode})`)
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
    let p = await getProductByCode(line.msCode)
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
  console.log('  MoySklad — DM GME 260810 value-invoice PO (no receive)')
  console.log('════════════════════════════════════════════════════════════════════')
  console.log(`  Mode : ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Source: Desktop/18082029/DM GME 260810_Shipping Invoice (value).pdf`)
  console.log(`  FX   : 1 USD = ${FX} AED`)
  console.log(`  ETA  : ${INVOICE.deliveryExpected} (this week, in transit)`)

  assertInvoiceMath()
  await ensureNoDuplicatePo()
  await createOrUpdateProducts()

  const lines = await resolvePoLines(!COMMIT)

  let totalMinor = 0
  let totalQty = 0
  let paidUsd = 0
  let invoiceQty = 0
  console.log('\n  PO lines:')
  for (const l of lines) {
    const lineMinor = l.priceMinor * l.qty
    totalMinor += lineMinor
    totalQty += l.qty
    paidUsd += l.usd * l.qty
    invoiceQty += l.invoiceQty
    const tag = l.derma ? 'derma' : l.support ? 'support' : `$${l.usd}`
    console.log(
      `    ${l.invCode.padEnd(10)} ${l.msCode} x${String(l.qty).padStart(4)}  ${tag.padStart(8)}  ${money(lineMinor).padStart(12)} AED${l.note ? '  ' + l.note : ''}`
    )
  }

  const usdDiff = Math.abs(paidUsd - INVOICE.usdTotal)
  console.log(`\n  Lines: ${lines.length} | invoice units: ${invoiceQty} | PO qty: ${totalQty}`)
  console.log(`  Invoice USD: $${INVOICE.usdTotal.toFixed(2)} | calc USD: $${paidUsd.toFixed(2)} | diff: $${usdDiff.toFixed(2)}`)
  console.log(`  PO sum: ${money(totalMinor)} AED  (USD × ${FX})`)
  if (usdDiff > 0.05) throw new Error(`USD total mismatch: expected ${INVOICE.usdTotal}, got ${paidUsd}`)
  if (invoiceQty !== INVOICE.invoiceUnits) {
    throw new Error(`Invoice units mismatch: ${invoiceQty} != ${INVOICE.invoiceUnits}`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit to create products + PO. No receive.')
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
      `Value invoice ${INVOICE.ref} dated ${INVOICE.dateIssued} — DTS MG → Genosys Middle East FZ-LLC`,
      `Source: Desktop/18082029/DM GME 260810_Shipping Invoice (value).pdf`,
      `FOB Incheon | T/T in advance | AWB ${INVOICE.awb} | BOE ${INVOICE.boe} | ${INVOICE.cpip}`,
      `Invoice USD $${INVOICE.usdTotal.toFixed(2)} / ${INVOICE.invoiceUnits} invoice units / ${totalQty} PO units | buy AED = USD × ${FX}`,
      `GCMA10 30 Box → 00140 ×300 sheets @ $0.98. GRFS050 → 00002 standard 0.50mm. GCFO02 beige @ $8.30 (value PDF, not $14 CSV).`,
      `New SKUs: 54490–54496 leaflets, 54497 trial kit, 54498 BB 2g×100, 54499 post cream 2g×100, 54500 USC 4g×50.`,
      `Reused: 54469 catalogue, 54486 bags, 00134 radiance cream samples (GCCR32). Duplicate invoice codes kept as separate PO lines.`,
      `PO only — do not receive until cargo is released.`,
      MARKER,
    ].join('\n'),
    positions: commitLines.map((l) => ({
      quantity: l.qty,
      price: l.priceMinor,
      assortment: href('product', l.productId),
      vat: 0,
      vatEnabled: false,
      inTransit: l.qty,
    })),
  })

  const verify = await api('GET', `/entity/purchaseorder/${created.id}`)
  const pos = await api('GET', `/entity/purchaseorder/${created.id}/positions?limit=100`)
  console.log(`\n  Created PO: ${verify.name} | ${money(verify.sum)} AED | ${pos.meta?.size} lines`)
  if (verify.sum !== totalMinor) {
    throw new Error(`Posted PO AED ${money(verify.sum)} != calc ${money(totalMinor)}`)
  }
  if (pos.meta?.size !== PO_LINES.length) {
    throw new Error(`Posted lines ${pos.meta?.size} != ${PO_LINES.length}`)
  }
  console.log(`  https://online.moysklad.ru/app/#purchaseorder/edit?id=${created.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
