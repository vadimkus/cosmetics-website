#!/usr/bin/env node

/**
 * RAKEZ — corporate amendment advance payment (5,394.30 AED).
 * Paid 2026-05-20 from owner personal account (receipt 5800833261 / REC-1022930).
 * Expense: Company/Trade License Cost → Partners' CA (Due to Vadim).
 *
 *   node --import dotenv/config scripts/moysklad-create-rakez-amendment-paymentout-20260520.js
 *   node --import dotenv/config scripts/moysklad-create-rakez-amendment-paymentout-20260520.js --commit
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
const AGENT_ID = 'a27297ba-834f-11ea-0a80-021800281da1' // RAKEZ
const EXPENSE_ITEM_ID = '942342b9-8350-11ea-0a80-021900290424' // Company/Trade License Cost
const STATE_PAID_ID = 'e7020a99-d671-11ea-0a80-0216000f3623'

const MOMENT = '2026-05-20 12:00:00'
const SUM_MINOR = 539430 // 5,394.30 AED
const MARKER = 'RAKEZ-AMENDMENT-5800833261-539430'
const DESCRIPTION = [
  'RAKEZ corporate amendment — advance payment 5,394.30 AED',
  'Receipt 5800833261 / REC-1022930 (20 May 2026)',
  'Paid from owner personal account — Partners CA (Due to Vadim)',
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
  const byPurpose = await api(
    'GET',
    `/entity/paymentout?filter=${encodeURIComponent(`paymentPurpose~${MARKER}`)}&limit=5`
  )
  if (byPurpose.rows?.length) {
    throw new Error(`Duplicate: ${byPurpose.rows[0].name} (${byPurpose.rows[0].id})`)
  }
  const search = await api('GET', `/entity/paymentout?search=${encodeURIComponent(MARKER)}&limit=5`)
  if (search.rows?.length) {
    throw new Error(`Duplicate search: ${search.rows[0].name}`)
  }
}

async function main() {
  console.log('====================================================================')
  console.log('  RAKEZ — corporate amendment (owner personal payment)')
  console.log('====================================================================')
  console.log(`  Mode : ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Date : ${MOMENT.slice(0, 10)}`)
  console.log(`  Sum  : ${money(SUM_MINOR)} AED`)

  const [agent, expense] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/expenseitem/${EXPENSE_ITEM_ID}`),
  ])
  console.log(`  Agent  : ${agent.name}`)
  console.log(`  Expense: ${expense.name}`)

  if (COMMIT) await ensureNoDuplicate()

  const payload = {
    moment: MOMENT,
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
