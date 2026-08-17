#!/usr/bin/env node

/**
 * CEIA CLINIC GENCardM260813CEIA / inv 04927 / ship 06680
 * Remove cream 00034. Add collagen mask 00063 ×1 @ 18. Paymentin 18 AED.
 * SO → Доставлен. Re-export Legal_TAX → ~/Desktop/orders/
 *
 *   node --import dotenv/config scripts/moysklad-amend-ceia-04927-collagen-pay-20260817.js
 *   node --import dotenv/config scripts/moysklad-amend-ceia-04927-collagen-pay-20260817.js --commit
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

const { uaeMomentNow } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORDER_ID = '9d5de526-96fe-11f1-0a80-134b00249fb7'
const INVOICE_ID = '9db35090-96fe-11f1-0a80-0b8e002473fc'
const DEMAND_ID_HINT = '2add44e0-9700-11f1-0a80-0d9b00264b1e'
const AGENT_ID = 'd7af76af-8cc5-11f1-0a80-08f4001604b7'
const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const BANK_ACCOUNT_ID = 'e1852e1c-33c5-11ea-0a80-043f000b2739'
const STATE_ORDER_DELIVERED_ID = 'e1a0ae5f-33c5-11ea-0a80-043f000b275e'
const INVOICE_LEGAL_TAX_TEMPLATE_ID = '5e56cd7d-ce85-4db5-8771-d7531f9ffd71'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const MARKER = 'CEIA-04927-COLLAGEN-PAY-2026-08-17'

const DROP_CODE = '00034'
const ADD_CODE = '00063'
const ADD_QTY = 1
const ADD_AED = 18
const EXPECTED_SUM_MINOR = 1800

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

function orgAccountHref(id) {
  return { meta: { href: `${API}/entity/account/${id}`, type: 'account', mediaType: 'application/json' } }
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

async function resolveDemandId(invoice) {
  const fromInv = (invoice.demands || [])[0]?.id
  if (fromInv) return fromInv
  try {
    await api('GET', `/entity/demand/${DEMAND_ID_HINT}`)
    return DEMAND_ID_HINT
  } catch (e) {
    throw new Error(`No demand on invoice 04927: ${e.message}`)
  }
}

async function exportInvoicePdf(invoiceId, invoiceName) {
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
  if (res.status !== 303 && res.status !== 302) {
    throw new Error(`Invoice export ${res.status}: ${(await res.text()).slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const safe = String(invoiceName || 'invoice').replace(/[^\w.-]+/g, '_')
  const out = path.join(ORDERS_DIR, `GENOSYS_CEIA_Clinic_${safe}.pdf`)
  fs.writeFileSync(out, buf)
  return out
}

async function main() {
  console.log('====================================================================')
  console.log('  CEIA 04927 — cream out, collagen ×1 @18, paymentin 18')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [order, invoice] = await Promise.all([
    api('GET', `/entity/customerorder/${ORDER_ID}?expand=state,agent`),
    api('GET', `/entity/invoiceout/${INVOICE_ID}?expand=demands,agent`),
  ])
  const demandId = await resolveDemandId(invoice)
  const demand = await api('GET', `/entity/demand/${demandId}?expand=invoicesOut`)

  console.log(`  SO ${order.name} ${money(order.sum)} ${order.agent?.name} ${order.state?.name || ''}`)
  console.log(`  INV ${invoice.name} ${money(invoice.sum)} payed ${money(invoice.payedSum)}`)
  console.log(`  SHIP ${demand.name} ${money(demand.sum)} SO-link ${!!demand.customerOrder}`)
  if (order.name !== 'GENCardM260813CEIA') throw new Error(`Unexpected SO ${order.name}`)
  if (invoice.name !== '04927') throw new Error(`Unexpected invoice ${invoice.name}`)
  if ((invoice.payedSum || 0) > 0) throw new Error('Invoice already has payment — stop')
  if (demand.customerOrder) throw new Error('Demand has customerOrder — stop')

  const docs = [
    ['customerorder', ORDER_ID],
    ['invoiceout', INVOICE_ID],
    ['demand', demandId],
  ]
  for (const [type, id] of docs) {
    const positions = await fetchAll(`/entity/${type}/${id}/positions?expand=assortment`)
    console.log(`  ${type} lines:`)
    for (const p of positions) {
      console.log(`    ${p.assortment?.code} ${p.assortment?.name} x${p.quantity} @ ${money(p.price)}`)
    }
    const cream = positions.filter((p) => p.assortment?.code === DROP_CODE)
    const other = positions.filter((p) => p.assortment?.code !== DROP_CODE)
    if (!cream.length) throw new Error(`${type}: cream ${DROP_CODE} not found`)
    if (other.length) {
      throw new Error(`${type}: unexpected ${other.map((p) => p.assortment?.code).join(', ')}`)
    }
  }

  const item = await fetchAssortmentByCode(ADD_CODE)
  console.log(`  Add ${ADD_CODE} ${item.name} x${ADD_QTY} @ ${ADD_AED} (avail ${item.available})`)
  if (item.available < ADD_QTY) {
    console.log(`  WARN stock ${ADD_CODE}: need ${ADD_QTY}, have ${item.available}`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const addPayload = [
    {
      quantity: ADD_QTY,
      price: Math.round(ADD_AED * 100),
      discount: 0,
      assortment: href('product', item.id),
      vat: 5,
      vatEnabled: true,
    },
  ]

  for (const [type, id] of docs) {
    const positions = await fetchAll(`/entity/${type}/${id}/positions?expand=assortment`)
    for (const p of positions.filter((x) => x.assortment?.code === DROP_CODE)) {
      await api('DELETE', `/entity/${type}/${id}/positions/${p.id}`)
      console.log(`  deleted ${DROP_CODE} on ${type}`)
    }
    await api('POST', `/entity/${type}/${id}/positions`, addPayload)
    console.log(`  added ${ADD_CODE} on ${type}`)
  }

  const [soAfter, invAfter, shipAfter] = await Promise.all([
    api('GET', `/entity/customerorder/${ORDER_ID}`),
    api('GET', `/entity/invoiceout/${INVOICE_ID}`),
    api('GET', `/entity/demand/${demandId}`),
  ])
  if (
    soAfter.sum !== EXPECTED_SUM_MINOR ||
    invAfter.sum !== EXPECTED_SUM_MINOR ||
    shipAfter.sum !== EXPECTED_SUM_MINOR
  ) {
    throw new Error(
      `Sum mismatch SO ${money(soAfter.sum)} INV ${money(invAfter.sum)} SHIP ${money(shipAfter.sum)}`,
    )
  }

  await api('PUT', `/entity/customerorder/${ORDER_ID}`, {
    meta: soAfter.meta,
    description: [
      soAfter.description || '',
      '2026-08-17: removed 00034 cream. Added 00063 collagen ×1 @18. Paymentin 18 AED.',
    ]
      .filter(Boolean)
      .join('\n'),
  })

  const paymentIn = await api('POST', '/entity/paymentin', {
    moment: uaeMomentNow(),
    applicable: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    organizationAccount: orgAccountHref(BANK_ACCOUNT_ID),
    sum: EXPECTED_SUM_MINOR,
    description: [
      MARKER,
      `Payment for ${demand.name} / ${invoice.name} / ${order.name}`,
      '18 AED — collagen mask ×1.',
    ].join(' | '),
    operations: [
      {
        meta: {
          href: `${API}/entity/demand/${demandId}`,
          type: 'demand',
          mediaType: 'application/json',
        },
        linkedSum: EXPECTED_SUM_MINOR,
      },
    ],
  })

  await api('PUT', `/entity/customerorder/${ORDER_ID}`, {
    meta: soAfter.meta,
    state: stateHref('customerorder', STATE_ORDER_DELIVERED_ID),
  })

  const pdfPath = await exportInvoicePdf(INVOICE_ID, invoice.name)
  console.log(`  Payment in: ${paymentIn.name} | ${money(paymentIn.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#paymentin/edit?id=${paymentIn.id}`)
  console.log(`  Order ${order.name} → Доставлен`)
  console.log(`  PDF: ${pdfPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
