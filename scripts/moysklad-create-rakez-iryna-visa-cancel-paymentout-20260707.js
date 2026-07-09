#!/usr/bin/env node

/**
 * RAKEZ — visa cancellation for Iryna Kobzarenko (685.00 AED).
 * RAKEZ Portal 360 e-wallet top-up REC-1058659 via Visa (2026-07-07).
 * Expense: Company/Trade License Cost — paid from Wio corporate AED (Visa card).
 *
 *   node --import dotenv/config scripts/moysklad-create-rakez-iryna-visa-cancel-paymentout-20260707.js
 *   node --import dotenv/config scripts/moysklad-create-rakez-iryna-visa-cancel-paymentout-20260707.js --commit
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
const AGENT_ID = 'a27297ba-834f-11ea-0a80-021800281da1' // RAKEZ
const EXPENSE_ITEM_ID = '942342b9-8350-11ea-0a80-021900290424' // Company/Trade License Cost
const STATE_PAID_ID = 'e7020a99-d671-11ea-0a80-0216000f3623'

const SUM_MINOR = 68500 // 685.00 AED
const MARKER = 'RAKEZ-VISA-CANCEL-IRYNA-KOBZARENKO-REC-1058659-685'
const DESCRIPTION = [
  'RAKEZ — visa cancellation: Iryna Kobzarenko',
  'Portal 360 e-wallet top-up 685.00 AED — Transaction REC-1058659 (Visa, Success)',
  'Paid 2026-07-07 — Wio corporate AED account (company Visa card)',
].join('\n')

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
}

async function main() {
  console.log('====================================================================')
  console.log('  RAKEZ — Iryna Kobzarenko visa cancellation paymentout')
  console.log('====================================================================')
  console.log(`  Mode : ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Sum  : ${money(SUM_MINOR)} AED`)
  console.log(`  Ref  : REC-1058659`)

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
    paymentPurpose: `${DESCRIPTION.replace(/\n/g, ' | ')} [${MARKER}]`,
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
