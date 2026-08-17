#!/usr/bin/env node

/**
 * REFRESH BIOHACKING CLINIC — full paymentin for commissioner report 01405 (1,844 AED).
 *
 *   node --import dotenv/config scripts/moysklad-create-refresh-clinic-paymentin-01405-20260713.js --commit
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
const AGENT_ID = 'a6e52a6a-a2d6-11f0-0a80-03b9004ee0de'
const CONTRACT_ID = 'dc3ad805-a2d6-11f0-0a80-0d1c0051970b' // Agreement 24
const BANK_ACCOUNT_ID = 'e1852e1c-33c5-11ea-0a80-043f000b2739'
const REPORT_ID = '59d53e1f-7d24-11f1-0a80-0574003d775e'
const REPORT_NAME = '01405'
const STATE_PAID_ID = 'fd15289c-c3c4-11eb-0a80-065200268290'
const MARKER = `REFRESH-CLINIC-CONSIGNMENT-PAYMENT-${REPORT_NAME}-${uaeToday()}`

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

async function ensureNoDuplicatePayment() {
  const search = await api('GET', `/entity/paymentin?search=${encodeURIComponent(MARKER)}&limit=5`)
  if ((search.rows || []).some((d) => (d.description || '').includes(MARKER))) {
    throw new Error(`Duplicate payment marker (${search.rows[0].name})`)
  }
}

async function main() {
  console.log('====================================================================')
  console.log('  Refresh Clinic — paymentin @ commissioner report 01405')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [agent, contract, report] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/contract/${CONTRACT_ID}`),
    api('GET', `/entity/commissionreportin/${REPORT_ID}?expand=state`),
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
      'REFRESH BIOHACKING CLINIC — June 2026 consignment sales 1,844 AED — paid in full.',
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
  if ((reportAfter.payedSum || 0) >= (reportAfter.sum || 0) && reportAfter.state?.name !== 'Paid') {
    await api('PUT', `/entity/commissionreportin/${REPORT_ID}`, {
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

  const final = await api('GET', `/entity/commissionreportin/${REPORT_ID}?expand=state`)
  console.log('\n  Verification:')
  console.log(`    payedSum: ${money(final.payedSum)} / ${money(final.sum)} AED`)
  console.log(`    state: ${final.state?.name || '?'}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
