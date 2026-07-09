#!/usr/bin/env node

/**
 * GOCOSMO BEAUTY SALON — expand commissioner report 01253 to 5,000 AED
 * (sold qty from existing consignment stock on report lines) + paymentin 5,000 AED.
 *
 * Contract 13. Partial settlement today; remainder next week (separate report TBD).
 *
 *   node --import dotenv/config scripts/moysklad-gocosmo-report-01253-5000-payment-20260620.js
 *   node --import dotenv/config scripts/moysklad-gocosmo-report-01253-5000-payment-20260620.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const { uaeToday, uaeMomentNow, uaeMomentAddMinutes } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const AGENT_ID = '465093a9-8ae0-11ef-0a80-0b5e00108550' // GOCOSMO BEAUTY SALON
const CONTRACT_ID = '4f49a970-8d22-11ef-0a80-157800079792' // 13
const BANK_ACCOUNT_ID = 'e1852e1c-33c5-11ea-0a80-043f000b2739'
const REPORT_ID = '7efa01fb-03f9-11f1-0a80-078e0016eec2' // 01253
const REPORT_NAME = '01253'
const TARGET_SUM_MINOR = 500000
const PAYMENT_MINOR = 500000
const MARKER = `GOCOSMO-REPORT-01253-5000-PARTIAL-${uaeToday()}`

/** Final sold qty on report 01253 — all from existing report-line SKUs / consignment stock */
const TARGET_QTY_BY_CODE = {
  '00189': 4, // Overnight mask
  '00059': 2, // EyeCell kit
  '00063': 6, // Collagen mask
  '00035': 3, // Problem control cream
  '00144': 3, // Beige cushion
  '00129': 5, // EPI peeling
  '00021': 10, // Snow O₂ cleanser
  '00140': 4, // Sea algae mask
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

async function fetchAll(pathStr) {
  const rows = []
  let offset = 0
  while (true) {
    const sep = pathStr.includes('?') ? '&' : '?'
    const data = await api('GET', `${pathStr}${sep}limit=1000&offset=${offset}`)
    rows.push(...(data.rows || []))
    if ((data.rows || []).length < 1000) break
    offset += 1000
  }
  return rows
}

function href(type, id) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

function orgAccountHref(id) {
  return {
    meta: {
      href: `${API}/entity/organization/${ORG_ID}/accounts/${id}`,
      type: 'account',
      mediaType: 'application/json',
    },
  }
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

async function ensureNoDuplicatePayment() {
  const filter = [
    `agent=${API}/entity/counterparty/${AGENT_ID}`,
    `moment>=${uaeToday()} 00:00:00`,
    `moment<=${uaeToday()} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/paymentin?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(MARKER))
  if (dup) throw new Error(`Duplicate payment marker (${dup.name}, id=${dup.id})`)
}

async function main() {
  console.log('====================================================================')
  console.log('  GOCOSMO — report 01253 → 5,000 AED + paymentin 5,000')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const rep = await api('GET', `/entity/commissionreportin/${REPORT_ID}?expand=agent,contract`)
  if (rep.name !== REPORT_NAME) throw new Error(`Expected ${REPORT_NAME}, got ${rep.name}`)
  console.log(`  Report: ${rep.name} | current sum ${money(rep.sum)} AED`)
  console.log(`  Customer: ${rep.agent?.name}`)
  console.log(`  Contract: ${rep.contract?.name}`)

  const pos = await api(
    'GET',
    `/entity/commissionreportin/${REPORT_ID}/positions?limit=100&expand=assortment`
  )
  const rows = pos.rows || []
  console.log(`\n  Target lines (sold qty):`)
  let sumMinor = 0
  const updates = []

  for (const p of rows) {
    const code = p.assortment?.code
    if (!code || TARGET_QTY_BY_CODE[code] == null) {
      throw new Error(`Unexpected position on report: ${code ?? p.id}`)
    }
    const newQty = TARGET_QTY_BY_CODE[code]
    const price = Math.round(Number(p.price))
    sumMinor += newQty * price
    updates.push({ p, code, newQty, price, name: p.assortment?.name })
    console.log(
      `    ${code} ${(p.assortment?.name || '').slice(0, 50)} | ${p.quantity} → ${newQty} @ ${money(price)} = ${money(newQty * price)}`
    )
  }

  if (Object.keys(TARGET_QTY_BY_CODE).length !== updates.length) {
    throw new Error('Report line count mismatch vs target map')
  }

  console.log(`\n  New report total: ${money(sumMinor)} AED (target ${money(TARGET_SUM_MINOR)})`)
  if (sumMinor !== TARGET_SUM_MINOR) {
    throw new Error(`Sum mismatch: got ${sumMinor}, need ${TARGET_SUM_MINOR}`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await ensureNoDuplicatePayment()

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
  console.log(`  https://online.moysklad.ru/app/#commissionreport/edit?id=${REPORT_ID}`)

  const paymentIn = await api('POST', '/entity/paymentin', {
    moment: uaeMomentAddMinutes(2),
    applicable: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    contract: href('contract', CONTRACT_ID),
    organizationAccount: orgAccountHref(BANK_ACCOUNT_ID),
    description: [
      `Incoming payment for commissioner report ${REPORT_NAME} | ${MARKER}`,
      'Partial consignment settlement 5,000 AED today; balance next week.',
    ].join(' | '),
    sum: PAYMENT_MINOR,
    operations: [
      {
        meta: {
          href: `${API}/entity/commissionreportin/${REPORT_ID}`,
          type: 'commissionreportin',
          mediaType: 'application/json',
        },
        linkedSum: PAYMENT_MINOR,
      },
    ],
  })

  console.log(`  Payment in: ${paymentIn.name} | ${money(paymentIn.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#paymentin/edit?id=${paymentIn.id}`)

  const repAfter = await api('GET', `/entity/commissionreportin/${REPORT_ID}`)
  console.log('\n  Verification:')
  console.log(`    Report payedSum: ${money(repAfter.payedSum)} / ${money(repAfter.sum)} AED`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
