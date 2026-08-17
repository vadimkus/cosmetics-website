#!/usr/bin/env node

/**
 * Bianco Dubai Hills — bank remittance AED 4,297 (2026-08-11).
 *
 * Consignment reports (1,022):
 *   01053 18 | 01295 674 | 01296 165 | 01333 165
 * Invoice / shipment (3,275):
 *   invoice 04778 → demand 06490
 *
 * Note: payer sheet swapped 01295/01296 line amounts; MoySklad totals match.
 *
 *   node --import dotenv/config scripts/moysklad-create-bianco-dubai-hills-payment-4297-20260811.js
 *   node --import dotenv/config scripts/moysklad-create-bianco-dubai-hills-payment-4297-20260811.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const { uaeToday, uaeMomentNow, uaeMomentAddMinutes } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const BANK_ACCOUNT_ID = 'e1852e1c-33c5-11ea-0a80-043f000b2739'
const AGENT_ID = 'aac56118-2945-11ef-0a80-07b40031e6d1' // Bianco Beauty Salon SPA (Dubai Hills)
const CONTRACT_ID = '83eaec1b-2946-11ef-0a80-08f00030f7f3' // Agreement 00079
const STATE_REPORT_PAID_ID = 'fd15289c-c3c4-11eb-0a80-065200268290'
const STATE_ORDER_DELIVERED_ID = 'e1a0ae5f-33c5-11ea-0a80-043f000b275e'

const MARKER = `BIANCO-DHILLS-PAYMENT-4297-${uaeToday()}`

/** MoySklad-authoritative amounts (AED minor units) */
const REPORTS = [
  { name: '01053', id: 'ccd5a0ad-608f-11f0-0a80-03ee002a66e1', expectedMinor: 1800 },
  { name: '01295', id: 'a989c024-246c-11f1-0a80-106c00101a58', expectedMinor: 67400 },
  { name: '01296', id: 'e600fdda-246c-11f1-0a80-0f3f00103ffc', expectedMinor: 16500 },
  { name: '01333', id: '0dda58ed-43c8-11f1-0a80-112c001ae28d', expectedMinor: 16500 },
]

const INVOICE_NAME = '04778'
const INVOICE_ID = '45fd52a4-79d9-11f1-0a80-0f780015cb2b'
const DEMAND_ID = '46c18e26-79d9-11f1-0a80-0ed40016758a'
const DEMAND_NAME = '06490'
const ORDER_ID = '45b86dc4-79d9-11f1-0a80-1f640015a4ed'
const INVOICE_MINOR = 327500

const EXPECTED_TOTAL_MINOR = 429700 // 1022 + 3275

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
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    if (attempt < 5 && (e.message === 'fetch failed' || e.cause?.code === 'ECONNRESET')) {
      await new Promise((r) => setTimeout(r, 1500 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    throw e
  }
}

function href(type, id) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

function orgAccountHref(id) {
  return {
    meta: {
      href: `${API}/entity/organization/${ORG_ID}/accounts/${id}`,
      type: 'account',
      mediaType: 'application/json',
    },
  }
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

async function ensureNoDuplicate(marker) {
  const data = await api('GET', `/entity/paymentin?search=${encodeURIComponent(marker)}&limit=20`)
  const dup = (data.rows || []).find((d) => String(d.description || '').includes(marker))
  if (dup) throw new Error(`Duplicate payment marker (${dup.name}): ${marker}`)
}

async function main() {
  console.log('====================================================================')
  console.log('  Bianco Dubai Hills — remittance 4,297 (consignment + inv 04778)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  console.log(`  Customer: ${agent.name}`)

  let consignmentOpen = 0
  const reportOps = []
  for (const spec of REPORTS) {
    const r = await api('GET', `/entity/commissionreportin/${spec.id}?expand=state`)
    if (r.name !== spec.name) throw new Error(`Report id mismatch: expected ${spec.name}, got ${r.name}`)
    const open = (r.sum || 0) - (r.payedSum || 0)
    console.log(
      `  Report ${r.name}: sum ${money(r.sum)} payed ${money(r.payedSum)} open ${money(open)} | ${r.state?.name || '?'}`,
    )
    if (open <= 0) {
      console.log(`    already paid — skip`)
      continue
    }
    if (open !== spec.expectedMinor) {
      throw new Error(`Report ${spec.name} open ${money(open)} ≠ expected ${money(spec.expectedMinor)}`)
    }
    if (r.sum !== spec.expectedMinor) {
      throw new Error(`Report ${spec.name} sum ${money(r.sum)} ≠ expected ${money(spec.expectedMinor)}`)
    }
    consignmentOpen += open
    reportOps.push({
      meta: {
        href: `${API}/entity/commissionreportin/${spec.id}`,
        type: 'commissionreportin',
        mediaType: 'application/json',
      },
      linkedSum: open,
      _name: spec.name,
      _id: spec.id,
    })
  }

  const demand = await api('GET', `/entity/demand/${DEMAND_ID}`)
  const invoice = await api('GET', `/entity/invoiceout/${INVOICE_ID}`)
  const order = await api('GET', `/entity/customerorder/${ORDER_ID}?expand=state`)
  const demandOpen = (demand.sum || 0) - (demand.payedSum || 0)
  console.log(
    `  Demand ${demand.name} / inv ${invoice.name}: sum ${money(demand.sum)} payed ${money(demand.payedSum)} open ${money(demandOpen)}`,
  )
  console.log(`  Order: ${order.name} | state ${order.state?.name || '?'}`)

  if (demandOpen > 0 && demandOpen !== INVOICE_MINOR) {
    throw new Error(`Demand open ${money(demandOpen)} ≠ expected ${money(INVOICE_MINOR)}`)
  }

  const invoicePart = demandOpen > 0 ? demandOpen : 0
  const total = consignmentOpen + invoicePart
  console.log(`\n  Consignment to post: ${money(consignmentOpen)}`)
  console.log(`  Invoice to post:     ${money(invoicePart)}`)
  console.log(`  Total this run:      ${money(total)} (expected remittance ${money(EXPECTED_TOTAL_MINOR)})`)

  if (total === 0) {
    console.log('\n  Nothing open — already applied.')
    return
  }
  if (total !== EXPECTED_TOTAL_MINOR && consignmentOpen + invoicePart !== EXPECTED_TOTAL_MINOR) {
    // allow partial if some already paid, but flag
    console.log('  NOTE: total differs from full remittance 4,297 (partial already applied?)')
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const results = []

  if (reportOps.length) {
    const marker = `${MARKER}-CONSIGNMENT`
    await ensureNoDuplicate(marker)
    const pay = await api('POST', '/entity/paymentin', {
      moment: uaeMomentNow(),
      applicable: true,
      organization: href('organization', ORG_ID),
      agent: href('counterparty', AGENT_ID),
      contract: href('contract', CONTRACT_ID),
      organizationAccount: orgAccountHref(BANK_ACCOUNT_ID),
      description: [
        `Bianco Dubai Hills consignment remittance | ${marker}`,
        `Reports ${reportOps.map((o) => o._name).join(', ')} | ${money(consignmentOpen)} AED paid in full.`,
      ].join(' | '),
      sum: consignmentOpen,
      operations: reportOps.map(({ meta, linkedSum }) => ({ meta, linkedSum })),
    })
    results.push(pay)
    console.log(`\n  Paymentin (consignment): ${pay.name} | ${money(pay.sum)} AED`)
    console.log(`  https://online.moysklad.ru/app/#paymentin/edit?id=${pay.id}`)

    for (const op of reportOps) {
      const after = await api('GET', `/entity/commissionreportin/${op._id}?expand=state`)
      if ((after.payedSum || 0) >= (after.sum || 0) && after.state?.name !== 'Paid') {
        await api('PUT', `/entity/commissionreportin/${op._id}`, {
          meta: after.meta,
          state: stateHref('commissionreportin', STATE_REPORT_PAID_ID),
        })
      }
      const final = await api('GET', `/entity/commissionreportin/${op._id}?expand=state`)
      console.log(
        `  Report ${final.name}: payed ${money(final.payedSum)} / ${money(final.sum)} | ${final.state?.name}`,
      )
    }
  }

  if (invoicePart > 0) {
    const marker = `${MARKER}-INV04778`
    await ensureNoDuplicate(marker)
    const pay = await api('POST', '/entity/paymentin', {
      moment: uaeMomentAddMinutes(2),
      applicable: true,
      organization: href('organization', ORG_ID),
      agent: href('counterparty', AGENT_ID),
      organizationAccount: orgAccountHref(BANK_ACCOUNT_ID),
      description: [
        `Bianco Dubai Hills invoice ${INVOICE_NAME} / shipment ${DEMAND_NAME} | ${marker}`,
        `${money(invoicePart)} AED paid in full.`,
      ].join(' | '),
      sum: invoicePart,
      operations: [
        {
          meta: {
            href: `${API}/entity/demand/${DEMAND_ID}`,
            type: 'demand',
            mediaType: 'application/json',
          },
          linkedSum: invoicePart,
        },
      ],
    })
    results.push(pay)
    console.log(`\n  Paymentin (invoice): ${pay.name} | ${money(pay.sum)} AED`)
    console.log(`  https://online.moysklad.ru/app/#paymentin/edit?id=${pay.id}`)

    const orderFresh = await api('GET', `/entity/customerorder/${ORDER_ID}`)
    await api('PUT', `/entity/customerorder/${ORDER_ID}`, {
      meta: orderFresh.meta,
      state: stateHref('customerorder', STATE_ORDER_DELIVERED_ID),
    })
    const dem2 = await api('GET', `/entity/demand/${DEMAND_ID}`)
    const o2 = await api('GET', `/entity/customerorder/${ORDER_ID}?expand=state`)
    console.log(`  Demand payed: ${money(dem2.payedSum)} | Order state: ${o2.state?.name}`)
  }

  const posted = results.reduce((s, p) => s + (p.sum || 0), 0)
  console.log(`\n  Posted total: ${money(posted)} AED across ${results.length} paymentin(s)`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
