#!/usr/bin/env node

/**
 * Ilmira Hairulina — paymentin 898 AED against consignment report 01436.
 *
 *   node --import dotenv/config scripts/moysklad-create-ilmira-hairulina-paymentin-01436-20260818.js
 *   node --import dotenv/config scripts/moysklad-create-ilmira-hairulina-paymentin-01436-20260818.js --commit
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
const CONTRACT_ID = '4c3b2437-80e3-11ea-0a80-05d4001412ae'
const BANK_ACCOUNT_ID = 'e1852e1c-33c5-11ea-0a80-043f000b2739'
const STATE_PAID_ID = 'fd15289c-c3c4-11eb-0a80-065200268290'

const PAYMENT_MINOR = 89800
const REPORT = { name: '01436', id: '423f2f15-9a5f-11f1-0a80-036200d85270' }
const MARKER = `ILMIRA-HAIRULINA-CONSIGNMENT-PAYMENT-01436-${uaeToday()}`

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

async function ensureNoDuplicate() {
  const search = await api('GET', `/entity/paymentin?search=${encodeURIComponent(MARKER)}&limit=5`)
  if ((search.rows || []).some((d) => (d.description || '').includes(MARKER))) {
    throw new Error(`Duplicate payment marker (${search.rows[0].name})`)
  }
}

async function main() {
  console.log('====================================================================')
  console.log('  Ilmira Hairulina — paymentin 898 @ report 01436')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [agent, contract, report] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/contract/${CONTRACT_ID}`),
    api('GET', `/entity/commissionreportin/${REPORT.id}?expand=state`),
  ])

  const open = (report.sum || 0) - (report.payedSum || 0)
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Agreement: ${contract.name}`)
  console.log(
    `  Report ${report.name}: ${money(report.sum)} paid ${money(report.payedSum)} open ${money(open)} ${report.state?.name || ''}`,
  )

  if (report.name !== REPORT.name) throw new Error(`Unexpected report ${report.name}`)
  if ((report.sum || 0) !== PAYMENT_MINOR) {
    throw new Error(`Report sum ${money(report.sum)} ≠ ${money(PAYMENT_MINOR)}`)
  }
  if (open !== PAYMENT_MINOR) {
    throw new Error(`Open ${money(open)} ≠ ${money(PAYMENT_MINOR)} — already paid or partial`)
  }
  if (!report.contract?.meta?.href?.includes(CONTRACT_ID)) {
    throw new Error('Report not on agreement 00003')
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await ensureNoDuplicate()

  const paymentIn = await api('POST', '/entity/paymentin', {
    moment: uaeMomentNow(),
    applicable: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    contract: href('contract', CONTRACT_ID),
    organizationAccount: orgAccountHref(BANK_ACCOUNT_ID),
    sum: PAYMENT_MINOR,
    description: [
      MARKER,
      `Payment for consignment report ${REPORT.name}`,
      'Ilmira Hairulina — 898 AED received.',
    ].join(' | '),
    operations: [
      {
        meta: {
          href: `${API}/entity/commissionreportin/${REPORT.id}`,
          type: 'commissionreportin',
          mediaType: 'application/json',
        },
        linkedSum: PAYMENT_MINOR,
      },
    ],
  })

  const after = await api('GET', `/entity/commissionreportin/${REPORT.id}?expand=state`)
  if ((after.payedSum || 0) < PAYMENT_MINOR) {
    throw new Error(`Pay link incomplete: paid ${money(after.payedSum)}`)
  }
  if (after.state?.name !== 'Paid') {
    await api('PUT', `/entity/commissionreportin/${REPORT.id}`, {
      meta: after.meta,
      state: {
        meta: {
          href: `${API}/entity/commissionreportin/metadata/states/${STATE_PAID_ID}`,
          type: 'state',
          mediaType: 'application/json',
        },
      },
    })
  }

  const final = await api('GET', `/entity/commissionreportin/${REPORT.id}?expand=state`)
  console.log(`\n  Paymentin: ${paymentIn.name} | ${money(paymentIn.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#paymentin/edit?id=${paymentIn.id}`)
  console.log(`  Report ${final.name}: paid ${money(final.payedSum)} / ${money(final.sum)} | ${final.state?.name}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
