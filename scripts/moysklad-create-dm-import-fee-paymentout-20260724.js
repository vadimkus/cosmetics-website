#!/usr/bin/env node

/**
 * Dubai Municipality — import fee paymentout (70 AED).
 *
 * CPIP-240726-084798 | Tax inv 202600400685 | card / NgeniusPay (Iryna Kobzarenko)
 * Service: inspection of imported consumer products container shipment
 *
 *   node --import dotenv/config scripts/moysklad-create-dm-import-fee-paymentout-20260724.js
 *   node --import dotenv/config scripts/moysklad-create-dm-import-fee-paymentout-20260724.js --commit
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
const AGENT_ID = 'b9953702-a820-11ea-0a80-09c40006bcda' // Dubai Municipality
const EXPENSE_ITEM_ID = '1774e363-e755-11ea-0a80-04e200022edb' // DM Import Fee
const STATE_PAID_ID = 'e7020a99-d671-11ea-0a80-0216000f3623'

const PAY_MOMENT = '2026-07-24 12:20:00'
const SUM_MINOR = 7000 // 70.00 AED
const CPIP = 'CPIP-240726-084798'
const TAX_INV = '202600400685'
const TXN = '44202607240000198940'
const DESCRIPTION = [
  `DM Import Fee 70 AED — ${CPIP}`,
  `Tax inv ${TAX_INV}`,
  `Txn ${TXN}`,
  'Card / NgeniusPay (Iryna Kobzarenko)',
  'Container inspection — imported consumer products',
].join(' | ')
const MARKER = `DM-IMPORT-FEE-${CPIP}`

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
  const data = await api(
    'GET',
    `/entity/paymentout?filter=${encodeURIComponent(`paymentPurpose~${CPIP}`)}&limit=5`,
  )
  if ((data.rows || []).length) {
    throw new Error(`Duplicate: paymentout already exists for ${CPIP} (${data.rows[0].name})`)
  }

  const byDesc = await api('GET', `/entity/paymentout?search=${encodeURIComponent(CPIP)}&limit=5`)
  const hit = (byDesc.rows || []).find((r) => (r.description || '').includes(CPIP))
  if (hit) throw new Error(`Duplicate: ${hit.name} already references ${CPIP}`)
}

async function main() {
  console.log('====================================================================')
  console.log('  Dubai Municipality — import fee (paymentout)')
  console.log('====================================================================')
  console.log(`  Mode : ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Sum  : ${money(SUM_MINOR)} AED`)
  console.log(`  CPIP : ${CPIP}`)
  console.log(`  Tax  : ${TAX_INV}`)

  const [agent, expense] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/expenseitem/${EXPENSE_ITEM_ID}`),
  ])
  console.log(`  Agent  : ${agent.name}`)
  console.log(`  Expense: ${expense.name}`)

  if (COMMIT) await ensureNoDuplicate()

  const payload = {
    moment: PAY_MOMENT,
    applicable: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    expenseItem: href('expenseitem', EXPENSE_ITEM_ID),
    state: stateHref(STATE_PAID_ID),
    sum: SUM_MINOR,
    description: DESCRIPTION,
    paymentPurpose: MARKER,
  }

  if (!COMMIT) {
    console.log(`  Desc   : ${DESCRIPTION}`)
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
