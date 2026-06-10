#!/usr/bin/env node

/**
 * DM GME 260513 — replace Postcream box (00039 ×7) with loose 20g (00038 ×84)
 * across PO → supplier invoice → supply → payment chain.
 *
 *   node --import dotenv/config scripts/moysklad-modify-po-dts-260513-postcream-box-to-loose-20260610.js
 *   node --import dotenv/config scripts/moysklad-modify-po-dts-260513-postcream-box-to-loose-20260610.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const { uaeToday } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const MARKER = `DM-GME-260513-POSTCREAM-BOX-TO-LOOSE-${uaeToday()}`

const PO_ID = '5521fcbb-5466-11f1-0a80-0b2a0023de1d'
const INVOICE_ID = '62a46c92-5780-11f1-0a80-1b7c00251bab'
const SUPPLY_ID = '581e3e1d-5781-11f1-0a80-04f500247c11'
const PAYMENT_ID = '63148935-5781-11f1-0a80-076a00242076'

const BOX_CODE = '00039'
const BOX_ID = 'ebb38e3d-42b8-11ea-0a80-0475000baa7d'
const LOOSE_CODE = '00038'
const LOOSE_ID = 'bc185527-42b8-11ea-0a80-0095000bf07a'

const BOX_QTY = 7
const LOOSE_QTY = 84
const VIALS_PER_BOX = 12
const TARGET_SUM_MINOR = 5175590

const DOC_TYPES = [
  { key: 'po', entity: 'purchaseorder', id: PO_ID, label: 'PO DM GME 260513' },
  { key: 'invoice', entity: 'invoicein', id: INVOICE_ID, label: 'Invoice 00171' },
  { key: 'supply', entity: 'supply', id: SUPPLY_ID, label: 'Supply 00183' },
]

async function api(method, pathStr, body) {
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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
  return text ? JSON.parse(text) : null
}

async function fetchAll(pathStr) {
  const rows = []
  let offset = 0
  while (true) {
    const sep = pathStr.includes('?') ? '&' : '?'
    const data = await api('GET', `${pathStr}${sep}limit=1000&offset=${offset}`)
    rows.push(...(data.rows || []))
    if ((data.rows || []).length < 1000) break
    offset += 1000
  }
  return rows
}

function href(type, id) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

function lineTotalMinor(qty, priceMinor) {
  return Math.round(qty * priceMinor)
}

/** Exact 84-pc line total matching 7×box buyPrice — split 70@1866 + 14@1865. */
function buildLoosePositions(boxPriceMinor) {
  const targetTotal = BOX_QTY * boxPriceMinor
  const priceHigh = Math.ceil(boxPriceMinor / VIALS_PER_BOX)
  const priceLow = Math.floor(boxPriceMinor / VIALS_PER_BOX)
  let qtyHigh = -1
  for (let q = 0; q <= LOOSE_QTY; q++) {
    const total = q * priceHigh + (LOOSE_QTY - q) * priceLow
    if (total === targetTotal) {
      qtyHigh = q
      break
    }
  }
  if (qtyHigh < 0) {
    throw new Error(`Cannot split ${LOOSE_QTY} pcs to exact total ${targetTotal} minor`)
  }
  const qtyLow = LOOSE_QTY - qtyHigh
  const lines = []
  if (qtyHigh > 0) lines.push({ quantity: qtyHigh, price: priceHigh })
  if (qtyLow > 0) lines.push({ quantity: qtyLow, price: priceLow })
  return { lines, targetTotal, priceHigh, priceLow, qtyHigh, qtyLow }
}

async function readDocPositions(entity, id) {
  const positions = await fetchAll(`/entity/${entity}/${id}/positions?expand=assortment`)
  return positions.map((p) => ({
    id: p.id,
    code: p.assortment?.code,
    productId: p.assortment?.meta?.href?.split('/').pop(),
    name: p.assortment?.name,
    qty: Number(p.quantity),
    price: Number(p.price),
    lineMinor: lineTotalMinor(p.quantity, p.price),
  }))
}

function summarizePostcream(lines) {
  const box = lines.filter((l) => l.code === BOX_CODE)
  const loose = lines.filter((l) => l.code === LOOSE_CODE)
  const boxQty = box.reduce((s, l) => s + l.qty, 0)
  const looseQty = loose.reduce((s, l) => s + l.qty, 0)
  const boxMinor = box.reduce((s, l) => s + l.lineMinor, 0)
  const looseMinor = loose.reduce((s, l) => s + l.lineMinor, 0)
  return { box, loose, boxQty, looseQty, boxMinor, looseMinor }
}

function printPostcream(label, summary) {
  console.log(`\n  ${label}:`)
  if (summary.box.length) {
    for (const l of summary.box) {
      console.log(`    ${BOX_CODE} ×${l.qty} @ ${money(l.price)} = ${money(l.lineMinor)} AED  (pos ${l.id})`)
    }
  } else {
    console.log(`    ${BOX_CODE}: (none)`)
  }
  if (summary.loose.length) {
    for (const l of summary.loose) {
      console.log(`    ${LOOSE_CODE} ×${l.qty} @ ${money(l.price)} = ${money(l.lineMinor)} AED  (pos ${l.id})`)
    }
    console.log(`    → loose total: ${summary.looseQty} pcs / ${money(summary.looseMinor)} AED`)
  } else {
    console.log(`    ${LOOSE_CODE}: (none)`)
  }
}

async function fetchStock(codes) {
  const rows = await fetchAll('/report/stock/all?stockMode=all')
  const map = new Map()
  for (const row of rows) {
    if (codes.includes(row.code)) {
      map.set(row.code, {
        stock: Number(row.stock || 0),
        reserve: Number(row.reserve || 0),
        available: Number(row.stock || 0) - Number(row.reserve || 0),
      })
    }
  }
  for (const code of codes) {
    if (!map.has(code)) map.set(code, { stock: 0, reserve: 0, available: 0 })
  }
  return map
}

async function setApplicable(entity, id, applicable, meta) {
  return api('PUT', `/entity/${entity}/${id}`, { meta, applicable })
}

async function replacePositionsOnDoc(entity, id, boxPosIds, loosePlan) {
  for (const posId of boxPosIds) {
    await api('DELETE', `/entity/${entity}/${id}/positions/${posId}`)
  }
  for (const line of loosePlan.lines) {
    await api('POST', `/entity/${entity}/${id}/positions`, {
      quantity: line.quantity,
      price: line.price,
      assortment: href('product', LOOSE_ID),
      vat: 0,
      vatEnabled: false,
    })
  }
}

async function verifyDoc(entity, id, label, loosePlan) {
  const doc = await api('GET', `/entity/${entity}/${id}`)
  const lines = await readDocPositions(entity, id)
  const pc = summarizePostcream(lines)
  if (pc.boxQty !== 0) throw new Error(`${label}: still has ${BOX_CODE} qty ${pc.boxQty}`)
  if (pc.looseQty !== LOOSE_QTY) {
    throw new Error(`${label}: ${LOOSE_CODE} qty ${pc.looseQty} ≠ ${LOOSE_QTY}`)
  }
  if (pc.looseMinor !== loosePlan.targetTotal) {
    throw new Error(
      `${label}: loose line total ${money(pc.looseMinor)} ≠ ${money(loosePlan.targetTotal)}`
    )
  }
  if (doc.sum !== TARGET_SUM_MINOR) {
    throw new Error(`${label}: sum ${money(doc.sum)} ≠ ${money(TARGET_SUM_MINOR)}`)
  }
  return { doc, lines, pc }
}

async function main() {
  console.log('════════════════════════════════════════════════════════════════════')
  console.log('  DM GME 260513 — Postcream box → loose 20g (full purchase chain)')
  console.log('════════════════════════════════════════════════════════════════════')
  console.log(`  Mode: ${COMMIT ? 'COMMIT (live)' : 'DRY RUN'}`)

  const boxProduct = await api('GET', `/entity/product/${BOX_ID}`)
  const boxPriceMinor = boxProduct.buyPrice?.value ?? 0
  if (!boxPriceMinor) throw new Error(`${BOX_CODE} buyPrice missing`)

  const loosePlan = buildLoosePositions(boxPriceMinor)
  console.log(`\n  Box buyPrice: ${money(boxPriceMinor)} AED`)
  console.log(`  Replace: ${BOX_QTY}×${BOX_CODE} → ${LOOSE_QTY}×${LOOSE_CODE}`)
  console.log(
    `  Loose pricing: ${loosePlan.qtyHigh}×${money(loosePlan.priceHigh)} + ${loosePlan.qtyLow}×${money(loosePlan.priceLow)} = ${money(loosePlan.targetTotal)} AED (exact)`
  )

  const stockBefore = await fetchStock([BOX_CODE, LOOSE_CODE])
  console.log('\n  Warehouse stock (before):')
  for (const code of [BOX_CODE, LOOSE_CODE]) {
    const s = stockBefore.get(code)
    console.log(`    ${code}: on hand ${s.stock}, reserve ${s.reserve}, available ${s.available}`)
  }

  const snapshots = {}
  for (const d of DOC_TYPES) {
    const doc = await api('GET', `/entity/${d.entity}/${d.id}`)
    const lines = await readDocPositions(d.entity, d.id)
    snapshots[d.key] = { doc, lines, pc: summarizePostcream(lines) }
    console.log(`\n  ${d.label} | id ${d.id}`)
    console.log(`    sum ${money(doc.sum)} AED | applicable ${doc.applicable}`)
    printPostcream('  positions', snapshots[d.key].pc)
    if (snapshots[d.key].pc.boxQty !== BOX_QTY) {
      throw new Error(`${d.label}: expected ${BOX_QTY}×${BOX_CODE}, found ${snapshots[d.key].pc.boxQty}`)
    }
    if (snapshots[d.key].pc.looseQty !== 0) {
      throw new Error(`${d.label}: unexpected ${LOOSE_CODE} qty ${snapshots[d.key].pc.looseQty}`)
    }
    if (doc.sum !== TARGET_SUM_MINOR) {
      throw new Error(`${d.label}: sum ${money(doc.sum)} ≠ ${money(TARGET_SUM_MINOR)}`)
    }
  }

  const payment = await api('GET', `/entity/paymentout/${PAYMENT_ID}`)
  console.log(`\n  Payment 00606 | id ${PAYMENT_ID}`)
  console.log(`    sum ${money(payment.sum)} AED | applicable ${payment.applicable}`)
  if (payment.sum !== TARGET_SUM_MINOR) {
    throw new Error(`Payment sum ${money(payment.sum)} ≠ ${money(TARGET_SUM_MINOR)}`)
  }

  if (!COMMIT) {
    console.log('\n  Would (reverse order):')
    console.log('    1) Unpost payment 00606')
    console.log('    2) Unpost supply 00183')
    console.log('    3) Unpost invoice 00171')
    console.log('    4) Replace positions on PO, invoice, supply')
    console.log('    5) Repost invoice → supply → payment')
    console.log(`\n  After: ${LOOSE_QTY}×${LOOSE_CODE}, no ${BOX_CODE}, sum ${money(TARGET_SUM_MINOR)} on all docs`)
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  // Unpost chain (payment → supply → invoice)
  if (payment.applicable) {
    await setApplicable('paymentout', PAYMENT_ID, false, payment.meta)
    console.log('\n  ✓ Unposted payment 00606')
  }
  if (snapshots.supply.doc.applicable) {
    await setApplicable('supply', SUPPLY_ID, false, snapshots.supply.doc.meta)
    console.log('  ✓ Unposted supply 00183')
  }
  if (snapshots.invoice.doc.applicable) {
    await setApplicable('invoicein', INVOICE_ID, false, snapshots.invoice.doc.meta)
    console.log('  ✓ Unposted invoice 00171')
  }

  for (const d of DOC_TYPES) {
    const boxPosIds = snapshots[d.key].lines.filter((l) => l.code === BOX_CODE).map((l) => l.id)
    await replacePositionsOnDoc(d.entity, d.id, boxPosIds, loosePlan)
    console.log(`  ✓ Replaced positions on ${d.label}`)
  }

  const po = await api('GET', `/entity/purchaseorder/${PO_ID}`)
  await api('PUT', `/entity/purchaseorder/${PO_ID}`, {
    meta: po.meta,
    description: [
      po.description || '',
      MARKER,
      `GCCR07 corrected: ${BOX_QTY}×${BOX_CODE} box → ${LOOSE_QTY}×${LOOSE_CODE} loose 20g (${loosePlan.qtyHigh}@${money(loosePlan.priceHigh)} + ${loosePlan.qtyLow}@${money(loosePlan.priceLow)} for exact line total).`,
    ].join('\n'),
  })

  const inv = await api('GET', `/entity/invoicein/${INVOICE_ID}`)
  await setApplicable('invoicein', INVOICE_ID, true, inv.meta)
  console.log('  ✓ Reposted invoice 00171')

  const sup = await api('GET', `/entity/supply/${SUPPLY_ID}`)
  await setApplicable('supply', SUPPLY_ID, true, sup.meta)
  console.log('  ✓ Reposted supply 00183')

  const pay = await api('GET', `/entity/paymentout/${PAYMENT_ID}`)
  await setApplicable('paymentout', PAYMENT_ID, true, pay.meta)
  console.log('  ✓ Reposted payment 00606')

  console.log('\n  Verification:')
  for (const d of DOC_TYPES) {
    const v = await verifyDoc(d.entity, d.id, d.label, loosePlan)
    printPostcream(`  ${d.label} after`, v.pc)
    console.log(`    sum ${money(v.doc.sum)} AED ✓`)
  }
  const payAfter = await api('GET', `/entity/paymentout/${PAYMENT_ID}`)
  if (payAfter.sum !== TARGET_SUM_MINOR) {
    throw new Error(`Payment after: sum ${money(payAfter.sum)}`)
  }
  console.log(`  Payment 00606 sum ${money(payAfter.sum)} AED ✓`)

  const stockAfter = await fetchStock([BOX_CODE, LOOSE_CODE])
  console.log('\n  Warehouse stock (after repost):')
  for (const code of [BOX_CODE, LOOSE_CODE]) {
    const b = stockBefore.get(code)
    const a = stockAfter.get(code)
    const delta = a.stock - b.stock
    console.log(
      `    ${code}: ${b.stock} → ${a.stock} (Δ ${delta >= 0 ? '+' : ''}${delta}) | available ${a.available}`
    )
  }
  console.log(
    '\n  Stock note: supply repost books +84 loose / −7 boxes from this receipt. If boxes were already unpacked for sales (loss/enter), on-hand may still need manual reconciliation.'
  )
  console.log(`\n  Marker: ${MARKER}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
