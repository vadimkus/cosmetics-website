#!/usr/bin/env node

/**
 * Cordoba Residence — monthly office rent paymentout (July 2026).
 * Same as June 00613 / May 00601 — 14 208.30 AED, expense "Office monthly rent".
 * Paid from personal account; booked in MoySklad as company expense.
 *
 *   node --import dotenv/config scripts/moysklad-create-cordoba-office-rent-paymentout-20260728.js
 *   node --import dotenv/config scripts/moysklad-create-cordoba-office-rent-paymentout-20260728.js --commit
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
const AGENT_ID = 'beb1ce0a-a91d-11f0-0a80-0ec60014fd48' // Cordoba Residence
const EXPENSE_ITEM_ID = '102351bb-be0a-11eb-0a80-0060000abc0e' // Office monthly rent
const STATE_PAID_ID = 'e7020a99-d671-11ea-0a80-0216000f3623'

const SUM_MINOR = 1420830 // 14 208.30 AED
const DESCRIPTION = '14 208, 30 AED Monthly office rent'
const MARKER = `CORDOBA-OFFICE-RENT-${uaeToday()}`

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
  const filter = [
    `agent=${API}/entity/counterparty/${AGENT_ID}`,
    `moment>=${uaeToday()} 00:00:00`,
    `moment<=${uaeToday()} 23:59:59`,
  ].join(';')
  const data = await api('GET', `/entity/paymentout?filter=${encodeURIComponent(filter)}&limit=100`)
  const dup = (data.rows || []).find(
    (r) => r.sum === SUM_MINOR && (r.description || '').includes('Monthly office rent'),
  )
  if (dup) throw new Error(`Duplicate rent payment today (${dup.name}, id=${dup.id})`)

  const monthStart = `${uaeToday().slice(0, 7)}-01`
  const monthFilter = [
    `agent=${API}/entity/counterparty/${AGENT_ID}`,
    `moment>=${monthStart} 00:00:00`,
  ].join(';')
  const monthData = await api('GET', `/entity/paymentout?filter=${encodeURIComponent(monthFilter)}&limit=100`)
  const monthDup = (monthData.rows || []).find(
    (r) => r.sum === SUM_MINOR && (r.description || '').includes('Monthly office rent'),
  )
  if (monthDup) {
    throw new Error(
      `This month rent already posted (${monthDup.name}, ${monthDup.moment}, id=${monthDup.id})`,
    )
  }
}

async function main() {
  console.log('====================================================================')
  console.log('  Cordoba Residence — monthly office rent (paymentout)')
  console.log('====================================================================')
  console.log(`  Mode : ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Date : ${uaeMomentNow()}`)
  console.log(`  Sum  : ${money(SUM_MINOR)} AED`)
  console.log(`  Desc : ${DESCRIPTION}`)

  const [agent, expense] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/expenseitem/${EXPENSE_ITEM_ID}`),
  ])
  console.log(`  Agent  : ${agent.name}`)
  console.log(`  Expense: ${expense.name}`)

  await ensureNoDuplicate()

  const payload = {
    moment: uaeMomentNow(),
    applicable: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    expenseItem: href('expenseitem', EXPENSE_ITEM_ID),
    state: stateHref(STATE_PAID_ID),
    sum: SUM_MINOR,
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
