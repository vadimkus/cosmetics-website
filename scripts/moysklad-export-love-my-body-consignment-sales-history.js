#!/usr/bin/env node

/**
 * LOVE MY BODY LADIES SPA CLUB L.L.C — export full consignment sales history.
 *
 *   node --import dotenv/config scripts/moysklad-export-love-my-body-consignment-sales-history.js
 */

const fs = require('fs')
const path = require('path')
const os = require('os')

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const AGENT_ID = '9c78fe86-be3b-11f0-0a80-007f0036b570'
const CONTRACT_ID = 'aaee7975-be3b-11f0-0a80-173e00383194'

const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const DOCS_PATH = path.join(
  __dirname,
  '..',
  'docs',
  'SESSION_CHANGES_2026-07-16_LOVE_MY_BODY_CONSIGNMENT_SALES_HISTORY.md'
)

async function api(pathStr, attempt = 1) {
  const res = await fetch(API + pathStr, {
    headers: { Authorization: AUTH, Accept: 'application/json;charset=utf-8', 'Accept-Encoding': 'gzip' },
  })
  const text = await res.text()
  if ((res.status === 429 || res.status >= 500) && attempt < 10) {
    await new Promise((r) => setTimeout(r, 600 * attempt))
    return api(pathStr, attempt + 1)
  }
  if (!res.ok) throw new Error(`HTTP ${res.status} ${pathStr} — ${text.slice(0, 300)}`)
  return text ? JSON.parse(text) : null
}

async function fetchAll(pathStr) {
  const rows = []
  let offset = 0
  while (true) {
    const sep = pathStr.includes('?') ? '&' : '?'
    const data = await api(`${pathStr}${sep}limit=1000&offset=${offset}`)
    rows.push(...(data.rows || []))
    if ((data.rows || []).length < 1000) break
    offset += 1000
  }
  return rows
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const money = (minor) => ((minor || 0) / 100).toFixed(2)

async function loadPaymentinsForAgent() {
  const payFilter = encodeURIComponent(`agent=${API}/entity/counterparty/${AGENT_ID}`)
  const paymentins = await fetchAll(`/entity/paymentin?filter=${payFilter}&order=moment,asc`)
  const linked = []
  for (const p of paymentins) {
    await sleep(150)
    const payFull = await api(`/entity/paymentin/${p.id}`)
    for (const op of payFull.operations || []) {
      if (op.meta?.type !== 'commissionreportin') continue
      const reportId = op.meta.href.split('/').pop().split('?')[0]
      linked.push({
        reportId,
        paymentin: payFull.name,
        paymentDate: payFull.moment?.slice(0, 10),
        linkedSumMinor: op.linkedSum || payFull.sum,
      })
    }
  }
  return linked
}

async function loadHistory() {
  const [agent, contract, paymentLinks] = await Promise.all([
    api(`/entity/counterparty/${AGENT_ID}`),
    api(`/entity/contract/${CONTRACT_ID}`),
    loadPaymentinsForAgent(),
  ])

  const paymentsByReport = new Map()
  for (const p of paymentLinks) {
    const list = paymentsByReport.get(p.reportId) || []
    list.push(p)
    paymentsByReport.set(p.reportId, list)
  }

  const filter = encodeURIComponent(`agent=${API}/entity/counterparty/${AGENT_ID}`)
  const reports = await fetchAll(`/entity/commissionreportin?filter=${filter}&order=moment,asc`)

  const history = []
  for (const r of reports) {
    await sleep(250)
    const full = await api(`/entity/commissionreportin/${r.id}?expand=state,contract`)
    await sleep(250)
    const pos = await fetchAll(`/entity/commissionreportin/${r.id}/positions`)
    const lines = []
    for (const p of pos) {
      await sleep(120)
      const id = p.assortment.meta.href.split('/').pop().split('?')[0]
      const prod = await api(`/entity/product/${id}`)
      lines.push({
        code: prod.code,
        name: prod.name.replace(/^Genosys\s+/i, ''),
        qty: p.quantity,
        unitMinor: p.price,
        lineMinor: p.price * p.quantity,
      })
    }
    const payments = paymentsByReport.get(full.id) || []
    history.push({
      name: full.name,
      moment: full.moment?.slice(0, 10),
      periodStart: full.commissionPeriodStart?.slice(0, 10),
      periodEnd: full.commissionPeriodEnd?.slice(0, 10),
      sumMinor: full.sum,
      payedMinor: full.payedSum,
      state: full.state?.name,
      id: full.id,
      lines,
      units: lines.reduce((s, l) => s + l.qty, 0),
      payments,
      paymentDate: payments.length ? payments.map((p) => p.paymentDate).join(', ') : '—',
      paymentin: payments.length ? payments.map((p) => p.paymentin).join(', ') : '—',
    })
  }

  return { agent, contract, history }
}

function aggregateByCode(history) {
  const map = new Map()
  for (const report of history) {
    for (const line of report.lines) {
      const prev = map.get(line.code) || { code: line.code, name: line.name, qty: 0, lineMinor: 0 }
      prev.qty += line.qty
      prev.lineMinor += line.lineMinor
      map.set(line.code, prev)
    }
  }
  return [...map.values()].sort((a, b) => b.lineMinor - a.lineMinor)
}

function renderMarkdown({ agent, contract, history }) {
  const totalMinor = history.reduce((s, r) => s + r.sumMinor, 0)
  const paidMinor = history.reduce((s, r) => s + r.payedMinor, 0)
  const openMinor = totalMinor - paidMinor
  const totalUnits = history.reduce((s, r) => s + r.units, 0)
  const agg = aggregateByCode(history)
  const today = new Date().toISOString().slice(0, 10)

  let md = `# Love My Body Salon — consignment sales history

**Generated:** ${today} (live MoySklad)  
**Customer:** ${agent.name} — \`${AGENT_ID}\`  
**Agreement:** ${contract.name} — \`${CONTRACT_ID}\`  
**Location:** Bluewaters Island, Dubai

## Summary

| Metric | Value |
|---|---:|
| Reports | ${history.length} |
| Total sold (all reports) | **${money(totalMinor)} AED** |
| Paid | **${money(paidMinor)} AED** |
| Outstanding | **${money(openMinor)} AED** |
| Units sold (line qty sum) | ${totalUnits} |

## Report index

| Report | Posted | Period | Sum AED | Payment date | Payment in | Status |
|---|---|---|---:|---|---|---|
`

  for (const r of history) {
    md += `| **${r.name}** | ${r.moment} | ${r.periodStart} → ${r.periodEnd} | ${money(r.sumMinor)} | ${r.paymentDate} | ${r.paymentin} | ${r.state} |\n`
  }

  md += `\n## Lifetime top sellers (by AED, all reports)\n\n`
  md += `| Code | Product | Total qty | Total AED |\n|---|---|---:|---:|\n`
  for (const row of agg.slice(0, 20)) {
    md += `| \`${row.code}\` | ${row.name} | ${row.qty} | ${money(row.lineMinor)} |\n`
  }

  md += `\n## Report detail\n`
  for (const r of history) {
    md += `\n### Report **${r.name}** — ${money(r.sumMinor)} AED (${r.state})\n\n`
    md += `- **Posted:** ${r.moment}  \n`
    md += `- **Period:** ${r.periodStart} → ${r.periodEnd}  \n`
    md += `- **Paid:** ${money(r.payedMinor)} / ${money(r.sumMinor)} AED  \n`
    if (r.payments.length) {
      md += `- **Payment date:** ${r.paymentDate} (paymentin **${r.paymentin}**)  \n`
    }
    md += `- [Open in MoySklad](https://online.moysklad.ru/app/#commissionreport/edit?id=${r.id})\n\n`
    md += `| Code | Product | Qty | Unit | Line |\n|---|---|---:|---:|---:|\n`
    for (const line of r.lines) {
      md += `| \`${line.code}\` | ${line.name} | ${line.qty} | ${money(line.unitMinor)} | ${money(line.lineMinor)} |\n`
    }
    md += `| | **TOTAL** | **${r.units}** | | **${money(r.sumMinor)}** |\n`
  }

  md += `\n## Notes\n\n`
  md += `- **Report 01347** (2026-05-08) and **01367** (May 2026 month-end) both cover May activity — check clinic records if reconciling monthly totals.\n`
  md += `- **Report 01400** (June 2026): sales report shows **SPF50** sold (\`54457\`); consignment note **06474** shipped **SPF40** (\`00041\`) — see [SESSION_CHANGES_2026-07-04_LOVE_MY_BODY_COMMISSION_DEMAND.md](./SESSION_CHANGES_2026-07-04_LOVE_MY_BODY_COMMISSION_DEMAND.md).\n`
  if (openMinor > 0) {
    md += `- **Outstanding:** report **01400** — **${money(openMinor)} AED** not yet paid (paymentin pending).\n`
  }
  md += `\n**Script:** \`scripts/moysklad-export-love-my-body-consignment-sales-history.js\`\n`

  return md
}

async function main() {
  console.log('Fetching Love My Body consignment sales history...')
  const data = await loadHistory()
  const md = renderMarkdown(data)

  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const ordersPath = path.join(ORDERS_DIR, 'GENOSYS_Love_My_Body_Consignment_Sales_History.md')
  fs.writeFileSync(DOCS_PATH, md)
  fs.writeFileSync(ordersPath, md)

  console.log(`Reports: ${data.history.length}`)
  console.log(`Total sold: ${money(data.history.reduce((s, r) => s + r.sumMinor, 0))} AED`)
  console.log(`Docs: ${DOCS_PATH}`)
  console.log(`Orders copy: ${ordersPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
