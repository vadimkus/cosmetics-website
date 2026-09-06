#!/usr/bin/env node

/**
 * MOFA — invoices attestation paymentout (302.15 AED) for DM GME 260810.
 *
 * Magnati checkout 2026-09-02: 300.00 (attestation 150 + COO 150) + 2.15 charge.
 * Attestation AECI1056219107091964354 · Invoice ID 6883538416 · card *4920
 * Commercial invoice USD 4,709.00.
 *
 *   node --import dotenv/config scripts/moysklad-create-mofa-attestation-paymentout-20260902.js
 *   node --import dotenv/config scripts/moysklad-create-mofa-attestation-paymentout-20260902.js --commit
 */

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

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const AGENT_ID = '57613a74-fdf5-11f0-0a80-0c6e00132f3b' // MOFA
const EXPENSE_ITEM_ID = '6206223c-fdf5-11f0-0a80-062c0012e610' // Invoices Attestation
const STATE_PAID_ID = 'e7020a99-d671-11ea-0a80-0216000f3623'

const SUM_MINOR = 30215
const ATTESTATION = 'AECI1056219107091964354'
const INVOICE_ID = '6883538416'
const MARKER = `MOFA-ATTEST-20260902-260810-${INVOICE_ID}`
const MOMENT = uaeMomentNow()
const DESCRIPTION = [
  'MOFA invoices attestation 302.15 AED (300.00 + 2.15 Magnati)',
  `DM GME 260810 USD 4,709`,
  `attestation ${ATTESTATION} DXB`,
  `invoice ID ${INVOICE_ID}`,
  'card *4920',
  'paid 02-Sep-2026 Magnati / UAE Pass',
].join(' — ')

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

async function ensureNoDuplicate() {
  const byPurpose = await api(
    'GET',
    `/entity/paymentout?filter=${encodeURIComponent(`paymentPurpose~${MARKER}`)}&limit=5`,
  )
  if ((byPurpose.rows || []).length) {
    throw new Error(`Duplicate: paymentout already exists (${byPurpose.rows[0].name})`)
  }

  for (const q of [ATTESTATION, INVOICE_ID]) {
    const hit = await api('GET', `/entity/paymentout?search=${encodeURIComponent(q)}&limit=5`)
    if ((hit.rows || []).length) {
      throw new Error(`Duplicate: ${q} already booked (${hit.rows[0].name})`)
    }
  }
}

async function main() {
  console.log('====================================================================')
  console.log('  MOFA — invoices attestation (paymentout) DM GME 260810')
  console.log('====================================================================')
  console.log(`  Mode   : ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Sum    : ${money(SUM_MINOR)} AED`)
  console.log(`  Moment : ${MOMENT}`)

  const [agent, expense] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/expenseitem/${EXPENSE_ITEM_ID}`),
  ])
  console.log(`  Agent  : ${agent.name}`)
  console.log(`  Expense: ${expense.name}`)
  if (!/mofa/i.test(agent.name)) throw new Error(`Unexpected agent: ${agent.name}`)
  if (!/attest/i.test(expense.name)) throw new Error(`Unexpected expense: ${expense.name}`)

  if (COMMIT) await ensureNoDuplicate()

  const payload = {
    moment: MOMENT,
    applicable: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    expenseItem: href('expenseitem', EXPENSE_ITEM_ID),
    state: stateHref(STATE_PAID_ID),
    sum: SUM_MINOR,
    description: DESCRIPTION,
    paymentPurpose: MARKER,
  }

  if (!COMMIT) {
    console.log(`  Desc   : ${DESCRIPTION}`)
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const created = await api('POST', '/entity/paymentout', payload)
  console.log(`\n  Created: ${created.name} | ${money(created.sum)} AED | ${created.moment}`)
  console.log(`  https://online.moysklad.ru/app/#paymentout/edit?id=${created.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
