#!/usr/bin/env node

/**
 * Salary payout to Vadim Sagatdinov — 30,000.00 AED (August 2026).
 *
 *   node --import dotenv/config scripts/moysklad-create-salary-paymentout-aug-30000-20260821.js
 *   node --import dotenv/config scripts/moysklad-create-salary-paymentout-aug-30000-20260821.js --commit
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
const AGENT_ID = 'dca6eab9-4a97-11f0-0a80-0174004a3bb2' // Vadim Sagatdinov
const EXPENSE_ITEM_ID = 'e0837fc6-22c9-11eb-0a80-05d400307e01' // Salary
const STATE_PAID_ID = 'e7020a99-d671-11ea-0a80-0216000f3623'

const SUM_MINOR = 3000000 // 30,000.00 AED
const MARKER = `SALARY-SAGATDINOV-AUG-30000-${uaeToday()}`

async function api(method, pathStr, body, attempt = 1) {
  const url = pathStr.startsWith('http') ? pathStr : API + pathStr
  try {
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: AUTH,
        Accept: 'application/json;charset=utf-8',
        'Accept-Encoding': 'gzip',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(60000),
    })
    const text = await res.text()
    if ((res.status === 429 || res.status >= 500) && attempt < 8) {
      await new Promise((r) => setTimeout(r, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    const retryable =
      e.cause?.code === 'ECONNRESET' ||
      e.cause?.code === 'UND_ERR_CONNECT_TIMEOUT' ||
      e.name === 'TimeoutError' ||
      e.message === 'fetch failed'
    if (attempt < 8 && retryable) {
      await new Promise((r) => setTimeout(r, 2000 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    throw e
  }
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
  const byMarker = await api('GET', `/entity/paymentout?search=${encodeURIComponent(MARKER)}&limit=5`)
  if (byMarker.rows?.length) {
    throw new Error(`Duplicate marker: ${byMarker.rows[0].name}`)
  }
  const aug = await api(
    'GET',
    `/entity/paymentout?search=${encodeURIComponent('Salary August 2026')}&limit=10&expand=agent,expenseItem`,
  )
  const hit = (aug.rows || []).find(
    (r) =>
      r.agent?.meta?.href?.includes(AGENT_ID) &&
      r.expenseItem?.meta?.href?.includes(EXPENSE_ITEM_ID) &&
      Number(r.sum) === SUM_MINOR,
  )
  if (hit) throw new Error(`Already exists: ${hit.name} (${money(hit.sum)} AED)`)
}

async function main() {
  console.log('====================================================================')
  console.log('  Salary August 2026 → Vadim Sagatdinov')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Sum : ${money(SUM_MINOR)} AED`)

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  const expense = await api('GET', `/entity/expenseitem/${EXPENSE_ITEM_ID}`)
  if (!/sagatdinov/i.test(agent.name)) throw new Error(`Unexpected payee: ${agent.name}`)
  if (!/salary/i.test(expense.name)) throw new Error(`Unexpected expense: ${expense.name}`)
  console.log(`  Payee   : ${agent.name}`)
  console.log(`  Expense : ${expense.name}`)

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
    paymentPurpose: `Salary August 2026 ${money(SUM_MINOR)} AED — Sagatdinov [${MARKER}]`,
    description: `Salary August 2026 — Sagatdinov | ${MARKER}`,
  })

  console.log(`\n  Paymentout: ${created.name} | ${money(created.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#paymentout/edit?id=${created.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
