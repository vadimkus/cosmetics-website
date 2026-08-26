#!/usr/bin/env node

/**
 * Brau Ladies Salon LLC — SO → invoice → shipment @ clinic 38.
 *
 *   Brau Jumeirah — Peptide Gel Mask 00012 ×10 = 380 AED
 *
 *   node --import dotenv/config scripts/moysklad-create-brau-ladies-peptide-jumeirah-20260818.js
 *   node --import dotenv/config scripts/moysklad-create-brau-ladies-peptide-jumeirah-20260818.js --commit
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
const CLINIC_AED = 38
const QTY = 10
const EXPECTED_SUM_MINOR = 38000

const ORDER = {
  comment: 'Brau Jumeirah',
  name: `GENCardM${uaeShortDate()}BRAUJBRP10`,
  marker: `BRAU-PEPTIDE-JBR-P10-${uaeToday()}`,
  city: 'Dubai',
  street: 'Brau Ladies Salon LLC — Brau Jumeirah',
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

async function ensureOrderNameFree() {
  const existing = await api(
    'GET',
    `/entity/customerorder?filter=name=${encodeURIComponent(ORDER.name)}&limit=1`,
  )
  if (existing?.rows?.length) throw new Error(`Order name already taken: ${ORDER.name}`)
}

async function ensureNoDuplicate(agentId) {
  const filter = [
    `agent=${API}/entity/counterparty/${agentId}`,
    `moment>=${uaeToday()} 00:00:00`,
    `moment<=${uaeToday()} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/customerorder?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(ORDER.marker))
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

async function main() {
  console.log('====================================================================')
  console.log('  Brau Ladies — peptide ×10 | Brau Jumeirah')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  const item = await fetchAssortmentByCode('00012')
  await ensureOrderNameFree()
  if (COMMIT) await ensureNoDuplicate(agent.id)

  const priceMinor = Math.round(CLINIC_AED * 100)
  const sumMinor = priceMinor * QTY
  const positions = [
    {
      quantity: QTY,
      price: priceMinor,
      discount: 0,
      assortment: href('product', item.id),
      vat: 5,
      vatEnabled: true,
    },
  ]
  const shipmentAddressFull = {
    country: href('country', COUNTRY_UAE_ID),
    city: ORDER.city,
    street: ORDER.street,
    addInfo: `${ORDER.street}, ${ORDER.city}, United Arab Emirates`,
  }

  console.log(`  Customer: ${agent.name}`)
  console.log(`  Mark: ${ORDER.comment}`)
  console.log(`  Order: ${ORDER.name}`)
  console.log(`    00012 ${item.name} x${QTY} @ ${CLINIC_AED} (avail ${item.available})`)
  console.log(`  Total: ${money(sumMinor)} AED unpaid`)
  if (item.available < QTY) {
    console.log(`  WARN stock 00012: need ${QTY}, have ${item.available} — posting anyway`)
  }
  if (sumMinor !== EXPECTED_SUM_MINOR) {
    throw new Error(`Sum ${money(sumMinor)} ≠ expected ${money(EXPECTED_SUM_MINOR)}`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const t0 = uaeMomentAddMinutes(20)
  const t1 = uaeMomentAddMinutes(21)
  const t2 = uaeMomentAddMinutes(23)

  const order = await api('POST', '/entity/customerorder', {
    name: ORDER.name,
    moment: t0,
    description: [
      ORDER.comment,
      ORDER.marker,
      `Peptide Gel Mask 00012 x${QTY} @ clinic 38.`,
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
  console.log(`\n  1) Order: ${order.name} | ${money(order.sum)} AED`)

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
    description: `${ORDER.comment} | Invoice for ${ORDER.name} | ${ORDER.marker}`,
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
    description: `${ORDER.comment} | Shipment for ${invoice.name} / ${ORDER.name} | ${ORDER.marker}`,
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

  const pdfBuf = await exportInvoicePdf(invoice.id)
  if (!pdfBuf) throw new Error('Invoice PDF export returned null (412)')
  const outPath = path.join(
    os.homedir(),
    'Desktop',
    'orders',
    `GENOSYS_Brau_Ladies_Brau_Jumeirah_${String(invoice.name).replace(/[^\w.-]+/g, '_')}.pdf`,
  )
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, pdfBuf)
  console.log(`  PDF: ${outPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
