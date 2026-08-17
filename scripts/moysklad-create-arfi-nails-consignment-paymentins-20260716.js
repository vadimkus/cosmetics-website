#!/usr/bin/env node

/**
 * ARFI Nails — paymentin for both pending June 2026 consignment reports:
 *   Barsha 01397 — 3,821 AED (agreement 25)
 *   Jumeirah 01398 — 1,476 AED (agreement 30)
 *
 *   node --import dotenv/config scripts/moysklad-create-arfi-nails-consignment-paymentins-20260716.js
 *   node --import dotenv/config scripts/moysklad-create-arfi-nails-consignment-paymentins-20260716.js --commit
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
const BANK_ACCOUNT_ID = 'e1852e1c-33c5-11ea-0a80-043f000b2739'
const STATE_PAID_ID = 'fd15289c-c3c4-11eb-0a80-065200268290'
const MARKER = `ARFI-NAILS-CONSIGNMENT-PAYMENT-${uaeToday()}`

const REPORTS = [
  {
    label: 'Barsha',
    reportId: 'fb12bb06-76a6-11f1-0a80-1c6d000ec946',
    reportName: '01397',
    agentId: '39a1aa83-a5a6-11f0-0a80-1cbc00050fea',
    contractId: '739936aa-a809-11f0-0a80-07ba002a8e67',
    expectedMinor: 382100,
  },
  {
    label: 'Jumeirah',
    reportId: '511f797b-76a7-11f1-0a80-1c6d000ed67c',
    reportName: '01398',
    agentId: 'dc883e47-f051-11f0-0a80-0f7100059e21',
    contractId: '383ebfbb-f052-11f0-0a80-0035000650e3',
    expectedMinor: 147600,
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

async function ensureNoDuplicatePayment(reportName) {
  const marker = `${MARKER}-${reportName}`
  const search = await api('GET', `/entity/paymentin?search=${encodeURIComponent(marker)}&limit=5`)
  if ((search.rows || []).some((d) => (d.description || '').includes(marker))) {
    throw new Error(`Duplicate payment for report ${reportName} (${search.rows[0].name})`)
  }
}

async function postPayment(cfg, minuteOffset) {
  const [agent, contract, report] = await Promise.all([
    api('GET', `/entity/counterparty/${cfg.agentId}`),
    api('GET', `/entity/contract/${cfg.contractId}`),
    api('GET', `/entity/commissionreportin/${cfg.reportId}?expand=state`),
  ])

  console.log(`\n  --- ${cfg.label} ---`)
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Agreement: ${contract.name}`)
  console.log(`  Report ${report.name}: ${money(report.sum)} AED (paid ${money(report.payedSum)})`)
  console.log(`  State: ${report.state?.name || '?'}`)

  const openMinor = (report.sum || 0) - (report.payedSum || 0)
  if (openMinor <= 0) {
    console.log('  Already paid in full — skip')
    return null
  }

  if (openMinor !== cfg.expectedMinor) {
    console.warn(`  ⚠ Open ${money(openMinor)} differs from expected ${money(cfg.expectedMinor)}`)
  }

  if (!COMMIT) {
    console.log(`  Would post paymentin ${money(openMinor)} AED`)
    return { dryRun: true, openMinor }
  }

  await ensureNoDuplicatePayment(cfg.reportName)

  const paymentIn = await api('POST', '/entity/paymentin', {
    moment: uaeMomentAddMinutes(minuteOffset),
    applicable: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', cfg.agentId),
    contract: href('contract', cfg.contractId),
    organizationAccount: orgAccountHref(BANK_ACCOUNT_ID),
    description: [
      `Incoming payment commissioner report ${cfg.reportName} | ${MARKER}-${cfg.reportName}`,
      `${agent.name} — June 2026 consignment sales ${money(openMinor)} AED — paid in full.`,
    ].join(' | '),
    sum: openMinor,
    operations: [
      {
        meta: {
          href: `${API}/entity/commissionreportin/${cfg.reportId}`,
          type: 'commissionreportin',
          mediaType: 'application/json',
        },
        linkedSum: openMinor,
      },
    ],
  })

  console.log(`  Paymentin: ${paymentIn.name} | ${money(paymentIn.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#paymentin/edit?id=${paymentIn.id}`)

  const reportAfter = await api('GET', `/entity/commissionreportin/${cfg.reportId}?expand=state`)
  if ((reportAfter.payedSum || 0) >= (reportAfter.sum || 0) && reportAfter.state?.name !== 'Paid') {
    await api('PUT', `/entity/commissionreportin/${cfg.reportId}`, {
      meta: reportAfter.meta,
      state: {
        meta: {
          href: `${API}/entity/commissionreportin/metadata/states/${STATE_PAID_ID}`,
          type: 'state',
          mediaType: 'application/json',
        },
      },
    })
  }

  const final = await api('GET', `/entity/commissionreportin/${cfg.reportId}?expand=state`)
  console.log(`  Verified: payed ${money(final.payedSum)} / ${money(final.sum)} | state ${final.state?.name}`)
  return paymentIn
}

async function main() {
  console.log('====================================================================')
  console.log('  ARFI Nails — consignment paymentin (Barsha + Jumeirah)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Reports: 01397 (3,821) + 01398 (1,476) = 5,297 AED`)

  let totalMinor = 0
  for (let i = 0; i < REPORTS.length; i++) {
    const result = await postPayment(REPORTS[i], i * 2)
    if (result?.openMinor) totalMinor += result.openMinor
    if (result?.sum) totalMinor += result.sum
  }

  if (!COMMIT) {
    console.log(`\n  Total to post: ${money(totalMinor || 529700)} AED`)
    console.log('\n  DRY RUN — re-run with --commit')
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
