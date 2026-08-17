#!/usr/bin/env node

/**
 * Sales bonus payouts → Vadim Sagatdinov:
 *   2026-08-03 — 300.00 AED
 *   2026-08-06 (today) — 2,775.00 AED
 *
 *   node --import dotenv/config scripts/moysklad-create-sales-bonus-paymentouts-aug-300-2775-20260806.js
 *   node --import dotenv/config scripts/moysklad-create-sales-bonus-paymentouts-aug-300-2775-20260806.js --commit
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
const AGENT_ID = 'dca6eab9-4a97-11f0-0a80-0174004a3bb2' // Vadim Sagatdinov
const EXPENSE_ITEM_ID = 'cc9a25ab-db44-11ea-0a80-05f500290ece' // Sales Bonus
const STATE_PAID_ID = 'e7020a99-d671-11ea-0a80-0216000f3623'

const PAYOUTS = [
  {
    moment: '2026-08-03 12:00:00',
    sumMinor: 30000,
    marker: 'SALES-BONUS-SAGATDINOV-2026-08-03-300',
    label: '3 Aug 2026',
  },
  {
    moment: uaeMomentNow(),
    sumMinor: 277500,
    marker: 'SALES-BONUS-SAGATDINOV-2026-08-06-2775',
    label: '6 Aug 2026 (today)',
  },
]

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

async function ensureNoDuplicate(marker) {
  const byMarker = await api('GET', `/entity/paymentout?search=${encodeURIComponent(marker)}&limit=5`)
  if (byMarker.rows?.length) {
    throw new Error(`Duplicate marker: ${byMarker.rows[0].name} (${marker})`)
  }
}

async function main() {
  console.log('====================================================================')
  console.log('  Sales bonus → Vadim Sagatdinov — Aug 300 + Aug 2,775')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  const expense = await api('GET', `/entity/expenseitem/${EXPENSE_ITEM_ID}`)
  console.log(`  Payee   : ${agent.name}`)
  console.log(`  Expense : ${expense.name}`)

  for (const p of PAYOUTS) {
    console.log(`\n  ${p.label}: ${money(p.sumMinor)} AED | moment ${p.moment}`)
    console.log(`  Marker: ${p.marker}`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  for (const p of PAYOUTS) {
    await ensureNoDuplicate(p.marker)
    const created = await api('POST', '/entity/paymentout', {
      moment: p.moment,
      applicable: true,
      organization: href('organization', ORG_ID),
      agent: href('counterparty', AGENT_ID),
      expenseItem: href('expenseitem', EXPENSE_ITEM_ID),
      state: stateHref(STATE_PAID_ID),
      sum: p.sumMinor,
      paymentPurpose: `Sales bonus ${p.label} ${money(p.sumMinor)} AED — Sagatdinov [${p.marker}]`,
      description: `Sales bonus>>${p.label} — Sagatdinov | ${p.marker}`,
    })
    console.log(`\n  ✅ ${created.name} | ${money(created.sum)} AED | ${p.label}`)
    console.log(`     https://online.moysklad.ru/app/#paymentout/edit?id=${created.id}`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
