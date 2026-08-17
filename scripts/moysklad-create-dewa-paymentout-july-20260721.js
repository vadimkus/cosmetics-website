#!/usr/bin/env node

/**
 * DEWA — July 2026 bill (11 Jun – 10 Jul 2026), paid 2026-07-21.
 * Amount: 1,755.86 AED | Acct 2049209886 | Txn NPIB00000000000010950758
 *
 *   node --import dotenv/config scripts/moysklad-create-dewa-paymentout-july-20260721.js
 *   node --import dotenv/config scripts/moysklad-create-dewa-paymentout-july-20260721.js --commit
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
const AGENT_ID = 'ff7ac643-7e69-11f0-0a80-143e00084b94' // DEWA
const EXPENSE_ITEM_ID = '3d0c016f-8a55-11eb-0a80-0761001fb459' // DEWA and Electricity
const STATE_PAID_ID = 'e7020a99-d671-11ea-0a80-0216000f3623'

const SUM_MINOR = 175586 // 1,755.86 AED
const BILL_PERIOD = 'July 2026'
const TXN = 'NPIB00000000000010950758'
const ACCOUNT = '2049209886'
const MARKER = `DEWA-JULY-2026-${uaeToday()}`

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
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    if (attempt < 5 && (e.cause?.code === 'UND_ERR_CONNECT_TIMEOUT' || e.message === 'fetch failed')) {
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
  const byTxn = await api('GET', `/entity/paymentout?search=${encodeURIComponent(TXN)}&limit=5`)
  if ((byTxn.rows || []).some((r) => (r.description || '').includes(TXN))) {
    throw new Error(`DEWA txn already posted: ${byTxn.rows[0].name}`)
  }
}

async function main() {
  console.log('====================================================================')
  console.log('  DEWA — July 2026 bill (paymentout)')
  console.log('====================================================================')
  console.log(`  Mode : ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Sum  : ${money(SUM_MINOR)} AED`)
  console.log(`  Acct : ${ACCOUNT}`)
  console.log(`  Txn  : ${TXN}`)

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
    paymentPurpose: `DEWA ${BILL_PERIOD} ${money(SUM_MINOR)} AED acct ${ACCOUNT} [${MARKER}]`,
    description: [
      `DEWA ${BILL_PERIOD}>> ${money(SUM_MINOR)}`,
      `Period 11 Jun – 10 Jul 2026 | Acct ${ACCOUNT}`,
      `Elec 904.83 + Water 96.95 + Housing 710.42 + Sewerage 43.66`,
      `Txn ${TXN}`,
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
