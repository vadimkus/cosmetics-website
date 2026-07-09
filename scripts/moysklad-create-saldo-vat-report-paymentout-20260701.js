#!/usr/bin/env node

/**
 * Saldo Accounting — VAT report Q2 2026 (Apr–Jun), estimate EST-SAL-1035.
 * 1,200 + 60 VAT = 1,260 AED (same as prior quarterly VAT payments e.g. 00499).
 *
 *   node --import dotenv/config scripts/moysklad-create-saldo-vat-report-paymentout-20260701.js
 *   node --import dotenv/config scripts/moysklad-create-saldo-vat-report-paymentout-20260701.js --commit
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

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const AGENT_ID = '58e2a786-10aa-11f0-0a80-030e0027d310' // Saldo Accounting and Bookkeeping LLC
const EXPENSE_ITEM_ID = '411798db-cb46-11ee-0a80-16be0014410b' // Accounting Expense
const STATE_PAID_ID = 'e7020a99-d671-11ea-0a80-0216000f3623'

const SUM_MINOR = 126000 // 1,260.00 AED (1,200 + 5% VAT)
const ESTIMATE_NO = 'EST-SAL-1035'
const PERIOD = 'April 2026 - June 2026'
const DESCRIPTION = `VAT Report Preparation and Submission (${PERIOD}) ${ESTIMATE_NO}>>Accounting`
const MARKER = `SALDO-VAT-Q2-2026-${ESTIMATE_NO}-${uaeToday()}`

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
  const search = await api('GET', `/entity/paymentout?search=${encodeURIComponent(ESTIMATE_NO)}&limit=5`)
  if (search.rows?.length) {
    throw new Error(`Duplicate: ${search.rows[0].name} (${search.rows[0].id})`)
  }

  const filter = [
    `agent=${API}/entity/counterparty/${AGENT_ID}`,
    `moment>=${uaeToday()} 00:00:00`,
    `moment<=${uaeToday()} 23:59:59`,
  ].join(';')
  const today = await api('GET', `/entity/paymentout?filter=${encodeURIComponent(filter)}&limit=50`)
  const dup = (today.rows || []).find((r) => r.sum === SUM_MINOR && (r.description || '').includes('VAT Report'))
  if (dup) throw new Error(`Duplicate today: ${dup.name} (${dup.id})`)
}

async function main() {
  console.log('====================================================================')
  console.log('  Saldo Accounting — VAT report paymentout (EST-SAL-1035)')
  console.log('====================================================================')
  console.log(`  Mode     : ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Date     : ${uaeToday()}`)
  console.log(`  Estimate : ${ESTIMATE_NO}`)
  console.log(`  Period   : ${PERIOD}`)
  console.log(`  Sum      : ${money(SUM_MINOR)} AED (1,200 + 60 VAT)`)

  const [agent, expense] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/expenseitem/${EXPENSE_ITEM_ID}`),
  ])
  console.log(`  Agent    : ${agent.name}`)
  console.log(`  Expense  : ${expense.name}`)

  if (COMMIT) await ensureNoDuplicate()

  const payload = {
    moment: uaeMomentNow(),
    applicable: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    expenseItem: href('expenseitem', EXPENSE_ITEM_ID),
    state: stateHref(STATE_PAID_ID),
    sum: SUM_MINOR,
    paymentPurpose: `${DESCRIPTION} — ${money(SUM_MINOR)} AED [${MARKER}]`,
    description: DESCRIPTION,
  }

  if (!COMMIT) {
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
