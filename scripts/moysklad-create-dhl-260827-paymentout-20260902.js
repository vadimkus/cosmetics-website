#!/usr/bin/env node

/**
 * DHL Express — delivery paymentout 276.75 AED for PO DM GME 260827.
 *
 * ebilling.dhl.com / CCAvenue 2026-09-02 07:15.
 * Order a076d32d70c852799e1e · CCAvenue 115081380942 · bank 140434
 *
 *   node --import dotenv/config scripts/moysklad-create-dhl-260827-paymentout-20260902.js
 *   node --import dotenv/config scripts/moysklad-create-dhl-260827-paymentout-20260902.js --commit
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
const EXPENSE_ITEM_ID = 'c8b72a7e-834a-11ea-0a80-004a00283a9e' // Shipment Cost
const STATE_PAID_ID = 'e7020a99-d671-11ea-0a80-0216000f3623'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'

const AGENT_NAME = 'DHL Express'
const SUM_MINOR = 27675
const MOMENT = '2026-09-02 07:15:00'
const PO_NAME = 'DM GME 260827'
const ORDER_NO = 'a076d32d70c852799e1e'
const CCAVENUE = '115081380942'
const BANK_REF = '140434'
const MARKER = `DHL-260827-${CCAVENUE}`

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

function href(type, id) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

function stateHref(stateId) {
  return {
    meta: {
      href: `${API}/entity/paymentout/metadata/states/${stateId}`,
      type: 'state',
      mediaType: 'application/json',
    },
  }
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

async function findOrCreateAgent() {
  const search = await api('GET', `/entity/counterparty?search=${encodeURIComponent(AGENT_NAME)}&limit=10`)
  const existing = (search.rows || []).find((r) => r.name === AGENT_NAME)
  if (existing) {
    console.log(`  Agent  : ${existing.name} (${existing.id}) existing`)
    return existing
  }
  if (!COMMIT) {
    console.log(`  Agent  : would create "${AGENT_NAME}"`)
    return { id: 'DRY-RUN', name: AGENT_NAME }
  }
  const created = await api('POST', '/entity/counterparty', {
    name: AGENT_NAME,
    companyType: 'legal',
    description: 'DHL Express UAE. ebilling.dhl.com courier for Korea device shipments.',
    actualAddressFull: {
      country: href('country', COUNTRY_UAE_ID),
      city: 'Dubai',
      addInfo: '',
    },
  })
  console.log(`  Agent  : ${created.name} (${created.id}) created`)
  return created
}

async function ensureNoDuplicate() {
  for (const q of [MARKER, CCAVENUE, ORDER_NO]) {
    const hit = await api('GET', `/entity/paymentout?search=${encodeURIComponent(q)}&limit=5`)
    if ((hit.rows || []).length) {
      throw new Error(`Duplicate: ${q} already booked (${hit.rows[0].name})`)
    }
  }
}

async function main() {
  console.log('====================================================================')
  console.log('  DHL Express — DM GME 260827 delivery (paymentout)')
  console.log('====================================================================')
  console.log(`  Mode   : ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Sum    : ${money(SUM_MINOR)} AED`)
  console.log(`  Moment : ${MOMENT}`)
  console.log(`  PO     : ${PO_NAME}`)

  const [agent, expense] = await Promise.all([
    findOrCreateAgent(),
    api('GET', `/entity/expenseitem/${EXPENSE_ITEM_ID}`),
  ])
  console.log(`  Expense: ${expense.name}`)
  if (!/shipment/i.test(expense.name)) throw new Error(`Unexpected expense: ${expense.name}`)

  const purpose = [
    `DHL Express ${money(SUM_MINOR)} AED — ${PO_NAME} devices`,
    `ebilling.dhl.com order ${ORDER_NO}`,
    `CCAvenue ${CCAVENUE} | bank ${BANK_REF} | ccavenue.ae/charge`,
    'VISA 02-Sep-2026 07:15',
    MARKER,
  ].join(' | ')

  if (!COMMIT) {
    console.log(`  Desc   : ${purpose}`)
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await ensureNoDuplicate()

  const created = await api('POST', '/entity/paymentout', {
    moment: MOMENT,
    applicable: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    expenseItem: href('expenseitem', EXPENSE_ITEM_ID),
    state: stateHref(STATE_PAID_ID),
    sum: SUM_MINOR,
    paymentPurpose: purpose,
    description: purpose,
  })

  console.log(`\n  Created: ${created.name} | ${money(created.sum)} AED | ${created.moment}`)
  console.log(`  https://online.moysklad.ru/app/#paymentout/edit?id=${created.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
