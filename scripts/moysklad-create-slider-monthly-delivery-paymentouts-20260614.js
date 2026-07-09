#!/usr/bin/env node

/**
 * Slider last-mile delivery — monthly expense booking (H1 2026 catch-up).
 *
 * 1. Ensures expense item "Last-mile delivery" exists (creates it if missing).
 * 2. Posts one paymentout per month against SLIDER DELIVERY SERVICE, sum =
 *    Slider tax-invoice "Total Paid Amount" for that month.
 *
 * Source: 6 monthly Slider tax invoices (#13171-20260614-21xx), which reconcile
 * exactly to the consolidated invoice #13171-20260614-2110 (Jan 1 .. Jun 14):
 *   Total Order Cost 6,862.97 + VAT 384.54 ; Total Paid 8,072.51 AED.
 *
 * Note on amounts: each monthly paymentout uses "Total Paid Amount" (full cash
 * cost to Genosys = delivery fees + any platform/subscription fee). The net
 * order cost and the recoverable input VAT (5%) are recorded in the description
 * so the accountant can claim the VAT column on the relevant FTA return.
 * Jan/Feb carry a +230 fixed fee, Mar +275, Apr +90, May/Jun none.
 *
 *   node --import dotenv/config scripts/moysklad-create-slider-monthly-delivery-paymentouts-20260614.js
 *   node --import dotenv/config scripts/moysklad-create-slider-monthly-delivery-paymentouts-20260614.js --commit
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
const AGENT_ID = '618d9654-6814-11f1-0a80-009900893877' // SLIDER DELIVERY SERVICE
const STATE_PAID_ID = 'e7020a99-d671-11ea-0a80-0216000f3623'
const EXPENSE_ITEM_NAME = 'Last-mile delivery'

// All amounts in AED. orders/net/vat for documentation; paid = paymentout sum.
const MONTHS = [
  { key: '2026-01', label: 'Jan 2026', moment: '2026-01-31 12:00:00', inv: '2111', orders: 27, net: 485.96, vat: 35.82, paid: 751.78 },
  { key: '2026-02', label: 'Feb 2026', moment: '2026-02-28 12:00:00', inv: '2112', orders: 33, net: 637.98, vat: 43.42, paid: 911.40 },
  { key: '2026-03', label: 'Mar 2026', moment: '2026-03-31 12:00:00', inv: '2113', orders: 85, net: 1540.93, vat: 90.80, paid: 1906.73 },
  { key: '2026-04', label: 'Apr 2026', moment: '2026-04-30 12:00:00', inv: '2113', orders: 68, net: 1281.69, vat: 68.62, paid: 1440.31 },
  { key: '2026-05', label: 'May 2026', moment: '2026-05-31 12:00:00', inv: '2114', orders: 78, net: 1615.89, vat: 80.82, paid: 1696.71 },
  { key: '2026-06', label: 'Jun 2026 (1-14)', moment: '2026-06-14 12:00:00', inv: '2114', orders: 60, net: 1300.52, vat: 65.06, paid: 1365.58 },
]

const minor = (aed) => Math.round(aed * 100)

async function api(method, path, body) {
  const res = await fetch(path.startsWith('http') ? path : API + path, {
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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${path} - ${text.slice(0, 1400)}`)
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

async function ensureExpenseItem() {
  const data = await api('GET', `/entity/expenseitem?limit=100`)
  const found = (data.rows || []).find((e) => e.name === EXPENSE_ITEM_NAME)
  if (found) {
    console.log(`  Expense item exists: ${found.name} (${found.id})`)
    return found.id
  }
  if (!COMMIT) {
    console.log(`  Expense item "${EXPENSE_ITEM_NAME}" MISSING — would be created on --commit.`)
    return null
  }
  const created = await api('POST', '/entity/expenseitem', { name: EXPENSE_ITEM_NAME })
  console.log(`  Created expense item: ${created.name} (${created.id})`)
  return created.id
}

async function existsForMonth(m) {
  const filter = [
    `agent=${API}/entity/counterparty/${AGENT_ID}`,
    `moment>=${m.moment.slice(0, 7)}-01 00:00:00`,
  ].join(';')
  const data = await api('GET', `/entity/paymentout?filter=${encodeURIComponent(filter)}&limit=100`)
  return (data.rows || []).find(
    (r) => (r.description || '').includes(`SLIDER-DELIV-${m.key}`)
  )
}

async function main() {
  console.log('====================================================================')
  console.log('  Slider — monthly last-mile delivery paymentouts (H1 2026)')
  console.log('====================================================================')
  console.log(`  Mode : ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const expenseItemId = await ensureExpenseItem()

  const totalPaid = MONTHS.reduce((s, m) => s + m.paid, 0)
  const totalVat = MONTHS.reduce((s, m) => s + m.vat, 0)
  console.log(`\n  Months : ${MONTHS.length}`)
  console.log(`  Σ Paid : ${totalPaid.toFixed(2)} AED  (expect 8072.51)`)
  console.log(`  Σ VAT  : ${totalVat.toFixed(2)} AED  (recoverable input VAT, expect 384.54)\n`)

  for (const m of MONTHS) {
    const desc = [
      `Slider last-mile delivery — ${m.label}`,
      `${m.orders} orders; net ${m.net.toFixed(2)} + VAT ${m.vat.toFixed(2)} = paid ${m.paid.toFixed(2)} AED`,
      `Tax invoice #13171-20260614-${m.inv}`,
      `SLIDER-DELIV-${m.key}`,
    ].join('\n')

    if (COMMIT) {
      const dup = await existsForMonth(m)
      if (dup) {
        console.log(`  ${m.label.padEnd(16)} SKIP — already posted (${dup.name}, id=${dup.id})`)
        continue
      }
    }

    const payload = {
      moment: m.moment,
      applicable: true,
      organization: href('organization', ORG_ID),
      agent: href('counterparty', AGENT_ID),
      state: stateHref(STATE_PAID_ID),
      sum: minor(m.paid),
      description: desc,
      ...(expenseItemId ? { expenseItem: href('expenseitem', expenseItemId) } : {}),
    }

    if (!COMMIT) {
      console.log(`  ${m.label.padEnd(16)} ${m.paid.toFixed(2)} AED  (${m.moment})  inv ${m.inv}`)
      continue
    }

    const created = await api('POST', '/entity/paymentout', payload)
    console.log(`  ${m.label.padEnd(16)} ${m.paid.toFixed(2)} AED  -> ${created.name} (id=${created.id})`)
  }

  if (!COMMIT) console.log('\n  DRY RUN — re-run with --commit.')
  else console.log('\n  DONE.')
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
