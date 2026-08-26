#!/usr/bin/env node

/**
 * BIANCO JGE GENTS SALON L.L.C — RAK instant transfer 215 AED (25 Aug 20:22).
 * Consignment reports 01297 (143) + 01323 (72) on agreement 23.
 * Bank note: INV01297 / 01323 UOMO. Ref E2E00402608259423389.
 *
 *   node --import dotenv/config scripts/moysklad-create-bianco-jge-gents-01297-01323-paymentin-20260825.js
 *   node --import dotenv/config scripts/moysklad-create-bianco-jge-gents-01297-01323-paymentin-20260825.js --commit
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
const AGENT_ID = 'f7d1afa3-9f84-11f0-0a80-1567000e3f47'
const CONTRACT_ID = '8686d39b-9f88-11f0-0a80-1880000e698c'
const STATE_REPORT_PAID_ID = 'fd15289c-c3c4-11eb-0a80-065200268290'

const BANK_REF = 'E2E00402608259423389'
const PAYMENT_MOMENT = '2026-08-25 20:22:27'
const EXPECTED_SUM_MINOR = 21500
const MARKER = `BIANCO-JGE-GENTS-01297-01323-PAYMENTIN-${uaeToday()}`

const REPORTS = [
  { name: '01297', id: '15daac14-246d-11f1-0a80-01b900116ed8', expectedMinor: 14300 },
  { name: '01323', id: '60179b7a-3413-11f1-0a80-006b0010d439', expectedMinor: 7200 },
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
  console.log('  Bianco JGE Gents — paymentin 215 @ reports 01297 + 01323')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  if (agent.name !== 'BIANCO JGE GENTS SALON L.L.C') throw new Error(`Unexpected agent: ${agent.name}`)
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Bank: RAK ${BANK_REF} | ${PAYMENT_MOMENT}`)

  const ops = []
  let openTotal = 0
  for (const spec of REPORTS) {
    const r = await api('GET', `/entity/commissionreportin/${spec.id}?expand=state,agent,contract`)
    if (r.name !== spec.name) throw new Error(`Expected ${spec.name}, got ${r.name}`)
    if (r.agent?.id && r.agent.id !== AGENT_ID) throw new Error(`Report ${r.name} agent mismatch`)
    if (!r.contract?.meta?.href?.includes(CONTRACT_ID)) throw new Error(`Report ${r.name} not on agreement 23`)
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
  console.log('  Leave invoice 04908 (360) unpaid — not on the slip')

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
      `RAK instant ${BANK_REF} 25 Aug 2026 20:22`,
      'BIANCO JGE GENTS SALON LLC — INV01297 + 01323 UOMO — 215 AED.',
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
