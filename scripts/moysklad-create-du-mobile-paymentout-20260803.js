#!/usr/bin/env node

/**
 * DU — mobile monthly (paid 3 Aug 2026, Apple Pay Wio Business).
 * Receipt: 393.75 AED, acct 2856165422, txn 002191715435, Vadim Sagatdinov.
 *
 *   node --import dotenv/config scripts/moysklad-create-du-mobile-paymentout-20260803.js
 *   node --import dotenv/config scripts/moysklad-create-du-mobile-paymentout-20260803.js --commit
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
const AGENT_ID = '1bf9175d-4910-11f0-0a80-13c800353b3d' // DU
const EXPENSE_ITEM_ID = 'e4a42ce6-43c2-11eb-0a80-05e500017674' // Mobile plan
const STATE_PAID_ID = 'e7020a99-d671-11ea-0a80-0216000f3623'

const SUM_MINOR = 39375 // 393.75 AED
const DU_ACCOUNT = '2856165422'
const DU_TXN = '002191715435'
const DESCRIPTION = [
  `DU mobile monthly>> ${(SUM_MINOR / 100).toFixed(2)}`,
  `acct ${DU_ACCOUNT}`,
  `txn ${DU_TXN}`,
  'Apple Pay Wio Business',
  '2026-08-03 21:56',
].join(' | ')
const MARKER = `DU-MOBILE-MONTHLY-${DU_TXN}`

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

  const byTxn = await api('GET', `/entity/paymentout?search=${encodeURIComponent(DU_TXN)}&limit=5`)
  if (byTxn.rows?.length) {
    throw new Error(`Txn already posted: ${byTxn.rows[0].name} (${byTxn.rows[0].id})`)
  }

  const filter = [
    `agent=${API}/entity/counterparty/${AGENT_ID}`,
    `moment>=${uaeToday()} 00:00:00`,
    `moment<=${uaeToday()} 23:59:59`,
  ].join(';')
  const today = await api('GET', `/entity/paymentout?filter=${encodeURIComponent(filter)}&limit=100`)
  const dup = (today.rows || []).find((r) => r.sum === SUM_MINOR)
  if (dup) throw new Error(`DU ${money(SUM_MINOR)} already posted today (${dup.name}, id=${dup.id})`)
}

async function main() {
  console.log('====================================================================')
  console.log('  DU — mobile monthly (paymentout, Apple Pay Wio)')
  console.log('====================================================================')
  console.log(`  Mode : ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Date : ${uaeToday()} (${uaeMomentNow()})`)
  console.log(`  Sum  : ${money(SUM_MINOR)} AED`)
  console.log(`  Desc : ${DESCRIPTION}`)

  const [agent, expense] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/expenseitem/${EXPENSE_ITEM_ID}`),
  ])
  console.log(`  Agent  : ${agent.name}`)
  console.log(`  Expense: ${expense.name}`)

  if (COMMIT) await ensureNoDuplicate()

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const created = await api('POST', '/entity/paymentout', {
    moment: uaeMomentNow(),
    applicable: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    expenseItem: href('expenseitem', EXPENSE_ITEM_ID),
    state: stateHref(STATE_PAID_ID),
    sum: SUM_MINOR,
    description: `${DESCRIPTION}\n${MARKER}`,
  })

  console.log(`\n  Created: ${created.name} | ${money(created.sum)} AED | ${created.moment}`)
  console.log(`  https://online.moysklad.ru/app/#paymentout/edit?id=${created.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
