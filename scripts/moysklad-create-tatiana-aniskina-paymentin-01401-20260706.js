#!/usr/bin/env node

/**
 * Tatiana Aniskina — full paymentin for commissioner report 01401 (520 AED).
 *
 *   node --import dotenv/config scripts/moysklad-create-tatiana-aniskina-paymentin-01401-20260706.js
 *   node --import dotenv/config scripts/moysklad-create-tatiana-aniskina-paymentin-01401-20260706.js --commit
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
const AGENT_ID = '603f398e-bd3d-11eb-0a80-00570009cb13' // Tatiana Aniskina Nail Master
const CONTRACT_ID = 'f68e2d8d-c3c5-11eb-0a80-05f500276179' // Agreement 00025
const BANK_ACCOUNT_ID = 'e1852e1c-33c5-11ea-0a80-043f000b2739'
const REPORT_ID = '357f9cab-7929-11f1-0a80-1a69007c55f0'
const REPORT_NAME = '01401'
const PAYMENT_MINOR = 52000 // 520.00 AED
const MARKER = `TATIANA-ANISKINA-CONSIGNMENT-PAYMENT-${REPORT_NAME}-${uaeToday()}`

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
    if (attempt < 5 && (e.cause?.code === 'ECONNRESET' || e.message === 'fetch failed')) {
      await new Promise((r) => setTimeout(r, 1500 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    throw e
  }
}

async function fetchAll(pathStr) {
  const rows = []
  let offset = 0
  while (true) {
    const sep = pathStr.includes('?') ? '&' : '?'
    const data = await api('GET', `${pathStr}${sep}limit=100&offset=${offset}`)
    rows.push(...(data.rows || []))
    if ((data.rows || []).length < 100) break
    offset += 100
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
  console.log('  Tatiana Aniskina — paymentin @ commissioner report 01401 (full)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [agent, contract, report] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/contract/${CONTRACT_ID}`),
    api('GET', `/entity/commissionreportin/${REPORT_ID}?expand=state,agent,contract`),
  ])

  console.log(`  Customer: ${agent.name}`)
  console.log(`  Agreement: ${contract.name}`)
  console.log(`  Report ${report.name}: ${money(report.sum)} AED (paid ${money(report.payedSum)})`)
  console.log(`  State: ${report.state?.name || '?'}`)

  const openMinor = (report.sum || 0) - (report.payedSum || 0)
  if (openMinor <= 0) {
    console.log('\n  Report already paid in full — nothing to post.')
    return
  }
  if (report.sum !== PAYMENT_MINOR) {
    throw new Error(`Report sum ${money(report.sum)} ≠ expected ${money(PAYMENT_MINOR)}`)
  }

  console.log(`\n  Would post paymentin ${money(openMinor)} AED`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await ensureNoDuplicatePayment()

  const paymentIn = await api('POST', '/entity/paymentin', {
    moment: uaeMomentNow(),
    applicable: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    contract: href('contract', CONTRACT_ID),
    organizationAccount: orgAccountHref(BANK_ACCOUNT_ID),
    description: [
      `Incoming payment commissioner report ${REPORT_NAME} | ${MARKER}`,
      'Tatiana Aniskina Nail Master — Jul 2026 consignment sales — paid in full.',
    ].join(' | '),
    sum: openMinor,
    operations: [
      {
        meta: {
          href: `${API}/entity/commissionreportin/${REPORT_ID}`,
          type: 'commissionreportin',
          mediaType: 'application/json',
        },
        linkedSum: openMinor,
      },
    ],
  })

  console.log(`\n  Paymentin: ${paymentIn.name} | ${money(paymentIn.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#paymentin/edit?id=${paymentIn.id}`)

  const reportAfter = await api('GET', `/entity/commissionreportin/${REPORT_ID}?expand=state`)
  console.log('\n  Verification:')
  console.log(`    payedSum: ${money(reportAfter.payedSum)} / ${money(reportAfter.sum)} AED`)
  console.log(`    state: ${reportAfter.state?.name || '?'}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
