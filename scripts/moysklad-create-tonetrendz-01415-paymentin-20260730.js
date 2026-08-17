#!/usr/bin/env node

/**
 * TONETRENDZ — paymentin for consignment report 01415 (605 AED).
 * Links to commissioner report, marks Paid.
 *
 *   node --import dotenv/config scripts/moysklad-create-tonetrendz-01415-paymentin-20260730.js
 *   node --import dotenv/config scripts/moysklad-create-tonetrendz-01415-paymentin-20260730.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const { uaeMomentNow, uaeToday } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const BANK_ACCOUNT_ID = 'e1852e1c-33c5-11ea-0a80-043f000b2739'
const AGENT_ID = '74aa75cb-63db-11f1-0a80-111d001bbe72' // TONETRENDZ
const CONTRACT_ID = '7a5e3023-63dc-11f1-0a80-1ba4001ce87b' // 36
const REPORT_ID = 'd90031d7-8bf5-11f1-0a80-0fc00013aa27'
const REPORT_NAME = '01415'
const EXPECTED_SUM_MINOR = 60500
const STATE_REPORT_PAID_ID = 'fd15289c-c3c4-11eb-0a80-065200268290'
const MARKER = `TONETRENDZ-01415-PAYMENTIN-${uaeToday()}`

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
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    if (attempt < 5 && (e.message === 'fetch failed' || e.cause?.code === 'ECONNRESET')) {
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

function orgAccountHref(accountId) {
  return {
    meta: {
      href: `${API}/entity/organization/${ORG_ID}/accounts/${accountId}`,
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
  console.log('  TONETRENDZ — paymentin for consignment report 01415')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const report = await api('GET', `/entity/commissionreportin/${REPORT_ID}?expand=state,agent`)
  if (report.name !== REPORT_NAME) throw new Error(`Expected ${REPORT_NAME}, got ${report.name}`)
  if ((report.sum || 0) !== EXPECTED_SUM_MINOR) {
    throw new Error(`Report sum ${money(report.sum)} ≠ ${money(EXPECTED_SUM_MINOR)}`)
  }
  if ((report.payedSum || 0) >= EXPECTED_SUM_MINOR) {
    throw new Error(`Report already paid: payedSum ${money(report.payedSum)}`)
  }

  const agentHref = `${API}/entity/counterparty/${AGENT_ID}`
  const pays = await fetchAll(
    `/entity/paymentin?filter=agent=${encodeURIComponent(agentHref)};moment>=${uaeToday()} 00:00:00`,
  )
  const dup = pays.find((p) => (p.description || '').includes(MARKER) || (p.description || '').includes(`report ${REPORT_NAME}`))
  if (dup) throw new Error(`Paymentin already exists: ${dup.name} (${dup.id})`)

  console.log(`  Report : ${report.name} | ${money(report.sum)} AED | ${report.state?.name}`)
  console.log(`  Agent  : ${report.agent?.name || AGENT_ID}`)
  console.log(`  Amount : ${money(EXPECTED_SUM_MINOR)} AED → bank`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const paymentIn = await api('POST', '/entity/paymentin', {
    moment: uaeMomentNow(),
    applicable: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    contract: href('contract', CONTRACT_ID),
    organizationAccount: orgAccountHref(BANK_ACCOUNT_ID),
    description: [
      `Incoming payment commissioner report ${REPORT_NAME} | ${MARKER}`,
      'TONETRENDZ consignment — Madalina bank transfer — 605 AED paid in full.',
    ].join(' | '),
    sum: EXPECTED_SUM_MINOR,
    operations: [
      {
        meta: {
          href: `${API}/entity/commissionreportin/${REPORT_ID}`,
          type: 'commissionreportin',
          mediaType: 'application/json',
        },
        linkedSum: EXPECTED_SUM_MINOR,
      },
    ],
  })

  await api('PUT', `/entity/commissionreportin/${REPORT_ID}`, {
    meta: report.meta,
    state: stateHref('commissionreportin', STATE_REPORT_PAID_ID),
  })

  const final = await api('GET', `/entity/commissionreportin/${REPORT_ID}?expand=state`)
  console.log(`\n  Paymentin: ${paymentIn.name} | ${money(paymentIn.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#paymentin/edit?id=${paymentIn.id}`)
  console.log(`  Report ${final.name}: payed ${money(final.payedSum)} / ${money(final.sum)} | ${final.state?.name}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
