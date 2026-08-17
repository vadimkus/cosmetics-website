#!/usr/bin/env node

/**
 * FTA — VAT Q2 2026 payment (GIBAN ref 392084), paid 13 Jul 2026.
 *
 *   node --import dotenv/config scripts/moysklad-create-fta-vat-q2-paymentout-20260713.js
 *   node --import dotenv/config scripts/moysklad-create-fta-vat-q2-paymentout-20260713.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const { uaeToday, uaeMomentAt } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const AGENT_ID = 'f9682818-4284-11ef-0a80-07aa00367bc7' // Federal TAX
const EXPENSE_ITEM_ID = '8dcf6506-0a01-11e4-835f-002590a32f46' // Налоги и сборы
const STATE_PAID_ID = 'e7020a99-d671-11ea-0a80-0216000f3623'

const SUM_MINOR = 2158577 // 21,585.77 AED
const FTA_REF = '392084'
const GIBAN = 'AE378680104229886700003'
const TRN = '104229886700003'
const MARKER = `FTA-VAT-Q2-2026-REF-${FTA_REF}`

const DESCRIPTION = [
  'Q22026 TAX',
  `FTA ref ${FTA_REF}`,
  `GIBAN ${GIBAN}`,
  `TRN ${TRN}`,
  MARKER,
].join(' | ')

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
  const search = await api('GET', `/entity/paymentout?search=${encodeURIComponent(MARKER)}&limit=5`)
  if (search.rows?.length) {
    throw new Error(`Duplicate: ${search.rows[0].name} (${search.rows[0].id})`)
  }

  const filter = [
    `agent=${API}/entity/counterparty/${AGENT_ID}`,
    `moment>=2026-07-13 00:00:00`,
    `moment<=2026-07-13 23:59:59`,
  ].join(';')
  const today = await api('GET', `/entity/paymentout?filter=${encodeURIComponent(filter)}&limit=50`)
  const dup = (today.rows || []).find((r) => r.sum === SUM_MINOR)
  if (dup) throw new Error(`Duplicate today: ${dup.name} (${dup.id})`)
}

async function main() {
  console.log('====================================================================')
  console.log('  FTA — VAT Q2 2026 paymentout')
  console.log('====================================================================')
  console.log(`  Mode : ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Date : 2026-07-13`)
  console.log(`  Sum  : ${money(SUM_MINOR)} AED`)
  console.log(`  Ref  : ${FTA_REF}`)
  console.log(`  GIBAN: ${GIBAN}`)

  const [agent, expense] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/expenseitem/${EXPENSE_ITEM_ID}`),
  ])
  console.log(`  Agent  : ${agent.name}`)
  console.log(`  Expense: ${expense.name}`)

  if (COMMIT) await ensureNoDuplicate()

  const payload = {
    moment: uaeMomentAt(15, 48, 0),
    applicable: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    expenseItem: href('expenseitem', EXPENSE_ITEM_ID),
    state: stateHref(STATE_PAID_ID),
    sum: SUM_MINOR,
    paymentPurpose: `VAT Q2 2026 FTA payment ${money(SUM_MINOR)} AED ref ${FTA_REF}`,
    description: DESCRIPTION,
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const created = await api('POST', '/entity/paymentout', payload)
  console.log(`\n  Paymentout: ${created.name} | ${money(created.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#paymentout/edit?id=${created.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
