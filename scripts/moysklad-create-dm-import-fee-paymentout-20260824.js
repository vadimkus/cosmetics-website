#!/usr/bin/env node

/**
 * Dubai Municipality — import fee paymentout (70 AED).
 *
 * CPIP-240826-087435 | Payment voucher RSSFYS202600631895
 * DM GME 260810 (Korea air, BOE 24 Aug 2026)
 *
 *   node --import dotenv/config scripts/moysklad-create-dm-import-fee-paymentout-20260824.js
 *   node --import dotenv/config scripts/moysklad-create-dm-import-fee-paymentout-20260824.js --commit
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
const AGENT_ID = 'b9953702-a820-11ea-0a80-09c40006bcda' // Dubai Municipality
const EXPENSE_ITEM_ID = '1774e363-e755-11ea-0a80-04e200022edb' // DM Import Fee
const STATE_PAID_ID = 'e7020a99-d671-11ea-0a80-0216000f3623'

const SUM_MINOR = 7000 // 70.00 AED
const CPIP = 'CPIP-240826-087435'
const VOUCHER = 'RSSFYS202600631895'
const DESCRIPTION = [
  `DM Import Fee 70 AED — ${CPIP}`,
  `Payment voucher ${VOUCHER}`,
  'DM GME 260810 Korea air / BOE 24 Aug 2026',
].join(' | ')
const MARKER = `DM-IMPORT-FEE-${CPIP}`

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
  for (const q of [CPIP, VOUCHER, MARKER]) {
    const data = await api('GET', `/entity/paymentout?search=${encodeURIComponent(q)}&limit=8`)
    const hit = (data.rows || []).find((r) => {
      const blob = `${r.description || ''} ${r.paymentPurpose || ''}`
      return blob.includes(CPIP) || blob.includes(VOUCHER) || blob.includes(MARKER)
    })
    if (hit) throw new Error(`Duplicate: ${hit.name} already references ${q}`)
  }
}

async function main() {
  console.log('====================================================================')
  console.log('  Dubai Municipality — import fee (paymentout)')
  console.log('====================================================================')
  console.log(`  Mode : ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Sum  : ${money(SUM_MINOR)} AED`)
  console.log(`  CPIP : ${CPIP}`)
  console.log(`  Vchr : ${VOUCHER}`)

  const [agent, expense] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/expenseitem/${EXPENSE_ITEM_ID}`),
  ])
  console.log(`  Agent  : ${agent.name}`)
  console.log(`  Expense: ${expense.name}`)

  await ensureNoDuplicate()

  if (!COMMIT) {
    console.log(`  Desc   : ${DESCRIPTION}`)
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
    description: DESCRIPTION,
    paymentPurpose: MARKER,
  })

  console.log(`\n  Created: ${created.name} | ${money(created.sum)} AED | ${created.moment}`)
  console.log(`  https://online.moysklad.ru/app/#paymentout/edit?id=${created.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
