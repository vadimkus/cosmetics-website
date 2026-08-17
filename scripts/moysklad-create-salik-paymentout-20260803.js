#!/usr/bin/env node

/**
 * Salik — road toll 200 AED via Digital Dubai / Apple Pay (3 Aug 2026).
 * Ref P1111875238 | card 409887******4920 | Wio Business → Digital dubai
 *
 *   node --import dotenv/config scripts/moysklad-create-salik-paymentout-20260803.js
 *   node --import dotenv/config scripts/moysklad-create-salik-paymentout-20260803.js --commit
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
const AGENT_ID = '30936147-8516-11f0-0a80-0028002855c0' // Salik
const EXPENSE_ITEM_ID = '2af5ccb4-8a56-11eb-0a80-02a7001fb62a' // Car Fuel/Salik
const STATE_PAID_ID = 'e7020a99-d671-11ea-0a80-0216000f3623'

const PAY_DATE = '2026-08-03'
const PAY_MOMENT = '2026-08-03 23:46:31'
const SUM_MINOR = 20000 // 200.00 AED
const REF = 'P1111875238'
const CARD = '409887******4920'
const MARKER = `SALIK-DIGITALDUBAI-${REF}`

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
    if (res.status === 429 && attempt < 8) {
      await new Promise((r) => setTimeout(r, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
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
  const search = await api('GET', `/entity/paymentout?search=${encodeURIComponent(MARKER)}&limit=5`)
  if (search.rows?.length) {
    throw new Error(`Duplicate: ${search.rows[0].name} (${search.rows[0].id})`)
  }
  const byRef = await api('GET', `/entity/paymentout?search=${encodeURIComponent(REF)}&limit=5`)
  if (byRef.rows?.length) {
    throw new Error(`Ref already posted: ${byRef.rows[0].name} (${byRef.rows[0].id})`)
  }
}

async function main() {
  console.log('====================================================================')
  console.log('  Salik — road toll (paymentout, Digital Dubai / Apple Pay)')
  console.log('====================================================================')
  console.log(`  Mode : ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Date : ${PAY_DATE} (${PAY_MOMENT})`)
  console.log(`  Sum  : ${money(SUM_MINOR)} AED`)
  console.log(`  Ref  : ${REF} | card ${CARD}`)

  const [agent, expense] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/expenseitem/${EXPENSE_ITEM_ID}`),
  ])
  console.log(`  Agent  : ${agent.name}`)
  console.log(`  Expense: ${expense.name}`)

  if (COMMIT) await ensureNoDuplicate()

  const purpose = [
    'Salik road toll — 200.00 AED',
    `txn ${REF}`,
    `Apple Pay Wio ${CARD}`,
    'Digital dubai',
    MARKER,
  ].join(' | ')

  const payload = {
    moment: PAY_MOMENT,
    applicable: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    expenseItem: href('expenseitem', EXPENSE_ITEM_ID),
    state: stateHref(STATE_PAID_ID),
    sum: SUM_MINOR,
    paymentPurpose: purpose,
    description: purpose,
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
