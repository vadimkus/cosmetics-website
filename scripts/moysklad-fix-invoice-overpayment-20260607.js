#!/usr/bin/env node

/**
 * Fix retail invoice overpayment when paymentin linkedSum > invoice.sum.
 *
 * Root cause pattern: shipment (demand) sum exceeds invoice sum (qty/product mismatch),
 * but payment was linked to the full demand amount → invoice payedSum > sum → we "owe" customer.
 *
 * Fix:
 *   1. Align demand positions with invoice (optional --skip-demand to payment-only)
 *   2. PUT paymentin: sum + operations[].linkedSum = invoice.sum
 *
 * Cases (2026-06-07):
 *   Miss Angelina Tarasova — invoice 03533, +54 AED (demand qty 10 vs invoice 7 on collagen mask)
 *   Marapo Beauty Salon — invoice 04044, +30 AED (demand 4× cleanser vs invoice 1× cleanser + 3× toner)
 *
 *   node --import dotenv/config scripts/moysklad-fix-invoice-overpayment-20260607.js
 *   node --import dotenv/config scripts/moysklad-fix-invoice-overpayment-20260607.js --commit
 *   node --import dotenv/config scripts/moysklad-fix-invoice-overpayment-20260607.js --commit --only=03533
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
const SKIP_DEMAND = process.argv.includes('--skip-demand')
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').split('=')[1] || null

const GAP_MS = 80
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/** Pre-resolved from audit 2026-06-11 */
const CASES = [
  {
    label: 'Miss Angelina Tarasova',
    invoiceName: '03533',
    invoiceId: 'b85417a3-4f7a-11f0-0a80-11e90021fa56',
    demandId: 'd7798ae1-4f7b-11f0-0a80-10370022e61a',
    paymentId: '0a62561a-4f7c-11f0-0a80-18910023e478',
    agentId: '8ea1a7fc-4f79-11f0-0a80-00c500235347',
    /** demand position id → patch */
    demandPatches: [{ positionId: 'd7799ba9-4f7b-11f0-0a80-10370022e61b', quantity: 7 }],
    invoicePatches: [{ positionId: 'b8542079-4f7a-11f0-0a80-11e90021fa57', quantity: 7 }],
  },
  {
    label: 'Marapo Beauty Salon, The Face Only BlueWaters',
    invoiceName: '04044',
    invoiceId: 'aaf32223-f2d7-11f0-0a80-1af5000eba69',
    demandId: 'b79da02c-f2d7-11f0-0a80-1077000e91cb',
    paymentId: '00dbb937-02b0-11f1-0a80-04fe00000eb0',
    agentId: 'a25f2da0-4acd-11ed-0a80-03d90007967b',
    /** Replace demand lines to mirror invoice 04044 */
    demandFromInvoice: true,
    demandPositionIds: ['b79da503-f2d7-11f0-0a80-1077000e91cc', 'b79da6cd-f2d7-11f0-0a80-1077000e91cd'],
    invoicePositionIds: ['aaf329e9-f2d7-11f0-0a80-1af5000eba6b', 'fdf1f96c-f2dc-11f0-0a80-0751001cbf32'],
  },
]

async function api(method, pathStr, body) {
  await sleep(GAP_MS)
  const res = await fetch(pathStr.startsWith('http') ? pathStr : API + pathStr, {
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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
  return text ? JSON.parse(text) : null
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

function positionPayload(p) {
  return {
    quantity: p.quantity,
    price: p.price,
    discount: p.discount || 0,
    vat: p.vat,
    vatEnabled: p.vatEnabled,
    assortment: p.assortment,
  }
}

async function customerBalance(agentId) {
  async function fetchAll(entityPath) {
    const rows = []
    let offset = 0
    while (true) {
      const sep = entityPath.includes('?') ? '&' : '?'
      const data = await api('GET', `${entityPath}${sep}limit=1000&offset=${offset}`)
      rows.push(...(data.rows || []))
      if ((data.rows || []).length < 1000) break
      offset += 1000
    }
    return rows
  }

  const agentFilter = encodeURIComponent(`${API}/entity/counterparty/${agentId}`)
  const [invoices, reports, returns] = await Promise.all([
    fetchAll(`/entity/invoiceout?filter=agent=${agentFilter};applicable=true`),
    fetchAll(`/entity/commissionreportin?filter=agent=${agentFilter};applicable=true`),
    fetchAll(`/entity/salesreturn?filter=agent=${agentFilter};applicable=true`),
  ])

  let balance = 0
  for (const inv of invoices) balance += (inv.payedSum || 0) - (inv.sum || 0)
  for (const rep of reports) balance += (rep.payedSum || 0) - (rep.sum || 0)
  for (const ret of returns) balance += (ret.sum || 0) - (ret.payedSum || 0)
  return balance
}

async function patchPositions(entityType, docId, patches, rows, label) {
  for (const p of patches) {
    const row = rows.find((r) => r.id === p.positionId)
    console.log(
      `    ${label} ${p.positionId.slice(0, 8)}… ${row?.assortment?.name || ''}: qty ${row?.quantity} → ${p.quantity}`
    )
    if (COMMIT) {
      await api('PUT', `/entity/${entityType}/${docId}/positions/${p.positionId}`, {
        ...positionPayload(row),
        quantity: p.quantity,
      })
    }
  }
}

async function fixDemandFromInvoice(c, invPositions, demPositionIds) {
  const invRows = invPositions.rows
  if (invRows.length !== demPositionIds.length) {
    throw new Error(
      `Position count mismatch invoice ${invRows.length} vs demand slots ${demPositionIds.length}`
    )
  }
  for (let i = 0; i < invRows.length; i++) {
    const patch = positionPayload(invRows[i])
    console.log(
      `    demand position ${demPositionIds[i].slice(0, 8)}… → qty ${patch.quantity} @ ${money(patch.price)}`
    )
    if (COMMIT) {
      await api('PUT', `/entity/demand/${c.demandId}/positions/${demPositionIds[i]}`, patch)
    }
  }
}

async function processCase(c) {
  console.log(`\n${'='.repeat(72)}`)
  console.log(`  ${c.label} — invoice ${c.invoiceName}`)
  console.log(`${'='.repeat(72)}`)

  const inv = await api('GET', `/entity/invoiceout/${c.invoiceId}?expand=positions.assortment`)
  const dem = await api('GET', `/entity/demand/${c.demandId}?expand=positions.assortment`)
  const pay = await api('GET', `/entity/paymentin/${c.paymentId}?expand=operations`)

  const payLinked = pay.operations?.[0]?.linkedSum || 0
  const overMinor = (inv.payedSum || 0) - (inv.sum || 0)

  console.log(`  Invoice ${inv.name}: sum ${money(inv.sum)} | payedSum ${money(inv.payedSum)} | delta ${money(overMinor)}`)
  console.log(`  Demand ${dem.name}: sum ${money(dem.sum)} | payedSum ${money(dem.payedSum)}`)
  console.log(`  Payment ${pay.name}: sum ${money(pay.sum)} | linked ${money(payLinked)}`)

  if (overMinor === 0 && pay.sum === inv.sum && payLinked === inv.sum && dem.sum === inv.sum) {
    console.log('  ✓ Already balanced — skip')
    return { skipped: true, balanceBefore: 0, balanceAfter: 0 }
  }

  if (overMinor > 0) {
    console.log('\n  Root cause: payment linked to demand total exceeds invoice total')
  } else if (overMinor < 0) {
    console.log('\n  Root cause: invoice sum exceeds payedSum (lines out of sync with shipment/payment)')
  }
  console.log('  (demand shipment sum ≠ invoice sum — qty/product mismatch at booking)')

  if (!SKIP_DEMAND) {
    console.log('\n  Step 1 — align documents with invoice lines:')
    if (c.invoicePatches?.length) {
      await patchPositions('invoiceout', c.invoiceId, c.invoicePatches, inv.positions.rows, 'invoice')
    }
    if (c.demandPatches?.length) {
      await patchPositions('demand', c.demandId, c.demandPatches, dem.positions.rows, 'demand')
    } else if (c.demandFromInvoice) {
      await fixDemandFromInvoice(c, inv.positions, c.demandPositionIds)
    }
  } else {
    console.log('\n  Step 1 — skipped (--skip-demand)')
  }

  // Re-read invoice after position edits
  const invFresh = COMMIT && !SKIP_DEMAND
    ? await api('GET', `/entity/invoiceout/${c.invoiceId}`)
    : inv

  const targetMinor = invFresh.sum
  const demandHref = `${API}/entity/demand/${c.demandId}`

  console.log(`\n  Step 2 — payment ${pay.name}: sum + linkedSum → ${money(targetMinor)} AED`)
  if (COMMIT) {
    await api('PUT', `/entity/paymentin/${c.paymentId}`, {
      sum: targetMinor,
      operations: [
        {
          meta: {
            href: demandHref,
            type: 'demand',
            mediaType: 'application/json',
          },
          linkedSum: targetMinor,
        },
      ],
    })
  }

  const balanceBefore = await customerBalance(c.agentId)

  let invAfter = inv
  let demAfter = dem
  if (COMMIT) {
    invAfter = await api('GET', `/entity/invoiceout/${c.invoiceId}`)
    demAfter = await api('GET', `/entity/demand/${c.demandId}`)
  }

  const balanceAfter = COMMIT ? await customerBalance(c.agentId) : balanceBefore - overMinor

  console.log('\n  Verification:')
  console.log(`    Invoice payedSum: ${money(invAfter.payedSum)} / ${money(invAfter.sum)}`)
  console.log(`    Demand payedSum:  ${money(demAfter.payedSum)} / ${money(demAfter.sum)}`)
  console.log(`    Customer balance: ${money(balanceBefore)} → ${money(balanceAfter)} AED`)

  if (COMMIT && Math.abs(balanceAfter) > 100) {
    throw new Error(`Balance not settled after fix: ${money(balanceAfter)} AED (target ±1 AED)`)
  }

  return {
    skipped: false,
    overAed: money(Math.abs(overMinor) || Math.abs((invFresh.sum || 0) - (pay.sum || 0))),
    balanceBefore: money(balanceBefore),
    balanceAfter: money(balanceAfter),
    invoiceId: c.invoiceId,
    demandId: c.demandId,
    paymentId: c.paymentId,
  }
}

async function main() {
  const cases = ONLY ? CASES.filter((c) => c.invoiceName === ONLY) : CASES
  if (!cases.length) {
    console.error(`No case for --only=${ONLY}`)
    process.exit(1)
  }

  console.log(COMMIT ? 'MODE: COMMIT' : 'MODE: dry-run (add --commit to apply)')

  const results = []
  for (const c of cases) {
    results.push(await processCase(c))
  }

  console.log('\n' + '='.repeat(72))
  console.log('  Summary')
  console.log('='.repeat(72))
  for (const r of results) {
    if (r.skipped) continue
    console.log(`  Fixed overpayment ${r.overAed} AED | balance ${r.balanceBefore} → ${r.balanceAfter}`)
  }
  if (!COMMIT) console.log('\n  Re-run with --commit to apply.')
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
