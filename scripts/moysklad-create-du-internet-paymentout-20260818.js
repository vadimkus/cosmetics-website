#!/usr/bin/env node

/**
 * DU — office internet / mobile (paid 18 Aug 2026 17:24, Apple Pay).
 * SMS: 247.75 AED, acct 1.80097938, txn 002200995578, VADIM.
 *
 *   node --import dotenv/config scripts/moysklad-create-du-internet-paymentout-20260818.js
 *   node --import dotenv/config scripts/moysklad-create-du-internet-paymentout-20260818.js --commit
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
const AGENT_ID = '1bf9175d-4910-11f0-0a80-13c800353b3d' // DU
const EXPENSE_ITEM_ID = 'e4a42ce6-43c2-11eb-0a80-05e500017674' // Mobile plan
const STATE_PAID_ID = 'e7020a99-d671-11ea-0a80-0216000f3623'

const SUM_MINOR = 24775
const DU_ACCOUNT = '1.80097938'
const DU_TXN = '002200995578'
const MARKER = `DU-OFFICE-INTERNET-${DU_TXN}`
const DESCRIPTION = [
  `DU office internet monthly>> ${(SUM_MINOR / 100).toFixed(2)}`,
  `acct ${DU_ACCOUNT}`,
  `txn ${DU_TXN}`,
  'Apple Pay',
  '2026-08-18 17:24',
  'SMS VADIM',
].join(' | ')

async function api(method, pathStr, body, attempt = 1) {
  const url = pathStr.startsWith('http') ? pathStr : API + pathStr
  try {
    const res = await fetch(url, {
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
    if ((res.status === 429 || res.status >= 500) && attempt < 8) {
      await new Promise((r) => setTimeout(r, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    if (attempt < 5 && (e.message === 'fetch failed' || e.cause?.code === 'ECONNRESET')) {
      await new Promise((r) => setTimeout(r, 1500 * attempt))
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
  const byTxn = await api('GET', `/entity/paymentout?search=${encodeURIComponent(DU_TXN)}&limit=5`)
  if ((byTxn.rows || []).some((r) => (r.description || '').includes(DU_TXN))) {
    throw new Error(`DU txn already posted: ${byTxn.rows[0].name}`)
  }
  const filter = [
    `agent=${API}/entity/counterparty/${AGENT_ID}`,
    `moment>=${uaeToday()} 00:00:00`,
    `moment<=${uaeToday()} 23:59:59`,
  ].join(';')
  const today = await api('GET', `/entity/paymentout?filter=${encodeURIComponent(filter)}&limit=100`)
  const dup = (today.rows || []).find((r) => r.sum === SUM_MINOR)
  if (dup) throw new Error(`DU ${money(SUM_MINOR)} already posted today (${dup.name})`)
}

async function main() {
  console.log('====================================================================')
  console.log('  DU — office internet monthly (paymentout, Apple Pay)')
  console.log('====================================================================')
  console.log(`  Mode : ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Sum  : ${money(SUM_MINOR)} AED`)
  console.log(`  Acct : ${DU_ACCOUNT}`)
  console.log(`  Txn  : ${DU_TXN}`)

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
    moment: uaeMomentAt(17, 24),
    applicable: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    expenseItem: href('expenseitem', EXPENSE_ITEM_ID),
    state: stateHref(STATE_PAID_ID),
    sum: SUM_MINOR,
    paymentPurpose: `DU office internet monthly ${money(SUM_MINOR)} AED acct ${DU_ACCOUNT} [${MARKER}]`,
    description: `${DESCRIPTION}\n${MARKER}`,
  })

  console.log(`\n  Paymentout: ${created.name} | ${money(created.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#paymentout/edit?id=${created.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
