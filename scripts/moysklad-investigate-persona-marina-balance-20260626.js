#!/usr/bin/env node

/**
 * Investigate First Person Ladies Salon (Marina) settlement balance — why UI shows
 * «Баланс (мы должны): 882 AED» on paymentin 05819.
 *
 *   node --import dotenv/config scripts/moysklad-investigate-persona-marina-balance-20260626.js
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const AGENT_ID = 'af21a79a-63cd-11ea-0a80-02b2000e2aeb'
const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const GAP_MS = 80
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function api(pathStr, retries = 5) {
  for (let i = 0; i <= retries; i++) {
    await sleep(GAP_MS)
    const res = await fetch(pathStr.startsWith('http') ? pathStr : API + pathStr, {
      headers: {
        Authorization: AUTH,
        Accept: 'application/json;charset=utf-8',
        'Accept-Encoding': 'gzip',
      },
    })
    const text = await res.text()
    if ((res.status === 429 || res.status === 503) && i < retries) {
      await sleep(600 * (i + 1))
      continue
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${pathStr} — ${text.slice(0, 800)}`)
    return text ? JSON.parse(text) : null
  }
}

async function fetchAllForAgent(entityPath) {
  const rows = []
  let offset = 0
  while (true) {
    const filter = `agent=https://api.moysklad.ru/api/remap/1.2/entity/counterparty/${AGENT_ID}`
    const sep = entityPath.includes('?') ? '&' : '?'
    const data = await api(
      `${entityPath}${sep}filter=${encodeURIComponent(filter)};applicable=true&limit=1000&offset=${offset}`
    )
    rows.push(...(data.rows || []))
    if ((data.rows || []).length < 1000) break
    offset += 1000
  }
  return rows
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

function deltaPayedMinusSum(doc) {
  return (doc.payedSum || 0) - (doc.sum || 0)
}

function deltaReturnCredit(doc) {
  return (doc.sum || 0) - (doc.payedSum || 0)
}

function fmtDoc(type, doc, deltaMinor, note = '') {
  const unpaid = (doc.sum || 0) - (doc.payedSum || 0)
  return {
    type,
    name: doc.name,
    moment: (doc.moment || '').slice(0, 10),
    sum: money(doc.sum),
    payedSum: money(doc.payedSum),
    delta: money(deltaMinor),
    unpaid: money(unpaid),
    note,
    contract: doc.contract?.name || (doc.contract?.meta?.href ? 'yes' : ''),
  }
}

async function main() {
  const agent = await api(`/entity/counterparty/${AGENT_ID}`)
  console.log('====================================================================')
  console.log(`  Balance investigation: ${agent.name}`)
  console.log(`  Agent ID: ${AGENT_ID}`)
  console.log('====================================================================\n')

  const [invoices, demands, reports, returns, paymentins, cashins] = await Promise.all([
    fetchAllForAgent('/entity/invoiceout'),
    fetchAllForAgent('/entity/demand'),
    fetchAllForAgent('/entity/commissionreportin'),
    fetchAllForAgent('/entity/salesreturn'),
    fetchAllForAgent('/entity/paymentin'),
    fetchAllForAgent('/entity/cashin'),
  ])

  let settlementBalance = 0
  const lines = []

  for (const inv of invoices) {
    const d = deltaPayedMinusSum(inv)
    settlementBalance += d
    lines.push(fmtDoc('invoiceout', inv, d))
  }

  for (const rep of reports) {
    const d = deltaPayedMinusSum(rep)
    settlementBalance += d
    lines.push(fmtDoc('commissionreportin', rep, d, rep.contract?.name || ''))
  }

  for (const ret of returns) {
    const d = deltaReturnCredit(ret)
    if (d !== 0) {
      settlementBalance += d
      lines.push(fmtDoc('salesreturn', ret, d))
    }
  }

  // Retail demands without invoice link (settlement)
  for (const dem of demands) {
    if (dem.contract?.meta?.href) continue
    const hasInv =
      Boolean(dem.invoicesOut?.length) || Boolean(dem.invoiceOut?.meta?.href)
    if (hasInv) continue
    const d = deltaPayedMinusSum(dem)
    if (d !== 0) {
      settlementBalance += d
      lines.push(fmtDoc('demand (retail)', dem, d))
    }
  }

  const overpaid = lines.filter((l) => parseFloat(l.delta) > 0.01)
  const underpaid = lines.filter((l) => parseFloat(l.delta) < -0.01)

  console.log('SETTLEMENT BALANCE (invoiceout + commissionreportin + salesreturn credits)')
  console.log(`  Total: ${money(settlementBalance)} AED`)
  if (settlementBalance > 0) {
    console.log('  → Positive = Genosys OVERPAID / WE OWE CUSTOMER («мы должны»)\n')
  } else if (settlementBalance < 0) {
    console.log('  → Negative = CUSTOMER OWES US («нам должны»)\n')
  } else {
    console.log('  → Zero balance\n')
  }

  console.log('--- Documents with OVERPAYMENT (payedSum > sum) ---')
  if (!overpaid.length) console.log('  (none)')
  else {
    for (const l of overpaid.sort((a, b) => parseFloat(b.delta) - parseFloat(a.delta))) {
      console.log(
        `  ${l.type.padEnd(22)} ${l.name.padEnd(8)} ${l.moment}  sum=${l.sum}  payed=${l.payedSum}  Δ=+${l.delta}  ${l.note}`
      )
    }
  }

  console.log('\n--- Documents with UNPAID balance (customer owes us) ---')
  const topDebt = underpaid.sort((a, b) => parseFloat(a.delta) - parseFloat(b.delta)).slice(0, 20)
  if (!topDebt.length) console.log('  (none)')
  else {
    for (const l of topDebt) {
      console.log(
        `  ${l.type.padEnd(22)} ${l.name.padEnd(8)} ${l.moment}  sum=${l.sum}  payed=${l.payedSum}  Δ=${l.delta}  unpaid=${l.unpaid}  ${l.note}`
      )
    }
  }

  console.log('\n--- Consignment отгрузки (NOT in settlement — UI may show unpaid) ---')
  const consignmentDemands = demands
    .filter((d) => d.contract?.meta?.href)
    .map((d) => ({
      name: d.name,
      moment: (d.moment || '').slice(0, 10),
      sum: money(d.sum),
      payedSum: money(d.payedSum),
      unpaid: money((d.sum || 0) - (d.payedSum || 0)),
      contract: d.contract?.name || '',
    }))
    .sort((a, b) => b.moment.localeCompare(a.moment))

  let consignmentUnpaidTotal = 0
  for (const d of consignmentDemands) {
    consignmentUnpaidTotal += parseFloat(d.unpaid)
    console.log(
      `  demand ${d.name}  ${d.moment}  ${d.sum} AED  paid ${d.payedSum}  unpaid ${d.unpaid}  (${d.contract})`
    )
  }
  console.log(`  Total consignment demand unpaid (UI noise): ${consignmentUnpaidTotal.toFixed(2)} AED`)

  console.log('\n--- Recent paymentin / cashin ---')
  const payments = [...paymentins, ...cashins]
    .sort((a, b) => (b.moment || '').localeCompare(a.moment || ''))
    .slice(0, 15)
  for (const p of payments) {
    console.log(
      `  ${p.meta?.type || 'payment'} ${p.name}  ${(p.moment || '').slice(0, 16)}  ${money(p.sum)} AED  applicable=${p.applicable}`
    )
  }

  // Target docs from screenshot
  console.log('\n--- Screenshot chain (26 Jun retail 550 AED) ---')
  for (const num of ['04722', '06411', '05819', '06412']) {
    const inv = invoices.find((x) => x.name === num)
    const dem = demands.find((x) => x.name === num)
    const pay = paymentins.find((x) => x.name === num)
    const doc = inv || dem || pay
    if (!doc) {
      console.log(`  ${num}: not found`)
      continue
    }
    const type = inv ? 'invoiceout' : dem ? 'demand' : 'paymentin'
    console.log(
      `  ${type} ${num}: sum=${money(doc.sum)} payed=${money(doc.payedSum)} applicable=${doc.applicable} moment=${(doc.moment || '').slice(0, 16)}`
    )
  }

  // Sum overpayments to explain 882
  const overTotal = overpaid.reduce((s, l) => s + parseFloat(l.delta), 0)
  const debtTotal = underpaid.reduce((s, l) => s + parseFloat(l.delta), 0)
  console.log('\n--- Reconciliation ---')
  console.log(`  Sum of overpayments (Δ>0):     +${overTotal.toFixed(2)} AED`)
  console.log(`  Sum of underpayments (Δ<0):    ${debtTotal.toFixed(2)} AED`)
  console.log(`  Net settlement balance:       ${money(settlementBalance)} AED`)
  console.log(`  Target from UI:               882.00 AED`)
  console.log(`  Match: ${Math.abs(settlementBalance / 100 - 882) < 1 ? 'YES ✓' : 'NO — check MoySklad counterparty.accountsReceivable'}`)

  // Try counterparty accounts receivable if available
  if (agent.accountsReceivable !== undefined) {
    console.log(`\n  counterparty.accountsReceivable: ${money(agent.accountsReceivable)} AED`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
