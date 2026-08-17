#!/usr/bin/env node

/**
 * Ilmira Hairulina — paymentin 303 AED against consignment reports 01406 + 01407.
 * Allocation: 01406 (231) full, then 01407 remainder (72).
 *
 *   node --import dotenv/config scripts/moysklad-create-ilmira-hairulina-paymentin-01406-01407-20260714.js
 *   node --import dotenv/config scripts/moysklad-create-ilmira-hairulina-paymentin-01406-01407-20260714.js --commit
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
const AGENT_ID = 'a7c023a6-4681-11ea-0a80-067800209158'
const CONTRACT_ID = '4c3b2437-80e3-11ea-0a80-05d4001412ae' // Agreement 00003
const BANK_ACCOUNT_ID = 'e1852e1c-33c5-11ea-0a80-043f000b2739'
const STATE_PAID_ID = 'fd15289c-c3c4-11eb-0a80-065200268290'

const PAYMENT_MINOR = 30300 // 303.00 AED

const REPORTS = [
  { name: '01406', id: 'aec1374d-7f53-11f1-0a80-115c00123230' },
  { name: '01407', id: '25b0fa07-7f5b-11f1-0a80-1b4f0014e9ee' },
]

const MARKER = `ILMIRA-HAIRULINA-CONSIGNMENT-PAYMENT-303-${uaeToday()}`

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
      signal: AbortSignal.timeout(60000),
    })
    const text = await res.text()
    if (res.status === 429 && attempt < 8) {
      await new Promise((r) => setTimeout(r, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    const retryable =
      e.cause?.code === 'ECONNRESET' ||
      e.cause?.code === 'UND_ERR_CONNECT_TIMEOUT' ||
      e.name === 'TimeoutError' ||
      e.message === 'fetch failed'
    if (attempt < 8 && retryable) {
      await new Promise((r) => setTimeout(r, 2000 * attempt))
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

function reportHref(id) {
  return {
    meta: {
      href: `${API}/entity/commissionreportin/${id}`,
      type: 'commissionreportin',
      mediaType: 'application/json',
    },
  }
}

async function ensureNoDuplicatePayment() {
  const search = await api('GET', `/entity/paymentin?search=${encodeURIComponent(MARKER)}&limit=5`)
  if ((search.rows || []).some((d) => (d.description || '').includes(MARKER))) {
    throw new Error(`Duplicate payment marker (${search.rows[0].name})`)
  }
}

function buildAllocation(reports) {
  let remaining = PAYMENT_MINOR
  const ops = []

  for (const spec of REPORTS) {
    const report = reports.find((r) => r.id === spec.id)
    if (!report) throw new Error(`Report ${spec.name} not found`)
    const open = (report.sum || 0) - (report.payedSum || 0)
    if (open <= 0) continue
    const linked = Math.min(open, remaining)
    if (linked <= 0) break
    ops.push({ spec, report, linked })
    remaining -= linked
    if (remaining <= 0) break
  }

  if (remaining !== 0) {
    throw new Error(`Cannot allocate ${money(PAYMENT_MINOR)} AED — ${money(remaining)} unallocated`)
  }
  if (!ops.length) throw new Error('No open report balance to pay')

  return ops
}

async function markPaidIfSettled(reportId) {
  const report = await api('GET', `/entity/commissionreportin/${reportId}?expand=state`)
  if ((report.payedSum || 0) >= (report.sum || 0) && report.state?.name !== 'Paid') {
    await api('PUT', `/entity/commissionreportin/${reportId}`, {
      meta: report.meta,
      state: {
        meta: {
          href: `${API}/entity/commissionreportin/metadata/states/${STATE_PAID_ID}`,
          type: 'state',
          mediaType: 'application/json',
        },
      },
    })
  }
  const final = await api('GET', `/entity/commissionreportin/${reportId}?expand=state`)
  return final
}

async function main() {
  console.log('====================================================================')
  console.log('  Ilmira Hairulina — paymentin @ consignment reports 01406 + 01407')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Payment: ${money(PAYMENT_MINOR)} AED`)

  const [agent, contract, ...reportRows] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/contract/${CONTRACT_ID}`),
    ...REPORTS.map((r) => api('GET', `/entity/commissionreportin/${r.id}?expand=state`)),
  ])

  console.log(`  Customer: ${agent.name}`)
  console.log(`  Agreement: ${contract.name}`)

  for (const r of reportRows) {
    const open = (r.sum || 0) - (r.payedSum || 0)
    console.log(
      `  Report ${r.name}: ${money(r.sum)} AED | paid ${money(r.payedSum)} | open ${money(open)} | ${r.state?.name || '?'}`
    )
  }

  const ops = buildAllocation(reportRows)
  console.log('\n  Allocation:')
  for (const op of ops) {
    console.log(`    ${op.spec.name}: ${money(op.linked)} AED`)
  }

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
      `Incoming payment consignment reports 01406+01407 | ${MARKER}`,
      'Ilmira Hairulina — consignment sales 303 AED received.',
    ].join(' | '),
    sum: PAYMENT_MINOR,
    operations: ops.map((op) => ({
      meta: reportHref(op.spec.id).meta,
      linkedSum: op.linked,
    })),
  })

  console.log(`\n  Paymentin: ${paymentIn.name} | ${money(paymentIn.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#paymentin/edit?id=${paymentIn.id}`)

  console.log('\n  Verification:')
  for (const spec of REPORTS) {
    const final = await markPaidIfSettled(spec.id)
    const open = (final.sum || 0) - (final.payedSum || 0)
    console.log(
      `    ${final.name}: paid ${money(final.payedSum)} / ${money(final.sum)} AED | state ${final.state?.name} | open ${money(open)}`
    )
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
