#!/usr/bin/env node

/**
 * Bianco Spa FZCO (Cedre) — RAK transfer received net 5,495.85 AED.
 *
 * Gross settlement:
 *   six open consignment reports                    4,459.00
 *   invoice 04780 / shipment 06492                  1,040.00
 *                                                  --------
 *                                                   5,499.00
 * Less bank transfer charge (3.00 + 5% VAT)            3.15
 * Net bank receipt                                  5,495.85
 *
 *   node --import dotenv/config scripts/moysklad-create-bianco-cedre-549585-paymentin-20260826.js
 *   node --import dotenv/config scripts/moysklad-create-bianco-cedre-549585-paymentin-20260826.js --commit
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
const AGENT_ID = '4c134860-9a4e-11ee-0a80-09ea0005ef84'
const CONTRACT_ID = '34d5fa5e-9ce3-11ee-0a80-10c7001247d8' // 00073
const WIO_AGENT_ID = '431de813-ed35-11f0-0a80-1b84009e1aae'
const BANK_FEE_EXPENSE_ID = '29939ddc-ed35-11f0-0a80-0d8e009f457c'
const STATE_REPORT_PAID_ID = 'fd15289c-c3c4-11eb-0a80-065200268290'
const STATE_ORDER_DELIVERED_ID = 'e1a0ae5f-33c5-11ea-0a80-043f000b275e'
const STATE_PAYMENTOUT_PAID_ID = 'e7020a99-d671-11ea-0a80-0216000f3623'

const BANK_REF = '000207887348'
const PAYMENT_MOMENT = '2026-08-26 11:40:26'
const GROSS_MINOR = 549900
const BANK_FEE_MINOR = 315
const NET_RECEIPT_MINOR = 549585
const MARKER = 'BIANCO-CEDRE-549585-20260826'

const REPORTS = [
  { name: '00931', id: '1fa45cc4-f802-11ef-0a80-0f6700176482', expectedMinor: 36500 },
  { name: '01055', id: '6c0b0ba2-609c-11f0-0a80-044e002e4869', expectedMinor: 59000 },
  { name: '01300', id: '62de8b07-246f-11f1-0a80-0425001161ce', expectedMinor: 1800 },
  { name: '01301', id: 'bf01fdf6-246f-11f1-0a80-119a0010faae', expectedMinor: 16500 },
  { name: '01324', id: 'ce0c6975-3413-11f1-0a80-0ee200109e65', expectedMinor: 99200 },
  { name: '01335', id: '9a1379db-43c8-11f1-0a80-196b001a3d80', expectedMinor: 232900 },
]

const INVOICE_ID = 'fdd4cd92-7a09-11f1-0a80-1c6f0023b621'
const INVOICE_NAME = '04780'
const DEMAND_ID = 'fe7eafd7-7a09-11f1-0a80-19930023f578'
const DEMAND_NAME = '06492'
const ORDER_ID = 'fd8a91b9-7a09-11f1-0a80-1d880023eade'
const INVOICE_MINOR = 104000

async function api(method, pathStr, body, attempt = 1) {
  const url = pathStr.startsWith('http') ? pathStr : API + pathStr
  try {
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: AUTH,
        Accept: 'application/json;charset=utf-8',
        'Accept-Encoding': 'gzip',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    const text = await response.text()
    if ((response.status === 429 || response.status >= 500) && attempt < 8) {
      await new Promise((resolve) => setTimeout(resolve, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!response.ok) throw new Error(`HTTP ${response.status} ${method} ${pathStr} — ${text.slice(0, 1500)}`)
    return text ? JSON.parse(text) : null
  } catch (error) {
    if (attempt < 5 && (error.message === 'fetch failed' || error.cause?.code === 'ECONNRESET')) {
      await new Promise((resolve) => setTimeout(resolve, 1500 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    throw error
  }
}

function href(type, id) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

function accountHref(id) {
  return {
    meta: {
      href: `${API}/entity/organization/${ORG_ID}/accounts/${id}`,
      type: 'account',
      mediaType: 'application/json',
    },
  }
}

function stateHref(entityType, id) {
  return {
    meta: {
      href: `${API}/entity/${entityType}/metadata/states/${id}`,
      type: 'state',
      mediaType: 'application/json',
    },
  }
}

function money(minor) {
  return (minor / 100).toFixed(2)
}

async function findDuplicate(entity, needle) {
  const result = await api('GET', `/entity/${entity}?search=${encodeURIComponent(needle)}&limit=100`)
  return (result.rows || []).find(
    (row) => row.incomingNumber === BANK_REF || String(row.description || '').includes(needle),
  )
}

async function main() {
  console.log('Bianco Cedre — reconcile RAK receipt 5,495.85 AED')
  console.log(`Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  if (agent.name !== 'Bianco Spa FZCO (Cedre Center)') throw new Error(`Unexpected agent: ${agent.name}`)

  const operations = []
  let reportTotal = 0
  for (const spec of REPORTS) {
    const report = await api('GET', `/entity/commissionreportin/${spec.id}?expand=state,contract`)
    const open = (report.sum || 0) - (report.payedSum || 0)
    if (report.name !== spec.name) throw new Error(`Expected report ${spec.name}, got ${report.name}`)
    if (!report.contract?.meta?.href?.endsWith(`/${CONTRACT_ID}`)) throw new Error(`${report.name} not on 00073`)
    if (open !== spec.expectedMinor) {
      throw new Error(`Report ${report.name} open ${money(open)} ≠ ${money(spec.expectedMinor)}`)
    }
    reportTotal += open
    operations.push({
      meta: {
        href: `${API}/entity/commissionreportin/${spec.id}`,
        type: 'commissionreportin',
        mediaType: 'application/json',
      },
      linkedSum: open,
    })
    console.log(`Report ${report.name}: ${money(open)} open | ${report.state?.name}`)
  }

  const invoice = await api('GET', `/entity/invoiceout/${INVOICE_ID}`)
  const demand = await api('GET', `/entity/demand/${DEMAND_ID}`)
  const order = await api('GET', `/entity/customerorder/${ORDER_ID}?expand=state`)
  const demandOpen = (demand.sum || 0) - (demand.payedSum || 0)
  if (invoice.name !== INVOICE_NAME || demand.name !== DEMAND_NAME) throw new Error('Invoice/shipment identity mismatch')
  if (demandOpen !== INVOICE_MINOR) throw new Error(`Shipment ${DEMAND_NAME} open ${money(demandOpen)} ≠ 1040.00`)

  operations.push({
    meta: { href: `${API}/entity/demand/${DEMAND_ID}`, type: 'demand', mediaType: 'application/json' },
    linkedSum: demandOpen,
  })

  const gross = reportTotal + demandOpen
  if (gross !== GROSS_MINOR) throw new Error(`Gross ${money(gross)} ≠ ${money(GROSS_MINOR)}`)
  if (gross - BANK_FEE_MINOR !== NET_RECEIPT_MINOR) throw new Error('Gross less fee does not equal bank receipt')

  console.log(`Reports: ${money(reportTotal)}`)
  console.log(`Invoice ${INVOICE_NAME} / shipment ${DEMAND_NAME}: ${money(demandOpen)}`)
  console.log(`Gross settlement: ${money(gross)}`)
  console.log(`Bank charge: ${money(BANK_FEE_MINOR)} (3.00 + 5% VAT)`)
  console.log(`Net receipt: ${money(gross - BANK_FEE_MINOR)}`)
  console.log(`Order ${order.name}: ${order.state?.name}`)

  if (!COMMIT) {
    console.log('DRY RUN — re-run with --commit')
    return
  }

  const duplicatePay = await findDuplicate('paymentin', BANK_REF)
  const duplicateFee = await findDuplicate('paymentout', `${MARKER}-BANK-FEE`)
  if (duplicatePay || duplicateFee) {
    throw new Error(
      `Duplicate found: ${duplicatePay ? `paymentin ${duplicatePay.name}` : ''} ${
        duplicateFee ? `paymentout ${duplicateFee.name}` : ''
      }`.trim(),
    )
  }

  const payment = await api('POST', '/entity/paymentin', {
    moment: PAYMENT_MOMENT,
    applicable: true,
    incomingNumber: BANK_REF,
    incomingDate: PAYMENT_MOMENT,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    contract: href('contract', CONTRACT_ID),
    organizationAccount: accountHref(BANK_ACCOUNT_ID),
    sum: GROSS_MINOR,
    description: [
      MARKER,
      `RAK ref ${BANK_REF}`,
      `Bank received ${money(NET_RECEIPT_MINOR)} net after ${money(BANK_FEE_MINOR)} transfer charge`,
      `reports ${REPORTS.map((report) => report.name).join(', ')}`,
      `invoice ${INVOICE_NAME} / shipment ${DEMAND_NAME}`,
    ].join(' | '),
    operations,
  })

  const fee = await api('POST', '/entity/paymentout', {
    moment: PAYMENT_MOMENT,
    applicable: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', WIO_AGENT_ID),
    organizationAccount: accountHref(BANK_ACCOUNT_ID),
    expenseItem: href('expenseitem', BANK_FEE_EXPENSE_ID),
    state: stateHref('paymentout', STATE_PAYMENTOUT_PAID_ID),
    sum: BANK_FEE_MINOR,
    description: [
      `${MARKER}-BANK-FEE`,
      `Bank transfer charge deducted from Bianco Cedre receipt`,
      `3.00 fee + 0.15 VAT`,
      `RAK ref ${BANK_REF}`,
    ].join(' | '),
  })

  for (const reportSpec of REPORTS) {
    const report = await api('GET', `/entity/commissionreportin/${reportSpec.id}?expand=state`)
    if ((report.payedSum || 0) !== (report.sum || 0)) throw new Error(`Report ${report.name} is not fully linked`)
    if (report.state?.name !== 'Paid') {
      await api('PUT', `/entity/commissionreportin/${reportSpec.id}`, {
        meta: report.meta,
        state: stateHref('commissionreportin', STATE_REPORT_PAID_ID),
      })
    }
  }

  const freshOrder = await api('GET', `/entity/customerorder/${ORDER_ID}`)
  await api('PUT', `/entity/customerorder/${ORDER_ID}`, {
    meta: freshOrder.meta,
    state: stateHref('customerorder', STATE_ORDER_DELIVERED_ID),
  })

  const finalDemand = await api('GET', `/entity/demand/${DEMAND_ID}`)
  const finalOrder = await api('GET', `/entity/customerorder/${ORDER_ID}?expand=state`)
  console.log(`Paymentin ${payment.name}: ${money(payment.sum)}`)
  console.log(`Paymentout ${fee.name}: ${money(fee.sum)}`)
  console.log(`Net account movement: ${money(payment.sum - fee.sum)}`)
  console.log(`Shipment ${finalDemand.name}: paid ${money(finalDemand.payedSum)} / ${money(finalDemand.sum)}`)
  console.log(`Order ${finalOrder.name}: ${finalOrder.state?.name}`)
  console.log(`https://online.moysklad.ru/app/#paymentin/edit?id=${payment.id}`)
}

main().catch((error) => {
  console.error('FATAL:', error.message)
  process.exit(1)
})
