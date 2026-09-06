#!/usr/bin/env node

/**
 * DESCO COPY CENTRE — business cards 300 pcs. Tax invoice OFF/8184/26.
 * 383.25 AED paid card *6712. Same agent + expense as Jan paymentout 00538.
 *
 *   node --import dotenv/config scripts/moysklad-create-desco-business-cards-paymentout-20260904.js
 *   node --import dotenv/config scripts/moysklad-create-desco-business-cards-paymentout-20260904.js --commit
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
const AGENT_ID = 'dcc60826-fd26-11f0-0a80-0dd500123b1c'
const EXPENSE_ITEM_ID = 'd383d156-e7f6-11f0-0a80-1c2f005c67f1'
const STATE_PAID_ID = 'e7020a99-d671-11ea-0a80-0216000f3623'

const SUM_MINOR = 38325
const BILL_NO = 'OFF/8184/26'
const MOMENT = '2026-09-05 19:00:00'
const MARKER = `DESCO-CARDS-300-${BILL_NO.replace(/\//g, '-')}`
const DESCRIPTION = [
  `DESCO business cards 300 pcs 350gsm ${ (SUM_MINOR / 100).toFixed(2) } AED`,
  `bill ${BILL_NO}`,
  '5-Sep-26 19:00',
  'card *6712',
  '375 + VAT 18.75 − disc 10.50 = 383.25',
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
  const byMarker = await api('GET', `/entity/paymentout?search=${encodeURIComponent(MARKER)}&limit=10`)
  if ((byMarker.rows || []).some((r) => (r.description || '').includes(MARKER) || (r.paymentPurpose || '').includes(MARKER))) {
    throw new Error(`Duplicate marker: ${byMarker.rows[0].name}`)
  }
  const filter = [
    `agent=${API}/entity/counterparty/${AGENT_ID}`,
    `moment>=2026-09-04 00:00:00`,
    `moment<=2026-09-06 23:59:59`,
  ].join(';')
  const recent = await api('GET', `/entity/paymentout?filter=${encodeURIComponent(filter)}&limit=50`)
  const dup = (recent.rows || []).find((r) => r.sum === SUM_MINOR)
  if (dup) throw new Error(`DESCO ${money(SUM_MINOR)} already posted (${dup.name})`)
}

async function main() {
  console.log('====================================================================')
  console.log('  DESCO — business cards 300 pcs (paymentout)')
  console.log('====================================================================')
  console.log(`  Mode : ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Date : ${MOMENT}`)
  console.log(`  Bill : ${BILL_NO}`)
  console.log(`  Sum  : ${money(SUM_MINOR)} AED`)

  const [agent, expense] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/expenseitem/${EXPENSE_ITEM_ID}`),
  ])
  console.log(`  Agent  : ${agent.name}`)
  console.log(`  Expense: ${expense.name}`)
  if (agent.name !== 'DESCO-OFFICE PARK') throw new Error(`Unexpected agent ${agent.name}`)
  if (expense.name !== 'Office equipment') throw new Error(`Unexpected expense ${expense.name}`)

  if (COMMIT) await ensureNoDuplicate()

  if (!COMMIT) {
    console.log(`  Desc : ${DESCRIPTION}`)
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const created = await api('POST', '/entity/paymentout', {
    moment: MOMENT,
    applicable: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    expenseItem: href('expenseitem', EXPENSE_ITEM_ID),
    state: stateHref(STATE_PAID_ID),
    sum: SUM_MINOR,
    paymentPurpose: `DESCO business cards 300 pcs ${money(SUM_MINOR)} AED ${BILL_NO} [${MARKER}]`,
    description: `${DESCRIPTION}\n${MARKER}`,
  })

  console.log(`\n  Paymentout: ${created.name} | ${money(created.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#paymentout/edit?id=${created.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
