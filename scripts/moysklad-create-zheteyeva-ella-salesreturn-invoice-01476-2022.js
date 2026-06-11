#!/usr/bin/env node

/**
 * Zheteyeva Ella — full sales return vs invoice 01476 (Bagus boards, 8,225 AED).
 * Customer returned all goods; no longer active. Posted with 2022 date.
 *
 *   node --import dotenv/config scripts/moysklad-create-zheteyeva-ella-salesreturn-invoice-01476-2022.js
 *   node --import dotenv/config scripts/moysklad-create-zheteyeva-ella-salesreturn-invoice-01476-2022.js --commit
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

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const AGENT_ID = 'fd32339a-3c1d-11ed-0a80-0160001c8a3d' // Zheteyeva Ella
const INVOICE_ID = '67f4fd87-3c1f-11ed-0a80-054a001cda39' // 01476
const DEMAND_ID = '22e40dc4-3c1f-11ed-0a80-0160001c96eb' // 01738
const STATE_RETURN_ID = 'f793c585-01bb-11f1-0a80-1ac1000b5df5'

/** Same calendar year as invoice; day after partial return 00064 (2022-12-18) */
const RETURN_MOMENT = '2022-12-19 12:00:00'
const MARKER = 'Zheteyeva Ella full return invoice 01476 Bagus boards 2022-12-19'

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

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

async function ensureNoDuplicate() {
  const filter = [
    `agent=${API}/entity/counterparty/${AGENT_ID}`,
    `moment>=2022-12-19 00:00:00`,
    `moment<=2022-12-19 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/salesreturn?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes('invoice 01476'))
  if (dup) throw new Error(`Duplicate return exists: ${dup.name} (${dup.id})`)
}

async function main() {
  console.log('====================================================================')
  console.log('  Zheteyeva Ella — sales return vs invoice 01476 (2022 date)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [agent, invoice, demand] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/invoiceout/${INVOICE_ID}`),
    api('GET', `/entity/demand/${DEMAND_ID}`),
  ])

  if (invoice.agent?.meta?.href?.split('/').pop()?.split('?')[0] !== AGENT_ID) {
    throw new Error('Invoice 01476 agent mismatch')
  }

  const invPos = await fetchAll(`/entity/invoiceout/${INVOICE_ID}/positions?expand=assortment`)
  const positions = invPos.map((p) => ({
    quantity: p.quantity,
    price: p.price,
    discount: p.discount || 0,
    assortment: href('product', p.assortment.meta.href.split('/').pop().split('?')[0]),
    vat: p.vat || 0,
    vatEnabled: p.vatEnabled ?? false,
  }))

  const totalQty = positions.reduce((s, p) => s + p.quantity, 0)
  const sumMinor = positions.reduce((s, p) => s + p.price * p.quantity, 0)

  console.log(`  Customer: ${agent.name}`)
  console.log(`  Invoice:  ${invoice.name} | ${money(invoice.sum)} AED | paid ${money(invoice.payedSum)}`)
  console.log(`  Shipment: ${demand.name} | ${money(demand.sum)} AED`)
  console.log(`  Return moment: ${RETURN_MOMENT}`)
  console.log(`\n  Lines (${totalQty} pcs, ${money(sumMinor)} AED):`)
  for (const p of invPos) {
    console.log(
      `    ${p.assortment.code} ${p.assortment.name.slice(0, 50)} x${p.quantity} @ ${money(p.price)}`
    )
  }

  if (Math.abs(sumMinor - invoice.sum) > 1) {
    throw new Error(`Sum mismatch: invoice ${money(invoice.sum)} vs lines ${money(sumMinor)}`)
  }

  if (COMMIT) await ensureNoDuplicate()

  const payload = {
    moment: RETURN_MOMENT,
    applicable: true,
    vatEnabled: false,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    store: href('store', STORE_ID),
    // API links return to shipment only; demand 01738 → invoice 01476
    demand: href('demand', DEMAND_ID),
    state: stateHref('salesreturn', STATE_RETURN_ID),
    description: [
      MARKER,
      'Full return of invoice 01476 / shipment 01738 — Bagus boards; customer left, goods returned.',
    ].join('\n'),
    positions,
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const created = await api('POST', '/entity/salesreturn', payload)
  const readback = await fetchAll(`/entity/salesreturn/${created.id}/positions?expand=assortment`)
  const [invAfter, demAfter, srAfter] = await Promise.all([
    api('GET', `/entity/invoiceout/${INVOICE_ID}`),
    api('GET', `/entity/demand/${DEMAND_ID}?expand=returns,invoicesOut`),
    api('GET', `/entity/salesreturn/${created.id}`),
  ])

  const invUnpaid = (invAfter.sum || 0) - (invAfter.payedSum || 0)
  const retCredit = (created.sum || 0) - (created.payedSum || 0)
  const net01476 = retCredit - invUnpaid

  console.log(`\n  Created return: ${created.name} | ${money(created.sum)} AED | ${readback.length} lines`)
  console.log(`  https://online.moysklad.ru/app/#salesreturn/edit?id=${created.id}`)
  console.log(`  Linked to shipment ${demAfter.name} → invoice ${demAfter.invoicesOut?.[0]?.name || '01476'}`)
  console.log(`\n  Settlement check (invoice 01476 vs this return):`)
  console.log(`    invoice unpaid ${money(invUnpaid)} | return credit ${money(retCredit)} | net ${money(net01476)}`)
  if (Math.abs(net01476) > 1) {
    console.log('    NOTE: MoySklad keeps invoice payedSum=0; return nets receivable in mutual settlements.')
  }
  if (!srAfter.demand?.meta?.href?.includes(DEMAND_ID)) {
    throw new Error('Return was not linked to demand 01738')
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
