#!/usr/bin/env node

/**
 * Brau Ladies Salon LLC — 3× SO → invoice → shipment @ clinic 38.
 *
 *   1) Abu Dhabi     — Peptide Gel Mask 00012 ×40 = 1,520 AED
 *   2) Brau Jumeirah — Peptide Gel Mask 00012 ×20 =   760 AED
 *   3) Brau Springs  — Peptide Gel Mask 00012 ×10 =   380 AED
 *
 *   node --import dotenv/config scripts/moysklad-create-brau-peptide-three-invoices-20260901.js
 *   node --import dotenv/config scripts/moysklad-create-brau-peptide-three-invoices-20260901.js --commit
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
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

const AGENT_ID = 'ce7c406d-dadf-11ee-0a80-130f00597aa2'
const CLINIC_AED = 38

const ORDERS = [
  {
    comment: 'Abu dhabi',
    nameSuffix: 'BRAUADUP40',
    marker: `BRAU-PEPTIDE-ADU-P40-${uaeToday()}`,
    pdfTag: 'Brau_Abu_Dhabi',
    qty: 40,
    city: 'Abu Dhabi',
    street: 'Brau Ladies Salon LLC — Brau Abu Dhabi',
    expectedMinor: 152000,
  },
  {
    comment: 'Brau Jumeirah',
    nameSuffix: 'BRAUJBRP20',
    marker: `BRAU-PEPTIDE-JBR-P20-${uaeToday()}`,
    pdfTag: 'Brau_Jumeirah',
    qty: 20,
    city: 'Dubai',
    street: 'Brau Ladies Salon LLC — Brau Jumeirah',
    expectedMinor: 76000,
  },
  {
    comment: 'Brau Springs',
    nameSuffix: 'BRAUSP10',
    marker: `BRAU-PEPTIDE-SPRINGS-P10-${uaeToday()}`,
    pdfTag: 'Brau_Springs',
    qty: 10,
    city: 'Dubai',
    street: 'Brau Ladies Salon LLC — Brau Springs',
    expectedMinor: 38000,
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
        ...(body ? { 'Content-Type': 'application/json' } : {}),
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

function shipmentAddress(orderDef) {
  return {
    country: href('country', COUNTRY_UAE_ID),
    city: orderDef.city,
    street: orderDef.street,
    addInfo: '',
  }
}

function buildPositions(item, qty) {
  const priceMinor = Math.round(CLINIC_AED * 100)
  return [
    {
      quantity: qty,
      price: priceMinor,
      discount: 0,
      assortment: href('product', item.id),
      vat: 5,
      vatEnabled: true,
    },
  ]
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

async function ensureOrderNameFree(name) {
  const existing = await api(
    'GET',
    `/entity/customerorder?filter=name=${encodeURIComponent(name)}&limit=1`,
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
  const pdfRes = await fetch(location, { headers: { Authorization: AUTH } })
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  return Buffer.from(await pdfRes.arrayBuffer())
}

async function runCycle(orderDef, idx, item, agent) {
  const name = `GENCardM${uaeShortDate()}${orderDef.nameSuffix}`
  const positions = buildPositions(item, orderDef.qty)
  const sumMinor = Math.round(CLINIC_AED * 100) * orderDef.qty
  const shipmentAddressFull = shipmentAddress(orderDef)

  console.log(`\n────────────────────────────────────────────────────────────`)
  console.log(`  Comment: ${orderDef.comment}`)
  console.log(`  Order: ${name}`)
  console.log(`    00012 ${item.name} x${orderDef.qty} @ ${CLINIC_AED}`)
  console.log(`  Ship: ${shipmentAddressFull.street}, ${shipmentAddressFull.city}`)
  console.log(`  Total: ${money(sumMinor)} AED unpaid`)

  if (sumMinor !== orderDef.expectedMinor) {
    throw new Error(`Sum ${money(sumMinor)} ≠ expected ${money(orderDef.expectedMinor)}`)
  }

  await ensureOrderNameFree(name)
  if (!COMMIT) return { name, sumMinor, comment: orderDef.comment }

  await ensureNoDuplicate(orderDef.marker, agent.id)

  const t0 = uaeMomentAddMinutes(idx * 10)
  const t1 = uaeMomentAddMinutes(idx * 10 + 1)
  const t2 = uaeMomentAddMinutes(idx * 10 + 3)

  const order = await api('POST', '/entity/customerorder', {
    name,
    moment: t0,
    applicable: true,
    shared: true,
    description: [
      orderDef.comment,
      orderDef.marker,
      `Peptide Gel Mask 00012 x${orderDef.qty} @ clinic 38.`,
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
  if (order.sum !== sumMinor) throw new Error(`SO ${name} sum ${money(order.sum)} ≠ ${money(sumMinor)}`)
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
    description: `${orderDef.comment} | Invoice for ${name} | ${orderDef.marker}`,
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
    description: `${orderDef.comment} | Shipment for ${invoice.name} / ${name} | ${orderDef.marker}`,
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
  if (demand.sum !== sumMinor) throw new Error(`SHIP sum ${money(demand.sum)} ≠ ${money(sumMinor)}`)
  console.log(`  3) Shipment: ${demand.name} | ${money(demand.sum)} AED`)

  const pdfBuf = await exportInvoicePdf(invoice.id)
  if (!pdfBuf) throw new Error('Invoice PDF export returned null (412)')
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const safeInv = String(invoice.name).replace(/[^\w.-]+/g, '_')
  const outPath = path.join(ORDERS_DIR, `GENOSYS_Brau_Ladies_${orderDef.pdfTag}_${safeInv}.pdf`)
  fs.writeFileSync(outPath, pdfBuf)
  console.log(`  PDF: ${outPath}`)

  return {
    name,
    invoice: invoice.name,
    demand: demand.name,
    sumMinor,
    comment: orderDef.comment,
    pdf: outPath,
  }
}

async function main() {
  console.log('====================================================================')
  console.log('  Brau Ladies — 3 peptide invoices (AD 40 / JBR 20 / Springs 10)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  if (!/Brau Ladies/i.test(agent.name || '')) throw new Error(`Unexpected agent: ${agent.name}`)
  console.log(`  Customer: ${agent.name}`)

  const item = await fetchAssortmentByCode('00012')
  const need = ORDERS.reduce((s, o) => s + o.qty, 0)
  console.log(`  Stock 00012: avail ${item.available} (need ${need})`)
  if (item.available < need) {
    throw new Error(`Insufficient 00012: need ${need}, available ${item.available}`)
  }

  const results = []
  for (let i = 0; i < ORDERS.length; i++) {
    results.push(await runCycle(ORDERS[i], i, item, agent))
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  console.log('\n====================================================================')
  console.log('  SUMMARY')
  for (const r of results) {
    console.log(`  ${r.comment}: SO ${r.name} | inv ${r.invoice} | ship ${r.demand} | ${money(r.sumMinor)}`)
    console.log(`    ${r.pdf}`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
