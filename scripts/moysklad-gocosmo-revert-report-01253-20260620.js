#!/usr/bin/env node

/**
 * GOCOSMO — revert commissioner report 01253 from 5,000 → 2,509 AED
 * (original sold qty before partial-payment bump). Delete draft paymentin 05801 if unposted.
 *
 *   node --import dotenv/config scripts/moysklad-gocosmo-revert-report-01253-20260620.js
 *   node --import dotenv/config scripts/moysklad-gocosmo-revert-report-01253-20260620.js --commit
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

const REPORT_ID = '7efa01fb-03f9-11f1-0a80-078e0016eec2'
const REPORT_NAME = '01253'
const PAYMENT_ID = 'e547450f-6c8e-11f1-0a80-1beb003bc9f0'
const TARGET_SUM_MINOR = 250900

/** Original sold qty on report 01253 (before 2026-06-20 bump) */
const ORIGINAL_QTY_BY_CODE = {
  '00189': 1,
  '00059': 2,
  '00063': 6,
  '00035': 1,
  '00144': 3,
  '00129': 1,
  '00021': 3,
  '00140': 2,
}

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

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

async function main() {
  console.log('====================================================================')
  console.log('  GOCOSMO — revert report 01253 → 2,509 AED')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const rep = await api('GET', `/entity/commissionreportin/${REPORT_ID}?expand=agent`)
  console.log(`  Report: ${rep.name} | current ${money(rep.sum)} AED | payed ${money(rep.payedSum)}`)

  const pos = await api(
    'GET',
    `/entity/commissionreportin/${REPORT_ID}/positions?limit=100&expand=assortment`
  )
  const updates = []
  let sumMinor = 0

  console.log('\n  Revert lines:')
  for (const p of pos.rows || []) {
    const code = p.assortment?.code
    if (!code || ORIGINAL_QTY_BY_CODE[code] == null) {
      throw new Error(`Unexpected line: ${code ?? p.id}`)
    }
    const newQty = ORIGINAL_QTY_BY_CODE[code]
    const price = Math.round(Number(p.price))
    sumMinor += newQty * price
    updates.push({ p, code, newQty, price, name: p.assortment?.name })
    console.log(
      `    ${code} | ${p.quantity} → ${newQty} @ ${money(price)} = ${money(newQty * price)}`
    )
  }

  console.log(`\n  Target total: ${money(sumMinor)} AED (need ${money(TARGET_SUM_MINOR)})`)
  if (sumMinor !== TARGET_SUM_MINOR) {
    throw new Error(`Sum mismatch: ${sumMinor} vs ${TARGET_SUM_MINOR}`)
  }

  let pay = null
  try {
    pay = await api('GET', `/entity/paymentin/${PAYMENT_ID}`)
    console.log(`\n  Payment ${pay.name}: ${money(pay.sum)} AED | applicable: ${pay.applicable}`)
  } catch {
    console.log('\n  Payment 05801 not found — skip delete')
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  for (const u of updates) {
    const { p, newQty, price } = u
    await api('PUT', `/entity/commissionreportin/${REPORT_ID}/positions/${p.id}`, {
      meta: p.meta,
      quantity: newQty,
      price,
      assortment: p.assortment,
      vat: p.vat,
      vatEnabled: p.vatEnabled,
      reward: p.reward ?? 0,
    })
  }

  const rep2 = await api('GET', `/entity/commissionreportin/${REPORT_ID}`)
  console.log(`\n  Report updated: ${rep2.name} | ${money(rep2.sum)} AED`)

  if (pay && !pay.applicable) {
    await api('DELETE', `/entity/paymentin/${PAYMENT_ID}`)
    console.log(`  Deleted draft payment ${pay.name} (was not posted)`)
  } else if (pay?.applicable) {
    console.log('  WARNING: payment 05801 is posted — NOT deleted')
  }

  console.log(`  https://online.moysklad.ru/app/#commissionreport/edit?id=${REPORT_ID}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
