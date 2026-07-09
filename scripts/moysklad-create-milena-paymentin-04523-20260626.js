#!/usr/bin/env node

/**
 * Milena Aesthetic Clinic LLC — Wio bank inflow → paymentin @ invoice 04523.
 *
 * Bank: 2026-06-05 | ref 256964648 | 540.00 AED | From MILENA AESTHETIC CLINIC LLC
 *
 *   node --import dotenv/config scripts/moysklad-create-milena-paymentin-04523-20260626.js
 *   node --import dotenv/config scripts/moysklad-create-milena-paymentin-04523-20260626.js --commit
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
const MARKER = 'MILENA-WIO-PAYMENTIN-04523-2026-06-26'

const PAYMENT = {
  ref: '256964648',
  moment: '2026-06-05 12:00:00',
  amountMinor: 54000,
  note: 'INV 04523 GENOSYS',
  sender: 'MILENA AESTHETIC CLINIC LLC',
  invoice: '04523',
}

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
  console.log('  Milena Aesthetic Clinic LLC — paymentin @ invoice 04523')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}\n`)

  const inv = await getInvoice(PAYMENT.invoice)
  const agentId = inv.agent.meta.href.split('/').pop()
  const agentName = inv.agent?.name || PAYMENT.sender

  console.log(`${PAYMENT.sender} | ${money(PAYMENT.amountMinor)} AED | Wio ref ${PAYMENT.ref}`)
  console.log(`  Invoice ${inv.name}: ${money(inv.sum)} AED (paid ${money(inv.payedSum)} AED)`)
  console.log(`  Customer: ${agentName}`)

  if (inv.sum !== PAYMENT.amountMinor) {
    throw new Error(`Bank ${money(PAYMENT.amountMinor)} ≠ invoice ${money(inv.sum)}`)
  }

  if (inv.payedSum >= inv.sum) {
    console.log('\n  SKIP — invoice already fully paid')
    return
  }

  const dup = await api('GET', `/entity/paymentin?search=${encodeURIComponent(PAYMENT.ref)}&limit=10`)
  if ((dup.rows || []).some((r) => (r.description || '').includes(PAYMENT.ref))) {
    console.log('\n  SKIP — Wio ref already booked in MoySklad')
    return
  }

  if (!COMMIT) {
    console.log('\n  DRY — would create paymentin linked to invoice 04523')
    return
  }

  const created = await api('POST', '/entity/paymentin', {
    applicable: true,
    moment: PAYMENT.moment,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agentId),
    organizationAccount: orgAccountHref(BANK_ACCOUNT_ID),
    sum: PAYMENT.amountMinor,
    description: [MARKER, PAYMENT.note, `Wio ref ${PAYMENT.ref}`, 'Bank ingest 2026-06-26'].join(' | '),
    operations: [
      {
        meta: {
          href: `${API}/entity/invoiceout/${inv.id}`,
          type: 'invoiceout',
          mediaType: 'application/json',
        },
        linkedSum: inv.sum,
      },
    ],
  })

  console.log(`\n  CREATED paymentin ${created.name} | ${money(created.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#paymentin/edit?id=${created.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
