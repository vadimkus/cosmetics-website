#!/usr/bin/env node

/**
 * Love My Body — paymentin for consignment report 01400 (2,660 AED).
 *
 *   node --import dotenv/config scripts/moysklad-create-love-my-body-consignment-paymentin-01400-20260716.js
 *   node --import dotenv/config scripts/moysklad-create-love-my-body-consignment-paymentin-01400-20260716.js --commit
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
const BANK_ACCOUNT_ID = 'e1852e1c-33c5-11ea-0a80-043f000b2739'
const STATE_PAID_ID = 'fd15289c-c3c4-11eb-0a80-065200268290'
const MARKER = `LOVE-MY-BODY-CONSIGNMENT-PAYMENT-01400-${uaeToday()}`

const PAYMENT = {
  reportId: 'f71a7d09-77cd-11f1-0a80-1c6d0044629f',
  reportName: '01400',
  agentId: '9c78fe86-be3b-11f0-0a80-007f0036b570',
  contractId: 'aaee7975-be3b-11f0-0a80-173e00383194',
  expectedMinor: 266000,
}

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

async function main() {
  console.log('====================================================================')
  console.log('  Love My Body — paymentin @ consignment report 01400')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}\n`)

  const [agent, contract, report] = await Promise.all([
    api('GET', `/entity/counterparty/${PAYMENT.agentId}`),
    api('GET', `/entity/contract/${PAYMENT.contractId}`),
    api('GET', `/entity/commissionreportin/${PAYMENT.reportId}?expand=state`),
  ])

  console.log(`  Customer: ${agent.name}`)
  console.log(`  Agreement: ${contract.name}`)
  console.log(`  Report ${report.name}: ${money(report.sum)} AED (paid ${money(report.payedSum)})`)
  console.log(`  State: ${report.state?.name || '?'}`)

  const openMinor = (report.sum || 0) - (report.payedSum || 0)
  if (openMinor <= 0) {
    console.log('\n  Already paid in full — nothing to do')
    return
  }

  if (openMinor !== PAYMENT.expectedMinor) {
    throw new Error(`Open ${money(openMinor)} != expected ${money(PAYMENT.expectedMinor)}`)
  }

  const dup = await api('GET', `/entity/paymentin?search=${encodeURIComponent(MARKER)}&limit=5`)
  if ((dup.rows || []).some((d) => (d.description || '').includes(MARKER))) {
    console.log('\n  SKIP — payment already booked')
    return
  }

  if (!COMMIT) {
    console.log(`\n  Would post paymentin ${money(openMinor)} AED`)
    console.log('  DRY RUN — re-run with --commit')
    return
  }

  const paymentIn = await api('POST', '/entity/paymentin', {
    moment: uaeMomentNow(),
    applicable: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', PAYMENT.agentId),
    contract: href('contract', PAYMENT.contractId),
    organizationAccount: orgAccountHref(BANK_ACCOUNT_ID),
    description: [
      `Incoming payment commissioner report ${PAYMENT.reportName} | ${MARKER}`,
      `${agent.name} — June 2026 consignment sales ${money(openMinor)} AED — paid in full.`,
    ].join(' | '),
    sum: openMinor,
    operations: [
      {
        meta: {
          href: `${API}/entity/commissionreportin/${PAYMENT.reportId}`,
          type: 'commissionreportin',
          mediaType: 'application/json',
        },
        linkedSum: openMinor,
      },
    ],
  })

  console.log(`\n  Paymentin: ${paymentIn.name} | ${money(paymentIn.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#paymentin/edit?id=${paymentIn.id}`)

  const reportAfter = await api('GET', `/entity/commissionreportin/${PAYMENT.reportId}?expand=state`)
  if ((reportAfter.payedSum || 0) >= (reportAfter.sum || 0) && reportAfter.state?.name !== 'Paid') {
    await api('PUT', `/entity/commissionreportin/${PAYMENT.reportId}`, {
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

  const final = await api('GET', `/entity/commissionreportin/${PAYMENT.reportId}?expand=state`)
  console.log(`  Verified: payed ${money(final.payedSum)} / ${money(final.sum)} | state ${final.state?.name}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
