#!/usr/bin/env node

/**
 * Miss Olga Pershay — SO → invoice → shipment @ genosys.ae retail.
 *
 *   Revita Glow BB #02 Natural 50g (54473) ×1 @ 250 AED
 *   Skin Caring Blemish Balm Cushion #2 Beige (00144) ×1 @ 300 AED
 *
 *   node --import dotenv/config scripts/moysklad-create-olga-pershay-blemish-cushion-order-invoice-demand-20260617.js
 *   node --import dotenv/config scripts/moysklad-create-olga-pershay-blemish-cushion-order-invoice-demand-20260617.js --commit
 *   node --import dotenv/config scripts/moysklad-create-olga-pershay-blemish-cushion-order-invoice-demand-20260617.js --fix-lines --commit
 */

const fs = require('fs')
const path = require('path')
const os = require('os')

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const { uaeToday, uaeMomentNow, uaeMomentAddMinutes, uaeShortDate } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')
const FIX_LINES = process.argv.includes('--fix-lines')

const EXISTING_DOCS = {
  customerOrderId: 'fb91bd06-6a40-11f1-0a80-0be40018d551',
  invoiceOutId: 'fbddd513-6a40-11f1-0a80-10040018f354',
  demandId: 'fc7abde4-6a40-11f1-0a80-00a90019d6a6',
}

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'

const STATE_NEW_ORDER_ID = 'e1a0abf2-33c5-11ea-0a80-043f000b275a'
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const INVOICE_STATE_ISSUED_ID = 'a9609013-84d0-11ea-0a80-0453000aecd1'
const INVOICE_RETAIL_PRINT_TEMPLATE_ID = 'b2cde0a1-ec18-4ea5-ac56-813a26308f10'

const AGENT_ID = '9a35428d-6c20-11ef-0a80-1112000787c0' // Miss Olga Pershay

const ORDER = {
  name: `GENCardM${uaeShortDate()}7315`,
  moment: uaeMomentNow(),
  marker: `Olga Pershay Revita Glow Natural beige cushion retail ${uaeToday()}`,
}

/** [code, qty, retailAed] — genosys.ae list prices */
const PRODUCT_LINES = [
  ['54473', 1, 250], // Revita Glow BB #02 Natural 50g
  ['00144', 1, 300], // Skin Caring Blemish Balm Cushion #2 Beige
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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
  return text ? JSON.parse(text) : null
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

function href(type, id) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

function stateHref(entityType, stateId) {
  return {
    meta: {
      href: `${API}/entity/${entityType}/metadata/states/${stateId}`,
      type: 'state',
      mediaType: 'application/json',
    },
  }
}

function countryHref() {
  return href('country', COUNTRY_UAE_ID)
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

async function fetchStockByCode() {
  const rows = await fetchAll('/report/stock/all?stockMode=all&stockMoreThan=-1')
  const stock = new Map()
  for (const row of rows) {
    if (!row.code) continue
    stock.set(row.code, {
      id: row.meta?.href?.split('/').pop()?.split('?')[0],
      code: row.code,
      name: row.name,
      available: Number(row.stock || 0) - Number(row.reserve || 0),
      price: Number(row.salePrice || 0),
    })
  }
  return stock
}

function buildShipmentAddress(agent) {
  const full = agent.actualAddressFull
  if (full?.country?.meta?.href && full.city && full.street) {
    return { country: { meta: full.country.meta }, city: full.city, street: full.street }
  }
  const addInfo = full?.addInfo || agent.actualAddress?.addInfo || ''
  return { country: countryHref(), city: 'Dubai', street: addInfo || 'UAE — Miss Olga Pershay' }
}

async function ensureOrderNameFree() {
  const existing = await api(
    'GET',
    `/entity/customerorder?filter=name=${encodeURIComponent(ORDER.name)}&limit=1`
  )
  if (existing?.rows?.length) throw new Error(`Order name already taken: ${ORDER.name}`)
}

async function ensureNoDuplicateToday(agentId) {
  const date = ORDER.moment.slice(0, 10)
  const filter = [
    `agent=${API}/entity/counterparty/${agentId}`,
    `moment>=${date} 00:00:00`,
    `moment<=${date} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/customerorder?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(ORDER.marker))
  if (dup) throw new Error(`Duplicate: order ${dup.name} (${dup.id})`)
}

function buildPositions(stock) {
  const positions = []
  let sumMinor = 0
  for (const [code, qty, retailAed] of PRODUCT_LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient stock ${code}: need ${qty}, have ${item.available}`)
    }
    const priceMinor = Math.round(retailAed * 100)
    sumMinor += priceMinor * qty
    positions.push({
      quantity: qty,
      price: priceMinor,
      discount: 0,
      assortment: href('product', item.id),
      vat: 5,
      vatEnabled: true,
    })
  }
  return { positions, sumMinor }
}

function positionFingerprint(rows) {
  return rows
    .map((p) => `${p.assortment?.code || p.assortment?.meta?.type}:${p.quantity}:${p.price}`)
    .sort()
    .join('|')
}

function positionPayloadFromRow(p) {
  return {
    quantity: p.quantity,
    price: p.price,
    discount: p.discount || 0,
    assortment: { meta: p.assortment.meta },
    vat: p.vat,
    vatEnabled: p.vatEnabled,
  }
}

async function syncDocPositionsFromInvoice(docType, docId, invoiceRows, label) {
  let doc = await api('GET', `/entity/${docType}/${docId}`)
  const wasApplicable = doc.applicable
  if (wasApplicable) {
    doc = await api('PUT', `/entity/${docType}/${docId}`, { meta: doc.meta, applicable: false })
  }

  let rows = await fetchAll(`/entity/${docType}/${docId}/positions?expand=assortment`)
  const invByCode = new Map(invoiceRows.map((p) => [p.assortment.code, p]))
  for (const p of rows) {
    if (!invByCode.has(p.assortment?.code)) {
      await api('DELETE', `/entity/${docType}/${docId}/positions/${p.id}`)
      console.log(`    ${label}: deleted ${p.assortment?.code}`)
    }
  }

  rows = await fetchAll(`/entity/${docType}/${docId}/positions?expand=assortment`)
  for (const invP of invoiceRows) {
    const code = invP.assortment.code
    const cur = rows.find((p) => p.assortment?.code === code)
    const payload = positionPayloadFromRow(invP)
    if (!cur) {
      await api('POST', `/entity/${docType}/${docId}/positions`, payload)
      console.log(`    ${label}: added ${code} x${invP.quantity} @ ${money(invP.price)}`)
    } else if (cur.quantity !== invP.quantity || cur.price !== invP.price) {
      await api('PUT', `/entity/${docType}/${docId}/positions/${cur.id}`, {
        meta: cur.meta,
        ...payload,
      })
      console.log(
        `    ${label}: updated ${code} qty ${cur.quantity}→${invP.quantity}, price ${money(cur.price)}→${money(invP.price)}`
      )
    }
  }

  doc = await api('GET', `/entity/${docType}/${docId}`)
  await api('PUT', `/entity/${docType}/${docId}`, {
    meta: doc.meta,
    applicable: wasApplicable,
    vatEnabled: doc.vatEnabled,
    vatIncluded: doc.vatIncluded,
  })
}

async function replaceInvoiceLines(stock) {
  const { positions } = buildPositions(stock)
  const { invoiceOutId, customerOrderId, demandId } = EXISTING_DOCS

  console.log('  Replacing invoice 04690 lines...')
  let invoice = await api('GET', `/entity/invoiceout/${invoiceOutId}`)
  if (invoice.applicable) {
    invoice = await api('PUT', `/entity/invoiceout/${invoiceOutId}`, {
      meta: invoice.meta,
      applicable: false,
    })
  }

  const oldRows = await fetchAll(`/entity/invoiceout/${invoiceOutId}/positions?expand=assortment`)
  for (const p of oldRows) {
    await api('DELETE', `/entity/invoiceout/${invoiceOutId}/positions/${p.id}`)
    console.log(`    invoice: deleted ${p.assortment?.code}`)
  }

  for (const pos of positions) {
    await api('POST', `/entity/invoiceout/${invoiceOutId}/positions`, pos)
  }

  invoice = await api('GET', `/entity/invoiceout/${invoiceOutId}`)
  await api('PUT', `/entity/invoiceout/${invoiceOutId}`, {
    meta: invoice.meta,
    applicable: true,
    description: [
      'Invoice for GENCardM2606177315',
      '54473 Revita Glow Natural x1 @ 250; 00144 cushion #2 beige x1 @ 300 (retail).',
    ].join(' | '),
  })

  const invoiceRows = await fetchAll(`/entity/invoiceout/${invoiceOutId}/positions?expand=assortment`)
  await syncDocPositionsFromInvoice('customerorder', customerOrderId, invoiceRows, 'SO')
  await syncDocPositionsFromInvoice('demand', demandId, invoiceRows, 'Shipment')

  const order = await api('GET', `/entity/customerorder/${customerOrderId}`)
  const inv = await api('GET', `/entity/invoiceout/${invoiceOutId}`)
  const demand = await api('GET', `/entity/demand/${demandId}`)
  const orderPos = await fetchAll(`/entity/customerorder/${customerOrderId}/positions?expand=assortment`)
  const demandPos = await fetchAll(`/entity/demand/${demandId}/positions?expand=assortment`)

  console.log(`\n  Sums — SO ${money(order.sum)} | invoice ${money(inv.sum)} | shipment ${money(demand.sum)} AED`)
  for (const [label, rows] of [
    ['Invoice', invoiceRows],
    ['SO', orderPos],
    ['Shipment', demandPos],
  ]) {
    console.log(`  ${label} lines:`)
    for (const p of rows) {
      console.log(`    ${p.assortment?.code} x${p.quantity} @ ${money(p.price)} AED`)
    }
  }

  const match =
    positionFingerprint(orderPos) === positionFingerprint(invoiceRows) &&
    positionFingerprint(invoiceRows) === positionFingerprint(demandPos) &&
    order.sum === inv.sum &&
    inv.sum === demand.sum
  if (!match) throw new Error('Verification failed — SO / invoice / shipment differ')

  console.log('  Verification OK.')
  return inv
}

async function fixExistingLines() {
  console.log('====================================================================')
  console.log('  Miss Olga Pershay — amend lines to retail (04690 / 06374)')
  console.log('====================================================================')

  const stock = await fetchStockByCode()
  console.log('\n  Target lines:')
  for (const [code, qty, retailAed] of PRODUCT_LINES) {
    const item = stock.get(code)
    console.log(`    ${code} ${item.name} x${qty} @ ${retailAed.toFixed(2)} AED (retail)`)
  }
  console.log(`  Expected total: ${(250 + 300).toFixed(2)} AED VAT-incl.`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --fix-lines --commit')
    return
  }

  const invoice = await replaceInvoiceLines(stock)

  console.log('\n  Exporting invoice PDF...')
  const pdfBuf = await exportInvoicePdf(invoice.id)
  if (pdfBuf) {
    const outPath = ordersPdfPath(invoice.name)
    fs.writeFileSync(outPath, pdfBuf)
    console.log(`    Saved: ${outPath} (${pdfBuf.length} bytes)`)
  }
}

async function exportInvoicePdf(invoiceId) {
  const body = {
    template: {
      meta: {
        href: `${API}/entity/invoiceout/metadata/customtemplate/${INVOICE_RETAIL_PRINT_TEMPLATE_ID}`,
        type: 'customtemplate',
        mediaType: 'application/json',
      },
    },
    extension: 'pdf',
  }
  const res = await fetch(`${API}/entity/invoiceout/${invoiceId}/export`, {
    method: 'POST',
    headers: {
      Authorization: AUTH,
      Accept: '*/*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    redirect: 'manual',
  })
  if (res.status === 412) return null
  if (res.status !== 303 && res.status !== 302) {
    const t = await res.text()
    throw new Error(`Invoice export expected 302/303, got ${res.status}: ${t.slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export response missing Location header')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  return Buffer.from(await pdfRes.arrayBuffer())
}

function ordersPdfPath(invoiceName) {
  const safe = String(invoiceName || 'invoice').replace(/[^\w.-]+/g, '_')
  const ordersDir = path.join(os.homedir(), 'Desktop', 'orders')
  fs.mkdirSync(ordersDir, { recursive: true })
  return path.join(ordersDir, `GENOSYS_Olga_Pershay_${safe}.pdf`)
}

async function main() {
  if (FIX_LINES) {
    if (!COMMIT) {
      await fixExistingLines()
      return
    }
    await fixExistingLines()
    return
  }

  console.log('====================================================================')
  console.log('  Miss Olga Pershay — SO → invoice → shipment')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  console.log(`  Counterparty: ${agent.name} (${agent.phone || '—'})`)

  await ensureOrderNameFree()
  if (COMMIT) await ensureNoDuplicateToday(agent.id)

  const stock = await fetchStockByCode()
  const { positions, sumMinor } = buildPositions(stock)
  const shipmentAddressFull = buildShipmentAddress(agent)

  console.log(`\n  Order: ${ORDER.name}`)
  for (const [code, qty, retailAed] of PRODUCT_LINES) {
    const item = stock.get(code)
    console.log(`    ${code} ${item.name} x${qty} @ ${retailAed.toFixed(2)} AED (retail)`)
  }
  console.log(`  Total: ${money(sumMinor)} AED VAT-incl.`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const t0 = ORDER.moment
  const t1 = uaeMomentAddMinutes(1)
  const t2 = uaeMomentAddMinutes(3)

  const order = await api('POST', '/entity/customerorder', {
    name: ORDER.name,
    moment: t0,
    description: [
      ORDER.marker,
      '54473 Revita Glow Natural x1 @ 250; 00144 cushion #2 beige x1 @ 300 (retail).',
      'Chain: invoice → shipment.',
    ].join(' | '),
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    store: href('store', STORE_ID),
    state: stateHref('customerorder', STATE_NEW_ORDER_ID),
    vatEnabled: true,
    vatIncluded: true,
    rate: { currency: href('currency', CURRENCY_ID) },
    shipmentAddressFull,
    positions,
  })
  console.log(`\n  1) Order: ${order.name} | ${money(order.sum)} AED`)
  console.log(`     https://online.moysklad.ru/app/#customerorder/edit?id=${order.id}`)

  let invoice
  try {
    invoice = await api('POST', '/entity/invoiceout', {
      moment: t1,
      applicable: true,
      shared: true,
      vatEnabled: true,
      vatIncluded: true,
      organization: href('organization', ORG_ID),
      agent: href('counterparty', agent.id),
      customerOrder: href('customerorder', order.id),
      rate: { currency: href('currency', CURRENCY_ID) },
      shipmentAddressFull,
      description: `Invoice for ${ORDER.name} | ${ORDER.marker}`,
      positions,
    })
  } catch {
    invoice = await api('POST', '/entity/invoiceout', {
      moment: t1,
      applicable: true,
      shared: true,
      vatEnabled: true,
      vatIncluded: true,
      organization: href('organization', ORG_ID),
      agent: href('counterparty', agent.id),
      customerOrder: href('customerorder', order.id),
      rate: { currency: href('currency', CURRENCY_ID) },
      shipmentAddressFull,
      description: `Invoice for ${ORDER.name} | ${ORDER.marker}`,
    })
  }

  await api('PUT', `/entity/invoiceout/${invoice.id}`, {
    meta: invoice.meta,
    state: stateHref('invoiceout', INVOICE_STATE_ISSUED_ID),
  }).catch(() => {})

  console.log(`  2) Invoice: ${invoice.name} | ${money(invoice.sum)} AED`)
  console.log(`     https://online.moysklad.ru/app/#invoiceout/edit?id=${invoice.id}`)

  const invPositions = await fetchAll(`/entity/invoiceout/${invoice.id}/positions`)
  const demandPositions = invPositions.map((p) => ({
    quantity: p.quantity,
    price: p.price,
    discount: p.discount || 0,
    assortment: p.assortment,
    vat: p.vat,
    vatEnabled: p.vatEnabled,
  }))

  const demand = await api('POST', '/entity/demand', {
    moment: t2,
    applicable: true,
    shared: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    store: href('store', STORE_ID),
    invoicesOut: [href('invoiceout', invoice.id)],
    state: stateHref('demand', STATE_DEMAND_SHIPPED_ID),
    shipmentAddressFull,
    description: `Shipment for ${invoice.name} / ${ORDER.name} | ${ORDER.marker}`,
    positions: demandPositions,
  })
  console.log(`  3) Shipment: ${demand.name} | ${money(demand.sum)} AED`)
  console.log(`     https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)

  console.log('\n  Exporting invoice PDF...')
  const pdfBuf = await exportInvoicePdf(invoice.id)
  if (pdfBuf) {
    const outPath = ordersPdfPath(invoice.name)
    fs.writeFileSync(outPath, pdfBuf)
    console.log(`    Saved: ${outPath} (${pdfBuf.length} bytes)`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
