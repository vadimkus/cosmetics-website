#!/usr/bin/env node

/**
 * Persona Nakheel Mall (Palm Jumeirah) — paymentin on Aug consignment report 01458.
 * 2,263 AED. Link to the report, not demand 06802. Mark Paid.
 *
 *   node --import dotenv/config scripts/moysklad-create-persona-nakheel-paymentin-01458-20260904.js
 *   node --import dotenv/config scripts/moysklad-create-persona-nakheel-paymentin-01458-20260904.js --commit
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
const AGENT_ID = 'fd850df7-1cff-11ef-0a80-082e0017fa70'
const CONTRACT_ID = '393d4076-1d00-11ef-0a80-028700179a4e'
const STATE_REPORT_PAID_ID = 'fd15289c-c3c4-11eb-0a80-065200268290'
const MARKER = `PERSONA-NAKHEEL-PAYMENTIN-01458-${uaeToday()}`

const PAYMENT = {
  amountMinor: 226300,
  reportName: '01458',
  reportId: '683074b8-a77a-11f1-0a80-13830023d611',
  contractName: '00078',
  demandName: '06802',
  demandId: '68bbb731-a77a-11f1-0a80-06e800256334',
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
        ...(body ? { 'Content-Type': 'application/json' } : {}),
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
    if (attempt < 5 && (e.message === 'fetch failed' || e.cause?.code === 'ECONNRESET')) {
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

function stateHref(entityType, stateId) {
  return {
    meta: {
      href: `${API}/entity/${entityType}/metadata/states/${stateId}`,
      type: 'state',
      mediaType: 'application/json',
    },
  }
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

async function main() {
  console.log('====================================================================')
  console.log('  Persona Nakheel Mall — paymentin @ report 01458')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [agent, contract, report, demand] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/contract/${CONTRACT_ID}`),
    api('GET', `/entity/commissionreportin/${PAYMENT.reportId}?expand=state,agent,contract`),
    api('GET', `/entity/demand/${PAYMENT.demandId}`),
  ])

  console.log(`  Customer: ${agent.name}`)
  console.log(`  Agreement: ${contract.name}`)
  console.log(`  Report ${report.name}: ${money(report.sum)} paid ${money(report.payedSum)} | ${report.state?.name}`)
  console.log(`  Demand ${demand.name}: ${money(demand.sum)} (replenish — do not pay)`)

  if (!/first person ladies salon llc \(palm/i.test(agent.name || '')) {
    throw new Error(`Unexpected agent: ${agent.name}`)
  }
  if (contract.name !== PAYMENT.contractName) {
    throw new Error(`Expected agr ${PAYMENT.contractName}, got ${contract.name}`)
  }
  if (report.name !== PAYMENT.reportName) throw new Error(`Expected report ${PAYMENT.reportName}`)
  if (demand.name !== PAYMENT.demandName) throw new Error(`Expected demand ${PAYMENT.demandName}`)
  if (report.sum !== PAYMENT.amountMinor) {
    throw new Error(`Report sum ${money(report.sum)} ≠ ${money(PAYMENT.amountMinor)}`)
  }
  if (demand.sum !== PAYMENT.amountMinor) {
    throw new Error(`Demand sum ${money(demand.sum)} ≠ ${money(PAYMENT.amountMinor)}`)
  }

  const openMinor = (report.sum || 0) - (report.payedSum || 0)
  if (openMinor <= 0) {
    console.log('\n  Already paid')
    return
  }
  if (openMinor !== PAYMENT.amountMinor) {
    throw new Error(`Open ${money(openMinor)} ≠ ${money(PAYMENT.amountMinor)}`)
  }

  const dup = await api('GET', `/entity/paymentin?search=${encodeURIComponent(MARKER)}&limit=10`)
  if ((dup.rows || []).some((r) => (r.description || '').includes(MARKER))) {
    throw new Error('Duplicate payment already booked')
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const created = await api('POST', '/entity/paymentin', {
    applicable: true,
    moment: uaeMomentNow(),
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    contract: href('contract', CONTRACT_ID),
    organizationAccount: orgAccountHref(BANK_ACCOUNT_ID),
    sum: PAYMENT.amountMinor,
    description: [
      `Incoming payment commissioner report ${PAYMENT.reportName} | ${MARKER}`,
      `Persona Nakheel Mall — consignment sales ${money(PAYMENT.amountMinor)} AED — paid in full.`,
    ].join(' | '),
    operations: [
      {
        meta: {
          href: `${API}/entity/commissionreportin/${PAYMENT.reportId}`,
          type: 'commissionreportin',
          mediaType: 'application/json',
        },
        linkedSum: PAYMENT.amountMinor,
      },
    ],
  })

  await api('PUT', `/entity/commissionreportin/${PAYMENT.reportId}`, {
    meta: report.meta,
    state: stateHref('commissionreportin', STATE_REPORT_PAID_ID),
  })

  const [reportAfter, demandAfter] = await Promise.all([
    api('GET', `/entity/commissionreportin/${PAYMENT.reportId}?expand=state`),
    api('GET', `/entity/demand/${PAYMENT.demandId}`),
  ])

  console.log(`\n  Paymentin: ${created.name} | ${money(created.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#paymentin/edit?id=${created.id}`)
  console.log(`  Report ${reportAfter.name}: paid ${money(reportAfter.payedSum)} / ${money(reportAfter.sum)} | ${reportAfter.state?.name}`)
  console.log(`  Demand ${demandAfter.name} payedSum: ${money(demandAfter.payedSum)} (must stay 0)`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
