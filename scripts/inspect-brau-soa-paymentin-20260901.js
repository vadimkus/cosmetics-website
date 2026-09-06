#!/usr/bin/env node

/**
 * Inspect Brau Ladies SOA invoices for 6,300 AED remittance (KSA left unpaid).
 *
 *   node --import dotenv/config scripts/inspect-brau-soa-paymentin-20260901.js
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD
const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const AGENT_ID = 'ce7c406d-dadf-11ee-0a80-130f00597aa2'

const SOA = [
  { name: '04975', expectedMinor: 68000, pay: true, branch: 'DIFC' },
  { name: '04974', expectedMinor: 106000, pay: true, branch: 'ABU DHABI' },
  { name: '04944', expectedMinor: 38000, pay: true, branch: 'Jumeirah' },
  { name: '04943', expectedMinor: 76000, pay: true, branch: 'Abu Dhabi' },
  { name: '04942', expectedMinor: 38000, pay: true, branch: 'Springs' },
  { name: '04916', expectedMinor: 95000, pay: false, branch: 'KSA Centeria' },
  { name: '04915', expectedMinor: 95000, pay: false, branch: 'KSA Canopy' },
  { name: '04910', expectedMinor: 76000, pay: true, branch: 'ADU' },
  { name: '04890', expectedMinor: 76000, pay: true, branch: 'ADU' },
  { name: '04889', expectedMinor: 38000, pay: true, branch: 'Springs' },
  { name: '04866', expectedMinor: 76000, pay: true, branch: 'ADU' },
  { name: '04865', expectedMinor: 38000, pay: true, branch: 'Springs' },
]

async function api(pathStr) {
  const res = await fetch(`${API}${pathStr}`, {
    headers: {
      Authorization: AUTH,
      Accept: 'application/json;charset=utf-8',
      'Accept-Encoding': 'gzip',
    },
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`HTTP ${res.status} ${pathStr} — ${text.slice(0, 800)}`)
  return text ? JSON.parse(text) : null
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

function idFromHref(href) {
  return href ? href.split('/').pop().split('?')[0] : ''
}

async function main() {
  const rows = []
  for (const spec of SOA) {
    const found = await api(`/entity/invoiceout?filter=${encodeURIComponent(`name=${spec.name}`)}&limit=20`)
    const invRow = (found.rows || []).find((r) => r.agent?.meta?.href?.endsWith(`/${AGENT_ID}`))
    if (!invRow) throw new Error(`Invoice ${spec.name} not found`)
    const inv = await api(`/entity/invoiceout/${invRow.id}?expand=demands,customerOrder,state`)
    if (inv.sum !== spec.expectedMinor) {
      throw new Error(`${spec.name} sum ${money(inv.sum)} ≠ ${money(spec.expectedMinor)}`)
    }
    const demandMeta = (inv.demands || [])[0]
    if (!demandMeta) throw new Error(`${spec.name} has no demand`)
    const demand = await api(`/entity/demand/${idFromHref(demandMeta.meta.href)}?expand=invoicesOut,customerOrder`)
    let orderId = idFromHref(inv.customerOrder?.meta?.href)
    let orderName = inv.customerOrder?.name || ''
    if (!orderId) {
      const linked = await api(
        `/entity/customerorder?filter=${encodeURIComponent(`agent=https://api.moysklad.ru/api/remap/1.2/entity/counterparty/${AGENT_ID}`)};${encodeURIComponent(`name~`)}&limit=1`,
      )
      void linked
    }
    if (!orderId) {
      const soSearch = await api(
        `/entity/invoiceout/${inv.id}?expand=customerOrder`,
      )
      orderId = idFromHref(soSearch.customerOrder?.meta?.href)
      orderName = soSearch.customerOrder?.name || ''
    }
    if (!orderId) {
      // invoice-only demand — find SO via invoice customerOrder already tried; try demand customerOrder (should be empty)
      const invOps = await api(`/entity/invoiceout/${inv.id}?expand=customerOrder`)
      orderId = idFromHref(invOps.customerOrder?.meta?.href)
      orderName = invOps.customerOrder?.name || ''
    }

    rows.push({
      pay: spec.pay,
      branch: spec.branch,
      invoice: inv.name,
      invoiceId: inv.id,
      invSum: inv.sum,
      invPaid: inv.payedSum || 0,
      invMoment: inv.moment,
      shipment: demand.name,
      shipmentId: demand.id,
      shipSum: demand.sum,
      shipPaid: demand.payedSum || 0,
      shipMoment: demand.moment,
      hasCustomerOrderOnDemand: Boolean(demand.customerOrder),
      orderName,
      orderId,
    })
  }

  console.log(JSON.stringify(rows, null, 2))
  const pay = rows.filter((r) => r.pay)
  const leave = rows.filter((r) => !r.pay)
  const payTotal = pay.reduce((s, r) => s + r.invSum, 0)
  const leaveTotal = leave.reduce((s, r) => s + r.invSum, 0)
  console.log('\nPAY', money(payTotal), pay.map((r) => r.invoice).join(', '))
  console.log('LEAVE KSA', money(leaveTotal), leave.map((r) => `${r.invoice} ${r.branch}`).join(', '))
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
