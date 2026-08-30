#!/usr/bin/env node

/**
 * Tasjeel.ae / Host Arabia — genosys.ae hosting + domain 1 year (25 Sep 2026–24 Sep 2027).
 * Invoice 497124 / 530.25 AED / card txn_3U9n1bEnYxLG5A871A2YHeNx / 29 Aug 2026.
 *
 *   node --import dotenv/config scripts/moysklad-create-tasjeel-hosting-paymentout-20260829.js
 *   node --import dotenv/config scripts/moysklad-create-tasjeel-hosting-paymentout-20260829.js --commit
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
const AGENT_ID = 'e9be59e0-e753-11ea-0a80-09c900020346'
const EXPENSE_ITEM_ID = 'b9374d2c-897b-11ea-0a80-00ef000b194a'
const STATE_PAID_ID = 'e7020a99-d671-11ea-0a80-0216000f3623'

const SUM_MINOR = 53025
const INVOICE = '497124'
const TXN = 'txn_3U9n1bEnYxLG5A871A2YHeNx'
const MARKER = `TASJEEL-HOSTING-${INVOICE}`

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
    })
    const text = await res.text()
    if ((res.status === 429 || res.status >= 500) && attempt < 8) {
      await new Promise((r) => setTimeout(r, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
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
  if ((byMarker.rows || []).some((r) => (r.description || '').includes(MARKER))) {
    throw new Error(`Duplicate marker: ${byMarker.rows[0].name}`)
  }
  const byInv = await api('GET', `/entity/paymentout?search=${encodeURIComponent(INVOICE)}&limit=5`)
  if ((byInv.rows || []).some((r) => (r.description || '').includes(INVOICE))) {
    throw new Error(`Invoice ${INVOICE} already posted: ${byInv.rows[0].name}`)
  }
  const filter = [
    `agent=${API}/entity/counterparty/${AGENT_ID}`,
    `moment>=${uaeToday()} 00:00:00`,
    `moment<=${uaeToday()} 23:59:59`,
  ].join(';')
  const today = await api('GET', `/entity/paymentout?filter=${encodeURIComponent(filter)}&limit=100`)
  const dup = (today.rows || []).find((r) => r.sum === SUM_MINOR)
  if (dup) throw new Error(`Tasjeel ${money(SUM_MINOR)} already posted today (${dup.name})`)
}

async function main() {
  console.log('====================================================================')
  console.log('  Tasjeel.ae — genosys.ae hosting + domain 1 year')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Sum : ${money(SUM_MINOR)} AED`)
  console.log(`  Inv : ${INVOICE}`)
  console.log(`  Txn : ${TXN}`)

  const [agent, expense] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/expenseitem/${EXPENSE_ITEM_ID}`),
  ])
  console.log(`  Payee  : ${agent.name}`)
  console.log(`  Expense: ${expense.name}`)
  if (agent.name !== 'Tasjeel.ae') throw new Error(`Unexpected payee: ${agent.name}`)
  if (expense.name !== 'Software Rental Fee') throw new Error(`Unexpected expense: ${expense.name}`)

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
    paymentPurpose: `genosys.ae hosting + domain 1 year ${money(SUM_MINOR)} AED inv ${INVOICE} [${MARKER}]`,
    description: [
      'Website hosting/domain name 1 year subscription',
      `Host Arabia FZ-LLC inv ${INVOICE}`,
      'Unlimited Hosting 360 + domain/DNS 145 + VAT 25.25',
      'Period 25/09/2026–24/09/2027',
      `Card ${TXN}`,
      MARKER,
    ].join(' | '),
  })

  console.log(`\n  Paymentout: ${created.name} | ${money(created.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#paymentout/edit?id=${created.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
