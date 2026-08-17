#!/usr/bin/env node

/**
 * ARFI Nails — payment-ins for July 2026 consignment reports:
 *   Jumeirah 01428 — 1,887 AED (agreement 30)
 *   Barsha   01427 — 1,674 AED (agreement 25)
 *
 *   node --import dotenv/config scripts/moysklad-create-arfi-july-consignment-paymentins-20260808.js
 *   node --import dotenv/config scripts/moysklad-create-arfi-july-consignment-paymentins-20260808.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const { uaeToday, uaeMomentAddMinutes } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const BANK_ACCOUNT_ID = 'e1852e1c-33c5-11ea-0a80-043f000b2739'
const STATE_PAID_ID = 'fd15289c-c3c4-11eb-0a80-065200268290'
const MARKER = `ARFI-NAILS-JULY-CONSIGNMENT-PAYMENT-${uaeToday()}`

const REPORTS = [
  {
    label: 'Jumeirah',
    reportId: '275c356e-9076-11f1-0a80-040c000a78b3',
    reportName: '01428',
    agentId: 'dc883e47-f051-11f0-0a80-0f7100059e21',
    contractId: '383ebfbb-f052-11f0-0a80-0035000650e3',
    expectedMinor: 188700,
  },
  {
    label: 'Barsha',
    reportId: '571637cb-9075-11f1-0a80-0caa000a857d',
    reportName: '01427',
    agentId: '39a1aa83-a5a6-11f0-0a80-1cbc00050fea',
    contractId: '739936aa-a809-11f0-0a80-07ba002a8e67',
    expectedMinor: 167400,
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
      await new Promise((resolve) => setTimeout(resolve, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
    }
    return text ? JSON.parse(text) : null
  } catch (error) {
    if (
      attempt < 5 &&
      (error.cause?.code === 'ECONNRESET' || error.message === 'fetch failed')
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1500 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    throw error
  }
}

function href(type, id) {
  return {
    meta: {
      href: `${API}/entity/${type}/${id}`,
      type,
      mediaType: 'application/json',
    },
  }
}

function accountHref(id) {
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

async function ensureNoDuplicate(reportName) {
  const marker = `${MARKER}-${reportName}`
  const result = await api(
    'GET',
    `/entity/paymentin?search=${encodeURIComponent(marker)}&limit=10`
  )
  const duplicate = (result.rows || []).find((row) =>
    String(row.description || '').includes(marker)
  )
  if (duplicate) {
    throw new Error(`Duplicate payment for report ${reportName}: ${duplicate.name}`)
  }
}

async function processReport(cfg, minuteOffset) {
  const [agent, contract, report] = await Promise.all([
    api('GET', `/entity/counterparty/${cfg.agentId}`),
    api('GET', `/entity/contract/${cfg.contractId}`),
    api('GET', `/entity/commissionreportin/${cfg.reportId}?expand=state`),
  ])

  const openMinor = (report.sum || 0) - (report.payedSum || 0)
  console.log(`\n  --- ${cfg.label} ---`)
  console.log(`  Customer : ${agent.name}`)
  console.log(`  Agreement: ${contract.name}`)
  console.log(`  Report   : ${report.name}`)
  console.log(`  Open     : ${money(openMinor)} AED`)
  console.log(`  State    : ${report.state?.name || '?'}`)

  if (report.name !== cfg.reportName) {
    throw new Error(`${cfg.label}: expected report ${cfg.reportName}, got ${report.name}`)
  }
  if (openMinor <= 0) {
    console.log('  Already paid in full — skip')
    return null
  }
  if (openMinor !== cfg.expectedMinor) {
    throw new Error(
      `${cfg.label}: open ${money(openMinor)} differs from bank transfer ${money(cfg.expectedMinor)}`
    )
  }

  if (!COMMIT) {
    console.log(`  Would create payment-in ${money(openMinor)} AED`)
    return { dryRun: true, sum: openMinor }
  }

  await ensureNoDuplicate(cfg.reportName)
  const marker = `${MARKER}-${cfg.reportName}`
  const payment = await api('POST', '/entity/paymentin', {
    moment: uaeMomentAddMinutes(minuteOffset),
    applicable: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', cfg.agentId),
    contract: href('contract', cfg.contractId),
    organizationAccount: accountHref(BANK_ACCOUNT_ID),
    description:
      `Incoming payment commissioner report ${cfg.reportName} | ${marker} | ` +
      `${agent.name} — July 2026 consignment sales ${money(openMinor)} AED — paid in full.`,
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

  const after = await api(
    'GET',
    `/entity/commissionreportin/${cfg.reportId}?expand=state`
  )
  if (
    (after.payedSum || 0) >= (after.sum || 0) &&
    after.state?.name !== 'Paid'
  ) {
    await api('PUT', `/entity/commissionreportin/${cfg.reportId}`, {
      state: {
        meta: {
          href: `${API}/entity/commissionreportin/metadata/states/${STATE_PAID_ID}`,
          type: 'state',
          mediaType: 'application/json',
        },
      },
    })
  }

  const final = await api(
    'GET',
    `/entity/commissionreportin/${cfg.reportId}?expand=state`
  )
  console.log(`  Payment : ${payment.name} | ${money(payment.sum)} AED`)
  console.log(
    `  Verified: paid ${money(final.payedSum)} / ${money(final.sum)} | ${final.state?.name}`
  )
  console.log(`  https://online.moysklad.ru/app/#paymentin/edit?id=${payment.id}`)
  return payment
}

async function main() {
  console.log('====================================================================')
  console.log('  ARFI Nails — July consignment payment-ins')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log('  Jumeirah 1,887 + Barsha 1,674 = 3,561 AED')

  for (let index = 0; index < REPORTS.length; index += 1) {
    await processReport(REPORTS[index], index * 2)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN PASSED — re-run with --commit')
  }
}

main().catch((error) => {
  console.error('FATAL:', error.message)
  process.exit(1)
})
