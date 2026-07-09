#!/usr/bin/env node

/**
 * GOCOSMO BEAUTY SALON — expand commissioner report 01253 to 3,000 AED
 * + paymentin 3,000 AED (FAB transfer FT261711H65M received 20 Jun 2026).
 *
 * From 2,509 → 3,000 (+491): +2 collagen, +1 EPI peeling, +2 Snow O₂ cleanser.
 *
 *   node --import dotenv/config scripts/moysklad-gocosmo-report-01253-3000-payment-20260621.js
 *   node --import dotenv/config scripts/moysklad-gocosmo-report-01253-3000-payment-20260621.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const { uaeToday } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const AGENT_ID = '465093a9-8ae0-11ef-0a80-0b5e00108550'
const CONTRACT_ID = '4f49a970-8d22-11ef-0a80-157800079792'
const BANK_ACCOUNT_ID = 'e1852e1c-33c5-11ea-0a80-043f000b2739'
const REPORT_ID = '7efa01fb-03f9-11f1-0a80-078e0016eec2'
const REPORT_NAME = '01253'
const TARGET_SUM_MINOR = 300000
const PAYMENT_MINOR = 300000
const PAYMENT_DATE = '2026-06-20'
const PAYMENT_MOMENT = `${PAYMENT_DATE} 12:30:00`
const BANK_REF = 'FT261711H65M'
const MARKER = `GOCOSMO-REPORT-01253-3000-PAYMENT-${PAYMENT_DATE}`

/** 2,509 base +491 → 3,000 (consignment SKUs already on report 01253) */
const TARGET_QTY_BY_CODE = {
  '00189': 1,
  '00059': 2,
  '00063': 8, // +2 collagen @ 18
  '00035': 1,
  '00144': 3,
  '00129': 2, // +1 EPI @ 125
  '00021': 5, // +2 Snow O₂ @ 165
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
    `moment>=${PAYMENT_DATE} 00:00:00`,
    `moment<=${PAYMENT_DATE} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/paymentin?filter=${encodeURIComponent(filter)}`)
  const dupMarker = docs.find((d) => (d.description || '').includes(MARKER))
  if (dupMarker) throw new Error(`Duplicate payment marker (${dupMarker.name}, id=${dupMarker.id})`)
  const dupRef = docs.find(
    (d) => (d.description || '').includes(BANK_REF) && Number(d.sum) === PAYMENT_MINOR
  )
  if (dupRef) throw new Error(`Duplicate payment ref ${BANK_REF} (${dupRef.name})`)
}

async function main() {
  console.log('====================================================================')
  console.log('  GOCOSMO — report 01253 → 3,000 AED + paymentin 3,000')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Bank: FAB ${BANK_REF} · ${PAYMENT_DATE}`)

  const rep = await api('GET', `/entity/commissionreportin/${REPORT_ID}?expand=agent,contract`)
  if (rep.name !== REPORT_NAME) throw new Error(`Expected ${REPORT_NAME}, got ${rep.name}`)
  console.log(`  Report: ${rep.name} | current ${money(rep.sum)} AED | payed ${money(rep.payedSum)}`)

  const pos = await api(
    'GET',
    `/entity/commissionreportin/${REPORT_ID}/positions?limit=100&expand=assortment`
  )
  const updates = []
  let sumMinor = 0

  console.log('\n  Target lines:')
  for (const p of pos.rows || []) {
    const code = p.assortment?.code
    if (!code || TARGET_QTY_BY_CODE[code] == null) {
      throw new Error(`Unexpected position: ${code ?? p.id}`)
    }
    const newQty = TARGET_QTY_BY_CODE[code]
    const price = Math.round(Number(p.price))
    sumMinor += newQty * price
    updates.push({ p, code, newQty, price, name: p.assortment?.name, oldQty: p.quantity })
    console.log(
      `    ${code} | ${p.quantity} → ${newQty} @ ${money(price)} = ${money(newQty * price)}`
    )
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
    await api('PUT', `/entity/commissionreportin/${REPORT_ID}/positions/${u.p.id}`, {
      meta: u.p.meta,
      quantity: u.newQty,
      price: u.price,
      assortment: u.p.assortment,
      vat: u.p.vat,
      vatEnabled: u.p.vatEnabled,
      reward: u.p.reward ?? 0,
    })
  }

  const rep2 = await api('GET', `/entity/commissionreportin/${REPORT_ID}`)
  console.log(`\n  Report updated: ${rep2.name} | ${money(rep2.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#commissionreport/edit?id=${REPORT_ID}`)

  const paymentIn = await api('POST', '/entity/paymentin', {
    moment: PAYMENT_MOMENT,
    applicable: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    contract: href('contract', CONTRACT_ID),
    organizationAccount: orgAccountHref(BANK_ACCOUNT_ID),
    description: [
      `Incoming payment commissioner report ${REPORT_NAME} | ${MARKER}`,
      `FAB transfer ${BANK_REF} · AED 3,000 · Iuliia Malshonko · ${PAYMENT_DATE}`,
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

  console.log(`  Payment in: ${paymentIn.name} | ${money(paymentIn.sum)} AED | ${PAYMENT_MOMENT}`)
  console.log(`  https://online.moysklad.ru/app/#paymentin/edit?id=${paymentIn.id}`)

  const repAfter = await api('GET', `/entity/commissionreportin/${REPORT_ID}`)
  console.log('\n  Verification:')
  console.log(`    Report payedSum: ${money(repAfter.payedSum)} / ${money(repAfter.sum)} AED`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
