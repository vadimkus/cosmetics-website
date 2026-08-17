#!/usr/bin/env node

/**
 * Korea PO DM GME 260710 — create supplier PO + receive into Genosys Warehouse.
 *
 * Source: docs/DM_GME_260710_Shipping_Invoice_normalized.csv
 *   Invoice USD 13,383.00 | AWB 176-6176-3914 | BOE 2026-07-24
 *
 * Stock-unit conversions (IMPORTANT):
 *   GCMA10 Sea Algae 15 Box → 00140 ×150 pcs (sheets) @ $9.8/10
 *   GCPS02 SWS 30 Box → 00020 ×300 ampules @ $21.3/10
 *   GCPS05 CTS 20 Box → 00069 ×200 ampules @ $21.3/10
 *
 *   node --import dotenv/config scripts/moysklad-create-po-dm-gme-260710-and-receive-20260726.js
 *   node --import dotenv/config scripts/moysklad-create-po-dm-gme-260710-and-receive-20260726.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const { uaeToday, uaeMomentNow } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const FX = 3.6725
const CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f'
const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const SUPPLIER_ID = '3a0a3f28-33cf-11ea-0a80-043f000b9859'

const INVOICE = {
  number: 'DM GME 260710',
  dateIssued: '2026-07-15',
  deliveryMoment: '2026-07-24 12:00:00',
  usdTotal: 13383.0,
  awb: '176-6176-3914',
  cpip: 'CPIP-240726-084798',
  packages: 14,
}

const MARKER = `DM-GME-260710-PO-RECEIVE-${uaeToday()}`

/**
 * qty = MoySklad stock units; usd = unit buy USD for that stock unit.
 * invoiceQty/invoiceUsd = original packing-list figures (for audit).
 */
const PO_LINES = [
  // Core (Montaji)
  { invCode: 'GCMR02', msCode: '54461', qty: 70, usd: 9.9, note: 'pcs' },
  {
    invCode: 'GCMA10',
    msCode: '00140',
    qty: 150,
    usd: 0.98,
    invoiceQty: 15,
    invoiceUsd: 9.8,
    note: '15 Box → 150 pcs (sheets) @ $9.8/10',
  },
  { invCode: 'GCMA14', msCode: '54467', qty: 90, usd: 11.5, note: 'mask packs' },
  {
    invCode: 'GCPS02',
    msCode: '00020',
    qty: 300,
    usd: 2.13,
    invoiceQty: 30,
    invoiceUsd: 21.3,
    note: '30 Box → 300 SWS ampules @ $21.3/10',
  },
  {
    invCode: 'GCPS05',
    msCode: '00069',
    qty: 200,
    usd: 2.13,
    invoiceQty: 20,
    invoiceUsd: 21.3,
    note: '20 Box → 200 CTS ampules @ $21.3/10',
  },
  { invCode: 'GCSE13', msCode: '00191', qty: 20, usd: 10.4 },
  { invCode: 'GCSE14', msCode: '00194', qty: 20, usd: 10.9 },
  { invCode: 'GCSE03', msCode: '00029', qty: 20, usd: 10.4 },
  { invCode: 'GCSE17', msCode: '00195', qty: 60, usd: 10.9 },
  { invCode: 'GCSE05', msCode: '00030', qty: 20, usd: 10.4 },
  { invCode: 'GCCR44', msCode: '00035', qty: 50, usd: 8.7 },
  { invCode: 'GCCR23', msCode: '00037', qty: 20, usd: 17.5 },
  { invCode: 'GCCR09', msCode: '00041', qty: 50, usd: 6.5 },
  { invCode: 'GCCR37', msCode: '54457', qty: 230, usd: 9.3 },
  { invCode: 'GCCR46', msCode: '54472', qty: 20, usd: 8.2 },
  { invCode: 'GCCR47', msCode: '54473', qty: 40, usd: 8.2 },
  { invCode: 'GCCR07', msCode: '00039', qty: 7, usd: 54.5, note: 'postcream 20g×12 box' },
  { invCode: 'GCFO02', msCode: '00144', qty: 100, usd: 14.0, note: 'cushion+refill beige' },
  { invCode: 'GCFO03', msCode: '54464', qty: 110, usd: 14.0, note: 'cushion+refill camel' },
  { invCode: 'GCHR18', msCode: '00048', qty: 25, usd: 26.9, note: 'hair solution pro box' },
  // Testers / samples / bags (invoice remainder)
  { invCode: 'GMAC05', msCode: '54486', qty: 300, usd: 0.4 },
  { invCode: 'GCCL03', msCode: '00111', qty: 5, usd: 35.0 },
  { invCode: 'GCCR42', msCode: '00112', qty: 4, usd: 25.0 },
  { invCode: 'GCCR48', msCode: '54487', qty: 4, usd: 40.0 },
  { invCode: 'GCCR49', msCode: '54488', qty: 4, usd: 40.0 },
  { invCode: 'GCCR20', msCode: '00114', qty: 2, usd: 34.0 },
  { invCode: 'GCCR22', msCode: '00116', qty: 4, usd: 23.0 },
  { invCode: 'GCSP-CB01', msCode: '00118', qty: 5, usd: 35.0 },
  { invCode: 'GCSE18', msCode: '54478', qty: 2, usd: 36.0 },
  { invCode: 'GCSE16', msCode: '54489', qty: 2, usd: 2.0 },
  { invCode: 'GCCR41', msCode: '54479', qty: 2, usd: 4.0 },
  { invCode: 'GCCR24', msCode: '00120', qty: 2, usd: 4.0 },
  { invCode: 'GCEX02', msCode: '00135', qty: 4, usd: 3.0 },
  { invCode: 'GCMA12', msCode: '54476', qty: 4, usd: 2.0 },
  { invCode: 'GCHR21', msCode: '00121', qty: 50, usd: 1.0 },
]

function usdToMinor(usd) {
  return Math.round(usd * FX * 100)
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

function href(type, id) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

function currencyRef() {
  return { meta: href('currency', CURRENCY_ID).meta }
}

async function api(method, pathStr, body, attempt = 1) {
  const url = pathStr.startsWith('http') ? pathStr : API + pathStr
  try {
    const res = await fetch(url, {
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
    if ((res.status === 429 || res.status >= 500) && attempt < 8) {
      await new Promise((r) => setTimeout(r, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    if (attempt < 5 && (e.cause?.code === 'ECONNRESET' || e.message === 'fetch failed')) {
      await new Promise((r) => setTimeout(r, 1500 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    throw e
  }
}

async function fetchAll(pathStr) {
  const rows = []
  let offset = 0
  while (true) {
    const sep = pathStr.includes('?') ? '&' : '?'
    const data = await api('GET', `${pathStr}${sep}limit=1000&offset=${offset}`)
    rows.push(...(data.rows || []))
    if ((data.rows || []).length < 1000) break
    offset += 1000
  }
  return rows
}

async function getProductByCode(code) {
  const data = await api('GET', `/entity/product?filter=code=${encodeURIComponent(code)}&limit=1`)
  if (data?.rows?.[0]) return data.rows[0]
  const archived = await api(
    'GET',
    `/entity/product?filter=code=${encodeURIComponent(code)};archived=true&limit=1`,
  )
  return archived?.rows?.[0] || null
}

async function ensureNoDuplicatePo() {
  const existing = await api(
    'GET',
    `/entity/purchaseorder?search=${encodeURIComponent(INVOICE.number)}&limit=10`,
  )
  const dup = (existing.rows || []).find((r) => r.name === INVOICE.number)
  if (dup) {
    throw new Error(
      `PO "${INVOICE.number}" already exists (${dup.id}) https://online.moysklad.ru/app/#purchaseorder/edit?id=${dup.id}`,
    )
  }
}

async function resolveLines() {
  const resolved = []
  let usdSum = 0
  let qtySum = 0
  console.log('\n  PO lines (stock units):')
  for (const line of PO_LINES) {
    const p = await getProductByCode(line.msCode)
    if (!p) throw new Error(`Missing product ${line.msCode} for ${line.invCode}`)
    if (p.archived) throw new Error(`Product ${line.msCode} is archived`)
    const priceMinor = usdToMinor(line.usd)
    const lineMinor = priceMinor * line.qty
    usdSum += line.usd * line.qty
    qtySum += line.qty
    const oldBuy = (p.buyPrice?.value || 0) / 100
    console.log(
      `    ${line.invCode.padEnd(10)} ${line.msCode} x${String(line.qty).padStart(4)} @ $${line.usd.toFixed(2).padStart(6)} → ${money(lineMinor).padStart(10)} AED | buy was ${oldBuy}${line.note ? ' | ' + line.note : ''}`,
    )
    resolved.push({ ...line, productId: p.id, name: p.name, priceMinor, productMeta: p.meta })
  }
  const usdDiff = Math.abs(usdSum - INVOICE.usdTotal)
  console.log(`\n  Lines: ${resolved.length} | qty: ${qtySum} | USD calc: $${usdSum.toFixed(2)} | invoice: $${INVOICE.usdTotal.toFixed(2)} | diff $${usdDiff.toFixed(2)}`)
  if (usdDiff > 0.05) throw new Error(`USD total mismatch: expected ${INVOICE.usdTotal}, got ${usdSum}`)
  return { resolved, usdSum, qtySum }
}

async function updateBuyPrices(resolved) {
  console.log('\n  Updating buyPrice from this invoice:')
  for (const line of resolved) {
    const buyMinor = line.priceMinor
    const p = await getProductByCode(line.msCode)
    const old = p.buyPrice?.value ?? 0
    if (old === buyMinor) {
      console.log(`    ${line.msCode} unchanged ${money(buyMinor)}`)
      continue
    }
    console.log(`    ${line.msCode} ${money(old)} → ${money(buyMinor)} AED`)
    if (COMMIT) {
      await api('PUT', `/entity/product/${p.id}`, {
        meta: p.meta,
        buyPrice: { value: buyMinor, currency: currencyRef() },
      })
    }
  }
}

async function createPo(resolved) {
  const created = await api('POST', '/entity/purchaseorder', {
    name: INVOICE.number,
    moment: `${INVOICE.dateIssued} 00:00:00`,
    deliveryPlannedMoment: INVOICE.deliveryMoment,
    applicable: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', SUPPLIER_ID),
    store: href('store', STORE_ID),
    description: [
      `Shipping invoice ${INVOICE.number} dated ${INVOICE.dateIssued} — DTS MG → Genosys Middle East FZ-LLC`,
      `AWB ${INVOICE.awb} | ${INVOICE.packages} cartons | ${INVOICE.cpip}`,
      `Source: Desktop/16072026 + docs/DM_GME_260710_Shipping_Invoice_normalized.csv`,
      `Invoice USD $${INVOICE.usdTotal.toFixed(2)} | FX ${FX} | VAT off (import)`,
      'CONVERSIONS: GCMA10 15 Box→150 pcs 00140; GCPS02 30 Box→300 amp 00020; GCPS05 20 Box→200 amp 00069.',
      MARKER,
    ].join('\n'),
    positions: resolved.map((l) => ({
      quantity: l.qty,
      price: l.priceMinor,
      assortment: href('product', l.productId),
      vat: 0,
      vatEnabled: false,
    })),
  })
  return created
}

async function receiveSupply(po) {
  const pos = await fetchAll(`/entity/purchaseorder/${po.id}/positions?expand=assortment`)
  const supplyPositions = pos.map((p) => ({
    quantity: p.quantity,
    price: p.price,
    assortment: { meta: p.assortment.meta },
    vat: 0,
    vatEnabled: false,
  }))

  const supply = await api('POST', '/entity/supply', {
    moment: INVOICE.deliveryMoment,
    applicable: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', SUPPLIER_ID),
    store: href('store', STORE_ID),
    purchaseOrder: href('purchaseorder', po.id),
    description: [
      MARKER,
      `Receive ${INVOICE.number} into Genosys Warehouse`,
      `AWB ${INVOICE.awb} | BOE cleared 2026-07-24 | ${INVOICE.cpip}`,
    ].join(' | '),
    positions: supplyPositions,
  })
  return supply
}

async function main() {
  console.log('====================================================================')
  console.log('  Korea DM GME 260710 — PO + receive into stock')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log('  Conversions: Sea Algae → 150 pcs | SWS → 300 amp | CTS → 200 amp')

  await ensureNoDuplicatePo()
  const { resolved, qtySum } = await resolveLines()
  await updateBuyPrices(resolved)

  const expectedAedMinor = resolved.reduce((s, l) => s + l.priceMinor * l.qty, 0)
  console.log(`  Expected PO AED: ${money(expectedAedMinor)}`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const po = await createPo(resolved)
  console.log(`\n  PO: ${po.name} | ${money(po.sum)} AED | ${qtySum} units`)
  console.log(`  https://online.moysklad.ru/app/#purchaseorder/edit?id=${po.id}`)

  if (Math.abs((po.sum || 0) - expectedAedMinor) > 2) {
    throw new Error(`PO sum ${money(po.sum)} != expected ${money(expectedAedMinor)} — abort receive`)
  }

  const supply = await receiveSupply(po)
  console.log(`  Supply: ${supply.name} | ${money(supply.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#supply/edit?id=${supply.id}`)

  const poAfter = await api('GET', `/entity/purchaseorder/${po.id}`)
  console.log(`\n  PO receivedSum: ${money(poAfter.shippedSum || poAfter.receivedSum || 0)} / ${money(poAfter.sum)}`)
  // MoySklad uses different field names; print both
  console.log(`  PO fields: shippedSum=${money(poAfter.shippedSum)} invoicedSum=${money(poAfter.invoicedSum)}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
