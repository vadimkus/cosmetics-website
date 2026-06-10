#!/usr/bin/env node

/**
 * Bianco RAK Bank instant transfers (WhatsApp receipts 2026-06-10) → paymentin @ invoices.
 *
 *   node --import dotenv/config scripts/moysklad-create-bianco-rak-paymentins-20260610.js
 *   node --import dotenv/config scripts/moysklad-create-bianco-rak-paymentins-20260610.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const BANK_ACCOUNT_ID = 'e1852e1c-33c5-11ea-0a80-043f000b2739'
const MARKER = 'BIANCO-RAK-INSTANT-TRANSFER-2026-06-09'

/** Bank receipt → invoice(s) */
const PAYMENTS = [
  {
    ref: 'E2E00402606092061430',
    moment: '2026-06-09 22:38:24',
    amountMinor: 116500,
    note: 'INV 04513 LAYAN',
    sender: 'BIANCO LAYAN BEAUTY SALON LLC',
    invoices: ['04513'],
  },
  {
    ref: 'E2E00402606092060236',
    moment: '2026-06-09 22:20:38',
    amountMinor: 209900,
    note: 'INV 04486 JGE',
    sender: 'BIANCO JGE LADIES SALON LLC',
    invoices: ['04486'],
  },
  {
    ref: 'E2E00402606092053616',
    moment: '2026-06-09 20:57:29',
    amountMinor: 204500,
    note: 'INV 04447 HILLS',
    sender: 'BIANCO BEAUTY SALON SPA LLC',
    invoices: ['04447'],
  },
  {
    ref: 'E2E00402606092051198',
    moment: '2026-06-09 20:30:44',
    amountMinor: 949000,
    note: 'INV 04246 04340 04527 DSO',
    sender: 'BIANCO SPA FZCO',
    invoices: ['04246', '04340', '04527'],
  },
]

async function api(method, pathStr, body) {
  const res = await fetch(pathStr.startsWith('http') ? pathStr : API + pathStr, {
    method,
    headers: {
      Authorization: AUTH,
      Accept: 'application/json;charset=utf-8',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 800)}`)
  return text ? JSON.parse(text) : null
}

function href(type, id) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

function orgAccountHref(id) {
  return { meta: { href: `${API}/entity/account/${id}`, type: 'account', mediaType: 'application/json' } }
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

async function getInvoice(name) {
  const data = await api('GET', `/entity/invoiceout?filter=${encodeURIComponent(`name=${name}`)}&limit=1&expand=agent`)
  const inv = data?.rows?.[0]
  if (!inv) throw new Error(`Invoice not found: ${name}`)
  return inv
}

async function main() {
  console.log('====================================================================')
  console.log('  Bianco RAK instant transfers → paymentin (invoice link)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}\n`)

  for (const p of PAYMENTS) {
    const invs = []
    for (const name of p.invoices) invs.push(await getInvoice(name))

    const agentId = invs[0].agent.meta.href.split('/').pop()
    const invoiceSum = invs.reduce((s, i) => s + i.sum, 0)
    if (invoiceSum !== p.amountMinor) {
      throw new Error(`${p.ref}: bank ${money(p.amountMinor)} ≠ invoices ${money(invoiceSum)}`)
    }

    console.log(`${p.sender} | ${money(p.amountMinor)} AED | ${p.note}`)
    for (const inv of invs) {
      console.log(`  Invoice ${inv.name}: ${money(inv.sum)} (paid ${money(inv.payedSum)})`)
    }

    if (invs.every((i) => i.payedSum >= i.sum)) {
      console.log('  SKIP — already fully paid\n')
      continue
    }

    if (!COMMIT) {
      console.log('  DRY — would create paymentin\n')
      continue
    }

    const dup = await api('GET', `/entity/paymentin?search=${encodeURIComponent(p.ref)}&limit=10`)
    if ((dup.rows || []).some((r) => (r.description || '').includes(p.ref))) {
      console.log('  SKIP — duplicate ref already in MoySklad\n')
      continue
    }

    const created = await api('POST', '/entity/paymentin', {
      applicable: true,
      moment: p.moment,
      organization: href('organization', ORG_ID),
      agent: href('counterparty', agentId),
      organizationAccount: orgAccountHref(BANK_ACCOUNT_ID),
      sum: p.amountMinor,
      description: [MARKER, p.note, `RAK ref ${p.ref}`, 'WhatsApp receipt ingest 2026-06-10'].join(' | '),
      operations: invs.map((inv) => ({
        meta: { href: `${API}/entity/invoiceout/${inv.id}`, type: 'invoiceout', mediaType: 'application/json' },
        linkedSum: inv.sum,
      })),
    })

    console.log(`  CREATED paymentin ${created.name} | ${money(created.sum)} AED`)
    console.log(`  https://online.moysklad.ru/app/#paymentin/edit?id=${created.id}\n`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
