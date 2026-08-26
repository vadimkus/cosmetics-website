#!/usr/bin/env node

/**
 * BIANCO JGE Ladies Salon L.L.C — RAK instant transfer 2,464 AED (25 Aug 21:02).
 * Consignment reports 01299 + 01298 + 01322 + 01334 + 01054 on agreement 16.
 * Bank note: INV 01299 01298 01322 01334 01054 JGE. Ref E2E00402608259427127.
 *
 *   node --import dotenv/config scripts/moysklad-create-bianco-jge-ladies-2464-paymentin-20260825.js
 *   node --import dotenv/config scripts/moysklad-create-bianco-jge-ladies-2464-paymentin-20260825.js --commit
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
const BANK_ACCOUNT_ID = 'e1852e1c-33c5-11ea-0a80-043f000b2739'
const AGENT_ID = 'f10054f9-da25-11ef-0a80-115c0005d233'
const CONTRACT_ID = '9f41e7f0-e3a2-11ef-0a80-0152001c1301'
const STATE_REPORT_PAID_ID = 'fd15289c-c3c4-11eb-0a80-065200268290'

const BANK_REF = 'E2E00402608259427127'
const PAYMENT_MOMENT = '2026-08-25 21:02:35'
const EXPECTED_SUM_MINOR = 246400
const MARKER = `BIANCO-JGE-LADIES-2464-PAYMENTIN-${uaeToday()}`

const REPORTS = [
  { name: '01299', id: 'c5ecdf0c-246d-11f1-0a80-07be0010e15c', expectedMinor: 16300 },
  { name: '01298', id: '5c7b4b82-246d-11f1-0a80-16c90010522f', expectedMinor: 59600 },
  { name: '01322', id: 'c50baa76-3412-11f1-0a80-0f700010265a', expectedMinor: 27100 },
  { name: '01334', id: '0e7bf0fa-43c8-11f1-0a80-02ab001a549c', expectedMinor: 42000 },
  { name: '01054', id: '5f149edb-6090-11f0-0a80-10c10029fcbf', expectedMinor: 101400 },
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

async function ensureNoDuplicate() {
  const byRef = await api('GET', `/entity/paymentin?search=${encodeURIComponent(BANK_REF)}&limit=10`)
  const hit = (byRef.rows || []).find(
    (p) => (p.description || '').includes(BANK_REF) || (p.description || '').includes(MARKER),
  )
  if (hit) throw new Error(`Duplicate paymentin ${hit.name} (${hit.id})`)
}

async function main() {
  console.log('====================================================================')
  console.log('  Bianco JGE Ladies — paymentin 2,464 @ 5 consignment reports')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  if (agent.name !== 'BIANCO JGE Ladies Salon L.L.C') throw new Error(`Unexpected agent: ${agent.name}`)
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Bank: RAK ${BANK_REF} | ${PAYMENT_MOMENT}`)

  const ops = []
  let openTotal = 0
  for (const spec of REPORTS) {
    const r = await api('GET', `/entity/commissionreportin/${spec.id}?expand=state,agent,contract`)
    if (r.name !== spec.name) throw new Error(`Expected ${spec.name}, got ${r.name}`)
    if (r.agent?.id && r.agent.id !== AGENT_ID) throw new Error(`Report ${r.name} agent mismatch`)
    if (!r.contract?.meta?.href?.includes(CONTRACT_ID)) throw new Error(`Report ${r.name} not on agreement 16`)
    const open = (r.sum || 0) - (r.payedSum || 0)
    console.log(
      `  Report ${r.name}: ${money(r.sum)} paid ${money(r.payedSum)} open ${money(open)} | ${r.state?.name || ''}`,
    )
    if (open <= 0) throw new Error(`Report ${r.name} already paid`)
    if (open !== spec.expectedMinor || r.sum !== spec.expectedMinor) {
      throw new Error(`Report ${r.name} open ${money(open)} ≠ expected ${money(spec.expectedMinor)}`)
    }
    openTotal += open
    ops.push({
      meta: {
        href: `${API}/entity/commissionreportin/${spec.id}`,
        type: 'commissionreportin',
        mediaType: 'application/json',
      },
      linkedSum: open,
      _id: spec.id,
      _name: spec.name,
    })
  }
  if (openTotal !== EXPECTED_SUM_MINOR) {
    throw new Error(`Open ${money(openTotal)} ≠ bank ${money(EXPECTED_SUM_MINOR)}`)
  }
  console.log(`  Total: ${money(openTotal)} AED → reports ${REPORTS.map((r) => r.name).join(' + ')}`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await ensureNoDuplicate()

  const paymentIn = await api('POST', '/entity/paymentin', {
    moment: PAYMENT_MOMENT,
    applicable: true,
    incomingNumber: BANK_REF,
    incomingDate: PAYMENT_MOMENT,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    contract: href('contract', CONTRACT_ID),
    organizationAccount: orgAccountHref(BANK_ACCOUNT_ID),
    sum: EXPECTED_SUM_MINOR,
    description: [
      MARKER,
      `RAK instant ${BANK_REF} 25 Aug 2026 21:02`,
      'BIANCO JGE LADIES SALON LLC — INV 01299 01298 01322 01334 01054 JGE — 2,464 AED.',
    ].join(' | '),
    operations: ops.map(({ meta, linkedSum }) => ({ meta, linkedSum })),
  })

  for (const op of ops) {
    const after = await api('GET', `/entity/commissionreportin/${op._id}?expand=state`)
    if ((after.payedSum || 0) < (after.sum || 0)) {
      throw new Error(`Report ${after.name} pay link incomplete: ${money(after.payedSum)} / ${money(after.sum)}`)
    }
    if (after.state?.name !== 'Paid') {
      await api('PUT', `/entity/commissionreportin/${op._id}`, {
        meta: after.meta,
        state: stateHref('commissionreportin', STATE_REPORT_PAID_ID),
      })
    }
    const final = await api('GET', `/entity/commissionreportin/${op._id}?expand=state`)
    console.log(`  Report ${final.name}: paid ${money(final.payedSum)} / ${money(final.sum)} | ${final.state?.name}`)
  }

  console.log(`\n  Paymentin: ${paymentIn.name} | ${money(paymentIn.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#paymentin/edit?id=${paymentIn.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
