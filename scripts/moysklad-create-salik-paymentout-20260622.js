#!/usr/bin/env node

/**
 * Salik — road toll (100 AED, paid today).
 * Expense: Car Fuel/Salik (same as prior Salik paymentout 00406).
 *
 *   node --import dotenv/config scripts/moysklad-create-salik-paymentout-20260622.js
 *   node --import dotenv/config scripts/moysklad-create-salik-paymentout-20260622.js --commit
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
const AGENT_ID = '30936147-8516-11f0-0a80-0028002855c0' // Salik
const EXPENSE_ITEM_ID = '2af5ccb4-8a56-11eb-0a80-02a7001fb62a' // Car Fuel/Salik
const STATE_PAID_ID = 'e7020a99-d671-11ea-0a80-0216000f3623'

const SUM_MINOR = 10000 // 100.00 AED
const DESCRIPTION = 'Salik road toll'
const MARKER = `SALIK-TOLL-${uaeToday()}`

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
    `moment>=${uaeToday()} 00:00:00`,
    `moment<=${uaeToday()} 23:59:59`,
  ].join(';')
  const today = await api('GET', `/entity/paymentout?filter=${encodeURIComponent(filter)}&limit=100`)
  const dup = (today.rows || []).find((r) => r.sum === SUM_MINOR)
  if (dup) throw new Error(`Salik ${money(SUM_MINOR)} already posted today (${dup.name}, id=${dup.id})`)
}

async function main() {
  console.log('====================================================================')
  console.log('  Salik — road toll (paymentout, paid today)')
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

  const payload = {
    moment: uaeMomentNow(),
    applicable: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    expenseItem: href('expenseitem', EXPENSE_ITEM_ID),
    state: stateHref(STATE_PAID_ID),
    sum: SUM_MINOR,
    paymentPurpose: `${DESCRIPTION} — ${money(SUM_MINOR)} AED [${MARKER}]`,
    description: `${DESCRIPTION}\n${MARKER}`,
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
