#!/usr/bin/env node

/**
 * Brau Ladies Salon LLC — 2× SO → invoice → shipment (unpaid, clinic list).
 *
 *   Peptide Gel Mask box = 00012 ×5 sheets.
 *   1) BRAU ABU DHABI — 4 boxes (00012 ×20 @ 38) + Hydro Cool 00013 ×1 @ 300 = 1,060
 *   2) BRAU DIFC      — 2 boxes (00012 ×10 @ 38) + Hydro Cool 00013 ×1 @ 300 = 680
 *
 *   node --import dotenv/config scripts/moysklad-create-brau-ad-difc-peptide-hydro-20260825.js
 *   node --import dotenv/config scripts/moysklad-create-brau-ad-difc-peptide-hydro-20260825.js --commit
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

const { uaeToday, uaeMomentAddMinutes, uaeShortDate } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'
const STATE_DELIVERED_AWAIT_PAY_ID = 'e1a0af19-33c5-11ea-0a80-043f000b2760'
const DEMAND_STATE_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const INVOICE_STATE_ISSUED_ID = 'a9609013-84d0-11ea-0a80-0453000aecd1'
const INVOICE_LEGAL_TAX_TEMPLATE_ID = '5e56cd7d-ce85-4db5-8771-d7531f9ffd71'
const AGENT_ID = 'ce7c406d-dadf-11ee-0a80-130f00597aa2'

const PRICE = { '00012': 38, '00013': 300 }

const ORDERS = [
  {
    mark: 'BRAU ABU DHABI',
    nameSuffix: 'BRAUADU',
    marker: `BRAU-ABU-DHABI-P4B-HC-${uaeToday()}`,
    pdfTag: 'Brau_Abu_Dhabi',
    city: 'Abu Dhabi',
    street: 'Brau Ladies Salon LLC — BRAU ABU DHABI',
    boxes: 4,
    lines: [
      ['00012', 20],
      ['00013', 1],
    ],
    expectedMinor: 106000,
  },
  {
    mark: 'BRAU DIFC',
    nameSuffix: 'BRAUDIFC',
    marker: `BRAU-DIFC-P2B-HC-${uaeToday()}`,
    pdfTag: 'Brau_DIFC',
    city: 'Dubai',
    street: 'Brau Ladies Salon LLC — BRAU DIFC',
    boxes: 2,
    lines: [
      ['00012', 10],
      ['00013', 1],
    ],
    expectedMinor: 68000,
  },
]

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
    if (attempt < 5 && (e.message === 'fetch failed' || e.cause?.code === 'ECONNRESET')) {
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

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

async function fetchAssortmentByCode(code) {
  const d = await api('GET', `/entity/assortment?filter=code=${encodeURIComponent(code)}&limit=5&stockMode=all`)
  const row = (d.rows || []).find((r) => r.code === code && !r.archived)
  if (!row?.id) throw new Error(`Unknown code: ${code}`)
  return {
    id: row.id,
    name: row.name,
    available: Number(row.stock || 0) - Number(row.reserve || 0),
  }
}

function shipmentAddress(orderDef) {
  return {
    country: href('country', COUNTRY_UAE_ID),
    city: orderDef.city,
    street: orderDef.street,
    addInfo: '',
  }
}

async function ensureOrderNameFree(name) {
  const existing = await api(
    'GET',
    `/entity/customerorder?filter=name=${encodeURIComponent(name)}&limit=1`
  )
  if (existing?.rows?.length) throw new Error(`Order name already taken: ${name}`)
}

async function ensureNoDuplicate(marker, agentId) {
  const filter = [
    `agent=${API}/entity/counterparty/${agentId}`,
    `moment>=${uaeToday()} 00:00:00`,
    `moment<=${uaeToday()} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/customerorder?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(marker))
  if (dup) throw new Error(`Duplicate: order ${dup.name} (${dup.id})`)
}

async function exportInvoicePdf(invoiceId) {
  const body = {
    template: {
      meta: {
        href: `${API}/entity/invoiceout/metadata/customtemplate/${INVOICE_LEGAL_TAX_TEMPLATE_ID}`,
        type: 'customtemplate',
        mediaType: 'application/json',
      },
    },
    extension: 'pdf',
  }
  const res = await fetch(`${API}/entity/invoiceout/${invoiceId}/export`, {
    method: 'POST',
    headers: { Authorization: AUTH, Accept: '*/*', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    redirect: 'manual',
  })
  if (res.status === 412) return null
  if (res.status !== 303 && res.status !== 302) {
    throw new Error(`Invoice export ${res.status}: ${(await res.text()).slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  return Buffer.from(await pdfRes.arrayBuffer())
}

function buildPositions(items, lines) {
  return lines.map(([code, qty]) => ({
    quantity: qty,
    price: Math.round(PRICE[code] * 100),
    discount: 0,
    assortment: href('product', items[code].id),
    vat: 5,
    vatEnabled: true,
  }))
}

async function runCycle(orderDef, idx, items, agent) {
  const name = `GENCardM${uaeShortDate()}${orderDef.nameSuffix}`
  const positions = buildPositions(items, orderDef.lines)
  const sumMinor = orderDef.lines.reduce((s, [code, qty]) => s + Math.round(PRICE[code] * 100) * qty, 0)
  const shipmentAddressFull = shipmentAddress(orderDef)

  console.log(`\n────────────────────────────────────────────────────────────`)
  console.log(`  Mark: ${orderDef.mark}`)
  console.log(`  Order: ${name}`)
  for (const [code, qty] of orderDef.lines) {
    const note = code === '00012' ? ` (${orderDef.boxes} boxes ×5)` : ' (1 pack)'
    console.log(`    ${code} ${items[code].name} x${qty} @ ${PRICE[code]}${note} (avail ${items[code].available})`)
  }
  console.log(`  Ship: ${shipmentAddressFull.street}, ${shipmentAddressFull.city}`)
  console.log(`  Total: ${money(sumMinor)} AED unpaid`)

  if (sumMinor !== orderDef.expectedMinor) {
    throw new Error(`Sum ${money(sumMinor)} ≠ expected ${money(orderDef.expectedMinor)}`)
  }

  await ensureOrderNameFree(name)
  if (!COMMIT) return { name, sumMinor, mark: orderDef.mark }

  await ensureNoDuplicate(orderDef.marker, agent.id)

  const t0 = uaeMomentAddMinutes(idx * 10)
  const t1 = uaeMomentAddMinutes(idx * 10 + 1)
  const t2 = uaeMomentAddMinutes(idx * 10 + 3)

  const order = await api('POST', '/entity/customerorder', {
    name,
    moment: t0,
    description: [
      orderDef.mark,
      orderDef.marker,
      `Peptide Gel Mask 00012 x${orderDef.lines[0][1]} (${orderDef.boxes} boxes) @38; Hydro Cool 00013 x1 @300.`,
      'Chain: invoice → shipment. Unpaid.',
    ].join(' | '),
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    store: href('store', STORE_ID),
    state: stateHref('customerorder', STATE_DELIVERED_AWAIT_PAY_ID),
    vatEnabled: true,
    vatIncluded: true,
    rate: { currency: href('currency', CURRENCY_ID) },
    shipmentAddressFull,
    positions,
  })
  console.log(`  1) Order: ${order.name} | ${money(order.sum)} AED`)

  const invoice = await api('POST', '/entity/invoiceout', {
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
    description: `${orderDef.mark} | Invoice for ${name} | ${orderDef.marker}`,
    positions,
  })
  await api('PUT', `/entity/invoiceout/${invoice.id}`, {
    meta: invoice.meta,
    state: stateHref('invoiceout', INVOICE_STATE_ISSUED_ID),
  }).catch(() => {})
  console.log(`  2) Invoice: ${invoice.name} | ${money(invoice.sum)} AED`)

  const invPositions = await fetchAll(`/entity/invoiceout/${invoice.id}/positions`)
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
    state: stateHref('demand', DEMAND_STATE_SHIPPED_ID),
    shipmentAddressFull,
    description: `${orderDef.mark} | Shipment for ${invoice.name} / ${name} | ${orderDef.marker}`,
    positions: invPositions.map((p) => ({
      quantity: p.quantity,
      price: p.price,
      discount: p.discount || 0,
      assortment: p.assortment,
      vat: p.vat,
      vatEnabled: p.vatEnabled,
    })),
  })
  if (demand.customerOrder) throw new Error('Demand has customerOrder — recreate invoice-only')
  console.log(`  3) Shipment: ${demand.name} | ${money(demand.sum)} AED`)

  if (order.sum !== sumMinor || invoice.sum !== sumMinor || demand.sum !== sumMinor) {
    throw new Error(`Posted sum mismatch ${orderDef.mark}`)
  }

  const pdfBuf = await exportInvoicePdf(invoice.id)
  if (!pdfBuf) throw new Error('Invoice PDF export returned null (412)')
  const ordersDir = path.join(os.homedir(), 'Desktop', 'orders')
  fs.mkdirSync(ordersDir, { recursive: true })
  const safeInv = String(invoice.name).replace(/[^\w.-]+/g, '_')
  const outPath = path.join(ordersDir, `GENOSYS_Brau_Ladies_${orderDef.pdfTag}_${safeInv}.pdf`)
  fs.writeFileSync(outPath, pdfBuf)
  console.log(`  PDF: ${outPath}`)

  return {
    mark: orderDef.mark,
    name,
    invoice: invoice.name,
    demand: demand.name,
    invoiceId: invoice.id,
    demandId: demand.id,
    orderId: order.id,
    sumMinor,
    pdf: outPath,
  }
}

async function main() {
  console.log('====================================================================')
  console.log('  Brau Ladies — ADU 4 boxes + HC | DIFC 2 boxes + HC')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  console.log(`  Customer: ${agent.name}`)

  const items = {
    '00012': await fetchAssortmentByCode('00012'),
    '00013': await fetchAssortmentByCode('00013'),
  }
  const need12 = ORDERS.reduce((s, o) => s + o.lines.find((l) => l[0] === '00012')[1], 0)
  const need13 = ORDERS.length
  console.log(`  Stock 00012: avail ${items['00012'].available} (need ${need12})`)
  console.log(`  Stock 00013: avail ${items['00013'].available} (need ${need13})`)
  if (items['00012'].available < need12 || items['00013'].available < need13) {
    console.log('  WARN stock short — posting anyway')
  }

  const results = []
  for (let i = 0; i < ORDERS.length; i++) {
    results.push(await runCycle(ORDERS[i], i, items, agent))
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  console.log('\n====================================================================')
  console.log('  SUMMARY')
  for (const r of results) {
    console.log(`  ${r.mark}: SO ${r.name} | inv ${r.invoice} | ship ${r.demand} | ${money(r.sumMinor)}`)
    console.log(`    ${r.pdf}`)
    console.log(`    https://online.moysklad.ru/app/#invoiceout/edit?id=${r.invoiceId}`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
