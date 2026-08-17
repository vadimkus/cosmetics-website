#!/usr/bin/env node

/**
 * Mediclinic Clinics Investment LLC — remittance for invoice 04330 / shipment 05916.
 * Marks sales order GENCardM2603313541 as Доставлен.
 *
 * Bank: 2026-07-31 | 1,900.00 AED | Customer ref 2026SCLT04175 | UTR SE99992607314399
 *
 *   node --import dotenv/config scripts/moysklad-create-mediclinic-paymentin-04330-20260731.js
 *   node --import dotenv/config scripts/moysklad-create-mediclinic-paymentin-04330-20260731.js --commit
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
const AGENT_ID = '5d9d720d-82e5-11ee-0a80-049f00115b8e' // Mediclinic Clinics Investment LLC
const STATE_ORDER_DELIVERED_ID = 'e1a0ae5f-33c5-11ea-0a80-043f000b275e'

const INVOICE_ID = '3db684db-2ddd-11f1-0a80-1bdf0014e745' // 04330
const DEMAND_ID = '4a3bf971-2ddd-11f1-0a80-187200143b44' // 05916
const ORDER_ID = '253d6f1f-2ddd-11f1-0a80-03d00013f506' // GENCardM2603313541

const MARKER = 'MEDICLINIC-REMITTANCE-04330-2026-07-31'

const PAYMENT = {
  moment: '2026-07-31 10:00:00',
  amountMinor: 190000,
  customerRef: '2026SCLT04175',
  utr: 'SE99992607314399',
  scbRef: 'AE08476Q0250405',
  invoice: '04330',
  shipment: '05916',
  order: 'GENCardM2603313541',
  payer: 'Mediclinic Clinics Invest',
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
  for (const token of [PAYMENT.utr, PAYMENT.customerRef, MARKER]) {
    const data = await api('GET', `/entity/paymentin?search=${encodeURIComponent(token)}&limit=10`)
    const dup = (data.rows || []).find((r) => (r.description || '').includes(token))
    if (dup) throw new Error(`Duplicate paymentin ${dup.name} (${dup.id}) — "${token}"`)
  }
}

async function main() {
  console.log('====================================================================')
  console.log('  Mediclinic — paymentin @ invoice 04330 / shipment 05916')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}\n`)

  const [invoice, demand, order] = await Promise.all([
    api('GET', `/entity/invoiceout/${INVOICE_ID}?expand=agent,state`),
    api('GET', `/entity/demand/${DEMAND_ID}?expand=agent,invoicesOut`),
    api('GET', `/entity/customerorder/${ORDER_ID}?expand=state`),
  ])

  console.log(
    `  Invoice ${invoice.name}: ${money(invoice.sum)} AED (paid ${money(invoice.payedSum)}) @ ${invoice.moment}`,
  )
  console.log(
    `  Shipment ${demand.name}: ${money(demand.sum)} AED (paid ${money(demand.payedSum)}) @ ${demand.moment}`,
  )
  console.log(`  Order ${order.name}: state ${order.state?.name || '?'}`)
  console.log(`  Customer: ${invoice.agent?.name}`)

  if (invoice.agent?.meta?.href?.split('/').pop()?.split('?')[0] !== AGENT_ID) {
    throw new Error('Invoice agent mismatch')
  }
  if (demand.sum !== PAYMENT.amountMinor || invoice.sum !== PAYMENT.amountMinor) {
    throw new Error(`Amount mismatch — bank ${money(PAYMENT.amountMinor)} vs docs`)
  }
  if ((demand.payedSum || 0) >= demand.sum) {
    console.log('\n  SKIP — shipment already fully paid')
    return
  }
  if (new Date(PAYMENT.moment) <= new Date(demand.moment)) {
    throw new Error(`Payment moment ${PAYMENT.moment} must be after shipment ${demand.moment}`)
  }

  const invOnDemand = (demand.invoicesOut || []).some((x) => x.meta.href.includes(INVOICE_ID))
  if (!invOnDemand) throw new Error('Shipment 05916 is not linked to invoice 04330')

  await ensureNoDuplicate()

  console.log(`\n  Remittance: ${money(PAYMENT.amountMinor)} AED on ${PAYMENT.moment.slice(0, 10)}`)
  console.log(`  Ref: ${PAYMENT.customerRef} | UTR ${PAYMENT.utr}`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — would create paymentin + mark order delivered')
    return
  }

  const created = await api('POST', '/entity/paymentin', {
    applicable: true,
    moment: PAYMENT.moment,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    organizationAccount: orgAccountHref(BANK_ACCOUNT_ID),
    sum: PAYMENT.amountMinor,
    description: [
      MARKER,
      `Invoice ${PAYMENT.invoice} / shipment ${PAYMENT.shipment} / order ${PAYMENT.order}`,
      `${PAYMENT.payer} remittance ${PAYMENT.moment.slice(0, 10)}`,
      `Customer ref ${PAYMENT.customerRef}`,
      `UTR ${PAYMENT.utr}`,
      `SCB ${PAYMENT.scbRef}`,
    ].join(' | '),
    operations: [
      {
        meta: {
          href: `${API}/entity/demand/${DEMAND_ID}`,
          type: 'demand',
          mediaType: 'application/json',
        },
        linkedSum: PAYMENT.amountMinor,
      },
    ],
  })

  await api('PUT', `/entity/customerorder/${ORDER_ID}`, {
    meta: order.meta,
    state: stateHref('customerorder', STATE_ORDER_DELIVERED_ID),
  })

  const [invAfter, demAfter, orderAfter] = await Promise.all([
    api('GET', `/entity/invoiceout/${INVOICE_ID}`),
    api('GET', `/entity/demand/${DEMAND_ID}`),
    api('GET', `/entity/customerorder/${ORDER_ID}?expand=state`),
  ])

  console.log(`\n  Paymentin: ${created.name} | ${money(created.sum)} AED @ ${created.moment}`)
  console.log(`  https://online.moysklad.ru/app/#paymentin/edit?id=${created.id}`)
  console.log(`  Invoice ${invAfter.name}: paid ${money(invAfter.payedSum)} / ${money(invAfter.sum)}`)
  console.log(`  Shipment ${demAfter.name}: paid ${money(demAfter.payedSum)} / ${money(demAfter.sum)}`)
  console.log(`  Order ${orderAfter.name}: ${orderAfter.state?.name}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
