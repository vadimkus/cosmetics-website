#!/usr/bin/env node

/**
 * MoySklad customer balance audit — find cases where Genosys appears to owe customers.
 *
 * Method (matches how you book in this account):
 *   Retail debt      = unpaid invoiceout only (not consignment demands)
 *   Consignment debt = unpaid commissionreportin only
 *   Payments         = paymentin + cashin (applicable)
 *   Balance (MoySklad convention) = Σ (payedSum − sum) on receivable docs
 *     invoiceout + commissionreportin
 *     + Σ (sum − payedSum) on salesreturn (customer credit / reduces debt)
 *     > 0  → we overpaid / owe customer
 *     < 0  → customer owes us
 *
 * Consignment отгрузки (demand with contract) are excluded — they often show
 * "Не оплачено" in UI but settlement is via commission report, not the shipment.
 *
 * Also flags:
 *   - payedSum > sum on any doc
 *   - same invoice+shipment both unpaid (duplicate debt risk)
 *   - consignment demands with payedSum < sum (UI "unpaid" — usually normal)
 *
 *   node --import dotenv/config scripts/moysklad-audit-customer-balances-20260611.js
 *   node --import dotenv/config scripts/moysklad-audit-customer-balances-20260611.js --json
 */

const fs = require('fs')
const path = require('path')

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const { uaeToday } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const JSON_OUT = process.argv.includes('--json')
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

async function fetchAll(entityPath) {
  const rows = []
  let offset = 0
  while (true) {
    const sep = entityPath.includes('?') ? '&' : '?'
    const data = await api(`${entityPath}${sep}limit=1000&offset=${offset}`)
    rows.push(...(data.rows || []))
    if ((data.rows || []).length < 1000) break
    offset += 1000
  }
  return rows
}

function agentId(doc) {
  return doc.agent?.meta?.href?.split('/').pop()?.split('?')[0] || ''
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

function hasContract(doc) {
  return Boolean(doc.contract?.meta?.href)
}

function hasInvoiceLink(doc) {
  return Boolean(doc.invoicesOut?.length || doc.invoiceOut?.meta?.href)
}

async function main() {
  const started = Date.now()
  process.stderr.write('Loading counterparties...\n')
  const counterparties = await fetchAll('/entity/counterparty')
  const names = new Map(counterparties.map((c) => [c.id, c.name]))

  process.stderr.write('Loading documents...\n')
  const [invoices, demands, reports, returns] = await Promise.all([
    fetchAll('/entity/invoiceout?filter=applicable=true'),
    fetchAll('/entity/demand?filter=applicable=true'),
    fetchAll('/entity/commissionreportin?filter=applicable=true'),
    fetchAll('/entity/salesreturn?filter=applicable=true'),
  ])

  const buckets = new Map()
  const ensure = (id) => {
    if (!id) return null
    if (!buckets.has(id)) {
      buckets.set(id, {
        id,
        name: names.get(id) || id,
        balance: 0,
        retailDocs: [],
        consignmentDocs: [],
        consignmentDemandUnpaid: 0,
        consignmentDemandDocs: [],
        flags: [],
      })
    }
    return buckets.get(id)
  }

  const overpaidDocs = []
  const duplicatePairs = []

  for (const inv of invoices) {
    const delta = (inv.payedSum || 0) - (inv.sum || 0)
    if (inv.payedSum > inv.sum) {
      overpaidDocs.push({
        type: 'invoiceout',
        name: inv.name,
        agent: inv.agent?.name,
        sum: money(inv.sum),
        payedSum: money(inv.payedSum),
        over: money(inv.payedSum - inv.sum),
      })
    }
    const b = ensure(agentId(inv))
    if (!b) continue
    b.balance += delta
    if (delta < 0) b.retailDocs.push({ type: 'invoice', name: inv.name, balance: money(delta) })
  }

  for (const dem of demands) {
    const unpaid = (dem.sum || 0) - (dem.payedSum || 0)

    if (hasContract(dem)) {
      // Consignment stock — track UI "unpaid" separately (not settlement balance)
      if (unpaid > 0) {
        const b = ensure(agentId(dem))
        if (b) {
          b.consignmentDemandUnpaid += unpaid
          b.consignmentDemandDocs.push({ name: dem.name, unpaid: money(unpaid) })
        }
      }
      continue
    }

    if (dem.payedSum > dem.sum) {
      overpaidDocs.push({
        type: 'demand',
        name: dem.name,
        agent: dem.agent?.name,
        sum: money(dem.sum),
        payedSum: money(dem.payedSum),
        over: money(dem.payedSum - dem.sum),
      })
    }

    if (hasInvoiceLink(dem) && unpaid > 0) {
      const invHref = dem.invoicesOut?.[0]?.meta?.href || dem.invoiceOut?.meta?.href
      const invId = invHref?.split('/').pop()?.split('?')[0]
      const inv = invId ? invoices.find((x) => x.id === invId) : null
      if (inv) {
        const invUnpaid = (inv.sum || 0) - (inv.payedSum || 0)
        if (invUnpaid > 0) {
          duplicatePairs.push({
            agent: dem.agent?.name || names.get(agentId(dem)),
            invoice: inv.name,
            shipment: dem.name,
            amount: money(invUnpaid),
          })
        }
        continue
      }
    }

    const delta = (dem.payedSum || 0) - (dem.sum || 0)
    const b = ensure(agentId(dem))
    if (!b || delta >= 0) continue
    b.balance += delta
    b.retailDocs.push({ type: 'demand', name: dem.name, balance: money(delta) })
  }

  for (const ret of returns) {
    const delta = (ret.sum || 0) - (ret.payedSum || 0)
    const b = ensure(agentId(ret))
    if (!b || delta <= 0) continue
    b.balance += delta
    b.retailDocs.push({ type: 'salesreturn', name: ret.name, balance: money(delta) })
  }

  for (const rep of reports) {
    const delta = (rep.payedSum || 0) - (rep.sum || 0)
    if (rep.payedSum > rep.sum) {
      overpaidDocs.push({
        type: 'commissionreportin',
        name: rep.name,
        agent: rep.agent?.name,
        sum: money(rep.sum),
        payedSum: money(rep.payedSum),
        over: money(rep.payedSum - rep.sum),
      })
    }
    const b = ensure(agentId(rep))
    if (!b) continue
    b.balance += delta
    if (delta < 0) b.consignmentDocs.push({ type: 'report', name: rep.name, balance: money(delta) })
  }

  const rows = [...buckets.values()].map((b) => {
    const flags = [...b.flags]
    if (b.balance > 100) flags.push('WE_OWE_CUSTOMER')
    if (b.balance < -100) flags.push('CUSTOMER_OWES_US')
    if (b.consignmentDemandUnpaid > 0) flags.push('CONSIGNMENT_SHIPMENTS_SHOW_UNPAID')
    return {
      ...b,
      balanceAed: money(b.balance),
      consignmentDemandUnpaidAed: money(b.consignmentDemandUnpaid),
      flags,
    }
  })

  const weOwe = rows.filter((r) => r.balance > 100).sort((a, b) => b.balance - a.balance)
  const theyOwe = rows.filter((r) => r.balance < -100).sort((a, b) => a.balance - b.balance)

  const summary = {
    asOf: uaeToday(),
    elapsedSec: ((Date.now() - started) / 1000).toFixed(1),
    totals: {
      counterpartiesWithActivity: rows.length,
      weOweCustomers: weOwe.length,
      customersOweUs: theyOwe.length,
      overpaidDocuments: overpaidDocs.length,
      duplicateInvoiceShipmentPairs: duplicatePairs.length,
      consignmentCustomersWithUnpaidShipments: rows.filter((r) => r.consignmentDemandUnpaid > 0)
        .length,
    },
    weOweTop25: weOwe.slice(0, 25).map((r) => ({
      name: r.name,
      balanceAed: r.balanceAed,
      flags: r.flags,
      sampleUnpaidRetail: r.retailDocs.slice(0, 3),
      sampleUnpaidConsignment: r.consignmentDocs.slice(0, 3),
    })),
    theyOweTop25: theyOwe.slice(0, 25).map((r) => ({
      name: r.name,
      balanceAed: r.balanceAed,
      flags: r.flags,
      sampleUnpaidRetail: r.retailDocs.slice(0, 5),
      sampleUnpaidConsignment: r.consignmentDocs.slice(0, 5),
      consignmentDemandUnpaidAed: r.consignmentDemandUnpaidAed,
    })),
    overpaidDocs: overpaidDocs.slice(0, 50),
    duplicatePairs: duplicatePairs.slice(0, 50),
  }

  const outDir = path.join(__dirname, '..', 'docs')
  const jsonPath = path.join(outDir, 'MOYSKLAD_CUSTOMER_BALANCE_AUDIT_2026-06-11.json')
  const mdPath = path.join(outDir, 'MOYSKLAD_CUSTOMER_BALANCE_AUDIT_2026-06-11.md')
  fs.writeFileSync(jsonPath, JSON.stringify(summary, null, 2))

  const md = [
    '# MoySklad customer balance audit (2026-06-11)',
    '',
    `**As of:** ${summary.asOf} · **Runtime:** ${summary.elapsedSec}s`,
    '',
    '## Method',
    '',
    '- **Settlement balance** = Σ (`payedSum` − `sum`) on `invoiceout` + `commissionreportin`',
    '- **Positive** → Genosys overpaid / owes customer',
    '- **Negative** → customer owes Genosys',
    '- **Consignment отгрузки** (demand with contract) are **excluded** from settlement — they often show **Не оплачено** in UI; payment is via commission report',
    '',
    '## Summary',
    '',
    `| Metric | Count |`,
    `|--------|------:|`,
    `| Counterparties with receivable activity | ${summary.totals.counterpartiesWithActivity} |`,
    `| **We owe customer** (overpaid, balance > 1 AED) | **${summary.totals.weOweCustomers}** |`,
    `| Customer owes us (balance < −1 AED) | ${summary.totals.customersOweUs} |`,
    `| Consignment customers with unpaid отгрузки (UI only) | ${summary.totals.consignmentCustomersWithUnpaidShipments} |`,
    `| Documents with payedSum > sum | ${summary.totals.overpaidDocuments} |`,
    `| Invoice + shipment both unpaid (duplicate risk) | ${summary.totals.duplicateInvoiceShipmentPairs} |`,
    '',
    '## Interpretation',
    '',
    'If MoySklad shows **"we owe the customer"** on a **consignment salon**, it is usually the **отгрузка** marked unpaid — that is **normal**; settlement is on the **commission report**, not each shipment.',
    '',
    '**True mistakes to fix:**',
    '1. `payedSum > sum` on invoice / report (real overpayment)',
    '2. Same retail sale unpaid on **both** invoice **and** shipment (double debt)',
    '3. Unpaid **commission report** with no matching payment (customer owes you — collect)',
    '',
    '## We owe customer (overpaid)',
    '',
    weOwe.length
      ? weOwe.map((r) => `- **${r.name}** — ${r.balanceAed} AED`).join('\n')
      : '_None > 1 AED._',
    '',
    '## Top 25 — customer owes us',
    '',
    '| Customer | Balance AED | Unpaid reports/invoices |',
    '|----------|------------:|------------------------|',
    ...summary.theyOweTop25.map((r) => `| ${r.name} | ${r.balanceAed} | see JSON |`),
    '',
    '## Duplicate invoice + shipment (both unpaid)',
    '',
    duplicatePairs.length
      ? duplicatePairs
          .map((d) => `- **${d.agent}** — invoice ${d.invoice} + shipment ${d.shipment} @ ${d.amount} AED`)
          .join('\n')
      : '_None found._',
    '',
    '## Overpaid documents (payedSum > sum)',
    '',
    overpaidDocs.length
      ? overpaidDocs.map((d) => `- ${d.type} **${d.name}** (${d.agent}) — overpaid ${d.over} AED`).join('\n')
      : '_None found._',
    '',
    `Full JSON: \`docs/MOYSKLAD_CUSTOMER_BALANCE_AUDIT_2026-06-11.json\``,
    '',
    '## Script',
    '',
    '`scripts/moysklad-audit-customer-balances-20260611.js`',
    '',
  ].join('\n')

  fs.writeFileSync(mdPath, md)

  if (JSON_OUT) {
    console.log(JSON.stringify(summary, null, 2))
    return
  }

  console.log('====================================================================')
  console.log('  MoySklad customer balance audit')
  console.log('====================================================================')
  console.log(`  As of: ${summary.asOf}`)
  console.log(`  We owe customer (overpaid): ${summary.totals.weOweCustomers}`)
  console.log(`  Customer owes us:           ${summary.totals.customersOweUs}`)
  console.log(`  Consignment unpaid ships:   ${summary.totals.consignmentCustomersWithUnpaidShipments}`)
  console.log(`  Duplicate inv+ship:         ${summary.totals.duplicateInvoiceShipmentPairs}`)
  console.log(`  Overpaid docs:              ${summary.totals.overpaidDocuments}`)
  console.log(`\n  Report: docs/MOYSKLAD_CUSTOMER_BALANCE_AUDIT_2026-06-11.md`)
  console.log(`  JSON:   docs/MOYSKLAD_CUSTOMER_BALANCE_AUDIT_2026-06-11.json`)

  if (summary.weOweTop25.length) {
    console.log('\n  We owe customer:')
    for (const r of summary.weOweTop25) {
      console.log(`    ${r.name.padEnd(42)} ${r.balanceAed.padStart(10)} AED`)
    }
  }

  console.log('\n  Top 10 debt (they owe us):')
  for (const r of summary.theyOweTop25.slice(0, 10)) {
    console.log(`    ${r.name.padEnd(42)} ${r.balanceAed.padStart(10)} AED`)
  }

  if (duplicatePairs.length) {
    console.log('\n  ⚠ Duplicate unpaid invoice+shipment (fix these):')
    for (const d of duplicatePairs.slice(0, 8)) {
      console.log(`    ${d.agent}: ${d.invoice} + ${d.shipment} @ ${d.amount}`)
    }
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
